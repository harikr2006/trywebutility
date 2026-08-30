"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { percentOf, whatPercent, percentChange, addPercent, subtractPercent } from "@/lib/tools/percentage";

interface CardConfig {
  title: string;
  description: string;
  example: string;
  accent: string;       // border + icon color
  resultBg: string;     // result strip background
}

const CARDS: CardConfig[] = [
  {
    title: "Percentage of a Number",
    description: "Find X% of a given value. Use for calculating discounts, tax amounts, or tips.",
    example: "20% of 150 = 30",
    accent: "border-blue-400 dark:border-blue-500",
    resultBg: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800",
  },
  {
    title: "What Percent is X of Y?",
    description: "Determine what percentage one number is of another. Useful for scores, ratios, and proportions.",
    example: "30 out of 200 = 15%",
    accent: "border-violet-400 dark:border-violet-500",
    resultBg: "bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800",
  },
  {
    title: "Percentage Change",
    description: "Calculate the % increase or decrease between two values. Use for growth rates, price changes, or trends.",
    example: "100 → 125 = +25% increase",
    accent: "border-amber-400 dark:border-amber-500",
    resultBg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800",
  },
  {
    title: "Increase a Value by %",
    description: "Add a percentage on top of a number. Common for markup pricing, salary hikes, or growth projections.",
    example: "200 + 15% = 230",
    accent: "border-emerald-400 dark:border-emerald-500",
    resultBg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
  },
  {
    title: "Decrease a Value by %",
    description: "Subtract a percentage from a number. Ideal for discounts, depreciation, or cost reductions.",
    example: "200 − 15% = 170",
    accent: "border-rose-400 dark:border-rose-500",
    resultBg: "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800",
  },
];

function NumInput({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <div className="flex flex-col gap-1 flex-1 min-w-0">
      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        className="w-full h-9 rounded-md border border-border/60 bg-background px-3 text-sm text-center font-mono focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </div>
  );
}

export default function PercentagePage() {
  const [p1a, setP1a] = useState("20");
  const [p1b, setP1b] = useState("150");
  const [p2a, setP2a] = useState("30");
  const [p2b, setP2b] = useState("200");
  const [p3a, setP3a] = useState("100");
  const [p3b, setP3b] = useState("125");
  const [p4a, setP4a] = useState("200");
  const [p4b, setP4b] = useState("15");
  const [p5a, setP5a] = useState("200");
  const [p5b, setP5b] = useState("15");

  const fmt = (n: number) => isNaN(n) ? "—" : String(parseFloat(n.toFixed(6)));

  const r1 = percentOf(Number(p1a), Number(p1b));
  const r2 = whatPercent(Number(p2a), Number(p2b));
  const r3 = percentChange(Number(p3a), Number(p3b));
  const r4 = addPercent(Number(p4a), Number(p4b));
  const r5 = subtractPercent(Number(p5a), Number(p5b));

  const results = [
    fmt(r1.result),
    fmt(r2.result) + "%",
    (r3.result >= 0 ? "+" : "") + fmt(r3.result) + "%",
    fmt(r4.result),
    fmt(r5.result),
  ];

  const inputs = [
    <div key="1" className="flex items-end gap-2">
      <NumInput value={p1a} onChange={setP1a} label="Percent (%)" />
      <span className="text-muted-foreground text-sm pb-2 shrink-0">of</span>
      <NumInput value={p1b} onChange={setP1b} label="Total value" />
    </div>,
    <div key="2" className="flex items-end gap-2">
      <NumInput value={p2a} onChange={setP2a} label="Part" />
      <span className="text-muted-foreground text-sm pb-2 shrink-0">of</span>
      <NumInput value={p2b} onChange={setP2b} label="Total" />
    </div>,
    <div key="3" className="flex items-end gap-2">
      <NumInput value={p3a} onChange={setP3a} label="From" />
      <span className="text-muted-foreground text-sm pb-2 shrink-0">→</span>
      <NumInput value={p3b} onChange={setP3b} label="To" />
    </div>,
    <div key="4" className="flex items-end gap-2">
      <NumInput value={p4a} onChange={setP4a} label="Base value" />
      <span className="text-muted-foreground text-sm pb-2 shrink-0">+</span>
      <NumInput value={p4b} onChange={setP4b} label="Percent (%)" />
    </div>,
    <div key="5" className="flex items-end gap-2">
      <NumInput value={p5a} onChange={setP5a} label="Base value" />
      <span className="text-muted-foreground text-sm pb-2 shrink-0">−</span>
      <NumInput value={p5b} onChange={setP5b} label="Percent (%)" />
    </div>,
  ];

  return (
    <ToolShell
      title="Percentage Calculator"
      description="Five types of percentage calculations. Each card is independent — just fill in the numbers."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {CARDS.map((card, i) => (
          <div
            key={i}
            className={`rounded-xl border-2 ${card.accent} bg-card p-5 flex flex-col gap-4 shadow-sm`}
          >
            {/* Header */}
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground leading-tight">{card.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{card.description}</p>
            </div>

            {/* Example badge */}
            <div className="rounded-md bg-muted/40 px-3 py-1.5">
              <span className="text-xs font-mono text-muted-foreground">e.g. {card.example}</span>
            </div>

            {/* Inputs */}
            <div className="flex flex-col gap-2">
              {inputs[i]}
            </div>

            {/* Result */}
            <div className={`rounded-lg border ${card.resultBg} px-4 py-3 flex items-center justify-between gap-2`}>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Result</p>
                <span className="font-mono text-lg font-bold text-foreground">{results[i]}</span>
              </div>
              <CopyButton text={results[i]} />
            </div>
          </div>
        ))}
      </div>
    </ToolShell>
  );
}
