"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { generateFakeData, FakeRecord } from "@/lib/tools/fake-data";

const ALL_FIELDS: (keyof FakeRecord)[] = ["id","fullName","email","phone","age","company","jobTitle","address","city","state","zipCode","country"];

export default function FakeDataPage() {
  const [count, setCount] = useState(10);
  const [fields, setFields] = useState<Set<keyof FakeRecord>>(new Set(["fullName","email","phone","age","company","jobTitle","city","state"]));
  const [data, setData] = useState<FakeRecord[]>(() => generateFakeData(10));
  const [format, setFormat] = useState<"table" | "json" | "csv">("table");

  function generate() { setData(generateFakeData(count)); }
  function toggleField(f: keyof FakeRecord) {
    const next = new Set(fields);
    if (next.has(f)) { if (next.size > 1) next.delete(f); } else { next.add(f); }
    setFields(next);
  }

  const activeFields = ALL_FIELDS.filter(f => fields.has(f));
  const jsonStr = JSON.stringify(data.map(r => Object.fromEntries(activeFields.map(f => [f, r[f]]))), null, 2);
  const csvStr = [activeFields.join(","), ...data.map(r => activeFields.map(f => `"${r[f]}"`).join(","))].join("\n");

  return (
    <ToolShell title="Fake Data Generator" description="Generate realistic fake data for testing and prototyping.">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Count</label>
            <input type="number" value={count} min={1} max={200} onChange={(e) => setCount(Number(e.target.value))}
              className="w-20 h-8 rounded-md border border-border/60 bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <Button size="sm" className="h-8" onClick={generate}>Generate</Button>
          <div className="flex gap-1 ml-auto">
            {(["table","json","csv"] as const).map(f => (
              <Button key={f} size="sm" variant={format === f ? "default" : "outline"} className="h-8 uppercase text-xs"
                onClick={() => setFormat(f)}>{f}</Button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {ALL_FIELDS.map(f => (
            <button key={f} onClick={() => toggleField(f)}
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium border transition-colors ${fields.has(f) ? "bg-primary text-primary-foreground border-primary" : "bg-muted/30 text-muted-foreground border-border/60 hover:bg-muted/50"}`}>
              {f}
            </button>
          ))}
        </div>

        {format === "table" && (
          <div className="overflow-auto rounded-lg border border-border/60">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/50 border-b border-border/60">
                  {activeFields.map(f => <th key={f} className="px-3 py-2 text-left font-semibold text-muted-foreground whitespace-nowrap">{f}</th>)}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i} className="border-b border-border/40 last:border-0 hover:bg-muted/20">
                    {activeFields.map(f => <td key={f} className="px-3 py-2 font-mono whitespace-nowrap">{String(row[f])}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {format !== "table" && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between h-7">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{format.toUpperCase()} Output</label>
              <CopyButton text={format === "json" ? jsonStr : csvStr} />
            </div>
            <textarea readOnly value={format === "json" ? jsonStr : csvStr}
              className="w-full min-h-[400px] rounded-md border border-border/60 bg-muted/30 px-3 py-2 font-mono text-xs resize-y focus:outline-none" />
          </div>
        )}
      </div>
    </ToolShell>
  );
}
