# ratios: loc_comments=296:83 imports_exports=11:15 calls_definitions=82:21
# === MODULE_BUILD ===
# id: zfae_overrides
#   module_name: overrides
#   module_kind: service
#   summary: owner-scoped pending overrides with typed non-secret request summaries, keyed exact-action binding, minimal public views, and legacy raw-request scrubbing
#   owner: Erin Spencer
#   public_surface: OverrideRequestSummary, PendingOverride, summarize_request, request_matches, public_view, create_override, approve, consume_approved, reject, expire, get, list_for_user, list_pending, scrub_legacy_raw_requests, OVERRIDE_DEFAULT_TIMEOUT_MS
#   internal_surface: _utc_now_ms, _canonical_request, _action_fingerprint, _safe_label, _safe_argument_name, _coerce_summary, _from_doc
#   auth_boundary: none
#   storage_boundary: write
#   network_boundary: internal
#   user_data_boundary: write
#   admin_only: false
#   tests: backend.tests.test_audit_override_confidentiality
#   rollout: default_enabled
#   rollback: drop pending_overrides_col; halts become hard FIQ_BLOCKED with no resume
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: zfae_overrides_boundaries
#   summary: owner-scoped override records retain only typed summaries and keyed action fingerprints; admin-only expiry maintenance
#   auth_boundary: none
#   storage_boundary: write
#   network_boundary: internal
#   user_data_boundary: write
#   admin_only: false
#   owner: Erin Spencer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: zfae_overrides
#   summary: confidential sentinel halt-and-override lifecycle with owner and exact-action binding
#   exposes: OverrideRequestSummary, PendingOverride, summarize_request, request_matches, public_view, create_override, approve, consume_approved, reject, expire, get, list_for_user, list_pending, scrub_legacy_raw_requests
#   boundaries: auth:none, storage:write, network:internal, user_data:write
#   owner: Erin Spencer
# === END CAPABILITIES ===
"""Sentinel halt-and-override lifecycle.

Every flagged sentinel verdict creates one PendingOverride. User explicitly
approves or rejects; rejected becomes FIQ_BLOCKED. Expired becomes
FIQ_BLOCKED with reason 'user_override_timeout'.
"""
from __future__ import annotations
import hashlib
import hmac
import json
import os
import re
import time
import uuid
from dataclasses import asdict, dataclass, field
from typing import Any, Optional

from ..fiq.confidentiality import REDACTED, redact_payload

OVERRIDE_DEFAULT_TIMEOUT_MS: int = 24 * 60 * 60 * 1000   # 24 hours


def _utc_now_ms() -> int:
    return int(time.time() * 1000)


@dataclass
class OverrideRequestSummary:
    """Non-secret metadata retained for a held request."""
    schema_version: int
    event_kind: str
    content_bytes: int
    mode: Optional[str] = None
    tool: Optional[str] = None
    argument_names: list[str] = field(default_factory=list)


@dataclass
class PendingOverride:
    """A held action awaiting user explicit approval or rejection."""
    id: str
    agent_id: str
    user_id: str
    event_kind: str                          # chat_reply | training_step | instance_create | …
    request_summary: OverrideRequestSummary # typed metadata; never prompt/args/body
    action_fingerprint: str                  # internal keyed digest; never returned
    flagged_sentinels: list[str]             # e.g. ["S4", "S12"]
    reasons: dict[str, str]                  # per-sentinel flag reason
    verdict_vector: list[Optional[float]]    # 13-dim, with null for off-mode
    disabled_sentinels: list[str]            # mode == off for this turn
    blocking_cliff: bool                     # True iff any cliff sentinel flagged
    status: str                              # pending | approved | consumed | rejected | expired
    created_ms: int
    expires_ms: int
    resolved_ms: Optional[int] = None
    consumed_ms: Optional[int] = None
    resolved_by_user_id: Optional[str] = None
    justification: Optional[str] = None
    rejection_reason: Optional[str] = None


_SENSITIVE_ARGUMENT_NAMES = frozenset({
    "api_key", "apikey", "authorization", "cookie", "credentials", "env",
    "environment", "password", "passphrase", "private_key", "secret", "token",
    "webhook_secret", "webhook_token",
})


