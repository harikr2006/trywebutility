"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Rule {
  id: number;
  userAgent: string;
  type: "Allow" | "Disallow";
  path: string;
}

let nextId = 1;

function buildRobotsTxt(rules: Rule[], sitemap: string): string {
  const groups: Record<string, { allows: string[]; disallows: string[] }> = {};
  for (const r of rules) {
    if (!r.userAgent.trim() || !r.path.trim()) continue;
    if (!groups[r.userAgent]) groups[r.userAgent] = { allows: [], disallows: [] };
    if (r.type === "Allow") groups[r.userAgent].allows.push(r.path);
    else groups[r.userAgent].disallows.push(r.path);
  }
  const lines: string[] = [];
  for (const [ua, { allows, disallows }] of Object.entries(groups)) {
    lines.push(`User-agent: ${ua}`);
    for (const p of allows) lines.push(`Allow: ${p}`);
    for (const p of disallows) lines.push(`Disallow: ${p}`);
    lines.push("");
  }
  if (sitemap.trim()) lines.push(`Sitemap: ${sitemap.trim()}`);
  return lines.join("\n").trim();
}

function downloadFile(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

const UA_PRESETS = ["*", "Googlebot", "Bingbot", "Slurp", "DuckDuckBot"];
const labelClass = "text-xs font-semibold text-muted-foreground uppercase tracking-wide";
const inputClass =
  "rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

export default function RobotsTxtPage() {
  const [rules, setRules] = useState<Rule[]>([
    { id: nextId++, userAgent: "*", type: "Allow", path: "/" },
  ]);
  const [sitemap, setSitemap] = useState("");

  function addRule() {
    setRules((prev) => [...prev, { id: nextId++, userAgent: "*", type: "Disallow", path: "" }]);
  }

  function updateRule(id: number, field: keyof Omit<Rule, "id">, val: string) {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: val } : r)));
  }

  function deleteRule(id: number) {
    setRules((prev) => prev.filter((r) => r.id !== id));
  }

  const output = buildRobotsTxt(rules, sitemap);

  return (
    <ToolShell
      title="Robots.txt Generator"
      description="Build a robots.txt file by defining crawl rules for search engine bots."
    >
      <div className="space-y-6 max-w-3xl">
        <div className="space-y-3">
          <p className={labelClass}>Rules</p>
          {rules.map((rule) => (
            <div key={rule.id} className="flex flex-wrap items-center gap-2">
              <select
                value={rule.userAgent}
                onChange={(e) => updateRule(rule.id, "userAgent", e.target.value)}
                className={`${inputClass} w-36`}
              >
                {UA_PRESETS.map((ua) => (
                  <option key={ua} value={ua}>
                    {ua}
                  </option>
                ))}
              </select>
              <input
                className={`${inputClass} w-28`}
                placeholder="custom bot"
                value={UA_PRESETS.includes(rule.userAgent) ? "" : rule.userAgent}
                onChange={(e) => updateRule(rule.id, "userAgent", e.target.value || "*")}
              />
              <select
                value={rule.type}
                onChange={(e) =>
                  updateRule(rule.id, "type", e.target.value as "Allow" | "Disallow")
                }
                className={`${inputClass} w-28`}
              >
                <option value="Allow">Allow</option>
                <option value="Disallow">Disallow</option>
              </select>
              <input
                className={`${inputClass} flex-1 min-w-32`}
                placeholder="/path"
                value={rule.path}
                onChange={(e) => updateRule(rule.id, "path", e.target.value)}
              />
              <button
                onClick={() => deleteRule(rule.id)}
                className="text-muted-foreground hover:text-destructive transition-colors text-xs px-2 py-1"
              >
                Remove
              </button>
            </div>
          ))}
          <Button size="sm" variant="outline" onClick={addRule} className="mt-1">
            + Add Rule
          </Button>
        </div>

        <div className="space-y-1.5">
          <label className={labelClass}>Sitemap URL (optional)</label>
          <input
            className={`${inputClass} w-full`}
            placeholder="https://example.com/sitemap.xml"
            value={sitemap}
            onChange={(e) => setSitemap(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className={labelClass}>Preview</p>
            <div className="flex gap-2 items-center">
              <CopyButton text={output} />
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                onClick={() => downloadFile(output, "robots.txt")}
              >
                Download
              </Button>
            </div>
          </div>
          <pre className="rounded-lg bg-muted/30 border border-border/60 px-4 py-3 font-mono text-sm overflow-auto min-h-28 whitespace-pre">
            {output || "# Add rules above"}
          </pre>
        </div>
      </div>
    </ToolShell>
  );
}
