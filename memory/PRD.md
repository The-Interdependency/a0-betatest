# a0p — Product Requirements Doc (PRD)

> **a0p** — a research instrument: a multi-model, BYOK AI workspace with an inference-engine
> inspector built from spec (`The-Interdependency/interdependent-lib` and `The-Interdependency/a0`).
> Monetization (currently): donation-based. Future (3-5 months): premium / paid detachable agents.

---

## Original Problem Statement (verbatim, condensed)

> "BYOK agent wrapper for GPT, Claude, xAI, Gemini. Must provide entire active model
> inventory per key, track compute/tokens/cache, expose all contexts for editing per new
> session, hold per-site multi-account .env keys (GitHub, Gmail, …), provide AIMMH support,
> multi-model chat (fan-out + synthesize, daisy-chain N rounds), wholly mobile.
> Build full PTCA / PCNA / PCEA / PCTA / ap(zfae) inference engine — three 157-seed PTCA cores
> phi / psi / omega / theta / sigma / epsilon. REBUILD FROM SPEC, do not copy files.
> Finished looks like: nested code modules in compliance with skill-lib, chat interface with
> .md + arxiv formatting, write-to-database prompt drafts, carousel for multi-response
> comparison, detachable portable agents (phone / app-store style).
> Monetization: donations now; future monetization via detachable agents."

## User Choices Captured

| # | Question | Answer |
|---|---|---|
| 1 | Reference repos | (a) Use public `interdependent-lib` + `a0` |
| 2 | Spec interpretation | Modules `/ptca /aimmh /pcna /pcta /pcea` from `interdependent-lib` |
| 3 | Session scope | **(a + b + d + f)** — BYOK + multi-model + drafts/context + PTCA inference scaffolding |
| 4 | Tech stack | React + FastAPI + MongoDB (web-first responsive PWA) |
| 5 | Emergent LLM key for testing | **Yes** (OpenAI / Anthropic / Gemini). xAI remains true BYOK. |

---

## Architecture

```
/app
├── backend/                    FastAPI + Motor (Mongo) + httpx providers
│   ├── server.py               Router + AIMMH plumbing + ZFAEAgent singleton
│   ├── models.py               Pydantic surface (BYOK, sessions, drafts, …)
│   ├── db.py                   Motor client + collection indices
│   ├── crypto_vault.py         Fernet encrypt/decrypt + mask
│   ├── providers/              BYOK adapters
│   │   ├── openai_provider.py     OpenAI /v1
│   │   ├── anthropic_provider.py  Anthropic /v1
│   │   ├── gemini_provider.py     Google generative-language v1beta
│   │   ├── xai_provider.py        xAI Grok (OpenAI-compatible)
│   │   └── emergent_provider.py   Emergent Universal Key (emergentintegrations)
│   └── interdependent_lib/     The 5 spec modules — built from spec, NOT copied
│       ├── pcea/    Prime-Circular Encryption Algorithm (53-prime ring, bijective base-p)
│       ├── ptca/    Prime Tensor Circular Architecture ([N, 4, 7, 7] tensor + sentinels + provenance)
│       ├── pcna/    Six-ring inference engine (Φ Ψ Ω Θ Σ Ε) + EDCM + memory + zeta/sigma/theta
│       ├── aimmh/   Async multi-model patterns (fan_out, daisy_chain, room_*, council)
│       └── zfae/    Zeta-Function Alpha-Echo persistent agent identity
│
└── frontend/                   React + Tailwind + react-markdown + KaTeX
    └── src/
        ├── components/   Shell, Panel, MarkdownView (markdown + LaTeX/arxiv)
        ├── lib/api.js    Axios client
        └── pages/        Workspace · Inventory · KeyVault · Vault · Drafts · Inspector · Agents
```

### Key design choices
- Per-call BYOK pass-through. Keys encrypted at rest (Fernet AES-128-CBC + HMAC).
- Per-session editable system context + persona.
- All endpoints prefixed `/api`. CORS open (single-user research mode, `user_id='local'`).
- Three 157-seed PTCA cores (`phi`, `psi`, `omega`) drive the six ring signals.
- ZFAEAgent is a process-wide singleton; receives each user prompt → heartbeat → absorb response.
- Prompt drafts autosave debounced (1.2s).

---

## What's Implemented — 2026-05-31

