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

from .inference import A0ZFAEInferenceEngine, MISSING_NATIVE_MESSAGE
from .weights import A0ZFAEWeightBank
from .trainer import ZFAELearner, TrainingResult
from .teacher import TeacherClient, TeacherInvocation, build_curated_context


class RuntimeMode(str, Enum):
    TEACHER_ASSISTED = "teacher_assisted"
    ZFAE_NATIVE = "zfae_native"


@dataclass
class RuntimeReply:
    """Canonical reply shape — every chat turn carries these flags."""
    assistantText: str
    reply_source: str                  # "teacher_assisted" | "zfae_native" | "zfae_refused"
    teacher_called: bool
    zfae_weights_updated: bool
    mode: str
    nextSnapshot: dict
    trace: dict = field(default_factory=dict)
    training_record_path: Optional[str] = None
    zfae_metrics: dict = field(default_factory=dict)


def _is_trained_enough(bank: A0ZFAEWeightBank, *, min_steps: int = 16, max_loss: float = 0.1) -> bool:
    """Default native-readiness threshold: enough teacher rounds + low enough loss."""
    if bank.zfae_last_loss is None:
        return False
    return bank.zfae_training_step >= min_steps and bank.zfae_last_loss <= max_loss


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
    ):
        self.teacher = teacher_client
        self.learner = learner or ZFAELearner()
        self.native = native_engine or A0ZFAEInferenceEngine()
        self.min_steps = int(min_steps_for_native)
        self.max_loss = float(max_loss_for_native)

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
    ) -> RuntimeReply:
        """Produce one chat-turn reply per the requested mode."""
        zfae_snapshot = zfae_snapshot or {}

        if mode == RuntimeMode.TEACHER_ASSISTED:
            return await self._teacher_assisted(
                agent_id=agent_id, user_id=user_id, bank=bank,
                raw_prompt=raw_prompt, transcript=transcript,
                teacher_model_id=teacher_model_id,
                system_prompt=system_prompt, persona=persona,
                ring_summary=ring_summary, user_feedback=user_feedback,
                zfae_snapshot=zfae_snapshot,
            )
        if mode == RuntimeMode.ZFAE_NATIVE:
            return self._zfae_native(
                bank=bank, raw_prompt=raw_prompt, transcript=transcript,
                zfae_snapshot=zfae_snapshot,
            )
        raise ValueError(f"unknown mode {mode!r}")

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
        if teacher.teacher_reply and not teacher.error:
            result: TrainingResult = self.learner.distill_step(
                bank, raw_prompt, teacher.teacher_reply,
            )
            weights_updated = result.weights_updated
            training_loss = result.loss
            bank.record_teacher(teacher.teacher_model_id)

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
