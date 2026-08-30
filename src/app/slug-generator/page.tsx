"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { generateSlug, slugVariants } from "@/lib/tools/slug-generator";

export default function SlugGeneratorPage() {
  const [input, setInput] = useState("Hello World! This is a Test Post Title");
  const [separator, setSeparator] = useState<"-" | "_" | ".">(  "-");
  const [lowercase, setLowercase] = useState(true);
  const [removeStops, setRemoveStops] = useState(false);

  const slug = generateSlug(input, { separator, lowercase, removeStopWords: removeStops });
  const variants = slugVariants(input);

  return (
    <ToolShell title="Slug Generator" description="Convert any text into a clean, URL-safe slug for permalinks, IDs, and paths.">
      <div className="space-y-5 max-w-2xl">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Input Text</label>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
            className="w-full h-10 rounded-md border border-border/60 bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>

        {/* Options */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Separator</label>
            {(["-", "_", "."] as const).map(s => (
              <button key={s} onClick={() => setSeparator(s)}
                className={`rounded px-3 py-1 text-xs font-mono font-bold border transition-colors ${separator === s ? "bg-primary text-primary-foreground border-primary" : "bg-muted/30 border-border/60 hover:bg-muted/50"}`}>
                {s === "-" ? "hyphen (-)" : s === "_" ? "underscore (_)" : "dot (.)"}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-1.5 text-sm cursor-pointer">
            <input type="checkbox" checked={lowercase} onChange={(e) => setLowercase(e.target.checked)} className="h-4 w-4 accent-primary" />
            Lowercase
          </label>
          <label className="flex items-center gap-1.5 text-sm cursor-pointer">
            <input type="checkbox" checked={removeStops} onChange={(e) => setRemoveStops(e.target.checked)} className="h-4 w-4 accent-primary" />
            Remove stop words
          </label>
        </div>

        {/* Main result */}
        <div className="rounded-xl border-2 border-primary/40 bg-muted/20 px-5 py-4 flex items-center justify-between gap-3">
          <code className="font-mono text-base font-bold text-foreground break-all">{slug || "—"}</code>
          <CopyButton text={slug} />
        </div>

        {/* Variants */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">All Variants</label>
          <div className="rounded-lg border border-border/60 overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(variants).map(([label, value]) => (
                  <tr key={label} className="border-b border-border/40 last:border-0 hover:bg-muted/20">
                    <td className="px-4 py-2.5 text-muted-foreground w-36">{label}</td>
                    <td className="px-4 py-2.5 font-mono text-foreground">{value}</td>
                    <td className="px-4 py-2.5 text-right"><CopyButton text={value} /></td>
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
