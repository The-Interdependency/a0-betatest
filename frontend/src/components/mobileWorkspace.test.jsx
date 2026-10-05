// === MODULE_BUILD ===
// id: mobile_mobileWorkspace_test
//   module_name: mobileWorkspace_test
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
/** Rendered workspace regressions. Usage: npm test -- --watchAll=false --runInBand. */
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { Simulate } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import ReadoutRack from "./ReadoutRack";
import Shell from "./Shell";
import WorkspacePage from "../pages/WorkspacePage";
import { api } from "../lib/api";
jest.mock("../lib/api", () => ({ api: {
  base: "https://vm.example/api", usage: jest.fn(), listOverrides: jest.fn(), getSentinelModes: jest.fn(),
  listInstances: jest.fn(), getInstance: jest.fn(), chatInstance: jest.fn(), approveOverride: jest.fn(), rejectOverride: jest.fn(),
}, demoQuota: { get: async () => null } }));
jest.mock("../lib/auth", () => ({ useAuth: () => ({ user: { id: "owner", username: "new-user" }, logout: jest.fn() }) }));
jest.mock("./MarkdownView", () => ({ __esModule: true, default: ({ text }) => <div>{text}</div> }));
jest.mock("./AuditTape", () => ({ __esModule: true, default: () => null }));
let root, container;
const off = Object.fromEntries(Array.from({ length: 13 }, (_, i) => [`S${i+1}`, "off"]));
const agent = { id: "selected", sheet: { name: "A0", mode: "zfae_native", sentinel_modes: off }, zfae_metrics: {} };
const click = async selector => { await act(async () => container.querySelector(selector).click()); };
const render = async element => { await act(async () => root.render(element)); };
beforeEach(() => {
  global.IS_REACT_ACT_ENVIRONMENT = true;
  jest.clearAllMocks(); localStorage.clear();
  container = document.createElement("div"); document.body.appendChild(container); root = createRoot(container);
  api.usage.mockResolvedValue({ records: [{ id: "usage-1" }, { id: "usage-2" }], aggregate: {} });
  api.listOverrides.mockResolvedValue({ overrides: [] });
  api.getSentinelModes.mockResolvedValue({ modes: off });
  api.listInstances.mockResolvedValue({ agents: [agent] }); api.getInstance.mockResolvedValue(agent);
  api.rejectOverride.mockResolvedValue({ status: "rejected" }); api.approveOverride.mockResolvedValue({ status: "approved" });
});
afterEach(async () => { await act(async () => root.unmount()); container.remove(); jest.useRealTimers(); });
const rack = props => <ReadoutRack agent={agent} turns={[]} busy={false} {...props} />;
test("new users have agent creation, vault and overrides navigation without an agent", async () => {
  api.listInstances.mockResolvedValue({ agents: [] });
  await render(<MemoryRouter initialEntries={["/workspace"]}><Shell><WorkspacePage /></Shell></MemoryRouter>);
  for (const path of ["/agents", "/keys", "/overrides", "/sentinels"]) expect(container.querySelector(`a[href="${path}"]`)).not.toBeNull();
  expect(container.querySelector('[data-testid="ws-send-btn"]').disabled).toBe(true);
});
test("usage reads records; all off and observe-only sentinels never claim active gating", async () => {
  await render(rack()); await click('[data-testid="readout-activity"]');
  expect(container.querySelector('[data-testid="readout-detail"]').textContent).toContain("usage records2");
  await click('[data-testid="readout-authority"]');
  expect(container.querySelector('[data-testid="readout-detail"]').textContent).toContain("sentinel gatedisabled");
});
test("State displays selected nextSnapshot tick and never consults legacy inspector", async () => {
  await render(rack({ turns: [{ role: "assistant", nextSnapshot: { tick: 7 }, reply_source: "zfae" }] }));
  await click('[data-testid="readout-state"]');
  expect(container.querySelector('[data-testid="readout-detail"]').textContent).toContain("engine tick7");
  await render(rack({ agent: { ...agent, id: "other" }, turns: [] }));
  expect(container.querySelector('[data-testid="readout-detail"]').textContent).toContain("engine tick—");
});
test("backend pending queue is instance scoped and a failed queue stays unknown", async () => {
  api.listOverrides.mockResolvedValue({ overrides: [{ id: "other", agent_id: "other" }, { id: "ours", agent_id: agent.id }] });
  await render(rack());
  expect(container.querySelector('[data-testid="readout-hmmm"]').textContent).toContain("1 unresolved");
});
test("slow polls never overlap when busy or turns change; unmount aborts", async () => {
  jest.useFakeTimers(); let finish;
  api.usage.mockImplementation(() => new Promise(resolve => { finish = resolve; }));
  await render(rack());
  await act(async () => { jest.advanceTimersByTime(60000); });
  await render(rack({ busy: true, turns: [{ role: "user", content: "new" }] }));
  expect(api.usage).toHaveBeenCalledTimes(1);
  await act(async () => { finish({ records: [] }); });
  await act(async () => { jest.advanceTimersByTime(3999); });
  expect(api.usage).toHaveBeenCalledTimes(1);
  await act(async () => { jest.advanceTimersByTime(1); });
  expect(api.usage).toHaveBeenCalledTimes(2);
  const signal = api.usage.mock.calls[1][1].signal;
  await render(null); expect(signal.aborted).toBe(true);
});
test("dismiss hides the modal, keeps pending truth, and reject uses the server", async () => {
  api.chatInstance.mockResolvedValue({ status: 202, data: { reply_source: "zfae_halted", pending_override_id: "halt", sentinel_verdict: { flagged_sentinels: ["S1"] } } });
  await render(<MemoryRouter><WorkspacePage /></MemoryRouter>);
  const textarea = container.querySelector('[data-testid="ws-prompt-input"]') || container.querySelector('textarea');
  await act(async () => { Simulate.change(textarea, { target: { value: "hello" } }); });
  await act(async () => { Simulate.submit(container.querySelector('form')); });
  expect(container.querySelector('[data-testid="override-modal-close"]')).not.toBeNull();
  await click('[data-testid="override-modal-close"]');
  expect(container.querySelector('[data-testid="override-modal-close"]')).toBeNull();
  expect(container.querySelector('[data-testid="readout-hmmm"]').textContent).toContain("1 unresolved");
  expect(container.querySelector('[data-testid="ws-halt-banner"]')).not.toBeNull();
  expect(api.approveOverride).not.toHaveBeenCalled(); expect(api.rejectOverride).not.toHaveBeenCalled();
  await click('[data-testid="ws-halt-banner"] button');
  await act(async () => { Simulate.change(container.querySelector('[data-testid="override-reason-input"]'), { target: { value: "reject this" } }); });
  const reject = [...container.querySelectorAll('button')].find(b => b.textContent.includes('reject'));
  await act(async () => { reject.click(); });
  expect(api.rejectOverride).toHaveBeenCalledWith("halt", { user_id: "local", reason: "reject this" });
  expect(container.querySelector('[data-testid="ws-halt-banner"]')).toBeNull();
});
test("approved halt resumes the same request with server-issued override identity", async () => {
  api.chatInstance.mockResolvedValueOnce({ status: 202, data: { reply_source: "zfae_halted", pending_override_id: "halt", sentinel_verdict: { flagged_sentinels: ["S8"] } } })
    .mockResolvedValueOnce({ status: 200, data: { assistantText: "resumed", reply_source: "zfae", nextSnapshot: { tick: 1 } } });
  await render(<MemoryRouter><WorkspacePage /></MemoryRouter>);
  await act(async () => { Simulate.change(container.querySelector('textarea'), { target: { value: "same prompt" } }); });
  await act(async () => { Simulate.submit(container.querySelector('form')); });
  await act(async () => { Simulate.change(container.querySelector('[data-testid="override-reason-input"]'), { target: { value: "approved with reason" } }); });
  const approve = [...container.querySelectorAll('button')].find(b => b.textContent.includes('approve'));
  await act(async () => { approve.click(); });
  expect(api.approveOverride).toHaveBeenCalledWith("halt", { user_id: "local", justification: "approved with reason" });
  expect(api.chatInstance).toHaveBeenLastCalledWith(agent.id, { ...api.chatInstance.mock.calls[0][1], override_id: "halt" });
  expect(container.querySelector('[data-testid="ws-halt-banner"]')).toBeNull();
});
test("failed approved resume remains retryable without approving twice", async () => {
  api.chatInstance.mockResolvedValueOnce({ status: 202, data: { reply_source: "zfae_halted", pending_override_id: "halt", sentinel_verdict: { flagged_sentinels: ["S8"] } } })
    .mockRejectedValueOnce(new Error("offline"))
    .mockResolvedValueOnce({ status: 200, data: { assistantText: "resumed", reply_source: "zfae", nextSnapshot: { tick: 1 } } });
  await render(<MemoryRouter><WorkspacePage /></MemoryRouter>);
  await act(async () => { Simulate.change(container.querySelector('textarea'), { target: { value: "same prompt" } }); });
  await act(async () => { Simulate.submit(container.querySelector('form')); });
  await act(async () => { Simulate.change(container.querySelector('[data-testid="override-reason-input"]'), { target: { value: "approved with reason" } }); });
  await act(async () => { [...container.querySelectorAll('button')].find(b => b.textContent.includes('approve')).click(); });
  expect(container.querySelector('[data-testid="ws-halt-banner"]').textContent).toContain("resume still required");
  expect(container.querySelector('[data-testid="readout-hmmm"]').textContent).toContain("1 unresolved");
  await click('[data-testid="ws-halt-banner"] button');
  expect(api.approveOverride).toHaveBeenCalledTimes(1);
  expect(api.chatInstance).toHaveBeenLastCalledWith(agent.id, { ...api.chatInstance.mock.calls[0][1], override_id: "halt" });
});
