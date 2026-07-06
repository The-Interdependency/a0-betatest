# ratios: loc_comments=103:70 imports_exports=5:4 calls_definitions=28:6
# === MODULE_BUILD ===
# id: tools_odysseus_relay
#   module_name: odysseus_relay
#   module_kind: adapter
#   summary: relay a0p tool calls to a registered Odysseus workspace over its scoped /api/codex/* REST surface — outbound httpx client attaching the per-connection Bearer api_token; the destination host is the operator-registered base_url (never agent-supplied) and the path is pinned to the /api/codex/ prefix, so Odysseus's own api_token scopes bound every capability while a0p sentinels gate each call
#   owner: Erin Spencer
#   public_surface: probe_capabilities, request, invoke, ODYSSEUS_CATALOGUE
#   internal_surface: _guard_path, _resolve_spec
#   auth_boundary: bearer
#   storage_boundary: read
#   network_boundary: external
#   user_data_boundary: read
#   admin_only: false
#   tests: a0p_skills.contracts.tools_odysseus_relay_request_holds
#   rollout: default_enabled
#   rollback: revert; odysseus-typed tools become invokable-but-unreachable
# === END MODULE_BUILD ===
# === BOUNDARIES ===
# id: tools_odysseus_relay_boundaries
#   summary: outbound scoped-REST client to a user-registered Odysseus workspace
#   auth_boundary: bearer
#   storage_boundary: read
#   network_boundary: external
#   user_data_boundary: read
#   admin_only: false
#   owner: Erin Spencer
# === END BOUNDARIES ===
# === CAPABILITIES ===
# id: tools_odysseus_relay
#   summary: outbound Odysseus /api/codex/* REST client
#   exposes: probe_capabilities, request, invoke, ODYSSEUS_CATALOGUE
#   boundaries: auth:bearer, storage:read, network:external, user_data:read
#   owner: Erin Spencer
# === END CAPABILITIES ===
# === CONTRACTS ===
# id: tools_odysseus_relay_request
#   given: an Odysseus /api/codex/* surface stubbed with an httpx MockTransport
#   then: request() round-trips a 200 JSON body with the Bearer token attached,
#         surfaces a non-2xx as ToolError, and refuses any path outside
#         /api/codex/ before touching the network
#   class: integration
#   call: a0p_skills.contracts.tools_odysseus_relay_request_holds
# === END CONTRACTS ===
"""Outbound scoped-REST client for a registered Odysseus workspace.

Odysseus (The-Interdependency/odysseus-a0) exposes its agent-facing surface as
scope-gated REST under ``/api/codex/*`` (memory, email, todos, calendar,
documents, cookbook), authorized by a per-user ``api_token`` whose scopes bound
what each call may touch. It does not speak HTTP-MCP, so a0p reaches it over
this REST relay rather than ``tools.mcp_relay``.

Boundary discipline:
  * The destination host is the operator-registered ``base_url`` of a specific
    Odysseus connection, never a value the agent supplies — so this is not an
    SSRF surface; only the ``/api/codex/`` sub-path and method vary.
  * Every call carries the connection's Bearer ``api_token``; Odysseus enforces
    per-capability scopes, and a0p's sentinel gate runs first on every call.
  * Only read-scoped GETs with no required body are pre-named in the catalogue;
    all writes go through the explicit ``request`` passthrough rather than a
    fabricated endpoint body schema.
"""
from __future__ import annotations
from typing import Any, Optional

import httpx

from .registry import Tool, ToolError, TOOL_KIND_ODYSSEUS


_CODEX_PREFIX = "/api/codex/"
_ALLOWED_METHODS = {"GET", "POST", "PUT", "PATCH", "DELETE"}


# Stable capability key -> call spec. `request` is the generic scoped passthrough
# (the agent supplies method + /api/codex/ path); the rest are read-only GETs.
ODYSSEUS_CATALOGUE: dict[str, dict] = {
    "capabilities": {
        "method": "GET", "path": "/api/codex/capabilities", "scope": "(open)",
        "description": "Report which Odysseus capabilities this api_token may use.",
        "input_schema": {"type": "object", "properties": {}, "required": []},
    },
    "memory_search": {
        "method": "GET", "path": "/api/codex/memory", "scope": "memory:read",
        "query": ["q", "limit"],
        "description": "Search the Odysseus memory store (optional q, limit).",
        "input_schema": {"type": "object", "properties": {
            "q": {"type": "string"}, "limit": {"type": "integer"}}, "required": []},
    },
    "todos_list": {
        "method": "GET", "path": "/api/codex/todos", "scope": "todos:read",
        "description": "List the user's Odysseus to-dos.",
        "input_schema": {"type": "object", "properties": {}, "required": []},
    },
    "documents_list": {
        "method": "GET", "path": "/api/codex/documents", "scope": "docs:read",
        "description": "List the user's Odysseus documents.",
        "input_schema": {"type": "object", "properties": {}, "required": []},
    },
    "calendar_events": {
        "method": "GET", "path": "/api/codex/calendar/events", "scope": "calendar:read",
        "description": "List Odysseus calendar events.",
        "input_schema": {"type": "object", "properties": {}, "required": []},
    },
    "request": {
        "method": None, "path": None, "scope": "(varies — Odysseus enforces per path)",
        "description": ("Generic scoped passthrough to any /api/codex/* endpoint. "
                        "params: {method, path (must start with /api/codex/), query?, body?}."),
        "input_schema": {"type": "object", "properties": {
            "method": {"type": "string"}, "path": {"type": "string"},
            "query": {"type": "object"}, "body": {"type": "object"}},
            "required": ["method", "path"]},
    },
}


