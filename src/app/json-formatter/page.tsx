"use client";

import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { formatJSON, minifyJSON, validateJSON } from "@/lib/tools/json";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function JSONFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [valid, setValid] = useState<boolean | null>(null);
  const [indent, setIndent] = useState(2);

  function handleFormat() {
    const { output: out, error: err } = formatJSON(input, indent);
    setOutput(out);
    setError(err);
    setValid(err ? false : true);
  }

  function handleMinify() {
    const { output: out, error: err } = minifyJSON(input);
    setOutput(out);
    setError(err);
    setValid(err ? false : null);
  }

  function handleValidate() {
    const { valid: v, error: err } = validateJSON(input);
    setValid(v);
    setError(err);
    setOutput("");
  }

  function handleClear() {
    setInput("");
    setOutput("");
    setError(null);
    setValid(null);
  }

  return (
    <ToolShell
      title="JSON Formatter"
      description="Format, validate, and minify JSON. All processing happens in your browser."
    >
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button onClick={handleFormat} size="sm" className="h-8">Format</Button>
        <Button onClick={handleMinify} size="sm" variant="outline" className="h-8">Minify</Button>
        <Button onClick={handleValidate} size="sm" variant="outline" className="h-8">Validate</Button>

        <div className="flex items-center gap-1 ml-2">
          <span className="text-xs text-muted-foreground mr-1">Indent</span>
          {[2, 4].map((n) => (
            <Button
              key={n}
              size="sm"
              variant={indent === n ? "default" : "outline"}
              className="h-7 w-7 p-0 text-xs"
              onClick={() => setIndent(n)}
            >
              {n}
            </Button>
          ))}
        </div>

        <Button onClick={handleClear} size="sm" variant="ghost" className="h-8 ml-auto text-muted-foreground">
          Clear
        </Button>
      </div>

      {/* Status bar */}
      {valid !== null && !error && (
        <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          Valid JSON
        </div>
      )}

      {/* Editor panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center h-7">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Input</label>
          </div>
          <Textarea
            className="font-mono text-[13px] min-h-80 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
            placeholder='{ "paste": "your JSON here" }'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between h-7">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Output</label>
            <CopyButton text={output} />
          </div>
          {error ? (
            <div className="flex gap-2 rounded-lg border border-destructive/40 bg-destructive/8 p-3 text-sm text-destructive font-mono min-h-80">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span className="break-words">{error}</span>
            </div>
          ) : (
            <Textarea
              className="font-mono text-[13px] min-h-80 resize-y bg-muted/30 border-border/60"
              value={output}
              readOnly
              placeholder="Output will appear here..."
              spellCheck={false}
            />
          )}
        </div>
      </div>
    </ToolShell>
  );
}
