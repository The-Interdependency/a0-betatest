# Repair 08 — Deployment environment contract

**Priority:** P1  
**Status:** open  
**Primary risk:** the Cloud Run workflow supplies secret names that do not match the variables required by the backend at import time.

## Verified current behavior

- `backend/db.py` requires `MONGO_URL` and `DB_NAME` during import.
- `backend/auth/__init__.py` requires `JWT_SECRET` when tokens are created or decoded.
- `backend/crypto_vault.py` requires `A0P_KEY_VAULT_SECRET` during import.
- The Cloud Run deployment command currently maps `DATABASE_URL`, `SESSION_SECRET`, XAI, and Stripe secrets, but does not map the required Mongo, database-name, JWT, or key-vault variables.
- CI import smoke supplies the correct names manually, so CI can pass while the deploy command remains inconsistent.

## Objective

Create one typed, validated configuration contract shared by application startup, tests, containers, and deployment automation.

## Required changes

1. Add a central settings module with explicit fields, types, production requirements, safe defaults, and secret classification.
2. Eliminate scattered direct `os.environ[...]` and `os.environ.get(...)` reads for required application configuration.
3. Choose canonical names and use them everywhere. At minimum resolve:
   - `MONGO_URL` versus `DATABASE_URL`;
   - `DB_NAME`;
   - `JWT_SECRET` versus `SESSION_SECRET`;
   - `A0P_KEY_VAULT_SECRET`;
   - frontend URL and CORS origins;
   - administrator seeding inputs;
   - storage roots.
4. Update Cloud Run `--set-secrets` and `--set-env-vars` to provide the canonical fields.
5. Add a deployment preflight that instantiates settings under the exact Cloud Run variable map before building or deploying.
6. Make production startup fail with a concise list of missing/invalid settings without printing secret values.
7. Separate optional provider secrets from core startup requirements.
8. Document local development, CI, and production environment matrices.
9. Confirm Cloud Run service identity can access every Secret Manager entry and that secret rotation creates a new revision.
10. Decide whether the public service should remain `--allow-unauthenticated`; this must align with Repairs 01–03 and route-level auth.

## Required tests

- The exact deployment variable map imports the application successfully.
- Removing each required value produces one clear configuration error.
- Invalid Fernet/JWT material fails before serving traffic.
- No secret value appears in exception text or workflow output.
- Optional provider credentials may be absent without breaking unrelated routes.
- The container health command and Cloud Run startup use the same settings contract.

## Acceptance commands

```bash
python -m compileall -q backend
python -m pytest -q backend/tests

docker build -t a0p-config-smoke .
```

Run the built container with a disposable Mongo configuration or a startup-only validation command.

## Likely touchpoints

- `backend/db.py`
- `backend/auth/__init__.py`
- `backend/crypto_vault.py`
- `backend/server.py`
- `.github/workflows/deploy.yml`
- Dockerfile and deployment documentation

## Out of scope

Application authorization is not replaced by Cloud Run ingress settings.

## hmmm

A passing import smoke proves only the variables supplied to that smoke. The repair is complete when deployment and startup consume the same declared configuration object.