# ratios: loc_comments=146:52 imports_exports=10:1 calls_definitions=59:12
# === MODULE_BUILD ===
# id: fiq_audit_log
#   module_name: audit
#   module_kind: service
#   summary: recursively redacted, retention-bounded daily JSONL fiq audit log with an expiring MongoDB mirror
#   owner: Erin Spencer
#   public_surface: AuditLog, append, iter_today, verify, last_hash
#   internal_surface: _path_for_day, _scan_last_hash, _record_expiry, _prune_expired_records, _prune_if_due, _redact_event
#   auth_boundary: admin
#   storage_boundary: write
#   network_boundary: internal
#   user_data_boundary: write
#   admin_only: false
#   tests: a0p_skills.contracts.fiq_audit_filesystem_and_mongo_holds, backend.tests.test_audit_storage_confidentiality
#   rollout: default_enabled
#   rollback: stop appending; existing log preserved
#   storage_policy: retention-bounded daily JSONL canonical + MongoDB mirror carrying UTC expiry
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: fiq_audit_log_boundaries
#   summary: redacts before hashing and prunes expired JSONL records while assigning Mongo-compatible UTC expiry
#   auth_boundary: admin
#   storage_boundary: write
#   network_boundary: internal
#   user_data_boundary: write
#   admin_only: false
#   owner: Erin Spencer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: fiq_audit_log
#   summary: append recursively redacted fiq audit events to retention-bounded JSONL and MongoDB storage
#   exposes: AuditLog, append, iter_today, verify, last_hash
#   boundaries: auth:admin, storage:write, network:internal, user_data:write
#   owner: Erin Spencer
# === END CAPABILITIES ===
# === CONTRACTS ===
# id: fiq_audit_filesystem_and_mongo
#   given: per the module's declared behaviour
#   then: the named callable returns without raising
#   class: correctness
#   call: a0p_skills.contracts.fiq_audit_filesystem_and_mongo_holds
# === END CONTRACTS ===
"""Confidentiality-preserving fiq audit log — daily JSONL + Mongo mirror."""
from __future__ import annotations
import json
import math
import os
from dataclasses import asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterator

from .confidentiality import audit_expiry, redact_payload
from .events import AuditEvent, chain_hash, verify_chain


_STORAGE_ROOT_ENV: str = "A0P_AUDIT_STORAGE_ROOT"
_DEFAULT_ROOT: str = "/app/storage/fiq_audit"


