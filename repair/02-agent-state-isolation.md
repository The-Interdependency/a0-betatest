# Repair 02 — Per-user ZFAE state and protected agent APIs

**Priority:** P0  
**Status:** open  
**Primary risk:** chat prompts and learned state are accumulated in one process-global agent and exposed through unauthenticated inspector and detachable-agent routes.

## Verified current behavior

- `backend/server.py` creates one module-level `AGENT = ZFAEAgent(...)`.
- Single, fan-out, daisy-chain, and synthesis routes call `AGENT.receive()` and `AGENT.absorb()` regardless of authenticated user.
- `/api/inspector/snapshot` returns `AGENT.card()` without authentication.
- `/api/inspector/heartbeat` mutates the same agent without authentication.
- `/api/agents` list/create/delete and manifest routes are global and unauthenticated.

The agent memory stores prompt/response-derived material. A process-global mutable instance therefore crosses user and session boundaries.

## Objective

Give every persistent agent an explicit owner and state identity. No request may read or mutate an agent unless the authenticated user owns it or the resource is deliberately public and read-only.

## Required changes

1. Delete the process-global mutable `AGENT` from request handling.
2. Introduce an `AgentStateStore` keyed by at least:
   - `user_id`;
   - `agent_id`;
   - optionally `session_id` for session-scoped state.
3. Define lifecycle semantics:
   - create/load under an authenticated owner;
   - persist state atomically or make it explicitly ephemeral;
   - evict in-memory objects safely;
   - prevent simultaneous updates from losing ticks or memory.
4. Require authentication for inspector snapshot and heartbeat.
5. Scope inspector reads and mutations by owner plus agent id.
6. Add `user_id` ownership to detachable agents, or split them into:
   - immutable public templates;
   - user-owned instantiated agents.
7. Protect list/create/update/delete routes. Public manifests must contain no private system context, memory, credentials, or owner-only configuration.
8. Remove global tick counts from responses unless they refer to the caller’s selected agent.
9. Treat health output as service health only; do not expose mutable agent identifiers or state.

## Required tests

- User A sends a unique marker through chat; user B cannot find that marker in chat, inspector, heartbeat, manifest, or agent list responses.
- Anonymous inspector and agent mutations return `401`.
- User B cannot read, heartbeat, update, or delete User A’s agent by guessing its id or slug.
- Concurrent updates to two users’ agents remain isolated.
- Concurrent updates to one agent are serialized or version-checked without lost ticks.
- Public templates remain readable only through a deliberately public, redacted endpoint.

## Acceptance commands

```bash
python -m compileall -q backend
python -m pytest -q backend/tests
```

Add an integration test that runs two authenticated clients against the same application process.

## Likely touchpoints

- `backend/server.py`
- `backend/interdependent_lib/zfae/__init__.py`
- `backend/interdependent_lib/pcna/pcna.py`
- `backend/agents/routes.py`
- `backend/db.py`
- inspector and agent frontend pages

## Out of scope

The shared `local` identity is removed by Repair 01. Audit-event confidentiality belongs to Repair 03.

## hmmm

State ownership and state persistence are separate decisions. Do not solve cross-user leakage by silently discarding all persistence; make the intended agent-memory lifecycle explicit and test-backed.