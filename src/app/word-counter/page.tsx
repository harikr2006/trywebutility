"use client";
import { useState, useMemo, useRef, useCallback } from "react";
import ToolShell from "@/components/shared/ToolShell";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { analyzeText, type TextStats } from "@/lib/tools/word-counter";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-lg border bg-card p-3 text-center">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}

export default function WordCounterPage() {
  const [input, setInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stats: TextStats = useMemo(() => analyzeText(input), [input]);

  const readingTimeLabel =
    stats.readingTimeMin === 1 ? "1 min" : `${stats.readingTimeMin} min`;

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
    <ToolShell title="Word Counter" description="Count words, characters, sentences, paragraphs, and estimate reading time — live as you type.">
      <div className="space-y-5">
        {/* Textarea */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Your Text</label>
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
                accept=".txt,.md,text/plain,text/markdown"
                className="hidden"
                onChange={handleFileInput}
              />
              <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={handleClear} disabled={!input}>Clear</Button>
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
              placeholder="Start typing, paste your text here, or drag & drop a .txt/.md file..."
              className="font-mono text-[13px] min-h-64 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
            />
            {isDragging && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-lg pointer-events-none">
                <Upload className="h-8 w-8 text-primary/70" />
                <span className="text-sm font-medium text-primary/80">Drop your text file here</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Words" value={stats.words} />
          <StatCard label="Characters" value={stats.chars} />
          <StatCard label="Characters (no spaces)" value={stats.charsNoSpaces} />
          <StatCard label="Lines" value={stats.lines} />
          <StatCard label="Sentences" value={stats.sentences} />
          <StatCard label="Paragraphs" value={stats.paragraphs} />
          <StatCard label="Reading Time" value={readingTimeLabel} />
          <StatCard label="Unique Words" value={stats.uniqueWords} />
        </div>
      </div>
    </ToolShell>
  );
}
