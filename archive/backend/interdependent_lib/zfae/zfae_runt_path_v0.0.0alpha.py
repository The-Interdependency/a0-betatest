# ratios: loc_comments=390:49 imports_exports=17:2 calls_definitions=64:6
# === MODULE_BUILD ===
# id: zfae_runtime_paths
#   module_name: zfae_runt_path_v0.0.0alpha
#   module_kind: engine
#   summary: bounded teacher, native, and tool execution paths inherited by the stable ZFAERuntime facade
#   owner: Erin Spencer
#   public_surface: RuntimePathsMixin
#   internal_surface: _chat_action_request, _teacher_tool_loop, _native_tool_use, _teacher_assisted, _zfae_native
#   auth_boundary: none
#   storage_boundary: write
#   network_boundary: external
#   user_data_boundary: write
#   admin_only: false
#   tests: backend.tests.test_tool_use_loop, backend.tests.test_audit_storage_confidentiality
#   rollout: default_enabled
#   rollback: move the inherited methods back to runtime.py
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: zfae_runtime_paths_boundaries
#   summary: runtime path orchestration performs provider calls, bounded training writes, exact tool dispatch, and inherited audit emission
#   auth_boundary: none
#   storage_boundary: write
#   network_boundary: external
#   user_data_boundary: write
#   admin_only: false
#   owner: Erin Spencer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: zfae_runtime_paths
#   summary: bounded execution-path implementation behind the ZFAERuntime facade
#   exposes: RuntimePathsMixin
#   boundaries: auth:none, storage:write, network:external, user_data:write
#   owner: Erin Spencer
# === END CAPABILITIES ===
# === CONTRACTS ===
# id: zfae_runtime_paths_loads
#   given: the bounded runtime path module declares its msdmd canon
#   then: the module imports cleanly under the current interpreter
#   class: integration
# id: zfae_runtime_single_tool_attempt
#   given: a provider requests more than one tool during one runtime turn
#   then: the runtime attempts only the first invocation and returns later requests as errors
#   class: security
# === END CONTRACTS ===
"""Bounded execution paths inherited by :class:`ZFAERuntime`."""
from __future__ import annotations

from dataclasses import asdict
from typing import Any, Optional
import logging as _logging

from . import fiq_emit
from .inference import MISSING_NATIVE_MESSAGE
from .native_tools import summarize_tool_result
from .teacher import TeacherInvocation, build_curated_context
from .trainer import TrainingResult

_AUDIT_LOG = _logging.getLogger("a0p.zfae.audit")


