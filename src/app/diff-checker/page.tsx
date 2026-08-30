"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { buildSideBySide, calcStats, type DiffRow, type SideChar } from "@/lib/tools/diff-checker";
import { cn } from "@/lib/utils";

function renderChars(chars: SideChar[], type: "removed" | "added") {
  const bg = type === "removed" ? "bg-red-300/60 dark:bg-red-700/50" : "bg-emerald-300/60 dark:bg-emerald-700/50";
  return chars.map((c, i) => (
    <span key={i} className={c.highlight ? bg : undefined}>
      {c.text}
    </span>
  ));
}

function SidePanel({ row, side }: { row: DiffRow; side: "left" | "right" }) {
  const line = side === "left" ? row.left : row.right;
  const isEmpty = !line;

  const rowBg = isEmpty
    ? "bg-muted/20"
    : line.type === "removed"
    ? "bg-red-50 dark:bg-red-950/30"
    : line.type === "added"
    ? "bg-emerald-50 dark:bg-emerald-950/30"
    : "";

  const lineNoBg = isEmpty
    ? "bg-muted/30 text-muted-foreground/30"
    : line.type === "removed"
    ? "bg-red-100 dark:bg-red-950/50 text-red-400"
    : line.type === "added"
    ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-400"
    : "bg-muted/30 text-muted-foreground/50";

  const textColor =
    line?.type === "removed"
      ? "text-red-800 dark:text-red-300"
      : line?.type === "added"
      ? "text-emerald-800 dark:text-emerald-300"
      : "text-foreground/80";

  const prefix = line?.type === "removed" ? "−" : line?.type === "added" ? "+" : " ";

  return (
    <div className={cn("flex min-h-[22px]", rowBg)}>
      <span className={cn("select-none text-right text-[11px] font-mono px-2 min-w-[3rem] border-r border-border/40", lineNoBg)}>
        {line ? line.lineNo : ""}
      </span>
      <span className={cn("select-none text-[11px] font-mono px-1 text-muted-foreground/40 border-r border-border/40 w-5 text-center", lineNoBg)}>
        {line ? prefix : ""}
      </span>
      <span className={cn("font-mono text-[12px] px-2 py-px whitespace-pre flex-1 overflow-hidden", textColor)}>
        {isEmpty ? " " : line.chars ? renderChars(line.chars, line.type as "removed" | "added") : line.content || " "}
      </span>
    </div>
  );
}

export default function DiffCheckerPage() {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [rows, setRows] = useState<DiffRow[] | null>(null);
  const [stats, setStats] = useState<{ added: number; removed: number; unchanged: number } | null>(null);

  function compare() {
    const r = buildSideBySide(original, modified);
    setRows(r);
    setStats(calcStats(r));
  }

  function clear() {
    setOriginal("");
    setModified("");
    setRows(null);
    setStats(null);
  }

  return (
    <ToolShell
      title="Diff Checker"
      description="Compare two texts side by side with line numbers and character-level highlighting."
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Original</label>
            <Textarea
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              placeholder="Paste original text here…"
              className="font-mono text-[13px] min-h-48 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Modified</label>
            <Textarea
              value={modified}
              onChange={(e) => setModified(e.target.value)}
              placeholder="Paste modified text here…"
              className="font-mono text-[13px] min-h-48 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button size="sm" className="h-8" onClick={compare}>Find Differences</Button>
          <Button size="sm" className="h-8" variant="ghost" onClick={clear}>Clear</Button>
        </div>

        {stats && (
          <div className="flex gap-2 flex-wrap">
            <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 px-3 py-1 text-xs font-semibold">
              +{stats.added} added
            </span>
            <span className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 px-3 py-1 text-xs font-semibold">
              −{stats.removed} removed
            </span>
            <span className="inline-flex items-center rounded-full bg-muted text-muted-foreground px-3 py-1 text-xs font-semibold">
              {stats.unchanged} unchanged
            </span>
          </div>
        )}

        {rows && rows.length > 0 && (
          <div className="rounded-lg border border-border/60 overflow-hidden">
            <div className="grid grid-cols-2 border-b border-border/60 bg-muted/30">
              <div className="px-4 py-2 text-xs font-semibold text-muted-foreground border-r border-border/40">Original</div>
              <div className="px-4 py-2 text-xs font-semibold text-muted-foreground">Modified</div>
            </div>
            <div className="overflow-auto max-h-[560px]">
              {rows.map((row, i) => (
                <div key={i} className="grid grid-cols-2 border-b border-border/20 last:border-0">
                  <div className="border-r border-border/40">
                    <SidePanel row={row} side="left" />
                  </div>
                  <div>
                    <SidePanel row={row} side="right" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {rows && rows.length === 0 && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800 p-4 text-sm text-emerald-700 dark:text-emerald-300 font-medium">
            No differences found — the texts are identical.
          </div>
        )}
      </div>
    </ToolShell>
  );
}
