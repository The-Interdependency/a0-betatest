// === MODULE_BUILD ===
// id: mobile_login_boundaries_test
//   module_name: LoginPage_test
//   module_kind: experiment
//   summary: real login, auth provider and transport regression witnesses for backend edits and asynchronous completion order
//   owner: a0p maintainer
//   public_surface: Jest test suite
//   internal_surface: isolated browser and provider fixtures
//   auth_boundary: none
//   storage_boundary: write
//   network_boundary: none
//   user_data_boundary: none
//   admin_only: false
//   tests: CI=true npm test -- --watchAll=false --runInBand
//   rollout: frontend regression gate
//   rollback: revert with owning mobile repair
// === END MODULE_BUILD ===
/** Usage: CI=true npm test -- --watchAll=false --runInBand LoginPage.test.jsx.
 * Render the real UI, AuthProvider, Axios interceptors and OAuth lifecycle.
 * Only network adapters, platform plugins and proof generation are mocked.
 */
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { TextEncoder } from "util";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import LoginPage from "./LoginPage";
import { AuthProvider, useAuth } from "../lib/auth";
import client, { acceptSession } from "../lib/client";
import { getBackendOrigin, setBackendOrigin } from "../lib/backendOrigin";
import { startNativeOAuth } from "../lib/nativeOAuth";

jest.mock("@capacitor/core", () => ({ Capacitor: { isNativePlatform: jest.fn(() => true) } }));
jest.mock("@capacitor/app", () => ({ App: { addListener: jest.fn(), getLaunchUrl: jest.fn() } }));
jest.mock("@capacitor/browser", () => ({ Browser: { open: jest.fn(async () => {}), close: jest.fn(async () => {}) } }));

const credentials = { identifier: "owner", username: "owner", email: "owner@example.org", passphrase: "test passphrase only" };
const healthy = () => ({ ok: true, json: async () => ({ status: "ok", service: "a0p" }) });
const response = (config, data = { user: { id: "owner" }, access_token: "test-token" }) => ({ config, data, status: 200, headers: {} });
const originalFetch = global.fetch;
const originalEncoder = global.TextEncoder;
const originalCrypto = Object.getOwnPropertyDescriptor(global, "crypto");
let auth, root, container, requests, receive, savedDefault;
function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
function Probe() { auth = useAuth(); return <span data-testid="auth-user">{auth.user?.id || "anonymous"}</span>; }
const byId = id => container.querySelector(`[data-testid="${id}"]`);
async function input(id, value) {
  await act(async () => {
    const element = byId(id);
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(element, value);
    element.dispatchEvent(new Event("input", { bubbles: true }));
  });
}
async function click(id) { await act(async () => { byId(id).click(); }); }
async function mount() {
  await act(async () => root.render(
    <MemoryRouter initialEntries={["/login"]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider><Probe /><Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/workspace" element={<div data-testid="workspace">workspace</div>} />
      </Routes></AuthProvider>
    </MemoryRouter>
  ));
}
async function connect(origin = "https://vm.example") {
  if (byId("backend-origin-input").value !== origin) await input("backend-origin-input", origin);
  await click("backend-connect-btn");
  expect(byId("backend-origin-status").textContent.trim()).toBe("ok");
}
function pendingOAuth(state = "old-state") {
  localStorage.setItem("a0.pending-oauth", JSON.stringify({ state, verifier: "test-proof", origin: getBackendOrigin(), expires: Date.now() + 60000 }));
}
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  localStorage.clear(); sessionStorage.clear(); requests = [];
  savedDefault = process.env.REACT_APP_BACKEND_URL;
  delete process.env.REACT_APP_BACKEND_URL;
  Capacitor.isNativePlatform.mockReturnValue(true);
  setBackendOrigin("https://vm.example");
  App.addListener.mockImplementation(async (_, callback) => { receive = callback; return { remove: jest.fn() }; });
  App.getLaunchUrl.mockResolvedValue(undefined);
  Browser.open.mockClear(); Browser.close.mockClear();
  global.fetch = jest.fn(async () => healthy());
  global.TextEncoder = TextEncoder;
  Object.defineProperty(global, "crypto", { configurable: true, value: {
    getRandomValues: jest.fn(bytes => { bytes.fill(7); return bytes; }),
    subtle: { digest: jest.fn(async () => new ArrayBuffer(32)) },
  } });
  client.defaults.adapter = async config => {
    requests.push(config);
    return response(config, config.url === "/auth/me" ? { user: null } : undefined);
  };
  container = document.createElement("div"); document.body.appendChild(container); root = createRoot(container);
});
afterEach(async () => {
  await act(async () => root.unmount()); container.remove();
  global.fetch = originalFetch; global.TextEncoder = originalEncoder;
  if (originalCrypto) Object.defineProperty(global, "crypto", originalCrypto);
  else delete global.crypto;
  if (savedDefault === undefined) delete process.env.REACT_APP_BACKEND_URL;
  else process.env.REACT_APP_BACKEND_URL = savedDefault;
});

