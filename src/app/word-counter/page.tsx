"use client";
import { useState, useMemo } from "react";
import ToolShell from "@/components/shared/ToolShell";
import { Textarea } from "@/components/ui/textarea";
import { analyzeText, type TextStats } from "@/lib/tools/word-counter";

interface StatCardProps {
  label: string;
  value: string | number;
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-lg border bg-card p-3 text-center">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}

export default function WordCounterPage() {
  const [input, setInput] = useState("");

  const stats: TextStats = useMemo(() => analyzeText(input), [input]);

  const readingTimeLabel =
    stats.readingTimeMin === 1 ? "1 min" : `${stats.readingTimeMin} min`;

  return (
    <ToolShell title="Word Counter" description="Count words, characters, sentences, paragraphs, and estimate reading time — live as you type.">
      <div className="space-y-5">
        {/* Textarea */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Your Text</label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Start typing or paste your text here..."
            className="font-mono text-[13px] min-h-64 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
          />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Words" value={stats.words} />
          <StatCard label="Characters" value={stats.chars} />
          <StatCard label="Characters (no spaces)" value={stats.charsNoSpaces} />
          <StatCard label="Lines" value={stats.lines} />
          <StatCard label="Sentences" value={stats.sentences} />
          <StatCard label="Paragraphs" value={stats.paragraphs} />
          <StatCard label="Reading Time" value={readingTimeLabel} />
          <StatCard label="Unique Words" value={stats.uniqueWords} />
        </div>
      </div>
    </ToolShell>
  );
}
