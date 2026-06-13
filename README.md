# a0p — research instrument

> _changes constant. refinements welcome._
> [wayseer@interdependentway.org](mailto:wayseer@interdependentway.org)

_Living spec — auto-regenerated on backend startup at 2026-06-13 01:59:49 UTC._
_149 modules across 17 kinds._

Don't edit by hand; edit a module's `# === MODULE_BUILD ===` block instead.

## adapter · 10

| module | path | summary |
|---|---|---|
| `_theta_private_loader` | `backend/interdependent_lib/network/_theta_private_loader.py` | loads the canon CarrierDisk from Θ's private path; raises CarrierDiskUnavailable if not configured; NEVER falls back |
| `anthropic_provider` | `backend/providers/anthropic_provider.py` | Anthropic BYOK adapter — list models, messages via httpx |
| `base` | `backend/providers/base.py` | common Protocol + TypedDict contract for BYOK LLM provider adapters |
| `gemini_provider` | `backend/providers/gemini_provider.py` | Google Gemini BYOK adapter — list models, generateContent via httpx |
| `openai_provider` | `backend/providers/openai_provider.py` | OpenAI BYOK adapter — list models, chat completion via httpx |
| `providers` | `backend/providers/__init__.py` | BYOK adapter registry — openai, anthropic, gemini, xai (Emergent removed; build is platform-free) |
| `sigma_source` | `backend/interdependent_lib/network/sigma_source.py` | Σ ring data source — read-only host-integrity digest over OS files + installed program manifests; provides tamper-evidence baseline (pen-test resistance) |
| `teacher` | `backend/interdependent_lib/zfae/teacher.py` | TeacherClient — invokes a configured teacher model via the BYOK provider REGISTRY; emits training records; never substitutes its output as native zfae inference |
| `ucns_bridge` | `backend/interdependent_lib/ucns_bridge.py` | thin A0-safe wrapper around the ucns package — will route through ucns.a0_safe when v1.0 ships on PyPI |
| `xai_provider` | `backend/providers/xai_provider.py` | xAI Grok BYOK adapter — OpenAI-compatible /v1 via httpx |

## api_router · 5

