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

## Changelog — 2026-06-16c (Inventory-driven model picker + one-click agent instantiation)

- **Model fields are now pull-downs from the live inventory**: `base_model` /
  `outer_model` in `CharacterSheetForm` use a new `ModelSelect` populated from
  `GET /api/models/inventory` (`provider:id` options). A "+ custom…" escape hatch
  + an automatic editable text fallback (when the BYOK inventory is empty)
  keep the field always editable.
- **Models Inventory page**: each model row gets a **"create agent"** button
  (`inv-create-agent-<provider>-<id>`) that instantiates a teacher-assisted
  `a0(zfae)<model>` agent bound to that `provider:id` and opens it in the
  Workspace. Added an error banner; empty-state CTA hardened to
  `models.length === 0`.
- **Verified**: testing-agent iteration_9 → 100% (action column renders, empty
  inventory → editable text fallback, create-from-form persists `base_model`,
  no JS console errors). eslint clean, frontend-module-build 28/28.

## Changelog — 2026-06-16b (Fully-editable character sheet — "everything editable" principle)

- **CharacterSheetForm** now exposes every user-facing sheet field per the
  "every editable place should be editable" build principle:
  - `tools_allowed` upgraded from a comma-text box to a **live multi-select**
    fetched from `GET /api/tools` (built-in + webhook/MCP tools), with a custom
    tool-name fallback (chips, sentinel-gated when invoked).
  - New editors: `memory_seed` (long/short-term, one-per-line), `teacher_context_template`,
    `tags`, and `boundaries` (auth/storage/network/user_data/admin_only selects).
  - Structural engine dicts (`edcm`, `ring_n_override`, `heptagram_overrides`,
    `px_resolution`) intentionally NOT exposed — engine-owned; editing them
    would break the runtime. Omitted from submit so PATCH preserves them.
- `api.listTools()` added. AgentsPage create/patch now omit the dead
  `user_id:'local'` body field (cookie identity is the single source of truth).
- **Verified**: testing-agent iteration_8 → 100% (all 5 items pass: table loads,
  every field renders, live tool chips load + toggle, custom-tool add/remove,
  full create + edit round-trip with merge-not-replace). eslint clean,
  frontend-module-build 28/28. Backend curl confirmed create/PATCH persist all
  new fields.

## Changelog — 2026-06-16 (P0 Mid-thought Tool-Use Loop · teacher + native)

- **Cross-provider tool-use loop wired into the runtime** (`tools/agent_loop.py`
  `run_tool_loop`): teacher path (`runtime._teacher_assisted` → new
  `_teacher_tool_loop`) now resolves the agent's `sheet.tools_allowed` (a list of
  TOOL NAMES) into provider tool schemas and runs a multi-step function-calling
  loop over raw HTTP for OpenAI / xAI (Chat Completions), Anthropic (Messages),
  and Gemini (generateContent). The executor dispatches through the existing
  **sentinel-gated** `tools.registry.invoke`; a mid-tool cliff raises
  `ToolLoopHalt` → the turn returns `reply_source='zfae_halted'` with a
  `pending_override_id`. Falls back to single-shot teacher when no BYOK key /
  no resolvable tools.
- **Native deterministic tool-use** (`zfae/native_tools.py` +
  `runtime._native_tool_use`): the a0(zfae) engine picks ≤1 built-in tool via
  pure rule-based `select_native_tool` (URL→fetch_url, spec→living_spec_lookup,
  search→web_search), runs it gated, and folds a `summarize_tool_result` line
  into the native reply. Only fires when the selected tool ∈ `tools_allowed`.
- **Provenance**: every chat reply's `trace.tool_trace` now carries the
  per-call `{name, args, status, result_preview}`. New FIQ event types
  `zfae_tool_call` / `zfae_tool_result` emitted per invocation.
- **UI**: `WorkspacePage` renders a "mid-thought tool calls" block per assistant
  turn (`turn-<id>-tools` / `tool-call-<id>-<i>`); `AuditTape` surfaces the two
  new tool events with violet tint + Wrench icon.
- **Auth hardening (bug fix)**: agent instance routes (`agents/routes.py`
  list/create/get/update/delete/archive/preview) now derive `user_id` from the
  auth cookie via `_resolve_user_id` (falls back to query param only when
  unauthenticated). Fixes the empty Workspace agent dropdown that appeared after
  the legacy `user_id='local'` → admin migration.
