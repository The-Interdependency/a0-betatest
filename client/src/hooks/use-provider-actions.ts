// 58:1
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const PROVIDERS_KEY = "/api/v1/energy/providers";

export function useProviderActions(providerId: string, providerLabel: string) {
  const qc = useQueryClient();
  const { toast } = useToast();

  function invalidate() {
    qc.invalidateQueries({ queryKey: [PROVIDERS_KEY] });
  }

  const patchSeed = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      apiRequest("PATCH", `/api/v1/energy/providers/${providerId}/route-config`, body),
    onSuccess: () => {
      invalidate();
      toast({ title: `${providerLabel} updated` });
    },
    onError: (e: Error) => toast({ title: "Patch failed", description: e.message, variant: "destructive" }),
  });

  const applyPreset = useMutation({
    mutationFn: (preset: string) =>
      apiRequest("PATCH", `/api/v1/energy/providers/${providerId}/route-config`, { active_preset: preset }),
    onSuccess: () => {
      invalidate();
      toast({ title: `Preset applied` });
    },
    onError: (e: Error) => toast({ title: "Preset failed", description: e.message, variant: "destructive" }),
  });

  const refreshPricing = useMutation({
    mutationFn: () =>
      apiRequest("POST", `/api/v1/energy/providers/${providerId}/refresh-pricing`, {}),
    onSuccess: () => {
      invalidate();
      toast({ title: `Pricing refreshed for ${providerLabel}` });
    },
    onError: (e: Error) => toast({ title: "Refresh failed", description: e.message, variant: "destructive" }),
  });

  const discoverModels = useMutation({
    mutationFn: () =>
      apiRequest("POST", `/api/v1/energy/providers/${providerId}/discover`, {}),
    onSuccess: (data: { added: number; total: number }) => {
      invalidate();
      toast({ title: `Discovered models for ${providerLabel}`, description: `+${data.added} new · ${data.total} total` });
    },
    onError: (e: Error) => toast({ title: "Discovery failed", description: e.message, variant: "destructive" }),
  });

  return { patchSeed, applyPreset, refreshPricing, discoverModels };
}
// 58:1
