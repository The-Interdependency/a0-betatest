# === RATIOS ===
# id: loc_comments
#   summary: lines of code to lines commented
#   value: 196:58
#   basis: ratios_runner.compute_loc_comments
#
# id: imports_exports
#   summary: import statements to public exports
#   value: 8:3
#   basis: ratios_runner.compute_imports_exports
#
# id: calls_definitions
#   summary: call sites to definitions
#   value: 28:9
#   basis: ratios_runner.compute_calls_definitions
# === END RATIOS ===
# === MODULE_BUILD ===
# id: zfae_runtime
#   module_name: runtime
#   module_kind: engine
#   summary: ZFAERuntime — dispatches teacher_assisted vs zfae_native; never silently substitutes teacher output as native inference; carries reply_source + teacher_called + zfae_weights_updated flags
#   owner: Erin Spencer
#   public_surface: ZFAERuntime, RuntimeMode, RuntimeReply, MISSING_NATIVE_MESSAGE
#   internal_surface: _is_trained_enough
#   auth_boundary: none
#   storage_boundary: write
#   network_boundary: external
#   user_data_boundary: read
#   admin_only: false
#   tests: a0p_skills.contracts.zfae_runtime_reply_source_flag_holds, a0p_skills.contracts.zfae_native_refuses_when_untrained_holds
#   rollout: default_enabled
#   rollback: revert callers to A0ZFAEInferenceEngine.infer directly (mode-1 only)
#   no_silent_fallback: native mode NEVER returns teacher output relabeled as native
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: zfae_runtime_boundaries
#   summary: ZFAERuntime — dispatches teacher_assisted vs zfae_native; never silently substitutes teacher output as native inference; carries reply_source + teacher_called + zfae_weights_updated flags
#   auth_boundary: none
#   storage_boundary: write
#   network_boundary: external
#   user_data_boundary: read
#   admin_only: false
#   owner: Erin Spencer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: zfae_runtime
#   summary: ZFAERuntime — dispatches teacher_assisted vs zfae_native; never silently substitutes teacher output as native inference; carries reply_source + teacher_called + zfae_weights_updated flags
#   exposes: ZFAERuntime, RuntimeMode, RuntimeReply, MISSING_NATIVE_MESSAGE
#   boundaries: auth:none, storage:write, network:external, user_data:read
#   owner: Erin Spencer
# === END CAPABILITIES ===
# === CONTRACTS ===
# id: zfae_runtime_reply_source_flag
#   given: per the module's declared behaviour
#   then: the named callable returns without raising
#   class: correctness
#   call: a0p_skills.contracts.zfae_runtime_reply_source_flag_holds
# === END CONTRACTS ===

# === CONTRACTS ===
# id: zfae_native_refuses_when_untrained
#   given: per the module's declared behaviour
#   then: the named callable returns without raising
#   class: correctness
#   call: a0p_skills.contracts.zfae_native_refuses_when_untrained_holds
# === END CONTRACTS ===
"""ZFAERuntime — dispatches teacher_assisted vs zfae_native modes."""
from __future__ import annotations
from dataclasses import dataclass, field, asdict
from enum import Enum
from typing import Any, Optional

import logging as _logging

_AUDIT_LOG = _logging.getLogger("a0p.zfae.audit")


from .inference import A0ZFAEInferenceEngine, MISSING_NATIVE_MESSAGE
from .weights import A0ZFAEWeightBank
from .trainer import ZFAELearner, TrainingResult
from .teacher import TeacherClient, TeacherInvocation, build_curated_context
from .sentinel_eval import evaluate as evaluate_sentinels, EventContext
from .sentinels import Verdict13, SentinelVerdict
from . import overrides as zfae_overrides
from . import fiq_emit


class RuntimeMode(str, Enum):
    TEACHER_ASSISTED = "teacher_assisted"
    ZFAE_NATIVE = "zfae_native"


@dataclass
class RuntimeReply:
    """Canonical reply shape — every chat turn carries these flags."""
    assistantText: str
    reply_source: str                  # "teacher_assisted" | "zfae_native" | "zfae_refused" | "zfae_halted"
    teacher_called: bool
    zfae_weights_updated: bool
    mode: str
    nextSnapshot: dict
    trace: dict = field(default_factory=dict)
    training_record_path: Optional[str] = None
    zfae_metrics: dict = field(default_factory=dict)
    pending_override_id: Optional[str] = None
    sentinel_verdict: Optional[dict] = None