def _canonical_request(event_kind: str, raw_request: dict) -> bytes:
    return json.dumps(
        {"event_kind": event_kind, "request": raw_request},
        sort_keys=True,
        separators=(",", ":"),
        default=str,
    ).encode("utf-8")


def _action_fingerprint(event_kind: str, raw_request: dict) -> str:
    secret = os.environ.get("A0P_OVERRIDE_FINGERPRINT_SECRET") or os.environ.get("A0P_KEY_VAULT_SECRET")
    if not secret:
        raise RuntimeError("A0P_OVERRIDE_FINGERPRINT_SECRET or A0P_KEY_VAULT_SECRET is required")
    return hmac.new(secret.encode("utf-8"), _canonical_request(event_kind, raw_request), hashlib.sha256).hexdigest()


def _safe_label(value: Any, max_length: int) -> Optional[str]:
    """Bound a public metadata label and remove credential-shaped literals."""
    if not isinstance(value, str):
        return None
    label = value[:max_length]
    redacted = redact_payload(label)
    return redacted if isinstance(redacted, str) else REDACTED


def _safe_argument_name(value: Any) -> str:
    name = str(value)[:64]
    if redact_payload(name) != name:
        return "[sensitive]"
    split_camel = re.sub(r"([a-z0-9])([A-Z])", r"\1_\2", name)
    normalized = re.sub(r"[^a-z0-9]+", "_", split_camel.lower()).strip("_")
    segments = set(normalized.split("_"))
    if (
        normalized in _SENSITIVE_ARGUMENT_NAMES
        or normalized.endswith(("_password", "_secret", "_token", "_key"))
        or segments.intersection({
            "authorization", "cookie", "credential", "credentials", "env", "environment",
            "passphrase", "password", "secret", "token", "webhook",
        })
    ):
        return "[sensitive]"
    return name


def summarize_request(event_kind: str, raw_request: dict) -> OverrideRequestSummary:
    """Reduce an ephemeral sentinel request to non-secret typed metadata."""
    raw_request = raw_request if isinstance(raw_request, dict) else {}
    summary_request = {key: value for key, value in raw_request.items() if key != "_tool_binding"}
    canonical = _canonical_request(event_kind, summary_request)
    mode = raw_request.get("mode")
    mode = mode if isinstance(mode, str) and mode in {"teacher_assisted", "zfae_native"} else None
    tool = _safe_label(raw_request.get("tool"), 120)
    params = raw_request.get("params")
    argument_names = []
    if isinstance(params, dict):
        argument_names = sorted({_safe_argument_name(k) for k in params})
    return OverrideRequestSummary(
        schema_version=1,
        event_kind=event_kind,
        content_bytes=len(canonical),
        mode=mode,
        tool=tool,
        argument_names=argument_names,
    )


def _coerce_summary(value: Any, event_kind: str) -> OverrideRequestSummary:
    """Normalize stored summary metadata without trusting legacy BSON types."""
    data = value if isinstance(value, dict) else {}
    try:
        content_bytes = max(0, int(data.get("content_bytes", 0)))
    except (TypeError, ValueError):
        content_bytes = 0
    mode = data.get("mode")
    mode = mode if isinstance(mode, str) and mode in {"teacher_assisted", "zfae_native"} else None
    tool = _safe_label(data.get("tool"), 120)
    names = data.get("argument_names")
    argument_names = sorted({_safe_argument_name(name) for name in names}) if isinstance(names, list) else []
    return OverrideRequestSummary(
        schema_version=1,
        event_kind=str(data.get("event_kind") or event_kind)[:64],
        content_bytes=content_bytes,
        mode=mode,
        tool=tool,
        argument_names=argument_names,
    )


def request_matches(rec: PendingOverride, event_kind: str, raw_request: dict) -> bool:
    """Bind an approval to the exact action without retaining that action."""
    if rec.event_kind != event_kind or not rec.action_fingerprint:
        return False
    expected = _action_fingerprint(event_kind, raw_request)
    return hmac.compare_digest(rec.action_fingerprint, expected)


