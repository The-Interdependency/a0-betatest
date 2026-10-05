const STORAGE_KEY = "a0.backendOrigin";

export function normalizeBackendOrigin(value) {
  return String(value || "").trim().replace(/\/+$/, "");
}

export function getBackendOrigin() {
  const stored = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : "";
  return normalizeBackendOrigin(stored || process.env.REACT_APP_BACKEND_URL || "");
}

export function setBackendOrigin(value) {
  const normalized = normalizeBackendOrigin(value);
  if (!normalized) throw new Error("backend origin is required");
  if (!/^https:\/\//i.test(normalized) && !/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(normalized)) {
    throw new Error("backend origin must use HTTPS (localhost may use HTTP)");
  }
  window.localStorage.setItem(STORAGE_KEY, normalized);
  return normalized;
}

export async function probeBackendOrigin(value, timeoutMs = 8000) {
  const origin = normalizeBackendOrigin(value);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${origin}/api/health`, {
      method: "GET",
      credentials: "include",
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`health returned HTTP ${response.status}`);
    const body = await response.json();
    if (body?.status !== "ok") throw new Error("health response did not report ok");
    return body;
  } finally {
    clearTimeout(timer);
  }
}
