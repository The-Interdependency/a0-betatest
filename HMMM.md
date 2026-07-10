# hmmm — a0p open boundary

> Per the `The-Interdependency` doctrine, every deliverable carries an
> explicit `hmmm` boundary section. This is the project-level one.
> Module-level `hmmm` lives in each module's `MODULE_BUILD` block.

## Architecture (open)

### Layered tensor model — rebuild pending

The user's canon framing (confirmed turn 2026-06-02):

```
PCNA  = pure tensor layer (leaves; scalar payloads, d = 53)
PCTA  = tensors-on-UCNS-objects layer
        7 tensors per circle, the circle itself is also a tensor
PTCA  = top / seed layer
        7 circles per seed, the seed itself is also a tensor
core  = N seeds, the core itself is also a tensor
PCEA  = "this state, last state" UCNS kernel runtime encryption
        — cross-cuts every layer
```

Recursive fractal: each layer's whole-of-seven is itself a tensor at
its level. Substrate is UCNS — depth-d objects carry depth-(d-1)
payloads.

What's in the repo today is **wrong** under this model:
- `interdependent_lib/ptca/tensor.py` holds a flat `[N, 4, 7, 7]`
  nested-list "tensor" — never a UCNS object, no depth lift,
  no payload arithmetic, no provenance through composition.
- `interdependent_lib/pcna/pcna.py` reduces the rings to scalar
  signals (a float per ring). Canon: each ring is an N-sized tensor
  (Φ N=53, Ψ N=53, Ω N=53, Θ N=29, MemL N=19, MemS N=17, Σ N=41 as
  observer outside the scored set).
- `interdependent_lib/pcta/` does not exist.

Rebuild plan is recorded under `## Rebuild plan` below; not started.

### The `9` axis — closed, was misremembered

Canon `prime_core/constants.py` defines `[SEED_COUNT=157,
CIRCLES_PER_SEED=7, TENSORS_PER_CIRCLE=7, TENSOR_DIM=53]`. The
"9-axis" from an earlier design conversation has no presence in the
upstream constants or the corrected layer model. Marking closed.

## UCNS surface (open)

- `ucns >= 1.0` ships `ucns.a0_safe` (the A0-facing inspection facade
  with `identity / describe / canonical / factor`). Pinned in this
  build via `git+https://github.com/The-Interdependency/ucns.git`.
  The PyPI 0.8.3 stable release does **not** ship `a0_safe` yet — when
  it does, switch to a PyPI pin.
- UCNS-A (factorization algebra) is `DEFENDED + ORACLE-COMPLETE` at
  depths the catalogue covers. UCNS-G (metric geometry) is unproven.
  Per `interdependent-lib/docs/handoffs/v2-ucns-metric-geometry.md`:
  *"Theorem N proof status is not transferred by shared name."* Any
  a0p-facing claim that uses geometric coordinates must route through
  the bridge layer, not the algebra.
- `SEQ-PRIME` is absolute only inside `ucns.VERIFIED_DOMAIN_LABELS`.
  A0-facing consumers (this app counts) should consult
  `domain_status_metadata` and treat `SEQ-PRIME` outside verified
  domains as non-absolute.

## Platform / runtime (closed in this turn)

- **Emergent dependency removed.** `emergentintegrations` uninstalled;
  `EmergentProvider` deleted; `EMERGENT_LLM_KEY` removed from `.env`;
  Workspace's "emergent routing" toggles removed. Chat now requires
  the user to supply BYOK keys via the Key Vault.
- Deployment surface: the app still runs on the Emergent preview
  hosting URL (`REACT_APP_BACKEND_URL`), but the *application code* has
  no runtime dependency on Emergent software.

## Skill canon (closed in prior turn)

- `msdmd` parser synced line-for-line from
  `The-Interdependency/skill-lib/msdmd/parsers/universal.py`.
- `meta-module-build` runner — 42/42 covered, 0 gaps, 0 invalid.
- `test-build` runner — 4 contracts, 4 PASS, 0 FAIL, 0 ERROR.

## Rebuild plan (proposed; not started)

Single coordinated rebuild against the layered model. Replaces the
"PTCA stratified rebuild" + "PCNA canon-topology rebuild" tasks (those
were mutually exclusive, since they describe the same data at
different layers).

Proposed file layout, manifest-first per the meta-module-build skill:

