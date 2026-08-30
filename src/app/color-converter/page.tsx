"use client";
import { useState, useMemo } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { AlertCircle } from "lucide-react";
import { parseColor } from "@/lib/tools/color-converter";

export default function ColorConverterPage() {
  const [inputValue, setInputValue] = useState("");

  const result = useMemo(() => {
    if (!inputValue.trim()) return null;
    try {
      return parseColor(inputValue.trim());
    } catch (e: unknown) {
      return { error: e instanceof Error ? e.message : String(e) };
    }
  }, [inputValue]);

  const hasError = result && "error" in result;
  const hasResult = result && !hasError;

  return (
    <ToolShell
      title="Color Converter"
      description="Convert colors between HEX, RGB, and HSL formats instantly."
    >
      <div className="flex flex-col gap-4 max-w-xl">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Color Input
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="#3b82f6 or rgb(59,130,246) or hsl(217,91%,60%)"
            className="h-10 rounded-lg border border-border/60 bg-background px-3 text-sm font-mono focus:ring-2 focus:ring-primary/30 focus:outline-none w-full"
          />
        </div>

        {hasError && (
          <div className="flex gap-2 rounded-lg border border-destructive/40 bg-destructive/8 p-3 text-sm text-destructive font-mono">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{(result as { error: string }).error}</span>
          </div>
        )}

        {hasResult && (() => {
          const r = result as { hex: string; rgb: string; hsl: string };
          return (
            <div className="flex flex-col gap-4">
              <div
                className="w-full h-20 rounded-xl border"
                style={{ backgroundColor: r.hex }}
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: "HEX", value: r.hex },
                  { label: "RGB", value: r.rgb },
                  { label: "HSL", value: r.hsl },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="rounded-lg border p-3 flex flex-col gap-1"
                  >
                    <span
                      style={{ fontSize: "10px" }}
                      className="font-semibold uppercase tracking-wide text-muted-foreground"
                    >
                      {label}
                    </span>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-sm truncate">{value}</span>
                      <CopyButton text={value} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>
    </ToolShell>
  );
}

