# ratios: loc_comments=61:43 imports_exports=6:2 calls_definitions=11:3
# === MODULE_BUILD ===
# id: zfae_fiq_emit
#   module_name: fiq_emit
#   module_kind: service
#   summary: ZFAE provenance emitter that recursively redacts payloads before hash-chained insertion and assigns bounded audit retention
#   owner: Erin Spencer
#   public_surface: emit, redact_payload, audit_retention_days, audit_expiry, ZFAE_EVENT_TYPES, AUDIT_RETENTION_DAYS_DEFAULT, REDACTED
#   internal_surface: _chain_hash, _last_hash
#   auth_boundary: none
#   storage_boundary: write
#   network_boundary: internal
#   user_data_boundary: write
#   admin_only: false
#   tests: backend.tests.test_audit_storage_confidentiality
#   rollout: default_enabled
#   rollback: drop calls; fiq_audit_log loses zfae provenance
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: zfae_fiq_emit_boundaries
#   summary: writes recursively redacted hash-chained docs with TTL expiry; reads only the most recent prev_hash
#   auth_boundary: none
#   storage_boundary: write
#   network_boundary: internal
#   user_data_boundary: write
#   admin_only: false
#   owner: Erin Spencer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: zfae_fiq_emit
#   summary: append redacted ZFAE provenance events with blake2b prev_hash chain and bounded retention
#   exposes: emit, redact_payload, audit_retention_days, audit_expiry, ZFAE_EVENT_TYPES
#   boundaries: auth:none, storage:write, network:internal, user_data:write
#   owner: Erin Spencer
# === END CAPABILITIES ===
# === CONTRACTS ===
# id: zfae_fiq_emit_chains
#   given: per the module's declared behaviour
#   then: the named callable returns without raising
#   class: correctness
#   call: a0p_skills.contracts.zfae_fiq_emit_chains_holds
# === END CONTRACTS ===
"""ZFAE provenance emitter — hash-chained docs in fiq_audit_log."""
from __future__ import annotations
import hashlib
import json
import time
from typing import Any, Optional

from ..fiq.confidentiality import (
    AUDIT_RETENTION_DAYS_DEFAULT,
    REDACTED,
    audit_expiry,
    audit_retention_days,
    redact_payload,
)


ZFAE_EVENT_TYPES = frozenset({
    "zfae_chat_reply",
    "zfae_training_step",
    "zfae_sentinel_verdict",
    "zfae_override_created",
    "zfae_override_resolved",
    "zfae_decode",
    "zfae_tool_call",
    "zfae_tool_result",
})


def _chain_hash(prev_hash: str, payload: dict) -> str:
    payload = {k: v for k, v in payload.items() if k not in ("this_hash", "_id", "expires_at")}
    blob = json.dumps(payload, sort_keys=True, default=str).encode("utf-8")
    return hashlib.blake2b(prev_hash.encode("utf-8") + blob, digest_size=16).hexdigest()


async def _last_hash(col) -> str:
    doc = await col.find_one(
        {}, sort=[("timestamp_ms", -1)], projection={"this_hash": 1},
    )
    if not doc or not doc.get("this_hash"):
        return "0" * 32
    return doc["this_hash"]


async def emit(
    col,
    *,
    event_type: str,
    agent_id: str,
    user_id: str = "local",
    payload: Optional[dict] = None,
) -> str:
    """Append one ZFAE provenance event. Returns its this_hash."""
    if event_type not in ZFAE_EVENT_TYPES:
        raise ValueError(f"unknown zfae event_type {event_type!r}; expected one of {sorted(ZFAE_EVENT_TYPES)}")
    prev = await _last_hash(col)
    timestamp_ms = int(time.time() * 1000)
    doc: dict[str, Any] = {
        "event_type": event_type,
        "agent_id": agent_id,
        "user_id": user_id,
        "payload": redact_payload(payload or {}),
        "timestamp_ms": timestamp_ms,
        "expires_at": audit_expiry(timestamp_ms),
        "prev_hash": prev,
    }
    doc["this_hash"] = _chain_hash(prev, doc)
    await col.insert_one(doc)
    return doc["this_hash"]


__all__ = [
    "emit", "redact_payload", "audit_retention_days", "audit_expiry",
    "ZFAE_EVENT_TYPES", "AUDIT_RETENTION_DAYS_DEFAULT", "REDACTED",
]

# ratios: loc_comments=61:43 imports_exports=6:2 calls_definitions=11:3