- **Tests**: `tests/test_tool_use_loop.py` (17) + `tests/test_tool_loop_http_e2e.py`
  (6) → 23 pass. 2 new contracts (`tools_agent_loop_two_step`,
  `zfae_native_tool_selection`). test-build 135 pass / 0 fail / 0 error / 3 skip.
  Verified via testing-agent (iteration_7) + manual curl (gated tool dispatch,
  S4 cliff halt, tools_allowed persistence, graceful no-key fallback).

## Changelog — 2026-06-14 (P0 ZFAE Native Decoder · Route A — Gonal Inscription)

- **Fixed "flat tensors" (scalar collapse)**: `inference.py` now carries the
  full 53-wide `phi_v53/psi_v53/omega_v53` continuous conditioning signal on
  `state` alongside the scalar energies — no longer collapsed to means.
- **PCEA ciphertext digest**: `state["pcea_ciphertext_digest"]` = blake2b over
  the concatenated, role-sorted PCEA delta payloads — the state-bound
  deterministic generation seed. Surfaced in the trace (`pcea_ciphertext_digest_prefix`).
- **a0 long-term memory**: new `zfae/long_memory.py` folds the living spec
  (every MODULE_BUILD block, currently 151 modules) into a cached canon digest;
  attached to every inference as `state["memory_long_canon"]` — the agent
  queries itself. The canon digest feeds the inscription entropy.
- **New `zfae/gonal_inscription.py` (Route A)**: `PrivateGonal(phase, perm)`
  seeded per-agent; `from_seed` (deterministic Fisher–Yates bijection over 157
  vertices), `advance(public, pcea_digest)` (rotates phase), `inscribe(angle) →
  vertex_idx`. Plus the **hash-whitened 53→32 bridge** (`whiten_payload` /
  `whitened_indices`) with an explicit CONCESSION naming UCNS-native whitening
  as open research. `inscribe_text` composes a deterministic glyph stream from
  the continuous Φ/Ψ/Ω field.
- **Decoder swap**: `_decoder.py::decode` runs Route A (Gonal Inscription) when
  a `PrivateGonal` + 53-wide tensors are present; falls back to the existing
  Route B energy-conditioned compositor otherwise (preserves prior contracts).
- **Gonal seed persisted as the 4th safetensors tensor** (`weights.py`,
  `weight_init.seed_initial_gonal`), kept out of `_cores` so the canonical
  1,223,187 scalar count is unchanged; survives save/load.
- **Non-silent audit**: new `zfae_decode` FIQ event type emitted from
  `runtime.reply()` carrying `{intent, vertex_idx, rotation, pcea_digest_prefix}`.
- **Verification**: test-build 133 pass / 0 fail / 3 skipped; module-build all
  new modules valid; 15/15 pytest (7 new Route-A + 8 sentinel regression). 3
  new contracts added. Backend healthy.

## Changelog — 2026-06-02 (msdmd / skill-lib compliance)

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
- ~~Tools + MCP (server + client) + Skills layer with sentinel-gated tool calls, MCP bidirectional, skill catalog with jaccard overlap detection, sync from The-Interdependency/skill-lib~~ ✅ 2026-06-11
- ~~Live Tool/CoT Tape on Workspace polling FIQ chain with client-side hash verification~~ ✅ 2026-06-11
- ~~Real `push_to_skill_lib` via GitHub API (creates branch + commits index.json + opens PR; falls back to structured guidance without SKILL_LIB_GH_TOKEN)~~ ✅ 2026-06-11
- ~~Real GitHub OAuth (returns 503 until `GITHUB_CLIENT_ID/SECRET` set in `.env`)~~ ✅ 2026-06-11
- ~~Admin-editable runtime settings (`/api/settings`) — Emergent Google OAuth URL, skill-lib index URL, skill-lib repo~~ ✅ 2026-06-11
- ~~Demo quota enforcement in `runtime._teacher_assisted` — refuses with `zfae_refused` + clear message when day budget exhausted; records ~tokens per round-trip~~ ✅ 2026-06-11
- ~~Legacy `user_id='local'` agents migrated to admin on startup; chat endpoint now requires auth~~ ✅ 2026-06-11
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
