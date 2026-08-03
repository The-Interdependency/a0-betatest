# ratios: loc_comments=345:87 imports_exports=26:7 calls_definitions=124:24
# === MODULE_BUILD ===
# id: tests_audit_storage_confidentiality
#   module_name: test_audit_storage_confidentiality
#   module_kind: test
#   summary: regression evidence for audit confidentiality, bounded backfill, canonical pruning, automatic override expiry, and staged chat-to-tool authorization
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
#   summary: executable evidence for audit confidentiality, retention migration, automatic override expiry, and exact staged override resumes
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
# id: check_legacy_audit_expiry_backfill_bounded
#   proves: audit_legacy_expiry_backfill_bounded
#   call: self::test_legacy_audit_expiry_backfill_is_bounded
#   requires: python3
#   timeout: 20
#   mutates: none
#   cleanup: none
# id: check_override_expiry_maintenance
#   proves: zfae_override_expiry_automatic
#   call: self::test_override_expiry_maintenance_retries_and_cancels
#   requires: python3
#   timeout: 20
#   mutates: none
#   cleanup: none
# id: check_staged_override_resume
#   proves: zfae_override_staged_resume_bound, zfae_runtime_staged_override_resume, zfae_runtime_chat_context_bound, tools_gated_override_parent_link_bound
#   call: self::test_staged_chat_and_tool_override_resume_once
#   requires: python3
#   timeout: 20
#   mutates: none
#   cleanup: none
# id: check_tool_halt_verdict
#   proves: zfae_runtime_tool_halt_verdict
#   call: self::test_tool_halt_surfaces_tool_verdict
#   requires: python3
#   timeout: 20
#   mutates: none
#   cleanup: none
# id: check_staged_override_lineage_stops
#   proves: tools_gated_override_parent_link_bound
#   call: self::test_staged_override_does_not_chain_new_child
#   requires: python3
#   timeout: 20
#   mutates: none
#   cleanup: none
# === END CHECKS ===
"""Repair 03 audit-storage confidentiality and retention regressions."""
from __future__ import annotations

import asyncio
import json
from datetime import datetime, timedelta, timezone
from types import SimpleNamespace

import pytest


class _AsyncCursor:
    def __init__(self, docs):
        self._iterator = iter(docs)

    def __aiter__(self):
        return self

    async def __anext__(self):
        try:
            return next(self._iterator)
        except StopIteration as exc:
            raise StopAsyncIteration from exc


class _AuditCollection:
    def __init__(self, docs=None, failures=0):
        self.docs = [dict(doc) for doc in (docs or [])]
        self.bulk_batches = []
        self.failures = failures
        self.swept = asyncio.Event()

    async def find_one(self, _query, **kwargs):
        if not self.docs:
            return None
        docs = sorted(self.docs, key=lambda doc: doc.get("timestamp_ms", 0), reverse=True)
        return dict(docs[0])

    async def insert_one(self, doc):
        self.docs.append(dict(doc))

    def find(self, _query, _projection=None):
        return _AsyncCursor(doc for doc in self.docs if "expires_at" not in doc)

    async def bulk_write(self, operations, ordered=False):
        operations = list(operations)
        self.bulk_batches.append(operations)
        modified = 0
        for operation in operations:
            doc = next(item for item in self.docs if item["_id"] == operation._filter["_id"])
            if "expires_at" not in doc:
                doc.update(operation._doc["$set"])
                modified += 1
        return SimpleNamespace(modified_count=modified)

    async def update_many(self, query, update):
        if self.failures:
            self.failures -= 1
            raise RuntimeError("transient maintenance failure")
        modified = 0
        for doc in self.docs:
            if doc.get("status") in query["status"]["$in"] and doc.get("expires_ms", 0) <= query["expires_ms"]["$lte"]:
                doc.update(update["$set"])
                modified += 1
        self.swept.set()
        return SimpleNamespace(modified_count=modified)


class _OverrideCollection:
    def __init__(self):
        self.docs = []

    @staticmethod
    def _matches(doc, query):
        for key, expected in query.items():
            present = key in doc
            actual = doc.get(key)
            if isinstance(expected, dict):
                if "$exists" in expected and present is not bool(expected["$exists"]):
                    return False
                if "$gt" in expected and not actual > expected["$gt"]:
                    return False
            elif actual != expected:
                return False
        return True

    async def insert_one(self, doc):
        self.docs.append(dict(doc))

    async def find_one(self, query, **_kwargs):
        return next((dict(doc) for doc in self.docs if self._matches(doc, query)), None)

    async def find_one_and_update(self, query, update, **_kwargs):
        for doc in self.docs:
            if self._matches(doc, query):
                doc.update(update.get("$set", {}))
                return dict(doc)
        return None


