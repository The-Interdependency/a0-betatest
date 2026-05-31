"""
a0p — research instrument backend.

Exposes:
  /api/health
  /api/keys                — BYOK key vault (encrypted at rest)
  /api/vault               — per-site multi-account .env vault
  /api/models/inventory    — model inventory per provider key
  /api/sessions            — chat sessions with editable context
  /api/drafts              — prompt drafts (autosave)
  /api/chat/single         — single-model chat
  /api/chat/fanout         — fan-out: one prompt → N models
  /api/chat/daisychain     — daisy-chain: A → B → ... N rounds
  /api/chat/synthesize     — synthesize a chosen set of responses
  /api/inspector/heartbeat — PCNA heartbeat (PTCA cores phi/psi/omega)
  /api/inspector/snapshot  — full engine snapshot
  /api/agents              — detachable agents library
  /api/usage               — token / compute usage log
"""
from __future__ import annotations
import os
import asyncio
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv
load_dotenv(Path(__file__).parent / ".env")

from fastapi import FastAPI, APIRouter, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Any

from db import (
    keys_col, vault_col, sessions_col, drafts_col,
    fanout_col, chain_col, agents_col, usage_col, ensure_indexes,
)
from models import (
    KeyUpsert, KeyPublic,
    SiteAccountUpsert, SiteAccountPublic,
    SessionUpsert, SessionPublic, ChatTurn,
    DraftUpsert, DraftPublic,
    FanOutRequest, DaisyChainRequest, SynthesizeRequest,
    AgentExport,
    PROVIDERS, new_id,
)
import crypto_vault as cv
from providers import REGISTRY
from interdependent_lib.aimmh import fan_out as aimmh_fan_out, daisy_chain as aimmh_daisy
from interdependent_lib.zfae import ZFAEAgent


def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# ---------- app ----------
app = FastAPI(title="a0p — research instrument", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

api = APIRouter(prefix="/api")


# ---------- shared persistent ZFAE agent ----------
AGENT = ZFAEAgent(name="a0(zfae)", base_seed=157)


# ---------- health ----------
@api.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "a0p",
        "ts": _utc_now_iso(),
        "providers": list(REGISTRY.keys()),
        "agent": {"id": AGENT.id, "name": AGENT.name, "born_ms": AGENT.born_ms},
    }


# ---------- BYOK keys ----------
@api.get("/keys")
async def list_keys(user_id: str = "local"):
    out: list[KeyPublic] = []
    async for doc in keys_col.find({"user_id": user_id}).sort("provider", 1):
        try:
            plain = cv.decrypt(doc["enc_api_key"])
        except Exception:
            plain = ""
        out.append(KeyPublic(
            id=doc["_id"],
            user_id=doc["user_id"],
            provider=doc["provider"],
            label=doc.get("label"),
            masked=cv.mask(plain),
            has_key=bool(plain),
            last_used_at=doc.get("last_used_at"),
            created_at=doc.get("created_at"),
            updated_at=doc.get("updated_at"),
        ).model_dump())
    return {"keys": out}


@api.put("/keys")
async def upsert_key(body: KeyUpsert):
    if body.provider not in PROVIDERS:
        raise HTTPException(400, f"provider must be one of {PROVIDERS}")
    if not body.api_key or len(body.api_key) < 8:
        raise HTTPException(400, "api_key looks invalid")
    now = _utc_now_iso()
    enc = cv.encrypt(body.api_key)
    existing = await keys_col.find_one({"user_id": body.user_id, "provider": body.provider})
    if existing:
        await keys_col.update_one(
            {"_id": existing["_id"]},
            {"$set": {"enc_api_key": enc, "label": body.label, "updated_at": now}},
        )
        _id = existing["_id"]
    else:
        _id = new_id()
        await keys_col.insert_one({
            "_id": _id,
            "user_id": body.user_id,
            "provider": body.provider,
            "label": body.label,
            "enc_api_key": enc,
            "created_at": now,
            "updated_at": now,
            "last_used_at": None,
        })
    return {"ok": True, "id": _id, "provider": body.provider, "masked": cv.mask(body.api_key)}


@api.delete("/keys/{key_id}")
async def delete_key(key_id: str, user_id: str = "local"):
    r = await keys_col.delete_one({"_id": key_id, "user_id": user_id})
    return {"ok": r.deleted_count == 1}


