# === CHECKS ===
# id: check_zfae_state_owner_isolation
#   proves: zfae_state_owner_isolation
#   call: self::test_two_authenticated_clients_never_share_state
#   requires: python3
#   timeout: 60
#   mutates: process_memory
#   cleanup: replace_proxy
# id: check_zfae_state_updates_serialized
#   proves: zfae_state_updates_serialized
#   call: self::test_concurrent_owner_updates_lose_no_ticks
#   requires: python3
#   timeout: 60
#   mutates: process_memory
#   cleanup: replace_proxy
# id: check_zfae_state_lifecycle_explicit
#   proves: zfae_state_lifecycle_explicit
#   call: self::test_owner_state_evicts_explicitly
#   requires: python3
#   timeout: 20
#   mutates: process_memory
#   cleanup: none
# id: check_public_agent_templates_redacted
#   proves: public_agent_templates_redacted
#   call: self::test_public_template_view_excludes_hidden_configuration
#   requires: python3
#   timeout: 20
#   mutates: none
#   cleanup: none
# === END CHECKS ===
"""Repair 02 acceptance tests: owner-scoped mutable agent state."""
from __future__ import annotations

import asyncio
import importlib
import json
import os
from pathlib import Path

import httpx
import pytest
from cryptography.fernet import Fernet

from interdependent_lib.zfae.state_store import OwnerScopedAgentProxy


def _configure_environment(tmp_path: Path) -> None:
    os.environ.setdefault("MONGO_URL", "mongodb://localhost:27017")
    os.environ.setdefault("DB_NAME", "agent_state_isolation_test")
    os.environ.setdefault("JWT_SECRET", "agent-state-isolation-not-production")
    os.environ.setdefault("CORS_ORIGINS", "http://localhost:3000")
    os.environ.setdefault("A0P_KEY_VAULT_SECRET", Fernet.generate_key().decode())
    os.environ.setdefault("A0P_AGENTS_ROOT", str(tmp_path / "agents"))
    os.environ.setdefault("A0P_AUDIT_STORAGE_ROOT", str(tmp_path / "audit"))
    os.environ.setdefault("A0P_TRAFFIC_LOG", str(tmp_path / "traffic.log"))


async def _configured_server(tmp_path: Path, monkeypatch):
    _configure_environment(tmp_path)
    server = importlib.import_module("server")
    auth = importlib.import_module("auth")
    server.AGENT = OwnerScopedAgentProxy()

    async def fake_current_user(request):
        owner = request.headers.get("x-test-user")
        if not owner:
            from fastapi import HTTPException
            raise HTTPException(401, "Not authenticated")
        return {
            "id": owner,
            "username": owner,
            "email": f"{owner}@test.invalid",
            "role": "user",
        }

    async def fake_call_model(user_id, model_id, messages, system=None):
        await asyncio.sleep(0)
        prompt = messages[-1].get("content", "") if messages else ""
        return {
            "provider": model_id.split(":", 1)[0],
            "model_id": model_id,
            "content": f"reply-for-{user_id}:{prompt}",
            "usage": {},
            "error": None,
        }

    async def no_usage(*args, **kwargs):
        return None

    monkeypatch.setattr(auth, "get_current_user", fake_current_user)
    monkeypatch.setattr(server, "_call_model", fake_call_model)
    monkeypatch.setattr(server, "_record_usage", no_usage)
    return server


