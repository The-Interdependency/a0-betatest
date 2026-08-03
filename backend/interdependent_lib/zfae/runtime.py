# ratios: loc_comments=398:104 imports_exports=17:3 calls_definitions=71:18
# === MODULE_BUILD ===
# id: zfae_runtime
#   module_name: runtime
#   module_kind: engine
#   summary: stable ZFAERuntime facade dispatches teacher-assisted vs native inference and resumes held actions only for the owning user's exact approved request chain
#   owner: Erin Spencer
#   public_surface: ZFAERuntime, RuntimeMode, RuntimeReply, MISSING_NATIVE_MESSAGE
#   internal_surface: _is_trained_enough, _sentinel_gate, _fiq_emit_tool_trace, fixed-path PCEA runtime mixin loader
#   auth_boundary: none
#   storage_boundary: write
#   network_boundary: external
#   user_data_boundary: write
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
#   user_data_boundary: write
#   admin_only: false
#   owner: Erin Spencer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: zfae_runtime
#   summary: ZFAERuntime — dispatches teacher_assisted vs zfae_native; never silently substitutes teacher output as native inference; carries reply_source + teacher_called + zfae_weights_updated flags
#   exposes: ZFAERuntime, RuntimeMode, RuntimeReply, MISSING_NATIVE_MESSAGE
#   boundaries: auth:none, storage:write, network:external, user_data:write
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

# === CONTRACTS ===
# id: zfae_runtime_override_owner_action_bound
#   given: a caller presents an approved chat override
#   then: execution resumes only for the same owner, agent, and canonical execution context
#   class: security
# id: zfae_runtime_chat_context_bound
#   given: model, system, transcript, tool surface, sentinel, snapshot, bank, or policy context changes
#   then: an earlier chat or staged-child approval cannot resume the changed execution
#   class: security
# === END CONTRACTS ===

# === CONTRACTS ===
# id: zfae_runtime_staged_override_resume
#   given: a consumed exact chat approval leads to a separately approved exact tool override
#   then: only one retried chat reaches the exact tool gate and the tool verdict remains visible
#   class: security
# id: zfae_runtime_tool_halt_verdict
#   given: a benign chat reaches a tool call that trips a cliff sentinel
#   then: the halted reply exposes the tool child's cliff verdict rather than the benign chat verdict
#   class: security
# === END CONTRACTS ===
"""ZFAERuntime — dispatches teacher_assisted vs zfae_native modes."""
from __future__ import annotations
from dataclasses import dataclass, field
from enum import Enum
from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path
from typing import Any, Optional

import logging as _logging
import sys

_AUDIT_LOG = _logging.getLogger("a0p.zfae.audit")


from .inference import A0ZFAEInferenceEngine, MISSING_NATIVE_MESSAGE
from .weights import A0ZFAEWeightBank
from .trainer import ZFAELearner
from .teacher import TeacherClient, build_curated_context
from .sentinel_eval import evaluate as evaluate_sentinels, EventContext
from .sentinels import Verdict13, SentinelVerdict
from . import overrides as zfae_overrides
from . import fiq_emit
from .native_tools import select_native_tool


def _load_runtime_paths_mixin():
    """Load the literally PCEA-named helper through a fixed local path."""
    module_name = f"{__package__}._zfae_runt_path_v0_0_0alpha"
    source_path = Path(__file__).with_name("zfae_runt_path_v0.0.0alpha.py")
    spec = spec_from_file_location(module_name, source_path)
    if spec is None or spec.loader is None:
        raise ImportError(f"cannot load runtime paths from {source_path}")
    module = module_from_spec(spec)
    sys.modules[module_name] = module
    try:
        spec.loader.exec_module(module)
    except BaseException:
        sys.modules.pop(module_name, None)
        raise
    return module.RuntimePathsMixin


_RuntimePathsMixin = _load_runtime_paths_mixin()


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


