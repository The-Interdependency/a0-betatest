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
import { getBackendOrigin } from "./backendOrigin";

const KEY = "a0.pending-oauth";
const encode = bytes => btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
window.addEventListener("a0:backend-changed", () => localStorage.removeItem(KEY));
export async function startNativeOAuth(provider) {
  const origin = getBackendOrigin();
  const verifier = encode(crypto.getRandomValues(new Uint8Array(32)));
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  const { data } = await client.post("/auth/oauth/mobile/start", { provider, code_challenge: encode(new Uint8Array(digest)) });
  localStorage.setItem(KEY, JSON.stringify({ state: data.state, verifier, origin, expires: Date.now() + 600000 }));
  await Browser.open({ url: data.url });
}

export async function listenNativeOAuth(onSession, onError) {
  if (!isNative()) return () => {};
  let live = true, inFlight = false;
  const receive = async ({ url }) => {
    let callback;
    try { callback = new URL(url); } catch { return; }
    if (callback.protocol !== "org.interdependentway.a0:" || callback.hostname !== "oauth" || callback.pathname !== "/callback") return;
    if (!live || inFlight) return;
    let pending;
    try { pending = JSON.parse(localStorage.getItem(KEY)); } catch { return; }
    if (!pending || pending.state !== callback.searchParams.get("state") || pending.origin !== getBackendOrigin() || pending.expires <= Date.now()) {
      if (live) onError(new Error("OAuth return did not match this app's pending sign-in. Start sign-in again."));
      return;
    }
    inFlight = true;
    try {
      const { data } = await client.post("/auth/oauth/mobile/exchange", { state: pending.state, code_verifier: pending.verifier });
      if (pending.origin !== getBackendOrigin()) return;
      localStorage.removeItem(KEY);
      if (live) onSession(data);
      await Browser.close().catch(() => {});
    } catch (error) { if (live) onError(error); }
    finally { inFlight = false; }
  };
  const listener = await App.addListener("appUrlOpen", receive);
  const launch = await App.getLaunchUrl();
  if (launch?.url) await receive(launch);
  return () => { live = false; listener.remove(); };
}
