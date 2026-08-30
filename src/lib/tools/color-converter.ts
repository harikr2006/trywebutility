export interface ColorResult {
  hex: string;
  rgb: string;
  hsl: string;
  r: number;
  g: number;
  b: number;
  h: number;
  s: number;
  l: number;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.replace(/^#/, "");
  let full: string;

  if (cleaned.length === 3) {
    full = cleaned
      .split("")
      .map((c) => c + c)
      .join("");
  } else if (cleaned.length === 6) {
    full = cleaned;
  } else {
    return null;
  }

  const num = parseInt(full, 16);
  if (isNaN(num)) return null;

  return {
    r: (num >> 16) & 0xff,
    g: (num >> 8) & 0xff,
    b: num & 0xff,
  };
}

export function rgbToHsl(
  r: number,
  g: number,
  b: number
): { h: number; s: number; l: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;

  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));

    if (max === rn) {
      h = ((gn - bn) / delta + (gn < bn ? 6 : 0)) / 6;
    } else if (max === gn) {
      h = ((bn - rn) / delta + 2) / 6;
    } else {
      h = ((rn - gn) / delta + 4) / 6;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToRgb(
  h: number,
  s: number,
  l: number
): { r: number; g: number; b: number } {
  const sn = s / 100;
  const ln = l / 100;

  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ln - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (h < 180) {
    [r, g, b] = [0, c, x];
  } else if (h < 240) {
    [r, g, b] = [0, x, c];
  } else if (h < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

function buildResult(r: number, g: number, b: number): ColorResult {
  const { h, s, l } = rgbToHsl(r, g, b);
  const hex =
    "#" +
    [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();

  return {
    hex,
    rgb: `rgb(${r}, ${g}, ${b})`,
    hsl: `hsl(${h}, ${s}%, ${l}%)`,
    r,
    g,
    b,
    h,
    s,
    l,
  };
}

export function parseColor(
  input: string
): { result: ColorResult | null; error: string | null } {
  const s = input.trim();

  // HEX
  if (/^#?[0-9a-fA-F]{3}$|^#?[0-9a-fA-F]{6}$/.test(s)) {
    const rgb = hexToRgb(s.startsWith("#") ? s : `#${s}`);
    if (!rgb) return { result: null, error: "Invalid hex color" };
    return { result: buildResult(rgb.r, rgb.g, rgb.b), error: null };
  }

  // rgb(r, g, b) or rgba(r, g, b, a)
  const rgbMatch = s.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]);
    const g = parseInt(rgbMatch[2]);
    const b = parseInt(rgbMatch[3]);
    if ([r, g, b].some((v) => v < 0 || v > 255)) {
      return { result: null, error: "RGB values must be 0-255" };
    }
    return { result: buildResult(r, g, b), error: null };
  }

  // hsl(h, s%, l%)
  const hslMatch = s.match(/^hsla?\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?/i);
  if (hslMatch) {
    const h = parseInt(hslMatch[1]);
    const sl = parseInt(hslMatch[2]);
    const l = parseInt(hslMatch[3]);
    if (h < 0 || h > 360 || sl < 0 || sl > 100 || l < 0 || l > 100) {
      return { result: null, error: "HSL values out of range" };
    }
    const { r, g, b } = hslToRgb(h, sl, l);
    return { result: buildResult(r, g, b), error: null };
  }

  return { result: null, error: `Unrecognized color format: "${input}"` };
}
