# === CHECKS ===
# id: check_strict_auth_persistence_401
#   proves: strict_auth_persistence_provider_401
#   call: self::test_anonymous_persistence_and_provider_routes_return_401
#   requires: python3
#   timeout: 60
#   mutates: none
#   cleanup: none
# id: check_shared_local_identity_removed
#   proves: shared_local_identity_removed
#   call: self::test_demo_alias_is_strict
#   requires: python3
#   timeout: 20
#   mutates: none
#   cleanup: none
# id: check_runtime_local_migration_removed
#   proves: runtime_local_migration_removed
#   call: self::test_startup_contains_no_local_to_admin_transfer
#   requires: python3
#   timeout: 20
#   mutates: none
#   cleanup: none
# === END CHECKS ===
"""Repair 01 acceptance tests: strict auth and demo isolation."""
from __future__ import annotations

import importlib
import os
from pathlib import Path

import httpx
import pytest
from cryptography.fernet import Fernet
from fastapi import HTTPException
from starlette.requests import Request


def _configure_import_environment(tmp_path: Path) -> None:
    os.environ.setdefault("MONGO_URL", "mongodb://localhost:27017")
    os.environ.setdefault("DB_NAME", "strict_auth_test")
    os.environ.setdefault("JWT_SECRET", "strict-auth-test-secret-not-production")
    os.environ.setdefault("CORS_ORIGINS", "http://localhost:3000")
    os.environ.setdefault("A0P_KEY_VAULT_SECRET", Fernet.generate_key().decode())
    os.environ.setdefault("A0P_AGENTS_ROOT", str(tmp_path / "agents"))
    os.environ.setdefault("A0P_AUDIT_STORAGE_ROOT", str(tmp_path / "audit"))
    os.environ.setdefault("A0P_TRAFFIC_LOG", str(tmp_path / "traffic.log"))


def _request(path: str = "/") -> Request:
    return Request(
        {
            "type": "http",
            "method": "GET",
            "path": path,
            "headers": [],
            "query_string": b"",
            "server": ("test", 80),
            "client": ("127.0.0.1", 1),
            "scheme": "http",
        }
    )


@pytest.mark.asyncio
async def test_demo_alias_is_strict(tmp_path):
    _configure_import_environment(tmp_path)
    auth = importlib.import_module("auth")
    with pytest.raises(HTTPException) as exc:
        await auth.get_current_user_or_demo(_request("/api/keys"))
    assert exc.value.status_code == 401


@pytest.mark.asyncio
async def test_anonymous_persistence_and_provider_routes_return_401(tmp_path):
    _configure_import_environment(tmp_path)
    server = importlib.import_module("server")
    transport = httpx.ASGITransport(app=server.app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        cases = [
            ("GET", "/api/keys", None),
            ("GET", "/api/vault", None),
            ("GET", "/api/sessions", None),
            ("GET", "/api/drafts", None),
            ("GET", "/api/usage", None),
            ("GET", "/api/inspector/snapshot", None),
            ("GET", "/api/agents", None),
            ("GET", "/api/audit/feed", None),
            ("GET", "/api/overrides", None),
            (
                "POST",
                "/api/chat/single",
                {"model_id": "openai:test", "messages": []},
            ),
            (
                "POST",
                "/api/training/readout",
                {"text": "anonymous training must not persist"},
            ),
        ]
        for method, path, payload in cases:
            response = await client.request(method, path, json=payload)
            assert response.status_code == 401, (
                method,
                path,
                response.status_code,
                response.text,
            )

        assert (await client.get("/api/health")).status_code == 200
        assert (await client.get("/api/spec/living")).status_code == 200


def test_startup_contains_no_local_to_admin_transfer():
    root = Path(__file__).resolve().parents[2]
    source = (root / "backend" / "server.py").read_text(encoding="utf-8")
    assert "Migrate legacy user_id='local'" not in source
    assert '{"user_id": "local"}, {"$set": {"user_id": admin["_id"]}}' not in source
    assert "Historical `local` rows are never transferred automatically" in source


def test_auth_helper_has_no_synthetic_local_user():
    root = Path(__file__).resolve().parents[2]
    source = (root / "backend" / "auth" / "__init__.py").read_text(encoding="utf-8")
    assert '"id": "local"' not in source
    assert '"email": "demo@local"' not in source
    assert "return await get_current_user(request)" in source
