// === MODULE_BUILD ===
// id: mobile_nativeOAuth
//   module_name: nativeOAuth
//   module_kind: adapter
//   summary: proof-bound native OAuth launch and callback lifecycle
//   owner: a0p maintainer
//   public_surface: startNativeOAuth, listenNativeOAuth
//   internal_surface: local helpers
//   auth_boundary: write
//   storage_boundary: write
//   network_boundary: external
//   user_data_boundary: write
//   admin_only: false
//   tests: npm test -- --watchAll=false --runInBand
//   rollout: bundled APK and backend deploy together; see frontend/ANDROID_APK.md
//   rollback: revert mobile repair commit and rebuild APK
// === END MODULE_BUILD ===
/** Native OAuth only. startNativeOAuth opens the system browser; listenNativeOAuth
 * handles both a warm appUrlOpen and cold launch. The callback contains no tokens.
 * Pending state/proof survives process recreation for ten minutes, is scoped to
 * the chosen backend, and is discarded on backend changes or successful use.
 * Usage: install the listener once in AuthProvider, then call startNativeOAuth.
 */
import { App } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import client, { isNative } from "./client";
import { getBackendOrigin, getBackendVersion } from "./backendOrigin";

const KEY = "a0.pending-oauth";
const encode = bytes => btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
window.addEventListener("a0:backend-changed", () => localStorage.removeItem(KEY));
export async function startNativeOAuth(provider) {
  if (!isNative()) throw new Error("native OAuth requires the installed app");
  const origin = getBackendOrigin();
  const version = getBackendVersion();
  if (!origin) throw new Error("connect an A0 backend before signing in");
  const assertCurrent = () => {
    if (version !== getBackendVersion() || origin !== getBackendOrigin()) {
      throw new Error("backend changed during sign-in; start sign-in again");
    }
  };
  const verifier = encode(crypto.getRandomValues(new Uint8Array(32)));
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  assertCurrent();
  const { data } = await client.post("/auth/oauth/mobile/start", { provider, code_challenge: encode(new Uint8Array(digest)) });
  assertCurrent();
  localStorage.setItem(KEY, JSON.stringify({ state: data.state, verifier, origin, expires: Date.now() + 600000 }));
  await Browser.open({ url: data.url });
}

export async function listenNativeOAuth(onSession, onError) {
  if (!isNative()) return () => {};
  let live = true;
  const inFlight = new Set();
  const receive = async ({ url }) => {
    let callback;
    try { callback = new URL(url); } catch { return; }
    if (callback.protocol !== "org.interdependentway.a0:" || callback.hostname !== "oauth" || callback.pathname !== "/callback") return;
    if (!live) return;
    const rawPending = localStorage.getItem(KEY);
    const version = getBackendVersion();
    let pending;
    try { pending = JSON.parse(rawPending); } catch { return; }
    if (!pending || pending.state !== callback.searchParams.get("state") || pending.origin !== getBackendOrigin() || pending.expires <= Date.now()) {
      if (live) onError(new Error("OAuth return did not match this app's pending sign-in. Start sign-in again."));
      return;
    }
    if (inFlight.has(pending.state)) return;
    inFlight.add(pending.state);
    const current = () => live && version === getBackendVersion()
      && pending.origin === getBackendOrigin() && rawPending === localStorage.getItem(KEY);
    try {
      const { data } = await client.post("/auth/oauth/mobile/exchange", { state: pending.state, code_verifier: pending.verifier });
      if (!current()) return;
      localStorage.removeItem(KEY);
      if (live) onSession(data);
      await Browser.close().catch(() => {});
    } catch (error) { if (current()) onError(error); }
    finally { inFlight.delete(pending.state); }
  };
  const listener = await App.addListener("appUrlOpen", receive);
  const launch = await App.getLaunchUrl();
  if (launch?.url) await receive(launch);
  return () => { live = false; listener.remove(); };
}
