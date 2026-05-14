# 297:1
"""Energy routes — provider catalog, route_config management, live model discovery.

GET  /api/v1/energy/providers                              — provider list with status + route_config
PATCH /api/v1/energy/providers/{provider_id}/route-config  — admin: patch stored route_config
POST /api/v1/energy/providers/{provider_id}/discover       — admin: call provider API, sync models
POST /api/v1/energy/providers/{provider_id}/refresh-pricing — admin: sync from pricing.json
"""
import json
import os
import time
from typing import Any, Optional

import httpx
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from ._admin_gate import require_admin
from ..services.energy_registry import BUILTIN_PROVIDERS
from ..storage import storage

# DOC module: energy
# DOC label: Energy
# DOC description: Provider catalog and live model discovery. Manage role assignments, presets, and sync available models directly from provider APIs.
# DOC tier: admin
# DOC endpoint: GET /api/v1/energy/providers | List all providers with status and route_config
# DOC endpoint: PATCH /api/v1/energy/providers/{provider_id}/route-config | Patch stored route_config (admin)
# DOC endpoint: POST /api/v1/energy/providers/{provider_id}/discover | Live-discover models from provider API (admin)
# DOC endpoint: POST /api/v1/energy/providers/{provider_id}/refresh-pricing | Sync available_models from pricing.json (admin)

UI_META = {
    "tab_id": "energy",
    "label": "Energy",
    "icon": "Zap",
    "order": 7,
    "sections": [],
}

router = APIRouter(prefix="/api/v1/energy", tags=["energy"])

_PRICING_PATH = os.path.join(
    os.path.dirname(os.path.dirname(__file__)), "config", "pricing.json"
)
_PROVIDERS_PATH = os.path.join(
    os.path.dirname(os.path.dirname(__file__)), "config", "providers.json"
)
_RC_KEY = "energy:route_config:{pid}"

# xAI base URL for OpenAI-compatible model listing
_XAI_BASE = "https://api.x.ai"
_OPENAI_BASE = "https://api.openai.com"


# ---------------------------------------------------------------------------
# Storage helpers
# ---------------------------------------------------------------------------

async def _get_rc(provider_id: str) -> dict:
    toggle = await storage.get_system_toggle(_RC_KEY.format(pid=provider_id))
    if toggle and toggle.get("parameters"):
        p = toggle["parameters"]
        return p if isinstance(p, dict) else json.loads(p)
    return {}


async def _save_rc(provider_id: str, rc: dict) -> None:
    await storage.upsert_system_toggle(
        _RC_KEY.format(pid=provider_id), True, rc
    )


# ---------------------------------------------------------------------------
# Pricing / preset helpers
# ---------------------------------------------------------------------------

def _pricing_models(provider_id: str) -> list[dict]:
    try:
        with open(_PRICING_PATH, encoding="utf-8") as fh:
            doc = json.load(fh)
    except OSError:
        return []
    prov_data = doc.get("providers", {}).get(provider_id, {})
    out = []
    for m in prov_data.get("models", []):
        out.append({
            "id": m["id"],
            "context_window": m.get("context_window", 0),
            "pricing": {
                "input_per_1m": m.get("input_per_1m"),
                "output_per_1m": m.get("output_per_1m"),
                "cached_input_per_1m": m.get("cached_input_per_1m"),
            },
            "stale": False,
            "last_seen_at": None,
        })
    return out


def _provider_presets(provider_id: str) -> dict:
    try:
        with open(_PROVIDERS_PATH, encoding="utf-8") as fh:
            doc = json.load(fh)
    except OSError:
        return {}
    return doc.get("presets", {}).get(provider_id, {})


def _overlay_pricing(models: list[dict], provider_id: str) -> list[dict]:
    """Fill in pricing/context_window from pricing.json for any model that has it."""
    lookup = {m["id"]: m for m in _pricing_models(provider_id)}
    ts = int(time.time())
    for m in models:
        pm = lookup.get(m["id"])
        if pm:
            if not m.get("pricing") or not m["pricing"].get("input_per_1m"):
                m["pricing"] = pm["pricing"]
            if not m.get("context_window"):
                m["context_window"] = pm["context_window"]
        m.setdefault("last_seen_at", ts)
    return models


# ---------------------------------------------------------------------------
# Live model discovery
# ---------------------------------------------------------------------------

async def _discover_openai_compat(api_key: str, base: str) -> list[dict]:
    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.get(
            f"{base}/v1/models",
            headers={"Authorization": f"Bearer {api_key}"},
        )
        resp.raise_for_status()
        data = resp.json()
    return sorted(
        [{"id": m["id"], "context_window": 0, "pricing": {}, "stale": False}
         for m in data.get("data", []) if m.get("id")],
        key=lambda x: x["id"],
    )


async def _discover_gemini() -> list[dict]:
    from google import genai as _genai
    client = _genai.Client()
    out = []
    for m in client.models.list():
        name = getattr(m, "name", "") or ""
        mid = name.split("/")[-1] if "/" in name else name
        if not mid:
            continue
        out.append({
            "id": mid,
            "context_window": getattr(m, "input_token_limit", 0) or 0,
            "pricing": {},
            "stale": False,
        })
    return sorted(out, key=lambda x: x["id"])