```
interdependent_lib/
├── pcna/
│   ├── tensor.py        # leaf tensor: scalar payload of width d=53
│   ├── group.py         # "all 7 together is a tensor" — pcna-internal
│   │                    # composition op + identity
│   └── (existing memory_core / edcm / sigma / theta / zeta retained)
├── pcta/
│   ├── circle.py        # Circle = UCNS object carrying 7 PCNA tensors
│   │                    # composition op: {7/2} heptagram
│   └── audit.py         # PCTA-circle audit hooks (gate, count) per
│                        # canon PCNA §inference-step-5
├── ptca/
│   ├── seed.py          # Seed = UCNS object carrying 7 PCTA circles
│   │                    # composition op: {7/3} heptagram
│   ├── core.py          # Core = N seeds (N=157 canon; tunable)
│   ├── constants.py     # SEED_COUNT / CIRCLES_PER_SEED / ... (synced)
│   └── audit.py         # PTCA-seed audit hooks (hub-ring coherence)
└── network/             # canonical PCNA-network engine (61-seed
    │                    # graph, six rings, EDCM, heptagram propagate)
    ├── topology.py
    ├── rings.py
    ├── propagate.py
    └── coherence.py
```

PCEA cross-cuts: every layer's composition op delegates last-state
keying to PCEA so state transitions are encrypted by default.

## Suggested order, once approved

1. **PCNA `tensor.py`** — leaf tensor, payload arithmetic, group op.
   Contract: round-trip + composition associativity.
2. **PCTA `circle.py`** — UCNS-wrapped circle of 7 tensors. Contract:
   `ucns.a0_safe.identity(circle)` is stable across equivalent
   circles; `multiply(circle_a, circle_b)` lifts to a circle.
3. **PTCA `seed.py`** + `core.py` — UCNS-wrapped seed of 7 circles;
   core assembly of N=157 seeds. Contract: `prime_core` shape +
   provenance hash agreement.
4. **`network/`** — canon PCNA-network engine on the substrate. Six
   rings + Σ observer + EDCM + heptagram propagate. Contract:
   determinism over a fixed input.
5. **Inspector UI** — render the layered structure (was a tensor card,
   now a UCNS-depth ladder).

## Definitely out of scope this session

- Carrier widening (UCNS `FRONTIER`).
- UCNS-G metric geometry claims.
- Theorem N proof transfer across the prime-quartet boundary.

## Training surface audit (F6 — 2026-07-10, Grok)

**Context**: These files (`gonal_stack.py`, `ucns_embed.py`, `edcm_readout.py` + `api_training.py` / `api_agent_lab.py`) implement a landed UCNS-touching training surface but were absent from the project boundary object. This is exactly the class of drift `hmmm` exists to catch. Audit performed against the ucns-side invariants in the handoff brief.

**Files reviewed (live SHAs)**:
- `backend/interdependent_lib/gonal_stack.py` (564f9413867f4744e24ba6b971e200552275a62f)
- `backend/interdependent_lib/ucns_embed.py` (65b4038d41f79245f40dafa326630a69e8855c26)
- `backend/interdependent_lib/edcm_readout.py` (bf94d7a44d08ae1d1ea1af7e62ffcc1305ed1e85)

**Findings — invariants**:

1. **Non-commutativity (ucns_embed.py)**: `phase_compose(a, b)` performs lane-wise angle addition mod 2^16 (one turn). This is commutative (`a + b ≡ b + a`). Composition collapses to a bag-of-phases. **Violates load-bearing invariant** "a×b ≠ b×a must survive wrapping". The layer is UCNS-flavored but not UCNS-native. **Build failure** per spec. (Chirality via `sign(sin(angle))` does not rescue commutativity.)

2. **Double cover / R/4πZ (gonal_stack.py + ucns_embed.py)**: All angle math, `phase_compose`, `coherence()`, `similarity()` use standard single-turn quantization (0–65535 ≡ 2π). No winding/lift for two laps (720°). Chirality attempts "Mobius face" but geometry remains single-cover (R/2πZ). Handedness not preserved through composition. **Single-cover ⇒ handedness lost**; geometry currently decorative (consistent with the module's own `GEOMETRY_STATUS = "ucns-g:non-absolute"` claim, but the double-cover contract is not held).

3. **edcm_readout.py**: Self-contained lightweight projection (own cm/da/drift/dvg/int/tbf from text features). **Does not import edcmbone**. Explicitly disclaims theorem/proof transfer and is not a re-derivation of core F-metrics. Avoids the drifting-definition risk. Safe on this axis (adapter only).

**Ledger action**: These modules are now recorded. Recommended follow-up (before or during rebuild): add contract tests asserting non-commutativity on a known pair and two-lap return for gonal geometry.

**Note on license (F1 ratified AGPL-3.0)**: Root LICENSE added as AGPL-3.0. Any future vendoring decisions (e.g. aimmh_lib MPL-2.0) must be re-derived under AGPL network-copyleft rules. No CONNECTIONS.md present in this repo (assertion was in a0ucns mirror).
