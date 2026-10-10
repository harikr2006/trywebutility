"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import { Textarea } from "@/components/ui/textarea";
import { parseCSVForViewer } from "@/lib/tools/csv-viewer";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const SAMPLE = `name,age,city,email
Alice,30,New York,alice@example.com
Bob,25,Los Angeles,bob@example.com
Charlie,35,Chicago,charlie@example.com`;

const DELIMITERS = [
  { label: "Comma (,)", value: "," },
  { label: "Semicolon (;)", value: ";" },
  { label: "Tab (\\t)", value: "\t" },
  { label: "Pipe (|)", value: "|" },
];

export default function CSVViewerPage() {
  const [input, setInput] = useState(SAMPLE);
  const [delimiter, setDelimiter] = useState(",");
  const data = parseCSVForViewer(input, delimiter);

  return (
    <ToolShell title="CSV Viewer" description="Paste CSV data and view it as an interactive table. Supports headers, quoted fields, and custom delimiters.">
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">CSV Input</label>
          <Textarea value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="Paste CSV here..."
            className="font-mono text-[13px] min-h-28 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30" />
        </div>

        {/* Delimiter selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide shrink-0">Delimiter</span>
          <div className="flex flex-wrap gap-1.5">
            {DELIMITERS.map((d) => (
              <button
                key={d.value}
                onClick={() => setDelimiter(d.value)}
                className={cn(
                  "h-7 px-3 rounded-md text-xs font-medium border transition-colors",
                  delimiter === d.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/30 border-border/60 text-foreground hover:bg-muted/60"
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {data.error ? (
          <div className="flex gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{data.error}</span>
          </div>
        ) : data.headers.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">{data.rowCount} rows × {data.colCount} columns</p>
            <div className="overflow-auto rounded-lg border border-border/60">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b border-border/60">
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground w-10">#</th>
                    {data.headers.map((h, i) => (
                      <th key={i} className="px-3 py-2 text-left text-xs font-semibold text-foreground whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map((row, ri) => (
                    <tr key={ri} className="border-b border-border/40 last:border-0 hover:bg-muted/20">
                      <td className="px-3 py-2 text-muted-foreground text-xs">{ri + 1}</td>
                      {data.headers.map((_, ci) => (
                        <td key={ci} className="px-3 py-2 font-mono text-xs whitespace-nowrap">{row[ci] ?? ""}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    </ToolShell>
  );
}
