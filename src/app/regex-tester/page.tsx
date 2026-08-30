"use client";

import { useState, useMemo } from "react";
import ToolShell from "@/components/shared/ToolShell";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { testRegex, highlightMatches } from "@/lib/tools/regex";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const ALL_FLAGS = [
  { flag: "g", label: "g", title: "global" },
  { flag: "i", label: "i", title: "case-insensitive" },
  { flag: "m", label: "m", title: "multiline" },
  { flag: "s", label: "s", title: "dotAll" },
];

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("");

  const result = useMemo(() => {
    if (!pattern || !testString) return null;
    return testRegex(pattern, flags, testString);
  }, [pattern, flags, testString]);

  function toggleFlag(flag: string) {
    setFlags((prev) =>
      prev.includes(flag) ? prev.replace(flag, "") : prev + flag
    );
  }

  const highlighted = useMemo(() => {
    if (!result || result.error || !result.matches.length) return null;
    return highlightMatches(testString, result.matches);
  }, [result, testString]);

  const matchCount = result?.matches.length ?? 0;

  return (
    <ToolShell
      title="Regex Tester"
      description="Test regular expressions with live match highlighting. Results update as you type."
    >
      {/* Pattern row */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pattern</label>
        <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/40 transition-all">
          <span className="font-mono text-muted-foreground text-base select-none">/</span>
          <input
            type="text"
            className="flex-1 font-mono text-[13px] bg-transparent focus:outline-none placeholder:text-muted-foreground/50"
            placeholder="your-pattern-here"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            spellCheck={false}
          />
          <span className="font-mono text-muted-foreground text-base select-none">/</span>
          <span className="font-mono text-sm text-primary font-medium min-w-4">{flags || "—"}</span>
        </div>
      </div>

      {/* Flags row */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Flags</span>
        <div className="flex gap-1">
          {ALL_FLAGS.map(({ flag, label, title: t }) => (
            <Button
              key={flag}
              size="sm"
              variant={flags.includes(flag) ? "default" : "outline"}
              className="h-7 w-7 p-0 font-mono text-xs"
              onClick={() => toggleFlag(flag)}
              title={t}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Test string */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Test String</label>
        <Textarea
          className="font-mono text-[13px] min-h-32 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
          placeholder="Enter test string here..."
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          spellCheck={false}
        />
      </div>

      {/* Results */}
      {result && (
        <div className="flex flex-col gap-3">
          {result.error ? (
            <div className="flex gap-2 rounded-lg border border-destructive/40 bg-destructive/8 p-3 text-sm text-destructive font-mono">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{result.error}</span>
            </div>
          ) : (
            <>
              {/* Match count badge */}
              <div className="flex items-center gap-2">
                <span className={cn(
                  "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full",
                  matchCount > 0
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                    : "bg-muted text-muted-foreground"
                )}>
                  {matchCount} {matchCount === 1 ? "match" : "matches"}
                </span>
              </div>

              {/* Highlighted preview */}
              {highlighted && (
                <div className="rounded-xl border bg-card p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                    Highlighted Matches
                  </p>
                  <div
                    className="font-mono text-[13px] whitespace-pre-wrap break-words leading-relaxed [&_mark]:bg-yellow-200 [&_mark]:text-yellow-900 [&_mark]:dark:bg-yellow-500/30 [&_mark]:dark:text-yellow-300 [&_mark]:rounded [&_mark]:px-0.5 [&_mark]:not-italic"
                    dangerouslySetInnerHTML={{ __html: highlighted }}
                  />
                </div>
              )}

              {/* Match table */}
              {matchCount > 0 && (
                <div className="rounded-xl border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 border-b">
                        <th className="text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground w-10">#</th>
                        <th className="text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Match</th>
                        <th className="text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground w-20">Index</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.matches.map((m, i) => (
                        <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-2 text-xs text-muted-foreground font-mono">{i + 1}</td>
                          <td className="px-4 py-2 font-mono text-xs">
                            <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300 rounded px-1.5 py-0.5">
                              {m.match || <em className="text-muted-foreground not-italic">(empty)</em>}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-xs text-muted-foreground font-mono">{m.index}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </ToolShell>
  );
}
