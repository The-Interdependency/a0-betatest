import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const client = axios.create({
  baseURL: API,
  headers: { "Content-Type": "application/json" },
});

export const api = {
  base: API,
  health:           () => client.get("/health").then(r => r.data),

  // BYOK keys
  listKeys:         (user_id = "local") => client.get("/keys", { params: { user_id } }).then(r => r.data),
  upsertKey:        (body) => client.put("/keys", body).then(r => r.data),
  deleteKey:        (id, user_id = "local") => client.delete(`/keys/${id}`, { params: { user_id } }).then(r => r.data),

  // Vault (per-site multi-account env)
  listVault:        (user_id = "local") => client.get("/vault", { params: { user_id } }).then(r => r.data),
  upsertVault:      (body) => client.put("/vault", body).then(r => r.data),
  revealVault:      (body) => client.post("/vault/reveal", body).then(r => r.data),
  deleteVault:      (id, user_id = "local") => client.delete(`/vault/${id}`, { params: { user_id } }).then(r => r.data),

  // Inventory
  inventory:        (user_id = "local") => client.get("/models/inventory", { params: { user_id } }).then(r => r.data),

  // Sessions
  listSessions:     (user_id = "local") => client.get("/sessions", { params: { user_id } }).then(r => r.data),
  createSession:    (body) => client.post("/sessions", body).then(r => r.data),
  getSession:       (id, user_id = "local") => client.get(`/sessions/${id}`, { params: { user_id } }).then(r => r.data),
  updateSession:    (id, body) => client.patch(`/sessions/${id}`, body).then(r => r.data),
  deleteSession:    (id, user_id = "local") => client.delete(`/sessions/${id}`, { params: { user_id } }).then(r => r.data),

  // Drafts
  listDrafts:       (user_id = "local") => client.get("/drafts", { params: { user_id } }).then(r => r.data),
  createDraft:      (body) => client.post("/drafts", body).then(r => r.data),
  updateDraft:      (id, body) => client.patch(`/drafts/${id}`, body).then(r => r.data),
  deleteDraft:      (id, user_id = "local") => client.delete(`/drafts/${id}`, { params: { user_id } }).then(r => r.data),

  // msdmd skill coverage
  skillReport:        (block = "CAPABILITIES") => client.get("/skill/report", { params: { block } }).then(r => r.data),
  skillCapabilities:  () => client.get("/skill/capabilities/report").then(r => r.data),
  skillContracts:     () => client.get("/skill/contracts/report", { timeout: 60000 }).then(r => r.data),
  skillModuleBuild:   () => client.get("/skill/module-build/report").then(r => r.data),

  // Chat
  chatSingle:       (body) => client.post("/chat/single", body, { timeout: 180000 }).then(r => r.data),
  chatFanout:       (body) => client.post("/chat/fanout", body, { timeout: 300000 }).then(r => r.data),
  chatDaisy:        (body) => client.post("/chat/daisychain", body, { timeout: 300000 }).then(r => r.data),
  chatSynthesize:   (body) => client.post("/chat/synthesize", body, { timeout: 180000 }).then(r => r.data),

  // Inspector
  inspectorSnap:    () => client.get("/inspector/snapshot").then(r => r.data),
  inspectorBeat:    (intent) => client.post("/inspector/heartbeat", { intent }).then(r => r.data),

  // Agents
  listAgents:       () => client.get("/agents").then(r => r.data),
  createAgent:      (body) => client.post("/agents", body).then(r => r.data),
  agentManifest:    (slug) => client.get(`/agents/${slug}/manifest`).then(r => r.data),
  deleteAgent:      (slug) => client.delete(`/agents/${slug}`).then(r => r.data),

  // Usage
  usage:            (user_id = "local") => client.get("/usage", { params: { user_id } }).then(r => r.data),
};
