"use client";

import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { formatXML, minifyXML } from "@/lib/tools/xml";
import { AlertCircle } from "lucide-react";

export default function XMLFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleFormat() {
    const { output: out, error: err } = formatXML(input);
    setOutput(out);
    setError(err);
  }

  function handleMinify() {
    const { output: out, error: err } = minifyXML(input);
    setOutput(out);
    setError(err);
  }

  function handleClear() {
    setInput("");
    setOutput("");
    setError(null);
  }

  return (
    <ToolShell
      title="XML Formatter"
      description="Prettify and minify XML documents. All processing happens in your browser."
    >
      <div className="flex items-center gap-2 flex-wrap">
        <Button onClick={handleFormat} size="sm" className="h-8">Format</Button>
        <Button onClick={handleMinify} size="sm" variant="outline" className="h-8">Minify</Button>
        <Button onClick={handleClear} size="sm" variant="ghost" className="h-8 ml-auto text-muted-foreground">Clear</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center h-7">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Input</label>
          </div>
          <Textarea
            className="font-mono text-[13px] min-h-80 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
            placeholder="<root><element>Paste XML here</element></root>"
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
              <span>{error}</span>
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
