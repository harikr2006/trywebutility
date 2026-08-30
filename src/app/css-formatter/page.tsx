"use client";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { formatCSS, minifyCSS } from "@/lib/tools/css";

export default function CSSFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function handleFormat() {
    const { output: out, error: err } = formatCSS(input);
    setOutput(out); setError(err ?? "");
  }

  function handleMinify() {
    const { output: out, error: err } = minifyCSS(input);
    setOutput(out); setError(err ?? "");
  }

  function handleClear() {
    setInput("");
    setOutput("");
    setError("");
  }

  return (
    <ToolShell title="CSS Formatter" description="Format or minify CSS stylesheets. All processing in your browser.">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" className="h-8" onClick={handleFormat}>
          Format
        </Button>
        <Button size="sm" className="h-8" onClick={handleMinify}>
          Minify
        </Button>
        <Button size="sm" className="h-8 ml-auto" variant="ghost" onClick={handleClear}>
          Clear
        </Button>
      </div>

      {/* Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center h-7">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Input</label>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste CSS here..."
            className="font-mono text-[13px] min-h-72 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between h-7">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Output</label>
            <CopyButton text={output} />
          </div>
          {error ? (
            <div className="flex gap-2 rounded-lg border border-destructive/40 bg-destructive/8 p-3 text-sm text-destructive font-mono min-h-72">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          ) : (
            <Textarea
              readOnly
              value={output}
              placeholder="Formatted CSS will appear here..."
              className="font-mono text-[13px] min-h-72 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
            />
          )}
        </div>
      </div>
    </ToolShell>
  );
}
