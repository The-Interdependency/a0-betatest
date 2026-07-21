# a0p — research instrument

> _changes constant. refinements welcome._  
> [wayseer@interdependentway.org](mailto:wayseer@interdependentway.org)

`a0p` is a BYOK multi-model workspace wrapped around the deterministic
`a0(zfae)` state engine. It is an alpha research instrument, not a production
multi-tenant service.

## Current authority boundary

### A0 public gonol

This repository preserves the exact public 157-glyph gonol that originated at:

```text
repository: The-Interdependency/a0-betatest
commit:     7af8debf6ef3905f01baff02b43d8c3bee16ccbc
path:       backend/interdependent_lib/gonal/gonal.py
sha256:     55d10c84529a4d7bc7714786357e977b68d9df2ac3f73d20e229580b552c2ef5
```

The immutable source fixture is exposed as
`interdependent_lib.gonal.gonal.PUBLIC_GONOL_157`.

Load-bearing source-fixture facts:

- arity is 157;
- position `0` is SPACE;
- digit `"0"` is an ordinary nonzero glyph;
- every glyph is unique;
- private A0 phase and permutation state fixes position `0`;
- repeated-glyph lifted traversal advances one full 157-position source
  revolution.

### UCNS

Current UCNS runtime geometry is typed `NA`.

The former `ucns==0.8.3` package and later pre-reset implementation lineage are
archive evidence. They are not installed or activated by A0 because they do not
implement the intrinsically twist-bearing UCNS object required after the
2026-07-19 reset.

A0 currently exposes no UCNS:

- object constructor;
- unit;
- multiplication or quotient;
- factorization or primality;
- theorem status;
- continuous public-gonol bridge; or
- double-cover proof.

`backend/ucns.py` and `interdependent_lib.ucns_bridge` fail closed with the
reset reason. Reactivation requires a new, versioned, twist-bearing producer
contract and migration schema.

### A0-local mathematical surfaces

The following remain operational but are explicitly local:

- `A0StructuralShape` — content identity for PCTA/PTCA aggregates;
- `A0LaneFrame` / `A0WordFrame` — deterministic morphology framing;
- `A0PhaseEmbedding` — hash-derived phase lanes;
- `ordered_phase_compose` — order-sensitive application composition;
- `PrivateGonal` — per-agent fixed-origin phase/permutation state;
- `a0-g:experimental` disk stacks — training visualization shapes.

None transfers UCNS proof status.

### EDCM

The training view exposes **A0 interaction heuristics**, not maintained EDCM
measurement. The local features are bounded and deterministic, but they make no
claim about diagnosis, intent, belief, consciousness, hidden state, or EDCM
validity.

## Runtime architecture

### Native and teacher-assisted inference

`ZFAERuntime` keeps the sources explicit:

- `teacher_assisted` calls a selected BYOK model and may update the local weight
  bank;
- `zfae_native` runs the deterministic local engine only;
- an unready native bank refuses rather than returning teacher text under a
  native label;
- sentinel halts return `zfae_halted` with an explicit pending override.

Every response carries `reply_source`, `teacher_called`, and
`zfae_weights_updated`.

### Providers

User-supplied keys may call:

- OpenAI;
- Anthropic;
- Gemini; and
- xAI.

Keys are intended to be encrypted at rest through the A0 key vault.

### Agent instances

Character-sheet-bound instances carry their own:

- mode and model selection;
- persona and system prompt;
- Φ/Ψ/Ω weight bank;
- memory configuration;
- tool allow-list;
- sentinel modes and weights; and
- training archive.

### Tools and provenance

A0 includes native, webhook, MCP, and Odysseus tool adapters. Invocations pass
through the sentinel gate and emit FIQ provenance events.

## Security status

|∆|Treat the current deployment as single-user research infrastructure.|∆|

The existing repair inventory remains authoritative for security order:

1. strict authentication and demo isolation;
2. per-user ZFAE state and protected agent APIs;
3. audit-feed and override confidentiality;
4. tenant-scoped tool registry;
5. outbound SSRF prevention and encrypted webhook secrets;
6. authentication and session hardening;
7. atomic FIQ provenance;
8. deployment environment contract;
9. required CI and branch protection;
10. package import normalization.

Do not expose shared anonymous state, BYOK storage, audit payloads, overrides,
or user-defined outbound tools as a public multi-user service until the first
five repairs are complete.

## Installation

```bash
git clone https://github.com/The-Interdependency/a0-betatest.git
cd a0-betatest
python -m pip install -r backend/requirements.txt
npm install --prefix frontend
```

Required backend configuration includes:

```text
MONGO_URL
DB_NAME
JWT_SECRET
A0P_KEY_VAULT_SECRET
CORS_ORIGINS
```

## Validation

The pull-request gate runs:

```text
python -m compileall -q backend
pytest backend/interdependent_lib/tests/test_invariants.py
pytest backend/tests/test_reset_boundaries.py
pytest backend/tests/test_lifted_path.py
pytest backend/tests/test_morphology_ladder.py
pytest backend/tests/test_zfae_gonal_inscription.py
backend import smoke
frontend build without @replit packages
```

The gate also verifies that no external `ucns` distribution is installed.

## Documentation discipline

Module-owned declarations live beside their implementation. Test-owned `CHECKS`
provide executable evidence for source-owned `CONTRACTS`.

README generation is explicit; ordinary application startup does not rewrite
repository files. To regenerate from current module declarations:

```bash
cd backend
A0P_ALLOW_DOC_WRITE=1 python readme_writer.py
```

## License

Apache-2.0.

## hmmm

The exact public source fixture is preserved. The lawful projection from that
fixture into the restarted, intrinsically twist-bearing UCNS object remains
unresolved.
