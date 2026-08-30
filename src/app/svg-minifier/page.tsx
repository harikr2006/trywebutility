"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { minifySvg } from "@/lib/tools/svg-minifier";

function isSafeSvg(svg: string): boolean {
  return !/(<script|javascript:|on\w+\s*=)/i.test(svg);
}

export default function SvgMinifierPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    originalBytes: number;
    minifiedBytes: number;
  } | null>(null);

  function handleMinify() {
    const result = minifySvg(input);
    if (result.error) {
      setError(result.error);
      setOutput("");
      setStats(null);
    } else {
      setError(null);
      setOutput(result.output);
      if (result.originalBytes > 0) {
        setStats({
          originalBytes: result.originalBytes,
          minifiedBytes: result.minifiedBytes,
        });
      } else {
        setStats(null);
      }
    }
  }

  function handleClear() {
    setInput("");
    setOutput("");
    setError(null);
    setStats(null);
  }

  const reduction =
    stats && stats.originalBytes > 0
      ? Math.round(
          ((stats.originalBytes - stats.minifiedBytes) / stats.originalBytes) *
            100
        )
      : 0;

  const showPreview = output && isSafeSvg(output);

  return (
    <ToolShell
      title="SVG Minifier"
      description="Remove comments, metadata, and whitespace from SVG files to reduce file size."
    >
      <div className="space-y-4">
        {/* Stats bar */}
        {stats && (
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-xs">
            <span className="text-muted-foreground">Original:</span>
            <span className="font-mono font-semibold">{stats.originalBytes.toLocaleString()} bytes</span>
            <span className="text-muted-foreground">→</span>
            <span className="text-muted-foreground">Minified:</span>
            <span className="font-mono font-semibold">{stats.minifiedBytes.toLocaleString()} bytes</span>
            <span className="rounded bg-green-500/15 px-1.5 py-0.5 font-semibold text-green-700 dark:text-green-400">
              {reduction}% reduction
            </span>
          </div>
        )}

        {/* Two-column layout */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              SVG Input
            </label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your SVG markup here..."
              className="font-mono text-[13px] min-h-72 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Minified Output
              </label>
              {output && <CopyButton text={output} />}
            </div>
            <Textarea
              value={output}
              readOnly
              placeholder="Minified SVG will appear here..."
              className="font-mono text-[13px] min-h-72 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button size="sm" className="h-8" onClick={handleMinify}>
            Minify
          </Button>
          <Button size="sm" className="h-8" variant="outline" onClick={handleClear}>
            Clear
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* SVG preview */}
        {showPreview && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Preview
            </label>
            <div
              className="flex min-h-24 items-center justify-center rounded-lg border border-border/60 bg-muted/20 p-4"
              dangerouslySetInnerHTML={{ __html: output }}
            />
          </div>
        )}
      </div>
    </ToolShell>
  );
}
