"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { formatNumber, LOCALES, CURRENCIES, FormatOptions } from "@/lib/tools/number-formatter";
import { Languages, DollarSign, BarChart2, Zap } from "lucide-react";

const LOCALE_EXAMPLES = [
  { locale: "en-US", label: "English (US)", sample: "1,234,567.89", currency: "$1,234,567.89" },
  { locale: "de-DE", label: "German (Germany)", sample: "1.234.567,89", currency: "1.234.567,89 €" },
  { locale: "fr-FR", label: "French (France)", sample: "1 234 567,89", currency: "1 234 567,89 €" },
  { locale: "en-IN", label: "English (India)", sample: "12,34,567.89", currency: "₹12,34,567.89" },
  { locale: "ja-JP", label: "Japanese (Japan)", sample: "1,234,568", currency: "¥1,234,568" },
  { locale: "ar-SA", label: "Arabic (Saudi Arabia)", sample: "١٬٢٣٤٬٥٦٧٫٨٩", currency: "١٬٢٣٤٬٥٦٧٫٨٩ ر.س." },
];

const USE_CASES = [
  {
    title: "E-commerce prices",
    desc: "Show product prices in the customer's local currency and number format to build trust and reduce friction.",
    example: "$1,299.00 → ₹1,08,247.00",
    color: "bg-blue-50 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/30",
    labelColor: "text-blue-600 dark:text-blue-400",
  },
  {
    title: "Dashboard metrics",
    desc: "Use compact notation to keep large numbers readable in charts and KPI cards without truncation.",
    example: "1,250,000 → 1.25M",
    color: "bg-violet-50 border-violet-100 dark:bg-violet-950/20 dark:border-violet-900/30",
    labelColor: "text-violet-600 dark:text-violet-400",
  },
  {
    title: "Financial reports",
    desc: "Apply fixed decimal places and currency style to ensure consistent alignment in tabular financial data.",
    example: "42500 → $42,500.00",
    color: "bg-emerald-50 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30",
    labelColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    title: "Data science output",
    desc: "Scientific or engineering notation is essential for very large or very small numbers in technical reports.",
    example: "0.0000123 → 1.23E-5",
    color: "bg-amber-50 border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/30",
    labelColor: "text-amber-600 dark:text-amber-400",
  },
];

const STEPS = [
  {
    title: "Enter a number",
    text: "Type any integer or decimal — positive, negative, or scientific notation all work.",
  },
  {
    title: "Choose style & locale",
    text: "Select Decimal, Currency, or Percent style, then pick the target locale and currency code.",
  },
  {
    title: "Copy the result",
    text: "See the formatted output immediately and copy it with one click. The locale preview table shows all locales at once.",
  },
];

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
    <ToolShell title="Number Formatter" description="Format numbers for any locale, currency, or notation style using the browser's Intl API.">
      {/* Feature badges */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { icon: Languages, label: "50+ Locales" },
          { icon: DollarSign, label: "All Currencies" },
          { icon: BarChart2, label: "Compact Notation" },
          { icon: Zap, label: "Intl API" },
        ].map(({ icon: Icon, label }) => (
          <span
            key={label}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/8 text-primary border border-primary/20"
          >
            <Icon className="h-3 w-3" aria-hidden="true" />
            {label}
          </span>
        ))}
      </div>

      {/* Tool widget */}
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

      {/* How it works */}
      <section className="mt-10 pt-8 border-t border-border/60">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-5">
          How to Use
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {STEPS.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">{step.title}</p>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Use cases */}
      <section className="mt-10 pt-8 border-t border-border/60">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-5">
          Common Use Cases
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {USE_CASES.map((uc) => (
            <div key={uc.title} className={`rounded-xl border p-4 ${uc.color}`}>
              <p className={`font-semibold text-sm mb-1 ${uc.labelColor}`}>{uc.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-2">{uc.desc}</p>
              <code className="text-xs font-mono bg-background/60 px-2 py-1 rounded border border-border/40">
                {uc.example}
              </code>
            </div>
          ))}
        </div>
      </section>

      {/* Regional formatting guide */}
      <section className="mt-10 pt-8 border-t border-border/60">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-5">
          How Numbers Format by Country
        </h2>
        <div className="rounded-xl border border-border/60 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 border-b border-border/60">
                <th className="px-4 py-2.5 text-left font-semibold text-foreground">Region</th>
                <th className="px-4 py-2.5 text-right font-semibold text-foreground">Decimal</th>
                <th className="px-4 py-2.5 text-right font-semibold text-foreground">Currency</th>
              </tr>
            </thead>
            <tbody>
              {LOCALE_EXAMPLES.map((ex) => (
                <tr key={ex.locale} className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-2.5 text-muted-foreground">{ex.label}</td>
                  <td className="px-4 py-2.5 font-mono text-right text-foreground">{ex.sample}</td>
                  <td className="px-4 py-2.5 font-mono text-right text-foreground">{ex.currency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3 leading-relaxed max-w-xl">
          Notice how India uses a lakh system (groups of 2 after the first 3), Japan omits decimals for yen,
          and Arabic locales use Eastern Arabic numerals. The <strong>Intl.NumberFormat</strong> API handles all
          of these automatically when you select the right locale.
        </p>
      </section>
    </ToolShell>
  );
}
