// === MODULE_BUILD ===
// id: fe_app
//   module_name: App
//   module_kind: ui_root
//   summary: top-level router; 9 routes (Workspace, Agents, Sentinels, Overrides, Inspector, Inventory, Keys, Vault, Drafts)
//   owner: Erin Spencer
//   public_surface: App
//   internal_surface: none
//   auth_boundary: none
//   storage_boundary: none
//   network_boundary: none
//   user_data_boundary: read
//   admin_only: false
//   tests: manual_browser_smoke
//   rollout: default_enabled
//   rollback: revert
// === END MODULE_BUILD ===
// === BOUNDARIES ===
// id: fe_app_boundaries
//   summary: routing shell only
//   auth_boundary: none
//   storage_boundary: none
//   network_boundary: none
//   user_data_boundary: read
//   admin_only: false
//   owner: Erin Spencer
// === END BOUNDARIES ===
// === CAPABILITIES ===
// id: fe_app
//   summary: routing shell only
//   exposes: App
//   boundaries: auth:none, storage:none, network:none, user_data:read
//   owner: Erin Spencer
// === END CAPABILITIES ===

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Shell from "./components/Shell";
import WorkspacePage from "./pages/WorkspacePage";
import KeyVaultPage from "./pages/KeyVaultPage";
import InventoryPage from "./pages/InventoryPage";
import VaultPage from "./pages/VaultPage";
import DraftsPage from "./pages/DraftsPage";
import InspectorPage from "./pages/InspectorPage";
import AgentsPage from "./pages/AgentsPage";
import SentinelsPage from "./pages/SentinelsPage";
import OverridesPage from "./pages/OverridesPage";

export default function App() {
  return (
    <BrowserRouter>
      <Shell>
        <Routes>
          <Route path="/" element={<WorkspacePage />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/sentinels" element={<SentinelsPage />} />
          <Route path="/overrides" element={<OverridesPage />} />
          <Route path="/inspector" element={<InspectorPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/keys" element={<KeyVaultPage />} />
          <Route path="/vault" element={<VaultPage />} />
          <Route path="/drafts" element={<DraftsPage />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  );
}