class ZFAERuntime(_RuntimePathsMixin):
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
        get_key_fn=None,
    ):
        self.teacher = teacher_client
        self.learner = learner or ZFAELearner()
        self.native = native_engine or A0ZFAEInferenceEngine()
        self.min_steps = int(min_steps_for_native)
        self.max_loss = float(max_loss_for_native)
        self.pending_overrides_col = pending_overrides_col
        self.fiq_audit_col = fiq_audit_col
        # BYOK key resolver `get_key_fn(user_id, provider) -> str|None`; enables
        # the mid-thought tool-use loop in the teacher path when provided.
        self.get_key_fn = get_key_fn

    _teacher_mode_value = RuntimeMode.TEACHER_ASSISTED.value
    _native_mode_value = RuntimeMode.ZFAE_NATIVE.value

    @staticmethod
    def _make_runtime_reply(**values):
        return RuntimeReply(**values)

    @staticmethod
    def _select_native_tool(raw_prompt):
        return select_native_tool(raw_prompt)

    def _native_ready(self, bank):
        return _is_trained_enough(
            bank, min_steps=self.min_steps, max_loss=self.max_loss,
        )

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
        tools_allowed: Optional[list] = None,
        lifted_path_trace: bool = False,
    ) -> RuntimeReply:
        """Produce one chat-turn reply per the requested mode.

        If sentinels flag the request and there is no approved override_id, return
        a halt reply (reply_source='zfae_halted') with a pending_override_id.
        """
        zfae_snapshot = zfae_snapshot or {}
        action_request = self._chat_action_request(
            agent_id=agent_id, user_id=user_id, mode=mode, bank=bank,
            raw_prompt=raw_prompt, transcript=transcript, teacher_model_id=teacher_model_id,
            system_prompt=system_prompt, persona=persona, ring_summary=ring_summary,
            user_feedback=user_feedback, zfae_snapshot=zfae_snapshot,
            sentinel_modes=sentinel_modes, sentinel_weights=sentinel_weights,
            tools_allowed=tools_allowed, lifted_path_trace=lifted_path_trace,
        )

        # ---- Sentinel halt gate -------------------------------------------------
        verdict, override_rec, resume_parent_id = await self._sentinel_gate(
            agent_id=agent_id, user_id=user_id, mode=mode, raw_prompt=raw_prompt,
            transcript=transcript, bank=bank,
            sentinel_modes=sentinel_modes, sentinel_weights=sentinel_weights,
            override_id=override_id, action_request=action_request,
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
                tools_allowed=tools_allowed, sentinel_modes=sentinel_modes,
                sentinel_weights=sentinel_weights, override_id=override_id,
                resume_parent_id=resume_parent_id,
            )
        elif mode == RuntimeMode.ZFAE_NATIVE:
            reply_obj = await self._zfae_native(
                bank=bank, raw_prompt=raw_prompt, transcript=transcript,
                zfae_snapshot=zfae_snapshot, agent_id=agent_id, user_id=user_id,
                tools_allowed=tools_allowed, sentinel_modes=sentinel_modes,
                sentinel_weights=sentinel_weights, override_id=override_id,
                resume_parent_id=resume_parent_id,
                lifted_path_trace=lifted_path_trace,
            )
        else:
            raise ValueError(f"unknown mode {mode!r}")

        if reply_obj.sentinel_verdict is None:
            reply_obj.sentinel_verdict = _verdict_to_dict(verdict) if verdict else None

        # ---- FIQ emit: zfae_decode (non-silent native inscription audit) --------
        await self._fiq_emit_decode(agent_id, user_id, reply_obj)
        # ---- FIQ emit: chat_reply -----------------------------------------------
        await self._fiq_emit_chat_reply(agent_id, user_id, reply_obj, verdict)
        return reply_obj

    async def _sentinel_gate(
        self, *, agent_id, user_id, mode, raw_prompt, transcript, bank,
        sentinel_modes, sentinel_weights, override_id, action_request,
    ) -> tuple[Optional[Verdict13], Optional[Any], Optional[str]]:
        """Evaluate sentinels; create a PendingOverride if any flagged and no approved override_id.

        Returns (verdict, override_record_or_none, resume_parent_id). The record
        is non-None iff this turn must halt; the parent id is internal-only.
        """
        raw_request = action_request
        ctx = EventContext(
            kind="chat_reply",
            agent_id=agent_id, user_id=user_id,
            raw_request=raw_request,
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
            return verdict, None, None

        # Claim a tool child once when it links to the exact consumed chat
        # approval, but leave the child approved for exact tool consumption.
        if override_id and self.pending_overrides_col is not None:
            staged = await zfae_overrides.claim_staged_resume(
                self.pending_overrides_col,
                override_id,
                user_id,
                agent_id,
                "chat_reply",
                raw_request,
            )
            if staged is not None:
                return verdict, None, staged.parent_override_id
            rec = await zfae_overrides.consume_approved(
                self.pending_overrides_col,
                override_id,
                user_id,
                agent_id,
                "chat_reply",
                raw_request,
            )
            if rec is not None:
                return verdict, None, rec.id

        # No approved override — must halt. Create one.
        if self.pending_overrides_col is None:
            # No persistence; cannot create override. Halt with a synthetic record.
            return verdict, _EphemeralOverride(
                id="ephemeral",
                agent_id=agent_id,
                flagged=list(verdict.flagged_sentinels),
                blocking_cliff=verdict.blocking_cliff,
            ), None

        reasons = {v.name: v.reason for v in verdict.verdicts if v.flagged}
        rec = await zfae_overrides.create_override(
            self.pending_overrides_col,
            agent_id=agent_id, user_id=user_id, event_kind="chat_reply",
            raw_request=raw_request,
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
        return verdict, rec, None

    async def _fiq_emit_decode(self, agent_id, user_id, reply_obj):
        """Non-silent audit — emit a zfae_decode event when Route A inscribed text."""
        if self.fiq_audit_col is None:
            return
        meta = (reply_obj.trace or {}).get("zfae_decode")
        if not meta:
            return
        try:
            await fiq_emit.emit(
                self.fiq_audit_col,
                event_type="zfae_decode",
                agent_id=agent_id, user_id=user_id,
                payload=meta,
            )
        except Exception as _e:
            _AUDIT_LOG.warning("fiq audit emit failed: %s", _e)

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

    async def _fiq_emit_tool_trace(self, agent_id, user_id, tool_trace):
        """Non-silent audit — emit a zfae_tool_call + zfae_tool_result pair per entry."""
        if self.fiq_audit_col is None or not tool_trace:
            return
        for entry in tool_trace:
            try:
                await fiq_emit.emit(
                    self.fiq_audit_col, event_type="zfae_tool_call",
                    agent_id=agent_id, user_id=user_id,
                    payload={"tool": entry.get("name"),
                             "args_keys": list((entry.get("args") or {}).keys())},
                )
                await fiq_emit.emit(
                    self.fiq_audit_col, event_type="zfae_tool_result",
                    agent_id=agent_id, user_id=user_id,
                    payload={"tool": entry.get("name"), "status": entry.get("status"),
                             "preview": str(entry.get("result_preview", ""))[:160]},
                )
            except Exception as _e:
                _AUDIT_LOG.warning("fiq tool emit failed: %s", _e)

    async def train_multi(
        self, *, agent_id, user_id, bank, prompts, teacher_model_ids,
        system_prompt="", persona="",
    ) -> dict:
        """Training Room — distill the a0(zfae) echo from TWO OR MORE teacher models.

        For each prompt, every selected teacher answers and the echo runs one
        distill step per answer (round-robin core/seed). The weight bank
        accumulates across all (prompt × model) pairs. No silent fallback — a
        missing BYOK key / provider error is recorded per step and skipped.
        Returns ``{steps, weights_updated, teachers_used, ok_steps, metrics}``.
        """
        steps: list[dict] = []
        any_updated = False
        if self.teacher is None:
            return {"steps": [], "weights_updated": False, "teachers_used": [],
                    "ok_steps": 0, "metrics": self._metrics(bank),
                    "error": "no teacher client configured"}
        for pi, prompt in enumerate(prompts):
            if not (prompt or "").strip():
                continue
            messages = build_curated_context(
                system_prompt=system_prompt, persona=persona,
                transcript=None, prompt=prompt,
            )
            for tm in teacher_model_ids:
                entry = {"prompt_index": pi, "prompt": prompt[:140], "teacher_model_id": tm}
                try:
                    teacher = await self.teacher.invoke(
                        user_id=user_id, teacher_model_id=tm, messages=messages)
                except Exception as e:
                    entry.update({"ok": False, "error": str(e)[:200]})
                    steps.append(entry)
                    continue
                if teacher.error or not teacher.teacher_reply:
                    entry.update({"ok": False, "error": teacher.error or "empty teacher reply"})
                    steps.append(entry)
                    continue
                res = self.learner.distill_step(bank, prompt, teacher.teacher_reply)
                any_updated = any_updated or res.weights_updated
                bank.record_teacher(teacher.teacher_model_id)
                entry.update({
                    "ok": True,
                    "loss": float(res.loss),
                    "intent_match": bool(res.intent_match),
                    "core": res.core,
                    "seed_idx": int(res.seed_idx),
                    "training_step": int(res.new_training_step),
                    "total_seeds_touched": int(res.total_seeds_touched),
                    "reply_preview": (teacher.teacher_reply or "")[:160],
                })
                steps.append(entry)
                if self.fiq_audit_col is not None:
                    try:
                        await fiq_emit.emit(
                            self.fiq_audit_col, event_type="zfae_training_step",
                            agent_id=agent_id, user_id=user_id,
                            payload={"core": res.core, "seed_idx": int(res.seed_idx),
                                     "loss": float(res.loss), "intent_match": bool(res.intent_match),
                                     "training_step": int(res.new_training_step),
                                     "teacher_model_id": tm, "room": "training_room"},
                        )
                    except Exception as _e:
                        _AUDIT_LOG.warning("fiq audit emit failed: %s", _e)
        return {
            "steps": steps,
            "weights_updated": any_updated,
            "teachers_used": sorted({s["teacher_model_id"] for s in steps if s.get("ok")}),
            "ok_steps": sum(1 for s in steps if s.get("ok")),
            "metrics": self._metrics(bank),
        }

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
# ratios: loc_comments=398:104 imports_exports=17:3 calls_definitions=71:18
