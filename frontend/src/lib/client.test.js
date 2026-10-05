// === MODULE_BUILD ===
// id: mobile_client_test
//   module_name: client_test
//   module_kind: experiment
//   summary: isolated mobile regression witnesses; run npm test -- --watchAll=false
//   owner: a0p maintainer
//   public_surface: Jest test suite
//   internal_surface: local helpers
//   auth_boundary: none
//   storage_boundary: none
//   network_boundary: none
//   user_data_boundary: none
//   admin_only: false
//   tests: npm test -- --watchAll=false --runInBand
//   rollout: bundled APK and backend deploy together; see frontend/ANDROID_APK.md
//   rollback: revert mobile repair commit and rebuild APK
// === END MODULE_BUILD ===
/** Regression: native credential isolation and runtime backend switching.
 * Usage: CI=true npm test -- --watchAll=false --runInBand
 */
import client, { acceptSession, clearSession } from "./client";
import { api } from "./api";
import { setBackendOrigin, normalizeBackendOrigin, probeBackendOrigin } from "./backendOrigin";
import { Capacitor } from "@capacitor/core";
jest.mock("@capacitor/core", () => ({ Capacitor: { isNativePlatform: jest.fn(() => true) } }));
let seen;
beforeEach(() => {
  localStorage.clear(); sessionStorage.clear(); seen = [];
  Capacitor.isNativePlatform.mockReturnValue(true);
  client.defaults.adapter = async config => { seen.push(config); return { data: { records: [] }, status: 200, headers: {}, config }; };
});
test("fresh native install refuses auth before backend configuration", async () => {
  await expect(client.post("/auth/login", { identifier: "a" })).rejects.toThrow("connect an A0 backend");
  expect(seen).toHaveLength(0);
});
test("one shared client immediately uses a saved origin and bearer across reload", async () => {
  setBackendOrigin("https://vm.example/");
  acceptSession({ access_token: "access-for-vm" });
  await api.usage(); await client.get("/auth/me");
  expect(seen.map(c => c.baseURL)).toEqual(["https://vm.example/api", "https://vm.example/api"]);
  expect(seen.every(c => c.withCredentials === false && c.headers.Authorization === "Bearer access-for-vm")).toBe(true);
  // Persistence is sessionStorage, not an in-memory client default.
  expect(JSON.parse(sessionStorage.getItem("a0.native-session")).origin).toBe("https://vm.example");
  setBackendOrigin("https://other.example");
  await api.usage();
  expect(seen[2].baseURL).toBe("https://other.example/api");
  expect(seen[2].headers.Authorization).toBeUndefined();
  clearSession();
});
test("web requests keep cookie credentials and never load native bearer", async () => {
  setBackendOrigin("https://vm.example"); acceptSession({ access_token: "native" });
  Capacitor.isNativePlatform.mockReturnValue(false);
  await api.usage();
  expect(seen[0].withCredentials).toBe(true);
  expect(seen[0].headers.Authorization).toBeUndefined();
});
test("a response from the previous backend cannot install a new-origin session", async () => {
  setBackendOrigin("https://vm.example");
  let finish;
  client.defaults.adapter = config => new Promise(resolve => { finish = () => resolve({ config, data: {} }); });
  const pending = client.get("/auth/me");
  await Promise.resolve(); await Promise.resolve();
  setBackendOrigin("https://other.example"); finish();
  await expect(pending).rejects.toThrow("backend changed");
});
test.each(["https://user:pass@vm.example", "https://vm.example/api", "https://vm.example?x=1", "http://remote.example", "javascript:alert(1)"])("rejects non-origin or insecure input %s", value => {
  expect(() => normalizeBackendOrigin(value)).toThrow();
});
test("probe requires A0 identity, omits credentials and refuses redirects", async () => {
  global.fetch = jest.fn(async () => ({ ok: true, json: async () => ({ status: "ok" }) }));
  await expect(probeBackendOrigin("https://vm.example")).rejects.toThrow("A0");
  global.fetch.mockResolvedValue({ ok: true, json: async () => ({ status: "ok", service: "a0p" }) });
  await expect(probeBackendOrigin("https://vm.example")).resolves.toMatchObject({ service: "a0p" });
  expect(fetch).toHaveBeenLastCalledWith("https://vm.example/api/health", expect.objectContaining({ credentials: "omit", redirect: "error" }));
});
