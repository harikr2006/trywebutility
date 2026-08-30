"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { findReplace } from "@/lib/tools/find-replace";

export default function FindReplacePage() {
  const [input, setInput] = useState("The quick brown fox jumps over the lazy dog. The dog slept.");
  const [find, setFind] = useState("the");
  const [replace, setReplace] = useState("a");
  const [useRegex, setUseRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);

  const { output, count, error } = findReplace(input, find, replace, useRegex, caseSensitive);

  return (
    <ToolShell title="Find & Replace" description="Find and replace text using plain text or regular expression patterns.">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Find</label>
            <input type="text" value={find} onChange={(e) => setFind(e.target.value)}
              className="w-full h-9 rounded-md border border-border/60 bg-background px-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Replace with</label>
            <input type="text" value={replace} onChange={(e) => setReplace(e.target.value)}
              className="w-full h-9 rounded-md border border-border/60 bg-background px-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
        </div>
        <div className="flex gap-4">
          {[
            { label: "Use Regex", checked: useRegex, set: setUseRegex },
            { label: "Case Sensitive", checked: caseSensitive, set: setCaseSensitive },
          ].map(({ label, checked, set }) => (
            <label key={label} className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input type="checkbox" checked={checked} onChange={(e) => set(e.target.checked)}
                className="h-4 w-4 accent-primary" />
              {label}
            </label>
          ))}
          {count > 0 && <span className="text-sm text-muted-foreground ml-auto">{count} replacement{count !== 1 ? "s" : ""} made</span>}
          {error && <span className="text-sm text-destructive ml-auto">{error}</span>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center h-7">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Input</label>
            </div>
            <Textarea value={input} onChange={(e) => setInput(e.target.value)}
              className="font-mono text-[13px] min-h-[400px] resize-y bg-muted/30 border-border/60" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between h-7">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Output</label>
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
