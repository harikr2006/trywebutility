"use client";
import { useState, useRef, useCallback } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertCircle, Upload, Download, X } from "lucide-react";
import { csvToJson, jsonToCsv } from "@/lib/tools/csv";
import { cn } from "@/lib/utils";

export default function CsvJsonPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [lastDirection, setLastDirection] = useState<"csv-to-json" | "json-to-csv" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function convert(direction: "csv-to-json" | "json-to-csv", text = input) {
    setError("");
    setOutput("");
    setLastDirection(direction);
    const { output: out, error: err } = direction === "csv-to-json" ? csvToJson(text) : jsonToCsv(text);
    setOutput(out);
    if (err) setError(err);
  }

  function clear() {
    setInput("");
    setOutput("");
    setError("");
    setFileName(null);
    setLastDirection(null);
  }

  function loadFile(file: File) {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setInput(text);
      setOutput("");
      setError("");
      // Auto-detect direction from file extension
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext === "csv") {
        convert("csv-to-json", text);
      } else if (ext === "json") {
        convert("json-to-csv", text);
      }
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

  function handleDownload() {
    if (!output) return;
    const isJson = lastDirection === "csv-to-json";
    const mimeType = isJson ? "application/json" : "text/csv";
    const ext = isJson ? ".json" : ".csv";
    const blob = new Blob([output], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    if (fileName) {
      a.download = fileName.replace(/(\.[^.]+)?$/, ext);
    } else {
      a.download = `converted${ext}`;
    }
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ToolShell title="CSV ↔ JSON Converter" description="Convert between CSV and JSON formats. Upload a file or paste — auto-detected on upload.">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Button size="sm" className="h-8" onClick={() => convert("csv-to-json")}>
          CSV → JSON
        </Button>
        <Button size="sm" className="h-8" onClick={() => convert("json-to-csv")}>
          JSON → CSV
        </Button>
        <Button size="sm" className="h-8" variant="ghost" onClick={clear}>
          Clear
        </Button>
      </div>

      {error && (
        <div className="flex gap-2 rounded-lg border border-destructive/40 bg-destructive/8 p-3 text-sm text-destructive font-mono mb-4">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between h-7">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Input
            </label>
            <div className="flex items-center gap-2">
              {fileName && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md border border-border/50">
                  {fileName}
                  <button
                    onClick={clear}
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
                accept=".csv,.json,text/plain,application/json,text/csv"
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
            <Textarea
              value={input}
              onChange={(e) => { setInput(e.target.value); if (fileName) setFileName(null); }}
              placeholder="Paste CSV or JSON here, or drag & drop a .csv / .json file…"
              className="font-mono text-[13px] min-h-72 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
            />
            {isDragging && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-lg pointer-events-none">
                <Upload className="h-8 w-8 text-primary/70" />
                <span className="text-sm font-medium text-primary/80">Drop .csv or .json file here</span>
              </div>
            )}
          </div>
        </div>

        {/* Output */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between h-7">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Output
            </label>
            <div className="flex items-center gap-2">
              {output && (
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download {lastDirection === "csv-to-json" ? ".json" : ".csv"}
                </button>
              )}
              {output && <CopyButton text={output} />}
            </div>
          </div>
          <Textarea
            value={output}
            readOnly
            placeholder="Result will appear here…"
            className="font-mono text-[13px] min-h-72 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
          />
        </div>
      </div>
    </ToolShell>
  );
}