def _is_trained_enough(bank: A0ZFAEWeightBank, *, min_steps: int = 16, max_loss: float = 0.1) -> bool:
    """Native-readiness threshold: enough teacher rounds + low enough loss
    AND every (core, seed) pair has been touched (471 = 157 × 3)."""
    if bank.zfae_last_loss is None:
        return False
    if bank.zfae_training_step < min_steps:
        return False
    if bank.zfae_last_loss > max_loss:
        return False
    return bank.all_seeds_touched


class ZFAERuntime:
    """Dispatcher — teacher_assisted (call teacher, train, return teacher's reply)
    or zfae_native (native engine only; refuse if not trained enough)."""

    def __init__(
        self,
        *,
        teacher_client: Optional[TeacherClient] = None,
        learner: Optional[ZFAELearner] = None,
        native_engine: Optional[A0ZFAEInferenceEngine] = None,
        min_steps_for_native: int = 16,
        max_loss_for_native: float = 0.1,
        pending_overrides_col=None,
        fiq_audit_col=None,
    ):
        self.teacher = teacher_client
        self.learner = learner or ZFAELearner()
        self.native = native_engine or A0ZFAEInferenceEngine()
        self.min_steps = int(min_steps_for_native)
        self.max_loss = float(max_loss_for_native)
        self.pending_overrides_col = pending_overrides_col
        self.fiq_audit_col = fiq_audit_col

    async def reply(
        self,
        *,
        mode: RuntimeMode,
        agent_id: str,
        user_id: str,
        bank: A0ZFAEWeightBank,
        raw_prompt: str,
        transcript: Optional[list[dict]] = None,
        teacher_model_id: Optional[str] = None,
        system_prompt: str = "",
        persona: str = "",
        ring_summary: Optional[dict] = None,
        user_feedback: Optional[Any] = None,
        zfae_snapshot: Optional[dict] = None,
        sentinel_modes: Optional[dict] = None,
        sentinel_weights: Optional[dict] = None,
        override_id: Optional[str] = None,
    ) -> RuntimeReply:
        """Produce one chat-turn reply per the requested mode.

        If sentinels flag the request and there is no approved override_id, return
        a halt reply (reply_source='zfae_halted') with a pending_override_id.
        """
        zfae_snapshot = zfae_snapshot or {}

        # ---- Sentinel halt gate -------------------------------------------------
        verdict, override_rec = await self._sentinel_gate(
            agent_id=agent_id, user_id=user_id, mode=mode, raw_prompt=raw_prompt,
            transcript=transcript, bank=bank,
            sentinel_modes=sentinel_modes, sentinel_weights=sentinel_weights,
            override_id=override_id,
        )
        if override_rec is not None:
            return RuntimeReply(
                assistantText="a0(zfae) halted by sentinels — explicit user override required.",
                reply_source="zfae_halted",
                teacher_called=False,
                zfae_weights_updated=False,
                mode=mode.value,
                nextSnapshot=zfae_snapshot,
                trace={
                    "halt_reason": "sentinels_flagged",
                    "flagged_sentinels": list(verdict.flagged_sentinels),
                    "blocking_cliff": verdict.blocking_cliff,
                },
                pending_override_id=override_rec.id,
                sentinel_verdict=_verdict_to_dict(verdict),
                zfae_metrics=self._metrics(bank),
            )

        if mode == RuntimeMode.TEACHER_ASSISTED:
            reply_obj = await self._teacher_assisted(
                agent_id=agent_id, user_id=user_id, bank=bank,
                raw_prompt=raw_prompt, transcript=transcript,
                teacher_model_id=teacher_model_id,
                system_prompt=system_prompt, persona=persona,
                ring_summary=ring_summary, user_feedback=user_feedback,
                zfae_snapshot=zfae_snapshot,
            )
        elif mode == RuntimeMode.ZFAE_NATIVE:
            reply_obj = self._zfae_native(
                bank=bank, raw_prompt=raw_prompt, transcript=transcript,
                zfae_snapshot=zfae_snapshot,
            )
        else:
            raise ValueError(f"unknown mode {mode!r}")

        reply_obj.sentinel_verdict = _verdict_to_dict(verdict) if verdict else None

        # ---- FIQ emit: chat_reply -----------------------------------------------
        await self._fiq_emit_chat_reply(agent_id, user_id, reply_obj, verdict)
        return reply_obj

    async def _sentinel_gate(
        self, *, agent_id, user_id, mode, raw_prompt, transcript, bank,
        sentinel_modes, sentinel_weights, override_id,
    ) -> tuple[Optional[Verdict13], Optional[Any]]:
        """Evaluate sentinels; create a PendingOverride if any flagged and no approved override_id.

        Returns (verdict, override_record_or_none). override_record_or_none is non-None
        iff this turn must halt (i.e. flagged and no approved override).
        """
        ctx = EventContext(
            kind="chat_reply",
            agent_id=agent_id, user_id=user_id,
            raw_request={"prompt": raw_prompt, "mode": mode.value},
            agent_sheet_modes=sentinel_modes,
            agent_sheet_weights=sentinel_weights,
            transcript_len=len(transcript or []),
            last_loss=bank.zfae_last_loss,
            training_step=bank.zfae_training_step,
        )
        verdict = evaluate_sentinels(ctx)

        # FIQ emit: sentinel_verdict (always — observe events count too)
        if self.fiq_audit_col is not None:
            try:
                await fiq_emit.emit(
                    self.fiq_audit_col,
                    event_type="zfae_sentinel_verdict",
                    agent_id=agent_id, user_id=user_id,
                    payload={
                        "flagged": list(verdict.flagged_sentinels),
                        "blocking_cliff": verdict.blocking_cliff,
                        "vector": list(verdict.vector),
                    },
                )
            except Exception as _e:
                _AUDIT_LOG.warning("fiq audit emit failed: %s", _e)

        if not verdict.requires_override:
            return verdict, None

        # If caller provided an approved override_id, allow execution.
        if override_id and self.pending_overrides_col is not None:
            rec = await zfae_overrides.get(self.pending_overrides_col, override_id)
            if rec is not None and rec.status == "approved" and rec.agent_id == agent_id:
                return verdict, None

        # No approved override — must halt. Create one.
        if self.pending_overrides_col is None:
            # No persistence; cannot create override. Halt with a synthetic record.
            return verdict, _EphemeralOverride(
                id="ephemeral",
                agent_id=agent_id,
                flagged=list(verdict.flagged_sentinels),
                blocking_cliff=verdict.blocking_cliff,
            )

        reasons = {v.name: v.reason for v in verdict.verdicts if v.flagged}
        rec = await zfae_overrides.create_override(
            self.pending_overrides_col,
            agent_id=agent_id, user_id=user_id, event_kind="chat_reply",
            raw_request={"prompt": raw_prompt, "mode": mode.value},
            flagged_sentinels=list(verdict.flagged_sentinels),
            reasons=reasons,
            verdict_vector=list(verdict.vector),
            disabled_sentinels=list(verdict.disabled_sentinels),
            blocking_cliff=bool(verdict.blocking_cliff),
        )
        if self.fiq_audit_col is not None:
            try:
                await fiq_emit.emit(
                    self.fiq_audit_col,
                    event_type="zfae_override_created",
                    agent_id=agent_id, user_id=user_id,
                    payload={"override_id": rec.id, "flagged": list(verdict.flagged_sentinels)},
                )
            except Exception as _e:
                _AUDIT_LOG.warning("fiq audit emit failed: %s", _e)
        return verdict, rec

    async def _fiq_emit_chat_reply(self, agent_id, user_id, reply_obj, verdict):
        if self.fiq_audit_col is None:
            return
        try:
            await fiq_emit.emit(
                self.fiq_audit_col,
                event_type="zfae_chat_reply",
                agent_id=agent_id, user_id=user_id,
                payload={
                    "reply_source": reply_obj.reply_source,
                    "teacher_called": reply_obj.teacher_called,
                    "zfae_weights_updated": reply_obj.zfae_weights_updated,
                    "mode": reply_obj.mode,
                    "training_step": reply_obj.zfae_metrics.get("zfae_training_step"),
                },
            )
        except Exception as _e:
            _AUDIT_LOG.warning("fiq audit emit failed: %s", _e)

    async def _teacher_assisted(
        self, *, agent_id, user_id, bank, raw_prompt, transcript,
        teacher_model_id, system_prompt, persona, ring_summary,
        user_feedback, zfae_snapshot,
    ) -> RuntimeReply:
        if self.teacher is None or not teacher_model_id:
            # No teacher configured — fall through to native refusal (NOT silent fallback).
            return self._zfae_native(
                bank=bank, raw_prompt=raw_prompt, transcript=transcript,
                zfae_snapshot=zfae_snapshot,
                extra_trace={"teacher_unavailable": True},
            )

        snapshot_before = dict(zfae_snapshot)
        ring_state_before = dict(ring_summary or {})

        messages = build_curated_context(
            system_prompt=system_prompt,
            persona=persona,
            transcript=transcript,
            prompt=raw_prompt,
            ring_summary=ring_summary,
        )
        teacher: TeacherInvocation = await self.teacher.invoke(
            user_id=user_id, teacher_model_id=teacher_model_id, messages=messages,
        )

        weights_updated = False
        training_loss: Optional[float] = None
        training_step_before = bank.zfae_training_step

        # ---- Demo quota gate (Emergent shared key only) ------------------------
        try:
            from api_extensions import check_demo_quota, record_demo_usage
            # Project ~500 tokens per teacher round-trip (heuristic).
            quota = await check_demo_quota(user_id, projected_tokens=500)
            if not quota["fits"]:
                return RuntimeReply(
                    assistantText=("Daily demo budget exhausted "
                                   f"({quota['used']}/{quota['budget']} tokens). "
                                   "Bring your own key on /keys or wait until 00:00 UTC."),
                    reply_source="zfae_refused",
                    teacher_called=False,
                    zfae_weights_updated=False,
                    mode=RuntimeMode.TEACHER_ASSISTED.value,
                    nextSnapshot=zfae_snapshot,
                    trace={"reason": "demo_quota_exhausted", **quota},
                    zfae_metrics=self._metrics(bank),
                )
        except Exception as _e:
            _AUDIT_LOG.warning("fiq audit emit failed: %s", _e)
        if teacher.teacher_reply and not teacher.error:
            result: TrainingResult = self.learner.distill_step(
                bank, raw_prompt, teacher.teacher_reply,
            )
            weights_updated = result.weights_updated
            training_loss = result.loss
            bank.record_teacher(teacher.teacher_model_id)
            # Burn demo-quota tokens (best-effort)
            try:
                from api_extensions import record_demo_usage
                approx = (len(raw_prompt) + len(teacher.teacher_reply or "")) // 4
                await record_demo_usage(user_id, max(50, approx))
            except Exception as _e:
                _AUDIT_LOG.warning("fiq audit emit failed: %s", _e)
            # FIQ emit: training_step
            if self.fiq_audit_col is not None:
                try:
                    await fiq_emit.emit(
                        self.fiq_audit_col,
                        event_type="zfae_training_step",
                        agent_id=agent_id, user_id=user_id,
                        payload={
                            "core": result.core,
                            "seed_idx": result.seed_idx,
                            "loss": float(result.loss),
                            "intent_match": bool(result.intent_match),
                            "signature_mse": float(result.signature_mse),
                            "total_seeds_touched": int(result.total_seeds_touched),
                            "new_digest": result.new_digest,
                            "training_step": int(result.new_training_step),
                        },
                    )
                except Exception as _e:
                    _AUDIT_LOG.warning("fiq audit emit failed: %s", _e)

        # native engine produces nextSnapshot for state continuity
        native_result = self.native.infer(
            rawPrompt=raw_prompt,
            transcript=transcript,
            zfaeSnapshot=zfae_snapshot,
            rings={"summary": ring_summary} if ring_summary else None,
        )
        snapshot_after = native_result["nextSnapshot"]

        training_record_path = None
        if self.teacher and teacher.teacher_reply:
            training_record_path = self.teacher.write_training_record(
                agent_id=agent_id,
                raw_prompt=raw_prompt,
                transcript_context=messages,
                zfae_snapshot_before=snapshot_before,
                ring_state_before=ring_state_before,
                teacher=teacher,
                zfae_snapshot_after=snapshot_after,
                user_feedback=user_feedback,
            )

        return RuntimeReply(
            assistantText=teacher.teacher_reply or (teacher.error or ""),
            reply_source="teacher_assisted",
            teacher_called=True,
            zfae_weights_updated=weights_updated,
            mode=RuntimeMode.TEACHER_ASSISTED.value,
            nextSnapshot=snapshot_after,
            trace={
                "teacher_invocation": asdict(teacher),
                "training_loss": training_loss,
                "training_step_before": training_step_before,
                "training_step_after": bank.zfae_training_step,
            },
            training_record_path=training_record_path,
            zfae_metrics=self._metrics(bank),
        )

    def _zfae_native(
        self,
        *,
        bank: A0ZFAEWeightBank,
        raw_prompt: str,
        transcript,
        zfae_snapshot,
        extra_trace: Optional[dict] = None,
    ) -> RuntimeReply:
        extra_trace = extra_trace or {}
        ready = _is_trained_enough(bank, min_steps=self.min_steps, max_loss=self.max_loss)
        if not ready:
            return RuntimeReply(
                assistantText="a0(zfae) cannot perform native inference yet: "
                              "missing trained decoder / sufficient checkpoint / response policy.",
                reply_source="zfae_refused",
                teacher_called=False,
                zfae_weights_updated=False,
                mode=RuntimeMode.ZFAE_NATIVE.value,
                nextSnapshot=zfae_snapshot,
                trace={
                    "reason": "not_trained_enough",
                    "training_step": bank.zfae_training_step,
                    "min_steps_required": self.min_steps,
                    "last_loss": bank.zfae_last_loss,
                    "max_loss_required": self.max_loss,
                    "total_seeds_touched": bank.total_seeds_touched,
                    "all_seeds_touched": bank.all_seeds_touched,
                    **extra_trace,
                },
                zfae_metrics=self._metrics(bank),
            )
        # Trained enough — native engine produces the reply.
        native_result = self.native.infer(
            rawPrompt=raw_prompt,
            transcript=transcript,
            zfaeSnapshot=zfae_snapshot,
        )
        return RuntimeReply(
            assistantText=native_result["assistantText"]
                          if native_result["assistantText"] != MISSING_NATIVE_MESSAGE
                          else "a0(zfae) cannot perform native inference yet: "
                               "missing trained decoder / sufficient checkpoint / response policy.",
            reply_source="zfae_native",
            teacher_called=False,
            zfae_weights_updated=False,
            mode=RuntimeMode.ZFAE_NATIVE.value,
            nextSnapshot=native_result["nextSnapshot"],
            trace={**native_result["trace"], **extra_trace},
            zfae_metrics=self._metrics(bank),
        )

    def _metrics(self, bank: A0ZFAEWeightBank) -> dict:
        return {
            "zfae_weight_count": bank.zfae_weight_count,
            "zfae_checkpoint_digest": bank.zfae_checkpoint_digest,
            "zfae_training_step": bank.zfae_training_step,
            "zfae_last_loss": bank.zfae_last_loss,
        }


