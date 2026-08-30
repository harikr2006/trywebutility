"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import { Textarea } from "@/components/ui/textarea";
import { analyzeReadability } from "@/lib/tools/readability";
import { AlertCircle } from "lucide-react";

const SAMPLE = `The quick brown fox jumps over the lazy dog. This sentence has been used for decades to test typefaces. It contains every letter of the alphabet at least once, making it ideal for font previews. Beyond typography, it has become a common example in many fields. The sentence is short enough to remember but long enough to be useful.`;

export default function ReadabilityPage() {
  const [text, setText] = useState(SAMPLE);
  const result = analyzeReadability(text);

  const scores = result.error ? [] : [
    { label: "Flesch Reading Ease", value: result.fleschReading, max: 100, desc: "Higher = easier to read (60–70 is ideal for general audience)" },
    { label: "Flesch-Kincaid Grade", value: result.fleschGrade, max: 20, desc: "US school grade level required to understand the text" },
    { label: "Gunning Fog Index", value: result.gunningFog, max: 20, desc: "Years of education needed — below 12 is generally accessible" },
  ];

  const stats = result.error ? [] : [
    ["Words", result.wordCount],
    ["Sentences", result.sentenceCount],
    ["Syllables", result.syllableCount],
    ["Avg words/sentence", result.avgWordsPerSentence],
    ["Avg syllables/word", result.avgSyllablesPerWord],
  ];

  return (
    <ToolShell title="Readability Score" description="Analyze text with Flesch-Kincaid, Gunning Fog, and other readability formulas.">
      <div className="space-y-5">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Text to Analyze</label>
          <Textarea value={text} onChange={(e) => setText(e.target.value)}
            placeholder="Paste your text here..."
            className="font-mono text-[13px] min-h-36 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30" />
        </div>

        {result.error ? (
          <div className="flex gap-2 text-sm text-destructive"><AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /><span>{result.error}</span></div>
        ) : (
          <>
            {result.level && (
              <div className="rounded-xl border-2 border-primary/40 bg-muted/20 px-5 py-4">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Reading Level</p>
                <p className="text-xl font-bold text-foreground">{result.level}</p>
              </div>
            )}

            <div className="space-y-4">
              {scores.map(({ label, value, max, desc }) => (
                <div key={label} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</label>
                    <span className="font-mono font-bold text-foreground">{value}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min(100, (value / max) * 100)}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-border/60 overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {stats.map(([label, value]) => (
                    <tr key={String(label)} className="border-b border-border/40 last:border-0">
                      <td className="px-4 py-2.5 text-muted-foreground">{label}</td>
                      <td className="px-4 py-2.5 font-mono font-bold text-right text-foreground">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </ToolShell>
  );
}
