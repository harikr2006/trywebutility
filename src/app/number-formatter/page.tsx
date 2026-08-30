"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { formatNumber, LOCALES, CURRENCIES, FormatOptions } from "@/lib/tools/number-formatter";

export default function NumberFormatterPage() {
  const [value, setValue] = useState("1234567.89");
  const [style, setStyle] = useState<FormatOptions["style"]>("decimal");
  const [locale, setLocale] = useState("en-US");
  const [currency, setCurrency] = useState("USD");
  const [notation, setNotation] = useState<FormatOptions["notation"]>("standard");
  const [minFrac, setMinFrac] = useState("2");
  const [maxFrac, setMaxFrac] = useState("2");
  const [grouping, setGrouping] = useState(true);

  const { output, error } = formatNumber(Number(value), {
    locale, style, currency, notation,
    minimumFractionDigits: Number(minFrac),
    maximumFractionDigits: Number(maxFrac),
    useGrouping: grouping,
  });

  const selectCls = "h-9 rounded-md border border-border/60 bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";
  const inputCls = "h-9 rounded-md border border-border/60 bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <ToolShell title="Number Formatter" description="Format numbers with any locale, currency, notation, and decimal options using the Intl API.">
      <div className="space-y-5 max-w-xl">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Number</label>
          <input type="number" value={value} onChange={(e) => setValue(e.target.value)}
            className={`w-full ${inputCls} font-mono text-base`} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Style</label>
            <select value={style} onChange={(e) => setStyle(e.target.value as FormatOptions["style"])} className={`w-full ${selectCls}`}>
              <option value="decimal">Decimal</option>
              <option value="currency">Currency</option>
              <option value="percent">Percent</option>
              <option value="unit">Unit</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Locale</label>
            <select value={locale} onChange={(e) => setLocale(e.target.value)} className={`w-full ${selectCls}`}>
              {LOCALES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
          </div>
          {style === "currency" && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={`w-full ${selectCls}`}>
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Notation</label>
            <select value={notation} onChange={(e) => setNotation(e.target.value as FormatOptions["notation"])} className={`w-full ${selectCls}`}>
              <option value="standard">Standard</option>
              <option value="compact">Compact</option>
              <option value="scientific">Scientific</option>
              <option value="engineering">Engineering</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Min Decimals</label>
            <input type="number" min={0} max={20} value={minFrac} onChange={(e) => setMinFrac(e.target.value)} className={`w-full ${inputCls}`} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Max Decimals</label>
            <input type="number" min={0} max={20} value={maxFrac} onChange={(e) => setMaxFrac(e.target.value)} className={`w-full ${inputCls}`} />
          </div>
        </div>

        <label className="flex items-center gap-1.5 text-sm cursor-pointer">
          <input type="checkbox" checked={grouping} onChange={(e) => setGrouping(e.target.checked)} className="h-4 w-4 accent-primary" />
          Use thousands separator
        </label>

        {error ? (
          <div className="rounded-lg border border-destructive/40 bg-destructive/8 px-4 py-3 text-sm text-destructive font-mono">{error}</div>
        ) : (
          <div className="rounded-xl border-2 border-primary/40 bg-muted/20 px-5 py-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Formatted Output</p>
              <p className="font-mono text-2xl font-black text-foreground">{output}</p>
            </div>
            <CopyButton text={output} />
          </div>
        )}

        {/* All locales preview */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Preview across locales</label>
          <div className="rounded-lg border border-border/60 overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {LOCALES.map(l => {
                  const { output: o } = formatNumber(Number(value), { locale: l.code, style, currency, notation, minimumFractionDigits: Number(minFrac), maximumFractionDigits: Number(maxFrac), useGrouping: grouping });
                  return (
                    <tr key={l.code} className={`border-b border-border/40 last:border-0 ${l.code === locale ? "bg-primary/5" : ""}`}>
                      <td className="px-4 py-2.5 text-muted-foreground">{l.label}</td>
                      <td className="px-4 py-2.5 font-mono text-right text-foreground">{o}</td>
                      <td className="px-4 py-2.5 text-right"><CopyButton text={o} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