async def _get_key(user_id: str, provider: str) -> str:
    doc = await keys_col.find_one({"user_id": user_id, "provider": provider})
    if not doc:
        return ""
    try:
        return cv.decrypt(doc["enc_api_key"])
    except Exception:
        return ""


# ---------- Site .env vault ----------
@api.get("/vault")
async def list_vault(user_id: str = "local"):
    out: list[SiteAccountPublic] = []
    async for doc in vault_col.find({"user_id": user_id}).sort([("site", 1), ("account_label", 1)]):
        # do not return encrypted values; just keys
        env_keys = list((doc.get("enc_env") or {}).keys())
        out.append(SiteAccountPublic(
            id=doc["_id"],
            user_id=doc["user_id"],
            site=doc["site"],
            account_label=doc["account_label"],
            env_keys=env_keys,
            created_at=doc.get("created_at"),
            updated_at=doc.get("updated_at"),
        ).model_dump())
    return {"accounts": out}


@api.put("/vault")
async def upsert_vault(body: SiteAccountUpsert):
    now = _utc_now_iso()
    enc_env = {k: cv.encrypt(v) for k, v in body.env.items() if v}
    existing = await vault_col.find_one({"user_id": body.user_id, "site": body.site, "account_label": body.account_label})
    if existing:
        merged = {**(existing.get("enc_env") or {}), **enc_env}
        await vault_col.update_one(
            {"_id": existing["_id"]},
            {"$set": {"enc_env": merged, "updated_at": now}},
        )
        _id = existing["_id"]
    else:
        _id = new_id()
        await vault_col.insert_one({
            "_id": _id,
            "user_id": body.user_id,
            "site": body.site,
            "account_label": body.account_label,
            "enc_env": enc_env,
            "created_at": now,
            "updated_at": now,
        })
    return {"ok": True, "id": _id, "site": body.site, "account_label": body.account_label,
            "env_keys": list(enc_env.keys())}


class VaultRevealRequest(BaseModel):
    user_id: str = "local"
    id: str
    keys: List[str]


@api.post("/vault/reveal")
async def reveal_vault(body: VaultRevealRequest):
    doc = await vault_col.find_one({"_id": body.id, "user_id": body.user_id})
    if not doc:
        raise HTTPException(404, "vault entry not found")
    env = doc.get("enc_env") or {}
    return {"values": {k: cv.decrypt(env[k]) for k in body.keys if k in env}}


@api.delete("/vault/{vault_id}")
async def delete_vault(vault_id: str, user_id: str = "local"):
    r = await vault_col.delete_one({"_id": vault_id, "user_id": user_id})
    return {"ok": r.deleted_count == 1}


# ---------- Model inventory ----------
@api.get("/models/inventory")
async def model_inventory(user_id: str = "local"):
    """Aggregate model inventory across all providers the user has keys for, plus Emergent."""
    inv: list[dict] = []
    errors: dict[str, str] = {}

    # Always include emergent inventory (uses server env key)
    try:
        inv.extend(await REGISTRY["emergent"].list_models(None))
    except Exception as e:
        errors["emergent"] = str(e)

    # For each provider the user has a key for, fetch live inventory
    async for doc in keys_col.find({"user_id": user_id}):
        prov = doc["provider"]
        if prov == "emergent":
            continue
        try:
            plain = cv.decrypt(doc["enc_api_key"])
        except Exception:
            continue
        if not plain:
            continue
        try:
            models = await REGISTRY[prov].list_models(plain)
            inv.extend(models)
        except Exception as e:
            errors[prov] = str(e)[:200]

    return {"models": inv, "errors": errors, "count": len(inv)}


# ---------- Sessions (editable context) ----------
@api.get("/sessions")
async def list_sessions(user_id: str = "local"):
    out = []
    async for d in sessions_col.find({"user_id": user_id}).sort("updated_at", -1).limit(50):
        out.append({
            "id": d["_id"],
            "user_id": d["user_id"],
            "title": d.get("title"),
            "system_context": d.get("system_context", ""),
            "persona": d.get("persona"),
            "selected_models": d.get("selected_models", []),
            "turns_count": len(d.get("turns", [])),
            "created_at": d.get("created_at"),
            "updated_at": d.get("updated_at"),
        })
    return {"sessions": out}