### Backend (all routes prefixed `/api`)
- ✅ `/health` — service status + provider list + agent card
- ✅ `/keys` — GET/PUT/DELETE — BYOK key vault (Fernet encryption, mask)
- ✅ `/vault` — GET/PUT/DELETE + `/vault/reveal` — per-site multi-account .env (keys-only listing, reveal on demand)
- ✅ `/models/inventory` — aggregate active models across all stored keys + Emergent
- ✅ `/sessions` — full CRUD + editable context (system, persona, selected_models, transcript)
- ✅ `/drafts` — full CRUD; autosaved from Workspace
- ✅ `/chat/single` — single-model BYOK or Emergent
- ✅ `/chat/fanout` — N models, same prompt, parallel via AIMMH `fan_out`
- ✅ `/chat/daisychain` — N models × R rounds via AIMMH `daisy_chain`
- ✅ `/chat/synthesize` — synth chosen responses via a chosen model
- ✅ `/inspector/heartbeat` + `/inspector/snapshot` — PCNAEngine tick + state
- ✅ `/agents` — list/create/delete + `/agents/{slug}/manifest` exportable JSON
- ✅ `/usage` — token records + aggregate by provider / model
- ✅ Starter agents seeded: research-council, daisy-prover, zfae-classic, premium-symphony

### Interdependent-lib modules (built from spec)
- ✅ **PCEA** — 53-prime bijective base-p cipher + stateful instance
- ✅ **PTCA** — [N,4,7,7] tensor, sentinel channels, provenance hashing, exchange protocol
- ✅ **PCNA** — six-ring engine (Φ Ψ Ω Θ Σ Ε), 3× PTCA(157) cores, EDCM (CM/DA/DRIFT/DVG/INT/TBF),
  MemoryCore (LT N=19, ST N=17), zeta injection, sigma encoding, theta modulation
- ✅ **AIMMH** — fan_out, daisy_chain, room_all, room_synthesized, council patterns (pure async)
- ✅ **ZFAE** — persistent agent identity wrapping PCNAEngine

### Frontend
- ✅ Workspace — sessions sidebar, editable context, model picker grouped by provider,
  three modes (single / fan-out / daisy-chain), responsive carousel for fan-out responses,
  inline synthesizer, Markdown + LaTeX (`$…$`, `$$…$$`, `\(…\)`, `\[…\]`), draft autosave indicator
- ✅ Inventory — live catalog + filter tabs (all / emergent / openai / anthropic / gemini / xai) + search
- ✅ Key Vault — per-provider cards, reveal toggle, replace/remove, deep-link to issuer
- ✅ Env Vault — multi-site multi-account env entries with reveal-on-demand
- ✅ Drafts — list / inline-edit / delete
- ✅ Inspector — six-ring panel, three PTCA-core summaries, EDCM grid, memory snapshot, heartbeat trigger
- ✅ Agents — catalog cards with free/premium badges, JSON manifest export, create form

### Testing status
- **Backend**: 28/28 pytest cases — 100% (regression suite in `/app/backend/tests/backend_test.py`)
- **Frontend**: smoke-rendered via screenshot; not yet end-to-end-tested by the testing agent

---

## Personas

| Persona | Goals | Pains today |
|---|---|---|
| AI researcher | Compare frontier models on the same prompt; daisy-chain across vendors; persist context | Each vendor's UI is siloed; no cross-vendor carousel; no portable agent manifests |
| Independent dev | Use own keys; multiple GitHub/Gmail accounts simultaneously; export agents to phone/VM | Most tools assume one account per site; no portable agent format |
| Math/Physics student | Markdown + arxiv `\(...\)` chat for papers + proofs | LaTeX support inconsistent across chat UIs |

## Prioritized Backlog (next session candidates)

### P0
- E2E frontend testing pass (testing_agent_v3)
- Streaming responses (SSE) for chat — currently full request/response
- Surface live token cost in transcript (calc from inventory pricing)

### P1
- Council UI mode (every model sees peers, then synthesises) — already in AIMMH, missing in UI
- Inventory: per-provider pricing column (OpenAI + Anthropic publish public JSON)
- Inspector: live tensor heatmap (phi/psi/omega) — currently summarized only

### P2 — monetization runway (3–5 mo)
- Premium detachable agents: paid catalog, license keys, Stripe checkout
- Phone-side runtime spec (React Native + AsyncStorage manifests)
- Audit log + multi-user mode (currently single-user `local`)

---

## How to run

```bash
# Backend
sudo supervisorctl restart backend     # FastAPI on :8001 (proxied via /api)

# Frontend
sudo supervisorctl restart frontend    # CRA dev on :3000

# Tests
cd /app/backend && PYTHONPATH=. pytest tests/backend_test.py -v
```

`/app/backend/.env` keys: `MONGO_URL`, `DB_NAME`, `EMERGENT_LLM_KEY`, `A0P_KEY_VAULT_SECRET`.
