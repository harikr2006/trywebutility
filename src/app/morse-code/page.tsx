"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { textToMorse, morseToText, TEXT_TO_MORSE } from "@/lib/tools/morse-code";

type Mode = "encode" | "decode";

export default function MorseCodePage() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const [showReference, setShowReference] = useState(false);

  const result = mode === "encode" ? textToMorse(input) : morseToText(input);

  function handleModeChange(newMode: Mode) {
    setMode(newMode);
    setInput("");
  }

  const referenceEntries = Object.entries(TEXT_TO_MORSE).sort(([a], [b]) => a.localeCompare(b));

  return (
    <ToolShell
      title="Morse Code"
      description="Encode text to Morse code (dots and dashes) or decode Morse code back to text."
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
              Text &rarr; Morse
            </Button>
            <Button
              size="sm"
              className="h-8"
              variant={mode === "decode" ? "default" : "outline"}
              onClick={() => handleModeChange("decode")}
            >
              Morse &rarr; Text
            </Button>
          </div>
        </div>

        {/* Decode hint */}
        {mode === "decode" && (
          <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
            Separate letters with spaces, words with &quot; / &quot; (e.g. <span className="font-mono">.... . .-.. .-.. --- / .-- --- .-. .-.. -..</span>)
          </div>
        )}

        {/* Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {mode === "encode" ? "Text Input" : "Morse Input"}
          </label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "encode"
                ? "Enter text to convert to Morse code..."
                : "Enter Morse code to decode (e.g. .... . .-.. .-.. --- / .-- --- .-. .-.. -..) "
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
                {mode === "encode" ? "Morse Output" : "Decoded Text"}
              </label>
              {result.output && <CopyButton text={result.output} />}
            </div>
            <Textarea
              readOnly
              value={result.output}
              placeholder={
                mode === "encode"
                  ? "Morse code will appear here..."
                  : "Decoded text will appear here..."
              }
              className="font-mono text-[13px] min-h-72 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
            />
          </div>
        )}

        {/* Reference guide */}
        <div className="rounded-lg border border-border/60 overflow-hidden">
          <button
            onClick={() => setShowReference(!showReference)}
            className="flex w-full items-center justify-between px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:bg-muted/30 transition-colors"
          >
            <span>Morse Code Reference</span>
            {showReference ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {showReference && (
            <div className="border-t border-border/60 bg-muted/10 p-3">
              <div className="grid grid-cols-3 gap-1 sm:grid-cols-4 md:grid-cols-6">
                {referenceEntries.map(([char, morse]) => (
                  <div
                    key={char}
                    className="flex items-center gap-1.5 rounded px-2 py-1 bg-muted/30 border border-border/40"
                  >
                    <span className="text-xs font-semibold text-foreground w-4 shrink-0">{char}</span>
                    <span className="font-mono text-[11px] text-muted-foreground truncate">{morse}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolShell>
  );
}
