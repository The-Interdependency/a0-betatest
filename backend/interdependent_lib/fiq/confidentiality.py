# ratios: loc_comments=104:47 imports_exports=6:4 calls_definitions=38:7
# === MODULE_BUILD ===
# id: fiq_confidentiality
#   module_name: confidentiality
#   module_kind: service
#   summary: shared recursive audit redaction and bounded-retention policy for every fiq persistence path
#   owner: Erin Spencer
#   public_surface: redact_payload, audit_retention_days, audit_expiry, AUDIT_RETENTION_DAYS_DEFAULT, REDACTED
#   internal_surface: _normalized_key, _secret_key, _redact_string, _redacted_key
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   tests: backend.tests.test_audit_storage_confidentiality
#   rollout: default_enabled
#   rollback: restore local helpers in each audit writer
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: fiq_confidentiality_boundaries
#   summary: transforms in-memory audit values and calculates expiry without persisting or transmitting user data
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   owner: Erin Spencer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: fiq_confidentiality
#   summary: recursively redact secret-shaped audit keys and values and calculate bounded UTC expiry
#   exposes: redact_payload, audit_retention_days, audit_expiry
#   boundaries: auth:none, storage:none, network:none, user_data:read
#   owner: Erin Spencer
# === END CAPABILITIES ===
# === CONTRACTS ===
# id: fiq_audit_payload_redacted
#   given: an audit payload contains nested secret-shaped fields, labels, or values
#   then: the shared confidentiality boundary removes them before any audit writer hashes or persists the record
#   class: confidentiality
# id: fiq_audit_retention_bounded
#   given: an audit event is persisted by a fiq audit writer
#   then: it receives a UTC expiry constrained by the configured 1-to-365-day retention policy
#   class: retention
# === END CONTRACTS ===
"""Shared confidentiality and retention policy for fiq audit writers."""
from __future__ import annotations

import math
import os
import re
from datetime import datetime, timedelta, timezone
from typing import Any, Optional


AUDIT_RETENTION_DAYS_DEFAULT = 30
REDACTED = "[REDACTED]"

_SECRET_KEYS = frozenset({
    "api_key", "apikey", "args", "arguments", "auth", "authentication", "authorization",
    "body", "cookie", "credentials", "database_url", "dsn", "env", "environment", "headers",
    "key", "mongo_url", "params", "passphrase", "password", "preview", "private_key",
    "proxy_authorization", "raw_request", "redis_url", "refresh_token", "request_headers",
    "response_headers", "result", "result_preview", "secret", "set_cookie", "token",
    "webhook_secret", "webhook_token",
})
_SECRET_VALUE_PATTERNS = (
    re.compile(r"(?i)\b(?:bearer|basic)\s+[^\s,;]+"),
    re.compile(r"(?i)\b(?:set-cookie|cookie)\s*:\s*[^\r\n]+"),
    re.compile(
        r"(?i)\b(?:api[_-]?key|access[_-]?token|refresh[_-]?token|client[_-]?secret|"
        r"password|secret|token|x-amz-(?:credential|signature|security-token))=([^&\s;]+)"
    ),
    re.compile(r"(?i)\b[a-z][a-z0-9+.-]*://[^/\s:@]+:[^@\s/]+@[^/\s]+"),
    re.compile(r"\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b"),
    re.compile(r"\bAKIA[A-Z0-9]{12,}\b"),
    re.compile(
        r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----.*?"
        r"-----END (?:RSA |EC |OPENSSH )?PRIVATE KEY-----",
        re.DOTALL,
    ),
    re.compile(r"\b(?:sk|gh[pousr]|a0p_mcp)_[A-Za-z0-9_-]{8,}\b"),
    re.compile(r"\bsk-[A-Za-z0-9_-]{8,}\b"),
    re.compile(r"\b(?:AIza[0-9A-Za-z_-]{20,}|xox[baprs]-[A-Za-z0-9-]{8,}|glpat-[A-Za-z0-9_-]{8,})\b"),
)


def _normalized_key(value: Any) -> str:
    split_camel = re.sub(r"([a-z0-9])([A-Z])", r"\1_\2", str(value))
    return re.sub(r"[^a-z0-9]+", "_", split_camel.lower()).strip("_")


def _secret_key(value: Any) -> bool:
    key = _normalized_key(value)
    segments = set(key.split("_"))
    return (
        key in _SECRET_KEYS
        or key.endswith(("_api_key", "_password", "_passphrase", "_private_key", "_secret", "_token"))
        or key in {"environment_variables", "environment_vars", "env_variables", "env_vars"}
        or "secret" in segments
        or "password" in segments
        or "passphrase" in segments
        or "token" in segments
        or "credential" in segments
        or "credentials" in segments
        or "cookie" in segments
        or "webhook" in segments
        or "env" in segments
        or "environment" in segments
        or "api_key" in key
        or "access_key" in key
        or key.startswith("auth_")
        or key.startswith("webhook_")
    )


def _redact_string(value: str) -> str:
    redacted = value
    for pattern in _SECRET_VALUE_PATTERNS:
        redacted = pattern.sub(REDACTED, redacted)
    return redacted


def _redacted_key(value: Any) -> str:
    """Remove credential-shaped material used as a mapping key."""
    return _redact_string(str(value))


def redact_payload(value: Any) -> Any:
    """Recursively remove secret material and sensitive tool arguments."""
    if isinstance(value, dict):
        return {
            _redacted_key(key): (REDACTED if _secret_key(key) else redact_payload(item))
            for key, item in value.items()
        }
    if isinstance(value, (list, tuple)):
        return [redact_payload(item) for item in value]
    if isinstance(value, str):
        return _redact_string(value)
    return value


def audit_retention_days() -> int:
    raw = os.environ.get("A0P_AUDIT_RETENTION_DAYS", str(AUDIT_RETENTION_DAYS_DEFAULT))
    try:
        days = int(raw)
    except ValueError as exc:
        raise RuntimeError("A0P_AUDIT_RETENTION_DAYS must be an integer") from exc
    if not 1 <= days <= 365:
        raise RuntimeError("A0P_AUDIT_RETENTION_DAYS must be between 1 and 365")
    return days


def audit_expiry(timestamp_ms: Optional[int] = None) -> datetime:
    now = datetime.now(timezone.utc)
    created = now
    if timestamp_ms is not None and not isinstance(timestamp_ms, bool):
        try:
            numeric_ms = float(timestamp_ms)
            if math.isfinite(numeric_ms):
                created = datetime.fromtimestamp(numeric_ms / 1000, tz=timezone.utc)
        except (OSError, OverflowError, TypeError, ValueError):
            created = now
    if created > now:
        created = now
    return created + timedelta(days=audit_retention_days())


__all__ = [
    "redact_payload", "audit_retention_days", "audit_expiry",
    "AUDIT_RETENTION_DAYS_DEFAULT", "REDACTED",
]

# ratios: loc_comments=104:47 imports_exports=6:4 calls_definitions=38:7
