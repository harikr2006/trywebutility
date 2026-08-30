"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import { checkContrast, hexToRgbString } from "@/lib/tools/color-contrast";
import { CheckCircle, XCircle } from "lucide-react";

const PRESETS = [
  { label: "Black on White", fg: "#000000", bg: "#ffffff" },
  { label: "White on Black", fg: "#ffffff", bg: "#000000" },
  { label: "White on Blue", fg: "#ffffff", bg: "#1d4ed8" },
  { label: "Dark on Yellow", fg: "#1a1a1a", bg: "#fef08a" },
  { label: "Gray on White", fg: "#6b7280", bg: "#ffffff" },
];

export default function ColorContrastPage() {
  const [fg, setFg] = useState("#1d1d1d");
  const [bg, setBg] = useState("#ffffff");

  const result = checkContrast(fg, bg);

  const Badge = ({ pass, label }: { pass: boolean; label: string }) => (
    <div className={`flex items-center gap-2 rounded-lg px-3 py-2 border ${pass ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800" : "bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800"}`}>
      {pass ? <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" /> : <XCircle className="h-4 w-4 text-red-500 shrink-0" />}
      <span className={`text-xs font-semibold ${pass ? "text-emerald-700 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>{label}</span>
    </div>
  );

  return (
    <ToolShell title="Color Contrast Checker" description="Check foreground/background color contrast ratios against WCAG 2.1 AA and AAA standards.">
      <div className="space-y-6 max-w-xl">
        {/* Color pickers */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Foreground (Text)", value: fg, set: setFg },
            { label: "Background", value: bg, set: setBg },
          ].map(({ label, value, set }) => (
            <div key={label} className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={value} onChange={(e) => set(e.target.value)}
                  className="h-10 w-14 rounded-md border border-border/60 cursor-pointer bg-transparent p-0.5" />
                <input type="text" value={value} onChange={(e) => set(e.target.value)} maxLength={7}
                  className="flex-1 h-10 rounded-md border border-border/60 bg-background px-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <p className="text-xs text-muted-foreground">{hexToRgbString(value)}</p>
            </div>
          ))}
        </div>

        {/* Preview */}
        <div className="rounded-xl overflow-hidden border border-border/60">
          <div className="p-6 space-y-2" style={{ backgroundColor: bg }}>
            <p className="text-2xl font-bold" style={{ color: fg }}>Large Text Sample (18pt+)</p>
            <p className="text-sm" style={{ color: fg }}>Normal text sample — this is how body copy will look at regular size (14px).</p>
            <p className="text-xs" style={{ color: fg }}>Small caption text at 12px — requires higher contrast for readability.</p>
          </div>
        </div>

        {/* Ratio & level */}
        {!result.error && (
          <>
            <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-muted/30 px-5 py-4">
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Contrast Ratio</p>
                <p className="font-mono text-3xl font-black text-foreground">{result.ratioDisplay}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">WCAG Level</p>
                <p className={`text-2xl font-black ${result.level === "Fail" ? "text-destructive" : "text-emerald-600 dark:text-emerald-400"}`}>{result.level}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Badge pass={result.aaSmall}  label="AA — Normal Text (4.5:1)" />
              <Badge pass={result.aaLarge}  label="AA — Large Text (3:1)" />
              <Badge pass={result.aaaSmall} label="AAA — Normal Text (7:1)" />
              <Badge pass={result.aaaLarge} label="AAA — Large Text (4.5:1)" />
            </div>
          </>
        )}

        {/* Presets */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Presets</label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map(p => (
              <button key={p.label} onClick={() => { setFg(p.fg); setBg(p.bg); }}
                className="rounded-full border border-border/60 px-3 py-1 text-xs font-medium hover:bg-muted/40 transition-colors">
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
