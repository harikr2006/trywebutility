"use client";
import { useState, useMemo } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { getASCIITable } from "@/lib/tools/ascii-table";

export default function ASCIITablePage() {
  const [search, setSearch] = useState("");
  const [range, setRange] = useState<"0-127" | "128-255">("0-127");

  const [start, end] = range === "0-127" ? [0, 127] : [128, 255];
  const allChars = useMemo(() => getASCIITable(start, end), [start, end]);

  const filtered = search
    ? allChars.filter(c =>
        c.description.toLowerCase().includes(search.toLowerCase()) ||
        c.char === search ||
        c.decimal.toString() === search ||
        c.hex.toLowerCase() === search.toLowerCase().replace("0x", "")
      )
    : allChars;

  return (
    <ToolShell title="ASCII Table" description="Full ASCII and extended character reference with decimal, hex, octal, binary, and HTML entity.">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3 items-center">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by char, name, or code..."
            className="h-9 w-56 rounded-md border border-border/60 bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <div className="flex gap-1">
            {(["0-127", "128-255"] as const).map(r => (
              <button key={r} onClick={() => setRange(r)}
                className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${range === r ? "bg-primary text-primary-foreground border-primary" : "bg-muted/30 text-muted-foreground border-border/60 hover:bg-muted/50"}`}>
                {r}
              </button>
            ))}
          </div>
          <span className="text-xs text-muted-foreground ml-auto">{filtered.length} characters</span>
        </div>

        <div className="overflow-auto rounded-lg border border-border/60">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/50 border-b border-border/60">
                {["Dec", "Hex", "Oct", "Bin", "Char", "HTML", "Description"].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-semibold text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
                <th className="px-3 py-2 w-8" />
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.decimal} className="border-b border-border/40 last:border-0 hover:bg-muted/20">
                  <td className="px-3 py-2 font-mono">{c.decimal}</td>
                  <td className="px-3 py-2 font-mono text-primary">{c.hex}</td>
                  <td className="px-3 py-2 font-mono text-muted-foreground">{c.octal}</td>
                  <td className="px-3 py-2 font-mono text-muted-foreground text-[10px]">{c.binary}</td>
                  <td className="px-3 py-2 font-mono font-bold text-lg text-center">{c.char}</td>
                  <td className="px-3 py-2 font-mono text-muted-foreground">{c.html}</td>
                  <td className="px-3 py-2 text-muted-foreground">{c.description}</td>
                  <td className="px-3 py-2"><CopyButton text={c.char || c.description} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ToolShell>
  );
}
