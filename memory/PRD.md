# a0p — Product Requirements Doc

> **a0p** — donation-funded research instrument: BYOK multi-model AI workspace +
> PTCA / PCNA / PCEA inference engine built (rebuilt-from-spec) against
> The-Interdependency canon. Skill-lib compliant: every module declares its
> own `MODULE_BUILD` manifest and (where applicable) `CONTRACTS` block.

## Architecture

```
/app
├── backend/                            FastAPI + Motor (Mongo) + httpx
│   ├── server.py                       /api/* routes
│   ├── crypto_vault.py                 Fernet at-rest encryption
│   ├── db.py                           Motor + collection indices
│   ├── models.py                       Pydantic surface
│   ├── providers/                      BYOK adapters (openai, anthropic, gemini, xai, emergent)
│   ├── a0p_skills/                     project's skill-lib runners
│   │   ├── test_build_runner.py        imports CONTRACTS `call:` paths and runs them
│   │   ├── module_build_runner.py      validates MODULE_BUILD schema
│   │   ├── contracts.py                actual test functions
│   │   └── SKILL.md                    canonical doc
│   └── interdependent_lib/
│       ├── _msdmd/parser.py            canon parser (synced from skill-lib)
│       ├── pcea/  ptca/  pcna/  aimmh/  zfae/
│
└── frontend/                           React + Tailwind + react-markdown + KaTeX
    ├── public/manifest.json            PWA manifest (Bubblewrap-ready)
    ├── ANDROID_APK.md                  Bubblewrap TWA build steps
    └── src/                            7 routes: Workspace, Inventory, Keys, Vault, Drafts, Inspector (3 skill tiles), Agents
```

## msdmd / skill-lib compliance — 2026-05-31

| Skill | Block | Coverage | Status |
|---|---|---|---|
| `msdmd` (parser) | — | canonical `parser.py` synced line-for-line from skill-lib | ✅ |
| `meta-module-build` | `MODULE_BUILD` | 42 / 42 covered · 42 valid · 0 invalid | ✅ |
| `test-build` | `CONTRACTS` | 4 contracts: 4 PASS · 0 FAIL · 0 ERROR | ✅ |

Boundary risk surface (non-`none` declared):
- `user_data_boundary=read`: 11 modules · `network_boundary=external`: 8 ·
  `storage_boundary=read`: 7 · `storage_boundary=write`: 2 ·
  `user_data_boundary=write`: 2 · `network_boundary=internal`: 1

The `test-build` runner ALREADY caught one real bug it would have
otherwise hidden: PCEA `to_bijective(0, p)` was returning `[1]` instead
of `[]`, breaking the bijective round-trip for state-element zero.
Fixed in `codec.py`; the contract now passes.

## Backend feature inventory

| Route prefix | What it does |
|---|---|
| `/api/health` | Service status + provider list + ZFAE agent card |
| `/api/keys` | BYOK key vault (Fernet-encrypted at rest) |
| `/api/vault` `/api/vault/reveal` | Per-site multi-account .env vault |
| `/api/models/inventory` | Aggregate inventory across BYOK keys + Emergent namespace |
| `/api/sessions` | CRUD + editable system context / persona / selected_models |
| `/api/drafts` | Autosaved prompt drafts |
| `/api/chat/single` `/fanout` `/daisychain` `/synthesize` | AIMMH patterns |
| `/api/inspector/heartbeat` `/snapshot` | PCNAEngine tick + state |
| `/api/agents` `/api/agents/{slug}/manifest` | Detachable-agents catalog + export |
| `/api/skill/capabilities/report` `/contracts/report` `/module-build/report` | Three skill coverage runners |
| `/api/usage` | Token/cost records + aggregate |

## Personas

