# === RATIOS ===
# id: loc_comments
#   summary: lines of code to lines commented
#   value: 154:60
#   basis: ratios_runner.compute_loc_comments
#
# id: imports_exports
#   summary: import statements to public exports
#   value: 9:14
#   basis: ratios_runner.compute_imports_exports
#
# id: calls_definitions
#   summary: call sites to definitions
#   value: 51:14
#   basis: ratios_runner.compute_calls_definitions
# === END RATIOS ===
# === MODULE_BUILD ===
# id: agents_routes
#   module_name: routes
#   module_kind: route
#   summary: /api/instances/* CRUD + /api/chat/instance/{id} mode-aware; surface-3 teacher context preview endpoint
#   owner: Erin Spencer
#   public_surface: router, get_agent_store
#   internal_surface: _AGENT_STORE, _runtime, _get_key
#   auth_boundary: none
#   storage_boundary: write
#   network_boundary: external
#   user_data_boundary: write
#   admin_only: false
#   tests: a0p_skills.contracts.chat_instance_mode_dispatch_holds, a0p_skills.contracts.teacher_curated_context_distinct_from_prompt_holds
#   rollout: default_enabled
#   rollback: detach router; existing agents preserved
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: agents_routes_boundaries
#   summary: /api/instances/* CRUD + /api/chat/instance/{id} mode-aware; surface-3 teacher context preview endpoint
#   auth_boundary: none
#   storage_boundary: write
#   network_boundary: external
#   user_data_boundary: write
#   admin_only: false
#   owner: Erin Spencer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: agents_routes
#   summary: /api/instances/* CRUD + /api/chat/instance/{id} mode-aware; surface-3 teacher context preview endpoint
#   exposes: router, get_agent_store
#   boundaries: auth:none, storage:write, network:external, user_data:write
#   owner: Erin Spencer
# === END CAPABILITIES ===
# === CONTRACTS ===
# id: chat_instance_mode_dispatch
#   given: per the module's declared behaviour
#   then: the named callable returns without raising
#   class: correctness
#   call: a0p_skills.contracts.chat_instance_mode_dispatch_holds
# === END CONTRACTS ===

# === CONTRACTS ===
# id: teacher_curated_context_distinct_from_prompt
#   given: per the module's declared behaviour
#   then: the named callable returns without raising
#   class: correctness
#   call: a0p_skills.contracts.teacher_curated_context_distinct_from_prompt_holds
# === END CONTRACTS ===
"""Agents CRUD + mode-aware chat-instance route."""
from __future__ import annotations
from typing import Any, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, ConfigDict

from .schema import AgentInstance, CharacterSheet, AgentMode
from .store import AgentStore


router = APIRouter()

_AGENT_STORE: Optional[AgentStore] = None


def get_agent_store() -> AgentStore:
    if _AGENT_STORE is None:
        raise RuntimeError("agent store not initialised; call init_routes(mongo_collection)")
    return _AGENT_STORE


def init_routes(mongo_collection, runtime=None, get_key_fn=None):
    """Mount the routes — called from server.py at startup."""
    global _AGENT_STORE
    _AGENT_STORE = AgentStore(mongo_collection)
    if runtime is not None:
        router.runtime = runtime
    if get_key_fn is not None:
        router.get_key_fn = get_key_fn


# ---- request shapes -----------------------------------------------------

class CreateAgentRequest(BaseModel):
    model_config = ConfigDict(protected_namespaces=())
    user_id: str = "local"
    sheet: CharacterSheet


class UpdateAgentRequest(BaseModel):
    model_config = ConfigDict(protected_namespaces=())
    user_id: str = "local"
    patch: dict[str, Any]


class ChatInstanceRequest(BaseModel):
    model_config = ConfigDict(protected_namespaces=())
    user_id: str = "local"
    prompt: str
    mode: Optional[AgentMode] = None              # override character-sheet mode for this turn
    transcript: Optional[list[dict]] = None
    teacher_model_id: Optional[str] = None        # override character-sheet teacher
    user_feedback: Optional[Any] = None
    zfae_snapshot: Optional[dict] = None


class TeacherPreviewRequest(BaseModel):
    model_config = ConfigDict(protected_namespaces=())
    user_id: str = "local"
    prompt: str
    transcript: Optional[list[dict]] = None


# ---- CRUD ---------------------------------------------------------------

@router.get("/instances")
async def list_instances(user_id: str = "local", include_archived: bool = False):
    store = get_agent_store()
    agents = await store.list(user_id, include_archived=include_archived)
    return {"agents": [a.model_dump() for a in agents], "count": len(agents)}


@router.post("/instances")
async def create_instance(body: CreateAgentRequest):
    store = get_agent_store()
    agent = await store.create(body.sheet, user_id=body.user_id)
    return agent.model_dump()


@router.get("/instances/{agent_id}")
async def get_instance(agent_id: str, user_id: str = "local"):
    store = get_agent_store()
    agent = await store.get(agent_id, user_id)
    if not agent:
        raise HTTPException(404, f"agent {agent_id} not found")
    # Refresh metrics from on-disk checkpoint
    metrics = await store.refresh_metrics(agent_id, user_id)
    if metrics:
        agent.zfae_metrics = metrics
    return agent.model_dump()