@dataclass
class _EphemeralOverride:
    """Synthetic override used when no pending_overrides collection is wired."""
    id: str
    agent_id: str
    flagged: list[str]
    blocking_cliff: bool
    status: str = "pending"


def _verdict_to_dict(verdict: Optional[Verdict13]) -> Optional[dict]:
    if verdict is None:
        return None
    return {
        "vector": list(verdict.vector),
        "flagged_sentinels": list(verdict.flagged_sentinels),
        "disabled_sentinels": list(verdict.disabled_sentinels),
        "blocking_cliff": bool(verdict.blocking_cliff),
        "verdicts": [
            {
                "name": v.name, "mode": v.mode.value, "weight": v.weight,
                "value": v.value, "flagged": v.flagged, "reason": v.reason,
            }
            for v in verdict.verdicts
        ],
    }
# === RATIOS ===
# id: loc_comments
#   summary: lines of code to lines commented
#   value: 196:58
#   basis: ratios_runner.compute_loc_comments
#
# id: imports_exports
#   summary: import statements to public exports
#   value: 8:3
#   basis: ratios_runner.compute_imports_exports
#
# id: calls_definitions
#   summary: call sites to definitions
#   value: 28:9
#   basis: ratios_runner.compute_calls_definitions
# === END RATIOS ===