| Persona | Goals | Pains today |
|---|---|---|
| AI researcher | Compare frontier models on the same prompt; daisy-chain; persist context | Vendor UIs siloed; no cross-vendor carousel |
| Independent dev | Own keys, multi-account per site, export agents to phone/VM | No portable agent format elsewhere |
| Math/physics student | Markdown + arxiv `\(...\)` chat | LaTeX inconsistent across chat UIs |

## hmmm — canonical open questions

These are recorded per the `skill-lib/meta-module-build` doctrine: *"If a
field is not known, write `hmmm`. Do not guess certainty into the
manifest."* Tracked here so they stay visible.

### PTCA — three-stratum rebuild

- **The `9` axis** from the design conversation (`157 × 9 × 7 × 7 + 4`)
  is not present in the upstream canon `prime_core/constants.py` (which
  has `[SEED_COUNT=157, CIRCLES=7, TENSORS=7, TENSOR_DIM=53]`). Recorded
  as `unresolved` on `interdependent_lib/ptca/__init__.py`. Will revisit
  before the stratified rebuild.
- The current `PrimeTensor` is the legacy `ptca-lib` flat `[N,4,7,7]`
  shape, not the stratified `Fiq → Circle → Seed` model. Stratified
  rebuild deferred to a dedicated session.
- The `COHERENCE_FACTOR_UNIVERSE` in `ptca/constants.py` is provisional
  per the upstream note (the defining doc is absent from any accessible
  repo).

### PCNA — canon topology rebuild

- Current impl: three 157-prime cores + six scalar ring signals.
- Canon target: 61-seed topology (1 global router + 4 sentinels + 7 meta
  routers + 49 compute seeds), six tensor rings at canonical sizes/seeds
  (Φ 53/53, Ψ 53/43, Ω 53/47, Θ 29/29, MemL 19/19, MemS 17/17), Σ 41
  observer (un-weighted), heptagram propagation per ring.
- Rebuild deferred to a dedicated session.

### UCNS

- `ucns==0.8.3` installed but **does not yet expose `a0_safe`** in this
  version. The upstream `meta-module-build` doctrine wants UCNS-facing
  code to route through `ucns.a0_safe`. Currently no binding wired;
  `prime_core` upstream uses a deterministic local tag with a try/except
  import. Will follow that pattern when the stratified rebuild lands.

### Android APK

- `ANDROID_APK.md` documents the Bubblewrap TWA build path (option B).
- `manifest.json`, `icon-192.svg`, `icon-512.svg` are in `frontend/public/`.
- `.well-known/assetlinks.json` must be served from the production origin
  before Play Store submission. Not currently served. → defer.

## Prioritized backlog

### P0
- E2E frontend testing pass (testing_agent_v3) — defer until rebuilds land
- Streaming responses (SSE) for chat

### P1
- Council UI mode (AIMMH `council` is implemented; UI toggle missing)
- Per-call cost display in transcript using public provider pricing JSON
- PTCA stratified `Fiq → Circle → Seed` rebuild against canon `prime_core`

### P2
- PCNA canon-topology rebuild (61-seed graph, tensor rings, heptagram propagation)
- UCNS `a0_safe` binding when upstream `ucns` ships it
- Premium detachable agents + Stripe checkout (3-5 mo monetization runway)
- Termux runner + JS port of AIMMH patterns (pocket-runs-locally future)
- Multi-user mode + audit log

## How to run

```bash
# Backend
sudo supervisorctl restart backend     # FastAPI on :8001 (proxied via /api)

# Frontend
sudo supervisorctl restart frontend    # CRA dev on :3000

# Skill runners (each exits non-zero on gaps/failures)
python3 -m a0p_skills.module_build_runner /app/backend
python3 -m a0p_skills.test_build_runner   /app/backend
python3 -m interdependent_lib._msdmd.runner --root /app/backend   # legacy CAPABILITIES
```

## Environment

`/app/backend/.env`:
- `MONGO_URL`, `DB_NAME`
- `EMERGENT_LLM_KEY`
- `A0P_KEY_VAULT_SECRET` (Fernet key for BYOK at-rest encryption)