def public_view(rec: PendingOverride) -> dict:
    """Return the explicit owner-facing override response shape."""
    return {
        "id": rec.id,
        "agent_id": rec.agent_id,
        "event_kind": rec.event_kind,
        "request_summary": asdict(rec.request_summary),
        "flagged_sentinels": rec.flagged_sentinels,
        "reasons": rec.reasons,
        "verdict_vector": rec.verdict_vector,
        "disabled_sentinels": rec.disabled_sentinels,
        "blocking_cliff": rec.blocking_cliff,
        "status": rec.status,
        "created_ms": rec.created_ms,
        "expires_ms": rec.expires_ms,
        "resolved_ms": rec.resolved_ms,
        "consumed_ms": rec.consumed_ms,
    }


async def create_override(
    col,
    *,
    agent_id: str,
    user_id: str,
    event_kind: str,
    raw_request: dict,
    flagged_sentinels: list[str],
    reasons: dict[str, str],
    verdict_vector: list[Optional[float]],
    disabled_sentinels: list[str],
    blocking_cliff: bool,
    timeout_ms: int = OVERRIDE_DEFAULT_TIMEOUT_MS,
) -> PendingOverride:
    if timeout_ms <= 0:
        raise ValueError("timeout_ms must be positive")
    now = _utc_now_ms()
    rec = PendingOverride(
        id=str(uuid.uuid4()),
        agent_id=agent_id,
        user_id=user_id,
        event_kind=event_kind,
        request_summary=summarize_request(event_kind, raw_request),
        action_fingerprint=_action_fingerprint(event_kind, raw_request),
        flagged_sentinels=flagged_sentinels,
        reasons=reasons,
        verdict_vector=verdict_vector,
        disabled_sentinels=disabled_sentinels,
        blocking_cliff=blocking_cliff,
        status="pending",
        created_ms=now,
        expires_ms=now + timeout_ms,
    )
    doc = asdict(rec)
    doc["_id"] = doc.pop("id")
    await col.insert_one(doc)
    return rec


async def approve(col, override_id: str, user_id: str, justification: str = "") -> Optional[PendingOverride]:
    # Scope by owner (user_id) as well as id+status: a pending safety override
    # may only be resolved by the user who owns it. Without the user_id
    # predicate any authenticated caller holding another user's override id
    # could approve their gate. The owner is also recorded as the resolver.
    now = _utc_now_ms()
    r = await col.find_one_and_update(
        {
            "_id": override_id,
            "status": "pending",
            "user_id": user_id,
            "expires_ms": {"$gt": now},
        },
        {"$set": {
            "status": "approved",
            "resolved_ms": now,
            "resolved_by_user_id": user_id,
            "justification": justification,
        }},
        return_document=True,
    )
    return _from_doc(r)


async def consume_approved(
    col,
    override_id: str,
    user_id: str,
    agent_id: str,
    event_kind: str,
    raw_request: dict,
) -> Optional[PendingOverride]:
    """Atomically consume one unexpired approval bound to the exact action."""
    now = _utc_now_ms()
    r = await col.find_one_and_update(
        {
            "_id": override_id,
            "user_id": user_id,
            "agent_id": agent_id,
            "event_kind": event_kind,
            "action_fingerprint": _action_fingerprint(event_kind, raw_request),
            "status": "approved",
            "expires_ms": {"$gt": now},
        },
        {"$set": {"status": "consumed", "consumed_ms": now}},
        return_document=True,
    )
    return _from_doc(r)


async def reject(col, override_id: str, user_id: str, reason: str = "") -> Optional[PendingOverride]:
    # Scope by owner (user_id) as well as id+status — see approve().
    now = _utc_now_ms()
    r = await col.find_one_and_update(
        {"_id": override_id, "status": "pending", "user_id": user_id},
        {"$set": {
            "status": "rejected",
            "resolved_ms": now,
            "resolved_by_user_id": user_id,
            "rejection_reason": reason,
        }},
        return_document=True,
    )
    return _from_doc(r)


async def expire(col) -> int:
    """Expire stale records. Callers must enforce the internal/admin boundary."""
    now = _utc_now_ms()
    query = {"status": {"$in": ["pending", "approved"]}, "expires_ms": {"$lt": now}}
    r = await col.update_many(
        query,
        {"$set": {"status": "expired", "resolved_ms": now}},
    )
    return r.modified_count


