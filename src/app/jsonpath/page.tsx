"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { testJSONPath } from "@/lib/tools/jsonpath";

const SAMPLE = `{
  "store": {
    "books": [
      { "title": "Sayings", "price": 8.95, "author": "Nigel" },
      { "title": "Sword", "price": 12.99, "author": "Evelyn" }
    ]
  }
}`;

export default function JSONPathPage() {
  const [json, setJson] = useState(SAMPLE);
  const [path, setPath] = useState("$.store.books[*].title");
  const [result, setResult] = useState<{ results: unknown[]; count: number; error: string | null } | null>(null);

  function handleTest() {
    setResult(testJSONPath(json, path));
  }

  return (
    <ToolShell title="JSON Path Tester" description="Test JSONPath expressions against JSON data and inspect matching results.">
      <div className="space-y-4">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="$.store.books[*].title"
            className="flex-1 h-9 rounded-md border border-border/60 bg-background px-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            onKeyDown={(e) => e.key === "Enter" && handleTest()}
          />
          <Button size="sm" className="h-9" onClick={handleTest}>Test</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Input JSON</label>
            <Textarea
              value={json}
              onChange={(e) => setJson(e.target.value)}
              className="font-mono text-[13px] min-h-[400px] resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Results {result && !result.error && `(${result.count} match${result.count !== 1 ? "es" : ""})`}
              </label>
              <CopyButton text={result ? JSON.stringify(result.results, null, 2) : ""} />
            </div>
            {result?.error ? (
              <div className="flex gap-2 rounded-lg border border-destructive/40 bg-destructive/8 p-3 text-sm text-destructive font-mono min-h-[400px]">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{result.error}</span>
              </div>
            ) : (
              <Textarea
                readOnly
                value={result ? JSON.stringify(result.results, null, 2) : ""}
                placeholder="Run a test to see results..."
                className="font-mono text-[13px] min-h-[400px] resize-y bg-muted/30 border-border/60"
              />
            )}
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
