# Repair 11 — Indexes, retention, and collision handling

**Priority:** P2  
**Status:** open  
**Primary risk:** declared uniqueness is not consistently enforced, operational collections can grow indefinitely, and common races can surface as unhandled server errors.

## Verified current behavior

- BYOK and vault indexes are non-unique even though route behavior assumes one key per user/provider and one vault entry per user/site/account label.
- Detachable-agent slug index is non-unique while creation performs a separate find-then-insert check.
- Login attempts have an identifier index but no TTL retention.
- Pending overrides lack explicit owner/status/expiry indexes in `ensure_indexes()`.
- FIQ audit is indexed only by timestamp; Repair 07 will add chain-order indexes.
- Registration and other find-then-insert paths can race against unique indexes and should translate duplicate-key errors deliberately.

## Objective

Align database constraints with application invariants and define retention, migration, and duplicate handling for every operational collection.

## Required changes

1. Inventory each collection with:
   - ownership field;
   - natural uniqueness key;
   - query patterns;
   - retention requirement;
   - sensitive-data classification.
2. Add unique indexes where application semantics require uniqueness, including after cleaning duplicate historical rows.
3. Add indexes for override owner/status/expiry and audit owner/order queries.
4. Add TTL or scheduled retention for:
   - login attempts;
   - password-reset tokens;
   - transient demo quota rows where appropriate;
   - expired raw override material;
   - temporary OAuth/session state;
   - stale diagnostic artifacts.
5. Catch `DuplicateKeyError` at registration, key, vault, tool, server, and agent creation boundaries and return deterministic `409` responses.
6. Make index creation migrations explicit. Do not silently fail startup or delete duplicates arbitrarily.
7. Add schema version or migration tracking so production changes are repeatable.
8. Define deletion behavior for users and owned records, including encrypted secrets and audit-retention exceptions.
9. Add pagination rather than fixed high limits where collections can grow.
10. Review all mutable default values in request models and dataclasses and replace shared defaults with factories where required.

## Required tests

- Concurrent duplicate registration produces one record and one deterministic `409`, not a `500`.
- Concurrent duplicate BYOK/vault/tool/agent creation cannot create duplicate natural keys.
- TTL indexes are present with the intended field and expiration behavior.
- Required query indexes are asserted through an integration test or migration inspection.
- Duplicate-cleanup migration is deterministic and produces an audit report.
- User deletion follows the declared retention policy without orphaning active secrets.

## Acceptance commands

```bash
python -m compileall -q backend
python -m pytest -q backend/tests
```

Run index and race tests against a disposable Mongo instance.

## Likely touchpoints

- `backend/db.py`
- auth, keys, vault, tools, agents, override route modules
- migration scripts and deployment process
- data-retention documentation

## Out of scope

FIQ sequence design is owned by Repair 07. Secret encryption is owned by Repair 05.

## hmmm

Adding a unique index to dirty production data is destructive unless duplicates are first classified. The migration must report what it keeps, merges, quarantines, or rejects.