"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { jsonToTypeScript } from "@/lib/tools/json-to-ts";

export default function JsonToTsPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [rootName, setRootName] = useState("Root");

  function generate() {
    setError("");
    setOutput("");
    const { output: out, error: err } = jsonToTypeScript(input, rootName || "Root");
    setOutput(out);
    if (err) setError(err);
  }

  function clear() {
    setInput("");
    setOutput("");
    setError("");
  }

  return (
    <ToolShell
      title="JSON to TypeScript"
      description="Generate TypeScript interfaces from a JSON object."
    >
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Root interface name
          </label>
          <input
            type="text"
            value={rootName}
            onChange={(e) => setRootName(e.target.value)}
            className="h-8 rounded-md border border-border/60 bg-background px-3 text-sm w-48"
            placeholder="Root"
          />
        </div>
        <div className="flex items-end gap-2">
          <Button size="sm" className="h-8" onClick={generate}>
            Generate
          </Button>
          <Button size="sm" className="h-8" variant="ghost" onClick={clear}>
            Clear
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex gap-2 rounded-lg border border-destructive/40 bg-destructive/8 p-3 text-sm text-destructive font-mono mb-4">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center h-7">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Input JSON
            </label>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste JSON hereâ€¦ e.g. {"name": "Alice", "age": 30}'
            className="font-mono text-[13px] min-h-72 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between h-7">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Output TypeScript
            </label>
            {output && <CopyButton text={output} />}
          </div>
          <Textarea
            value={output}
            readOnly
            placeholder="Generated TypeScript interfaces will appear hereâ€¦"
            className="font-mono text-[13px] min-h-72 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
          />
        </div>
      </div>
    </ToolShell>
  );
}

