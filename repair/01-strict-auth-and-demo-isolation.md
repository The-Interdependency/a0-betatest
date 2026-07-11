# Repair 01 — Strict authentication and demo isolation

**Priority:** P0  
**Status:** open  
**Primary risk:** anonymous callers share one persistent identity and can store or spend credentials and data through it.

## Verified current behavior

- `auth.get_current_user_or_demo()` returns the synthetic user id `local` whenever no valid access token is present.
- `server._auth_uid()` uses that fallback for BYOK keys, the environment vault, sessions, drafts, usage, model inventory, and provider-backed chat.
- Startup migration moves `local` keys, vault records, sessions, drafts, usage, and overrides into the configured administrator account.

This is not a safe anonymous mode. It is one shared persistent account whose data can be created by unrelated callers and later inherited by an administrator.

## Objective

Make all persistence and provider-consuming operations require a real authenticated user. Preserve a demo experience only as an isolated, non-persistent, non-BYOK surface.

## Required changes

1. Replace `get_current_user_or_demo` with `get_current_user` on every route that:
   - reads or writes MongoDB user data;
   - stores or reveals credentials;
   - invokes an external model provider;
   - records usage, drafts, sessions, overrides, tools, or agent state.
2. Remove `_auth_uid()` fallback semantics. It may remain as a strict helper that returns the authenticated id or be deleted.
3. Create a distinct demo router or service with all of these constraints:
   - no BYOK key access;
   - no environment-vault access;
   - no durable sessions, drafts, tools, overrides, or usage records;
   - no caller-selectable user id;
   - bounded platform quota, if any platform inference is intentionally offered;
   - an opaque per-browser/session identifier that expires and is never promoted into an account.
4. Stop migrating newly created `local` records into the administrator account. Keep a one-time, explicit migration script for historical rows and then remove runtime migration.
5. Remove unused `user_id="local"` request fields and query parameters from authenticated models and route signatures.
6. Return `401` for unauthenticated persistence/provider requests and `403` where an authenticated role lacks permission.

## Required tests

- An anonymous request to `/api/keys`, `/api/vault`, `/api/sessions`, `/api/drafts`, `/api/usage`, and provider-backed chat returns `401`.
- Two anonymous demo sessions cannot observe or mutate each other.
- Demo calls cannot read, write, reveal, or spend any persisted BYOK key.
- Creating anonymous demo activity and restarting the service does not create Mongo records under `local`.
- Startup never migrates anonymous activity into the administrator account.
- Existing authenticated-user tests continue to prove owner scoping.

## Acceptance commands

```bash
python -m compileall -q backend
python -m pytest -q backend/tests backend/interdependent_lib/tests
```

Add a focused multi-user authentication test module and run it explicitly in CI.

## Likely touchpoints

- `backend/auth/__init__.py`
- `backend/server.py`
- `backend/api_extensions.py`
- `backend/api_training.py`
- `backend/api_agent_lab.py`
- `backend/api_tools_mcp_skills.py`
- frontend demo/auth routing
- startup migration logic

## Out of scope

Cookie, OAuth, password-hashing, and refresh-token mechanics belong to Repair 06.

## hmmm

Historical `local` rows may contain legitimate pre-auth Erin data mixed with anonymous records. Migration must be explicit, inspectable, and reversible; do not bulk-transfer all remaining `local` records automatically.