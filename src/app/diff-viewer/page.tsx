"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { diffTexts, diffStats, type DiffLine } from "@/lib/tools/text-diff";

export default function DiffViewerPage() {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [diff, setDiff] = useState<DiffLine[] | null>(null);
  const [stats, setStats] = useState<{ added: number; removed: number; unchanged: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = () => {
    try {
      const lines = diffTexts(original, modified);
      setDiff(lines);
      setStats(diffStats(lines));
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to compute diff.");
      setDiff(null);
      setStats(null);
    }
  };

  const handleClear = () => {
    setOriginal("");
    setModified("");
    setDiff(null);
    setStats(null);
    setError(null);
  };

  return (
    <ToolShell title="Diff Viewer" description="Compare two text blocks side by side and highlight added, removed, and unchanged lines.">
      <div className="space-y-5">
        {/* Two textareas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Original</label>
            <Textarea
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              placeholder="Paste original text here..."
              className="font-mono text-[13px] min-h-48 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Modified</label>
            <Textarea
              value={modified}
              onChange={(e) => setModified(e.target.value)}
              placeholder="Paste modified text here..."
              className="font-mono text-[13px] min-h-48 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button size="sm" className="h-8" onClick={handleCompare}>
            Compare
          </Button>
          <Button size="sm" variant="outline" className="h-8" onClick={handleClear}>
            Clear
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="flex gap-2 rounded-lg border border-destructive/40 bg-destructive/8 p-3 text-sm text-destructive font-mono">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Stats row */}
        {stats && (
          <div className="flex gap-2 flex-wrap">
            <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 px-3 py-1 text-xs font-semibold">
              +{stats.added} added
            </span>
            <span className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 px-3 py-1 text-xs font-semibold">
              -{stats.removed} removed
            </span>
            <span className="inline-flex items-center rounded-full bg-muted text-muted-foreground px-3 py-1 text-xs font-semibold">
              {stats.unchanged} unchanged
            </span>
          </div>
        )}

        {/* Diff output */}
        {diff && diff.length > 0 && (
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Diff Output</label>
            <div className="mt-2 rounded-lg border border-border/60 overflow-auto max-h-[480px]">
              {diff.map((line, i) => (
                <div
                  key={i}
                  className={cn(
                    "font-mono text-xs whitespace-pre-wrap px-3 py-0.5 leading-5",
                    line.added && "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
                    line.removed && "bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300",
                    !line.added && !line.removed && "text-foreground/70"
                  )}
                >
                  {line.added ? "+ " : line.removed ? "- " : "  "}
                  {line.value}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