@api.post("/sessions")
async def create_session(body: SessionUpsert):
    now = _utc_now_iso()
    _id = new_id()
    doc = {
        "_id": _id,
        "user_id": body.user_id,
        "title": body.title or f"session-{_id[:8]}",
        "system_context": body.system_context or "",
        "persona": body.persona,
        "selected_models": body.selected_models,
        "metadata": body.metadata,
        "turns": [],
        "created_at": now,
        "updated_at": now,
    }
    await sessions_col.insert_one(doc)
    return {"id": _id, **{k: v for k, v in doc.items() if k != "_id"}}


@api.get("/sessions/{session_id}")
async def get_session(session_id: str, user_id: str = "local"):
    d = await sessions_col.find_one({"_id": session_id, "user_id": user_id})
    if not d:
        raise HTTPException(404, "session not found")
    return {**d, "id": d.pop("_id")}


@api.patch("/sessions/{session_id}")
async def update_session(session_id: str, body: SessionUpsert):
    now = _utc_now_iso()
    upd = {
        "title": body.title,
        "system_context": body.system_context,
        "persona": body.persona,
        "selected_models": body.selected_models,
        "metadata": body.metadata,
        "updated_at": now,
    }
    upd = {k: v for k, v in upd.items() if v is not None or k == "updated_at"}
    r = await sessions_col.update_one(
        {"_id": session_id, "user_id": body.user_id},
        {"$set": upd},
    )
    if r.matched_count == 0:
        raise HTTPException(404, "session not found")
    return {"ok": True}


@api.delete("/sessions/{session_id}")
async def delete_session(session_id: str, user_id: str = "local"):
    r = await sessions_col.delete_one({"_id": session_id, "user_id": user_id})
    return {"ok": r.deleted_count == 1}


# ---------- Drafts ----------
@api.get("/drafts")
async def list_drafts(user_id: str = "local"):
    out = []
    async for d in drafts_col.find({"user_id": user_id}).sort("updated_at", -1).limit(100):
        out.append({"id": d["_id"], **{k: d[k] for k in d if k != "_id"}})
    return {"drafts": out}


@api.post("/drafts")
async def create_draft(body: DraftUpsert):
    now = _utc_now_iso()
    _id = new_id()
    doc = {
        "_id": _id,
        "user_id": body.user_id,
        "title": body.title,
        "content": body.content,
        "tags": body.tags,
        "created_at": now,
        "updated_at": now,
    }
    await drafts_col.insert_one(doc)
    return {"id": _id, **{k: v for k, v in doc.items() if k != "_id"}}


@api.patch("/drafts/{draft_id}")
async def update_draft(draft_id: str, body: DraftUpsert):
    now = _utc_now_iso()
    upd = {k: v for k, v in body.model_dump().items() if k != "user_id"}
    upd["updated_at"] = now
    r = await drafts_col.update_one(
        {"_id": draft_id, "user_id": body.user_id},
        {"$set": upd},
    )
    if r.matched_count == 0:
        raise HTTPException(404, "draft not found")
    return {"ok": True}


@api.delete("/drafts/{draft_id}")
async def delete_draft(draft_id: str, user_id: str = "local"):
    r = await drafts_col.delete_one({"_id": draft_id, "user_id": user_id})
    return {"ok": r.deleted_count == 1}


# ---------- Chat plumbing ----------
def _split_model(model_id: str) -> tuple[str, str]:
    """'provider:name' → (provider, name). For 'emergent', name keeps 'sub:model'."""
    if ":" not in model_id:
        raise HTTPException(400, f"model_id must be 'provider:name', got {model_id!r}")
    prov, rest = model_id.split(":", 1)
    return prov, rest


