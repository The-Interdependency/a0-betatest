# ratios: loc_comments=129:52 imports_exports=7:2 calls_definitions=41:6
# === MODULE_BUILD ===
# id: tests_audit_storage_confidentiality
#   module_name: test_audit_storage_confidentiality
#   module_kind: test
#   summary: regression evidence for shared audit redaction, bounded expiry, canonical JSONL pruning, and redacted legacy reads
#   owner: a0p maintainer
#   public_surface: none
#   internal_surface: test functions and storage doubles
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   tests: pytest_runs_this_file
#   rollout: default_enabled
#   rollback: revert only with Repair 03
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: tests_audit_storage_confidentiality_boundaries
#   summary: offline audit-storage regressions using in-memory Mongo and temporary JSONL storage
#   auth_boundary: none
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   owner: a0p maintainer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: tests_audit_storage_confidentiality
#   summary: executable evidence for audit payload confidentiality and retention
#   exposes: pytest tests
#   boundaries: auth:none, storage:none, network:none, user_data:read
#   owner: a0p maintainer
# === END CAPABILITIES ===
# DOC role: contract
# === CHECKS ===
# id: check_fiq_recursive_redaction_and_retention
#   proves: fiq_audit_payload_redacted, fiq_audit_retention_bounded
#   call: self::test_fiq_redacts_before_hash_and_sets_retention
#   requires: python3
#   timeout: 20
#   mutates: none
#   cleanup: none
# id: check_canonical_fiq_audit_confidentiality
#   proves: fiq_audit_payload_redacted, fiq_audit_retention_bounded
#   call: self::test_canonical_fiq_audit_redacts_and_bounds_storage
#   requires: python3
#   timeout: 20
#   mutates: filesystem
#   cleanup: tempdir_teardown
# === END CHECKS ===
"""Repair 03 audit-storage confidentiality and retention regressions."""
from __future__ import annotations

import json
from datetime import datetime, timedelta, timezone

import pytest


class _AuditCollection:
    def __init__(self):
        self.docs = []

    async def find_one(self, _query, **kwargs):
        if not self.docs:
            return None
        docs = sorted(self.docs, key=lambda doc: doc.get("timestamp_ms", 0), reverse=True)
        return dict(docs[0])

    async def insert_one(self, doc):
        self.docs.append(dict(doc))


@pytest.mark.asyncio
async def test_fiq_redacts_before_hash_and_sets_retention(monkeypatch):
    from interdependent_lib.zfae import fiq_emit

    monkeypatch.setenv("A0P_AUDIT_RETENTION_DAYS", "30")
    col = _AuditCollection()
    payload = {
        "authorization": "Bearer top-secret",
        "nested": {"api_key": "sk-secret-value", "safe": "visible"},
        "tools": [{"args": {"password": "p@ss"}, "note": "token=query-secret"}],
        "preview": "arbitrary tool output",
        "clientSecret": "camel-client-secret",
        "accessToken": "camel-access-token",
        "refreshToken": "camel-refresh-token",
        "privateKey": "camel-private-key",
        "AWS_SECRET_ACCESS_KEY": "aws-secret-key",
        "environmentVariables": {"DATABASE_URL": "database-secret"},
        "DATABASE_URL": "top-level-database-secret",
        "authHeader": "Basic another-secret",
        "clientCredentials": "oauth-secret",
        "databaseCredentials": "db-credential-secret",
        "sessionCookie": "cookie-secret",
        "webhookUrl": "https://hooks.example/T/B/secret-path",
        "webhookToken": "camel-webhook-token",
        "metadata": {"sk-abcdefghijklmnopqrstuvwxyz": "safe value"},
        "notes": [
            "https://example.test/callback?access_token=oauth-query-value",
            "client_secret=oauth-client-value",
            "https://s3.example.test/object?X-Amz-Signature=aws-query-value",
            "Set-Cookie: sessionid=session-cookie-value; HttpOnly",
        ],
    }
    result_hash = await fiq_emit.emit(
        col, event_type="zfae_tool_result", agent_id="agent-a", user_id="user-a", payload=payload,
    )
    stored = col.docs[0]
    serialized = json.dumps(stored, default=str)
    for forbidden in (
        "top-secret", "sk-secret-value", "p@ss", "query-secret", "arbitrary tool output",
        "camel-client-secret", "camel-access-token", "camel-refresh-token", "camel-private-key",
        "aws-secret-key", "database-secret", "top-level-database-secret", "another-secret",
        "camel-webhook-token", "oauth-secret", "db-credential-secret", "cookie-secret", "secret-path",
        "sk-abcdefghijklmnopqrstuvwxyz", "oauth-query-value", "oauth-client-value", "aws-query-value",
        "session-cookie-value",
    ):
        assert forbidden not in serialized
    assert stored["payload"]["nested"]["safe"] == "visible"
    assert stored["this_hash"] == result_hash == fiq_emit._chain_hash(stored["prev_hash"], stored)
    assert isinstance(stored["expires_at"], datetime)
    delta_days = (stored["expires_at"] - datetime.now(timezone.utc)).total_seconds() / 86400
    assert 29.9 < delta_days <= 30

    legacy = {
        "event_type": "zfae_chat_reply", "agent_id": "legacy-agent", "user_id": "legacy-user",
        "payload": {"safe": "legacy"}, "timestamp_ms": 1, "prev_hash": "0" * 32,
    }
    legacy_hash = fiq_emit._chain_hash(legacy["prev_hash"], legacy)
    legacy["expires_at"] = fiq_emit.audit_expiry(legacy["timestamp_ms"])
    assert fiq_emit._chain_hash(legacy["prev_hash"], legacy) == legacy_hash
    for malformed in ("not-a-timestamp", float("inf"), 10**100, None):
        expiry = fiq_emit.audit_expiry(malformed)
        assert isinstance(expiry, datetime)
        assert expiry <= datetime.now(timezone.utc) + timedelta(days=30, seconds=1)


