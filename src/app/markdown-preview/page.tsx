"use client";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { renderMarkdown } from "@/lib/tools/markdown";

export default function MarkdownPreviewPage() {
  const [input, setInput] = useState("");
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    setHtml("");
    if (!input) return;
    const { html: rendered, error: err } = renderMarkdown(input);
    if (err) { setError(err); } else { setHtml(rendered); }
  }, [input]);

  return (
    <ToolShell
      title="Markdown Preview"
      description="Live preview for Markdown. Renders GitHub Flavored Markdown. All processing in your browser."
    >
      {/* Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Input</label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste Markdown here..."
            className="font-mono text-[13px] min-h-[500px] resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Preview</label>
            <CopyButton text={html} />
          </div>
          {error ? (
            <div className="flex gap-2 rounded-lg border border-destructive/40 bg-destructive/8 p-3 text-sm text-destructive font-mono min-h-[500px]">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          ) : (
            <div
              dangerouslySetInnerHTML={{ __html: html }}
              className="min-h-[500px] rounded-md border border-border/60 bg-muted/30 p-4 overflow-auto prose prose-sm max-w-none dark:prose-invert"
            />
          )}
          <p className="text-xs text-muted-foreground">Renders GitHub Flavored Markdown</p>
        </div>
      </div>
    </ToolShell>
  );
}