@pytest.mark.asyncio
async def test_two_authenticated_clients_never_share_state(tmp_path, monkeypatch):
    server = await _configured_server(tmp_path, monkeypatch)
    transport = httpx.ASGITransport(app=server.app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        marker_a = "ALPHA-OWNER-ONLY-97"
        marker_b = "BETA-OWNER-ONLY-43"
        response_a, response_b = await asyncio.gather(
            client.post(
                "/api/chat/single",
                headers={"x-test-user": "owner-a"},
                json={
                    "model_id": "openai:test",
                    "messages": [{"role": "user", "content": marker_a}],
                },
            ),
            client.post(
                "/api/chat/single",
                headers={"x-test-user": "owner-b"},
                json={
                    "model_id": "openai:test",
                    "messages": [{"role": "user", "content": marker_b}],
                },
            ),
        )
        assert response_a.status_code == 200
        assert response_b.status_code == 200

        snapshot_a = (
            await client.get(
                "/api/inspector/snapshot", headers={"x-test-user": "owner-a"}
            )
        ).json()["agent_card"]
        snapshot_b = (
            await client.get(
                "/api/inspector/snapshot", headers={"x-test-user": "owner-b"}
            )
        ).json()["agent_card"]

        encoded_a = json.dumps(snapshot_a, sort_keys=True)
        encoded_b = json.dumps(snapshot_b, sort_keys=True)
        assert marker_a in encoded_a
        assert marker_b not in encoded_a
        assert marker_b in encoded_b
        assert marker_a not in encoded_b
        assert snapshot_a["id"] != snapshot_b["id"]
        assert snapshot_a["state_owner"] == "owner-a"
        assert snapshot_b["state_owner"] == "owner-b"
        assert snapshot_a["persistence"] == "ephemeral"


@pytest.mark.asyncio
async def test_concurrent_owner_updates_lose_no_ticks(tmp_path, monkeypatch):
    server = await _configured_server(tmp_path, monkeypatch)
    transport = httpx.ASGITransport(app=server.app)
    count = 32
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        responses = await asyncio.gather(*[
            client.post(
                "/api/chat/single",
                headers={"x-test-user": "same-owner"},
                json={
                    "model_id": "openai:test",
                    "messages": [{"role": "user", "content": f"tick-marker-{index}"}],
                },
            )
            for index in range(count)
        ])
        assert all(response.status_code == 200 for response in responses)
        snapshot = (
            await client.get(
                "/api/inspector/snapshot", headers={"x-test-user": "same-owner"}
            )
        ).json()["agent_card"]
        assert snapshot["tick"] == count
        assert snapshot["memory"]["counts"]["ST"] == count


@pytest.mark.asyncio
async def test_owner_state_evicts_explicitly():
    proxy = OwnerScopedAgentProxy()
    token = proxy.bind_owner("eviction-owner")
    try:
        proxy.receive("marker-before-eviction")
        first_id = proxy.id
        assert proxy.state_count() == 1
        assert proxy.evict() is True
        assert proxy.state_count() == 0
        assert proxy.id == first_id
        assert "marker-before-eviction" not in json.dumps(proxy.card())
    finally:
        proxy.reset_owner(token)


def test_public_template_view_excludes_hidden_configuration(tmp_path, monkeypatch):
    _configure_environment(tmp_path)
    server = importlib.import_module("server")
    template = {
        "_id": "template-1",
        "slug": "public-template",
        "name": "Public Template",
        "description": "safe description",
        "system_context": "HIDDEN SYSTEM INSTRUCTION",
        "persona": "HIDDEN PERSONA",
        "default_models": ["hidden:model"],
        "capabilities": ["summary"],
        "is_public_template": True,
        "user_id": None,
    }
    view = server._agent_view(template)
    assert view["is_public_template"] is True
    assert view["owned"] is False
    assert "system_context" not in view
    assert "persona" not in view
    assert "default_models" not in view
    assert "HIDDEN" not in json.dumps(view)


def test_health_source_contains_no_mutable_agent_identity():
    root = Path(__file__).resolve().parents[2]
    source = (root / "backend" / "server.py").read_text(encoding="utf-8")
    health = source[source.index("@api.get(\"/health\")"):source.index("# ---------- BYOK keys")]
    assert "AGENT.id" not in health
    assert "AGENT.name" not in health
    assert "AGENT.born_ms" not in health
    assert '"mutable_agent_state_exposed": False' in health