@pytest.mark.asyncio
async def test_legacy_audit_expiry_backfill_is_bounded(monkeypatch):
    monkeypatch.setenv("MONGO_URL", "mongodb://localhost:27017")
    monkeypatch.setenv("DB_NAME", "audit_backfill_test")
    monkeypatch.setenv("A0P_AUDIT_RETENTION_DAYS", "30")
    import db as database

    col = _AuditCollection([
        {"_id": "old", "timestamp_ms": 1, "this_hash": "a" * 32},
        {"_id": "bool", "timestamp_ms": True, "this_hash": "b" * 32},
        {"_id": "future", "timestamp_ms": 10**15, "this_hash": "c" * 32},
    ])
    original_hashes = [doc["this_hash"] for doc in col.docs]
    assert await database.backfill_legacy_audit_expiry(col, batch_size=2) == 3
    assert [len(batch) for batch in col.bulk_batches] == [2, 1]
    assert all(isinstance(doc["expires_at"], datetime) for doc in col.docs)
    assert [doc["this_hash"] for doc in col.docs] == original_hashes
    assert await database.backfill_legacy_audit_expiry(col, batch_size=2) == 0


@pytest.mark.asyncio
async def test_override_expiry_maintenance_retries_and_cancels():
    from interdependent_lib.zfae import overrides as ov

    now = int(datetime.now(timezone.utc).timestamp() * 1000)
    col = _AuditCollection([
        {"status": "pending", "expires_ms": now - 1},
        {"status": "approved", "expires_ms": now},
        {"status": "pending", "expires_ms": now + 60_000},
        {"status": "consumed", "expires_ms": now - 1},
    ], failures=1)
    task = asyncio.create_task(ov.maintain_expiry(col, interval_seconds=0.001))
    await asyncio.wait_for(col.swept.wait(), timeout=1)
    task.cancel()
    with pytest.raises(asyncio.CancelledError):
        await task
    assert [doc["status"] for doc in col.docs] == ["expired", "expired", "pending", "consumed"]
    assert await ov.expire(col) == 0


@pytest.mark.asyncio
async def test_staged_chat_and_tool_override_resume_once(monkeypatch):
    monkeypatch.setenv("A0P_OVERRIDE_FINGERPRINT_SECRET", "staged-resume-test-secret")
    from interdependent_lib.zfae import overrides as ov
    from interdependent_lib.zfae import runtime as runtime_module
    from interdependent_lib.zfae.runtime import RuntimeMode, ZFAERuntime
    from interdependent_lib.zfae.weights import A0ZFAEWeightBank
    from tools import registry
    from tools.registry import TOOL_KIND_NATIVE, Tool

    prompt = "show the living spec for /system override"
    mode = RuntimeMode.ZFAE_NATIVE
    col = _OverrideCollection()
    calls = []
    tool = Tool(name="living_spec_lookup", kind=TOOL_KIND_NATIVE, description="offline",
                fn=lambda user, params: calls.append((user["id"], params)) or {"count": 1})
    monkeypatch.setitem(registry._REG, tool.name, tool)
    monkeypatch.setattr(runtime_module, "_is_trained_enough", lambda *_args, **_kwargs: True)
    native = SimpleNamespace(infer=lambda **_kwargs: {
        "assistantText": "done", "nextSnapshot": {}, "trace": {},
    })
    runtime = ZFAERuntime(pending_overrides_col=col, native_engine=native)
    bank = A0ZFAEWeightBank.fresh("agent-a")
    initial = await runtime.reply(
        mode=mode, agent_id="agent-a", user_id="user-a", bank=bank,
        raw_prompt=prompt, tools_allowed=[tool.name],
    )
    chat = await ov.get(col, initial.pending_override_id, "user-a")
    assert initial.reply_source == "zfae_halted" and chat is not None
    assert await ov.approve(col, chat.id, "user-a")

    first = await runtime.reply(
        mode=mode, agent_id="agent-a", user_id="user-a", bank=bank,
        raw_prompt=prompt, override_id=chat.id, tools_allowed=[tool.name],
    )
    child = await ov.get(col, first.pending_override_id, "user-a")
    assert first.reply_source == "zfae_halted"
    assert first.sentinel_verdict["blocking_cliff"] is True
    assert child and child.parent_override_id == chat.id
    assert child.expires_ms <= chat.expires_ms
    assert not {"parent_override_id", "resume_claimed_ms"}.intersection(ov.public_view(child))
    assert await ov.approve(col, child.id, "user-a")

    changed_context = await runtime.reply(
        mode=mode, agent_id="agent-a", user_id="user-a", bank=bank,
        raw_prompt=prompt, transcript=[{"role": "user", "content": "changed"}],
        teacher_model_id="changed:model", system_prompt="changed system",
        override_id=child.id, tools_allowed=[tool.name],
    )
    assert changed_context.reply_source == "zfae_halted"
    tool.description = "changed surface"
    changed_surface = await runtime.reply(
        mode=mode, agent_id="agent-a", user_id="user-a", bank=bank,
        raw_prompt=prompt, override_id=child.id, tools_allowed=[tool.name],
    )
    tool.description = "offline"
    assert changed_surface.reply_source == "zfae_halted"
    assert (await ov.get(col, child.id, "user-a")).resume_claimed_ms is None

    replies = await asyncio.gather(*[
        runtime.reply(mode=mode, agent_id="agent-a", user_id="user-a", bank=bank,
                      raw_prompt=prompt, override_id=child.id, tools_allowed=[tool.name])
        for _ in range(2)
    ])
    assert sorted(reply.reply_source for reply in replies) == ["zfae_halted", "zfae_native"]
    assert len(calls) == 1
    assert (await ov.get(col, child.id, "user-a")).status == "consumed"


