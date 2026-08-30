"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertCircle, Info } from "lucide-react";
import { htmlToJsx } from "@/lib/tools/html-to-jsx";

const TRANSFORMATIONS = [
  "class → className",
  "for → htmlFor",
  "tabindex → tabIndex",
  "Inline style strings → style={{ }} objects",
  "Void elements self-closed (e.g. <br />)",
  "Event handlers camelCased (onclick → onClick)",
  "HTML comments → {/* */}",
];

export default function HtmlToJsxPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function handleChange(value: string) {
    setInput(value);
    const { output: out, error: err } = htmlToJsx(value);
    setOutput(out);
    setError(err ?? "");
  }

  function clear() {
    setInput("");
    setOutput("");
    setError("");
  }

  return (
    <ToolShell
      title="HTML to JSX"
      description="Convert HTML markup to React JSX — renames attributes (class→className), self-closes void elements, and converts inline styles."
    >
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Button size="sm" className="h-8" variant="ghost" onClick={clear}>
          Clear
        </Button>
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
              HTML Input
            </label>
          </div>
          <Textarea
            value={input}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Paste HTML here…"
            className="font-mono text-[13px] min-h-72 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between h-7">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              JSX Output
            </label>
            {output && <CopyButton text={output} />}
          </div>
          <Textarea
            value={output}
            readOnly
            placeholder="JSX will appear here as you type…"
            className="font-mono text-[13px] min-h-72 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
          />
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-border/60 bg-muted/20 p-3">
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          <Info className="h-3.5 w-3.5" />
          Transformations applied
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-1">
          {TRANSFORMATIONS.map((t) => (
            <li key={t} className="text-xs text-muted-foreground font-mono">
              • {t}
            </li>
          ))}
        </ul>
      </div>
    </ToolShell>
  );
}