class AuditLog:
    """Retention-bounded daily JSONL log of redacted fiq audit events."""

    def __init__(self, root: str | None = None, mongo_collection=None):
        self.root = Path(root or os.environ.get(_STORAGE_ROOT_ENV, _DEFAULT_ROOT))
        self.root.mkdir(parents=True, exist_ok=True)
        self._mongo = mongo_collection  # optional read-optimised mirror
        self._prune_expired_records()
        self._last_hash: str = self._scan_last_hash()
        self._last_prune_date = datetime.now(timezone.utc).date()

    def _path_for_day(self, ts_ms: int | None = None) -> Path:
        ts = ts_ms / 1000 if ts_ms else None
        d = datetime.fromtimestamp(ts, tz=timezone.utc) if ts else datetime.now(tz=timezone.utc)
        return self.root / f"{d.strftime('%Y-%m-%d')}.jsonl"

    def _scan_last_hash(self) -> str:
        """Recover the last this_hash from the most recent file (chain continuity)."""
        files = sorted(self.root.glob("*.jsonl"))
        if not files:
            return "0" * 32
        last_file = files[-1]
        last_line = ""
        with last_file.open("r", encoding="utf-8") as f:
            for line in f:
                if line.strip():
                    last_line = line
        if not last_line:
            return "0" * 32
        try:
            d = json.loads(last_line)
            return d.get("this_hash", "0" * 32)
        except json.JSONDecodeError:
            return "0" * 32

    @staticmethod
    def _record_expiry(record: dict) -> datetime:
        """Read stored expiry or derive it from a legacy event timestamp."""
        value = record.get("expires_at")
        try:
            if isinstance(value, datetime):
                expiry = value
            elif isinstance(value, str):
                expiry = datetime.fromisoformat(value.replace("Z", "+00:00"))
            else:
                raise ValueError
            if expiry.tzinfo is None:
                expiry = expiry.replace(tzinfo=timezone.utc)
            return expiry.astimezone(timezone.utc)
        except (TypeError, ValueError):
            timestamp_ms = record.get("timestamp_ms")
            try:
                numeric_ms = float(timestamp_ms)
                if isinstance(timestamp_ms, bool) or not math.isfinite(numeric_ms):
                    raise ValueError
                datetime.fromtimestamp(numeric_ms / 1000, tz=timezone.utc)
            except (OSError, OverflowError, TypeError, ValueError):
                return datetime.min.replace(tzinfo=timezone.utc)
            return audit_expiry(numeric_ms)

    def _prune_expired_records(self) -> bool:
        """Remove expired or unreadable JSONL records; return whether storage changed."""
        now = datetime.now(timezone.utc)
        changed = False
        for path in sorted(self.root.glob("*.jsonl")):
            retained: list[str] = []
            file_changed = False
            with path.open("r", encoding="utf-8") as source:
                for line in source:
                    try:
                        record = json.loads(line)
                        keep = isinstance(record, dict) and self._record_expiry(record) > now
                    except (json.JSONDecodeError, TypeError, ValueError):
                        keep = False
                    if keep:
                        retained.append(line if line.endswith("\n") else line + "\n")
                    else:
                        file_changed = True
            if not retained:
                path.unlink()
                changed = True
                continue
            if file_changed:
                replacement = path.with_suffix(path.suffix + ".tmp")
                with replacement.open("w", encoding="utf-8") as target:
                    target.writelines(retained)
                replacement.replace(path)
                changed = True
        return changed

    def _prune_if_due(self) -> None:
        """Run filesystem retention at most once per UTC day."""
        today = datetime.now(timezone.utc).date()
        if today == self._last_prune_date:
            return
        if self._prune_expired_records():
            self._last_hash = self._scan_last_hash()
        self._last_prune_date = today

    @staticmethod
    def _redact_event(event: AuditEvent) -> None:
        """Redact every serializable event field before sealing its hash."""
        sanitized = redact_payload(asdict(event))
        for key, value in sanitized.items():
            if key not in {"prev_hash", "this_hash"} and hasattr(event, key):
                setattr(event, key, value)

    def append(self, event: AuditEvent) -> str:
        """Redact and append `event`; assign expiry to both persistence forms."""
        self._prune_if_due()
        event.prev_hash = self._last_hash
        event.this_hash = ""
        self._redact_event(event)
        event.this_hash = chain_hash(event, self._last_hash)
        path = self._path_for_day(event.timestamp_ms)
        record = {**asdict(event), "expires_at": audit_expiry(event.timestamp_ms)}
        with path.open("a", encoding="utf-8") as f:
            f.write(json.dumps(record, default=str) + "\n")
        if self._mongo is not None:
            try:
                self._mongo.insert_one({**record, "_log_path": str(path)})
            except Exception:
                pass  # mirror is non-canonical; failure does not block append
        self._last_hash = event.this_hash
        return event.this_hash

    def last_hash(self) -> str:
        return self._last_hash

    def iter_today(self) -> Iterator[dict]:
        path = self._path_for_day()
        if not path.exists():
            return
        with path.open("r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line:
                    try:
                        yield redact_payload(json.loads(line))
                    except json.JSONDecodeError:
                        continue

    def verify(self) -> bool:
        """Check prev-hash adjacency across retained current-day records."""
        # Simplified: walk today's file only for now; multi-day chain spans need a stitch.
        events: list[dict] = list(self.iter_today())
        if not events:
            return True
        prev = events[0].get("prev_hash", "0" * 32)
        for d in events:
            if d.get("prev_hash") != prev:
                return False
            prev = d.get("this_hash", "")
        return True
# ratios: loc_comments=146:52 imports_exports=10:1 calls_definitions=59:12
