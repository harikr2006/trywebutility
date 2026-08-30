"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { base32Encode, base32Decode } from "@/lib/tools/base32";

type Mode = "encode" | "decode";

export default function Base32Page() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");

  const result = mode === "encode" ? base32Encode(input) : base32Decode(input);

  function handleModeChange(newMode: Mode) {
    setMode(newMode);
    setInput("");
  }

  return (
    <ToolShell
      title="Base32 Encoder / Decoder"
      description="Encode text to Base32 (RFC 4648) or decode Base32 back to text."
    >
      <div className="space-y-4">
        {/* Mode toggle */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Mode
          </label>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="h-8"
              variant={mode === "encode" ? "default" : "outline"}
              onClick={() => handleModeChange("encode")}
            >
              Encode
            </Button>
            <Button
              size="sm"
              className="h-8"
              variant={mode === "decode" ? "default" : "outline"}
              onClick={() => handleModeChange("decode")}
            >
              Decode
            </Button>
          </div>
        </div>

        {/* Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {mode === "encode" ? "Text Input" : "Base32 Input"}
          </label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "encode"
                ? "Enter text to encode..."
                : "Enter Base32 string to decode (e.g. JBSWY3DPEB3W64TMMQ======)"
            }
            className="font-mono text-[13px] min-h-72 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
          />
        </div>

        {/* Error */}
        {result.error && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{result.error}</span>
          </div>
        )}

        {/* Output */}
        {!result.error && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {mode === "encode" ? "Base32 Output" : "Decoded Text"}
              </label>
              {result.output && <CopyButton text={result.output} />}
            </div>
            <Textarea
              readOnly
              value={result.output}
              placeholder={mode === "encode" ? "Base32 output will appear here..." : "Decoded text will appear here..."}
              className="font-mono text-[13px] min-h-72 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
            />
          </div>
        )}
      </div>
    </ToolShell>
  );
}
