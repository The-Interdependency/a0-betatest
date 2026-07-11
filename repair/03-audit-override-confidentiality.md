# Repair 03 — Audit-feed and override confidentiality

**Priority:** P0  
**Status:** open  
**Primary risk:** unauthenticated callers can enumerate audit events and retrieve held raw requests by override id.

## Verified current behavior

- `GET /api/audit/feed` is unauthenticated and returns `user_id`, `agent_id`, payloads, and hashes across the collection unless filters are supplied.
- Override creation events carry override identifiers in audit payloads.
- `GET /api/overrides/{override_id}` is unauthenticated and calls an id-only lookup.
- `PendingOverride.raw_request` stores the original request payload.
- `POST /api/overrides/expire` is unauthenticated and mutates all expired pending records.
- Approval and rejection were improved to include owner scoping, but read and expiration boundaries remain open.

An attacker can poll the public audit feed, obtain an override id, and retrieve a held prompt or tool request.

## Objective

Make audit and override data owner-scoped, authenticated, minimally disclosed, and safe for multi-user operation.

## Required changes

1. Require `get_current_user` on all audit and override endpoints.
2. Scope every override lookup by both `_id` and `user_id`.
3. Change `zfae_overrides.get()` to require `user_id`; do not leave an id-only helper in the public path.
4. Remove raw request bodies from list responses and normal detail responses.
5. Store a minimized, typed request summary by default. Store full raw material only when explicitly required, encrypted at rest, with short retention and access logging.
6. Scope audit feed queries to the authenticated user. Admin/global audit views must be separate, role-gated endpoints with redaction.
7. Redact secrets, authorization material, API keys, environment values, webhook tokens, and tool arguments classified as sensitive before event insertion.
8. Replace the public expire mutation with one of:
   - a startup/background maintenance operation internal to the service;
   - an authenticated admin endpoint;
   - Mongo TTL-based cleanup where history is not required.
9. Add indexes for `(user_id, timestamp_ms)`, `(user_id, status, created_ms)`, and expiry queries.
10. Define and test retention for raw request material and audit payloads.

## Required tests

- Anonymous audit and override reads return `401`.
- User B cannot retrieve User A’s override by id.
- User B cannot discover User A’s override id through the audit feed.
- Audit payload redaction removes known secret-shaped fields recursively.
- List responses never include `raw_request`.
- Expiration cannot be triggered anonymously and cannot alter another user’s non-expired records.
- Admin audit access is explicitly role-gated and redacted.

## Acceptance commands

```bash
python -m compileall -q backend
python -m pytest -q backend/tests
```

Add focused tests for audit redaction and horizontal authorization.

## Likely touchpoints

- `backend/api_extensions.py`
- `backend/server.py`
- `backend/interdependent_lib/zfae/overrides.py`
- `backend/interdependent_lib/zfae/runtime.py`
- `backend/interdependent_lib/zfae/fiq_emit.py`
- `backend/db.py`

## Out of scope

Hash-chain concurrency and ordering are repaired in Repair 07.

## hmmm

A provenance record can be verifiable without being public. Hash transparency and payload confidentiality must be designed as separate properties.