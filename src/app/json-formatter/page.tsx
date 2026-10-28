"use client";

import { useState, useRef, useCallback } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { formatJSON, minifyJSON, validateJSON } from "@/lib/tools/json";
import { AlertCircle, CheckCircle2, Upload, Download, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function JSONFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [valid, setValid] = useState<boolean | null>(null);
  const [indent, setIndent] = useState(2);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFormat() {
    const { output: out, error: err } = formatJSON(input, indent);
    setOutput(out);
    setError(err);
    setValid(err ? false : true);
  }

  function handleMinify() {
    const { output: out, error: err } = minifyJSON(input);
    setOutput(out);
    setError(err);
    setValid(err ? false : null);
  }

  function handleValidate() {
    const { valid: v, error: err } = validateJSON(input);
    setValid(v);
    setError(err);
    setOutput("");
  }

  function handleClear() {
    setInput("");
    setOutput("");
    setError(null);
    setValid(null);
    setFileName(null);
  }

  function loadFile(file: File) {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setInput(text);
      setOutput("");
      setError(null);
      setValid(null);
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
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName
      ? fileName.replace(/(\.[^.]+)?$/, ".formatted.json")
      : "formatted.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ToolShell
      title="JSON Formatter"
      description="Format, validate, and minify JSON. Upload a file or paste — all processing happens in your browser."
    >
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button onClick={handleFormat} size="sm" className="h-8">Format</Button>
        <Button onClick={handleMinify} size="sm" variant="outline" className="h-8">Minify</Button>
        <Button onClick={handleValidate} size="sm" variant="outline" className="h-8">Validate</Button>

        <div className="flex items-center gap-1 ml-2">
          <span className="text-xs text-muted-foreground mr-1">Indent</span>
          {[2, 4].map((n) => (
            <Button
              key={n}
              size="sm"
              variant={indent === n ? "default" : "outline"}
              className="h-7 w-7 p-0 text-xs"
              onClick={() => {
                setIndent(n);
                if (input) {
                  const { output: out, error: err } = formatJSON(input, n);
                  setOutput(out); setError(err); setValid(err ? false : true);
                }
              }}
            >
              {n}
            </Button>
          ))}
        </div>

        <Button onClick={handleClear} size="sm" variant="ghost" className="h-8 ml-auto text-muted-foreground">
          Clear
        </Button>
      </div>

      {/* Status bar */}
      {valid !== null && !error && (
        <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          Valid JSON
        </div>
      )}

      {/* Editor panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* ── Input panel ── */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between h-7">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Input</label>
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
                accept=".json,application/json,text/plain"
                className="hidden"
                onChange={handleFileInput}
              />
            </div>
          </div>

          {/* Drop zone wrapper */}
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
              className="font-mono text-[13px] min-h-80 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
              placeholder={'{ "paste": "your JSON here" }\n\n— or drag & drop a .json file'}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (fileName) setFileName(null);
              }}
              spellCheck={false}
            />
            {isDragging && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-lg pointer-events-none">
                <Upload className="h-8 w-8 text-primary/70" />
                <span className="text-sm font-medium text-primary/80">Drop your JSON file here</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Output panel ── */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between h-7">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Output</label>
            <div className="flex items-center gap-2">
              {output && (
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download .json
                </button>
              )}
              <CopyButton text={output} />
            </div>
          </div>
          {error ? (
            <div className="flex gap-2 rounded-lg border border-destructive/40 bg-destructive/8 p-3 text-sm text-destructive font-mono min-h-80">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span className="break-words">{error}</span>
            </div>
          ) : (
            <Textarea
              className="font-mono text-[13px] min-h-80 resize-y bg-muted/30 border-border/60"
              value={output}
              readOnly
              placeholder="Output will appear here..."
              spellCheck={false}
            />
          )}
        </div>
      </div>
    </ToolShell>
  );
}
