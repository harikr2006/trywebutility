"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import { markdownToHTML, markdownTableToHTML } from "@/lib/tools/markdown-html";

const SAMPLE_DOC = `# Hello World

This is a **bold** statement and _italic_ text.

## Features
- Item one
- Item two
- Item three

> A blockquote example`;

const SAMPLE_TABLE = `| Name | Age | City |
|------|-----|------|
| Alice | 30 | New York |
| Bob | 25 | London |`;

export default function MarkdownHTMLPage() {
  const [mode, setMode] = useState<"full" | "table">("table");
  const [input, setInput] = useState(SAMPLE_TABLE);

  const { html, error } = mode === "table" ? markdownTableToHTML(input) : markdownToHTML(input);

  return (
    <ToolShell title="Markdown → HTML" description="Convert Markdown documents or tables to clean HTML markup.">
      <div className="space-y-4">
        <div className="flex gap-2">
          <button onClick={() => { setMode("table"); setInput(SAMPLE_TABLE); }}
            className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${mode === "table" ? "bg-primary text-primary-foreground border-primary" : "bg-muted/30 text-muted-foreground border-border/60 hover:bg-muted/50"}`}>
            Table Only
          </button>
          <button onClick={() => { setMode("full"); setInput(SAMPLE_DOC); }}
            className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${mode === "full" ? "bg-primary text-primary-foreground border-primary" : "bg-muted/30 text-muted-foreground border-border/60 hover:bg-muted/50"}`}>
            Full Document
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center h-7">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Markdown Input</label>
            </div>
            <Textarea value={input} onChange={(e) => setInput(e.target.value)}
              className="font-mono text-[13px] min-h-[400px] resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between h-7">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">HTML Output</label>
              <CopyButton text={html} />
            </div>
            {error ? (
              <div className="flex gap-2 rounded-lg border border-destructive/40 bg-destructive/8 p-3 text-sm text-destructive min-h-[400px]">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /><span>{error}</span>
              </div>
            ) : (
              <Textarea readOnly value={html} className="font-mono text-[13px] min-h-[400px] resize-y bg-muted/30 border-border/60" />
            )}
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