def test_canonical_fiq_audit_redacts_and_bounds_storage(tmp_path, monkeypatch):
    from interdependent_lib.fiq.audit import AuditLog
    from interdependent_lib.fiq.events import FIQ_BLOCKED

    monkeypatch.setenv("A0P_AUDIT_RETENTION_DAYS", "1")
    audit_root = tmp_path / "canonical-audit"
    audit_root.mkdir()
    stale_path = audit_root / "1900-01-01.jsonl"
    stale_path.write_text(json.dumps({
        "timestamp_ms": 1,
        "payload": {"authorization": "Bearer stale-secret"},
        "this_hash": "1" * 32,
    }) + "\n", encoding="utf-8")
    legacy_secret = "Bearer retained-legacy-secret"
    legacy_label = "sk-retainedlegacytoken"
    today_path = audit_root / f"{datetime.now(timezone.utc):%Y-%m-%d}.jsonl"
    today_path.write_text(json.dumps({
        "event_type": "FIQ_BLOCKED", "gate_a": "legacy-source", "gate_b": "legacy-target",
        "support": "phi", "tick_ms": 2, "prev_hash": "0" * 32, "this_hash": "2" * 32,
        "timestamp_ms": int(datetime.now(timezone.utc).timestamp() * 1000),
        "reason": legacy_secret,
        "payload": {"authorization": legacy_secret, legacy_label: "safe value"},
    }) + "\n", encoding="utf-8")

    class _SyncMirror:
        def __init__(self):
            self.docs = []

        def insert_one(self, doc):
            self.docs.append(dict(doc))

    mirror = _SyncMirror()
    log = AuditLog(root=str(audit_root), mongo_collection=mirror)
    assert not stale_path.exists()

    secret = "Bearer canonical-audit-secret"
    secret_label = "sk-abcdefghijklmnopqrstuvwxyz"
    event = FIQ_BLOCKED(
        event_type="FIQ_BLOCKED", gate_a="source", gate_b="target", support="phi", tick_ms=3,
        reason=secret, payload={"authorization": secret, secret_label: "safe value"},
    )
    result_hash = log.append(event)

    files = list(audit_root.glob("*.jsonl"))
    assert len(files) == 1
    stored_text = files[0].read_text(encoding="utf-8")
    assert secret not in stored_text and secret_label not in stored_text
    stored = [json.loads(line) for line in stored_text.splitlines()][-1]
    assert stored["reason"] == "[REDACTED]"
    assert stored["payload"]["authorization"] == "[REDACTED]"
    assert stored["this_hash"] == result_hash
    expiry = datetime.fromisoformat(stored["expires_at"].replace("Z", "+00:00"))
    delta_days = (expiry - datetime.now(timezone.utc)).total_seconds() / 86400
    assert 0.9 < delta_days <= 1

    assert len(mirror.docs) == 1 and isinstance(mirror.docs[0]["expires_at"], datetime)
    assert secret not in json.dumps(mirror.docs[0], default=str)
    assert secret_label not in json.dumps(mirror.docs[0], default=str)
    read_view = json.dumps(list(log.iter_today()), default=str)
    assert legacy_secret not in read_view and legacy_label not in read_view
    assert log.verify() is True

# ratios: loc_comments=129:52 imports_exports=7:2 calls_definitions=41:6