def _guard_path(path: str) -> str:
    """Refuse anything that is not a relative path under /api/codex/."""
    if not isinstance(path, str) or not path.startswith(_CODEX_PREFIX):
        raise ToolError(f"odysseus: path must start with {_CODEX_PREFIX!r}, got {path!r}")
    if "://" in path or path.startswith("//"):
        raise ToolError("odysseus: path must be a relative /api/codex/ path, not a URL")
    return path


async def request(base_url: str, token: Optional[str], method: str, path: str, *,
                  query: Optional[dict] = None, json_body: Optional[dict] = None,
                  timeout: float = 20.0, client: Optional[httpx.AsyncClient] = None) -> Any:
    """Call one Odysseus /api/codex/* endpoint; return parsed JSON or raise ToolError.

    ``client`` lets a caller inject a pre-built AsyncClient (used by the contract
    test's MockTransport); when omitted a short-lived client is created here.
    """
    method = (method or "GET").upper()
    if method not in _ALLOWED_METHODS:
        raise ToolError(f"odysseus: unsupported method {method!r}")
    _guard_path(path)
    url = base_url.rstrip("/") + path
    headers = {"Accept": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"

    async def _do(cli: httpx.AsyncClient) -> Any:
        r = await cli.request(method, url, params=query or None, json=json_body, headers=headers)
        # A non-2xx (Odysseus 401/403/404 with a {"detail": ...} body) or an
        # off-host redirect is a transport failure, not a result — surface it.
        if r.status_code >= 400 or r.is_redirect:
            raise ToolError(f"odysseus http {r.status_code}: {r.text[:200]}")
        try:
            return r.json()
        except Exception:
            return {"raw": r.text[:4096], "status": r.status_code}

    if client is not None:
        return await _do(client)
    async with httpx.AsyncClient(timeout=timeout, follow_redirects=False) as cli:
        return await _do(cli)


async def probe_capabilities(base_url: str, token: Optional[str]) -> dict:
    """GET /api/codex/capabilities. Returns {ok, capabilities, error} (never raises)."""
    try:
        data = await request(base_url, token, "GET", "/api/codex/capabilities", timeout=10.0)
        return {"ok": True, "capabilities": data, "error": None}
    except Exception as e:
        return {"ok": False, "capabilities": None, "error": f"{type(e).__name__}: {e}"}


def _resolve_spec(cap_key: str) -> dict:
    spec = ODYSSEUS_CATALOGUE.get(cap_key)
    if spec is None:
        raise ToolError(f"odysseus: unknown capability {cap_key!r}")
    return spec


async def invoke(tool: Tool, params: dict, *, user: dict) -> Any:
    """Dispatch a TOOL_KIND_ODYSSEUS tool call to its registered connection."""
    if tool.kind != TOOL_KIND_ODYSSEUS:
        raise ToolError(f"odysseus_relay got non-odysseus tool {tool.name!r}")
    if not tool.mcp_server_id:
        raise ToolError(f"odysseus tool {tool.name!r} missing connection id")
    spec = _resolve_spec(tool.remote_name or "")
    from db import odysseus_servers_col
    conn = await odysseus_servers_col.find_one({"_id": tool.mcp_server_id, "user_id": user["id"]})
    if not conn:
        raise ToolError(f"odysseus connection {tool.mcp_server_id} not found for current user")
    base_url, token = conn["base_url"], conn.get("token")
    params = params or {}
    if (tool.remote_name or "") == "request":
        return await request(base_url, token, params.get("method", "GET"), params.get("path", ""),
                             query=params.get("query"), json_body=params.get("body"))
    query = {k: params[k] for k in (spec.get("query") or []) if k in params} or None
    body = params if spec["method"] in ("POST", "PUT", "PATCH") else None
    return await request(base_url, token, spec["method"], spec["path"], query=query, json_body=body)


__all__ = ["probe_capabilities", "request", "invoke", "ODYSSEUS_CATALOGUE", "TOOL_KIND_ODYSSEUS"]
# ratios: loc_comments=103:70 imports_exports=5:4 calls_definitions=28:6
