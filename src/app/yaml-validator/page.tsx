"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle } from "lucide-react";
import { validateYAML } from "@/lib/tools/yaml-validator";

const SAMPLE = `name: John Doe
age: 30
address:
  street: 123 Main St
  city: Springfield
hobbies:
  - coding
  - hiking
  - reading`;

export default function YAMLValidatorPage() {
  const [input, setInput] = useState(SAMPLE);
  const { valid, formatted, error } = validateYAML(input);
  return (
    <ToolShell title="YAML Validator" description="Validate and format YAML. All processing in your browser.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between h-7">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Input YAML</label>
            <div className="flex items-center gap-1.5 text-xs">
              {input.trim() && (valid
                ? <><CheckCircle className="h-3.5 w-3.5 text-emerald-500" /><span className="text-emerald-600 font-medium">Valid</span></>
                : <><XCircle className="h-3.5 w-3.5 text-destructive" /><span className="text-destructive font-medium">Invalid</span></>
              )}
            </div>
          </div>
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste YAML here..."
            className="font-mono text-[13px] min-h-[500px] resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between h-7">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Formatted Output</label>
            <CopyButton text={formatted} />
          </div>
          {error ? (
            <div className="flex flex-col gap-2 rounded-lg border border-destructive/40 bg-destructive/8 p-3 min-h-[500px]">
              <p className="text-xs font-semibold text-destructive uppercase tracking-wide">Error</p>
              <pre className="font-mono text-sm text-destructive whitespace-pre-wrap">{error}</pre>
            </div>
          ) : (
            <Textarea readOnly value={formatted} placeholder="Formatted YAML will appear here..."
              className="font-mono text-[13px] min-h-[500px] resize-y bg-muted/30 border-border/60" />
          )}
        </div>
      </div>
    </ToolShell>
  );
}