async def _call_model(
    user_id: str,
    model_id: str,
    messages: list[dict],
    system: str | None,
    use_emergent: set[str],
) -> dict:
    prov, name = _split_model(model_id)

    # Forced re-route to emergent for testing
    if prov in use_emergent and prov != "emergent":
        # emergent uses "openai:gpt-..." style; build that
        em_model = f"{prov}:{name}"
        adapter = REGISTRY["emergent"]
        result = await adapter.chat(None, em_model, messages, system=system)
        return {**result, "routed_via": "emergent"}

    if prov == "emergent":
        adapter = REGISTRY["emergent"]
        result = await adapter.chat(None, name, messages, system=system)
        return {**result, "routed_via": "emergent"}

    if prov not in REGISTRY:
        return {"content": "", "error": f"unknown provider {prov}", "model_id": model_id, "provider": prov}

    key = await _get_key(user_id, prov)
    if not key:
        return {"content": "", "error": f"no api key for provider {prov!r}; either add one in the Key Vault or enable Emergent routing",
                "model_id": model_id, "provider": prov}

    adapter = REGISTRY[prov]
    result = await adapter.chat(key, name, messages, system=system)
    # bump last_used_at
    await keys_col.update_one({"user_id": user_id, "provider": prov},
                              {"$set": {"last_used_at": _utc_now_iso()}})
    return {**result, "routed_via": prov}


async def _record_usage(user_id: str, model_id: str, usage: dict, kind: str):
    await usage_col.insert_one({
        "_id": new_id(),
        "user_id": user_id,
        "model_id": model_id,
        "kind": kind,
        "usage": usage or {},
        "created_at": _utc_now_iso(),
    })


# ---------- Single-model chat ----------
class SingleChatRequest(BaseModel):
    user_id: str = "local"
    model_id: str
    messages: list[dict]
    system: Optional[str] = ""
    session_id: Optional[str] = None
    use_emergent_for: List[str] = []


@api.post("/chat/single")
async def chat_single(body: SingleChatRequest):
    AGENT.receive((body.messages[-1]["content"] if body.messages else "") or "")
    r = await _call_model(
        user_id=body.user_id,
        model_id=body.model_id,
        messages=body.messages,
        system=body.system or None,
        use_emergent=set(body.use_emergent_for),
    )
    AGENT.absorb(body.model_id, r.get("content", ""), r.get("usage"))
    await _record_usage(body.user_id, body.model_id, r.get("usage", {}), "single")

    if body.session_id:
        turn_user = ChatTurn(role="user", content=body.messages[-1]["content"]).model_dump() if body.messages else None
        turn_asst = ChatTurn(role="assistant", content=r.get("content", ""), model_id=body.model_id, usage=r.get("usage", {})).model_dump()
        push_turns = [t for t in [turn_user, turn_asst] if t]
        await sessions_col.update_one(
            {"_id": body.session_id, "user_id": body.user_id},
            {"$push": {"turns": {"$each": push_turns}},
             "$set": {"updated_at": _utc_now_iso()}},
        )
    return {"result": r, "agent_tick": AGENT.engine.tick_count}


# ---------- Fan-out ----------
@api.post("/chat/fanout")
async def chat_fanout(body: FanOutRequest):
    AGENT.receive(body.prompt)
    messages = [{"role": "user", "content": body.prompt}]
    system = body.system_context or None
    use_emergent = set(body.use_emergent_for)

    async def call_fn(model_id: str, msgs: list[dict]):
        return await _call_model(body.user_id, model_id, msgs, system, use_emergent)

    results = await aimmh_fan_out(call_fn, body.model_ids, messages)

    # absorb + persist
    run_id = new_id()
    record = {
        "_id": run_id,
        "user_id": body.user_id,
        "session_id": body.session_id,
        "prompt": body.prompt,
        "system_context": body.system_context,
        "results": [{
            "model_id": r.model_id,
            "content": r.content,
            "usage": r.usage,
            "error": r.error,
        } for r in results],
        "created_at": _utc_now_iso(),
    }
    await fanout_col.insert_one(record)

    for r in results:
        AGENT.absorb(r.model_id, r.content, r.usage)
        await _record_usage(body.user_id, r.model_id, r.usage or {}, "fanout")

    if body.session_id:
        turns = [ChatTurn(role="user", content=body.prompt).model_dump()]
        for r in results:
            turns.append(ChatTurn(role="assistant", content=r.content,
                                  model_id=r.model_id, usage=r.usage).model_dump())
        await sessions_col.update_one(
            {"_id": body.session_id, "user_id": body.user_id},
            {"$push": {"turns": {"$each": turns}},
             "$set": {"updated_at": _utc_now_iso()}},
        )

    return {
        "run_id": run_id,
        "results": record["results"],
        "agent_tick": AGENT.engine.tick_count,
    }


