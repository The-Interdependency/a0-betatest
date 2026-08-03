# ratios: loc_comments=393:87 imports_exports=20:7 calls_definitions=130:28
# === MODULE_BUILD ===
# id: tests_audit_override_confidentiality
#   module_name: test_audit_override_confidentiality
#   module_kind: test
#   summary: regression evidence for owner-scoped minimal override views, audit redaction, admin gates, legacy scrubbing, and bounded retention
#   owner: a0p maintainer
#   public_surface: none
#   internal_surface: test functions and in-memory Mongo doubles
#   auth_boundary: bearer
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   tests: pytest_runs_this_file
#   rollout: default_enabled
#   rollback: revert only with Repair 03
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: tests_audit_override_confidentiality_boundaries
#   summary: offline security regression suite with throwaway credentials and in-memory collections
#   auth_boundary: bearer
#   storage_boundary: none
#   network_boundary: none
#   user_data_boundary: read
#   admin_only: false
#   owner: a0p maintainer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: tests_audit_override_confidentiality
#   summary: executable evidence for Repair 03 confidentiality and retention contracts
#   exposes: pytest tests
#   boundaries: auth:bearer, storage:none, network:none, user_data:read
#   owner: a0p maintainer
# === END CAPABILITIES ===
# DOC role: contract
# === CHECKS ===
# id: check_anonymous_audit_override_matrix
#   proves: audit_feed_owner_scoped, override_routes_minimal_owner_scoped, override_expiry_admin_only
#   call: self::test_anonymous_audit_override_matrix_401
#   requires: python3
#   timeout: 60
#   mutates: none
#   cleanup: none
# id: check_override_owner_storage_and_action_binding
#   proves: zfae_override_lookup_owner_scoped, zfae_override_raw_zero_retention, zfae_override_public_view_minimal, zfae_override_approval_single_use
#   call: self::test_override_owner_storage_and_action_binding
#   requires: python3
#   timeout: 20
#   mutates: none
#   cleanup: none
# id: check_approved_override_runtime_tool_binding
#   proves: zfae_runtime_override_owner_action_bound, tools_gated_override_owner_action_bound
#   call: self::test_approved_override_requires_owner_and_exact_action
#   requires: python3
#   timeout: 30
#   mutates: none
#   cleanup: none
# id: check_override_legacy_raw_scrub
#   proves: zfae_override_legacy_scrub, zfae_override_raw_zero_retention
#   call: self::test_legacy_raw_request_is_scrubbed
#   requires: python3
#   timeout: 20
#   mutates: none
#   cleanup: none
# id: check_audit_owner_and_admin_views
#   proves: audit_feed_owner_scoped, admin_audit_feed_role_gated
#   call: self::test_audit_owner_isolation_and_admin_redaction
#   requires: python3
#   timeout: 20
#   mutates: none
#   cleanup: none
# id: check_admin_expiry_boundary
#   proves: override_expiry_admin_only
#   call: self::test_expiry_is_admin_only_and_expired_only
#   requires: python3
#   timeout: 20
#   mutates: none
#   cleanup: none
# id: check_audit_override_indexes
#   proves: audit_override_indexes_present
#   call: self::test_audit_override_index_contract
#   requires: python3
#   timeout: 20
#   mutates: none
#   cleanup: none
# === END CHECKS ===
"""Repair 03 acceptance tests: audit-feed and override confidentiality."""
from __future__ import annotations

import importlib
import json
import os
from datetime import datetime, timezone
from pathlib import Path
from types import SimpleNamespace

import httpx
import pytest
from cryptography.fernet import Fernet
from fastapi import HTTPException
from starlette.requests import Request


def _configure_environment(tmp_path: Path) -> None:
    os.environ.setdefault("MONGO_URL", "mongodb://localhost:27017")
    os.environ.setdefault("DB_NAME", "audit_override_test")
    os.environ.setdefault("JWT_SECRET", "audit-override-test-secret-not-production")
    os.environ.setdefault("CORS_ORIGINS", "http://localhost:3000")
    os.environ.setdefault("A0P_KEY_VAULT_SECRET", Fernet.generate_key().decode())
    os.environ.setdefault("A0P_AUDIT_RETENTION_DAYS", "30")
    os.environ.setdefault("A0P_AGENTS_ROOT", str(tmp_path / "agents"))
    os.environ.setdefault("A0P_AUDIT_STORAGE_ROOT", str(tmp_path / "audit"))
    os.environ.setdefault("A0P_TRAFFIC_LOG", str(tmp_path / "traffic.log"))


