"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import { formatHTML, minifyHTML } from "@/lib/tools/html-formatter";

export default function HTMLFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"format" | "minify">("format");

  function handleProcess(m: "format" | "minify" = mode) {
    setMode(m);
    const fn = m === "format" ? formatHTML : minifyHTML;
    const { output: out, error: err } = fn(input);
    setOutput(out);
    setError(err ?? "");
  }

  return (
    <ToolShell title="HTML Formatter" description="Prettify or minify HTML markup. All processing in your browser.">
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button size="sm" variant={mode === "format" ? "default" : "outline"} onClick={() => handleProcess("format")}>Format / Beautify</Button>
          <Button size="sm" variant={mode === "minify" ? "default" : "outline"} onClick={() => handleProcess("minify")}>Minify</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center h-7">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Input HTML</label>
            </div>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your HTML here..."
              className="font-mono text-[13px] min-h-[400px] resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between h-7">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Output</label>
              <CopyButton text={output} />
            </div>
            {error ? (
              <div className="flex gap-2 rounded-lg border border-destructive/40 bg-destructive/8 p-3 text-sm text-destructive font-mono min-h-[400px]">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            ) : (
              <Textarea
                readOnly
                value={output}
                placeholder="Formatted HTML will appear here..."
                className="font-mono text-[13px] min-h-[400px] resize-y bg-muted/30 border-border/60"
              />
            )}
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
