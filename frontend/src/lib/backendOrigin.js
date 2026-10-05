// === MODULE_BUILD ===
// id: mobile_backendOrigin
//   module_name: backendOrigin
//   module_kind: adapter
//   summary: validate, probe and save the selected A0 HTTPS origin
//   owner: a0p maintainer
//   public_surface: getBackendOrigin, setBackendOrigin, invalidateBackendOrigin, getBackendVersion, probeBackendOrigin
//   internal_surface: local helpers
//   auth_boundary: none
//   storage_boundary: write
//   network_boundary: external
//   user_data_boundary: none
//   admin_only: false
//   tests: npm test -- --watchAll=false --runInBand
//   rollout: bundled APK and backend deploy together; see frontend/ANDROID_APK.md
//   rollback: revert mobile repair commit and rebuild APK
// === END MODULE_BUILD ===
/** Usage: the installed app verifies then saves an origin. Every input edit must
 * call invalidateBackendOrigin immediately, before awaiting work. An explicit
 * empty saved value stays disconnected across reloads instead of using a build
 * default. Hosted web uses only trusted build configuration (same-origin by
 * default), never a saved native preference.
 */
import { Capacitor } from "@capacitor/core";

const STORAGE_KEY = "a0.backendOrigin";
let backendVersion = 0;
window.addEventListener("a0:backend-changed", () => { backendVersion++; });
export const getBackendVersion = () => backendVersion;

export function invalidateBackendOrigin() {
  window.localStorage.setItem(STORAGE_KEY, "");
  window.dispatchEvent(new Event("a0:backend-changed"));
}

export function normalizeBackendOrigin(value) {
  const text = String(value || "").trim().replace(/\/+$/, "");
  if (!text) return "";
  const url = new URL(text);
  if (url.username || url.password || url.search || url.hash || url.pathname !== "/") {
    throw new Error("enter an origin only, without credentials, path, query, or fragment");
  }
  if (url.protocol !== "https:" && !(url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname))) {
    throw new Error("backend origin must use HTTPS (localhost may use HTTP)");
  }
  return url.origin;
}

export function getBackendOrigin() {
  if (!Capacitor.isNativePlatform()) return normalizeBackendOrigin(process.env.REACT_APP_BACKEND_URL || "");
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return normalizeBackendOrigin(stored === null ? process.env.REACT_APP_BACKEND_URL || "" : stored);
}

export function setBackendOrigin(value) {
  const normalized = normalizeBackendOrigin(value);
  if (!normalized) throw new Error("backend origin is required");
  if (!/^https:\/\//i.test(normalized) && !/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(normalized)) {
    throw new Error("backend origin must use HTTPS (localhost may use HTTP)");
  }
  window.localStorage.setItem(STORAGE_KEY, normalized);
  window.dispatchEvent(new Event("a0:backend-changed"));
  return normalized;
}

export async function probeBackendOrigin(value, timeoutMs = 8000) {
  const origin = normalizeBackendOrigin(value);
  if (!origin) throw new Error("backend origin is required");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${origin}/api/health`, {
      method: "GET",
      credentials: "omit",
      redirect: "error",
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`health returned HTTP ${response.status}`);
    const body = await response.json();
    if (body?.status !== "ok" || body?.service !== "a0p") throw new Error("health response is not a healthy A0 backend");
    return body;
  } finally {
    clearTimeout(timer);
  }
}
