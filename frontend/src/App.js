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

export default function App() {
  return (
    <BrowserRouter>
      <Shell>
        <Routes>
          <Route path="/" element={<WorkspacePage />} />
          <Route path="/keys" element={<KeyVaultPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/vault" element={<VaultPage />} />
          <Route path="/drafts" element={<DraftsPage />} />
          <Route path="/inspector" element={<InspectorPage />} />
          <Route path="/agents" element={<AgentsPage />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  );
}
