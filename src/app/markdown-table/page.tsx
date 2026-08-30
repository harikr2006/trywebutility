"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { renderMarkdownTable, emptyTable } from "@/lib/tools/markdown-table";

export default function MarkdownTablePage() {
  const initial = emptyTable(3, 3);
  const [headers, setHeaders] = useState(initial.headers);
  const [rows, setRows] = useState(initial.rows);

  const output = renderMarkdownTable({ headers, rows });

  function setHeader(i: number, v: string) {
    const next = [...headers]; next[i] = v; setHeaders(next);
  }
  function setCell(r: number, c: number, v: string) {
    const next = rows.map(row => [...row]);
    next[r][c] = v; setRows(next);
  }
  function addCol() {
    setHeaders([...headers, `Header ${headers.length + 1}`]);
    setRows(rows.map(r => [...r, ""]));
  }
  function removeCol(c: number) {
    if (headers.length <= 1) return;
    setHeaders(headers.filter((_, i) => i !== c));
    setRows(rows.map(r => r.filter((_, i) => i !== c)));
  }
  function addRow() { setRows([...rows, Array(headers.length).fill("")]); }
  function removeRow(r: number) { if (rows.length > 1) setRows(rows.filter((_, i) => i !== r)); }

  const cellCls = "h-8 w-full rounded border border-border/60 bg-background px-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary/30";

  return (
    <ToolShell title="Markdown Table Generator" description="Build a Markdown table visually — edit cells and copy the formatted output.">
      <div className="space-y-5">
        <div className="overflow-auto rounded-lg border border-border/60">
          <table className="text-sm border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="border border-border/40 p-1 w-8 text-center text-muted-foreground text-xs">#</th>
                {headers.map((h, i) => (
                  <th key={i} className="border border-border/40 p-1 min-w-32">
                    <div className="flex items-center gap-1">
                      <input value={h} onChange={(e) => setHeader(i, e.target.value)}
                        className={cellCls + " font-bold"} />
                      <button onClick={() => removeCol(i)} className="p-0.5 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </th>
                ))}
                <th className="border border-border/40 p-1 w-8">
                  <button onClick={addCol} className="p-1 text-muted-foreground hover:text-primary">
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, r) => (
                <tr key={r} className="hover:bg-muted/10">
                  <td className="border border-border/40 p-1 text-center text-xs text-muted-foreground">{r + 1}</td>
                  {headers.map((_, c) => (
                    <td key={c} className="border border-border/40 p-1">
                      <input value={row[c] ?? ""} onChange={(e) => setCell(r, c, e.target.value)} className={cellCls} />
                    </td>
                  ))}
                  <td className="border border-border/40 p-1 text-center">
                    <button onClick={() => removeRow(r)} className="p-0.5 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Button size="sm" variant="outline" onClick={addRow} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Add Row
        </Button>

        <div className="space-y-2">
          <div className="flex items-center justify-between h-7">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Markdown Output</label>
            <CopyButton text={output} />
          </div>
          <pre className="rounded-lg border border-border/60 bg-muted/30 p-4 font-mono text-xs overflow-x-auto whitespace-pre">
            {output}
          </pre>
        </div>
      </div>
    </ToolShell>
  );
}
