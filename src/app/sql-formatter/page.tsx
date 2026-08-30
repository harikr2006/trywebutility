"use client";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { formatSQL, minifySQL } from "@/lib/tools/sql";

type Dialect = "sql" | "mysql" | "postgresql" | "sqlite";

export default function SQLFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [dialect, setDialect] = useState<Dialect>("sql");

  function handleFormat() {
    const { output: out, error: err } = formatSQL(input, dialect);
    setOutput(out); setError(err ?? "");
  }

  function handleMinify() {
    const { output: out, error: err } = minifySQL(input);
    setOutput(out); setError(err ?? "");
  }

  function handleClear() {
    setInput("");
    setOutput("");
    setError("");
  }

  return (
    <ToolShell title="SQL Formatter" description="Format or minify SQL queries. All processing in your browser.">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" className="h-8" onClick={handleFormat}>
          Format
        </Button>
        <Button size="sm" className="h-8" onClick={handleMinify}>
          Minify
        </Button>
        <select
          value={dialect}
          onChange={(e) => setDialect(e.target.value as Dialect)}
          className="h-8 rounded-md border border-border/60 bg-background px-2 text-xs"
        >
          <option value="sql">SQL</option>
          <option value="mysql">MySQL</option>
          <option value="postgresql">PostgreSQL</option>
          <option value="sqlite">SQLite</option>
        </select>
        <Button size="sm" className="h-8 ml-auto" variant="ghost" onClick={handleClear}>
          Clear
        </Button>
      </div>

      {/* Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center h-7">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Input</label>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste SQL here..."
            className="font-mono text-[13px] min-h-72 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between h-7">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Output</label>
            <CopyButton text={output} />
          </div>
          {error ? (
            <div className="flex gap-2 rounded-lg border border-destructive/40 bg-destructive/8 p-3 text-sm text-destructive font-mono min-h-72">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          ) : (
            <Textarea
              readOnly
              value={output}
              placeholder="Formatted SQL will appear here..."
              className="font-mono text-[13px] min-h-72 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
            />
          )}
        </div>
      </div>
    </ToolShell>
  );
}
