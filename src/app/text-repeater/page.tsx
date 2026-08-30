"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import { repeatText } from "@/lib/tools/text-repeater";

export default function TextRepeaterPage() {
  const [text, setText] = useState("");
  const [count, setCount] = useState(3);
  const [separator, setSeparator] = useState(", ");
  const [newlineAfterEach, setNewlineAfterEach] = useState(false);

  const result = repeatText(text, count, separator, newlineAfterEach);

  return (
    <ToolShell
      title="Text Repeater"
      description="Repeat any text N times with a custom separator."
    >
      <div className="space-y-4">
        {/* Text Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Text to Repeat
          </label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to repeat..."
            className="font-mono text-[13px] min-h-72 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
          />
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Count */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Repeat Count
            </label>
            <input
              type="number"
              min={1}
              max={10000}
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(10000, Number(e.target.value))))}
              className="w-full rounded-md border border-border/60 bg-muted/30 px-3 py-2 font-mono text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            />
          </div>

          {/* Separator */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Separator
            </label>
            <input
              type="text"
              value={separator}
              onChange={(e) => setSeparator(e.target.value)}
              disabled={newlineAfterEach}
              placeholder=", "
              className="w-full rounded-md border border-border/60 bg-muted/30 px-3 py-2 font-mono text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-50"
            />
          </div>

          {/* Newline option */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Options
            </label>
            <label className="flex items-center gap-2 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={newlineAfterEach}
                onChange={(e) => setNewlineAfterEach(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-primary"
              />
              <span className="text-sm text-foreground">New line after each</span>
            </label>
          </div>
        </div>

        {/* Error */}
        {result.error && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{result.error}</span>
          </div>
        )}

        {/* Output */}
        {!result.error && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Output
              </label>
              {result.output && <CopyButton text={result.output} />}
            </div>
            <Textarea
              readOnly
              value={result.output}
              placeholder="Repeated text will appear here..."
              className="font-mono text-[13px] min-h-72 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
            />
            {result.output && (
              <p className="text-xs text-muted-foreground">
                Total length: {result.output.length.toLocaleString()} characters
              </p>
            )}
          </div>
        )}
      </div>
    </ToolShell>
  );
}
