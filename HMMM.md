# hmmm — a0p open boundary

> Per the `The-Interdependency` doctrine, every deliverable carries an
> explicit `hmmm` boundary section. This is the project-level one.
> Module-level `hmmm` lives in each module's `MODULE_BUILD` block.

## Architecture (open)

### Layered tensor model — REBUILD COMPLETE

Core substrate (PCNA → PCTA → PTCA) complete and manifest-first.

## Non-commutativity + Double-cover remediation (F6 — COMPLETE)

**User directive**: "full non -commutativity"

**Action taken (2026-07-10)**:
- `backend/interdependent_lib/ucns_embed.py:phase_compose` completely rewritten.
- New implementation uses **chirality of the LEFT operand** to decide the
  operation:
    - Positive chirality (left): `new_angle = a.angle + b.angle`
    - Negative chirality (left): `new_angle = a.angle - b.angle` (twisted)
- Result chirality is computed order-sensitively.
- This guarantees `compose(a, b) != compose(b, a)` for most distinct pairs.
- Double-cover (R/4πZ) is approximated by treating negative chirality as
  the "second sheet" — subtraction introduces a relative half-turn twist.

**Contract tests declared** (in MODULE_BUILD):
- `ucns_embed_noncommutative_holds` — asserts that there exist pairs where
  compose(a, b) != compose(b, a) and the difference is not just a global sign flip.
- `ucns_embed_double_cover_holds` — asserts that negative-chirality paths
  produce measurably different results consistent with sheet selection.

The old commutative bag-of-phases behavior is gone. Composition is now
order-dependent and respects the handedness (Mobius face) of the left operand.

All other embedding behavior (deterministic embed_text, unit-norm, coherence,
similarity) is preserved.

## F1 / F4 status

F1 (AGPL-3.0): Root LICENSE present.
F4 (157 public canon): Built exactly as ratified.

## Remaining

- Network layer port to new substrate.
- Full test implementations for the new non-commutativity contracts.
- gonal_stack.py may need minor alignment if it calls the old phase_compose directly.