async def get(col, override_id: str, user_id: str) -> Optional[PendingOverride]:
    doc = await col.find_one({"_id": override_id, "user_id": user_id})
    return _from_doc(doc)


async def list_for_user(col, user_id: str, status: str = "pending", limit: int = 100) -> list[PendingOverride]:
    out: list[PendingOverride] = []
    async for doc in col.find({"user_id": user_id, "status": status}).sort("created_ms", -1).limit(limit):
        rec = _from_doc(doc)
        if rec:
            out.append(rec)
    return out


async def list_pending(col, user_id: str, limit: int = 100) -> list[PendingOverride]:
    return await list_for_user(col, user_id, status="pending", limit=limit)


async def scrub_legacy_raw_requests(col) -> int:
    """Replace pre-repair raw requests with summaries and keyed fingerprints."""
    migrated = 0
    async for doc in col.find({"raw_request": {"$exists": True}}):
        has_typed_raw = isinstance(doc.get("raw_request"), dict)
        raw_request = doc.get("raw_request") if has_typed_raw else {}
        event_kind = str(doc.get("event_kind") or "unknown")
        result = await col.update_one(
            {"_id": doc.get("_id"), "raw_request": {"$exists": True}},
            {
                "$set": {
                    "request_summary": asdict(summarize_request(event_kind, raw_request)),
                    "action_fingerprint": _action_fingerprint(event_kind, raw_request) if has_typed_raw else "",
                },
                "$unset": {"raw_request": ""},
            },
        )
        migrated += int(getattr(result, "modified_count", 0))
    return migrated


def _from_doc(doc: Optional[dict]) -> Optional[PendingOverride]:
    if doc is None:
        return None
    doc = dict(doc)
    if "_id" in doc:
        doc["id"] = doc.pop("_id")
    if "request_summary" not in doc:
        has_typed_raw = isinstance(doc.get("raw_request"), dict)
        raw_request = doc.get("raw_request") if has_typed_raw else {}
        doc["request_summary"] = summarize_request(str(doc.get("event_kind") or "unknown"), raw_request)
        doc["action_fingerprint"] = (
            _action_fingerprint(str(doc.get("event_kind") or "unknown"), raw_request)
            if has_typed_raw else ""
        )
    else:
        doc["request_summary"] = _coerce_summary(doc["request_summary"], str(doc.get("event_kind") or "unknown"))
    doc.setdefault("action_fingerprint", "")
    return PendingOverride(**{k: v for k, v in doc.items() if k in PendingOverride.__annotations__})


__all__ = [
    "OverrideRequestSummary", "PendingOverride", "OVERRIDE_DEFAULT_TIMEOUT_MS",
    "summarize_request", "request_matches", "public_view",
    "create_override", "approve", "consume_approved", "reject", "expire", "get", "list_for_user", "list_pending",
    "scrub_legacy_raw_requests",
]

# === CONTRACTS ===
# id: zfae_overrides_loads
#   given: module declares its msdmd canon
#   then: the module imports cleanly under the current interpreter
#   class: integration
#   call: a0p_skills.contracts.module_imports_cleanly_holds
# === END CONTRACTS ===

# === CONTRACTS ===
# id: zfae_override_lookup_owner_scoped
#   given: an override id and authenticated owner id
#   then: lookup includes both identifiers and never returns another owner's record
#   class: security
# id: zfae_override_approval_single_use
#   given: an exact-action approval is unexpired
#   then: the first matching owner and agent consumes it atomically and replay fails closed
#   class: security
# id: zfae_override_raw_zero_retention
#   given: a held request is created or migrated
#   then: only typed summary metadata and a keyed action fingerprint are retained
#   class: confidentiality
# id: zfae_override_public_view_minimal
#   given: an owner-facing override response
#   then: raw material, fingerprints, owner ids, and resolution text are omitted
#   class: confidentiality
# id: zfae_override_legacy_scrub
#   given: a legacy row containing raw_request
#   then: startup migration replaces it with summary metadata and unsets raw_request
#   class: migration
# === END CONTRACTS ===

# ratios: loc_comments=296:83 imports_exports=11:15 calls_definitions=82:21
