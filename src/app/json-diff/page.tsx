"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertCircle, Plus, Minus, RefreshCw } from "lucide-react";
import { diffJSON, DiffEntry } from "@/lib/tools/json-diff";

const LEFT = `{
  "name": "Alice",
  "age": 30,
  "city": "New York",
  "role": "admin"
}`;
const RIGHT = `{
  "name": "Alice",
  "age": 31,
  "city": "San Francisco",
  "email": "alice@example.com"
}`;

export default function JSONDiffPage() {
  const [left, setLeft] = useState(LEFT);
  const [right, setRight] = useState(RIGHT);
  const { entries, error } = diffJSON(left, right);

  const typeConfig: Record<DiffEntry["type"], { bg: string; icon: React.ReactNode; label: string }> = {
    added:     { bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800", icon: <Plus className="h-3.5 w-3.5 text-emerald-600" />, label: "Added" },
    removed:   { bg: "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800",   icon: <Minus className="h-3.5 w-3.5 text-red-500" />,   label: "Removed" },
    changed:   { bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800", icon: <RefreshCw className="h-3.5 w-3.5 text-amber-600" />, label: "Changed" },
    unchanged: { bg: "", icon: null, label: "Unchanged" },
  };

  const counts = { added: 0, removed: 0, changed: 0 };
  entries.forEach(e => { if (e.type !== "unchanged") counts[e.type]++; });

  return (
    <ToolShell title="JSON Diff" description="Compare two JSON objects and highlight added, removed, and changed keys.">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Left (Original)</label>
            <Textarea value={left} onChange={(e) => setLeft(e.target.value)}
              className="font-mono text-[13px] min-h-52 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Right (Modified)</label>
            <Textarea value={right} onChange={(e) => setRight(e.target.value)}
              className="font-mono text-[13px] min-h-52 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30" />
          </div>
        </div>

        {error && (
          <div className="flex gap-2 text-sm text-destructive"><AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /><span>{error}</span></div>
        )}

        {entries.length > 0 && (
          <div className="space-y-3">
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1 text-emerald-600"><Plus className="h-3 w-3" />{counts.added} added</span>
              <span className="flex items-center gap-1 text-red-500"><Minus className="h-3 w-3" />{counts.removed} removed</span>
              <span className="flex items-center gap-1 text-amber-600"><RefreshCw className="h-3 w-3" />{counts.changed} changed</span>
            </div>
            <div className="space-y-2">
              {entries.map((entry, i) => {
                const cfg = typeConfig[entry.type];
                return (
                  <div key={i} className={`rounded-lg border px-4 py-3 ${cfg.bg}`}>
                    <div className="flex items-center gap-2 mb-1">
                      {cfg.icon}
                      <code className="text-xs font-mono font-bold">{entry.path}</code>
                      <span className="text-[10px] font-semibold uppercase tracking-wide opacity-60">{cfg.label}</span>
                    </div>
                    <div className="text-xs font-mono space-y-0.5">
                      {entry.type === "removed" || entry.type === "changed" ? (
                        <p className="text-red-600 dark:text-red-400">- {JSON.stringify(entry.oldValue)}</p>
                      ) : null}
                      {entry.type === "added" || entry.type === "changed" ? (
                        <p className="text-emerald-600 dark:text-emerald-400">+ {JSON.stringify(entry.newValue)}</p>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!error && entries.length === 0 && left.trim() && right.trim() && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-800 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">
            ✓ No differences found — the two JSON objects are identical.
          </div>
        )}
      </div>
    </ToolShell>
  );
}
