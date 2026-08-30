"use client";

import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { encodeURL, decodeURL } from "@/lib/tools/url";
import { AlertCircle, ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight } from "lucide-react";

export default function URLEncoderPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"encode" | "decode" | null>(null);

  function handleEncode() {
    const { output: out, error: err } = encodeURL(input);
    setOutput(out);
    setError(err);
    setMode("encode");
  }

  function handleDecode() {
    const { output: out, error: err } = decodeURL(input);
    setOutput(out);
    setError(err);
    setMode("decode");
  }

  function handleSwap() {
    setInput(output);
    setOutput("");
    setError(null);
    setMode(null);
  }

  function handleClear() {
    setInput("");
    setOutput("");
    setError(null);
    setMode(null);
  }

  return (
    <ToolShell
      title="URL Encoder / Decoder"
      description="Encode or decode URL components and query strings. All processing in your browser."
    >
      <div className="flex items-center gap-2 flex-wrap">
        <Button onClick={handleEncode} size="sm" className="h-8 gap-1.5">
          <ArrowDownToLine className="h-3.5 w-3.5" /> Encode
        </Button>
        <Button onClick={handleDecode} size="sm" variant="outline" className="h-8 gap-1.5">
          <ArrowUpFromLine className="h-3.5 w-3.5" /> Decode
        </Button>
        <Button onClick={handleSwap} size="sm" variant="outline" className="h-8 gap-1.5" disabled={!output}>
          <ArrowLeftRight className="h-3.5 w-3.5" /> Use output as input
        </Button>
        <Button onClick={handleClear} size="sm" variant="ghost" className="h-8 ml-auto text-muted-foreground">Clear</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center h-7">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {mode === "decode" ? "Encoded URL" : "Text / URL"}
            </label>
          </div>
          <Textarea
            className="font-mono text-[13px] min-h-64 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
            placeholder="https://example.com/path?q=hello world&foo=bar+baz"
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
            <div className="flex gap-2 rounded-lg border border-destructive/40 bg-destructive/8 p-3 text-sm text-destructive font-mono min-h-64">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          ) : (
            <Textarea
              className="font-mono text-[13px] min-h-64 resize-y bg-muted/30 border-border/60"
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
