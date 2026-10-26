# Repair 09 — Required CI and branch protection

**Priority:** P1  
**Status:** open  
**Primary risk:** a pull request with failing checks was mergeable and was merged, allowing known-red code onto `main`.

## Verified current behavior

- The Grok-repair sequence demonstrated that backend compilation could pass while focused tests and startup import failed.
- PR #15 was merged while those checks were red.
- The later repair required a second pull request to restore the remaining PCNA compatibility and package-startup failures.
- Current workflows now expose stronger checks, but repository rules must enforce them; workflow presence alone does not block a merge.

## Objective

Make executable evidence a mandatory merge boundary and expand CI so destructive generated patches cannot certify themselves.

## Required changes

1. Configure a `main` ruleset or branch protection requiring pull requests.
2. Require the exact stable check names for:
   - backend compilation;
   - focused substrate invariants;
   - backend startup import smoke;
   - frontend production build and clean-bundle check;
   - general backend tests;
   - skill-lib contract/module/boundary runners;
   - dependency and secret scanning.
3. Require branches to be up to date before merge or use a merge queue.
4. Block administrators from bypassing required checks for ordinary changes. Document the emergency procedure separately.
5. Require at least one independent review for generated or agent-authored code that changes executable files, security boundaries, tests, workflows, or completion claims.
6. Prevent the authoring agent from being the sole source of both implementation and completion evidence.
7. Add path-aware tests, but never skip compile/import/security gates merely because a change appears documentation-only when workflow or generated files are involved.
8. Add wheel/install smoke testing so package-layout failures are caught outside the repository root.
9. Add regression tests for all repairs in this folder before marking their PRs complete.
10. Make `HMMM.md`, README status, or other completion declarations depend on CI evidence or be checked against it.
11. Add secret scanning (`gitleaks` or equivalent), dependency audit, and static security checks with reviewed suppressions.
12. Pin third-party actions to immutable commit SHAs after verifying updates.

## Required tests and repository checks

- A deliberately failing test PR cannot merge, including by an administrator through the normal UI.
- A PR with a failing startup import cannot merge even if compilation passes.
- A PR deleting most of a declared public implementation while leaving placeholder comments fails contract/import tests.
- A package that imports only from repository root fails the install smoke.
- A status document claiming completion while required checks fail is rejected or clearly prevented from being merged.

## Acceptance commands

The ruleset itself must be verified through GitHub repository settings or API. In CI, preserve at least:

```bash
python -m compileall -q backend
python -m pytest -q backend/tests backend/interdependent_lib/tests
python -c "import server, models, living_spec, readme_writer"
```

Also run the declared skill-lib runners and a built-wheel import smoke.

## Likely touchpoints

- `.github/workflows/*.yml`
- repository rulesets / branch protection
- test suites
- `HMMM.md` and completion-record process
- dependency and secret-scanning configuration

## Out of scope

This repair does not decide whether each existing test is semantically adequate; Repair 13 covers substrate claim depth.

## hmmm

A green check is evidence only for what it executes. Required status checks and adequate test semantics are both necessary; neither substitutes for the other.