def _request(path: str = "/") -> Request:
    return Request({
        "type": "http",
        "method": "GET",
        "path": path,
        "headers": [],
        "query_string": b"",
        "server": ("test", 80),
        "client": ("127.0.0.1", 1),
        "scheme": "http",
    })


def _matches(doc: dict, query: dict) -> bool:
    for key, expected in query.items():
        present = key in doc
        actual = doc.get(key)
        if isinstance(expected, dict):
            if "$exists" in expected and present is not bool(expected["$exists"]):
                return False
            if "$lt" in expected and not (actual < expected["$lt"]):
                return False
            if "$gt" in expected and not (actual > expected["$gt"]):
                return False
            if "$in" in expected and actual not in expected["$in"]:
                return False
            if "$regex" in expected:
                import re
                if re.search(expected["$regex"], str(actual or "")) is None:
                    return False
        elif actual != expected:
            return False
    return True


class _Cursor:
    def __init__(self, docs):
        self.docs = [dict(doc) for doc in docs]

    def sort(self, key, direction):
        self.docs.sort(key=lambda doc: doc.get(key, 0), reverse=direction < 0)
        return self

    def limit(self, value):
        self.docs = self.docs[:value]
        return self

    def __aiter__(self):
        self._iterator = iter(self.docs)
        return self

    async def __anext__(self):
        try:
            return next(self._iterator)
        except StopIteration as exc:
            raise StopAsyncIteration from exc


class _Collection:
    def __init__(self, docs=None):
        self.docs = [dict(doc) for doc in (docs or [])]
        self.queries = []
        self.indexes = []

    async def insert_one(self, doc):
        self.docs.append(dict(doc))
        return SimpleNamespace(inserted_id=doc.get("_id"))

    async def find_one(self, query, **kwargs):
        self.queries.append(dict(query))
        matches = [doc for doc in self.docs if _matches(doc, query)]
        if kwargs.get("sort"):
            for key, direction in reversed(kwargs["sort"]):
                matches.sort(key=lambda doc: doc.get(key, 0), reverse=direction < 0)
        return dict(matches[0]) if matches else None

    def find(self, query, *args, **kwargs):
        self.queries.append(dict(query))
        return _Cursor(doc for doc in self.docs if _matches(doc, query))

    async def update_one(self, query, update):
        self.queries.append(dict(query))
        for doc in self.docs:
            if _matches(doc, query):
                doc.update(update.get("$set", {}))
                for key in update.get("$unset", {}):
                    doc.pop(key, None)
                return SimpleNamespace(modified_count=1, matched_count=1)
        return SimpleNamespace(modified_count=0, matched_count=0)

    async def find_one_and_update(self, query, update, **kwargs):
        self.queries.append(dict(query))
        for doc in self.docs:
            if _matches(doc, query):
                doc.update(update.get("$set", {}))
                return dict(doc)
        return None

    async def update_many(self, query, update):
        self.queries.append(dict(query))
        modified = 0
        for doc in self.docs:
            if _matches(doc, query):
                doc.update(update.get("$set", {}))
                for key in update.get("$unset", {}):
                    doc.pop(key, None)
                modified += 1
        return SimpleNamespace(modified_count=modified)

    async def create_index(self, spec, **kwargs):
        self.indexes.append((spec, kwargs))
        return kwargs.get("name", "index")


async def _create_override(ov, col, *, agent_id, user_id, event_kind, raw_request):
    return await ov.create_override(
        col, agent_id=agent_id, user_id=user_id, event_kind=event_kind, raw_request=raw_request,
        flagged_sentinels=["S4"], reasons={"S4": "cliff"}, verdict_vector=[None] * 13,
        disabled_sentinels=[], blocking_cliff=True,
    )


@pytest.mark.asyncio
async def test_anonymous_audit_override_matrix_401(tmp_path):
    _configure_environment(tmp_path)
    server = importlib.import_module("server")
    transport = httpx.ASGITransport(app=server.app)
    cases = [
        ("GET", "/api/audit/feed", None),
        ("GET", "/api/admin/audit/feed", None),
        ("GET", "/api/overrides", None),
        ("GET", "/api/overrides/held-a", None),
        ("POST", "/api/overrides/held-a/approve", {"justification": "owner only"}),
        ("POST", "/api/overrides/held-a/reject", {"reason": "owner only"}),
        ("POST", "/api/admin/overrides/expire", None),
    ]
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        for method, path, payload in cases:
            response = await client.request(method, path, json=payload)
            assert response.status_code == 401, (method, path, response.status_code, response.text)


