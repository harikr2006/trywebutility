function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map(c => c + c).join("") : clean;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export interface ContrastResult {
  ratio: number;
  ratioDisplay: string;
  aaLarge: boolean;
  aaSmall: boolean;
  aaaLarge: boolean;
  aaaSmall: boolean;
  level: "AAA" | "AA" | "AA Large" | "Fail";
  error: string | null;
}

export function checkContrast(fg: string, bg: string): ContrastResult {
  const fgRgb = hexToRgb(fg);
  const bgRgb = hexToRgb(bg);
  if (!fgRgb || !bgRgb) {
    return { ratio: 0, ratioDisplay: "—", aaLarge: false, aaSmall: false, aaaLarge: false, aaaSmall: false, level: "Fail", error: "Invalid hex color" };
  }
  const l1 = relativeLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
  const l2 = relativeLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  const aaLarge = ratio >= 3;
  const aaSmall = ratio >= 4.5;
  const aaaLarge = ratio >= 4.5;
  const aaaSmall = ratio >= 7;
  const level: ContrastResult["level"] = aaaSmall ? "AAA" : aaSmall ? "AA" : aaLarge ? "AA Large" : "Fail";
  return { ratio, ratioDisplay: ratio.toFixed(2) + ":1", aaLarge, aaSmall, aaaLarge, aaaSmall, level, error: null };
}

export function hexToRgbString(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return "";
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}
