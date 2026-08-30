"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { convert, getUnits, categories, UnitCategory } from "@/lib/tools/unit-converter";

const CATEGORY_LABELS: Record<UnitCategory, string> = {
  length: "Length", weight: "Weight", temperature: "Temperature",
  area: "Area", volume: "Volume", speed: "Speed",
};

export default function UnitConverterPage() {
  const [category, setCategory] = useState<UnitCategory>("length");
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("ft");

  const unitList = getUnits(category);
  const result = convert(Number(value), fromUnit, toUnit, category);
  const resultStr = isNaN(result) ? "—" : parseFloat(result.toFixed(8)).toString();

  function handleCategory(cat: UnitCategory) {
    setCategory(cat);
    const units = getUnits(cat);
    setFromUnit(units[0]?.key ?? "");
    setToUnit(units[1]?.key ?? "");
  }

  return (
    <ToolShell title="Unit Converter" description="Convert between length, weight, temperature, area, volume, and speed units.">
      <div className="space-y-5 max-w-xl">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button key={cat} onClick={() => handleCategory(cat)}
              className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${
                category === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/30 text-muted-foreground border-border/60 hover:bg-muted/50"
              }`}>
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Converter */}
        <div className="rounded-xl border border-border/60 bg-card p-5 space-y-4">
          {/* From */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Value</label>
            <div className="flex gap-2">
              <input type="number" value={value} onChange={(e) => setValue(e.target.value)}
                className="flex-1 h-9 rounded-md border border-border/60 bg-background px-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}
                className="flex-1 h-9 rounded-md border border-border/60 bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                {unitList.map(u => <option key={u.key} value={u.key}>{u.label}</option>)}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-border/60" />
            <span className="text-xs text-muted-foreground font-medium">converts to</span>
            <div className="flex-1 h-px bg-border/60" />
          </div>

          {/* To */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Result</label>
            <div className="flex gap-2">
              <div className="flex-1 h-9 rounded-md border border-border/60 bg-muted/30 px-3 flex items-center font-mono text-sm font-bold text-foreground">
                {resultStr}
              </div>
              <select value={toUnit} onChange={(e) => setToUnit(e.target.value)}
                className="flex-1 h-9 rounded-md border border-border/60 bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                {unitList.map(u => <option key={u.key} value={u.key}>{u.label}</option>)}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2">
            <p className="font-mono text-sm text-muted-foreground">
              {value} {fromUnit} = <span className="font-bold text-foreground">{resultStr} {toUnit}</span>
            </p>
            <CopyButton text={resultStr} />
          </div>
        </div>

        {/* All conversions table */}
        <div className="rounded-lg border border-border/60 overflow-hidden">
          <div className="bg-muted/50 px-4 py-2 border-b border-border/60">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              All {CATEGORY_LABELS[category]} Conversions for {value || "1"}
            </p>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {unitList.map(u => {
                const r = convert(Number(value), fromUnit, u.key, category);
                const rStr = isNaN(r) ? "—" : parseFloat(r.toFixed(8)).toString();
                return (
                  <tr key={u.key} className={`border-b border-border/40 last:border-0 ${u.key === fromUnit ? "bg-primary/5" : ""}`}>
                    <td className="px-4 py-2.5 text-muted-foreground">{u.label}</td>
                    <td className="px-4 py-2.5 font-mono text-foreground text-right">{rStr}</td>
                    <td className="px-4 py-2.5 text-right"><CopyButton text={rStr} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </ToolShell>
  );
}
