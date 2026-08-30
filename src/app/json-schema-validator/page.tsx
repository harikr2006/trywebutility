"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { validateJsonSchema } from "@/lib/tools/json-schema-validator";

const DEFAULT_SCHEMA = `{
  "type": "object",
  "required": ["name", "age"],
  "properties": {
    "name": { "type": "string" },
    "age": { "type": "integer", "minimum": 0 }
  }
}`;

const DEFAULT_DATA = `{"name": "Alice", "age": 30}`;

export default function JsonSchemaValidatorPage() {
  const [schema, setSchema] = useState(DEFAULT_SCHEMA);
  const [data, setData] = useState(DEFAULT_DATA);
  const [result, setResult] = useState<{ valid: boolean; errors: string[]; error: string | null } | null>(null);

  function validate() {
    const res = validateJsonSchema(schema, data);
    setResult(res);
  }

  function clear() {
    setSchema("");
    setData("");
    setResult(null);
  }

  return (
    <ToolShell title="JSON Schema Validator" description="Validate JSON data against a JSON Schema (Draft-07).">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Button size="sm" className="h-8" onClick={validate}>
          Validate
        </Button>
        <Button size="sm" className="h-8" variant="ghost" onClick={clear}>
          Clear
        </Button>
      </div>

      {result?.error && (
        <div className="flex gap-2 rounded-lg border border-destructive/40 bg-destructive/8 p-3 text-sm text-destructive font-mono mb-4">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{result.error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center h-7">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              JSON Schema
            </label>
          </div>
          <Textarea
            value={schema}
            onChange={(e) => setSchema(e.target.value)}
            placeholder='{ "type": "object" }'
            className="font-mono text-[13px] min-h-72 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center h-7">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              JSON Data
            </label>
          </div>
          <Textarea
            value={data}
            onChange={(e) => setData(e.target.value)}
            placeholder='{"key": "value"}'
            className="font-mono text-[13px] min-h-72 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
          />
        </div>
      </div>

      {result && !result.error && (
        <div className="mt-4">
          {result.valid ? (
            <div className="flex items-center gap-2 rounded-lg border border-green-500/40 bg-green-500/8 p-3 text-sm text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span className="font-semibold">Valid</span>
              <span className="text-muted-foreground font-normal">— the JSON data conforms to the schema.</span>
            </div>
          ) : (
            <div className="rounded-lg border border-destructive/40 bg-destructive/8 p-3 text-sm">
              <div className="flex items-center gap-2 text-destructive font-semibold mb-2">
                <XCircle className="h-4 w-4 shrink-0" />
                <span>Invalid — {result.errors.length} error{result.errors.length !== 1 ? "s" : ""} found</span>
              </div>
              <ul className="space-y-1 font-mono text-destructive">
                {result.errors.map((err, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-destructive/50 select-none">{i + 1}.</span>
                    <span>{err}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </ToolShell>
  );
}