# ---------- Daisy chain ----------
@api.post("/chat/daisychain")
async def chat_daisychain(body: DaisyChainRequest):
    AGENT.receive(body.prompt)
    messages = [{"role": "user", "content": body.prompt}]
    system = body.system_context or None
    use_emergent = set(body.use_emergent_for)
    rounds = max(1, min(body.rounds, 6))

    async def call_fn(model_id: str, msgs: list[dict]):
        return await _call_model(body.user_id, model_id, msgs, system, use_emergent)

    results = await aimmh_daisy(call_fn, body.model_ids, messages, rounds=rounds)

    run_id = new_id()
    serialised = [{
        "step": i + 1,
        "model_id": r.model_id,
        "content": r.content,
        "usage": r.usage,
        "error": r.error,
    } for i, r in enumerate(results)]
    await chain_col.insert_one({
        "_id": run_id,
        "user_id": body.user_id,
        "session_id": body.session_id,
        "prompt": body.prompt,
        "system_context": body.system_context,
        "rounds": rounds,
        "model_ids": body.model_ids,
        "steps": serialised,
        "created_at": _utc_now_iso(),
    })

    for r in results:
        AGENT.absorb(r.model_id, r.content, r.usage)
        await _record_usage(body.user_id, r.model_id, r.usage or {}, "daisy")

    if body.session_id:
        turns = [ChatTurn(role="user", content=body.prompt).model_dump()]
        for r in results:
            turns.append(ChatTurn(role="assistant", content=r.content,
                                  model_id=r.model_id, usage=r.usage).model_dump())
        await sessions_col.update_one(
            {"_id": body.session_id, "user_id": body.user_id},
            {"$push": {"turns": {"$each": turns}},
             "$set": {"updated_at": _utc_now_iso()}},
        )

    return {"run_id": run_id, "steps": serialised, "agent_tick": AGENT.engine.tick_count}


# ---------- Synthesize selected responses ----------
@api.post("/chat/synthesize")
async def chat_synthesize(body: SynthesizeRequest):
    panel = "\n\n".join(f"[{r.get('model_id')}]:\n{r.get('content','')}" for r in body.responses)
    synth_prompt = (
        "You are the synthesizer. Below are responses from multiple models to the same prompt. "
        "Synthesize them into a single cohesive, accurate answer that incorporates the strongest reasoning "
        "from each. Note any disagreements explicitly.\n\n"
        f"ORIGINAL PROMPT:\n{body.prompt}\n\nMODEL RESPONSES:\n{panel}\n\nSYNTHESIS:"
    )
    r = await _call_model(
        user_id=body.user_id,
        model_id=body.synth_model,
        messages=[{"role": "user", "content": synth_prompt}],
        system=None,
        use_emergent=set(body.use_emergent_for),
    )
    AGENT.absorb(body.synth_model, r.get("content", ""), r.get("usage"))
    await _record_usage(body.user_id, body.synth_model, r.get("usage", {}), "synthesis")
    return {"synthesis": r}


# ---------- Inspector (PCNA / PTCA / EDCM / Memory) ----------
@api.get("/inspector/snapshot")
async def inspector_snapshot():
    return {
        "agent_card": AGENT.card(),
    }


@api.post("/inspector/heartbeat")
async def inspector_heartbeat(intent: Optional[str] = Body(default=None, embed=True)):
    return AGENT.engine.heartbeat(intent=intent)


# ---------- Detachable Agents ----------
@api.get("/agents")
async def list_agents():
    out = []
    async for d in agents_col.find({}).sort("created_at", -1):
        out.append({"id": d["_id"], **{k: d[k] for k in d if k != "_id"}})
    return {"agents": out}


@api.post("/agents")
async def create_agent(body: AgentExport):
    existing = await agents_col.find_one({"slug": body.slug})
    if existing:
        raise HTTPException(409, "slug already exists")
    _id = new_id()
    now = _utc_now_iso()
    doc = {"_id": _id, **body.model_dump(), "created_at": now, "updated_at": now}
    await agents_col.insert_one(doc)
    return {"id": _id, **{k: v for k, v in doc.items() if k != "_id"}}