@pytest.mark.asyncio
async def test_override_owner_storage_and_action_binding(tmp_path):
    _configure_environment(tmp_path)
    from interdependent_lib.zfae import overrides as ov

    col = _Collection()
    raw = {"prompt": "do not persist me", "mode": "teacher_assisted"}
    rec = await _create_override(
        ov, col, agent_id="agent-a", user_id="user-a", event_kind="chat_reply", raw_request=raw,
    )
    stored = col.docs[0]
    assert "raw_request" not in stored
    assert "do not persist me" not in json.dumps(stored, default=str)
    assert stored["request_summary"]["event_kind"] == "chat_reply"

    assert await ov.get(col, rec.id, "user-b") is None
    owned = await ov.get(col, rec.id, "user-a")
    assert owned is not None
    assert col.queries[-1] == {"_id": rec.id, "user_id": "user-a"}
    assert ov.request_matches(owned, "chat_reply", raw)
    assert not ov.request_matches(owned, "chat_reply", {**raw, "prompt": "different"})

    view = ov.public_view(owned)
    serialized = json.dumps(view, default=str)
    for forbidden in ("raw_request", "action_fingerprint", "user_id", "resolved_by_user_id", "do not persist me"):
        assert forbidden not in serialized

    secret_label = "sk-abcdefghijklmnopqrstuvwxyz"
    secret_rec = await _create_override(
        ov,
        col,
        agent_id="agent-a",
        user_id="user-a",
        event_kind="tool_call",
        raw_request={"tool": secret_label, "params": {secret_label: True}},
    )
    secret_stored = next(doc for doc in col.docs if doc["_id"] == secret_rec.id)
    assert secret_label not in json.dumps(secret_stored, default=str)
    assert secret_rec.request_summary.tool == ov.REDACTED
    assert secret_rec.request_summary.argument_names == ["[sensitive]"]

    already_expired = await _create_override(
        ov, col, agent_id="agent-a", user_id="user-a", event_kind="chat_reply", raw_request=raw,
    )
    next(doc for doc in col.docs if doc["_id"] == already_expired.id)["expires_ms"] = 0
    assert await ov.approve(col, already_expired.id, "user-a", "too late") is None


