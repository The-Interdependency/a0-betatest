import React, { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../lib/api";
import MarkdownView from "../components/MarkdownView";
import { Panel, Pill, AsciiLoader } from "../components/Panel";
import { PaperPlaneTilt, Plus, Sparkle, Link as LinkIcon, FloppyDisk, FloppyDiskBack, Trash, CaretLeft, CaretRight } from "@phosphor-icons/react";

const MODES = [
  { id: "single",  label: "single" },
  { id: "fanout",  label: "fan-out" },
  { id: "daisy",   label: "daisy-chain" },
];

export default function WorkspacePage() {
  // session + context
  const [session, setSession] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [systemContext, setSystemContext] = useState("You are a careful, source-aware research assistant. Use Markdown. Math: $...$ and $$...$$.");
  const [persona, setPersona] = useState("");

  // models
  const [inventory, setInventory] = useState([]);
  const [selectedModels, setSelectedModels] = useState([]);
  const [useEmergentFor, setUseEmergentFor] = useState({ openai: true, anthropic: true, gemini: true, xai: false });

  // chat
  const [mode, setMode] = useState("fanout");
  const [prompt, setPrompt] = useState("");
  const [rounds, setRounds] = useState(2);
  const [transcript, setTranscript] = useState([]);   // list of {role, panels: [{model_id, content, usage, error}], ts}
  const [busy, setBusy] = useState(false);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [synthModel, setSynthModel] = useState("");

  // drafts
  const draftSaveTimer = useRef(null);
  const [draftId, setDraftId] = useState(null);
  const [draftStatus, setDraftStatus] = useState("idle");

  useEffect(() => {
    (async () => {
      const [inv, sess] = await Promise.all([api.inventory(), api.listSessions()]);
      setInventory(inv.models || []);
      setSessions(sess.sessions || []);
      // pick three sane defaults via emergent
      const defaults = [
        "emergent:openai:gpt-5-mini",
        "emergent:anthropic:claude-sonnet-4-5",
        "emergent:gemini:gemini-2.5-flash",
      ];
      setSelectedModels(defaults);
      setSynthModel(defaults[0]);
    })();
  }, []);

  function toModelId(m) {
    return m.provider === "emergent" ? `emergent:${m.id}` : `${m.provider}:${m.id}`;
  }
  function providerOf(modelId) {
    const [head, sub] = modelId.split(":");
    if (head === "emergent" && sub) return sub; // routing target
    return head;
  }
  const emergentList = Object.entries(useEmergentFor).filter(([, v]) => v).map(([k]) => k);

  // ---- new session
  async function newSession() {
    const r = await api.createSession({
      user_id: "local",
      title: prompt.slice(0, 40) || "untitled session",
      system_context: systemContext,
      persona,
      selected_models: selectedModels,
    });
    setSession(r);
    const list = await api.listSessions();
    setSessions(list.sessions);
  }

  async function loadSession(id) {
    const s = await api.getSession(id);
    setSession(s);
    setSystemContext(s.system_context || "");
    setPersona(s.persona || "");
    setSelectedModels(s.selected_models || []);
    setTranscript((s.turns || []).reduce((acc, t) => {
      if (t.role === "user") acc.push({ role: "user", content: t.content, ts: t.ts });
      else acc.push({ role: "assistant", panels: [{ model_id: t.model_id, content: t.content, usage: t.usage }], ts: t.ts });
      return acc;
    }, []));
  }

  async function deleteSession(id) {
    if (!window.confirm("delete session?")) return;
    await api.deleteSession(id);
    if (session?.id === id) setSession(null);
    const list = await api.listSessions();
    setSessions(list.sessions);
  }

  // ---- draft autosave
  useEffect(() => {
    if (!prompt.trim()) { setDraftStatus("idle"); return; }
    if (draftSaveTimer.current) clearTimeout(draftSaveTimer.current);
    setDraftStatus("dirty");
    draftSaveTimer.current = setTimeout(async () => {
      setDraftStatus("saving");
      try {
        if (draftId) {
          await api.updateDraft(draftId, { user_id: "local", content: prompt, title: prompt.slice(0, 40), tags: [mode] });
        } else {
          const d = await api.createDraft({ user_id: "local", content: prompt, title: prompt.slice(0, 40), tags: [mode] });
          setDraftId(d.id);
        }
        setDraftStatus("saved");
      } catch { setDraftStatus("error"); }
    }, 1200);
    return () => clearTimeout(draftSaveTimer.current);
  }, [prompt, mode]);  // eslint-disable-line react-hooks/exhaustive-deps

  // ---- send
  async function send() {
    if (!prompt.trim() || busy) return;
    setBusy(true);
    const userTurn = { role: "user", content: prompt, ts: new Date().toISOString() };
    setTranscript(t => [...t, userTurn]);
    let curSession = session;
    if (!curSession) {
      const r = await api.createSession({
        user_id: "local",
        title: prompt.slice(0, 40),
        system_context: systemContext,
        persona,
        selected_models: selectedModels,
      });
      curSession = r;
      setSession(r);
      const list = await api.listSessions(); setSessions(list.sessions);
    }
    try {
      if (mode === "single") {
        if (!selectedModels.length) throw new Error("pick at least one model");
        const r = await api.chatSingle({
          user_id: "local",
          model_id: selectedModels[0],
          messages: [{ role: "user", content: prompt }],
          system: systemContext,
          session_id: curSession.id,
          use_emergent_for: emergentList,
        });
        setTranscript(t => [...t, { role: "assistant", panels: [{ model_id: r.result.model_id, content: r.result.content, usage: r.result.usage, error: r.result.error }], ts: new Date().toISOString() }]);
      } else if (mode === "fanout") {
        if (selectedModels.length < 2) throw new Error("fan-out: pick ≥ 2 models");
        const r = await api.chatFanout({
          user_id: "local",
          prompt, system_context: systemContext,
          model_ids: selectedModels,
          session_id: curSession.id,
          use_emergent_for: emergentList,
        });
        setTranscript(t => [...t, { role: "assistant", panels: r.results, ts: new Date().toISOString(), kind: "fanout" }]);
        setCarouselIdx(0);
      } else if (mode === "daisy") {
        if (selectedModels.length < 2) throw new Error("daisy-chain: pick ≥ 2 models");
        const r = await api.chatDaisy({
          user_id: "local",
          prompt, system_context: systemContext,
          model_ids: selectedModels,
          rounds,
          session_id: curSession.id,
          use_emergent_for: emergentList,
        });
        setTranscript(t => [...t, { role: "assistant", panels: r.steps, ts: new Date().toISOString(), kind: "daisy" }]);
      }
      setPrompt("");
      setDraftId(null);
      setDraftStatus("idle");
    } catch (e) {
      setTranscript(t => [...t, { role: "assistant", panels: [{ model_id: "error", content: "", error: e?.response?.data?.detail || e.message }], ts: new Date().toISOString() }]);
    } finally {
      setBusy(false);
    }
  }

  async function synthesizeLast() {
    const last = [...transcript].reverse().find(t => t.role === "assistant" && t.kind === "fanout");
    if (!last) { alert("no fan-out responses to synthesize"); return; }
    setBusy(true);
    try {
      const r = await api.chatSynthesize({
        user_id: "local",
        prompt: [...transcript].reverse().find(t => t.role === "user")?.content || "",
        responses: last.panels,
        synth_model: synthModel,
        use_emergent_for: emergentList,
      });
      setTranscript(t => [...t, { role: "assistant", panels: [{ model_id: `synth(${synthModel})`, content: r.synthesis.content, usage: r.synthesis.usage, error: r.synthesis.error }], ts: new Date().toISOString(), kind: "synthesis" }]);
    } catch (e) {
      alert("synth failed: " + e.message);
    } finally { setBusy(false); }
  }

  function toggleModel(id) {
    setSelectedModels(xs => xs.includes(id) ? xs.filter(x => x !== id) : [...xs, id]);
  }

  // ---- inventory grouped
  const inventoryByProvider = useMemo(() => {
    const g = {};
    for (const m of inventory) {
      const head = m.provider === "emergent" ? `emergent (→ ${m.via || "?"})` : m.provider;
      if (!g[head]) g[head] = [];
      g[head].push(m);
    }
    return g;
  }, [inventory]);

  return (
    <div className="space-y-4" data-testid="page-workspace">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-mono text-2xl tracking-tighter">Workspace</h1>
          <p className="text-neutral-400 text-sm mt-1">
            Multi-model chat · markdown + LaTeX/arXiv · editable context per session · prompt drafts autosaved.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Pill tone={draftStatus === "saved" ? "emerald" : draftStatus === "saving" ? "amber" : draftStatus === "error" ? "rose" : "default"} testid="draft-status">
            draft :: {draftStatus}
          </Pill>
          <button className="btn-ghost" onClick={newSession} data-testid="ws-new-session">
            <Plus size={14}/> new session
          </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-[260px_1fr] gap-4">
        {/* Sessions sidebar */}
        <aside className="space-y-3">
          <Panel title="sessions">
            <ul className="max-h-[260px] overflow-auto">
              {sessions.map(s => (
                <li key={s.id} className={"group flex items-center justify-between border-b border-white/5 last:border-0 hover:bg-bg-surface " + (session?.id === s.id ? "bg-bg-surface" : "")}>
                  <button onClick={() => loadSession(s.id)} className="flex-1 text-left p-3 text-xs font-mono text-neutral-300" data-testid={`session-load-${s.id}`}>
                    <div className="truncate">{s.title || "untitled"}</div>
                    <div className="text-[0.65rem] text-neutral-500 mt-0.5">{s.turns_count} turns · {s.updated_at?.slice(0,16)?.replace("T", " ")}</div>
                  </button>
                  <button className="opacity-0 group-hover:opacity-100 p-2" onClick={() => deleteSession(s.id)} data-testid={`session-delete-${s.id}`}>
                    <Trash size={14} className="text-accent-rose"/>
                  </button>
                </li>
              ))}
              {!sessions.length && <li className="p-3 text-xs text-neutral-500 font-mono">No sessions yet.</li>}
            </ul>
          </Panel>

          <Panel title="context · editable">
            <div className="p-3 space-y-2">
              <label className="section-overline">system</label>
              <textarea
                className="input-term min-h-[100px] resize-y"
                value={systemContext}
                onChange={e => setSystemContext(e.target.value)}
                data-testid="ws-system-input"
              />
              <label className="section-overline">persona (optional)</label>
              <input
                className="input-term"
                placeholder="e.g. socratic tutor, sceptical reviewer"
                value={persona}
                onChange={e => setPersona(e.target.value)}
                data-testid="ws-persona-input"
              />
              {session && (
                <button
                  className="btn-ghost w-full justify-center"
                  data-testid="ws-context-save"
                  onClick={async () => {
                    await api.updateSession(session.id, {
                      user_id: "local",
                      title: session.title,
                      system_context: systemContext,
                      persona,
                      selected_models: selectedModels,
                    });
                    setSession({...session, system_context: systemContext, persona, selected_models: selectedModels});
                  }}
                ><FloppyDiskBack size={14}/> save context</button>
              )}
            </div>
          </Panel>

          <Panel title="emergent routing">
            <div className="p-3 space-y-1 text-xs font-mono">
              {["openai","anthropic","gemini","xai"].map(p => (
                <label key={p} className="flex items-center justify-between gap-2 cursor-pointer">
                  <span className="text-neutral-400">{p}</span>
                  <input
                    type="checkbox"
                    checked={!!useEmergentFor[p]}
                    onChange={e => setUseEmergentFor(s => ({...s, [p]: e.target.checked}))}
                    data-testid={`ws-em-toggle-${p}`}
                  />
                </label>
              ))}
              <div className="text-[0.65rem] text-neutral-500 mt-2 font-sans leading-tight">
                checked = route requests to that provider through the Emergent universal key (testing / no-BYOK).
                xAI is not supported by Emergent — add a BYOK key.
              </div>
            </div>
          </Panel>
        </aside>

        {/* Main chat column */}
        <div className="space-y-4">
          {/* Mode + model picker */}
          <Panel title="run config">
            <div className="p-4 space-y-3">
              <div className="flex flex-wrap gap-2">
                {MODES.map(m => (
                  <button key={m.id}
                    className={"btn-ghost " + (mode === m.id ? "active" : "")}
                    onClick={() => setMode(m.id)}
                    data-testid={`mode-${m.id}`}>{m.label}</button>
                ))}
                {mode === "daisy" && (
                  <div className="flex items-center gap-2">
                    <span className="section-overline">rounds</span>
                    <input type="number" min={1} max={6} value={rounds}
                      onChange={e => setRounds(Math.max(1, Math.min(6, parseInt(e.target.value || "1", 10))))}
                      className="input-term w-16" data-testid="ws-rounds"/>
                  </div>
                )}
              </div>

              <div className="border border-white/10">
                <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between">
                  <span className="section-overline">models · {selectedModels.length} selected</span>
                  <button className="btn-ghost py-1 px-2 text-[0.65rem]" onClick={() => setSelectedModels([])} data-testid="ws-clear-models">clear</button>
                </div>
                <div className="p-3 max-h-[240px] overflow-auto space-y-3">
                  {Object.entries(inventoryByProvider).map(([prov, ms]) => (
                    <div key={prov}>
                      <div className="text-[0.65rem] tracking-ultra uppercase text-accent-cyan mb-1">{prov}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {ms.map(m => {
                          const id = toModelId(m);
                          const sel = selectedModels.includes(id);
                          return (
                            <button key={id}
                              onClick={() => toggleModel(id)}
                              className={"text-[0.7rem] font-mono px-2 py-1 border " + (sel ? "border-accent-cyan text-accent-cyan bg-bg-deep" : "border-white/10 text-neutral-400 hover:border-white/40")}
                              data-testid={`model-toggle-${id}`}
                              title={id}>
                              {sel ? "● " : "○ "}{m.id || id}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  {!inventory.length && <div className="text-xs text-neutral-500 font-mono">No inventory loaded. Add a BYOK key or use Emergent routing.</div>}
                </div>
              </div>
            </div>
          </Panel>

          {/* Transcript */}
          <Panel title={`transcript · ${session?.title || "ephemeral"}`}
            right={busy ? <AsciiLoader label={mode}/> : <Pill tone="default">{mode}</Pill>}>
            <div className="p-3 space-y-3 max-h-[55vh] overflow-auto" data-testid="ws-transcript">
              {transcript.map((t, idx) => (
                <TranscriptRow key={idx}
                  turn={t}
                  carouselIdx={carouselIdx}
                  setCarouselIdx={setCarouselIdx}/>
              ))}
              {!transcript.length && (
                <div className="text-xs text-neutral-500 font-mono p-2">
                  Empty transcript. Pick models, write a prompt, hit send.
                </div>
              )}
            </div>
          </Panel>

          {/* Composer */}
          <Panel title="compose">
            <div className="p-3 space-y-2">
              <textarea
                className="input-term min-h-[100px] resize-y"
                placeholder="Write your prompt… Markdown + LaTeX OK ($...$ inline, $$...$$ block). cmd/ctrl+enter to send."
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => {
                  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") send();
                }}
                data-testid="ws-prompt-input"
              />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button className="btn-primary" onClick={send} disabled={busy} data-testid="ws-send-btn">
                    <PaperPlaneTilt size={14}/> send
                  </button>
                  {mode === "fanout" && (
                    <>
                      <button className="btn-amber" onClick={synthesizeLast} disabled={busy} data-testid="ws-synth-btn">
                        <Sparkle size={14}/> synthesize
                      </button>
                      <select className="input-term w-auto" value={synthModel} onChange={e => setSynthModel(e.target.value)} data-testid="ws-synth-model">
                        {selectedModels.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </>
                  )}
                </div>
                <div className="text-[0.65rem] text-neutral-500 font-mono">cmd/ctrl+enter</div>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function TranscriptRow({ turn, carouselIdx, setCarouselIdx }) {
  if (turn.role === "user") {
    return (
      <div className="p-3 bg-bg-deep border-l-2 border-accent-amber" data-testid="turn-user">
        <div className="section-overline">user</div>
        <div className="mt-1 whitespace-pre-wrap text-sm">{turn.content}</div>
      </div>
    );
  }
  if (turn.kind === "fanout") {
    return <FanoutCarousel panels={turn.panels} carouselIdx={carouselIdx} setCarouselIdx={setCarouselIdx} />;
  }
  if (turn.kind === "daisy") {
    return (
      <div className="space-y-2" data-testid="turn-daisy">
        <div className="section-overline text-accent-cyan">daisy-chain ↓</div>
        {turn.panels.map((p, i) => (
          <div key={i} className="border-l-2 border-accent-cyan pl-3">
            <div className="flex items-center gap-2 mb-1">
              <Pill tone="cyan">step {p.step ?? i+1}</Pill>
              <Pill>{p.model_id}</Pill>
              {p.usage?.total ? <Pill tone="amber">{p.usage.total} tok</Pill> : null}
            </div>
            {p.error ? <div className="text-xs text-accent-rose font-mono">{p.error}</div> : <MarkdownView>{p.content}</MarkdownView>}
            {i < turn.panels.length - 1 && <div className="font-mono text-neutral-700 text-xs ml-1 my-1">│</div>}
          </div>
        ))}
      </div>
    );
  }
  if (turn.kind === "synthesis") {
    const p = turn.panels[0];
    return (
      <div className="border border-accent-amber/40 bg-amber-500/[0.04] p-3" data-testid="turn-synthesis">
        <div className="flex items-center gap-2 mb-1">
          <Pill tone="amber">synthesis</Pill>
          <Pill>{p.model_id}</Pill>
        </div>
        {p.error ? <div className="text-xs text-accent-rose font-mono">{p.error}</div> : <MarkdownView>{p.content}</MarkdownView>}
      </div>
    );
  }
  // single
  const p = turn.panels[0];
  return (
    <div className="border-l-2 border-accent-cyan pl-3" data-testid="turn-assistant">
      <div className="flex items-center gap-2 mb-1">
        <Pill tone="cyan">{p.model_id}</Pill>
        {p.usage?.total ? <Pill tone="amber">{p.usage.total} tok</Pill> : null}
      </div>
      {p.error ? <div className="text-xs text-accent-rose font-mono">{p.error}</div> : <MarkdownView>{p.content}</MarkdownView>}
    </div>
  );
}

function FanoutCarousel({ panels, carouselIdx, setCarouselIdx }) {
  const total = panels.length;
  const idx = Math.min(carouselIdx, total - 1);
  const cur = panels[idx];
  return (
    <div data-testid="turn-fanout">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Pill tone="amber">fan-out · {total} responses</Pill>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost py-1 px-2" onClick={() => setCarouselIdx(Math.max(0, idx - 1))} disabled={idx === 0} data-testid="fanout-prev">
            <CaretLeft size={14}/>
          </button>
          <span className="font-mono text-xs">{idx+1}/{total}</span>
          <button className="btn-ghost py-1 px-2" onClick={() => setCarouselIdx(Math.min(total-1, idx + 1))} disabled={idx === total - 1} data-testid="fanout-next">
            <CaretRight size={14}/>
          </button>
        </div>
      </div>

      {/* Mobile: stacked. Desktop: horizontal scroll-snap carousel */}
      <div className="md:hidden border-l-2 border-accent-cyan pl-3">
        <div className="flex items-center gap-2 mb-1">
          <Pill tone="cyan">{cur.model_id}</Pill>
          {cur.usage?.total ? <Pill tone="amber">{cur.usage.total} tok</Pill> : null}
        </div>
        {cur.error ? <div className="text-xs text-accent-rose font-mono">{cur.error}</div> : <MarkdownView>{cur.content}</MarkdownView>}
      </div>

      <div className="hidden md:flex snap-track overflow-x-auto gap-3 pb-2" data-testid="fanout-carousel">
        {panels.map((p, i) => (
          <div key={i}
               className={"snap-card min-w-[340px] max-w-[420px] flex-shrink-0 border " + (i === idx ? "border-accent-cyan" : "border-white/10") + " bg-bg-deep p-3"}>
            <div className="flex items-center gap-2 mb-1">
              <Pill tone={i === idx ? "cyan" : "default"}>{p.model_id}</Pill>
              {p.usage?.total ? <Pill tone="amber">{p.usage.total} tok</Pill> : null}
            </div>
            {p.error
              ? <div className="text-xs text-accent-rose font-mono">{p.error}</div>
              : <div className="max-h-[360px] overflow-auto"><MarkdownView>{p.content}</MarkdownView></div>}
          </div>
        ))}
      </div>
    </div>
  );
}