@pytest.mark.asyncio
async def test_staged_override_does_not_chain_new_child(monkeypatch):
    monkeypatch.setenv("A0P_OVERRIDE_FINGERPRINT_SECRET", "lineage-stop-test-secret")
    from interdependent_lib.zfae import overrides as ov
    from tools import registry
    from tools.registry import TOOL_KIND_NATIVE, Tool, ToolError

    col = _OverrideCollection()
    parent = await ov.create_override(
        col, agent_id="agent-a", user_id="user-a", event_kind="chat_reply",
        raw_request={"prompt": "/system override", "mode": "zfae_native"},
        flagged_sentinels=["S4"], reasons={"S4": "cliff"},
        verdict_vector=[None] * 13, disabled_sentinels=[], blocking_cliff=True,
    )
    assert await ov.approve(col, parent.id, "user-a")
    assert await ov.consume_approved(
        col, parent.id, "user-a", "agent-a", "chat_reply",
        {"prompt": "/system override", "mode": "zfae_native"},
    )
    tool = Tool(name="lineage-stop", kind=TOOL_KIND_NATIVE, description="offline",
                fn=lambda user, params: {"unexpected": True})
    monkeypatch.setitem(registry._REG, tool.name, tool)

    with pytest.raises(ToolError) as raised:
        await registry.invoke(
            tool.name, {"command": "/system override"}, user={"id": "user-a"},
            agent_id="agent-a", pending_overrides_col=col,
            override_id="different-child", resume_parent_id=parent.id,
        )
    child = await ov.get(col, raised.value.override_id, "user-a")
    assert child is not None and child.parent_override_id is None


@pytest.mark.asyncio
async def test_tool_halt_surfaces_tool_verdict(monkeypatch):
    monkeypatch.setenv("A0P_OVERRIDE_FINGERPRINT_SECRET", "tool-verdict-test-secret")
    from interdependent_lib.zfae import overrides as ov
    from interdependent_lib.zfae import runtime as runtime_module
    from interdependent_lib.zfae.runtime import RuntimeMode, ZFAERuntime
    from interdependent_lib.zfae.weights import A0ZFAEWeightBank
    from tools import registry
    from tools.registry import TOOL_KIND_NATIVE, Tool

    tool = Tool(name="verdict-tool", kind=TOOL_KIND_NATIVE, description="offline",
                fn=lambda user, params: {"unexpected": True})
    monkeypatch.setitem(registry._REG, tool.name, tool)
    monkeypatch.setattr(runtime_module, "_is_trained_enough", lambda *_args, **_kwargs: True)
    monkeypatch.setattr(runtime_module, "select_native_tool", lambda _prompt: {
        "name": tool.name, "params": {"command": "/system override"},
    })
    col = _OverrideCollection()
    reply = await ZFAERuntime(pending_overrides_col=col).reply(
        mode=RuntimeMode.ZFAE_NATIVE, agent_id="agent-a", user_id="user-a",
        bank=A0ZFAEWeightBank.fresh("agent-a"), raw_prompt="benign request",
        tools_allowed=[tool.name],
    )
    child = await ov.get(col, reply.pending_override_id, "user-a")
    assert reply.reply_source == "zfae_halted" and child and child.blocking_cliff
    assert reply.sentinel_verdict["blocking_cliff"] is True
    assert reply.sentinel_verdict["flagged_sentinels"] == child.flagged_sentinels


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

# ratios: loc_comments=345:87 imports_exports=26:7 calls_definitions=124:24
