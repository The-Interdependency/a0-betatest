"""Usage: PYTHONPATH=backend pytest backend/tests/test_traffic_log_boundaries.py.
Exercise real HTTP slash redirects and the owning ratio computer, with only a
local ASGI transport and a temporary traffic sink; no live users or credentials.
"""
# === CHECKS ===
# id: check_oauth_slash_redirect_query_redaction
#   proves: traffic_log_redacts_oauth_callback_query
#   call: self::test_callback_slash_redaction
#   mutates: tempdir
#   cleanup: tempdir_teardown
# === END CHECKS ===
import json
from pathlib import Path

import httpx
import pytest
from fastapi import FastAPI

import traffic_log


@pytest.mark.asyncio
@pytest.mark.parametrize("provider", ["mobile", "github"])
@pytest.mark.parametrize("suffix,follow", [("", False), ("/", False), ("/", True), ("//", False)])
async def test_callback_slash_redaction(tmp_path, monkeypatch, provider, suffix, follow):
    sink = tmp_path / "traffic.log"
    monkeypatch.setenv(traffic_log.LOG_PATH_ENV, str(sink))
    app = FastAPI()
    app.middleware("http")(traffic_log.traffic_middleware)
    path = f"/api/auth/oauth/{provider}/callback"

    @app.get(path)
    async def callback():
        return {"status": "callback"}

    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="https://vm.example", follow_redirects=follow) as client:
        result = await client.get(path + suffix, params={"code": "provider-secret", "state": "transaction-secret"})
    assert result.status_code == (307 if suffix and not follow else 200)
    contents = sink.read_text(encoding="utf-8")
    rows = [json.loads(line) for line in contents.splitlines()]
    assert len(rows) == (2 if suffix and follow else 1)
    assert rows[0]["path"] == path + suffix  # Keep the observed path, not a rewritten one.
    assert all(row["query"] == "" for row in rows)
    assert "provider-secret" not in contents and "transaction-secret" not in contents


@pytest.mark.asyncio
async def test_non_callback_query_is_preserved(tmp_path, monkeypatch):
    sink = tmp_path / "traffic.log"
    monkeypatch.setenv(traffic_log.LOG_PATH_ENV, str(sink))
    app = FastAPI()
    app.middleware("http")(traffic_log.traffic_middleware)

    @app.get("/api/health")
    async def health():
        return {"status": "ok"}

    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="https://vm.example") as client:
        assert (await client.get("/api/health?page=1")).status_code == 200
    assert json.loads(sink.read_text(encoding="utf-8"))["query"] == "page=1"


def test_traffic_log_ratio_seals_match_source(tmp_path):
    from a0p_skills.ratios_runner import run

    source = Path(traffic_log.__file__).read_text(encoding="utf-8")
    (tmp_path / "traffic_log.py").write_text(source, encoding="utf-8")
    report = run(tmp_path, strict=True)
    assert report["scanned"] == report["covered"] == 1
    assert report["verified_count"] == 6  # All three metrics at both boundaries.
    assert report["drift_count"] == report["misplaced_count"] == report["gaps_count"] == report["pending_count"] == 0, report