@api.get("/agents/{slug}/manifest")
async def agent_manifest(slug: str):
    d = await agents_col.find_one({"slug": slug})
    if not d:
        raise HTTPException(404, "agent not found")
    manifest = {
        "manifest_version": "a0p-agent-v0",
        "slug": d["slug"],
        "name": d["name"],
        "description": d.get("description", ""),
        "system_context": d.get("system_context", ""),
        "persona": d.get("persona", ""),
        "default_models": d.get("default_models", []),
        "capabilities": d.get("capabilities", []),
        "aimmh_pattern": d.get("aimmh_pattern", "fan_out"),
        "rounds": d.get("rounds", 1),
        "tier": "premium" if d.get("is_premium") else "free",
        "exported_at": _utc_now_iso(),
    }
    return manifest


@api.delete("/agents/{slug}")
async def delete_agent(slug: str):
    r = await agents_col.delete_one({"slug": slug})
    return {"ok": r.deleted_count == 1}


# ---------- Usage log ----------
@api.get("/usage")
async def list_usage(user_id: str = "local", limit: int = 100):
    out = []
    async for d in usage_col.find({"user_id": user_id}).sort("created_at", -1).limit(limit):
        out.append({"id": d["_id"], **{k: d[k] for k in d if k != "_id"}})
    agg = {"total_tokens": 0, "calls": 0, "by_provider": {}, "by_model": {}}
    for u in out:
        agg["calls"] += 1
        t = (u.get("usage") or {}).get("total", 0) or 0
        agg["total_tokens"] += t
        prov = (u.get("model_id") or "").split(":", 1)[0] or "unknown"
        agg["by_provider"][prov] = agg["by_provider"].get(prov, 0) + t
        agg["by_model"][u.get("model_id", "?")] = agg["by_model"].get(u.get("model_id", "?"), 0) + t
    return {"records": out, "aggregate": agg}


app.include_router(api)


# ---------- startup ----------
@app.on_event("startup")
async def _on_startup():
    await ensure_indexes()
    # Seed a few starter detachable agents if the collection is empty.
    n = await agents_col.count_documents({})
    if n == 0:
        starters: list[AgentExport] = [
            AgentExport(slug="research-council", name="Research Council",
                        description="Three frontier models confer on a question, then each synthesizes the panel's view.",
                        system_context="You are a careful, source-aware research assistant. Cite reasoning steps explicitly.",
                        default_models=["emergent:openai:gpt-5", "emergent:anthropic:claude-sonnet-4-5", "emergent:gemini:gemini-2.5-flash"],
                        capabilities=["math", "literature", "synthesis"],
                        aimmh_pattern="council", rounds=1, is_premium=False),
            AgentExport(slug="daisy-prover", name="Daisy Prover",
                        description="Two models pass a proof attempt back and forth, refining each round.",
                        system_context="You are a rigorous mathematical prover. Critique the prior step before extending it.",
                        default_models=["emergent:openai:gpt-5", "emergent:anthropic:claude-sonnet-4-5"],
                        capabilities=["proofs", "critique"],
                        aimmh_pattern="daisy_chain", rounds=3, is_premium=False),
            AgentExport(slug="zfae-classic", name="ZFAE Classic (Φ Ψ Ω)",
                        description="Single persistent agent over the PTCA(157) phi/psi/omega cores.",
                        system_context="You are ZFAE — the zeta-function alpha-echo agent. Be exploratory and link concepts.",
                        default_models=["emergent:openai:gpt-5-mini"],
                        capabilities=["exploration", "linking"],
                        aimmh_pattern="fan_out", rounds=1, is_premium=False),
            AgentExport(slug="premium-symphony", name="Premium · Symphony",
                        description="(Coming soon) — Six-model orchestrated round with PCNA-EDCM scoring loop.",
                        system_context="",
                        default_models=[],
                        capabilities=["pcna-edcm", "scoring"],
                        aimmh_pattern="room_synthesized", rounds=3, is_premium=True),
        ]
        now = _utc_now_iso()
        for a in starters:
            await agents_col.insert_one({"_id": new_id(), **a.model_dump(),
                                         "created_at": now, "updated_at": now})
