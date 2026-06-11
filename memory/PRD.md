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

## msdmd / skill-lib compliance — 2026-06-02

| Skill | Block | Coverage | Status |
|---|---|---|---|
| `msdmd` (parser) | — | canonical `parser.py` synced from skill-lib | ✅ |
| `meta-module-build` | `MODULE_BUILD` | 41 / 41 covered · 41 valid · 0 invalid | ✅ |
| `test-build` | `CONTRACTS` | 4 contracts: 4 PASS · 0 FAIL · 0 ERROR | ✅ |

PR-template at `/app/.github/PULL_REQUEST_TEMPLATE.md` enforces the
*intent → manifest → file plan → tests → scaffold* doctrine on every
future change.

## Platform independence — 2026-06-02

- `emergentintegrations` dependency removed from `requirements.txt`.
- `EmergentProvider` deleted from `/app/backend/providers/`.
- `EMERGENT_LLM_KEY` removed from `/app/backend/.env`.
- "Emergent routing" toggles removed from the frontend Workspace.
- Inventory "emergent" tab and Key-Vault Emergent section removed.
- Starter agents reseeded with BYOK model IDs (`openai:gpt-4o`,
  `anthropic:claude-sonnet-4-5-20250929`, `gemini:gemini-2.5-flash`).
- Chat without a key now returns a clear *"no api key for provider …;
  add one in the Key Vault. This build is BYOK-only"* error.
