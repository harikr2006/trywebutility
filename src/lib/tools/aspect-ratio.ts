export interface AspectResult {
  ratio: string;
  width: number;
  height: number;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function simplifyRatio(w: number, h: number): string {
  if (w <= 0 || h <= 0) return "N/A";
  const d = gcd(Math.round(w), Math.round(h));
  return `${Math.round(w) / d}:${Math.round(h) / d}`;
}

export function scaleByWidth(originalW: number, originalH: number, newW: number): AspectResult {
  const newH = Math.round((newW / originalW) * originalH);
  return { ratio: simplifyRatio(originalW, originalH), width: newW, height: newH };
}

export function scaleByHeight(originalW: number, originalH: number, newH: number): AspectResult {
  const newW = Math.round((newH / originalH) * originalW);
  return { ratio: simplifyRatio(originalW, originalH), width: newW, height: newH };
}

export function commonRatios(): { name: string; ratio: string; decimal: number }[] {
  return [
    { name: "16:9 (Widescreen)", ratio: "16:9", decimal: 16/9 },
    { name: "4:3 (Standard)", ratio: "4:3", decimal: 4/3 },
    { name: "1:1 (Square)", ratio: "1:1", decimal: 1 },
    { name: "21:9 (Ultrawide)", ratio: "21:9", decimal: 21/9 },
    { name: "3:2 (Photo)", ratio: "3:2", decimal: 3/2 },
    { name: "2:3 (Portrait)", ratio: "2:3", decimal: 2/3 },
    { name: "9:16 (Mobile)", ratio: "9:16", decimal: 9/16 },
  ];
}
