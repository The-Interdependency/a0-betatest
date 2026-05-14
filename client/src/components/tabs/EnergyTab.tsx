// 70:1
import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertTriangle } from "lucide-react";
import { useBillingStatus } from "@/hooks/use-billing-status";
import { ProviderPanel } from "@/components/provider-panel";
import type { Provider } from "@/components/provider-panel";

type ProvidersResponse = { providers: Provider[] };

export default function EnergyTab() {
  const { isAdmin } = useBillingStatus();
  const { data, isLoading, isError, error } = useQuery<ProvidersResponse>({
    queryKey: ["/api/v1/energy/providers"],
    staleTime: 30_000,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48 gap-2 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Loading providers…</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-2 text-destructive">
        <AlertTriangle className="w-5 h-5" />
        <span className="text-sm">{(error as Error).message}</span>
      </div>
    );
  }

  const providers = data?.providers ?? [];
  const available = providers.filter((p) => p.available);
  const unavailable = providers.filter((p) => !p.available);

  return (
    <div className="space-y-8 p-4" data-testid="tab-content-energy">
      {available.length === 0 && (
        <div className="text-sm text-muted-foreground rounded-md border border-dashed border-border p-6 text-center">
          No providers with API keys configured.
        </div>
      )}
      {available.map((p) => (
        <div key={p.id} className="rounded-xl border border-border bg-card/50 p-4">
          <ProviderPanel p={p} isAdmin={isAdmin} />
        </div>
      ))}
      {unavailable.length > 0 && (
        <details className="group">
          <summary className="text-xs text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors list-none flex items-center gap-1">
            <span className="group-open:hidden">▶</span>
            <span className="hidden group-open:inline">▼</span>
            {unavailable.length} provider{unavailable.length !== 1 ? "s" : ""} without API keys
          </summary>
          <div className="mt-4 space-y-4 pl-2 border-l border-border">
            {unavailable.map((p) => (
              <div key={p.id} className="rounded-xl border border-border bg-card/30 p-4 opacity-70">
                <ProviderPanel p={p} isAdmin={isAdmin} />
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
// 70:1
