"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";

type FlexDirection = "row" | "row-reverse" | "column" | "column-reverse";
type JustifyContent = "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly";
type AlignItems = "stretch" | "flex-start" | "center" | "flex-end" | "baseline";
type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";

const ITEM_COLORS = [
  "bg-blue-400 dark:bg-blue-500",
  "bg-emerald-400 dark:bg-emerald-500",
  "bg-amber-400 dark:bg-amber-500",
  "bg-rose-400 dark:bg-rose-500",
];

function SelectRow<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {label}
      </label>
      <div className="flex flex-wrap gap-1">
        {options.map((opt) => (
          <Button
            key={opt}
            size="sm"
            className="h-7 text-xs px-2"
            variant={value === opt ? "default" : "outline"}
            onClick={() => onChange(opt)}
          >
            {opt}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default function CssFlexboxPage() {
  const [direction, setDirection] = useState<FlexDirection>("row");
  const [justify, setJustify] = useState<JustifyContent>("flex-start");
  const [alignItems, setAlignItems] = useState<AlignItems>("stretch");
  const [wrap, setWrap] = useState<FlexWrap>("nowrap");
  const [gap, setGap] = useState("8px");

  const containerCss = [
    `.container {`,
    `  display: flex;`,
    `  flex-direction: ${direction};`,
    `  justify-content: ${justify};`,
    `  align-items: ${alignItems};`,
    `  flex-wrap: ${wrap};`,
    `  gap: ${gap};`,
    `}`,
    ``,
    `.item {`,
    `  padding: 8px 16px;`,
    `  min-width: 40px;`,
    `  min-height: 40px;`,
    `}`,
  ].join("\n");

  return (
    <ToolShell
      title="CSS Flexbox Playground"
      description="Build CSS flexbox layouts visually — set container and item properties and copy the generated CSS."
    >
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="flex flex-col gap-4 p-4 rounded-lg border border-border/60 bg-muted/10">
            <h2 className="text-sm font-semibold">Container Properties</h2>

            <SelectRow<FlexDirection>
              label="flex-direction"
              value={direction}
              options={["row", "row-reverse", "column", "column-reverse"]}
              onChange={setDirection}
            />

            <SelectRow<JustifyContent>
              label="justify-content"
              value={justify}
              options={["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"]}
              onChange={setJustify}
            />

            <SelectRow<AlignItems>
              label="align-items"
              value={alignItems}
              options={["stretch", "flex-start", "center", "flex-end", "baseline"]}
              onChange={setAlignItems}
            />

            <SelectRow<FlexWrap>
              label="flex-wrap"
              value={wrap}
              options={["nowrap", "wrap", "wrap-reverse"]}
              onChange={setWrap}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                gap
              </label>
              <input
                type="text"
                value={gap}
                onChange={(e) => setGap(e.target.value)}
                className="h-8 w-32 rounded-md border border-border/60 bg-background px-3 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary/30"
                placeholder="8px"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold">Live Preview</h2>
            <div className="rounded-lg border-2 border-dashed border-border/60 bg-muted/20 p-3 min-h-48 overflow-auto">
              <div
                style={{
                  display: "flex",
                  flexDirection: direction,
                  justifyContent: justify,
                  alignItems: alignItems,
                  flexWrap: wrap,
                  gap: gap,
                  minHeight: "160px",
                }}
              >
                {[1, 2, 3, 4].map((n, i) => (
                  <div
                    key={n}
                    className={`${ITEM_COLORS[i]} rounded text-white text-sm font-bold flex items-center justify-center`}
                    style={{ padding: "8px 16px", minWidth: "40px", minHeight: "40px" }}
                  >
                    {n}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Generated CSS */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between h-7">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Generated CSS
            </label>
            <CopyButton text={containerCss} />
          </div>
          <pre className="rounded-lg border border-border/60 bg-muted/30 p-4 text-[13px] font-mono overflow-x-auto text-foreground">
            {containerCss}
          </pre>
        </div>
      </div>
    </ToolShell>
  );
}
