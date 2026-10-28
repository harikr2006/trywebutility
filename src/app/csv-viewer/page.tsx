"use client";
import { useState, useRef, useCallback } from "react";
import ToolShell from "@/components/shared/ToolShell";
import { Textarea } from "@/components/ui/textarea";
import { parseCSVForViewer } from "@/lib/tools/csv-viewer";
import { AlertCircle, Upload, X } from "lucide-react";
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
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const data = parseCSVForViewer(input, delimiter);

  function loadFile(file: File) {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setInput(e.target?.result as string);
    };
    reader.readAsText(file, "UTF-8");
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
    e.target.value = "";
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadFile(file);
  }, []);

  function handleClear() {
    setInput("");
    setFileName(null);
  }

  return (
    <ToolShell title="CSV Viewer" description="Upload or paste CSV data and view it as an interactive table. Supports headers, quoted fields, and custom delimiters.">
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between h-7">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">CSV Input</label>
            <div className="flex items-center gap-2">
              {fileName && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md border border-border/50">
                  {fileName}
                  <button
                    onClick={handleClear}
                    className="ml-0.5 text-muted-foreground/60 hover:text-foreground transition-colors"
                    aria-label="Remove file"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <Upload className="h-3.5 w-3.5" />
                Upload file
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/plain,text/csv"
                className="hidden"
                onChange={handleFileInput}
              />
            </div>
          </div>

          <div
            className={cn(
              "relative rounded-lg transition-colors",
              isDragging && "ring-2 ring-primary ring-offset-1 bg-primary/5"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Textarea value={input} onChange={(e) => { setInput(e.target.value); if (fileName) setFileName(null); }}
              placeholder="Paste CSV here or drag & drop a .csv file..."
              className="font-mono text-[13px] min-h-28 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30" />
            {isDragging && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-lg pointer-events-none">
                <Upload className="h-8 w-8 text-primary/70" />
                <span className="text-sm font-medium text-primary/80">Drop your CSV file here</span>
              </div>
            )}
          </div>
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
