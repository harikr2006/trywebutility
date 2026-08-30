"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import { generateJSONSchema } from "@/lib/tools/json-schema";

export default function JSONSchemaPage() {
  const [input, setInput] = useState('{\n  "name": "Alice",\n  "age": 30,\n  "active": true\n}');
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  function handleChange(val: string) {
    setInput(val);
    const { output: out, error: err } = generateJSONSchema(val);
    setOutput(out);
    setError(err ?? "");
  }

  return (
    <ToolShell title="JSON Schema Generator" description="Generate a JSON Schema draft from any JSON object automatically.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Input JSON</label>
          <Textarea
            value={input}
            onChange={(e) => handleChange(e.target.value)}
            placeholder='{ "key": "value" }'
            className="font-mono text-[13px] min-h-[500px] resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Generated Schema</label>
            <CopyButton text={output} />
          </div>
          {error ? (
            <div className="flex gap-2 rounded-lg border border-destructive/40 bg-destructive/8 p-3 text-sm text-destructive font-mono min-h-[500px]">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          ) : (
            <Textarea
              readOnly
              value={output}
              placeholder="Schema will appear here..."
              className="font-mono text-[13px] min-h-[500px] resize-y bg-muted/30 border-border/60"
            />
          )}
        </div>
      </div>
    </ToolShell>
  );
}
