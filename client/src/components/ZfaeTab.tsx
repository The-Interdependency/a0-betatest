// 298:6
import { useQuery } from "@tanstack/react-query";
import { Zap, Loader2, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQueryClient } from "@tanstack/react-query";

// ── Types ────────────────────────────────────────────────────────────────────

interface CoreState {
  name: string; symbol: string; n: number; seed: number;
  ring_coherence: number; node_coherence_mean: number;
  tensor_mean: number; tensor_std: number;
  step_count: number; last_reward: number;
  node_coherence: number[];
}

interface PrimeSeedsResponse {
  state: {
    cores: Record<string, CoreState>;
    tick_count: number;
    last_lt_promotion: number | null;
    uptime_s: number;
  };
  memory_context: {
    lt: { n: number; ring_coherence: number; hub_mean: number; tensor_mean: number };
    st: { n: number; ring_coherence: number; hub_mean: number; tensor_mean: number };
  };
}

interface EchoEntry {
  provider: string; coherence: number; resolution: number;
  cm: number; da: number; drift: number;
}

interface EchoResponse {
  agent: string; eval_count: number;
  echo_history: EchoEntry[];
}

// ── Sub-components ────────────────────────────────────────────────────────────

function CoherenceBar({ value, size = "md" }: { value: number; size?: "sm" | "md" }) {
  const pct = Math.round(value * 100);
  const color = pct > 75 ? "bg-emerald-500" : pct > 45 ? "bg-yellow-500" : "bg-red-500";
  const h = size === "sm" ? "h-1" : "h-1.5";
  return (
    <div className="flex items-center gap-1.5">
      <div className={`flex-1 ${h} bg-muted rounded-full overflow-hidden`}>
        <div className={`h-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs tabular-nums text-muted-foreground w-8 text-right">{pct}%</span>
    </div>
  );
}

const PRIME_ORDER = [3, 5, 7, 11, 13, 17, 19];

function SeedGrid({ cores, ltPromotion }: {
  cores: Record<string, CoreState>;
  ltPromotion: number | null;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" data-testid="zfae-seed-grid">
      {PRIME_ORDER.map((n) => {
        const c = cores[String(n)];
        if (!c) return null;
        const isLT = n === 19;
        const isST = n === 17;
        return (
          <div
            key={n}
            className={`rounded-md border p-2 text-xs space-y-1.5 ${
              isLT ? "border-primary/40 bg-primary/5" :
              isST ? "border-yellow-500/30 bg-yellow-500/5" :
              "border-border bg-muted/20"
            }`}
            data-testid={`zfae-seed-${n}`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-semibold text-foreground">N={n}</span>
              {isLT && <Badge variant="outline" className="text-[10px] py-0 px-1 text-primary">LT</Badge>}
              {isST && <Badge variant="outline" className="text-[10px] py-0 px-1 text-yellow-600 dark:text-yellow-400">ST</Badge>}
            </div>
            <CoherenceBar value={c.ring_coherence} size="sm" />
            <div className="grid grid-cols-2 gap-x-2 text-muted-foreground">
              <span>mean</span><span className="font-mono text-foreground">{c.tensor_mean.toFixed(3)}</span>
              <span>steps</span><span className="font-mono text-foreground">{c.step_count.toLocaleString()}</span>
              <span>reward</span><span className="font-mono text-foreground">{c.last_reward.toFixed(3)}</span>
            </div>
            {isLT && ltPromotion && (
              <div className="text-[10px] text-muted-foreground">
                promoted {new Date(ltPromotion * 1000).toLocaleTimeString()}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function MemoryTags({ ctx }: { ctx: PrimeSeedsResponse["memory_context"] }) {
  const { lt, st } = ctx;
  const ltTag = lt
    ? `[memory:LT N=${lt.n} coherence=${lt.ring_coherence} hub=${lt.hub_mean} mean=${lt.tensor_mean}]`
    : null;
  const stTag = st
    ? `[memory:ST N=${st.n} coherence=${st.ring_coherence} hub=${st.hub_mean} mean=${st.tensor_mean}]`
    : null;

  return (
    <div className="space-y-2" data-testid="zfae-memory-tags">
      {ltTag && (
        <div>
          <div className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1">
            <Badge variant="outline" className="text-[10px] py-0 px-1 text-primary">LT</Badge>
            injected into prompt cache prefix on every call
          </div>
          <code className="block text-xs font-mono bg-muted/50 rounded px-2 py-1.5 text-primary/80 break-all"
            data-testid="zfae-lt-tag">{ltTag}</code>
        </div>
      )}
      {stTag && (
        <div>
          <div className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1">
            <Badge variant="outline" className="text-[10px] py-0 px-1 text-yellow-600 dark:text-yellow-400">ST</Badge>
            spliced after ## Memory marker — refreshed every 60 s tick
          </div>
          <code className="block text-xs font-mono bg-muted/50 rounded px-2 py-1.5 text-yellow-600/80 dark:text-yellow-400/80 break-all"
            data-testid="zfae-st-tag">{stTag}</code>
        </div>
      )}
      {!ltTag && !stTag && (
        <p className="text-xs text-muted-foreground">No memory tags yet — seeds haven't ticked.</p>
      )}
    </div>
  );
}

function EchoFeed({ echo, evalCount }: { echo: EchoEntry[]; evalCount: number }) {
  return (
    <div className="space-y-1" data-testid="zfae-echo-feed">
      <div className="text-xs text-muted-foreground mb-2">
        {evalCount.toLocaleString()} evaluations total · showing last {echo.length}
      </div>
      {echo.length === 0 && (
        <p className="text-xs text-muted-foreground">No echo events yet.</p>
      )}
      {[...echo].reverse().map((e, i) => (
        <div
          key={i}
          className="flex items-center gap-2 text-xs py-0.5"
          data-testid={`zfae-echo-entry-${i}`}
        >
          <Badge variant="secondary" className="text-[10px] py-0 shrink-0">{e.provider}</Badge>
          <div className="flex-1 min-w-0">
            <CoherenceBar value={e.coherence} size="sm" />
          </div>
          <span className="font-mono text-muted-foreground shrink-0 tabular-nums text-[10px]">
            cm={e.cm?.toFixed(2)} da={e.da?.toFixed(2)} dr={e.drift?.toFixed(2)}
          </span>
          <span className="font-mono text-muted-foreground shrink-0 text-[10px]">r={e.resolution}</span>
        </div>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ZfaeTab() {
  const qc = useQueryClient();

  const { data: ps, isLoading: psLoading } = useQuery<PrimeSeedsResponse>({
    queryKey: ["/api/v1/zfae/prime-seeds"],
    refetchInterval: 30000,
  });

  const { data: echo, isLoading: echoLoading } = useQuery<EchoResponse>({
    queryKey: ["/api/v1/zfae/echo"],
    refetchInterval: 10000,
  });

  const isLoading = psLoading || echoLoading;

  function refresh() {
    qc.invalidateQueries({ queryKey: ["/api/v1/zfae/prime-seeds"] });
    qc.invalidateQueries({ queryKey: ["/api/v1/zfae/echo"] });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40" data-testid="zfae-loading">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const state = ps?.state;
  const ctx = ps?.memory_context;

  return (
    <div className="space-y-4 p-4 overflow-y-auto h-full" data-testid="zfae-tab">

      {/* Header */}
      <div className="flex items-center gap-2 shrink-0">
        <Zap className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">ZFAE</h2>
        <span className="text-xs text-muted-foreground">zeta fun alpha echo · inference engine</span>
        <div className="ml-auto flex items-center gap-3">
          {state && (
            <span className="text-xs text-muted-foreground font-mono">
              tick={state.tick_count} · up={Math.floor(state.uptime_s / 60)}m
            </span>
          )}
          {echo && (
            <span className="text-xs text-muted-foreground font-mono">
              evals={echo.eval_count.toLocaleString()}
            </span>
          )}
          <button
            onClick={refresh}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Refresh"
            data-testid="zfae-refresh-btn"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Prime seeds */}
      {state && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Prime Seeds — 7 PTCA Cores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SeedGrid cores={state.cores} ltPromotion={state.last_lt_promotion} />
          </CardContent>
        </Card>
      )}

      {/* Memory tags */}
      {ctx && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Memory Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MemoryTags ctx={ctx} />
          </CardContent>
        </Card>
      )}

      {/* Alpha echo feed */}
      {echo && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Alpha Echo Feed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EchoFeed echo={echo.echo_history} evalCount={echo.eval_count} />
          </CardContent>
        </Card>
      )}

    </div>
  );
}
// 298:6
