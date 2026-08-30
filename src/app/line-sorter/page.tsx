"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { sortLines, SortMode } from "@/lib/tools/line-sorter";

const MODES: { value: SortMode; label: string }[] = [
  { value: "alpha-asc", label: "A → Z" },
  { value: "alpha-desc", label: "Z → A" },
  { value: "length-asc", label: "Shortest first" },
  { value: "length-desc", label: "Longest first" },
  { value: "reverse", label: "Reverse" },
  { value: "shuffle", label: "Shuffle" },
];

export default function LineSorterPage() {
  const [input, setInput] = useState("banana\napple\ncherry\ndate\napple");
  const [mode, setMode] = useState<SortMode>("alpha-asc");
  const [dedupe, setDedupe] = useState(false);
  const output = sortLines(input, mode, dedupe);
  const lineCount = input.split("\n").filter(Boolean).length;
  const outCount = output.split("\n").filter(Boolean).length;

  return (
    <ToolShell title="Line Sorter" description="Sort, deduplicate, reverse, or shuffle lines of text instantly.">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 items-center">
          {MODES.map((m) => (
            <Button key={m.value} size="sm" variant={mode === m.value ? "default" : "outline"}
              onClick={() => setMode(m.value)}>{m.label}</Button>
          ))}
          <label className="flex items-center gap-1.5 text-sm cursor-pointer ml-2">
            <input type="checkbox" checked={dedupe} onChange={(e) => setDedupe(e.target.checked)}
              className="h-4 w-4 accent-primary" />
            Remove duplicates
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center h-7">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Input ({lineCount} lines)
              </label>
            </div>
            <Textarea value={input} onChange={(e) => setInput(e.target.value)}
              className="font-mono text-[13px] min-h-[400px] resize-y bg-muted/30 border-border/60" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between h-7">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Output ({outCount} lines)
              </label>
              <CopyButton text={output} />
            </div>
            <Textarea readOnly value={output}
              className="font-mono text-[13px] min-h-[400px] resize-y bg-muted/30 border-border/60" />
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
