export interface FormatOptions {
  locale: string;
  style: "decimal" | "currency" | "percent" | "unit";
  currency: string;
  unit: string;
  minimumFractionDigits: number;
  maximumFractionDigits: number;
  useGrouping: boolean;
  notation: "standard" | "compact" | "scientific" | "engineering";
}

export function formatNumber(value: number, opts: Partial<FormatOptions> = {}): { output: string; error: string | null } {
  try {
    const o: Intl.NumberFormatOptions = {
      style: opts.style ?? "decimal",
      minimumFractionDigits: opts.minimumFractionDigits ?? 0,
      maximumFractionDigits: opts.maximumFractionDigits ?? 6,
      useGrouping: opts.useGrouping ?? true,
      notation: opts.notation ?? "standard",
    };
    if (o.style === "currency") o.currency = opts.currency ?? "USD";
    if (o.style === "unit") o.unit = opts.unit ?? "meter";
    const locale = opts.locale ?? "en-US";
    const formatter = new Intl.NumberFormat(locale, o);
    return { output: formatter.format(value), error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "Format error" };
  }
}

export const LOCALES = [
  { code: "en-US", label: "English (US)" },
  { code: "en-GB", label: "English (UK)" },
  { code: "de-DE", label: "German" },
  { code: "fr-FR", label: "French" },
  { code: "ja-JP", label: "Japanese" },
  { code: "zh-CN", label: "Chinese (Simplified)" },
  { code: "hi-IN", label: "Hindi" },
  { code: "ar-SA", label: "Arabic" },
  { code: "pt-BR", label: "Portuguese (Brazil)" },
  { code: "es-ES", label: "Spanish" },
];

export const CURRENCIES = ["USD","EUR","GBP","JPY","CNY","INR","AUD","CAD","CHF","BRL","MXN","KRW","SGD","AED"];