| module | path | summary |
|---|---|---|
| `api_tools_mcp_skills` | `backend/api_tools_mcp_skills.py` | REST surface for the tools / MCP-client / skills layer — /api/tools (list, register user-webhook tool, invoke), /api/mcp/servers (CRUD external MCP servers, refresh their tools), /api/skills (list,… |
| `app_settings` | `backend/app_settings.py` | admin-editable runtime settings — single Mongo doc with key/value overrides for non-secret URLs (Emergent Google OAuth widget URL, etc.); /api/settings GET for everyone, PATCH for admin only; value… |
| `extensions` | `backend/api_extensions.py` | post-auth API extensions — custom keys vault (user-defined GitHub/GCP/AWS-style keys), Emergent demo quota (per-user daily token budget), living spec endpoint (auto-parses MODULE_BUILD/BOUNDARIES/C… |
| `mcp_server` | `backend/tools/mcp_server.py` | expose a0p AS an MCP server — JSON-RPC 2.0 over HTTP at /api/mcp; methods: initialize, tools/list, tools/call (sentinel-gated), resources/list (living-spec modules), resources/read; bearer-token au… |
| `routes` | `backend/auth/__init__.py` | hybrid JWT auth + OAuth (Emergent Google, GitHub) — /api/auth/{register,login,logout,me,refresh,oauth/*}; username (unique) + email (unique) + ≥16-char passphrase; bcrypt; httpOnly cookies; brute-f… |

## client · 4

| module | path | summary |
|---|---|---|
| `api` | `frontend/src/lib/api.js` | axios-based REST client for every /api endpoint — health, BYOK keys, env vault, inventory, sessions, drafts, skill reports, fanout/daisy/synthesize chat, inspector, agents+slugs, instances CRUD, ch… |
| `api_tools` | `frontend/src/lib/api_tools.js` | axios client for the tools / mcp servers / skills REST surface — list/register/invoke tools, MCP server CRUD with refresh, skills CRUD with overlap check, skill-lib sync, MCP publish token |
| `mcp_relay` | `backend/tools/mcp_relay.py` | relay tool invocations to external MCP servers registered per user — Streamable HTTP JSON-RPC client (Model Context Protocol over HTTP) with bearer-token auth; outbound only, the server-side surfac… |
| `webhook` | `backend/tools/webhook.py` | invoke user-registered webhook tools — POSTs the JSON params to the user's URL with an HMAC-SHA256 signature header (X-A0P-Signature) so the user can verify the call came from a0p |

## engine · 56

| module | path | summary |
|---|---|---|
| `_decoder` | `backend/interdependent_lib/zfae/_decoder.py` | native energy-conditioned decoder — composes assistantText as a deterministic function of (intent, features, Φ/Ψ/Ω/θ/σ energy state); RNG seeded from blake2b(state) so identical state → identical t… |
| `_intent` | `backend/interdependent_lib/zfae/_intent.py` | deterministic intent selector — maps (SemanticFeatures, ZFAE state) → one of a small fixed intent label set; pure function |
| `_parser` | `backend/interdependent_lib/zfae/_parser.py` | deterministic prompt parser — token stats, intent surfaces (question, greeting, command, reflection), semantic load |
| `_transition` | `backend/interdependent_lib/zfae/_transition.py` | ZFAE transition rules — folds semantic features into Φ/Ψ/Ω ring snapshots via PCEA kernel cross-cut; produces nextSnapshot |
| `adjacency` | `backend/interdependent_lib/gonal/adjacency.py` | hard invariants on the carrier — no L-L adjacent, no N-N adjacent; works against any CarrierDisk implementation |
| `aimmh` | `backend/interdependent_lib/aimmh/__init__.py` | async multi-model orchestration patterns over a call_fn(model_id, messages) |
| `bones` | `backend/interdependent_lib/gonal/bones.py` | face-crossing detection over a bone's constituent positions; measurable structural property, not a violation |
| `builtin` | `backend/tools/builtin.py` | register the built-in native tools — living_spec_lookup, vault_get_key, fetch_url, web_search; each one declares its JSON Schema and is sentinel-gated automatically by the registry's invoke |
| `carrier` | `backend/interdependent_lib/gonal/__init__.py` | 157-gonal carrier — public structural invariants (face, chirality, class tags, adjacency, bones); private disk material loaded only via theta_microkernel |
| `cipher` | `backend/interdependent_lib/pcea/cipher.py` | prime-circular bijective encrypt/decrypt over a previous-state key |
| `circle` | `backend/interdependent_lib/pcta/circle.py` | PCTA Circle — 7 PCNA tensors on a {7/2} heptagram with a UCNS structural mirror and an aggregate "circle-as-tensor" projection upward |
| `codec` | `backend/interdependent_lib/pcea/codec.py` | bijective base-p codec — digits in {1..p}, plus standard key-digit stream |
| `coherence` | `backend/interdependent_lib/network/coherence.py` | EDCM-style coherence scoring — weights each scored ring's aggregate energy, sums to a total; tracks Σ digest drift as tamper signal (pen-test resistance) |
| `core` | `backend/interdependent_lib/ptca/core.py` | PTCA Core — N PTCA Seeds (N=157 canon for Φ/Ψ/Ω; tunable for Θ/Σ) plus aggregate-as-tensor projection upward; param count is N × 7 × 7 × 53 |
| `edcm` | `backend/interdependent_lib/pcna/edcm.py` | Energy Dissonance Circuit Model — CM/DA/DRIFT/DVG/INT/TBF per-tick scoring (canon directives pending wiring) |
| `engine` | `backend/interdependent_lib/network/engine.py` | NetworkEngine — top-level binder for the canonical PCNA inference engine; holds rings, tick state, tamper watcher; supports per-ring N override for tests |
| `exchange` | `backend/interdependent_lib/ptca/exchange.py` | deterministic prime-circular state-exchange protocol |
| `ficks` | `backend/interdependent_lib/fiq/ficks.py` | ficks — gradient term D_r(Φ_a − Φ_b) in the fiq flux equation; named after Fick's law of diffusion; resolves "tics-per-tok" framing as the gradient of fiq tics per LLM token |
| `fiq` | `backend/interdependent_lib/fiq/__init__.py` | fiq motion canon — boundary law for audited motion between PCNA/PCTA/PTCA strata; tick schedule (3/5/7); χ indicators; FIQ_TRANSFER/BUFFERED/BLOCKED events; sentinels S1-S9, R0, fiques_time |
| `gated_invoke` | `backend/tools/gated_invoke.py` | per-tool-call sentinel gate — evaluates the 13 sentinels against the tool name + serialized params, halts on any flag (creates a PendingOverride and emits zfae_override_created), only proceeds when… |
| `group` | `backend/interdependent_lib/pcna/group.py` | "all seven together is a tensor" — aggregate composition op that lifts 7 Tensors to 1 Tensor (the 8th referent, the projection upward into the next layer) |
| `inference` | `backend/interdependent_lib/zfae/inference.py` | a0(ZFAE) inference engine — native deterministic symbolic/state engine; no LLM dependency; returns {assistantText, nextSnapshot, trace} |
| `instance` | `backend/interdependent_lib/pcea/instance.py` | stateful PCEA instance — auto-advances last_state per call |
| `instance` | `backend/interdependent_lib/ptca/instance.py` | current PTCA engine — tensor + sentinel channels + lineage hashing (pre-stratified) |
| `kernel` | `backend/interdependent_lib/pcea/kernel.py` | PCEA cross-cut — "this state, last state" kernel runtime encryption operating on Tensor payloads at any layer of the layered model |
| `memory_core` | `backend/interdependent_lib/pcna/memory_core.py` | dual prime-ring memory — LT N=19, ST N=17, plus volatile sub-agent caches |
| `mirror` | `backend/interdependent_lib/gonal/mirror.py` | position-reflection mirror of a gonal arrangement (invariant-preserving) |
| `motion` | `backend/interdependent_lib/fiq/motion.py` | core fiq flux equation F = χ_route · χ_audit · χ_support · χ_attention · P_ab · D_r(Φ_a − Φ_b); pure functions |
| `network` | `backend/interdependent_lib/network/__init__.py` | canonical PCNA inference engine — 5 rings (Φ Ψ Ω Θ Σ) + 2 memory rings on the layered substrate, with PCEA cross-cut and Σ host-integrity observer |
| `patterns` | `backend/interdependent_lib/aimmh/patterns.py` | pure-async multi-model orchestration patterns over call_fn(model_id, messages) |
| `pcea` | `backend/interdependent_lib/pcea/__init__.py` | prime-circular bijective base encryption over first 53 primes (this state / last state) |
| `pcna` | `backend/interdependent_lib/pcna/__init__.py` | six-ring inference engine (Φ Ψ Ω Θ Σ Ε) — current impl is simplified; canon topology (61 seeds, six scored rings + Σ observer) rebuild pending |
| `pcna` | `backend/interdependent_lib/pcna/pcna.py` | current PCNAEngine impl — three 157-prime cores + six scalar ring signals (canon target is full 61-seed topology + tensor rings) |
| `pcta` | `backend/interdependent_lib/pcta/__init__.py` | PCTA — circle layer of the layered model; 7 PCNA tensors arranged on a {7/2} heptagram, wrapped in a UCNS structural mirror |
| `propagate` | `backend/interdependent_lib/network/propagate.py` | tick advancement — runs one heartbeat across all rings, applies PCEA `kernel_step` cross-cut between ticks, holds last-state keys |
| `provenance` | `backend/interdependent_lib/ptca/provenance.py` | deterministic SHA-256 provenance hashing for tensor ops + lineage chains |
| `ptca` | `backend/interdependent_lib/ptca/__init__.py` | seeds-layer wrapper — re-exports current PTCAInstance plus prime utilities (canon stratified prime_core rebuild pending) |
| `registry` | `backend/skills/registry.py` | per-user + global skill catalog with overlap detection — Skill schema (name, description, prompt_template, tool_bindings[], sentinel_overrides{}, scope_tokens[], logic_set_tokens[], source); jaccar… |
| `registry` | `backend/tools/registry.py` | in-process Tool registry + invocation surface — Tool, ToolError, register, lookup, list_tools, invoke; every invocation routes through the sentinel evaluator (gated_invoke) so cliff-mode S4/S12 etc… |
| `rings` | `backend/interdependent_lib/network/rings.py` | ring assembly — builds a PTCA Core per RingSpec; Σ ring uses host-integrity-derived tensors; supports per-ring N override and lazy construction |
| `runtime` | `backend/interdependent_lib/zfae/runtime.py` | ZFAERuntime — dispatches teacher_assisted vs zfae_native; never silently substitutes teacher output as native inference; carries reply_source + teacher_called + zfae_weights_updated flags |
| `seed` | `backend/interdependent_lib/ptca/seed.py` | PTCA Seed — 7 PCTA circles on a {7/3} heptagram with a UCNS opaque-host shape and an aggregate "seed-as-tensor" projection upward |
| `sentinel_eval` | `backend/interdependent_lib/zfae/sentinel_eval.py` | per-event evaluator for the 13 sentinels — returns a Verdict13 from agent character-sheet modes/weights + the raw event payload; pure, deterministic, never raises on user input. S4 (safety) and S12… |
| `sentinels` | `backend/interdependent_lib/fiq/sentinels.py` | 9 sentinels (S1-S9) + R0 orchestration root + fiques_time probe; each enforces a χ indicator family or governs an outbound policy |
| `sentinels` | `backend/interdependent_lib/ptca/sentinels.py` | tagged signal lanes with priority ordering — SentinelChannel + SentinelMessage |
| `sentinels` | `backend/interdependent_lib/zfae/sentinels.py` | the 13 canonical sentinels per ZFAE core view — verbatim job descriptions; 6 cliff/structural flag + 7 slope observe by default; halt-and-override authority when in flag mode |
| `sigma` | `backend/interdependent_lib/pcna/sigma.py` | substrate signature encoder — deterministic blake2b digest + band mapping (canon Σ is N=41 observer ring; current impl is scalar shim) |
| `tensor` | `backend/interdependent_lib/pcna/tensor.py` | leaf Tensor — d=53 scalar payload, deterministic from a (seed, label) pair; the substrate of the layered (PCNA leaf → PCTA circle → PTCA seed → core) model |
| `tensor` | `backend/interdependent_lib/ptca/tensor.py` | prime-indexed nested-list tensor — current shape [N,4,7,7]; canon prime_core target [157,7,7,53] pending stratified rebuild |
| `theta` | `backend/interdependent_lib/pcna/theta.py` | phase-modulation ring — bounded sinusoidal map over 7 phase bands (canon Θ is N=29 microkernel gate; pending tensor lift) |
| `theta_microkernel` | `backend/interdependent_lib/network/theta_microkernel.py` | Θ microkernel — hosts the canon carrier disk via private loader; public callers get CarrierDisk or CarrierDiskUnavailable, never inline canon material |
| `trainer` | `backend/interdependent_lib/zfae/trainer.py` | ZFAELearner — text-distillation losses (intent-match + signature-MSE) for teacher-only; produces weight delta + loss + new checkpoint digest |
| `weight_init` | `backend/interdependent_lib/zfae/weight_init.py` | deterministic seed init for fresh ZFAE weights; three cores phi/psi/omega each shape (157, 53, 7, 7); per-agent reproducible |
| `weights` | `backend/interdependent_lib/zfae/weights.py` | A0ZFAEWeightBank — three-core (phi, psi, omega) safetensors load/save, per-core checkpoint digest, training-step counter, seeds-touched tracking; exposes canonical 1_223_187 scalar count |
| `zeta` | `backend/interdependent_lib/pcna/zeta.py` | zeta-injection ring — harmonic LT/ST/SUB memory mix + alpha-echo resonance |
| `zfae` | `backend/interdependent_lib/zfae/__init__.py` | a0(ZFAE) — the inference provider, not an agent label. Exposes A0ZFAEInferenceEngine (native deterministic), plus the legacy ZFAEAgent persona for backward-compat with prior PCNAEngine wiring |

## experiment · 2

| module | path | summary |
|---|---|---|
| `contracts` | `backend/a0p_skills/contracts.py` | executable test functions referenced by CONTRACTS `call:` paths across the repo |
| `public_fixture` | `backend/interdependent_lib/gonal/public_fixture.py` | public fixture disk generator — binary-order rule per user spec; deterministic, committable, satisfies hard invariants, NOT the canon |

## library · 1

| module | path | summary |
|---|---|---|
| `gonal` | `backend/interdependent_lib/gonal/gonal.py` | builds and validates a gonal character carrier arrangement from a declarative spec (user-provided canonical module) |

## package · 2

| module | path | summary |
|---|---|---|
| `skills` | `backend/skills/__init__.py` | skills subpackage entry — re-exports registry + sync helpers |
| `tools` | `backend/tools/__init__.py` | tools subpackage entry — re-exports the registry public surface and triggers register_builtins() so native tools are available immediately on import |

## route · 2

| module | path | summary |
|---|---|---|
| `routes` | `backend/agents/routes.py` | /api/instances/* CRUD + /api/chat/instance/{id} mode-aware; surface-3 teacher context preview endpoint |
| `server` | `backend/server.py` | FastAPI app — keys, vault, inventory, sessions, drafts, chat (single/fanout/daisy/synth), inspector, agents, usage, skill report |

## runner · 1

| module | path | summary |
|---|---|---|
| `frontend_module_build_runner` | `backend/a0p_skills/frontend_module_build_runner.py` | walks /app/frontend/src/**/*.{js,jsx,ts,tsx} and validates each module has a MODULE_BUILD block; reports COVERED / MISSING / INVALID per file |

## schema · 14

| module | path | summary |
|---|---|---|
| `classes` | `backend/interdependent_lib/gonal/classes.py` | public type-class enumeration (L, N, P, X) for the carrier slots; literal-type vs aggregate-slot distinction |
| `constants` | `backend/interdependent_lib/ptca/constants.py` | canon PTCA composition counts — synced from The-Interdependency/PTCA/prime_core/constants.py |
| `disk_protocol` | `backend/interdependent_lib/gonal/disk_protocol.py` | CarrierDisk Protocol — what any disk implementation (public fixture or private canon) must provide; CarrierDiskUnavailable error type |
| `events` | `backend/interdependent_lib/fiq/events.py` | FIQ_TRANSFER / FIQ_BUFFERED / FIQ_BLOCKED event dataclasses; blake2b prev_hash chain |
| `faces` | `backend/interdependent_lib/gonal/faces.py` | face + chirality + adjacency formulas over the 157-gonal carrier; no disk material |
| `gate` | `backend/interdependent_lib/fiq/gate.py` | FiqGate — the smallest auditable boundary gate r = (a, b, S, mode); not motion, the law that permits/blocks/meters motion |
| `models` | `backend/models.py` | Pydantic surface for the public API (BYOK keys, vault, sessions, drafts, chat, agents) |
| `primes` | `backend/interdependent_lib/pcea/primes.py` | first 53 primes — the prime circle used by PCEA |
| `primes` | `backend/interdependent_lib/ptca/primes.py` | prime generator + first-N prime cache (default capacity 200, supports PTCA N=157) |
| `schema` | `backend/agents/schema.py` | Pydantic models — AgentInstance, CharacterSheet, AgentMode (the 5-lattice modes), PXResolution; covers the full character sheet editable surface |
| `sentinel_modes` | `backend/interdependent_lib/zfae/sentinel_modes.py` | per-agent sentinel mode resolution — observe/flag/off — with canonical defaults (7 flag + 6 observe + 0 off; flags = S1 S2 S3 S4 S8 S9 S12) |
| `sentinel_weights` | `backend/interdependent_lib/zfae/sentinel_weights.py` | per-agent sentinel weight resolution — default 0.90 attention budget distributed across 13 sentinels; user-editable; under-budget reverts to inference channel |
| `tick_schedule` | `backend/interdependent_lib/fiq/tick_schedule.py` | ψ/φ/ω consciousness-prime tick constants (3/5/7); orthogonal stratum + core attention axes; logical default with optional real-time toggle |
| `topology` | `backend/interdependent_lib/network/topology.py` | ring topology spec — names, per-ring N (Φ Ψ Ω 157, Θ 29, Σ 53, MemL 19, MemS 17), heptagram routing slots (lock-step avoidance via unique step+direction), ring weights for coherence scoring |

## service · 12

| module | path | summary |
|---|---|---|
| `agents` | `backend/agents/__init__.py` | per-agent CRUD; semi-permanent character-sheet-bound instances; each owns Φ/Ψ/Ω/MemL/MemS + per-instance ZFAE weight bank + archive |
| `archive` | `backend/interdependent_lib/zfae/archive.py` | ZFAE archive — per-agent training records JSONL + per-session ephemeral chat archive with char-compress output shape |
| `audit` | `backend/interdependent_lib/fiq/audit.py` | append-only JSONL fiq audit log at /app/storage/fiq_audit/YYYY-MM-DD.jsonl + MongoDB mirror; prev_hash chain verifiable end-to-end |
| `crypto_vault` | `backend/crypto_vault.py` | Fernet encrypt/decrypt + mask for at-rest BYOK credentials |
| `db` | `backend/db.py` | Motor async client + collection accessors + index ensurance |
| `fiq_emit` | `backend/interdependent_lib/zfae/fiq_emit.py` | ZFAE-level provenance emitter — appends hash-chained zfae_* events (training_step, chat_reply, sentinel_verdict, override_created, override_resolved) to fiq_audit_log |
| `living_spec` | `backend/living_spec.py` | pure scanner over the repo that returns every msdmd block as JSON; no DB / network dependencies; used by the /api/spec/living endpoint and by contract tests |
| `overrides` | `backend/interdependent_lib/zfae/overrides.py` | PendingOverride dataclass + lifecycle helpers for sentinel halt-and-override; backed by MongoDB pending_overrides_col |
| `readme_writer` | `backend/readme_writer.py` | regenerates /app/README.md on every backend startup from the living spec (scan_repo_blocks); idempotent, deterministic, never raises |
| `registry` | `backend/interdependent_lib/gonal/registry.py` | three-gonal registry — default (EXAMPLE_157), mirror (mirror_of default), private (per-agent built via build_gonal from spec); resolves an agent's per-core gonal triplet |
| `store` | `backend/agents/store.py` | full CRUD over MongoDB metadata + filesystem per-agent checkpoint dir; agents treated as users (persistent semi-permanent instances) |
| `sync` | `backend/skills/sync.py` | pulls canonical skills from The-Interdependency/skill-lib GitHub repo — fetches the index.json, validates each entry, upserts global skills (owner_user_id=None); reverse direction (publish-back) is… |

## skill · 10

| module | path | summary |
|---|---|---|
| `_msdmd` | `backend/interdependent_lib/_msdmd/__init__.py` | this project's msdmd application — parser + back-compat runner (canonical executors live in a0p_skills) |
| `a0p_skills` | `backend/a0p_skills/__init__.py` | this project's three msdmd skill executors — msdmd / test-build / meta-module-build |
| `boundaries_runner` | `backend/a0p_skills/boundaries_runner.py` | risk-boundary-build skill executor — validates BOUNDARIES blocks against canon schema; reports gaps + hmmm |
| `capabilities_runner` | `backend/a0p_skills/capabilities_runner.py` | cap-build skill executor — parses CAPABILITIES blocks, builds capability map, flags duplicates/hmmm/gaps |
| `interdependent_lib` | `backend/interdependent_lib/__init__.py` | meta-package exposing pcea, ptca, pcna, aimmh, zfae submodules |
| `module_build_runner` | `backend/a0p_skills/module_build_runner.py` | meta-module-build skill executor — validates MODULE_BUILD schema + gap report |
| `parser` | `backend/interdependent_lib/_msdmd/parser.py` | canonical msdmd parser — line-for-line sync of skill-lib/msdmd/parsers/universal.py |
| `ratios_runner` | `backend/a0p_skills/ratios_runner.py` | ratios skill executor — recomputes loc_comments/imports_exports/calls_definitions per file; fails on drift |
| `runner` | `backend/interdependent_lib/_msdmd/runner.py` | msdmd CAPABILITIES coverage runner (deprecated in favour of skills.module_build_runner) |
| `test_build_runner` | `backend/a0p_skills/test_build_runner.py` | test-build skill executor — imports each CONTRACTS `call:` and runs it |

## test · 4

| module | path | summary |
|---|---|---|
| `backend_test` | `backend/tests/backend_test.py` | end-to-end backend regression suite — covers /api/health, BYOK keys CRUD with encryption-at-rest masking, and chat session flows; intended to be executed by the testing-agent harness against the li… |
| `conftest` | `backend/tests/conftest.py` | pytest configuration — enables pytest-asyncio plugin in auto mode for the backend test suite |
| `test_zfae_api_sentinels` | `backend/tests/test_zfae_api_sentinels.py` | integration tests for the ZFAE three-core + sentinel halt-and-override pipeline, hitting the live FastAPI service via REACT_APP_BACKEND_URL — Tests 1..8 from the review batch |
| `test_zfae_three_core_sentinels` | `backend/tests/test_zfae_three_core_sentinels.py` | pytest regression suite for the 3-core (Φ/Ψ/Ω) weight bank, trainer round-robin, sentinel evaluator cliffs/slopes, native readiness gate, FIQ hash-chain emit, and PendingOverride lifecycle |

## ui_component · 7

| module | path | summary |
|---|---|---|
| `AuditTape` | `frontend/src/components/AuditTape.jsx` | live polling FIQ-chain tape for the active agent — surfaces tool_call, sentinel_verdict, chat_reply, override_created events with their hash chain (prev_hash → this_hash) so the user can watch chai… |
| `CharacterSheetForm` | `frontend/src/components/CharacterSheetForm.jsx` | editable character-sheet form for an Agent — name, mode (5-lattice), models, system_prompt, persona, tools allow-list, native-readiness thresholds, gonal assignment; emits onSubmit(sheet) |
| `MarkdownView` | `frontend/src/components/MarkdownView.jsx` | render Markdown + GFM tables + LaTeX (incl. arxiv \\(...\\) and \\[...\\] forms) via react-markdown + remark-math + rehype-katex |
| `OverrideModal` | `frontend/src/components/OverrideModal.jsx` | modal that surfaces a pending sentinel-override and asks the user to approve (with justification) or reject (with reason); destructive cliff overrides require typed confirmation |
| `Panel` | `frontend/src/components/Panel.jsx` | shared presentational primitives — Panel section, Pill badge, Stat metric tile, AsciiLoader progress indicator |
| `SentinelVerdictRibbon` | `frontend/src/components/SentinelVerdictRibbon.jsx` | render the 13-sentinel verdict as a horizontal pill ribbon; hover shows full verdict row; click toggles details panel |
| `Shell` | `frontend/src/components/Shell.jsx` | left-rail navigation shell with 9 routes (Workspace, Agents, Sentinels, Overrides, Inspector, Inventory, Key Vault, Env Vault, Drafts) and donation CTA |

## ui_lib · 2

| module | path | summary |
|---|---|---|
| `auth` | `frontend/src/lib/auth.jsx` | AuthContext + useAuth hook + ProtectedRoute — manages JWT-cookie session, exposes user/loading/login/register/logout/refresh, redirects unauthenticated traffic to /login while keeping the splash & … |
| `sentinels` | `frontend/src/lib/sentinels.js` | client-side helpers + canonical metadata for the 13 sentinels and the 5 lattice modes; pure, no I/O |

## ui_page · 16

| module | path | summary |
|---|---|---|
| `AgentsPage` | `frontend/src/pages/AgentsPage.jsx` | agent CRUD — list every instance with zfae metrics, create via CharacterSheetForm, edit existing sheet, archive/delete |
| `CustomKeysPage` | `frontend/src/pages/CustomKeysPage.jsx` | user-owned developer key vault — name + value (Fernet-encrypted at rest) + kind + label; supports rotation (PUT same name) and reveal (decrypt on demand); for GitHub PATs, GCP service accounts, AWS… |
| `DraftsPage` | `frontend/src/pages/DraftsPage.jsx` | local prompt drafts — list / create / edit / delete; persists via /api/drafts |
| `InspectorPage` | `frontend/src/pages/InspectorPage.jsx` | live inspector for PCNA/PTCA/PCEA skills + msdmd compliance reports (capabilities / module-build / contracts coverage); heartbeat ping |
| `InventoryPage` | `frontend/src/pages/InventoryPage.jsx` | discovered model inventory across providers (openai, anthropic, gemini, xai, emergent) — populated from /api/models/inventory |
| `KeyVaultPage` | `frontend/src/pages/KeyVaultPage.jsx` | BYOK key vault — list, upsert (Fernet-encrypted), delete BYOK provider keys (OpenAI/Anthropic/Gemini/XAI) |
| `LivingSpecPage` | `frontend/src/pages/LivingSpecPage.jsx` | renders every msdmd block parsed live from the repo — grouped by module_kind, searchable, expandable per module to show MODULE_BUILD / BOUNDARIES / CAPABILITIES / CONTRACTS / RATIOS in full |
| `LoginPage` | `frontend/src/pages/LoginPage.jsx` | tabbed sign-in / sign-up screen — username or email + ≥16-char passphrase (show/hide toggle) + Emergent Google + GitHub OAuth; auto-resumes the user's intended route after auth |
| `MCPPage` | `frontend/src/pages/MCPPage.jsx` | Model Context Protocol surface — (a) inbound: shows the user's publish token + URL so external Claude Desktop / Cursor / etc. can connect to a0p as an MCP server; (b) outbound: lets the user regist… |
| `OverridesPage` | `frontend/src/pages/OverridesPage.jsx` | queue of pending sentinel overrides; approve (with justification) or reject; expired overrides housekeeping; shows flagged sentinels + raw request snippet |
| `SentinelsPage` | `frontend/src/pages/SentinelsPage.jsx` | view the 13-sentinel canon + edit per-agent sentinel modes (observe/flag/off) and weights for a selected agent |
| `SkillsPage` | `frontend/src/pages/SkillsPage.jsx` | skill catalog browser + authoring form with live overlap warning before save (jaccard ≥0.6 over scope ∪ logic tokens against existing user+global skills); admin-style sync button pulls global skill… |
| `SplashPage` | `frontend/src/pages/SplashPage.jsx` | public landing — "changes constant. refinements welcome." manifesto + Sign in / Sign up CTAs + email-of-record (wayseer@interdependentway.org); shows demo-mode notice for unauthenticated visitors |
| `ToolsPage` | `frontend/src/pages/ToolsPage.jsx` | lists every native + user-webhook + MCP-relay tool the current user can invoke; allows registering new user-webhook tools and invoking any tool with arbitrary JSON params; surfaces sentinel halts a… |
| `VaultPage` | `frontend/src/pages/VaultPage.jsx` | per-site multi-account env vault — list, reveal (decrypts on demand), upsert, delete |
| `WorkspacePage` | `frontend/src/pages/WorkspacePage.jsx` | chat workspace bound to one agent instance; sends prompts through /api/chat/instance/{id}; renders per-turn sentinel verdict ribbon; intercepts HTTP 202 sentinel-halts and opens an OverrideModal th… |

## ui_root · 1

| module | path | summary |
|---|---|---|
| `App` | `frontend/src/App.js` | top-level router with AuthProvider — public routes (/, /login, /register, /spec) and protected routes (/workspace, /agents, /sentinels, /overrides, /inspector, /inventory, /keys, /custom-keys, /vau… |

