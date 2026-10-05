// === MODULE_BUILD ===
// id: mobile_nativeOAuth_test
//   module_name: nativeOAuth_test
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
/** Regression for warm/cold native OAuth callbacks, mismatches and cleanup. */
import { listenNativeOAuth } from "./nativeOAuth";
import client from "./client";
import { App } from "@capacitor/app";
import { setBackendOrigin } from "./backendOrigin";
jest.mock("./client", () => ({ __esModule: true, default: { post: jest.fn() }, isNative: () => true }));
jest.mock("@capacitor/app", () => ({ App: { addListener: jest.fn(), getLaunchUrl: jest.fn() } }));
jest.mock("@capacitor/browser", () => ({ Browser: { close: jest.fn(async () => {}) } }));
let receive, remove;
beforeEach(() => {
  localStorage.clear(); setBackendOrigin("https://vm.example");
  localStorage.setItem("a0.pending-oauth", JSON.stringify({ state: "expected", verifier: "secret-proof", origin: "https://vm.example", expires: Date.now() + 60000 }));
  remove = jest.fn();
  App.addListener.mockImplementation(async (_, fn) => { receive = fn; return { remove }; });
  App.getLaunchUrl.mockResolvedValue(undefined);
  client.post.mockReset(); client.post.mockResolvedValue({ data: { access_token: "jwt", user: { id: "user" } } });
});
test("warm callback exchanges matching proof once and removes listener", async () => {
  const ok = jest.fn(), error = jest.fn();
  const stop = await listenNativeOAuth(ok, error);
  await receive({ url: "org.interdependentway.a0://oauth/callback?state=expected" });
  expect(client.post).toHaveBeenCalledWith("/auth/oauth/mobile/exchange", { state: "expected", code_verifier: "secret-proof" });
  expect(ok).toHaveBeenCalledTimes(1);
  await receive({ url: "org.interdependentway.a0://oauth/callback?state=expected" });
  expect(client.post).toHaveBeenCalledTimes(1);
  stop(); expect(remove).toHaveBeenCalled();
});
test("cold launch consumes the same callback contract", async () => {
  App.getLaunchUrl.mockResolvedValue({ url: "org.interdependentway.a0://oauth/callback?state=expected" });
  const ok = jest.fn(); const stop = await listenNativeOAuth(ok, jest.fn());
  expect(ok).toHaveBeenCalledTimes(1); stop();
});
test.each(["org.interdependentway.a0://oauth/callback?state=foreign", "https://evil.example/callback?state=expected", "org.interdependentway.a0://other/callback?state=expected"])("rejects foreign callback %s", async url => {
  const ok = jest.fn(); const stop = await listenNativeOAuth(ok, jest.fn());
  await receive({ url }); expect(client.post).not.toHaveBeenCalled(); expect(ok).not.toHaveBeenCalled(); stop();
});
test("backend changes invalidate pending OAuth", async () => {
  const stop = await listenNativeOAuth(jest.fn(), jest.fn());
  setBackendOrigin("https://other.example");
  await receive({ url: "org.interdependentway.a0://oauth/callback?state=expected" });
  expect(client.post).not.toHaveBeenCalled(); stop();
});
