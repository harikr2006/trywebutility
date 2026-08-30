"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { calcSpecificity, compareSpecificity, type Specificity } from "@/lib/tools/css-specificity";

function SpecificityBadges({ spec }: { spec: Specificity }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="rounded px-2 py-0.5 text-xs font-semibold bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/20">
        IDs: {spec.ids}
      </span>
      <span className="rounded px-2 py-0.5 text-xs font-semibold bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20">
        Classes: {spec.classes}
      </span>
      <span className="rounded px-2 py-0.5 text-xs font-semibold bg-green-500/15 text-green-600 dark:text-green-400 border border-green-500/20">
        Elements: {spec.elements}
      </span>
      <span className="rounded px-2 py-0.5 text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
        Score: ({spec.score})
      </span>
      <span className="rounded px-2 py-0.5 text-xs font-semibold bg-muted text-muted-foreground border border-border/60">
        Total: {spec.total}
      </span>
    </div>
  );
}

export default function CssSpecificityPage() {
  const [selectorA, setSelectorA] = useState("");
  const [selectorB, setSelectorB] = useState("");

  const resultA = calcSpecificity(selectorA);
  const resultB = calcSpecificity(selectorB);

  const comparison =
    resultA.result && resultB.result
      ? compareSpecificity(resultA.result, resultB.result)
      : null;

  const winnerLabel =
    comparison === 1
      ? "First selector wins"
      : comparison === -1
      ? "Second selector wins"
      : comparison === 0
      ? "Equal specificity"
      : null;

  return (
    <ToolShell
      title="CSS Specificity Calculator"
      description="Calculate the specificity score (IDs, classes, elements) for any CSS selector."
    >
      <div className="space-y-4">
        {/* Selector A */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            CSS Selector
          </label>
          <Textarea
            value={selectorA}
            onChange={(e) => setSelectorA(e.target.value)}
            placeholder="e.g. #nav .menu > li:hover"
            className="font-mono text-[13px] min-h-16 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
          />
        </div>

        {resultA.error && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{resultA.error}</span>
          </div>
        )}

        {resultA.result && (
          <div className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Result</p>
            <SpecificityBadges spec={resultA.result} />
          </div>
        )}

        {/* Compare section */}
        <div className="border-t border-border/40 pt-4 space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Compare with another selector (optional)
          </p>

          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-muted-foreground shrink-0">vs.</span>
            <Textarea
              value={selectorB}
              onChange={(e) => setSelectorB(e.target.value)}
              placeholder="e.g. div.container p"
              className="font-mono text-[13px] min-h-16 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
            />
          </div>

          {resultB.error && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{resultB.error}</span>
            </div>
          )}

          {resultB.result && (
            <div className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-2">
              <SpecificityBadges spec={resultB.result} />
            </div>
          )}
        </div>

        {/* Winner banner */}
        {winnerLabel && (
          <div
            className={`rounded-lg border px-4 py-2.5 text-sm font-semibold text-center ${
              comparison === 0
                ? "bg-muted/30 border-border/60 text-muted-foreground"
                : "bg-primary/10 border-primary/20 text-primary"
            }`}
          >
            {winnerLabel}
            {comparison !== 0 && resultA.result && resultB.result && (
              <span className="ml-2 font-normal text-muted-foreground text-xs">
                ({comparison === 1 ? resultA.result.score : resultB.result.score} &gt;{" "}
                {comparison === 1 ? resultB.result.score : resultA.result.score})
              </span>
            )}
          </div>
        )}

        {/* Reference */}
        <div className="rounded-lg border border-border/60 bg-muted/20 p-3 space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Specificity Rules
          </p>
          <ul className="text-xs text-muted-foreground space-y-1 list-none">
            <li>
              <span className="inline-block rounded px-1.5 py-0.5 bg-red-500/15 text-red-600 dark:text-red-400 font-semibold mr-1">a</span>
              ID selectors (#id)
            </li>
            <li>
              <span className="inline-block rounded px-1.5 py-0.5 bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 font-semibold mr-1">b</span>
              Class selectors (.class), attribute selectors ([attr]), pseudo-classes (:hover)
            </li>
            <li>
              <span className="inline-block rounded px-1.5 py-0.5 bg-green-500/15 text-green-600 dark:text-green-400 font-semibold mr-1">c</span>
              Element selectors (div), pseudo-elements (::before)
            </li>
            <li className="pt-0.5 text-muted-foreground/70">
              Total = a×100 + b×10 + c. Higher score wins.
            </li>
          </ul>
        </div>
      </div>
    </ToolShell>
  );
}
