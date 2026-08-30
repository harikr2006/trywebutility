"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import { xmlToJson } from "@/lib/tools/xml-json";

const SAMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
  <book category="fiction">
    <title lang="en">Harry Potter</title>
    <author>J.K. Rowling</author>
    <price>29.99</price>
  </book>
  <book category="tech">
    <title lang="en">Clean Code</title>
    <author>Robert Martin</author>
    <price>39.99</price>
  </book>
</bookstore>`;

export default function XMLJSONPage() {
  const [input, setInput] = useState(SAMPLE);
  const { output, error } = xmlToJson(input);

  return (
    <ToolShell title="XML → JSON" description="Convert XML documents to JSON format. All processing in your browser.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center h-7">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">XML Input</label>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste XML here..."
            className="font-mono text-[13px] min-h-[500px] resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between h-7">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">JSON Output</label>
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
              placeholder="JSON will appear here..."
              className="font-mono text-[13px] min-h-[500px] resize-y bg-muted/30 border-border/60"
            />
          )}
        </div>
      </div>
    </ToolShell>
  );
}
