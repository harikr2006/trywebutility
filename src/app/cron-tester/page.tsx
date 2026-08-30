"use client";
import { useState, useEffect } from "react";
import ToolShell from "@/components/shared/ToolShell";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { validateCron, cronToHuman, getNextRuns } from "@/lib/tools/cron";

const PRESETS = [
  { label: "Every minute", value: "*/1 * * * *" },
  { label: "Every 5 min", value: "*/5 * * * *" },
  { label: "Hourly", value: "0 * * * *" },
  { label: "Daily at midnight", value: "0 0 * * *" },
  { label: "Weekly", value: "0 0 * * 0" },
];

const FIELD_LEGEND = [
  { field: "Minute", range: "0-59", special: "* , - /" },
  { field: "Hour", range: "0-23", special: "* , - /" },
  { field: "Day of Month", range: "1-31", special: "* , - / ? L W" },
  { field: "Month", range: "1-12", special: "* , - /" },
  { field: "Day of Week", range: "0-7", special: "* , - / ? L #" },
];

export default function CronTesterPage() {
  const [expression, setExpression] = useState("*/5 * * * *");
  const [result, setResult] = useState<null | { valid: boolean; human: string; nextRuns: Date[] }>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!expression.trim()) {
      setResult(null);
      setError(null);
      return;
    }
    try {
      const valid = validateCron(expression);
      if (!valid) {
        setResult(null);
        setError("Invalid cron expression.");
        return;
      }
      const human = cronToHuman(expression);
      const nextRuns = getNextRuns(expression, 10);
      setResult({ valid: true, human, nextRuns });
      setError(null);
    } catch (e: unknown) {
      setResult(null);
      setError(e instanceof Error ? e.message : "Invalid cron expression.");
    }
  }, [expression]);

  return (
    <ToolShell title="Cron Expression Tester" description="Validate cron expressions, view a human-readable description, and preview the next 10 scheduled run times.">
      <div className="space-y-5">
        {/* Input row */}
        <div className="flex gap-2">
          <input
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="*/5 * * * *"
            className="flex-1 h-9 font-mono rounded-lg border border-border/60 bg-muted/30 px-3 text-sm focus:ring-2 focus:ring-primary/30 focus:outline-none"
          />
          <Button size="sm" className="h-9" onClick={() => setExpression(expression)}>
            Test
          </Button>
          <Button size="sm" variant="outline" className="h-9" onClick={() => { setExpression(""); setResult(null); setError(null); }}>
            Clear
          </Button>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <Button
              key={preset.value}
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={() => setExpression(preset.value)}
            >
              {preset.label}
            </Button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="flex gap-2 rounded-lg border border-destructive/40 bg-destructive/8 p-3 text-sm text-destructive font-mono">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Valid result */}
        {result?.valid && (
          <div className="space-y-4">
            <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Human Readable</p>
              <p className="text-sm font-medium">{result.human}</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Next 10 Run Times</label>
              <div className="mt-2 rounded-lg border border-border/60 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/40 border-b border-border/60">
                      <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground w-12">#</th>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground">Scheduled Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.nextRuns.map((date, i) => (
                      <tr key={i} className={cn("border-b border-border/40 last:border-0", i % 2 === 0 ? "bg-background" : "bg-muted/20")}>
                        <td className="px-3 py-2 text-xs text-muted-foreground font-mono">{i + 1}</td>
                        <td className="px-3 py-2 font-mono text-xs">
                          {date.toLocaleString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false,
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Field legend */}
        <div>
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Field Reference</label>
          <div className="mt-2 rounded-lg border border-border/60 overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/40 border-b border-border/60">
                  <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Field</th>
                  <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Allowed Values</th>
                  <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Special Characters</th>
                </tr>
              </thead>
              <tbody>
                {FIELD_LEGEND.map((row, i) => (
                  <tr key={row.field} className={cn("border-b border-border/40 last:border-0", i % 2 === 0 ? "bg-background" : "bg-muted/20")}>
                    <td className="px-3 py-2 font-medium">{row.field}</td>
                    <td className="px-3 py-2 font-mono text-muted-foreground">{row.range}</td>
                    <td className="px-3 py-2 font-mono text-muted-foreground">{row.special}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
