"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { parseURL } from "@/lib/tools/url-parser";
import { AlertCircle } from "lucide-react";

export default function URLParserPage() {
  const [input, setInput] = useState("https://example.com:8080/path/to/page?utm_source=google&q=hello+world#section");
  const parsed = parseURL(input);

  const fields: [string, string][] = parsed.error ? [] : [
    ["Protocol", parsed.protocol],
    ["Host", parsed.host],
    ["Hostname", parsed.hostname],
    ["Port", parsed.port],
    ["Pathname", parsed.pathname],
    ["Search", parsed.search],
    ["Hash", parsed.hash],
    ["Origin", parsed.origin],
  ];

  return (
    <ToolShell title="URL Parser" description="Break any URL into its components — protocol, host, path, query params, and fragment.">
      <div className="space-y-5 max-w-2xl">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">URL</label>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
            className="w-full h-10 rounded-md border border-border/60 bg-background px-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>

        {parsed.error && (
          <div className="flex gap-2 text-sm text-destructive"><AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /><span>{parsed.error}</span></div>
        )}

        {fields.length > 0 && (
          <div className="rounded-lg border border-border/60 overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {fields.filter(([, v]) => v).map(([label, value]) => (
                  <tr key={label} className="border-b border-border/40 last:border-0 hover:bg-muted/20">
                    <td className="px-4 py-2.5 text-muted-foreground font-medium w-28 shrink-0">{label}</td>
                    <td className="px-4 py-2.5 font-mono text-foreground break-all">{value}</td>
                    <td className="px-4 py-2.5 text-right"><CopyButton text={value} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {parsed.params.length > 0 && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Query Parameters ({parsed.params.length})</label>
            <div className="rounded-lg border border-border/60 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b border-border/60">
                    <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Key</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">Value</th>
                    <th className="px-4 py-2 w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {parsed.params.map(({ key, value }, i) => (
                    <tr key={i} className="border-b border-border/40 last:border-0 hover:bg-muted/20">
                      <td className="px-4 py-2.5 font-mono text-primary">{key}</td>
                      <td className="px-4 py-2.5 font-mono text-foreground">{value}</td>
                      <td className="px-4 py-2.5 text-right"><CopyButton text={value} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