class RuntimePathsMixin:
    """Teacher, native, and tool paths for the stable runtime facade."""

    def _chat_action_request(
        self, *, agent_id, user_id, mode, bank, raw_prompt, transcript,
        teacher_model_id, system_prompt, persona, ring_summary, user_feedback,
        zfae_snapshot, sentinel_modes, sentinel_weights, tools_allowed,
        lifted_path_trace,
    ) -> dict:
        """Canonical v1 action whose keyed digest binds a chat approval."""
        from tools import lookup as tools_lookup

        tool_surfaces = []
        for name in tools_allowed or []:
            tool = tools_lookup(name)
            if tool is None:
                tool_surfaces.append({"name": str(name), "missing": True})
                continue
            fn = tool.fn
            tool_surfaces.append({
                "name": tool.name, "kind": tool.kind, "description": tool.description,
                "input_schema": tool.input_schema, "source": tool.source,
                "owner_user_id": tool.owner_user_id, "webhook_url": tool.webhook_url,
                "webhook_secret": tool.webhook_secret, "mcp_server_id": tool.mcp_server_id,
                "remote_name": tool.remote_name, "tags": tool.tags,
                "fn_instance": None if fn is None else repr(fn),
                "fn": None if fn is None else (
                    f"{getattr(fn, '__module__', '')}:{getattr(fn, '__qualname__', type(fn).__qualname__)}"
                ),
            })
        return {
            "schema": "zfae_chat_action_v1", "agent_id": agent_id, "user_id": user_id,
            "mode": mode.value, "prompt": raw_prompt, "transcript": transcript or [],
            "teacher_model_id": teacher_model_id or "", "system_prompt": system_prompt,
            "persona": persona, "ring_summary": ring_summary or {},
            "user_feedback": user_feedback, "zfae_snapshot": zfae_snapshot,
            "sentinel_modes": sentinel_modes or {}, "sentinel_weights": sentinel_weights or {},
            "tools_allowed": list(tools_allowed or []), "tool_surfaces": tool_surfaces,
            "lifted_path_trace": bool(lifted_path_trace),
            "bank": {"digest": bank.zfae_checkpoint_digest,
                     "training_step": bank.zfae_training_step,
                     "last_loss": bank.zfae_last_loss,
                     "gonal_seed": bank.gonal_seed_bytes.hex()},
            "policy": {"min_steps": self.min_steps, "max_loss": self.max_loss,
                       "tool_attempt_budget": 1},
        }

    async def _teacher_tool_loop(
        self, *, teacher_model_id, messages, tools_allowed, agent_id, user_id,
        sentinel_modes, sentinel_weights, override_id, resume_parent_id,
    ) -> tuple[TeacherInvocation, list, Optional[str], Optional[dict]]:
        """Run a provider tool loop and preserve any sentinel halt verdict."""
        from tools.agent_loop import run_tool_loop, ToolLoopHalt
        from tools import invoke as tools_invoke, lookup as tools_lookup
        from tools.registry import ToolError

        async def _single_shot():
            return await self.teacher.invoke(
                user_id=user_id, teacher_model_id=teacher_model_id, messages=messages)

        prov, name = teacher_model_id.split(":", 1)
        if self.teacher is None or prov not in getattr(self.teacher, "_registry", {}):
            return await _single_shot(), [], None, None
        api_key = await self.get_key_fn(user_id, prov)
        if not api_key:
            return await _single_shot(), [], None, None

        tool_specs: list[dict] = []
        for nm in tools_allowed:
            tool = tools_lookup(nm)
            if tool is not None:
                tool_specs.append({
                    "name": tool.name,
                    "description": tool.description,
                    "input_schema": tool.input_schema or {"type": "object", "properties": {}},
                })
        if not tool_specs:
            return await _single_shot(), [], None, None

        tool_attempted = False

        async def _executor(tool_call):
            nonlocal tool_attempted
            if tool_attempted:
                raise ToolError("runtime tool-attempt budget exhausted")
            tool_attempted = True
            try:
                return await tools_invoke(
                    tool_call["name"], tool_call.get("args") or {}, user={"id": user_id},
                    agent_id=agent_id,
                    sentinel_modes=sentinel_modes, sentinel_weights=sentinel_weights,
                    pending_overrides_col=self.pending_overrides_col,
                    fiq_audit_col=self.fiq_audit_col, override_id=override_id,
                    resume_parent_id=resume_parent_id,
                )
            except ToolError as exc:
                if exc.halt:
                    raise ToolLoopHalt(
                        override_id=exc.override_id, sentinel_verdict=exc.sentinel_verdict,
                    )
                raise

        loop = await run_tool_loop(
            provider=prov, model=name, api_key=api_key,
            generic_messages=messages, tools=tool_specs, executor=_executor,
            max_iters=4, max_tokens=1024,
        )
        if loop["halted"]:
            return (
                TeacherInvocation(
                    teacher_model_id=teacher_model_id, teacher_reply="", error="sentinel_halt",
                ),
                loop["tool_trace"], loop["override_id"], loop.get("sentinel_verdict"),
            )
        teacher = TeacherInvocation(
            teacher_model_id=teacher_model_id,
            teacher_reply=loop["final_text"] or "",
            usage={"total": loop["usage"].get("total", 0)},
            error=loop["error"],
        )
        return teacher, loop["tool_trace"], None, None

    async def _native_tool_use(
        self, *, raw_prompt, agent_id, user_id, tools_allowed,
        sentinel_modes, sentinel_weights, override_id, resume_parent_id,
    ) -> tuple[list, str, Optional[str], Optional[dict]]:
        """Select and run at most one deterministic, sentinel-gated native tool."""
        tools_allowed = tools_allowed or []
        selection = self._select_native_tool(raw_prompt)
        if not selection or selection["name"] not in tools_allowed:
            return [], "", None, None
        from tools import invoke as tools_invoke
        from tools.registry import ToolError
        try:
            output = await tools_invoke(
                selection["name"], selection["params"], user={"id": user_id},
                agent_id=agent_id,
                sentinel_modes=sentinel_modes, sentinel_weights=sentinel_weights,
                pending_overrides_col=self.pending_overrides_col,
                fiq_audit_col=self.fiq_audit_col, override_id=override_id,
                resume_parent_id=resume_parent_id,
            )
        except ToolError as exc:
            if exc.halt:
                return ([{
                    "name": selection["name"], "args": selection["params"], "status": "halted",
                }], "", exc.override_id, exc.sentinel_verdict)
            return ([{
                "name": selection["name"], "args": selection["params"], "status": "error",
                "result_preview": str(exc)[:200],
            }], "", None, None)
        summary = summarize_tool_result(selection["name"], output)
        trace = [{
            "name": selection["name"], "args": selection["params"], "status": "ok",
            "result_preview": summary,
        }]
        await self._fiq_emit_tool_trace(agent_id, user_id, trace)
        return trace, summary, None, None

    async def _teacher_assisted(
        self, *, agent_id, user_id, bank, raw_prompt, transcript,
        teacher_model_id, system_prompt, persona, ring_summary,
        user_feedback, zfae_snapshot,
        tools_allowed=None, sentinel_modes=None, sentinel_weights=None,
        override_id=None, resume_parent_id=None,
    ) -> Any:
        if self.teacher is None or not teacher_model_id:
            return await self._zfae_native(
                bank=bank, raw_prompt=raw_prompt, transcript=transcript,
                zfae_snapshot=zfae_snapshot, agent_id=agent_id, user_id=user_id,
                tools_allowed=tools_allowed, sentinel_modes=sentinel_modes,
                sentinel_weights=sentinel_weights, override_id=override_id,
                resume_parent_id=resume_parent_id,
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

        tool_trace: list[dict] = []
        if tools_allowed and self.get_key_fn is not None and ":" in teacher_model_id:
            teacher, tool_trace, halt_override_id, halt_verdict = await self._teacher_tool_loop(
                teacher_model_id=teacher_model_id, messages=messages,
                tools_allowed=tools_allowed, agent_id=agent_id, user_id=user_id,
                sentinel_modes=sentinel_modes, sentinel_weights=sentinel_weights,
                override_id=override_id, resume_parent_id=resume_parent_id,
            )
            if halt_override_id is not None:
                return self._make_runtime_reply(
                    assistantText="a0 halted mid-tool by sentinels — explicit user override required.",
                    reply_source="zfae_halted",
                    teacher_called=True,
                    zfae_weights_updated=False,
                    mode=self._teacher_mode_value,
                    nextSnapshot=zfae_snapshot,
                    trace={"halt_reason": "tool_sentinel_halt", "tool_trace": tool_trace},
                    pending_override_id=halt_override_id,
                    sentinel_verdict=halt_verdict,
                    zfae_metrics=self._metrics(bank),
                )
            if tool_trace:
                await self._fiq_emit_tool_trace(agent_id, user_id, tool_trace)
        else:
            teacher = await self.teacher.invoke(
                user_id=user_id, teacher_model_id=teacher_model_id, messages=messages,
            )

        weights_updated = False
        training_loss: Optional[float] = None
        training_step_before = bank.zfae_training_step
        try:
            from api_extensions import check_demo_quota
            quota = await check_demo_quota(user_id, projected_tokens=500)
            if not quota["fits"]:
                return self._make_runtime_reply(
                    assistantText=(
                        "Daily demo budget exhausted "
                        f"({quota['used']}/{quota['budget']} tokens). "
                        "Bring your own key on /keys or wait until 00:00 UTC."
                    ),
                    reply_source="zfae_refused",
                    teacher_called=False,
                    zfae_weights_updated=False,
                    mode=self._teacher_mode_value,
                    nextSnapshot=zfae_snapshot,
                    trace={"reason": "demo_quota_exhausted", **quota},
                    zfae_metrics=self._metrics(bank),
                )
        except Exception as exc:
            _AUDIT_LOG.warning("fiq audit emit failed: %s", exc)
        if teacher.teacher_reply and not teacher.error:
            result: TrainingResult = self.learner.distill_step(
                bank, raw_prompt, teacher.teacher_reply,
            )
            weights_updated = result.weights_updated
            training_loss = result.loss
            bank.record_teacher(teacher.teacher_model_id)
            try:
                from api_extensions import record_demo_usage
                approx = (len(raw_prompt) + len(teacher.teacher_reply or "")) // 4
                await record_demo_usage(user_id, max(50, approx))
            except Exception as exc:
                _AUDIT_LOG.warning("fiq audit emit failed: %s", exc)
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
                except Exception as exc:
                    _AUDIT_LOG.warning("fiq audit emit failed: %s", exc)

        native_result = self.native.infer(
            rawPrompt=raw_prompt,
            transcript=transcript,
            zfaeSnapshot=zfae_snapshot,
            rings={"summary": ring_summary} if ring_summary else None,
            gonal_seed=bank.gonal_seed_bytes,
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

        return self._make_runtime_reply(
            assistantText=teacher.teacher_reply or (teacher.error or ""),
            reply_source="teacher_assisted",
            teacher_called=True,
            zfae_weights_updated=weights_updated,
            mode=self._teacher_mode_value,
            nextSnapshot=snapshot_after,
            trace={
                "teacher_invocation": asdict(teacher),
                "training_loss": training_loss,
                "training_step_before": training_step_before,
                "training_step_after": bank.zfae_training_step,
                "tool_trace": tool_trace,
            },
            training_record_path=training_record_path,
            zfae_metrics=self._metrics(bank),
        )

    async def _zfae_native(
        self,
        *,
        bank,
        raw_prompt: str,
        transcript,
        zfae_snapshot,
        agent_id: str = "local",
        user_id: str = "local",
        tools_allowed=None,
        sentinel_modes=None,
        sentinel_weights=None,
        override_id=None,
        resume_parent_id=None,
        extra_trace: Optional[dict] = None,
        lifted_path_trace: bool = False,
    ) -> Any:
        extra_trace = extra_trace or {}
        ready = self._native_ready(bank)
        if not ready:
            return self._make_runtime_reply(
                assistantText=(
                    "a0(zfae) cannot perform native inference yet: "
                    "missing trained decoder / sufficient checkpoint / response policy."
                ),
                reply_source="zfae_refused",
                teacher_called=False,
                zfae_weights_updated=False,
                mode=self._native_mode_value,
                nextSnapshot=zfae_snapshot,
                trace={
                    "reason": "not_trained_enough",
                    "training_step": bank.zfae_training_step,
                    "min_steps_required": self.min_steps,
                    "last_loss": bank.zfae_last_loss,
                    "max_loss_required": self.max_loss,
                    "total_seeds_touched": bank.total_seeds_touched,
                    "all_seeds_touched": bank.all_seeds_touched,
                    "tool_trace": [],
                    **extra_trace,
                },
                zfae_metrics=self._metrics(bank),
            )
        native_tool_trace, tool_summary, halt, halt_verdict = await self._native_tool_use(
            raw_prompt=raw_prompt, agent_id=agent_id, user_id=user_id,
            tools_allowed=tools_allowed, sentinel_modes=sentinel_modes,
            sentinel_weights=sentinel_weights, override_id=override_id,
            resume_parent_id=resume_parent_id,
        )
        if halt is not None:
            return self._make_runtime_reply(
                assistantText="a0(zfae) halted mid-tool by sentinels — explicit user override required.",
                reply_source="zfae_halted",
                teacher_called=False,
                zfae_weights_updated=False,
                mode=self._native_mode_value,
                nextSnapshot=zfae_snapshot,
                trace={
                    "halt_reason": "tool_sentinel_halt",
                    "tool_trace": native_tool_trace,
                    **extra_trace,
                },
                pending_override_id=halt,
                sentinel_verdict=halt_verdict,
                zfae_metrics=self._metrics(bank),
            )
        native_result = self.native.infer(
            rawPrompt=raw_prompt,
            transcript=transcript,
            zfaeSnapshot=zfae_snapshot,
            gonal_seed=bank.gonal_seed_bytes,
            lifted_path_trace=lifted_path_trace,
        )
        text = (
            native_result["assistantText"]
            if native_result["assistantText"] != MISSING_NATIVE_MESSAGE
            else "a0(zfae) cannot perform native inference yet: "
                 "missing trained decoder / sufficient checkpoint / response policy."
        )
        if tool_summary:
            text = f"{text}\n\n{tool_summary}"
        return self._make_runtime_reply(
            assistantText=text,
            reply_source="zfae_native",
            teacher_called=False,
            zfae_weights_updated=False,
            mode=self._native_mode_value,
            nextSnapshot=native_result["nextSnapshot"],
            trace={**native_result["trace"], **extra_trace, "tool_trace": native_tool_trace},
            zfae_metrics=self._metrics(bank),
        )

__all__ = ["RuntimePathsMixin"]
# ratios: loc_comments=390:49 imports_exports=17:2 calls_definitions=64:6
