# PR #30 mobile repair receipt

Starting identity: `50cf7f6831839cf9f06842733bef0e10e04ecd17`, targeting
`fd95d04284e92f784239e25e47896077457366dd`. Source authority is this repository's
FastAPI routes, runtime override fingerprints, and Capacitor configuration.

## Repaired review findings

| Finding | Owning repair | Regression evidence |
| --- | --- | --- |
| Credentialed Capacitor CORS | Explicit origins in server; public health probe omits credentials | backend mobile HTTP tests |
| Cross-site auth | Native bearer session, web cookie transport preserved | real AuthProvider/transport tests and `/auth/me` HTTP test |
| Runtime origin refresh | One shared client resolves origin on every request; stale responses rejected | client tests, including tools/audit use of shared client |
| Empty-user navigation | Workspace navigation includes Agents, Keys, Sentinels, Overrides and sign-out | rendered empty workspace and browser navigation |
| Native OAuth callback | HTTPS bridge, fixed deep link, warm/cold listener, expiring S256-bound one-use exchange | both provider bridges, mismatch/expiry/replay and client callback tests |
| Dismissed overrides | Presentation state separate from decision; exact held payload on resume; network-failure retry retains approval | rendered dismiss/reject/approve/retry tests |
| Usage response | `records` field | rendered Activity test |
| Android guide | Bundled Capacitor instructions replace TWA build | generated project and APK workflow |
| Checksum location | Manifest uses artifact-root sibling filename | `sha256sum -c` in extracted layout |
| Disabled sentinels | Backend-resolved modes, explicit disabled/observe/unknown states | rendered all-off test |
| Instance State | Selected turn's `nextSnapshot.tick`; no legacy inspector poll | State regression |
| Health identity | Require `status=ok` and `service=a0p`; reject redirects and malformed origins | health/normalization tests |
| Rack overflow | Scrollable rack with reachable editor/detail | Chromium at 1024×600 and 360px phone |
| Poll overlap | Completion-driven scheduling, request timeout and unmount abort | unresolved-request test with busy/turn changes |

The existing template also requires `module_build_runner` and `test_build_runner`.
Their run exposed existing drift: six invalid module-kind labels, obsolete
Circle/Seed/Core class factory calls, mixed package-qualified tensor identities,
and a generic import witness that did not recognize the runtime's deliberate
file-loaded helper. Repairs use the current module factories and aggregate
properties, relative imports, and exact source-file recognition. They change no
sentinel mode, weighting, permission, mathematical formula, or producer status.
The helper remains loaded through its owning runtime; it is not skipped.

## Verification and usage

From the repository root:

```bash
CI=true npm test --prefix frontend -- --watchAll=false --runInBand
CI=false npm run build --prefix frontend
(cd frontend && npx playwright install chromium && npm run test:browser)
PYTHONPATH=backend python -m pytest -q backend/tests/test_mobile_contracts.py
PYTHONPATH=backend python -m a0p_skills.module_build_runner backend
PYTHONPATH=backend python -m a0p_skills.test_build_runner backend
```

The historical contract runner expects the repo at `/app` and the normal backend
import settings; run in the deployed-layout container or a disposable checkout
mounted there. Give it isolated test storage roots and dummy secrets. It does
not need real provider credentials. The full pytest selection lives in
`.github/workflows/clean-build-check.yml`; the APK gate lives in
`.github/workflows/android-apk.yml`.

Observed locally: 26 frontend regressions, 67 backend selected tests, production
build, phone/tablet Chromium check; 137/137 module manifests valid with no gaps;
contract runner 122 pass, zero failures/errors, 60 explicitly skipped declarations
and one source without CONTRACTS. Those skips are not passing behavior evidence;
the new OAuth contracts are exercised by pytest with explicit CHECKS ownership.
CI and artifact identity must be read on the pushed head before merge.

## Boundary and rollback

`frontend/ANDROID_APK.md` owns deploy, OAuth callback, checksum and signing usage.
Native transactions store only expiry, proof challenge, provider, callback URI,
status and user ID. JWTs and provider credentials are not stored in that
collection or placed in deep links. Tokens remain subject to backend expiry.
The signing key and passwords remain outside GitHub. This produces an unsigned
APK, not a VM deployment or a signed-device acceptance claim.

To roll back, revert this repair commit, redeploy that backend revision and
rebuild the matching bundled UI; remove `PUBLIC_BACKEND_URL` if retiring native
OAuth. Expired transaction rows are disposable and TTL-cleaned. Do not restore a
wildcard credentialed CORS policy or bypass the server's override fingerprint.

hmmm: real VM configuration, external OAuth account setup, and signed-device
installation require deployment evidence; they are not established by mocks or
an unsigned artifact. Existing skipped contract declarations remain visible.
