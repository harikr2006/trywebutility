"use client";
import { useState, useMemo } from "react";
import ToolShell from "@/components/shared/ToolShell";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { calcByteSize } from "@/lib/tools/byte-size";

type Encoding = "utf-8" | "utf-16" | "ascii";

const ENCODINGS: { value: Encoding; label: string }[] = [
  { value: "utf-8", label: "UTF-8" },
  { value: "utf-16", label: "UTF-16" },
  { value: "ascii", label: "ASCII" },
];

export default function ByteSizePage() {
  const [input, setInput] = useState("");
  const [encoding, setEncoding] = useState<Encoding>("utf-8");

  const result = useMemo(() => calcByteSize(input, encoding), [input, encoding]);

  const kb = (result.bytes / 1024).toFixed(3);
  const progressPercent = Math.min(100, (result.bytes / 1024) * 100);

  return (
    <ToolShell title="Byte Size Calculator" description="Calculate the byte size of text in UTF-8, UTF-16, or ASCII encoding.">
      <div className="space-y-5">
        {/* Textarea */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Input Text</label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste text to measure its byte size..."
            className="font-mono text-[13px] min-h-48 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
          />
        </div>

        {/* Encoding selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Encoding</label>
          <div className="flex gap-2">
            {ENCODINGS.map((enc) => (
              <button
                key={enc.value}
                onClick={() => setEncoding(enc.value)}
                className={cn(
                  "h-8 px-4 rounded-md text-sm font-medium border transition-colors",
                  encoding === enc.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/30 border-border/60 text-foreground hover:bg-muted/60"
                )}
              >
                {enc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border bg-card p-3 text-center">
            <p className="text-2xl font-bold">{result.bytes.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Bytes</p>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center">
            <p className="text-2xl font-bold">{kb}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Kilobytes</p>
          </div>
          <div className="rounded-lg border bg-card p-3 text-center">
            <p className="text-2xl font-bold">{result.chars.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Characters</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0 B</span>
            <span>Relative to 1 KB</span>
            <span>1 KB</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-muted/50 overflow-hidden border border-border/40">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-right">
            {progressPercent.toFixed(1)}% of 1 KB
          </p>
        </div>
      </div>
    </ToolShell>
  );
}
