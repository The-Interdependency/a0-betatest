# a0-betatest repair inventory

Audit basis: current `main` after PR #15 and PR #16 restored the Grok-damaged substrate and PCNA compatibility surface.

The destructive Grok breakage already repaired is **not** repeated as open work here. This folder inventories defects and incomplete boundaries still visible in current source.

## Execution doctrine

1. Apply repairs in the order below unless a repair explicitly declares itself independent.
2. One repair per pull request.
3. Do not combine security-boundary work with mathematical-substrate work.
4. Every repair must add a regression test that fails on current `main` and passes after the patch.
5. Do not mark a repair complete from static inspection alone. Run the acceptance commands in its handoff.
6. Preserve conservative theorem and invariant language. Fixture behavior is not a general proof.
7. Record unresolved boundaries in `hmmm` rather than silently broadening a claim.

## Priority order

| Order | Repair | Priority | Boundary |
|---:|---|---|---|
| 1 | [Strict authentication and demo isolation](01-strict-auth-and-demo-isolation.md) | P0 | confidentiality / spend |
| 2 | [Per-user ZFAE state and protected agent APIs](02-agent-state-isolation.md) | P0 | cross-user memory |
| 3 | [Audit-feed and override confidentiality](03-audit-override-confidentiality.md) | P0 | raw request disclosure |
| 4 | [Tenant-scoped tool registry](04-tool-registry-tenant-isolation.md) | P0 | cross-user execution |
| 5 | [Outbound tool SSRF and secret storage](05-outbound-tool-ssrf-and-secrets.md) | P0 | internal network / credentials |
| 6 | [Authentication and session hardening](06-auth-session-hardening.md) | P1 | account takeover / session replay |
| 7 | [Atomic FIQ provenance chain](07-fiq-chain-atomicity.md) | P1 | audit integrity |
| 8 | [Deployment environment contract](08-deployment-environment-contract.md) | P1 | release reliability |
| 9 | [Required CI and branch protection](09-ci-and-branch-protection.md) | P1 | merge integrity |
| 10 | [Package import normalization](10-package-import-normalization.md) | P1 | installed/runtime compatibility |
| 11 | [Indexes, retention, and collision handling](11-data-lifecycle-and-indexes.md) | P2 | data integrity / operations |
| 12 | [Generated documentation discipline](12-generated-docs-discipline.md) | P2 | provenance / reproducibility |
| 13 | [Substrate composition completion or constraint](13-substrate-composition-boundary.md) | P2 research | mathematical claim boundary |

## Release boundary

Do not treat the application as safely multi-user until repairs 1 through 5 are complete. Do not treat deployment as reproducible until repairs 8 through 10 are complete.

## Already repaired

- Restored `backend/interdependent_lib/gonal_stack.py`.
- Repaired PCTA/PTCA construction and focused invariant tests.
- Restored the established PCNA `Tensor` compatibility API.
- Restored backend startup importability for the main application path.
- Corrected unsupported completion and double-cover claims.

## hmmm

This inventory is source-grounded, not a declaration that every latent defect has been discovered. New failures found while executing a repair should be documented as a new numbered handoff rather than folded invisibly into the current task.