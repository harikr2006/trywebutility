"use client";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import {
  escapeJSON,
  unescapeJSON,
  escapeJS,
  unescapeJS,
  escapeSQLString,
  unescapeSQLString,
} from "@/lib/tools/string-escape";

type Mode = "json" | "javascript" | "sql";

export default function StringEscapePage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<Mode>("json");

  function handleEscape() {
    setError("");
    setOutput("");
    try {
      if (mode === "json") setOutput(escapeJSON(input));
      else if (mode === "javascript") setOutput(escapeJS(input));
      else setOutput(escapeSQLString(input));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  function handleUnescape() {
    setError("");
    setOutput("");
    try {
      if (mode === "json") setOutput(unescapeJSON(input));
      else if (mode === "javascript") setOutput(unescapeJS(input));
      else setOutput(unescapeSQLString(input));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  function handleClear() {
    setInput("");
    setOutput("");
    setError("");
  }

  const modes: { value: Mode; label: string }[] = [
    { value: "json", label: "JSON" },
    { value: "javascript", label: "JavaScript" },
    { value: "sql", label: "SQL" },
  ];

  return (
    <ToolShell title="String Escape / Unescape" description="Escape or unescape strings for JSON, JavaScript, or SQL. All processing in your browser.">
      {/* Mode selector */}
      <div className="flex items-center gap-1">
        {modes.map((m) => (
          <Button
            key={m.value}
            size="sm"
            className="h-8"
            variant={mode === m.value ? "default" : "outline"}
            onClick={() => setMode(m.value)}
          >
            {m.label}
          </Button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" className="h-8" onClick={handleEscape}>
          Escape
        </Button>
        <Button size="sm" className="h-8" onClick={handleUnescape}>
          Unescape
        </Button>
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
            placeholder="Paste string here..."
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
              placeholder="Escaped / unescaped output will appear here..."
              className="font-mono text-[13px] min-h-72 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
            />
          )}
        </div>
      </div>
    </ToolShell>
  );
}
