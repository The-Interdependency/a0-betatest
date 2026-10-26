// === MODULE_BUILD ===
// id: mobile_auth_test
//   module_name: auth_test
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
/** Real AuthProvider and Axios adapter: password sessions reach the API after reload. */
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider, useAuth } from "./auth";
import client from "./client";
import { api } from "./api";
import { setBackendOrigin } from "./backendOrigin";
jest.mock("@capacitor/core", () => ({ Capacitor: { isNativePlatform: () => true } }));
jest.mock("./nativeOAuth", () => ({ listenNativeOAuth: async () => () => {} }));
let auth, root, container, requests;
function Probe() { auth = useAuth(); return <span>{auth.user?.id || "anonymous"}</span>; }
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  sessionStorage.clear(); localStorage.clear(); setBackendOrigin("https://vm.example");
  requests = [];
  client.defaults.adapter = async config => {
    requests.push(config);
    if (config.url === "/auth/me" && !config.headers.Authorization) throw new Error("unauthenticated");
    return { config, data: { user: { id: "owner" }, access_token: "native-jwt", records: [] }, status: 200, headers: {} };
  };
  container = document.createElement("div"); document.body.appendChild(container); root = createRoot(container);
});
afterEach(async () => { await act(async () => root.unmount()); container.remove(); });
test.each(["login", "register"])("%s persists bearer for protected calls and provider remount", async method => {
  await act(async () => root.render(<AuthProvider><Probe /></AuthProvider>));
  await act(async () => auth[method]({ identifier: "owner", username: "owner", email: "owner@example.org", passphrase: "long passphrase here" }));
  await api.usage();
  expect(requests.at(-1).headers.Authorization).toBe("Bearer native-jwt");
  await act(async () => root.render(null));
  await act(async () => root.render(<AuthProvider><Probe /></AuthProvider>));
  expect(container.textContent).toBe("owner");
  await act(async () => auth.logout());
  expect(sessionStorage.getItem("a0.native-session")).toBeNull();
  expect(container.textContent).toBe("anonymous");
});
