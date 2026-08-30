"use client";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeftRight } from "lucide-react";
import { useState } from "react";
import { encodeHTMLEntities, decodeHTMLEntities } from "@/lib/tools/html-entity";

export default function HTMLEntityPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function handleEncode() {
    setError("");
    setOutput("");
    try {
      setOutput(encodeHTMLEntities(input));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  function handleDecode() {
    setError("");
    setOutput("");
    try {
      setOutput(decodeHTMLEntities(input));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  function handleSwap() {
    if (!output) return;
    setInput(output);
    setOutput("");
    setError("");
  }

  function handleClear() {
    setInput("");
    setOutput("");
    setError("");
  }

  return (
    <ToolShell title="HTML Entity Encoder / Decoder" description="Encode or decode HTML entities. All processing in your browser.">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" className="h-8" onClick={handleEncode}>
          Encode
        </Button>
        <Button size="sm" className="h-8" onClick={handleDecode}>
          Decode
        </Button>
        <Button
          size="sm"
          className="h-8"
          variant="outline"
          onClick={handleSwap}
          disabled={!output}
          title="Use output as input"
        >
          <ArrowLeftRight className="h-3.5 w-3.5 mr-1" />
          Use output as input
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
            placeholder="Paste text or HTML here..."
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
              placeholder="Encoded / decoded output will appear here..."
              className="font-mono text-[13px] min-h-72 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
            />
          )}
        </div>
      </div>
    </ToolShell>
  );
}
