# Repair 03 — Audit-feed and override confidentiality

**Priority:** P0  
**Status:** implemented — draft verification pending
**Primary risk:** unauthenticated callers can enumerate audit events and retrieve held raw requests by override id.

## Implemented behavior

- The ordinary audit feed requires authentication, queries only the caller's `user_id`, omits owner ids, and defensively redacts legacy payloads.
- Global audit access is separate at `GET /api/admin/audit/feed`, requires `role=admin`, and remains recursively redacted.
- Every override read includes `_id + user_id`; there is no id-only `get()` signature.
- Held actions persist a typed request summary and keyed action fingerprint, never prompt/tool arguments/body. Startup scrubs legacy `raw_request` rows.
- Approval is owner-scoped, must be unexpired, and is atomically consumed once for the same owner, agent, event kind, exact arguments, and tool execution target/configuration.
- Override list/detail responses use an explicit field whitelist and omit raw material, fingerprints, owner ids, and resolution text.
- Lifecycle-managed maintenance marks timed-out overrides expired every 60 seconds; `POST /api/admin/overrides/expire` remains an admin-only operator fallback, and the ordinary-user mutation/UI control stay removed.
- Audit payloads are recursively redacted before hashing and insertion. Tool arguments, result previews, authorization/cookie material, environment containers, webhook data, secret-shaped keys, and known credential-shaped strings are removed.
- Redacted audit events expire after 30 days by default (`A0P_AUDIT_RETENTION_DAYS`, constrained to 1–365). Full raw held-request retention is zero.
- A bounded background bulk job backfills expiry for legacy audit rows without delaying readiness or changing their hash input; startup creates owner/time, owner/status/created, expiry-query, and TTL indexes.

Repairs 01 and 02 had already added basic endpoint authentication and owner filtering before this repair began; this change closes the remaining confidentiality and exact-action gaps.

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

## Verification evidence

- `python -m compileall -q backend`: pass.
- Repair 03 plus lifecycle focus: 19 passed.
- Clean-build selected backend set including Repair 03: 59 passed.
- Frontend production build: pass; only pre-existing lint warnings.
- Full offline backend collection excluding live-URL suites: 85 passed, with one pre-existing `PROOF_GREEN` failure and six live HTTP setup errors against an unrelated external URL.
- Skill-lib manifest check: pass after deterministic refresh.
- Capability and frontend module-build scanners: pass. Other doctrine scanners report only pre-existing repository debt documented in the draft PR.

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

A provenance record can be verifiable without being public. Owner-filtered feeds can omit global-chain predecessors, and TTL can remove old predecessors; Repair 07 still owns a coherent concurrency and verification design for those gaps.

Unexpired legacy JSONL rows are redacted on read and age out under the bounded policy. Rewriting their stored payloads in place would invalidate historical hashes, so any persisted-row rechain migration remains with Repair 07.

Chat approvals bind the prompt and mode after the current transcript and model state are re-evaluated. Persistently fingerprinting that ambient context remains a later seam; independently gated tool calls still require their own exact, configuration-bound approval before any side effect.