async def _live_discover(provider_id: str, spec: dict) -> list[dict]:
    vendor = spec.get("vendor", "")
    env_key = spec.get("env_key", "")
    api_key = os.environ.get(env_key, "") if env_key else ""
    if not api_key and vendor != "google":
        raise HTTPException(
            status_code=400,
            detail=f"No API key configured for {provider_id} ({env_key}). "
                   f"Set the env var and retry.",
        )
    if vendor == "google":
        return await _discover_gemini()
    if vendor == "xai":
        return await _discover_openai_compat(api_key, _XAI_BASE)
    if vendor in ("openai",):
        return await _discover_openai_compat(api_key, _OPENAI_BASE)
    raise HTTPException(
        status_code=400,
        detail=f"Live discovery not yet supported for vendor={vendor!r}. "
               f"Use 'Refresh pricing' to load models from the manifest.",
    )


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@router.get("/providers")
async def list_providers() -> dict:
    """All providers with availability status and stored route_config."""
    result = []
    for pid, spec in BUILTIN_PROVIDERS.items():
        env_key = spec.get("env_key", "")
        available = bool(env_key and os.environ.get(env_key))
        rc = await _get_rc(pid)
        if not rc.get("available_models"):
            pm = _pricing_models(pid)
            if pm:
                rc["available_models"] = pm
        if not rc.get("presets"):
            rc["presets"] = _provider_presets(pid)
        result.append({
            "id": pid,
            "label": spec.get("label", pid),
            "vendor": spec.get("vendor", ""),
            "available": available,
            "active": False,
            "route_config": rc,
            "seed_updated_at": None,
        })
    return {"providers": result}


class RouteConfigPatch(BaseModel):
    model_assignments: Optional[dict] = None
    available_models: Optional[list] = None
    disabled_models: Optional[list] = None
    active_preset: Optional[str] = None
    enabled: Optional[bool] = None


@router.patch("/providers/{provider_id}/route-config")
async def patch_route_config(
    provider_id: str, request: Request, body: RouteConfigPatch
) -> dict:
    """Admin: deep-merge body fields into the stored route_config."""
    await require_admin(request)
    spec = BUILTIN_PROVIDERS.get(provider_id)
    if not spec:
        raise HTTPException(status_code=404, detail=f"Unknown provider: {provider_id}")
    rc = await _get_rc(provider_id)
    if body.model_assignments is not None:
        existing = rc.get("model_assignments") or {}
        existing.update(body.model_assignments)
        rc["model_assignments"] = existing
    if body.available_models is not None:
        rc["available_models"] = body.available_models
    if body.disabled_models is not None:
        rc["disabled_models"] = body.disabled_models
    if body.enabled is not None:
        rc["enabled"] = body.enabled
    if body.active_preset is not None:
        rc["active_preset"] = body.active_preset
        presets = _provider_presets(provider_id)
        preset_map = presets.get(body.active_preset, {})
        if preset_map:
            existing = rc.get("model_assignments") or {}
            existing.update(preset_map)
            rc["model_assignments"] = existing
    await _save_rc(provider_id, rc)
    return {"provider_id": provider_id, "route_config": rc}


@router.post("/providers/{provider_id}/discover")
async def discover_models(provider_id: str, request: Request) -> dict:
    """Admin: call provider's live API, discover all callable models, sync into route_config."""
    await require_admin(request)
    spec = BUILTIN_PROVIDERS.get(provider_id)
    if not spec:
        raise HTTPException(status_code=404, detail=f"Unknown provider: {provider_id}")
    discovered = await _live_discover(provider_id, spec)
    discovered = _overlay_pricing(discovered, provider_id)
    rc = await _get_rc(provider_id)
    existing_ids = {m["id"] for m in (rc.get("available_models") or [])}
    new_models = [m for m in discovered if m["id"] not in existing_ids]
    merged = (rc.get("available_models") or []) + new_models
    rc["available_models"] = merged
    rc["prices_updated_at"] = int(time.time())
    await _save_rc(provider_id, rc)
    return {
        "provider_id": provider_id,
        "discovered": len(discovered),
        "added": len(new_models),
        "total": len(merged),
        "models": merged,
    }


@router.post("/providers/{provider_id}/refresh-pricing")
async def refresh_pricing(provider_id: str, request: Request) -> dict:
    """Admin: re-read pricing.json and upsert into available_models."""
    await require_admin(request)
    if provider_id not in BUILTIN_PROVIDERS:
        raise HTTPException(status_code=404, detail=f"Unknown provider: {provider_id}")
    pricing = _pricing_models(provider_id)
    rc = await _get_rc(provider_id)
    existing = {m["id"]: m for m in (rc.get("available_models") or [])}
    for m in pricing:
        existing[m["id"]] = {**existing.get(m["id"], {}), **m}
    rc["available_models"] = list(existing.values())
    rc["prices_updated_at"] = int(time.time())
    await _save_rc(provider_id, rc)
    return {
        "provider_id": provider_id,
        "models": rc["available_models"],
        "prices_updated_at": rc["prices_updated_at"],
    }
# 297:1