- This build has **zero runtime dependencies on Emergent software**.
  The Emergent hosting URL is still used during preview, but the
  application code is portable.

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
- ~~Sentinel halt-and-override pipeline~~ ✅ 2026-06-10
- ~~Three-Core (Phi/Psi/Omega) weight bank refactor (1,223,187 scalars)~~ ✅ 2026-06-10
- ~~Trainer round-robin across 471 seeds; native readiness requires all touched~~ ✅ 2026-06-10
- ~~FIQ provenance emitters (hash-chained zfae_* events)~~ ✅ 2026-06-10
- ~~Rename interdependent_lib/carrier/ → gonal/~~ ✅ 2026-06-10
- ~~Fix /api/instances 500 (float inf in zfae_last_loss)~~ ✅ 2026-06-10
- ~~Frontend overhaul: Agent CRUD + character sheets + 5 lattice modes + Sentinel override UI~~ ✅ 2026-06-10
- ~~Frontend msdmd compliance (// === MODULE_BUILD === on every .js/.jsx)~~ ✅ 2026-06-10
- ~~E2E frontend testing pass~~ ✅ 2026-06-10
- ~~Hybrid auth (JWT + Emergent Google + GitHub OAuth) with username + email + ≥16-char passphrase~~ ✅ 2026-06-11
- ~~Splash page (`/`) + Login/Register page (`/login`,`/register`) with passphrase show/hide~~ ✅ 2026-06-11
- ~~ProtectedRoute on all app pages; sidebar splits by auth status; signout~~ ✅ 2026-06-11
- ~~Brute-force lockout keyed by identifier (not the rotating K8s ingress IP)~~ ✅ 2026-06-11
- ~~Idempotent admin seeding on backend startup~~ ✅ 2026-06-11
- ~~Two-vault split: Model Keys (BYOK) + Developer Keys (`/api/custom-keys`, free-form, rotatable)~~ ✅ 2026-06-11
- ~~Emergent demo daily token budget (per user, 25k/day, resets 00:00 UTC)~~ ✅ 2026-06-11
- ~~Living spec endpoint + page — auto-parses every MODULE_BUILD block in the repo~~ ✅ 2026-06-11
- ~~msdmd backfill: 100% of backend (.py) modules now carry MODULE_BUILD + CONTRACTS blocks (incl. tests/)~~ ✅ 2026-06-11
- ~~Tools + MCP (server + client) + Skills layer with sentinel-gated tool calls, MCP bidirectional (a0p exposes /api/mcp as server, registers external MCP servers as client), skill catalog with jaccard overlap detection, sync from The-Interdependency/skill-lib repo~~ ✅ 2026-06-11
- ~~Frontend Tools / MCP / Skills pages with full data-testid coverage; sidebar nav updated; msdmd 27/27 modules~~ ✅ 2026-06-11
- Streaming responses (SSE) for chat

### P1
- BYOK SDK migration: httpx → official openai>=1.x / anthropic / google-generativeai
- Council UI mode (AIMMH `council` is implemented; UI toggle missing)
- Per-call cost display in transcript using public provider pricing JSON
- PTCA stratified `Fiq → Circle → Seed` rebuild against canon `prime_core`
- Migrate legacy `user_id='local'` agents → real user accounts; remove demo path
- GitHub OAuth secrets in `.env` (currently endpoint returns 503 until set)
- Wire Emergent demo quota into `runtime.reply()` — refuse teacher calls when remaining < projected_tokens; surface a BYOK CTA in the UI

### P2
- Reproducibility receipt appended to every chat reply
- Detachable agent export: GET /api/instances/{id}/export → safetensors .zip
- PCNA canon-topology rebuild (61-seed graph, tensor rings, heptagram propagation)
- UCNS `a0_safe` binding when upstream `ucns` ships it
- Premium detachable agents + Stripe checkout (3-5 mo monetization runway)
- Termux runner + JS port of AIMMH patterns (pocket-runs-locally future)
- Multi-user mode + audit log

## Changelog — 2026-06-10 (P1 frontend overhaul)

- **9 routes** wired in `App.js`: Workspace / Agents / Sentinels / Overrides / Inspector / Inventory / Key Vault / Env Vault / Drafts. Shell nav updated with `data-testid` per item.
- **API client** (`lib/api.js`): added `listInstances`, `createInstance`, `getInstance`, `patchInstance`, `deleteInstance`, `archiveInstance`, `chatInstance`, `teacherContextPreview`, `sentinelsCanon`, `getSentinelModes`, `patchSentinelModes`, `bulkSentinelModes`, `getSentinelWeights`, `patchSentinelWeights`, `listOverrides`, `getOverride`, `approveOverride`, `rejectOverride`, `expireOverrides`, `listGonals`.
- **New pages**: `AgentsPage` (CRUD table + modal), `SentinelsPage` (13-row mode/weight editor + bulk toggle), `OverridesPage` (pending queue + history).
- **Overhauled** `WorkspacePage`: agent picker, mode override (5-lattice), three-core metrics ribbon, per-turn `SentinelVerdictRibbon`, halt-banner, `OverrideModal` with cliff confirmation, approve-and-resume cycle.
- **New components**: `CharacterSheetForm`, `SentinelVerdictRibbon`, `OverrideModal`.
- **Backend** — `UpdateAgentRequest` now accepts `{sheet:{...}}` OR `{patch:{...}}` (back-compat); empty body → 400.
- **Documentation-as-Code** for frontend: every `.js/.jsx` module under `/app/frontend/src` now has a `// === MODULE_BUILD ===` block. New runner `a0p_skills.frontend_module_build_runner` validates coverage (18/18 covered, 0 missing). New contract `frontend_module_build_runner_smoke_holds` runs under `test_build_runner`.
- **Verification**: iteration_4 11/13, iteration_5 retest 2/2 — overall 13/13 frontend tests PASS. 73/73 active contracts, 8/8 backend pytest.

### P2
- Reproducibility receipt appended to every chat reply
- Detachable agent export: GET /api/instances/{id}/export → safetensors .zip
- PCNA canon-topology rebuild (61-seed graph, tensor rings, heptagram propagation)
- UCNS `a0_safe` binding when upstream `ucns` ships it
- Premium detachable agents + Stripe checkout (3-5 mo monetization runway)
- Termux runner + JS port of AIMMH patterns (pocket-runs-locally future)
- Multi-user mode + audit log

## Changelog — 2026-06-10

- **Renamed** `interdependent_lib/carrier/` → `interdependent_lib/gonal/`; updated all imports in `server.py`, `a0p_skills/contracts.py`, `interdependent_lib/network/*`.
- **Three-Core weight bank** (`zfae/weights.py`, `zfae/weight_init.py`): `A0ZFAEWeightBank` now holds `{phi, psi, omega}` each `(157, 53, 7, 7)`. New constants `CORE_NAMES`, `WEIGHT_COUNT_PER_CORE=407_729`, `WEIGHT_COUNT_TOTAL=1_223_187`. Safetensors save/load three tensors; legacy single-tensor checkpoints auto-reseed psi/omega.
- **Sentinel halt-and-override pipeline**:
  - `zfae/sentinel_eval.py` — pure evaluator returns `Verdict13` (13 signals + cliff flags).
  - `zfae/overrides.py` — `PendingOverride` lifecycle (create/approve/reject/expire).
  - `runtime.reply()` now evaluates sentinels on every turn; flagged turns return `reply_source='zfae_halted'` and HTTP `202` with `pending_override_id`. Resume by passing `override_id` from an approved override.
  - 7 new API endpoints under `/api/overrides/*` and `/api/sentinels/*`.
- **Round-robin trainer** (`zfae/trainer.py`): `training_step % 3` selects core; prefers untouched seeds; native readiness now requires all 471 (157×3) seeds touched.
- **FIQ provenance** (`zfae/fiq_emit.py`): hash-chained `zfae_chat_reply`, `zfae_training_step`, `zfae_sentinel_verdict`, `zfae_override_created`, `zfae_override_resolved` events in `fiq_audit_log` collection.
- **JSON-safe metrics** (`agents/store.py`): `_safe_finite()` strips inf/NaN from `zfae_last_loss`; fixes recurring `/api/instances` 500.
- **Doc-as-code**: 75 contracts · 72 pass / 0 fail / 0 error / 3 skipped.
- **Regression**: `/app/backend/tests/test_zfae_three_core_sentinels.py` (8 tests pass).
- **Testing-agent verification**: iteration_3 reports 100% (17/17) backend pass.

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
