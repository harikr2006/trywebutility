"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";

const JUSTIFY_ITEMS = ["stretch", "start", "center", "end"];
const ALIGN_ITEMS_OPTS = ["stretch", "start", "center", "end"];
const JUSTIFY_CONTENT = ["start", "center", "end", "space-between", "space-around", "space-evenly"];
const ALIGN_CONTENT = ["start", "center", "end", "space-between", "space-around", "space-evenly"];

const ITEM_COLORS = [
  "bg-blue-400/80", "bg-pink-400/80", "bg-violet-400/80", "bg-emerald-400/80",
  "bg-amber-400/80", "bg-cyan-400/80", "bg-rose-400/80", "bg-indigo-400/80",
  "bg-teal-400/80", "bg-orange-400/80", "bg-sky-400/80", "bg-lime-400/80",
];

function SegmentBtn({
  label,
  active,
  onClick,
}: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded px-2.5 py-1 text-xs font-medium border transition-colors ${
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-muted/30 text-muted-foreground border-border/60 hover:bg-muted/60"
      }`}
    >
      {label}
    </button>
  );
}

export default function CssGridPage() {
  const [columns, setColumns] = useState("repeat(3, 1fr)");
  const [rows, setRows] = useState("auto");
  const [gap, setGap] = useState("12px");
  const [justifyItems, setJustifyItems] = useState("stretch");
  const [alignItems, setAlignItems] = useState("stretch");
  const [justifyContent, setJustifyContent] = useState("start");
  const [alignContent, setAlignContent] = useState("start");
  const [itemCount, setItemCount] = useState(6);

  const containerCss = [
    `display: grid;`,
    `grid-template-columns: ${columns};`,
    rows !== "auto" ? `grid-template-rows: ${rows};` : null,
    `gap: ${gap};`,
    justifyItems !== "stretch" ? `justify-items: ${justifyItems};` : null,
    alignItems !== "stretch" ? `align-items: ${alignItems};` : null,
    justifyContent !== "start" ? `justify-content: ${justifyContent};` : null,
    alignContent !== "start" ? `align-content: ${alignContent};` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const fullCss = `.container {\n  ${containerCss.replace(/\n/g, "\n  ")}\n}\n\n.item {\n  padding: 1rem;\n}`;

  const previewStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: columns,
    gridTemplateRows: rows !== "auto" ? rows : undefined,
    gap,
    justifyItems: justifyItems as React.CSSProperties["justifyItems"],
    alignItems: alignItems as React.CSSProperties["alignItems"],
    justifyContent: justifyContent as React.CSSProperties["justifyContent"],
    alignContent: alignContent as React.CSSProperties["alignContent"],
    minHeight: "200px",
  };

  return (
    <ToolShell
      title="CSS Grid Playground"
      description="Build CSS grid layouts visually — set container properties and copy the generated CSS."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            {/* grid-template-columns */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                grid-template-columns
              </label>
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {["repeat(3, 1fr)", "repeat(4, 1fr)", "1fr 2fr", "200px 1fr", "repeat(auto-fit, minmax(120px, 1fr))"].map((v) => (
                  <SegmentBtn key={v} label={v} active={columns === v} onClick={() => setColumns(v)} />
                ))}
              </div>
              <input
                value={columns}
                onChange={(e) => setColumns(e.target.value)}
                placeholder="e.g. repeat(3, 1fr)"
                className="h-8 w-full rounded-md border border-border/60 bg-muted/30 px-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* grid-template-rows */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                grid-template-rows
              </label>
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {["auto", "100px", "repeat(2, 80px)", "1fr 2fr"].map((v) => (
                  <SegmentBtn key={v} label={v} active={rows === v} onClick={() => setRows(v)} />
                ))}
              </div>
              <input
                value={rows}
                onChange={(e) => setRows(e.target.value)}
                className="h-8 w-full rounded-md border border-border/60 bg-muted/30 px-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* gap */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">gap</label>
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {["0px", "8px", "12px", "16px", "24px"].map((v) => (
                  <SegmentBtn key={v} label={v} active={gap === v} onClick={() => setGap(v)} />
                ))}
              </div>
              <input
                value={gap}
                onChange={(e) => setGap(e.target.value)}
                className="h-8 w-full rounded-md border border-border/60 bg-muted/30 px-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* justify-items */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">justify-items</label>
              <div className="flex flex-wrap gap-1.5">
                {JUSTIFY_ITEMS.map((v) => (
                  <SegmentBtn key={v} label={v} active={justifyItems === v} onClick={() => setJustifyItems(v)} />
                ))}
              </div>
            </div>

            {/* align-items */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">align-items</label>
              <div className="flex flex-wrap gap-1.5">
                {ALIGN_ITEMS_OPTS.map((v) => (
                  <SegmentBtn key={v} label={v} active={alignItems === v} onClick={() => setAlignItems(v)} />
                ))}
              </div>
            </div>

            {/* justify-content */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">justify-content</label>
              <div className="flex flex-wrap gap-1.5">
                {JUSTIFY_CONTENT.map((v) => (
                  <SegmentBtn key={v} label={v} active={justifyContent === v} onClick={() => setJustifyContent(v)} />
                ))}
              </div>
            </div>

            {/* align-content */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">align-content</label>
              <div className="flex flex-wrap gap-1.5">
                {ALIGN_CONTENT.map((v) => (
                  <SegmentBtn key={v} label={v} active={alignContent === v} onClick={() => setAlignContent(v)} />
                ))}
              </div>
            </div>

            {/* item count */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Items: {itemCount}
              </label>
              <input
                type="range"
                min={1}
                max={12}
                value={itemCount}
                onChange={(e) => setItemCount(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          </div>

          {/* Preview + CSS */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Preview</label>
              <div className="rounded-xl border border-border/60 bg-muted/10 p-4">
                <div style={previewStyle}>
                  {Array.from({ length: itemCount }, (_, i) => (
                    <div
                      key={i}
                      className={`${ITEM_COLORS[i % ITEM_COLORS.length]} rounded-lg flex items-center justify-center text-white font-bold text-sm p-4 min-h-[48px]`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Generated CSS</label>
                <CopyButton text={fullCss} />
              </div>
              <pre className="rounded-lg bg-muted/30 border border-border/60 px-4 py-3 font-mono text-xs overflow-auto max-h-64 whitespace-pre-wrap">
                {fullCss}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
