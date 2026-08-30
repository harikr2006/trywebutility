"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import { parseEnv, entriesToJson } from "@/lib/tools/env-parser";

const PLACEHOLDER = `# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME="my_app"

# App
APP_SECRET="s3cr3t_k3y_here"
DEBUG=false`;

export default function EnvParserPage() {
  const [input, setInput] = useState(PLACEHOLDER);

  const result = parseEnv(input);
  const json = entriesToJson(result.entries);

  return (
    <ToolShell
      title="ENV File Parser"
      description="Parse .env files — extract key/value pairs, detect syntax errors, and export as JSON."
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            .env Content
          </label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={PLACEHOLDER}
            className="font-mono text-[13px] min-h-48 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
          />
        </div>

        {result.errors.length > 0 && (
          <div className="flex flex-col gap-1 rounded-lg border border-destructive/40 bg-destructive/8 p-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-destructive mb-1">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>Parse Errors</span>
            </div>
            {result.errors.map((err, i) => (
              <p key={i} className="text-xs font-mono text-destructive pl-6">
                {err}
              </p>
            ))}
          </div>
        )}

        {result.entries.length > 0 && (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Parsed Entries ({result.entries.length})
            </label>
            <div className="overflow-x-auto rounded-lg border border-border/60">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30">
                    <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-12">
                      Line
                    </th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Key
                    </th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Value
                    </th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Comment
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.entries.map((entry) => (
                    <tr
                      key={entry.line}
                      className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                        {entry.line}
                      </td>
                      <td className="px-3 py-2 font-mono text-xs font-medium text-foreground">
                        {entry.key}
                      </td>
                      <td className="px-3 py-2 font-mono text-xs text-foreground max-w-xs truncate">
                        {entry.value || <span className="text-muted-foreground italic">(empty)</span>}
                      </td>
                      <td className="px-3 py-2 text-xs text-muted-foreground italic">
                        {entry.comment}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {result.entries.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between h-7">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                JSON Export
              </label>
              <CopyButton text={json} />
            </div>
            <pre className="rounded-lg border border-border/60 bg-muted/30 p-4 text-[13px] font-mono overflow-x-auto text-foreground">
              {json}
            </pre>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