test.each([["login", ""], ["register", ""], ["login", "https://build-default.example"], ["register", "https://build-default.example"]])("hosted web %s ignores saved native overrides with configured origin '%s'", async (method, origin) => {
  localStorage.setItem("a0.backendOrigin", "https://stale.example");
  sessionStorage.setItem("a0.native-session", JSON.stringify({ origin: "https://stale.example", token: "old-native-token" }));
  process.env.REACT_APP_BACKEND_URL = origin;
  Capacitor.isNativePlatform.mockReturnValue(false);
  await mount();
  expect(byId("backend-origin-panel")).toBeNull();
  await act(async () => { await auth[method](credentials); });
  const sent = requests.find(config => config.url === `/auth/${method}`);
  expect(sent.baseURL).toBe(`${origin || window.location.origin}/api`);
  expect(getBackendOrigin()).toBe(origin || window.location.origin);
  expect(new URL(`${getBackendOrigin()}/api/mcp`).origin).toBe(origin || window.location.origin);
  expect(sent.withCredentials).toBe(true);
  expect(sent.headers.Authorization).toBeUndefined();
  expect(byId("workspace")).not.toBeNull();
});

test("malformed native preferences cannot break a hosted web login", async () => {
  localStorage.setItem("a0.backendOrigin", "not an origin");
  Capacitor.isNativePlatform.mockReturnValue(false);
  await mount();
  expect(getBackendOrigin()).toBe(window.location.origin);
  expect(byId("page-login")).not.toBeNull();
});

test("a backend edit immediately clears credentials, pending OAuth and configured fallback", async () => {
  process.env.REACT_APP_BACKEND_URL = "https://build-default.example";
  await mount(); await connect();
  acceptSession({ access_token: "old-token" }); pendingOAuth();
  await input("backend-origin-input", "https://unchecked.example");
  expect(getBackendOrigin()).toBe("");
  expect(localStorage.getItem("a0.backendOrigin")).toBe("");
  expect(sessionStorage.getItem("a0.native-session")).toBeNull();
  expect(localStorage.getItem("a0.pending-oauth")).toBeNull();
  expect(byId("social-github-btn").disabled).toBe(true);
  await act(async () => { await receive({ url: "org.interdependentway.a0://oauth/callback?state=old-state" }); });
  expect(requests.some(config => config.url === "/auth/oauth/mobile/exchange")).toBe(false);
});

test.each(["login", "register"])("a delayed %s cannot revive a session after editing and reconnecting the same origin", async method => {
  await mount(); await connect();
  const late = deferred();
  let oldConfig, outcome;
  client.defaults.adapter = config => { oldConfig = config; return late.promise; };
  await act(async () => { outcome = auth[method](credentials).catch(error => error); });
  expect(oldConfig.url).toBe(`/auth/${method}`);
  await input("backend-origin-input", "https://vm.example/");
  await connect();
  await act(async () => { late.resolve(response(oldConfig)); await outcome; });
  expect(await outcome).toBeInstanceOf(Error);
  expect(sessionStorage.getItem("a0.native-session")).toBeNull();
  expect(byId("auth-user").textContent).toBe("anonymous");
  expect(byId("workspace")).toBeNull();
});

test.each(["success", "failure"])("a stale probe's %s cannot overwrite a newer verified origin", async ending => {
  await mount();
  const older = deferred(), newer = deferred();
  global.fetch.mockImplementation(url => url.startsWith("https://older.example/") ? older.promise : newer.promise);
  await input("backend-origin-input", "https://older.example"); await click("backend-connect-btn");
  await input("backend-origin-input", "https://newer.example"); await click("backend-connect-btn");
  await act(async () => { newer.resolve(healthy()); });
  await act(async () => { if (ending === "success") older.resolve(healthy()); else older.reject(new Error("old probe failed")); });
  expect(getBackendOrigin()).toBe("https://newer.example");
  expect(byId("backend-origin-input").value).toBe("https://newer.example");
  expect(byId("backend-origin-status").textContent.trim()).toBe("ok");
  expect(byId("login-error")).toBeNull();
});

