"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { csvToJson, jsonToCsv } from "@/lib/tools/csv";

export default function CsvJsonPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function convert(direction: "csv-to-json" | "json-to-csv") {
    setError("");
    setOutput("");
    const { output: out, error: err } = direction === "csv-to-json" ? csvToJson(input) : jsonToCsv(input);
    setOutput(out);
    if (err) setError(err);
  }

  function clear() {
    setInput("");
    setOutput("");
    setError("");
  }

  return (
    <ToolShell title="CSV ↔ JSON Converter" description="Convert between CSV and JSON formats.">
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
        <div className="flex flex-col gap-2">
          <div className="flex items-center h-7">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Input
            </label>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste CSV or JSON here…"
            className="font-mono text-[13px] min-h-72 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between h-7">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Output
            </label>
            {output && <CopyButton text={output} />}
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

