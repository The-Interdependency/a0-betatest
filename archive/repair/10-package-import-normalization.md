# Repair 10 — Package import normalization

**Priority:** P1  
**Status:** open  
**Primary risk:** PCTA/PTCA modules still depend on repository-root-only `backend.interdependent_lib...` imports and may fail when imported as the installed `interdependent_lib` package.

## Verified current behavior

- `pcta/circle.py` imports `backend.interdependent_lib.pcna.tensor` and `backend.interdependent_lib.ptca.constants`.
- `ptca/seed.py` imports `backend.interdependent_lib.pcta.circle` and `backend.interdependent_lib.ptca.constants`.
- `ptca/core.py` follows the same repository-root package pattern.
- The repaired main server import passes because these modules are not necessarily exercised through every deployed path during startup.
- Root-run tests can mask the defect by placing the repository root on `sys.path`.

## Objective

Make every backend package import correctly from all supported execution contexts without duplicate module identities:

- repository-root tests;
- `backend/` working directory;
- editable install;
- built wheel;
- container runtime.

## Required changes

1. Replace `backend.interdependent_lib...` imports inside the package with package-relative imports or canonical `interdependent_lib...` imports.
2. Choose one import identity for all production modules. Do not allow the same source file to load simultaneously as both:
   - `backend.interdependent_lib.x`;
   - `interdependent_lib.x`.
3. Update tests to import the public installed package surface rather than depending on repository namespace packages.
4. Review all `backend.*` imports under backend source, not only the currently known PCTA/PTCA files.
5. Add explicit package discovery configuration to `pyproject.toml` if auto-discovery is ambiguous.
6. Build a wheel and install it into a clean virtual environment before import tests.
7. Test every declared public module and contract path from the installed artifact.
8. Ensure constants do not create circular imports through package `__init__.py`; import leaf modules directly or move shared canon into a dependency-neutral module.
9. Add a static guard that rejects new `backend.interdependent_lib` imports outside narrowly documented test tooling.

## Required tests

- `import interdependent_lib.pcta.circle` succeeds from a directory outside the repository.
- `import interdependent_lib.ptca.seed` and `core` succeed from the installed wheel.
- Public constructors execute after wheel installation.
- The same class imported through all supported paths has one module identity.
- No production source matches `import backend.interdependent_lib`.
- Root tests and backend-working-directory startup both remain green.

## Acceptance commands

```bash
python -m compileall -q backend
python -m pytest -q backend/tests backend/interdependent_lib/tests
python -m build backend
python -m pip install --force-reinstall backend/dist/*.whl
python -c "import interdependent_lib.pcta.circle; import interdependent_lib.ptca.seed; import interdependent_lib.ptca.core"
```

Run the wheel commands in a clean environment in CI rather than over the source checkout.

## Likely touchpoints

- `backend/interdependent_lib/pcta/circle.py`
- `backend/interdependent_lib/ptca/seed.py`
- `backend/interdependent_lib/ptca/core.py`
- `backend/interdependent_lib/tests/test_invariants.py`
- `backend/pyproject.toml`
- import-contract runners

## Out of scope

This repair changes import mechanics, not mathematical composition semantics.

## hmmm

A successful server startup does not prove every public submodule is installable. The acceptance boundary is the built artifact imported outside the repository.