import React, { useEffect, useMemo, useState } from "react";
import { Activity, Brain, Cpu, Database, Fingerprint, Gauge, Plus, ShieldCheck, Warning } from "@phosphor-icons/react";
import { api } from "../lib/api";

const DEFAULT_ORDER = ["agent","process","inference","state","authority","activity","machine","hmmm"];
const LABELS = {
  agent: "Agent", process: "Process", inference: "Inference", state: "State",
  authority: "Authority", activity: "Activity", machine: "Machine", hmmm: "hmmm"
};
const ICONS = {
  agent: Fingerprint, process: Gauge, inference: Brain, state: Database,
  authority: ShieldCheck, activity: Activity, machine: Cpu, hmmm: Warning
};

function loadConfig() {
  try {
    const raw = JSON.parse(localStorage.getItem("a0.readouts.v1") || "{}");
    return {
      order: Array.isArray(raw.order) ? raw.order.filter(x => DEFAULT_ORDER.includes(x)) : DEFAULT_ORDER,
      visible: raw.visible && typeof raw.visible === "object" ? raw.visible : Object.fromEntries(DEFAULT_ORDER.map(x => [x, true])),
    };
  } catch {
    return { order: DEFAULT_ORDER, visible: Object.fromEntries(DEFAULT_ORDER.map(x => [x, true])) };
  }
}

function ReadoutCard({ id, summary, selected, onSelect }) {
  const Icon = ICONS[id] || Gauge;
  return (
    <button type="button" onClick={() => onSelect(id)}
      className={"a0-readout-card " + (selected ? "a0-readout-card-selected" : "")}
      data-testid={`readout-${id}`}>
      <span className="flex items-center gap-2 min-w-0">
        <Icon size={15} />
        <span className="font-mono text-[0.62rem] uppercase tracking-wider">{LABELS[id] || id}</span>
      </span>
      <span className="font-mono text-xs text-white text-left truncate">{summary}</span>
    </button>
  );
}

