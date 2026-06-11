# === MODULE_BUILD ===
# id: skills_sync
#   module_name: sync
#   module_kind: service
#   summary: pulls canonical skills from The-Interdependency/skill-lib GitHub repo — fetches the index.json, validates each entry, upserts global skills (owner_user_id=None); reverse direction (publish-back) is reserved for skills marked as publishable=True
#   owner: Erin Spencer
#   public_surface: pull_from_skill_lib, push_to_skill_lib_stub
#   internal_surface: _fetch_index, _SKILL_LIB_URL
#   auth_boundary: none
#   storage_boundary: write
#   network_boundary: external
#   user_data_boundary: read
#   admin_only: true
#   tests: a0p_skills.contracts.skills_sync_pull_holds
#   rollout: default_enabled
#   rollback: revert; the skill catalog stops auto-syncing
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: skills_sync_boundaries
#   summary: GitHub pull-sync for global skill catalog
#   auth_boundary: none
#   storage_boundary: write
#   network_boundary: external
#   user_data_boundary: read
#   admin_only: true
#   owner: Erin Spencer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: skills_sync
#   summary: skill-lib repo sync
#   exposes: pull_from_skill_lib, push_to_skill_lib_stub
#   boundaries: auth:none, storage:write, network:external, user_data:read
#   owner: Erin Spencer
# === END CAPABILITIES ===
# === CONTRACTS ===
# id: skills_sync_pull
#   given: a transient network error from GitHub
#   then: pull_from_skill_lib returns {ok:false, error:..., pulled:0} instead of raising
#   class: integration
#   call: a0p_skills.contracts.skills_sync_pull_holds
# === END CONTRACTS ===
"""Pull global skills from The-Interdependency/skill-lib."""
from __future__ import annotations
import time
from typing import Any

import httpx

from .registry import tokenize_scope, tokenize_logic, OVERLAP_THRESHOLD


_SKILL_LIB_URL = "https://raw.githubusercontent.com/The-Interdependency/skill-lib/main/index.json"


async def _fetch_index(url: str = _SKILL_LIB_URL) -> list[dict]:
    async with httpx.AsyncClient(timeout=15, follow_redirects=True) as cli:
        r = await cli.get(url)
    r.raise_for_status()
    data = r.json()
    if isinstance(data, dict) and "skills" in data:
        data = data["skills"]
    if not isinstance(data, list):
        raise ValueError("skill-lib index.json must be a list (or {skills:[...]})")
    return data


async def pull_from_skill_lib(col, url: str = _SKILL_LIB_URL) -> dict[str, Any]:
    """Pull and upsert global skills. Best-effort — network failures return a
    structured error and do not raise.

    Returns ``{ok:bool, pulled:int, skipped:int, errors:list, fetched_at_ms:int}``.
    """
    try:
        entries = await _fetch_index(url)
    except Exception as e:
        return {"ok": False, "pulled": 0, "skipped": 0,
                "errors": [f"{type(e).__name__}: {e}"], "fetched_at_ms": int(time.time() * 1000)}

    pulled = 0
    skipped = 0
    errors: list[str] = []
    now = int(time.time() * 1000)
    for ent in entries:
        try:
            name = ent["name"]
            description = ent.get("description", "")
            scope = list(ent.get("scope_tokens") or tokenize_scope(name + " " + description))
            logic = list(ent.get("logic_set_tokens") or tokenize_logic(description))
            doc = {
                "_id": ent.get("id") or f"skill_lib::{name}",
                "name": name, "description": description,
                "prompt_template": ent.get("prompt_template", ""),
                "tool_bindings": list(ent.get("tool_bindings") or []),
                "sentinel_overrides": dict(ent.get("sentinel_overrides") or {}),
                "scope_tokens": scope, "logic_set_tokens": logic,
                "owner_user_id": None, "source": "skill-lib",
                "version": str(ent.get("version", "1")),
                "created_at_ms": now, "updated_at_ms": now,
            }
            await col.update_one({"_id": doc["_id"]}, {"$set": doc}, upsert=True)
            pulled += 1
        except KeyError as e:
            skipped += 1
            errors.append(f"missing required key in skill-lib entry: {e}")
        except Exception as e:
            skipped += 1
            errors.append(f"{type(e).__name__}: {e}")
    return {"ok": True, "pulled": pulled, "skipped": skipped,
            "errors": errors, "fetched_at_ms": now}


async def push_to_skill_lib_stub(col, *, user_id: str) -> dict:
    """Reverse-direction publish stub. Returns the list of skills marked
    ``publishable=True`` along with the upstream PR URL guidance — actual git
    push happens via a separate PR (no committer credentials in this process).
    """
    pubs: list[dict] = []
    async for d in col.find({"owner_user_id": user_id, "publishable": True}):
        pubs.append({"id": d["_id"], "name": d["name"], "source": d.get("source")})
    return {
        "publish_ready": pubs,
        "next_step": ("open a PR against The-Interdependency/skill-lib's index.json "
                      "containing each of the entries above; future versions will "
                      "automate this once a SKILL_LIB_GH_TOKEN is configured."),
    }


__all__ = ["pull_from_skill_lib", "push_to_skill_lib_stub", "_SKILL_LIB_URL"]