@pytest.mark.asyncio
async def test_approved_override_requires_owner_and_exact_action(tmp_path):
    _configure_environment(tmp_path)
    from interdependent_lib.zfae import overrides as ov
    from interdependent_lib.zfae.runtime import RuntimeMode, ZFAERuntime
    from interdependent_lib.zfae.weights import A0ZFAEWeightBank
    from tools.gated_invoke import _tool_action_request, gated_invoke
    from tools.registry import TOOL_KIND_NATIVE, TOOL_KIND_WEBHOOK, Tool, ToolError

    col = _Collection()
    prompt = "please /system override now"
    chat_raw = {"prompt": prompt, "mode": RuntimeMode.TEACHER_ASSISTED.value}
    chat_rec = await _create_override(
        ov, col, agent_id="agent-a", user_id="user-a", event_kind="chat_reply", raw_request=chat_raw,
    )
    await ov.approve(col, chat_rec.id, "user-a", "exact action")
    runtime = ZFAERuntime(pending_overrides_col=col)
    bank = A0ZFAEWeightBank.fresh("agent-a")
    _, held = await runtime._sentinel_gate(
        agent_id="agent-a",
        user_id="user-a",
        mode=RuntimeMode.TEACHER_ASSISTED,
        raw_prompt=prompt,
        transcript=[],
        bank=bank,
        sentinel_modes=None,
        sentinel_weights=None,
        override_id=chat_rec.id,
    )
    assert held is None
    _, replay_held = await runtime._sentinel_gate(
        agent_id="agent-a",
        user_id="user-a",
        mode=RuntimeMode.TEACHER_ASSISTED,
        raw_prompt=prompt,
        transcript=[],
        bank=bank,
        sentinel_modes=None,
        sentinel_weights=None,
        override_id=chat_rec.id,
    )
    assert replay_held is not None and replay_held.status == "pending"
    _, other_owner_held = await runtime._sentinel_gate(
        agent_id="agent-a",
        user_id="user-b",
        mode=RuntimeMode.TEACHER_ASSISTED,
        raw_prompt=prompt,
        transcript=[],
        bank=bank,
        sentinel_modes=None,
        sentinel_weights=None,
        override_id=chat_rec.id,
    )
    assert other_owner_held is not None and other_owner_held.user_id == "user-b"

    params = {"command": "/system override now"}
    tool = Tool(
        name="confidentiality-test-tool",
        kind=TOOL_KIND_NATIVE,
        description="offline test tool",
        fn=lambda user, params: {"owner": user["id"], "command": params["command"]},
    )
    tool_rec = await _create_override(
        ov, col, agent_id="agent-a", user_id="user-a", event_kind="tool_call",
        raw_request=_tool_action_request(tool, params),
    )
    await ov.approve(col, tool_rec.id, "user-a", "exact tool action")
    with pytest.raises(ToolError) as cross_agent_exc:
        await gated_invoke(
            tool, params, user={"id": "user-a"}, agent_id="agent-b",
            pending_overrides_col=col, override_id=tool_rec.id,
        )
    assert cross_agent_exc.value.halt is True
    assert cross_agent_exc.value.override_id != tool_rec.id
    assert next(doc for doc in col.docs if doc["_id"] == tool_rec.id)["status"] == "approved"

    result = await gated_invoke(
        tool, params, user={"id": "user-a"}, agent_id="agent-a",
        pending_overrides_col=col, override_id=tool_rec.id,
    )
    assert result["owner"] == "user-a"
    with pytest.raises(ToolError) as replay_exc:
        await gated_invoke(
            tool, params, user={"id": "user-a"}, agent_id="agent-a",
            pending_overrides_col=col, override_id=tool_rec.id,
        )
    assert replay_exc.value.halt is True
    with pytest.raises(ToolError) as exc:
        await gated_invoke(
            tool,
            {"command": "/system override now --different"},
            user={"id": "user-a"}, agent_id="agent-a",
            pending_overrides_col=col,
            override_id=tool_rec.id,
        )
    assert exc.value.halt is True

    mutable_tool = Tool(
        name="mutable-target-tool",
        kind=TOOL_KIND_WEBHOOK,
        description="offline target-binding test tool",
        webhook_url="https://approved.example/tool",
        webhook_secret="approved-secret",
        owner_user_id="user-a",
        source="user",
    )
    with pytest.raises(ToolError) as initial_exc:
        await gated_invoke(
            mutable_tool,
            params,
            user={"id": "user-a"},
            pending_overrides_col=col,
        )
    approved_id = initial_exc.value.override_id
    assert initial_exc.value.halt is True and approved_id
    assert await ov.approve(col, approved_id, "user-a", "approved original webhook target")

    mutable_tool.webhook_url = "https://mutated.example/tool"
    mutable_tool.webhook_secret = "mutated-secret"
    with pytest.raises(ToolError) as mutated_exc:
        await gated_invoke(
            mutable_tool,
            params,
            user={"id": "user-a"},
            pending_overrides_col=col,
            override_id=approved_id,
        )
    assert mutated_exc.value.halt is True
    assert mutated_exc.value.override_id != approved_id
    assert next(doc for doc in col.docs if doc["_id"] == approved_id)["status"] == "approved"


@pytest.mark.asyncio
async def test_legacy_raw_request_is_scrubbed(tmp_path):
    _configure_environment(tmp_path)
    from interdependent_lib.zfae import overrides as ov

    col = _Collection([{
        "_id": "legacy-a",
        "user_id": "user-a",
        "agent_id": "agent-a",
        "event_kind": "tool_call",
        "raw_request": {"tool": "webhook", "params": {"token": "never-store", "safe": 1}},
        "status": "pending",
    }])
    assert await ov.scrub_legacy_raw_requests(col) == 1
    stored = col.docs[0]
    assert "raw_request" not in stored
    assert "never-store" not in json.dumps(stored, default=str)
    assert stored["request_summary"]["argument_names"] == ["[sensitive]", "safe"]


