# Repair 13 — Substrate composition completion or constraint

**Priority:** P2 research  
**Status:** open  
**Primary risk:** structural routing helpers and fixture-level order sensitivity may be mistaken for completed non-commutative algebra or R/4πZ double-cover enforcement.

## Verified current behavior

- PCTA `heptagram_compose()` currently zips corresponding tensors and applies leaf `tensor_compose()`.
- Leaf tensor composition is element-wise addition and therefore commutative.
- The heptagram walk is represented structurally, but the current composition does not use the walk to create a general order-sensitive circle operation.
- Module metadata now correctly marks full non-commutativity and double-cover semantics unresolved.
- Focused tests establish current fixture behavior and construction integrity, not general algebraic laws or formal proof.

## Objective

Choose one honest boundary and implement it completely:

A. implement the intended non-commutative and double-cover substrate with property/formal evidence; or  
B. constrain public APIs and documentation to structural heptagram routing without claiming those stronger properties.

Do not leave code and public language straddling both states.

## Required investigation

1. Recover the canonical intended operation from authoritative project material, not generated completion prose.
2. Specify, before code:
   - carrier and payload types;
   - identity;
   - composition order;
   - chirality/face behavior;
   - angle domain and normalization;
   - exact meaning of R/4πZ double cover;
   - associativity expectations;
   - whether inverses exist;
   - decomposition firewall;
   - relation between UCNS-A proof status and UCNS-G geometry.
3. Reconcile `ucns_embed.phase_compose`, PCTA circle, PTCA seed/core, gonal stack, and public training surfaces against that specification.

## Implementation path A — complete the stronger operation

1. Implement order-sensitive composition at the declared layer rather than relying on a comment or test input accident.
2. Reject incompatible lane/carrier shapes rather than silently truncating.
3. Derive chirality and faces from the resulting operation consistently.
4. Use deterministic canonical serialization and cryptographic content identifiers instead of Python `hash()` for provenance-bearing values.
5. Add property tests over broad generated inputs for:
   - determinism;
   - closure;
   - identity behavior;
   - non-commutativity where claimed;
   - associativity or explicit non-associativity;
   - 4π periodicity and 2π distinction where claimed;
   - shape preservation;
   - decomposition prohibition.
6. Add formal proof obligations where the public claim requires proof rather than tests.

## Implementation path B — constrain the surface

1. Rename operations to `structural_*` where necessary.
2. Remove non-commutative and double-cover claims from public API descriptions except as unresolved targets.
3. Ensure tests state exactly what fixture or structural property they verify.
4. Keep theorem/proof status firewalled from geometry and measurement claims.

## Required tests

Regardless of path:

- Reversing inputs tests the actual operation, not merely the existence of a chapter object.
- Double-cover tests distinguish values modulo 4π and verify the intended 2π relation; length equality is not sufficient.
- Shape mismatch behavior is explicit.
- Canonical identifiers are stable across processes and Python hash seeds.
- Public status text is generated from the selected implementation boundary.

## Acceptance commands

```bash
python -m compileall -q backend
python -m pytest -q backend/interdependent_lib/tests backend/tests
```

Add property-based tests. Run any Lean/formal gate separately and report remaining obligations without translating test success into proof status.

## Likely touchpoints

- `backend/interdependent_lib/ucns_embed.py`
- `backend/interdependent_lib/pcna/tensor.py`
- `backend/interdependent_lib/pcta/circle.py`
- `backend/interdependent_lib/ptca/seed.py`
- `backend/interdependent_lib/ptca/core.py`
- `backend/interdependent_lib/gonal_stack.py`
- invariant tests, HMMM, and generated documentation

## Out of scope

Security repairs 01–07 must not be delayed by this research task.

## hmmm

The unresolved question is mathematical, not merely implementation detail: the correct layer and law for non-commutative composition must be recovered from canon before additional code is accepted.