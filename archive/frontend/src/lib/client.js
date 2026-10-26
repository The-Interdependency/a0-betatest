// === MODULE_BUILD ===
// id: mobile_client
//   module_name: client
//   module_kind: adapter
//   summary: shared runtime-aware bearer/cookie HTTP transport
//   owner: a0p maintainer
//   public_surface: client, acceptSession, clearSession, isNative
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
/** Shared transport. Requests bind to the current backend; native sessions use
 * the existing bearer API, never third-party cookies. Usage: client.get('/auth/me').
 * Access tokens live only in sessionStorage, scoped to one backend, and expire
 * under the backend JWT policy. A backend change/logout discards the token.
 * Each response is bound to a selection version, including same-origin edits.
 */
import axios from "axios";
import { Capacitor } from "@capacitor/core";
import { getBackendOrigin, getBackendVersion } from "./backendOrigin";

const SESSION_KEY = "a0.native-session";
export const isNative = () => Capacitor.isNativePlatform();
export function clearSession() { window.sessionStorage.removeItem(SESSION_KEY); }
export function acceptSession(data) {
  if (!isNative()) return;
  const origin = getBackendOrigin();
  if (!origin) throw new Error("connect an A0 backend before signing in");
  if (!data?.access_token) throw new Error("backend did not return an access token");
  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify({ origin, token: data.access_token }));
}
const client = axios.create({ headers: { "Content-Type": "application/json" }, timeout: 30000 });
client.interceptors.request.use(config => {
  const origin = getBackendOrigin();
  if (isNative() && !origin) throw new Error("connect an A0 backend before signing in");
  config.baseURL = `${origin}/api`;
  config.a0BackendVersion = getBackendVersion();
  config.withCredentials = !isNative();
  if (isNative()) {
    let session;
    try { session = JSON.parse(window.sessionStorage.getItem(SESSION_KEY)); } catch { clearSession(); }
    if (session?.origin === origin && session.token) config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});
client.interceptors.response.use(response => {
  if (response.config.baseURL !== `${getBackendOrigin()}/api` || response.config.a0BackendVersion !== getBackendVersion()) {
    throw new Error("backend changed during request; retry on the selected backend");
  }
  return response;
});
window.addEventListener("a0:backend-changed", clearSession);
export default client;
