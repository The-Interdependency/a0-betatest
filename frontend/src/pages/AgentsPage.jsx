import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Panel, Pill, AsciiLoader } from "../components/Panel";
import { Download, Lightning, Plus, Trash, Lock } from "@phosphor-icons/react";

const EMPTY = {
  slug: "", name: "", description: "",
  system_context: "", persona: "",
  default_models: "",
  capabilities: "",
  aimmh_pattern: "fan_out",
  rounds: 1,
  is_premium: false,
};

export default function AgentsPage() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState(EMPTY);
  const [busy, setBusy] = useState(false);

  async function load() {
    setLoading(true);
    const r = await api.listAgents();
    setAgents(r.agents || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function create() {
    if (!draft.slug.trim() || !draft.name.trim()) { alert("slug + name required"); return; }
    setBusy(true);
    try {
      const body = {
        ...draft,
        default_models: draft.default_models.split(",").map(s => s.trim()).filter(Boolean),
        capabilities: draft.capabilities.split(",").map(s => s.trim()).filter(Boolean),
        rounds: parseInt(draft.rounds || 1, 10) || 1,
      };
      await api.createAgent(body);
      setDraft(EMPTY);
      await load();
    } catch (e) {
      alert("create failed: " + (e?.response?.data?.detail || e.message));
    } finally { setBusy(false); }
  }

  async function remove(slug) {
    if (!window.confirm(`remove agent "${slug}"?`)) return;
    await api.deleteAgent(slug);
    await load();
  }

  async function exportAgent(slug) {
    const m = await api.agentManifest(slug);
    const blob = new Blob([JSON.stringify(m, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${slug}.a0p-agent.json`; document.body.appendChild(a); a.click();
    a.remove(); URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6" data-testid="page-agents">
      <header>
        <h1 className="font-mono text-2xl tracking-tighter flex items-center gap-2">
          <Lightning size={22} className="text-accent-cyan"/> Detachable Agents · catalog
        </h1>
        <p className="text-neutral-400 text-sm mt-1 max-w-3xl">
          Build, store, and export portable agent manifests (phone · computer · VM). Each manifest captures
          system context, persona, default model fleet, AIMMH pattern, and capabilities — independent of the
          backend. Future monetization sits here: free vs. premium agents. Today all built-ins are free.
        </p>
      </header>

      <Panel title="new agent">
        <div className="p-4 grid md:grid-cols-2 gap-2">
          <input className="input-term" placeholder="slug (kebab-case-id)" value={draft.slug}
            onChange={e => setDraft({...draft, slug: e.target.value})} data-testid="agent-slug"/>
          <input className="input-term" placeholder="name" value={draft.name}
            onChange={e => setDraft({...draft, name: e.target.value})} data-testid="agent-name"/>
          <input className="input-term md:col-span-2" placeholder="description"
            value={draft.description} onChange={e => setDraft({...draft, description: e.target.value})}
            data-testid="agent-desc"/>
          <textarea className="input-term md:col-span-2 min-h-[70px]" placeholder="system_context"
            value={draft.system_context} onChange={e => setDraft({...draft, system_context: e.target.value})}
            data-testid="agent-system"/>
          <input className="input-term" placeholder="persona"
            value={draft.persona} onChange={e => setDraft({...draft, persona: e.target.value})}
            data-testid="agent-persona"/>
          <input className="input-term" placeholder="capabilities (comma-separated)"
            value={draft.capabilities} onChange={e => setDraft({...draft, capabilities: e.target.value})}
            data-testid="agent-caps"/>
          <input className="input-term md:col-span-2"
            placeholder="default_models — e.g. emergent:openai:gpt-5, emergent:anthropic:claude-sonnet-4-5"
            value={draft.default_models} onChange={e => setDraft({...draft, default_models: e.target.value})}
            data-testid="agent-models"/>
          <select className="input-term" value={draft.aimmh_pattern}
            onChange={e => setDraft({...draft, aimmh_pattern: e.target.value})}
            data-testid="agent-pattern">
            <option value="fan_out">fan_out</option>
            <option value="daisy_chain">daisy_chain</option>
            <option value="council">council</option>
            <option value="room_synthesized">room_synthesized</option>
          </select>
          <input className="input-term" type="number" min={1} max={6}
            value={draft.rounds} onChange={e => setDraft({...draft, rounds: e.target.value})}
            placeholder="rounds" data-testid="agent-rounds"/>
          <label className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <input type="checkbox" checked={draft.is_premium}
              onChange={e => setDraft({...draft, is_premium: e.target.checked})}
              data-testid="agent-premium"/>
            mark as premium (future monetization)
          </label>
          <div className="md:col-span-2">
            <button className="btn-primary" onClick={create} disabled={busy} data-testid="agent-create">
              <Plus size={14}/> create agent
            </button>
          </div>
        </div>
      </Panel>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4"
        style={{
          backgroundImage: "linear-gradient(to bottom, rgba(34,211,238,0.04), transparent 100px)",
        }}>
        {agents.map(a => (
          <div key={a.id}
               className="border border-white/10 bg-bg-panel hover:border-accent-cyan/60 transition-colors p-4 flex flex-col gap-3"
               data-testid={`agent-card-${a.slug}`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="font-mono text-base text-white">{a.name}</div>
                <div className="text-[0.65rem] text-neutral-500 font-mono">{a.slug}</div>
              </div>
              {a.is_premium
                ? <Pill tone="amber"><Lock size={10} className="mr-1"/> premium</Pill>
                : <Pill tone="emerald">free</Pill>}
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed font-sans">
              {a.description || "—"}
            </p>
            <div className="flex flex-wrap gap-1">
              <Pill tone="cyan">{a.aimmh_pattern}</Pill>
              {a.rounds > 1 && <Pill>r×{a.rounds}</Pill>}
              {(a.capabilities || []).slice(0, 3).map(c => <Pill key={c}>{c}</Pill>)}
            </div>
            <div className="text-[0.65rem] font-mono text-neutral-500">
              fleet · {(a.default_models || []).length} models
            </div>
            <div className="mt-auto flex items-center gap-2">
              <button className="btn-ghost flex-1 justify-center"
                onClick={() => exportAgent(a.slug)} data-testid={`agent-export-${a.slug}`}>
                <Download size={14}/> manifest
              </button>
              <button className="btn-danger" onClick={() => remove(a.slug)} data-testid={`agent-del-${a.slug}`}>
                <Trash size={14}/>
              </button>
            </div>
          </div>
        ))}
        {!agents.length && !loading && (
          <div className="text-xs text-neutral-500 font-mono col-span-full p-6 text-center">No agents yet.</div>
        )}
      </div>
      {loading && <AsciiLoader label="loading agents"/>}
    </div>
  );
}