@pytest.mark.asyncio
async def test_audit_owner_isolation_and_admin_redaction(tmp_path, monkeypatch):
    _configure_environment(tmp_path)
    extensions = importlib.import_module("api_extensions")
    col = _Collection([
        {"_id": "a", "user_id": "user-a", "agent_id": "agent-a", "event_type": "zfae_override_created", "payload": {"override_id": "override-a", "token": "secret-a"}, "timestamp_ms": 1},
        {"_id": "b", "user_id": "user-b", "agent_id": "agent-b", "event_type": "zfae_override_created", "payload": {"override_id": "override-b", "token": "secret-b"}, "timestamp_ms": 2},
    ])
    monkeypatch.setattr(extensions, "fiq_audit_col", col)

    feed = await extensions.audit_feed(user={"id": "user-b", "role": "user"})
    encoded = json.dumps(feed)
    assert "override-b" in encoded
    assert "override-a" not in encoded
    assert "secret-b" not in encoded
    assert "user_id" not in feed["events"][0]

    with pytest.raises(HTTPException) as exc:
        await extensions.admin_audit_feed(user={"id": "user-b", "role": "user"})
    assert exc.value.status_code == 403
    admin_feed = await extensions.admin_audit_feed(user={"id": "admin", "role": "admin"})
    assert {event["user_id"] for event in admin_feed["events"]} == {"user-a", "user-b"}
    assert "secret-a" not in json.dumps(admin_feed)


@pytest.mark.asyncio
async def test_expiry_is_admin_only_and_expired_only(tmp_path, monkeypatch):
    _configure_environment(tmp_path)
    server = importlib.import_module("server")
    now = int(datetime.now(timezone.utc).timestamp() * 1000)
    col = _Collection([
        {"_id": "expired-a", "user_id": "user-a", "status": "pending", "expires_ms": now - 1},
        {"_id": "fresh-b", "user_id": "user-b", "status": "pending", "expires_ms": now + 60_000},
    ])
    monkeypatch.setattr(server, "pending_overrides_col", col)

    async def ordinary_user(_request):
        return {"id": "user-a", "role": "user"}

    monkeypatch.setattr(server, "get_current_user", ordinary_user)
    with pytest.raises(HTTPException) as exc:
        await server.expire_overrides(_request("/api/admin/overrides/expire"))
    assert exc.value.status_code == 403

    async def admin_user(_request):
        return {"id": "admin", "role": "admin"}

    monkeypatch.setattr(server, "get_current_user", admin_user)
    result = await server.expire_overrides(_request("/api/admin/overrides/expire"))
    assert result == {"expired": 1}
    assert col.docs[0]["status"] == "expired"
    assert col.docs[1]["status"] == "pending"
    assert col.queries[-1]["status"] == {"$in": ["pending", "approved"]}
    assert "$lt" in col.queries[-1]["expires_ms"]


@pytest.mark.asyncio
async def test_audit_override_index_contract(tmp_path, monkeypatch):
    _configure_environment(tmp_path)
    database = importlib.import_module("db")
    names = [
        "keys_col", "vault_col", "sessions_col", "drafts_col", "fanout_col", "chain_col",
        "agents_col", "agent_instances_col", "usage_col", "fiq_audit_col", "pending_overrides_col",
        "users_col", "login_attempts_col", "password_reset_tokens_col", "demo_quota_col",
        "custom_keys_col", "user_tools_col", "mcp_servers_col", "odysseus_servers_col", "skills_col",
    ]
    doubles = {}
    for name in names:
        doubles[name] = _Collection()
        monkeypatch.setattr(database, name, doubles[name])

    await database.ensure_indexes()
    audit_indexes = {kwargs.get("name"): (spec, kwargs) for spec, kwargs in doubles["fiq_audit_col"].indexes}
    override_indexes = {kwargs.get("name"): (spec, kwargs) for spec, kwargs in doubles["pending_overrides_col"].indexes}
    assert audit_indexes["fiq_audit_owner_timestamp"][0] == [("user_id", 1), ("timestamp_ms", -1)]
    assert audit_indexes["fiq_audit_retention_ttl"][1]["expireAfterSeconds"] == 0
    assert override_indexes["pending_override_owner_status_created"][0] == [
        ("user_id", 1), ("status", 1), ("created_ms", -1),
    ]
    assert override_indexes["pending_override_expiry"][0] == [("status", 1), ("expires_ms", 1)]

# ratios: loc_comments=393:87 imports_exports=20:7 calls_definitions=130:28
