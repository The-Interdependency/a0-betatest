# Repair 07 — Atomic FIQ provenance chain

**Priority:** P1  
**Status:** open  
**Primary risk:** concurrent emitters can read the same previous hash and create a fork while the interface presents one append-only chain.

## Verified current behavior

- `fiq_emit.emit()` reads the latest event hash with `_last_hash()` and then performs a separate insert.
- The latest event is selected by millisecond timestamp.
- No transaction, compare-and-swap condition, unique sequence, or chain-head document serializes concurrent appends.
- The database indexes timestamp only; it does not enforce one successor per previous hash or a monotonic sequence.
- Event types include dedicated tool call/result values, but direct invocation paths must be audited to ensure they emit the correct paired taxonomy.

## Objective

Make provenance append ordering deterministic and verifiable under concurrency, with explicit chain scope and event semantics.

## Required changes

1. Choose and document chain scope:
   - one chain per user;
   - one chain per agent;
   - or one global chain with strict authorization and redaction.
2. Add a monotonic integer `sequence` within that scope.
3. Serialize append using one supported strategy:
   - Mongo transaction around head read, insert, and head update;
   - atomic counter allocation plus predecessor validation;
   - compare-and-swap on a chain-head document with retry.
4. Add unique indexes on chain scope plus `sequence` and, where valid, predecessor linkage.
5. Include sequence, scope, schema version, and event type in the hashed canonical payload.
6. Specify canonical serialization and forbid unstable Python representations.
7. Add a verifier that detects missing sequence numbers, forks, hash mismatch, scope crossing, and unsupported schema versions.
8. Ensure tool invocation emits `zfae_tool_call` and `zfae_tool_result` as a correlated pair, including failure and halt outcomes.
9. Define behavior when audit insertion fails:
   - fail the protected action closed where provenance is mandatory;
   - or persist an explicit degraded-state record through a separate durable mechanism.
10. Make timestamp informational, not the ordering authority.

## Required tests

- Hundreds of concurrent emits produce one contiguous sequence with no forks.
- Verifier rejects a modified payload, deleted event, duplicate sequence, and competing successor.
- Events from two chain scopes cannot link to one another.
- Every completed or failed tool invocation has a correlated call/result pair.
- Millisecond timestamp collisions do not affect order.
- Retry behavior does not duplicate logical events.

## Acceptance commands

```bash
python -m compileall -q backend
python -m pytest -q backend/tests
```

Run a concurrency stress test against a real disposable Mongo instance in CI.

## Likely touchpoints

- `backend/interdependent_lib/zfae/fiq_emit.py`
- `backend/interdependent_lib/zfae/runtime.py`
- `backend/tools/gated_invoke.py`
- `backend/db.py`
- audit-feed verification UI

## Out of scope

Payload confidentiality and access control belong to Repair 03.

## hmmm

A collection of individually hashed rows is not necessarily a chain. The uniqueness of successor ordering must be enforced by storage, not inferred after insertion.