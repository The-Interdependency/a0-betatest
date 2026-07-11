# Repair 06 — Authentication and session hardening

**Priority:** P1  
**Status:** open  
**Primary risk:** insecure production cookies, OAuth login CSRF, reusable refresh tokens, and password-equivalence beyond bcrypt’s effective input boundary.

## Verified current behavior

- Auth cookies are set with `secure=False`.
- GitHub OAuth derives its redirect from the request `Origin` header and accepts an optional `state` value without generating or validating it.
- Refresh JWTs have no server-side identifier, rotation record, or revocation path; logout only clears browser cookies.
- Registration allows passphrases up to 256 characters while bcrypt directly consumes UTF-8 bytes. Long passphrases can share the same effective bcrypt prefix.
- Access tokens are returned in JSON even though HttpOnly cookies are also set.
- Login lockout is keyed only by the supplied identifier, allowing targeted account lockout.
- The startup administrator seed can replace the stored administrator password whenever the environment password differs.

## Objective

Establish a production-safe browser-session contract with CSRF-resistant OAuth, revocable refresh tokens, unambiguous password hashing, and deliberate administrator credential lifecycle.

## Required changes

1. Make cookie settings environment-aware and fail closed in production:
   - `Secure=true`;
   - `HttpOnly=true`;
   - explicit `SameSite` compatible with the actual frontend/backend topology;
   - narrow cookie paths, especially for refresh tokens;
   - deliberate domain configuration.
2. Generate a cryptographically random OAuth `state`, bind it to the browser session, set a short expiry, and validate it exactly once in the callback.
3. Use an allowlisted configured frontend redirect URI; never trust arbitrary request `Origin` for redirect construction.
4. Implement refresh-token rotation:
   - unique `jti` per token;
   - hashed server-side token/session record;
   - one-time use;
   - family revocation on reuse;
   - logout and account-security revocation.
5. Migrate password hashing to Argon2id, or introduce a versioned prehash-before-bcrypt scheme with migration on successful login. Preserve compatibility with existing hashes.
6. Remove access tokens from JSON responses unless a documented non-browser API mode requires them.
7. Replace identifier-only lockout with layered rate limiting that avoids easy targeted denial of service while limiting credential stuffing.
8. Add TTL retention for login-attempt records.
9. Make administrator seeding create-only by default. Password rotation must be an explicit command or migration, never an automatic startup side effect.
10. Normalize OAuth error responses so internal network or provider details are not reflected to callers.

## Required tests

- Production configuration refuses to start with insecure cookie settings.
- OAuth callback rejects missing, mismatched, expired, and replayed state.
- An unallowlisted Origin cannot change the redirect URI.
- A used refresh token cannot be reused; reuse revokes the token family.
- Logout revokes the current refresh session.
- Two long passphrases sharing the first 72 bytes remain distinguishable after migration.
- Restarting with a changed `ADMIN_PASSWORD` does not silently reset the administrator account.

## Acceptance commands

```bash
python -m compileall -q backend
python -m pytest -q backend/tests
```

Add browser-cookie and refresh-rotation integration tests.

## Likely touchpoints

- `backend/auth/__init__.py`
- `backend/db.py`
- frontend login/callback handling
- deployment environment and secret configuration

## Out of scope

Anonymous demo isolation belongs to Repair 01.

## hmmm

Cross-site cookie settings depend on the final domain topology. Resolve that topology first; do not weaken `SameSite` merely to make an accidental cross-origin deployment work.