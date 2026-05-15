// 178:4
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Sparkles, ChevronDown, ChevronUp, Loader2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const MODELS = [
  { id: "gemini",        label: "Gemini 2.5 Flash" },
  { id: "gemini3",       label: "Gemini 3 Pro" },
  { id: "grok",          label: "Grok-4 Fast" },
  { id: "claude",        label: "Claude Sonnet 4.5" },
  { id: "openai",        label: "GPT-5 mini" },
  { id: "openai-5.5",    label: "GPT-5.5" },
];

interface GenerateResult {
  content: string;
  model: string;
  usage: {
    input_tokens?: number;
    output_tokens?: number;
    total_tokens?: number;
    cost_usd?: number;
  };
}

function TokenRow({ usage }: { usage: GenerateResult["usage"] }) {
  const inp = usage.input_tokens ?? 0;
  const out = usage.output_tokens ?? usage.total_tokens ?? 0;
  const cost = usage.cost_usd;
  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
      <span data-testid="generate-tokens-in">↑ {inp.toLocaleString()} in</span>
      <span data-testid="generate-tokens-out">↓ {out.toLocaleString()} out</span>
      {cost !== undefined && (
        <span data-testid="generate-cost">${cost.toFixed(5)}</span>
      )}
    </div>
  );
}

export default function GenerateTab() {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [system, setSystem] = useState("");
  const [model, setModel] = useState("gemini");
  const [maxTokens, setMaxTokens] = useState(2048);
  const [showSystem, setShowSystem] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateMut = useMutation<GenerateResult, Error, void>({
    mutationFn: () =>
      apiRequest("POST", "/api/v1/generate", {
        prompt: prompt.trim(),
        model,
        system: system.trim() || undefined,
        max_tokens: maxTokens,
      }),
    onError: (err) =>
      toast({ title: "Generation failed", description: err.message, variant: "destructive" }),
  });

  const result: GenerateResult | undefined = generateMut.data as GenerateResult | undefined;

  function handleCopy() {
    if (!result?.content) return;
    navigator.clipboard.writeText(result.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-4" data-testid="generate-tab">

      {/* Header */}
      <div className="flex items-center gap-2 shrink-0">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Generate</h2>
        <span className="text-xs text-muted-foreground">single-turn · a0(zfae)zfae</span>
      </div>

      {/* Config row */}
      <div className="flex items-center gap-2 shrink-0 flex-wrap">
        <Select value={model} onValueChange={setModel}>
          <SelectTrigger className="w-44 h-8 text-xs" data-testid="generate-model-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MODELS.map((m) => (
              <SelectItem key={m.id} value={m.id} className="text-xs">
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={String(maxTokens)} onValueChange={(v) => setMaxTokens(Number(v))}>
          <SelectTrigger className="w-28 h-8 text-xs" data-testid="generate-max-tokens-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[256, 512, 1024, 2048, 4096, 8000].map((n) => (
              <SelectItem key={n} value={String(n)} className="text-xs">{n} tok</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <button
          type="button"
          onClick={() => setShowSystem((v) => !v)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          data-testid="generate-toggle-system"
        >
          {showSystem ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          system
        </button>
      </div>

      {/* System prompt */}
      {showSystem && (
        <Textarea
          value={system}
          onChange={(e) => setSystem(e.target.value)}
          placeholder="Optional system prompt…"
          className="shrink-0 resize-none text-xs font-mono h-24"
          data-testid="generate-system-input"
        />
      )}

      {/* Prompt */}
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt…"
        className="flex-1 min-h-32 resize-none text-sm"
        data-testid="generate-prompt-input"
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && !generateMut.isPending && prompt.trim()) {
            generateMut.mutate();
          }
        }}
      />

      {/* Submit */}
      <Button
        onClick={() => generateMut.mutate()}
        disabled={!prompt.trim() || generateMut.isPending}
        className="shrink-0 w-full"
        data-testid="generate-submit-btn"
      >
        {generateMut.isPending ? (
          <><Loader2 className="h-4 w-4 animate-spin mr-2" />Generating…</>
        ) : (
          <><Sparkles className="h-4 w-4 mr-2" />Generate<span className="ml-2 text-xs opacity-60">⌘↵</span></>
        )}
      </Button>

      {/* Result */}
      {result && (
        <Card className="shrink-0" data-testid="generate-result-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <span>Output</span>
              <Badge variant="outline" className="text-xs font-mono">{result.model}</Badge>
              <div className="ml-auto flex items-center gap-2">
                <TokenRow usage={result.usage} />
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 shrink-0"
                  onClick={handleCopy}
                  data-testid="generate-copy-btn"
                  title="Copy output"
                >
                  {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre
              className="whitespace-pre-wrap break-words text-sm font-mono leading-relaxed"
              data-testid="generate-result-text"
            >
              {result.content}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Error already toasted; surface inline too */}
      {generateMut.isError && (
        <p className="text-xs text-destructive shrink-0" data-testid="generate-error">
          {generateMut.error?.message}
        </p>
      )}
    </div>
  );
}
// 178:4
