// === MODULE_BUILD ===
// id: fe_component_audit_tape
//   module_name: AuditTape
//   module_kind: ui_component
//   summary: live owner-scoped FIQ-chain tape for the active agent; surfaces redacted event metadata and hashes without rendering tool-result previews
//   owner: Erin Spencer
//   public_surface: AuditTape
//   internal_surface: TapeRow, useAuditFeed, formatPayload
//   auth_boundary: bearer
//   storage_boundary: none
//   network_boundary: external
//   user_data_boundary: read
//   admin_only: false
//   tests: manual_browser_smoke
//   rollout: default_enabled
//   rollback: revert; workspace loses the tape panel
// === END MODULE_BUILD ===
// === BOUNDARIES ===
// id: fe_component_audit_tape_boundaries
//   summary: polling read-only viewer for /api/audit/feed
//   auth_boundary: bearer
//   storage_boundary: none
//   network_boundary: external
//   user_data_boundary: read
//   admin_only: false
//   owner: Erin Spencer
// === END BOUNDARIES ===
// === CAPABILITIES ===
// id: fe_component_audit_tape
//   summary: live audit tape ui
//   exposes: AuditTape
//   boundaries: auth:bearer, storage:none, network:external, user_data:read
//   owner: Erin Spencer
// === END CAPABILITIES ===

import React, { useEffect, useState } from "react";
import axios from "axios";
import { CaretDown, CaretRight, Pulse, ShieldWarning, Wrench, ChatCircle, ShieldCheck, Link } from "@phosphor-icons/react";

const BACKEND = process.env.REACT_APP_BACKEND_URL;
const POLL_MS = 3000;

const ICONS = {
  zfae_chat_reply: <ChatCircle size={12} />,
  zfae_training_step: <Pulse size={12} />,
  zfae_sentinel_verdict: <ShieldCheck size={12} />,
  zfae_override_created: <ShieldWarning size={12} />,
  zfae_override_resolved: <ShieldWarning size={12} />,
  zfae_tool_call: <Wrench size={12} />,
  zfae_tool_result: <Wrench size={12} />,
};

function formatPayload(p) {
  if (!p) return "";
  // Native/teacher tool invocations
  if (p.args_keys !== undefined && p.tool) return `→ ${p.tool}(${(p.args_keys || []).join(", ")})`;
  if (p.status !== undefined && p.tool) return `${p.tool} · ${p.status} · result redacted`;
  // Tool calls (legacy piggyback)
  if (p.kind === "tool_call" && p.tool) return `→ ${p.tool}(${(p.params_summary || []).join(", ")})`;
  // Sentinel verdicts
  if (p.kind === "tool_call" && p.flagged !== undefined) return `${p.tool || ""} flagged=${(p.flagged || []).join(",") || "—"}${p.blocking_cliff ? " · CLIFF" : ""}`;
  if (p.flagged !== undefined) return `flagged=${(p.flagged || []).join(",") || "—"}${p.blocking_cliff ? " · CLIFF" : ""}`;
  if (p.override_id) return `override ${String(p.override_id).slice(0,8)}…`;
  if (p.reply_source) return `${p.reply_source}${p.teacher_called ? " · teacher" : ""}${p.zfae_weights_updated ? " · weights Δ" : ""}`;
  if (p.core) return `core=${p.core} seed=${p.seed_idx} loss=${(p.loss || 0).toFixed?.(4) ?? p.loss}`;
  return JSON.stringify(p).slice(0, 120);
}

function TapeRow({ e }) {
  const Icon = ICONS[e.event_type] || <Pulse size={12} />;
  const tint =
    e.event_type === "zfae_override_created" ? "border-rose-500/40 text-rose-300" :
    e.event_type === "zfae_sentinel_verdict" ? "border-emerald-500/30 text-emerald-300/80" :
    e.event_type === "zfae_chat_reply" ? "border-accent-cyan/40 text-accent-cyan" :
    e.event_type === "zfae_training_step" ? "border-amber-400/30 text-amber-300/80" :
    e.event_type === "zfae_tool_call" ? "border-violet-400/40 text-violet-300" :
    e.event_type === "zfae_tool_result" ? "border-violet-400/25 text-violet-200/80" :
    "border-white/10 text-neutral-300";
  return (
    <div className={`grid grid-cols-[1.2rem_5.5rem_8rem_1fr_7rem] gap-2 items-center px-2 py-1 border-l-2 ${tint}`}
         data-testid={`tape-row-${e.id}`}>
      <span className="text-neutral-500">{Icon}</span>
      <span className="text-[0.6rem] font-mono uppercase tracking-wider">{e.event_type.replace("zfae_","")}</span>
      <span className="text-[0.6rem] font-mono text-neutral-500" title={new Date(e.timestamp_ms).toISOString()}>
        {new Date(e.timestamp_ms).toLocaleTimeString()}
      </span>
      <span className="text-[0.65rem] font-mono text-neutral-300 truncate" title={JSON.stringify(e.payload)}>{formatPayload(e.payload)}</span>
      <span className="text-[0.6rem] font-mono text-neutral-600 truncate flex items-center gap-1" title={`prev=${e.prev_hash} this=${e.this_hash}`}>
        <Link size={10} /> {String(e.this_hash || "").slice(0, 8)}
      </span>
    </div>
  );
}

function useAuditFeed(agentId) {
  const [events, setEvents] = useState([]);
  const [err, setErr] = useState(null);
  useEffect(() => {
    if (!agentId) { setEvents([]); return; }
    let alive = true;
    async function poll() {
      try {
        const r = await axios.get(`${BACKEND}/api/audit/feed`,
          { params: { agent_id: agentId, limit: 50 }, withCredentials: true });
        if (alive) { setEvents(r.data.events || []); setErr(null); }
      } catch (e) {
        if (alive) setErr(e?.response?.data?.detail || e.message);
      }
    }
    poll();
    const id = setInterval(poll, POLL_MS);
    return () => { alive = false; clearInterval(id); };
  }, [agentId]);
  return { events, err };
}

export default function AuditTape({ agentId }) {
  const [open, setOpen] = useState(true);
  const { events, err } = useAuditFeed(agentId);

  // This view is owner+agent filtered while hashes currently form one global
  // chain, so adjacent visible rows are not necessarily adjacent chain rows.
  // Repair 07 owns anchored verification; do not show false break alarms here.

  if (!agentId) return null;
  return (
    <div className="border border-white/10 bg-bg-panel" data-testid="audit-tape">
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-3 py-2 hover:bg-bg-surface">
        <div className="flex items-center gap-2 text-[0.65rem] font-mono uppercase tracking-ultra text-neutral-400">
          {open ? <CaretDown size={12} /> : <CaretRight size={12} />}
          <Wrench size={12} /> tool / cot tape
          <span className="text-neutral-600">· {events.length} events</span>
        </div>
        <span className="text-[0.6rem] font-mono text-neutral-600">polls every 3s</span>
      </button>
      {open && (
        <div className="border-t border-white/5 max-h-72 overflow-auto" data-testid="audit-tape-body">
          {err && <div className="px-3 py-2 text-rose-300 text-xs font-mono" data-testid="audit-tape-error">{String(err)}</div>}
          {events.length === 0 && !err && (
            <div className="px-3 py-3 text-neutral-500 text-xs font-mono" data-testid="audit-tape-empty">
              no events yet for this agent — send a prompt or invoke a tool.
            </div>
          )}
          {events.map(e => <TapeRow key={e.id} e={e} />)}
        </div>
      )}
    </div>
  );
}
