"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { hashText } from "@/lib/tools/hash";

type Algorithm = "MD5" | "SHA-1" | "SHA-256" | "SHA-512";
const ALGORITHMS: Algorithm[] = ["MD5", "SHA-1", "SHA-256", "SHA-512"];

export default function HashGeneratorPage() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedAlgos, setSelectedAlgos] = useState<Set<Algorithm>>(
    new Set(ALGORITHMS)
  );

  function toggleAlgo(algo: Algorithm) {
    setSelectedAlgos((prev) => {
      const next = new Set(prev);
      if (next.has(algo)) {
        if (next.size > 1) next.delete(algo);
      } else {
        next.add(algo);
      }
      return next;
    });
  }

  async function handleGenerate() {
    if (!input.trim()) {
      setError("Please enter some text to hash.");
      return;
    }
    setError(null);
    setLoading(true);
    const newResults: Record<string, string> = {};
    for (const algo of selectedAlgos) {
      try {
        const hash = await hashText(input, algo as "MD5" | "SHA-1" | "SHA-256" | "SHA-512");
        newResults[algo] = hash;
      } catch { /* skip failed algo */ }
    }
    setResults(newResults);
    setLoading(false);
  }

  return (
    <ToolShell
      title="Hash Generator"
      description="Generate cryptographic hashes using MD5, SHA-1, SHA-256, and SHA-512 algorithms."
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Input Text
          </label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to hash..."
            className="font-mono text-[13px] min-h-32 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Algorithms
          </label>
          <div className="flex flex-wrap gap-2">
            {ALGORITHMS.map((algo) => (
              <Button
                key={algo}
                size="sm"
                className="h-8"
                variant={selectedAlgos.has(algo) ? "default" : "outline"}
                onClick={() => toggleAlgo(algo)}
              >
                {algo}
              </Button>
            ))}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button
          size="sm"
          className="h-8"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Hashes"}
        </Button>

        {Object.keys(results).length > 0 && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Results
            </label>
            <div className="space-y-2">
              {ALGORITHMS.filter((algo) => results[algo] !== undefined).map(
                (algo) => (
                  <div
                    key={algo}
                    className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/20 p-3"
                  >
                    <span className="shrink-0 rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                      {algo}
                    </span>
                    <span className="flex-1 break-all font-mono text-xs text-foreground">
                      {results[algo]}
                    </span>
                    <CopyButton text={results[algo]} />
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}