test("an unmounted login cannot persist its late health probe", async () => {
  await mount();
  const probe = deferred(); global.fetch.mockReturnValue(probe.promise);
  await input("backend-origin-input", "https://late.example"); await click("backend-connect-btn");
  await act(async () => root.render(null));
  await act(async () => { probe.resolve(healthy()); });
  expect(localStorage.getItem("a0.backendOrigin")).toBe("");
});

test("editing during proof generation cancels OAuth before a start request", async () => {
  await mount(); await connect();
  const digest = deferred(); crypto.subtle.digest.mockReturnValue(digest.promise);
  const outcome = startNativeOAuth("github").catch(error => error);
  await input("backend-origin-input", "https://vm.example/");
  digest.resolve(new ArrayBuffer(32));
  expect(await outcome).toBeInstanceOf(Error);
  expect(requests.some(config => config.url === "/auth/oauth/mobile/start")).toBe(false);
  expect(Browser.open).not.toHaveBeenCalled();
  expect(localStorage.getItem("a0.pending-oauth")).toBeNull();
});

test("editing during OAuth start prevents pending-state recreation and browser launch", async () => {
  await mount(); await connect();
  const late = deferred(); let config, outcome;
  client.defaults.adapter = request => { config = request; return late.promise; };
  await act(async () => { outcome = startNativeOAuth("github").catch(error => error); });
  expect(config.url).toBe("/auth/oauth/mobile/start");
  await input("backend-origin-input", "https://vm.example/"); await connect();
  late.resolve(response(config, { state: "old-state", url: "https://provider.example" }));
  expect(await outcome).toBeInstanceOf(Error);
  expect(localStorage.getItem("a0.pending-oauth")).toBeNull();
  expect(Browser.open).not.toHaveBeenCalled();
});

test("an invalidated OAuth exchange neither blocks nor overwrites a new sign-in", async () => {
  await mount(); await connect(); pendingOAuth();
  const late = deferred(); let oldConfig, oldExchange;
  client.defaults.adapter = config => {
    if (JSON.parse(config.data).state === "old-state") { oldConfig = config; return late.promise; }
    return Promise.resolve(response(config, { user: { id: "new-user" }, access_token: "new-token" }));
  };
  await act(async () => { oldExchange = receive({ url: "org.interdependentway.a0://oauth/callback?state=old-state" }); });
  expect(oldConfig.url).toBe("/auth/oauth/mobile/exchange");
  await input("backend-origin-input", "https://vm.example/"); await connect(); pendingOAuth("new-state");
  await act(async () => { await receive({ url: "org.interdependentway.a0://oauth/callback?state=new-state" }); });
  expect(byId("auth-user").textContent).toBe("new-user");
  await act(async () => { late.resolve(response(oldConfig, { user: { id: "old-user" }, access_token: "old-token" })); await oldExchange; });
  expect(byId("auth-user").textContent).toBe("new-user");
  expect(JSON.parse(sessionStorage.getItem("a0.native-session")).token).toBe("new-token");
  expect(localStorage.getItem("a0.pending-oauth")).toBeNull();
});

// An exchange can succeed while installing its session fails locally.
test.each(["missing token", "storage denied"])("OAuth surfaces session installation failure: %s", async failure => {
  await mount(); await connect(); pendingOAuth();
  client.defaults.adapter = async config => response(config, failure === "missing token"
    ? { user: { id: "owner" } }
    : { user: { id: "owner" }, access_token: "test-token" });
  const originalSetItem = Storage.prototype.setItem;
  const storage = jest.spyOn(Storage.prototype, "setItem").mockImplementation(function (key, value) {
    if (failure === "storage denied" && this === sessionStorage && key === "a0.native-session") {
      throw new Error("session storage denied");
    }
    return originalSetItem.call(this, key, value);
  });
  try {
    await act(async () => { await receive({ url: "org.interdependentway.a0://oauth/callback?state=old-state" }); });
    expect(byId("auth-user").textContent).toBe("anonymous");
    expect(sessionStorage.getItem("a0.native-session")).toBeNull();
    expect(localStorage.getItem("a0.pending-oauth")).toBeNull();
    expect(byId("login-error").textContent).toContain(failure === "missing token" ? "access token" : "session storage denied");
  } finally { storage.mockRestore(); }
});
