# Repair 04 — Tenant-scoped tool registry

**Priority:** P0  
**Status:** open  
**Primary risk:** two users registering the same tool name can overwrite or invoke one another’s in-process tool definition.

## Verified current behavior

- `backend/tools/registry.py` stores all tools in `_REG: dict[str, Tool]` keyed only by public name.
- `register()` overwrites any existing entry with the same name.
- `lookup()` and `invoke()` resolve only by name and do not enforce `owner_user_id`.
- `_hydrate_user_tools()` loads each authenticated user’s Mongo definitions into that process-global name map.
- Listing filters by owner, but dispatch occurs after a name-only lookup.

The most recently hydrated definition wins. Under concurrent requests, same-named user tools can cross tenant boundaries even though database records are owner-scoped.

## Objective

Make tool registration, lookup, deletion, hydration, and invocation owner-aware by construction.

## Required changes

1. Replace the name-only registry with explicit namespaces:
   - global built-ins keyed by name;
   - user tools keyed by `(user_id, name)`;
   - MCP/Odysseus mirrors keyed by stable owner/server/tool identity.
2. Change `lookup`, `unregister`, and `invoke` to require the acting user id for non-global tools.
3. Define deterministic resolution:
   - owner tool of the requested name, if allowed;
   - otherwise global built-in;
   - never another owner’s entry.
4. Prevent user tools from shadowing reserved globals unless an explicit aliasing design is introduced.
5. Remove hydration as an unsafe global mutation. Prefer:
   - request-local immutable tool views;
   - an owner-keyed cache with versioning;
   - direct database resolution with bounded caching.
6. Ensure deletion evicts only the exact owner key.
7. Include owner identity in sentinel, override, and audit records for every invocation.
8. Add locking or immutable replacement semantics for cache refreshes.
9. Review MCP and Odysseus generated names; stable hashes reduce collision probability but do not replace owner-scoped lookup.

## Required tests

- User A and User B may register the same name with different endpoints.
- Each user always invokes their own definition across alternating and concurrent requests.
- Deleting User A’s tool never removes User B’s tool or a global built-in.
- A user cannot invoke another owner’s tool by knowing its public name.
- Hydration order does not change dispatch.
- Audit records identify the correct owner and resolved tool identity.

## Acceptance commands

```bash
python -m compileall -q backend
python -m pytest -q backend/tests
```

Add an async concurrency test that repeatedly hydrates and invokes same-named tools for two users.

## Likely touchpoints

- `backend/tools/registry.py`
- `backend/api_tools_mcp_skills.py`
- `backend/tools/gated_invoke.py`
- MCP and Odysseus adapters
- tool-related contracts and tests

## Out of scope

Outbound URL safety and stored webhook secrets belong to Repair 05.

## hmmm

Globally unique generated names are not a tenant boundary. Ownership must remain an input to resolution even when names appear collision-resistant.