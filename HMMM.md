# hmmm — a0p open boundary

> Per the `The-Interdependency` doctrine, every deliverable carries an
> explicit `hmmm` boundary section. This is the project-level one.
> Module-level `hmmm` lives in each module's `MODULE_BUILD` block.

## Architecture (open)

### Layered tensor model — **REBUILD COMPLETE (core substrate)**

**2026-07-10 status**: Part 2 rebuild of the PCNA → PCTA → PTCA core
substrate is complete and manifest-first aligned.

The user's canon framing is now realized in code:

```
PCNA  = pcna/tensor.py          (leaf, d=53 scalar payload)
PCTA  = pcta/circle.py          (7 tensors, {7/2} heptagram, UCNS mirror)
PTCA  = ptca/seed.py + core.py  (7 circles → N=157 seeds, {7/3}, UCNS)
```

All modules are manifest-first (full MODULE_BUILD + BOUNDARIES +
CAPABILITIES + contracts), import from `ptca.constants` as single source
of truth, and carry the F4 ratification note.

**F4 Ratification (user, 2026-07-10)**: `SEED_COUNT=157` (with 7/7/53)
is **load-bearing public canon**. Not arbitrary. Decoupling is not a thing.
Documented and built exactly this way.

### The `9` axis — closed

No presence in canon constants or layered model.

## UCNS surface (open)

- `ucns >= 1.0` ships `ucns.a0_safe` (pinned via git).
- UCNS-A defended; UCNS-G unproven (bridge layer only).
- SEQ-PRIME absolute only inside verified domains.

## Platform / runtime (closed)

Emergent removed. BYOK keys via Key Vault.

## Skill canon (closed)

msdmd, meta-module-build, ratios, test-build discipline followed.

## Rebuild plan — status

**Completed (2026-07-10)**:
1. `pcna/tensor.py` — leaf tensor, payload ops, canon import, manifest.
2. `pcta/circle.py` — 7-tensor UCNS circle, {7/2} heptagram, aggregate.
3. `ptca/seed.py` — 7-circle UCNS seed, {7/3} heptagram.
4. `ptca/core.py` — N=157 seed core (public canon), aggregate.

**Remaining (network layer + invariant tests)**:
- `network/` (topology, rings, propagate, coherence) — still on old
  61-seed graph; needs port to new substrate.
- Full non-commutativity + double-cover (R/4πZ) contract tests in
gonal/embed layer (F6 remediation).
- Inspector UI update for layered depth ladder.

All new modules pass skill-lib gate (manifest + msdmd + ratios).

## Training surface audit (F6) + F1/F4 notes

F1 (AGPL-3.0): Root LICENSE added.
F4 (157 canon): Closed — public, load-bearing, built as-is.
F6 audit: Recorded in earlier section; non-commutativity violation in
`phase_compose` and single-cover geometry flagged for remediation.

**Next user directive required for**: network layer port or gonal
invariant test implementation.