@router.patch("/instances/{agent_id}")
async def update_instance(agent_id: str, body: UpdateAgentRequest):
    store = get_agent_store()
    agent = await store.update_sheet(agent_id, body.patch, user_id=body.user_id)
    if not agent:
        raise HTTPException(404, f"agent {agent_id} not found")
    return agent.model_dump()


@router.delete("/instances/{agent_id}")
async def delete_instance(agent_id: str, user_id: str = "local", purge: bool = False):
    store = get_agent_store()
    ok = await store.delete(agent_id, user_id)
    if not ok:
        raise HTTPException(404, f"agent {agent_id} not found")
    if purge:
        await store.purge_filesystem(agent_id)
    return {"ok": True, "purged": purge}


@router.post("/instances/{agent_id}/archive")
async def archive_instance(agent_id: str, user_id: str = "local"):
    store = get_agent_store()
    ok = await store.archive(agent_id, user_id)
    if not ok:
        raise HTTPException(404, f"agent {agent_id} not found or already archived")
    return {"ok": True, "archived": True}


# ---- mode-aware chat ----------------------------------------------------

@router.post("/chat/instance/{agent_id}")
async def chat_instance(agent_id: str, body: ChatInstanceRequest):
    """Mode-aware chat — dispatches to ZFAERuntime in teacher_assisted or zfae_native mode."""
    store = get_agent_store()
    agent = await store.get(agent_id, body.user_id)
    if not agent:
        raise HTTPException(404, f"agent {agent_id} not found")

    runtime = getattr(router, "runtime", None)
    if runtime is None:
        raise HTTPException(500, "ZFAERuntime not initialised on the agents router")

    mode = body.mode or agent.sheet.mode
    teacher_model_id = body.teacher_model_id or agent.sheet.base_model

    bank = store.load_weight_bank(agent_id)
    if bank is None:
        from interdependent_lib.zfae.weights import A0ZFAEWeightBank
        bank = A0ZFAEWeightBank.fresh(agent_id)

    # Decide runtime mode
    from interdependent_lib.zfae.runtime import RuntimeMode
    if mode == AgentMode.ZFAE_NATIVE:
        rmode = RuntimeMode.ZFAE_NATIVE
    elif mode in (AgentMode.ZFAE_ASSISTED, AgentMode.MODEL_OBSERVED_BY_ZFAE,
                  AgentMode.MODEL_PLUS_CRITIC, AgentMode.BARE_MODEL):
        rmode = RuntimeMode.TEACHER_ASSISTED
    else:
        rmode = RuntimeMode.ZFAE_NATIVE

    reply = await runtime.reply(
        mode=rmode,
        agent_id=agent_id,
        user_id=body.user_id,
        bank=bank,
        raw_prompt=body.prompt,
        transcript=body.transcript,
        teacher_model_id=teacher_model_id,
        system_prompt=agent.sheet.system_prompt,
        persona=agent.sheet.persona,
        user_feedback=body.user_feedback,
        zfae_snapshot=body.zfae_snapshot,
    )

    # Persist weight bank if updated
    if reply.zfae_weights_updated:
        store.save_weight_bank(agent_id, bank)
        await store.refresh_metrics(agent_id, body.user_id)

    return {
        "agent_id": agent_id,
        "mode": mode.value,
        "assistantText": reply.assistantText,
        "reply_source": reply.reply_source,
        "teacher_called": reply.teacher_called,
        "zfae_weights_updated": reply.zfae_weights_updated,
        "nextSnapshot": reply.nextSnapshot,
        "trace": reply.trace,
        "training_record_path": reply.training_record_path,
        "zfae_metrics": reply.zfae_metrics,
    }


@router.post("/instances/{agent_id}/teacher-context-preview")
async def teacher_context_preview(agent_id: str, body: TeacherPreviewRequest):
    """Surface-3 preview — return the curated context that would be sent to the teacher.

    Verifies that surface-3 is distinct from surface-1 (raw prompt).
    """
    store = get_agent_store()
    agent = await store.get(agent_id, body.user_id)
    if not agent:
        raise HTTPException(404, f"agent {agent_id} not found")

    from interdependent_lib.zfae.teacher import build_curated_context
    messages = build_curated_context(
        system_prompt=agent.sheet.system_prompt,
        persona=agent.sheet.persona,
        transcript=body.transcript,
        prompt=body.prompt,
    )
    return {
        "agent_id": agent_id,
        "surface_1_raw_prompt": body.prompt,
        "surface_3_teacher_context": messages,
        "context_distinct_from_prompt": len(messages) > 1 or (messages and messages[-1].get("content") != body.prompt or messages[0].get("role") != "user"),
    }
# === RATIOS ===
# id: loc_comments
#   summary: lines of code to lines commented
#   value: 154:60
#   basis: ratios_runner.compute_loc_comments
#
# id: imports_exports
#   summary: import statements to public exports
#   value: 9:14
#   basis: ratios_runner.compute_imports_exports
#
# id: calls_definitions
#   summary: call sites to definitions
#   value: 51:14
#   basis: ratios_runner.compute_calls_definitions
# === END RATIOS ===
