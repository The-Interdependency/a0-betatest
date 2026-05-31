import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Panel, Pill, Stat, AsciiLoader } from "../components/Panel";
import { Heart, ArrowsClockwise } from "@phosphor-icons/react";

const RINGS = ["phi", "psi", "omega", "theta", "sigma", "epsilon"];
const RING_NAMES = {
  phi: "Φ · phi (primary intent)",
  psi: "Ψ · psi (substrate)",
  omega: "Ω · omega (broadcast)",
  theta: "Θ · theta (phase)",
  sigma: "Σ · sigma (sub-encoding)",
  epsilon: "Ε · epsilon (dissonance)",
};

export default function InspectorPage() {
  const [snap, setSnap] = useState(null);
  const [intent, setIntent] = useState("");
  const [busy, setBusy] = useState(false);
  const [skill, setSkill] = useState(null);

  async function load() {
    const [r, s] = await Promise.all([api.inspectorSnap(), api.skillReport("CAPABILITIES")]);
    setSnap(r.agent_card?.snapshot || null);
    setSkill(s);
  }
  useEffect(() => { load(); }, []);

  async function beat() {
    setBusy(true);
    try {
      await api.inspectorBeat(intent || null);
      await load();
    } finally { setBusy(false); }
  }

  return (
    <div className="space-y-6" data-testid="page-inspector">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-mono text-2xl tracking-tighter">PCNA · Inference Engine Inspector</h1>
          <p className="text-neutral-400 text-sm mt-1 max-w-2xl">
            Read-only view of the six-ring engine (Φ Ψ Ω Θ Σ Ε), three 157-seed PTCA cores (phi / psi / omega),
            EDCM scores, Memory-L (N=19) and Memory-S (N=17) caches. Trigger a heartbeat to advance the tick.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost" onClick={load} data-testid="insp-refresh"><ArrowsClockwise size={14}/> refresh</button>
        </div>
      </header>

      <div
        className="relative border border-white/10 bg-bg-panel overflow-hidden"
        style={{
          backgroundImage: "url(https://static.prod-images.emergentagent.com/jobs/c2d14c10-eaf9-49ca-ad1e-339f5025b355/images/7d0ec2e194e2ca69f7eed061da0f99511eec16722c64735fbb67d3520a66f11f.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative p-6 grid md:grid-cols-3 gap-4">
          {RINGS.map(k => (
            <div key={k} className="border border-white/15 bg-black/50 p-4">
              <div className="section-overline">{RING_NAMES[k]}</div>
              <div className="font-mono text-3xl text-accent-cyan mt-1" data-testid={`ring-${k}`}>
                {(snap?.ring_signals?.[k] ?? 0).toFixed(4)}
              </div>
              <div className="mt-2 h-1 bg-white/10">
                <div className="h-full bg-accent-cyan" style={{width: `${Math.min(100, ((snap?.ring_signals?.[k] ?? 0) * 100)).toFixed(1)}%`}}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-3">
        <Stat label="tick count"      value={snap?.tick_count ?? 0} tone="cyan"/>
        <Stat label="n primes (cores)" value={snap?.n_primes ?? 157} tone="amber"/>
        <Stat label="memory · lt"     value={(snap?.memory?.lt_capacity ?? 19) + " cap"} tone="emerald"/>
        <Stat label="memory · st"     value={(snap?.memory?.st_capacity ?? 17) + " cap"} tone="emerald"/>
      </div>

      <Panel title="heartbeat" right={busy ? <AsciiLoader label="pulsing"/> : null}>
        <div className="p-4 flex flex-col md:flex-row gap-2 items-stretch md:items-center">
          <input className="input-term flex-1"
                 placeholder="optional intent (drives phi/sigma)…"
                 value={intent}
                 onChange={e => setIntent(e.target.value)}
                 data-testid="insp-intent-input"/>
          <button className="btn-primary" onClick={beat} disabled={busy} data-testid="insp-beat-btn">
            <Heart size={14}/> heartbeat
          </button>
        </div>
      </Panel>

      <Panel title="ptca cores · 3 × 157 primes">
        <div className="p-4 grid md:grid-cols-3 gap-3">
          {snap?.cores && Object.entries(snap.cores).map(([k, c]) => (
            <div key={k} className="border border-white/10 bg-bg-deep p-3" data-testid={`core-${k}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-accent-cyan text-sm">core · {k}</span>
                <Pill tone="cyan">{c.tensor.n_primes} primes</Pill>
              </div>
              <div className="font-mono text-[0.7rem] space-y-1 text-neutral-300">
                <div>shape :: [{c.tensor.shape.join(", ")}]</div>
                <div>energy :: <span className="text-accent-amber">{c.tensor.energy}</span></div>
                <div>head :: {c.tensor.primes_head.join(", ")}…</div>
                <div>tail :: …{c.tensor.primes_tail.join(", ")}</div>
                <div>lineage :: {c.lineage_depth}</div>
                <div>head_hash :: <span className="text-neutral-500">{c.lineage_head?.slice(0, 16) || "—"}</span></div>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="msdmd · skill coverage"
        right={skill ? <Pill tone={skill.gaps_count ? "rose" : "emerald"} testid="skill-status">
          {skill.gaps_count ? `${skill.gaps_count} gap(s)` : "100% covered"}
        </Pill> : <Pill>loading</Pill>}>
        <div className="p-4 space-y-3" data-testid="skill-panel">
          <div className="text-xs text-neutral-400 font-sans leading-relaxed max-w-3xl">
            Every <span className="text-accent-cyan font-mono">.py</span> file under <span className="font-mono">/app/backend</span> must
            declare a <span className="text-accent-cyan font-mono">CAPABILITIES</span> block. The runner walks the tree, parses every block,
            and reports per-file entries plus a gap list. Gaps must stay visible (the doctrine — see <span className="font-mono">interdependent_lib/_msdmd/SKILL.md</span>).
          </div>
          <div className="grid grid-cols-3 gap-2 font-mono text-xs">
            <div className="border border-white/10 bg-bg-deep p-3">
              <div className="section-overline">scanned</div>
              <div className="text-2xl text-white" data-testid="skill-scanned">{skill?.scanned ?? "—"}</div>
            </div>
            <div className="border border-white/10 bg-bg-deep p-3">
              <div className="section-overline">covered</div>
              <div className="text-2xl text-accent-emerald" data-testid="skill-covered">{skill?.covered ?? "—"}</div>
            </div>
            <div className="border border-white/10 bg-bg-deep p-3">
              <div className="section-overline">gaps</div>
              <div className={"text-2xl " + ((skill?.gaps_count ?? 0) > 0 ? "text-accent-rose" : "text-accent-emerald")}
                data-testid="skill-gaps-count">{skill?.gaps_count ?? "—"}</div>
            </div>
          </div>
          {(skill?.gaps || []).length > 0 ? (
            <div className="border border-accent-rose/40 bg-rose-500/5 p-3 text-xs font-mono">
              <div className="text-accent-rose mb-2">{skill.gaps.length} module(s) missing the CAPABILITIES block:</div>
              <ul className="space-y-0.5">
                {skill.gaps.map(g => <li key={g} className="text-neutral-300">· {g}</li>)}
              </ul>
            </div>
          ) : (
            <div className="text-xs font-mono text-accent-emerald">
              ✓ no gaps · 100 % module compliance
            </div>
          )}
          <details className="text-xs font-mono">
            <summary className="cursor-pointer text-neutral-400 hover:text-white">
              show all {skill ? Object.values(skill.by_file).flat().length : 0} entries
            </summary>
            <div className="mt-2 max-h-[300px] overflow-auto border border-white/5 bg-bg-deep p-2 space-y-1">
              {skill && Object.entries(skill.by_file).map(([f, entries]) => (
                entries.length > 0 && (
                  <div key={f}>
                    <div className="text-accent-cyan">{f}</div>
                    {entries.map(e => (
                      <div key={e.id} className="pl-4 text-neutral-400">
                        · <span className="text-white">{e.id}</span>{e.summary ? ` — ${e.summary}` : ""}
                      </div>
                    ))}
                  </div>
                )
              ))}
            </div>
          </details>
        </div>
      </Panel>

      <div className="grid md:grid-cols-2 gap-4">
        <Panel title="EDCM · latest scores">
          <div className="p-4 grid grid-cols-2 gap-2 font-mono text-xs">
            {snap?.edcm_latest && Object.entries(snap.edcm_latest).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between border border-white/5 px-3 py-2 bg-bg-deep" data-testid={`edcm-${k}`}>
                <span className="text-neutral-400">{k.toUpperCase()}</span>
                <span className="text-accent-cyan">{Number(v).toFixed(4)}</span>
              </div>
            ))}
            {!snap?.edcm_latest && <div className="text-neutral-500">no edcm scores yet · trigger a heartbeat</div>}
          </div>
        </Panel>

        <Panel title="memory snapshot">
          <div className="p-4 font-mono text-xs space-y-3">
            <div>
              <div className="section-overline">long-term (N={snap?.memory?.lt_capacity})</div>
              <ul className="mt-1 space-y-0.5">
                {(snap?.memory?.lt || []).slice(-8).map((m, i) => <li key={i} className="text-neutral-300">· {m}</li>)}
                {!(snap?.memory?.lt || []).length && <li className="text-neutral-500">— empty —</li>}
              </ul>
            </div>
            <div>
              <div className="section-overline">short-term (N={snap?.memory?.st_capacity})</div>
              <ul className="mt-1 space-y-0.5">
                {(snap?.memory?.st || []).slice(-8).map((m, i) => <li key={i} className="text-neutral-300">· {m}</li>)}
                {!(snap?.memory?.st || []).length && <li className="text-neutral-500">— empty —</li>}
              </ul>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