export default function ReadoutRack({ agent, turns, busy, pendingOverride }) {
  const [config, setConfig] = useState(loadConfig);
  const [selected, setSelected] = useState("agent");
  const [editing, setEditing] = useState(false);
  const [snapshot, setSnapshot] = useState(null);
  const [usage, setUsage] = useState(null);

  useEffect(() => {
    localStorage.setItem("a0.readouts.v1", JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    let live = true;
    const load = async () => {
      const [s, u] = await Promise.all([
        api.inspectorSnap().catch(() => null),
        api.usage().catch(() => null),
      ]);
      if (live) {
        setSnapshot(s?.agent_card?.snapshot || null);
        setUsage(u);
      }
    };
    load();
    const timer = setInterval(load, busy ? 4000 : 15000);
    return () => { live = false; clearInterval(timer); };
  }, [busy, turns.length]);

  const lastAssistant = useMemo(() => [...turns].reverse().find(t => t.role === "assistant"), [turns]);
  const toolCalls = useMemo(() => turns.reduce((n,t) => n + (t.tool_trace?.length || 0), 0), [turns]);
  const unresolved = pendingOverride ? 1 : (lastAssistant?.reply_source === "zfae_refused" ? 1 : 0);
  const agentName = agent?.sheet?.name || "no agent";
  const inference = lastAssistant?.reply_source || agent?.sheet?.mode || "not yet used";
  const stateStep = agent?.zfae_metrics?.zfae_training_step ?? snapshot?.tick_count ?? 0;
  const machine = navigator.userAgent.includes("Android") ? "Android host" : "web host";
  const summaries = {
    agent: agent ? `${agentName} · ${busy ? "running" : "ready"}` : "select an agent",
    process: busy ? "running current turn" : (turns.length ? "waiting for human" : "idle"),
    inference,
    state: `step ${stateStep}${lastAssistant?.zfae_weights_updated ? " · weights Δ" : ""}`,
    authority: `${toolCalls} tool call${toolCalls === 1 ? "" : "s"} · sentinel gated`,
    activity: `${turns.length} turns · ${toolCalls} tools`,
    machine,
    hmmm: unresolved ? `${unresolved} unresolved boundary` : "clear",
  };

  const details = {
    agent: [
      ["identity", agent?.id || "—"],
      ["name", agentName],
      ["mode", agent?.sheet?.mode || "—"],
      ["status", busy ? "running" : agent ? "ready" : "unselected"],
    ],
    process: [
      ["status", busy ? "running" : "waiting"],
      ["turns", turns.length],
      ["current", busy ? "processing conversation turn" : "human input"],
      ["pending approval", pendingOverride ? "yes" : "no"],
    ],
    inference: [
      ["source", inference],
      ["teacher called", lastAssistant?.teacher_called ? "yes" : "no"],
      ["weights changed", lastAssistant?.zfae_weights_updated ? "yes" : "no"],
      ["loss", agent?.zfae_metrics?.zfae_last_loss ?? "—"],
    ],
    state: [
      ["training step", agent?.zfae_metrics?.zfae_training_step ?? "—"],
      ["engine tick", snapshot?.tick_count ?? "—"],
      ["checkpoint", agent?.zfae_metrics?.zfae_checkpoint_digest?.slice(0,16) || "—"],
      ["memory LT/ST", snapshot?.memory ? `${snapshot.memory.lt?.length || 0}/${snapshot.memory.st?.length || 0}` : "—"],
    ],
    authority: [
      ["sentinel gate", "active"],
      ["tool invocations", toolCalls],
      ["override pending", pendingOverride ? "yes" : "no"],
      ["capability source", "A0 tool registry"],
    ],
    activity: [
      ["conversation turns", turns.length],
      ["tool calls", toolCalls],
      ["last reply", lastAssistant?.reply_source || "—"],
      ["usage records", Array.isArray(usage?.usage) ? usage.usage.length : (usage?.items?.length ?? "—")],
    ],
    machine: [
      ["host", machine],
      ["backend", api.base.replace(/\/api$/, "") || "unconfigured"],
      ["online", navigator.onLine ? "yes" : "no"],
      ["surface", "bundled A0 UI"],
    ],
    hmmm: [
      ["status", unresolved ? "UNRESOLVED" : "clear"],
      ["pending override", pendingOverride?.id || "—"],
      ["refusal", lastAssistant?.reply_source === "zfae_refused" ? "yes" : "no"],
      ["resolution", pendingOverride ? "human approval or rejection required" : "—"],
    ],
  };

  const visible = config.order.filter(id => config.visible[id] !== false);

  function move(id, delta) {
    const order = [...config.order];
    const i = order.indexOf(id), j = i + delta;
    if (i < 0 || j < 0 || j >= order.length) return;
    [order[i], order[j]] = [order[j], order[i]];
    setConfig(c => ({...c, order}));
  }

  return (
    <section className="a0-readout-rack" aria-label="A0 readouts">
      <div className="a0-readout-strip">
        {visible.map(id => <ReadoutCard key={id} id={id} summary={summaries[id]} selected={selected === id} onSelect={setSelected} />)}
        <button type="button" className="a0-readout-add" onClick={() => setEditing(v => !v)} aria-expanded={editing}>
          <Plus size={15}/> readouts
        </button>
      </div>

      {editing && (
        <div className="a0-readout-config">
          {config.order.map((id, i) => (
            <div key={id} className="flex items-center gap-2">
              <label className="flex-1 flex items-center gap-2">
                <input type="checkbox" checked={config.visible[id] !== false}
                  onChange={e => setConfig(c => ({...c, visible:{...c.visible,[id]:e.target.checked}}))}/>
                <span className="font-mono text-xs">{LABELS[id]}</span>
              </label>
              <button type="button" className="btn-ghost py-1 px-2" onClick={() => move(id,-1)} disabled={i===0}>↑</button>
              <button type="button" className="btn-ghost py-1 px-2" onClick={() => move(id,1)} disabled={i===config.order.length-1}>↓</button>
            </div>
          ))}
        </div>
      )}

      <div className="a0-readout-detail" data-testid="readout-detail">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="font-mono text-xs uppercase tracking-ultra text-accent-cyan">{LABELS[selected]}</div>
          <div className="font-mono text-[0.62rem] text-neutral-500">live readout</div>
        </div>
        <div className="space-y-2">
          {(details[selected] || []).map(([k,v]) => (
            <div key={k} className="grid grid-cols-[minmax(7rem,0.9fr)_minmax(0,1.6fr)] gap-2 border-b border-white/5 pb-2">
              <span className="font-mono text-[0.62rem] uppercase tracking-wider text-neutral-500">{k}</span>
              <span className="font-mono text-xs text-white break-words">{String(v)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
