"use client";
import { useState, useMemo } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import {
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toKebabCase,
  toConstantCase,
  toTitleCase,
  toLowerCase,
  toUpperCase,
} from "@/lib/tools/text-case";

interface CaseResult {
  label: string;
  transform: (s: string) => string;
}

const CASES: CaseResult[] = [
  { label: "camelCase", transform: toCamelCase },
  { label: "PascalCase", transform: toPascalCase },
  { label: "snake_case", transform: toSnakeCase },
  { label: "kebab-case", transform: toKebabCase },
  { label: "CONSTANT_CASE", transform: toConstantCase },
  { label: "Title Case", transform: toTitleCase },
  { label: "lowercase", transform: toLowerCase },
  { label: "UPPERCASE", transform: toUpperCase },
];

export default function TextCasePage() {
  const [input, setInput] = useState("");

  const results = useMemo(
    () => CASES.map((c) => ({ label: c.label, value: c.transform(input) })),
    [input]
  );

  return (
    <ToolShell title="Text Case Converter" description="Transform your text into any case style — camelCase, PascalCase, snake_case, kebab-case, and more.">
      <div className="space-y-5">
        {/* Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Input Text</label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste text to convert..."
            className="font-mono text-[13px] min-h-24 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
          />
        </div>

        {/* Results grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {results.map(({ label, value }) => (
            <div key={label} className="rounded-lg border bg-card p-3 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {label}
                </span>
                <CopyButton text={value} />
              </div>
              <p className="font-mono text-sm break-all text-foreground min-h-[1.25rem]">
                {value || <span className="text-muted-foreground/50 italic">—</span>}
              </p>
            </div>
          ))}
        </div>
      </div>
    </ToolShell>
  );
}

