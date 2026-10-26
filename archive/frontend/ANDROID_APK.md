# Bundled A0 Android APK

The supported Android build is Capacitor 7, package `org.interdependentway.a0`.
The APK contains the React UI. It does not auto-update from a hosted PWA; ship a
new APK for UI changes. The previous Bubblewrap/TWA procedure is removed.

## Build and verify

Use Node 22, Java 21, and an Android SDK (as on the GitHub Ubuntu runner):

```bash
cd frontend
npm ci
CI=true npm test -- --watchAll=false --runInBand
REACT_APP_BACKEND_URL='' npm run build
npx playwright install chromium
npm run test:browser
npx cap add android                    # first generation only
node scripts/configure-android.cjs    # repeat safely after regeneration
npx cap sync android
(cd android && ./gradlew --no-daemon assembleRelease)
cd ..
mkdir -p dist
cp frontend/android/app/build/outputs/apk/release/app-release-unsigned.apk dist/a0-mobile-release-unsigned.apk
(cd dist && sha256sum a0-mobile-release-unsigned.apk > SHA256SUMS.txt)
(cd dist && sha256sum -c SHA256SUMS.txt)
python frontend/scripts/verify-apk.py dist/a0-mobile-release-unsigned.apk
```

PRs run `.github/workflows/android-apk.yml`. Download and extract the
`a0-mobile-unsigned` artifact, then run `sha256sum -c SHA256SUMS.txt` **inside
its extracted directory**. The APK and manifest use sibling filenames.
`SOURCE_COMMIT.txt` identifies the actual checkout (the PR merge candidate on
pull-request runs); the workflow run also binds the PR head. The workflow checks
bundled UI assets, local origin, App/Browser plugins, unsigned status, and the
compiled OAuth intent filter. It does not sign or install the app.

## Connect the VM

Deploy this branch's backend with the normal Mongo, JWT, and vault settings.
`CORS_ORIGINS` is a comma-separated explicit list of web frontend origins;
`https://localhost` is included for Capacitor. Wildcards are ignored. Keep the
VM behind valid HTTPS. On the app's login screen, enter its **origin**, for
example `https://a0.example.org`, and tap connect. A credential-free, nonredirecting
`/api/health` probe must report both `status: ok` and `service: a0p`. This is an
application marker, not independent proof of server ownership: use your VM's
known HTTPS address. Every API client uses the new origin immediately. Switching
backends discards the native session and outstanding native OAuth state.

Native login/register/OAuth use the backend's access JWT as a bearer token and
omit cookies. The access token is scoped to the selected backend in
`sessionStorage`, survives a WebView reload, and expires under the backend's
existing JWT policy. Closing the app's WebView session or token expiry requires
sign-in again; refresh tokens are not placed in JS storage. Web login retains
its existing HttpOnly SameSite=Lax cookie behavior. CORS is not authentication;
all protected routes continue to require a valid user token.

## Native OAuth

Set `PUBLIC_BACKEND_URL=https://a0.example.org` on the VM. Configure the GitHub
OAuth application callback as:

```text
https://a0.example.org/api/auth/oauth/mobile/callback
```

Keep `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` on the backend. Use a separate
OAuth application/configuration for the existing web callback if the provider's
callback policy requires it. Google continues to use the existing Emergent
Google broker, with the same HTTPS bridge as its redirect target; availability
of that external broker remains a deployment dependency.

The App and Browser plugins launch OAuth in the system browser and handle both
`appUrlOpen` and `getLaunchUrl`. The generated Android intent handles only
`org.interdependentway.a0://oauth/callback`. The browser sends provider results
to the HTTPS backend before returning an opaque transaction ID to A0. A separate
S256 verifier retained by the initiating app must match before a one-use access
session is issued. GitHub also receives its own server-held PKCE challenge.
Transactions have a ten-minute TTL with explicit expiry checks; the TTL index
removes old records. Provider tokens, passwords, and JWTs never enter deep links
or the transaction collection. Failed, expired, mismatched, or replayed callbacks
fail closed; begin sign-in again. Pending native proof/state is kept locally for
cold-launch recovery and cleared after success or a backend change.

## Signing and device acceptance

The historical signing key remains unavailable and outside GitHub. This workflow
produces an **unsigned** release APK. Sign it outside the repository using the
retained 2026 key; never commit the key, passwords, or a signing-settings file.
Use Android SDK `zipalign`, then `apksigner sign`, then `apksigner verify` and
compute a **new checksum for the signed file**. A different signing lineage
cannot upgrade an installed app unless Android has a valid lineage linking it;
export any needed app data before uninstalling an incompatible installation.

Device checks after signing: connect to the intended VM; register or sign in;
reload and make an authenticated request; complete Google/GitHub return while
warm and cold; create an agent through A0 navigation; send a turn; dismiss a halt
modal and confirm pending remains visible; approve/reject through the existing
server gate; inspect State for that instance; disable sentinels and verify the
readout says disabled. Open the rack editor on a short landscape tablet and
scroll to its detail. CI exercises these contracts with test transports; actual
provider accounts and signed-device installation remain deployment checks.

## hmmm

The build establishes a bundled unsigned artifact. It does not establish that a
particular VM has been updated, that either OAuth provider is configured there,
or that a signed APK has passed the device checks above.
