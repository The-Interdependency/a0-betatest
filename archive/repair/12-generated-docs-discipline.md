# Repair 12 — Generated documentation discipline

**Priority:** P2  
**Status:** open  
**Primary risk:** application startup mutates repository documentation, catches generation failures, and permits generated claims to drift from the reviewed source and executable evidence.

## Verified current behavior

- Backend startup calls `write_readme()` and catches all exceptions as warnings.
- Runtime filesystems may be read-only or ephemeral, making generation unreliable and operationally irrelevant.
- A generated README can be stale even when its source blocks or tests have changed.
- The Grok incident demonstrated that completion language can be committed independently of executable truth.

## Objective

Make generated documents deterministic build artifacts checked during development and CI, never best-effort runtime side effects.

## Required changes

1. Remove README generation from application startup.
2. Create one explicit generation command with deterministic ordering, stable formatting, and no timestamps unless they are required and reproducible.
3. Run generation in CI and fail when the committed generated document differs from the generator output.
4. Identify the source of truth for each generated section:
   - MODULE_BUILD blocks;
   - BOUNDARIES;
   - CAPABILITIES;
   - CONTRACTS;
   - status and unresolved claims.
5. Prevent generated prose from upgrading claim status beyond source metadata and passing test/proof gates.
6. Add a generated-file header with source command and edit policy.
7. Keep release status, theorem status, implemented status, and test-backed status distinct.
8. Make generation failure visible as a failing check, not a startup warning.
9. Review repository URL, version, date, test commands, and module counts for stale hard-coded values.
10. Decide whether README is committed or published as a CI artifact; document the choice.

## Required tests

- Running the generator twice produces byte-identical output.
- CI fails after modifying a source block without regenerating documentation.
- Application startup performs no repository writes.
- A failing contract cannot be rendered as complete/test-backed.
- Unresolved `hmmm` boundaries survive generation.
- Generated links and commands point to current repository paths.

## Acceptance commands

```bash
python -m compileall -q backend
python -m pytest -q backend/tests
python -m backend.readme_writer --check
```

Adjust the module invocation to the final explicit CLI, but retain a no-write `--check` mode.

## Likely touchpoints

- `backend/server.py`
- `backend/readme_writer.py`
- `README.md`
- `HMMM.md`
- CI workflows and release process

## Out of scope

Mathematical property implementation is handled by Repair 13. This repair governs how its status is represented.

## hmmm

Generated documentation can prove internal consistency between metadata and prose. It cannot prove that the metadata itself is true; executable and formal gates remain separate.