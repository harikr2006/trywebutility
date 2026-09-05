"use client";
import { useState, useCallback } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";

// ─── HSL ↔ HEX helpers ───────────────────────────────────────────────────────

function hexToHsl(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  if (h.length !== 6) return [0, 0, 50];
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let hDeg = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) hDeg = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) hDeg = ((b - r) / d + 2) / 6;
    else hDeg = ((r - g) / d + 4) / 6;
  }
  return [Math.round(hDeg * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  const sl = s / 100;
  const ll = l / 100;
  const a = sl * Math.min(ll, 1 - ll);
  const channel = (n: number) => {
    const k = (n + h / 30) % 12;
    const col = ll - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * col).toString(16).padStart(2, "0");
  };
  return `#${channel(0)}${channel(8)}${channel(4)}`;
}

// ─── Scale generation ─────────────────────────────────────────────────────────

const SHADE_MAP: [number, number][] = [
  [50, 97], [100, 94], [200, 87], [300, 77],
  [400, 66], [500, 55], [600, 45], [700, 36],
  [800, 28], [900, 20], [950, 12],
];

function generateScale(baseHex: string): { shade: number; hex: string }[] {
  const [h, s] = hexToHsl(baseHex);
  const effectiveSat = Math.max(s, 40); // ensure minimum vibrancy
  return SHADE_MAP.map(([shade, l]) => ({
    shade,
    hex: hslToHex(h, effectiveSat, l),
  }));
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function textColor(hex: string): string {
  const [r, g, b] = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#111827" : "#f9fafb";
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TailwindColorsPage() {
  const [baseHex, setBaseHex] = useState("#6366f1");
  const [hexInput, setHexInput] = useState("#6366f1");
  const [colorName, setColorName] = useState("brand");

  const applyHex = useCallback((val: string) => {
    const clean = val.startsWith("#") ? val : `#${val}`;
    if (/^#[0-9a-fA-F]{6}$/.test(clean)) {
      setBaseHex(clean);
      setHexInput(clean);
    }
  }, []);

  const scale = generateScale(baseHex);

  const configOutput = [
    `colors: {`,
    `  ${colorName}: {`,
    ...scale.map(({ shade, hex }) => `    ${shade}: '${hex}',`),
    `  }`,
    `}`,
  ].join("\n");

  const cssVarsOutput = scale
    .map(({ shade, hex }) => `  --color-${colorName}-${shade}: ${hex};`)
    .join("\n");
  const cssVarsFull = `:root {\n${cssVarsOutput}\n}`;

  return (
    <ToolShell
      title="Tailwind Color Generator"
      description="Pick a base color and get a full 11-step Tailwind-compatible color scale with ready-to-paste config and CSS variable outputs."
    >
      <div className="flex flex-col gap-6">
        {/* Inputs */}
        <div className="flex flex-wrap items-end gap-4 p-4 rounded-lg border border-border/60 bg-muted/10">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Base Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={baseHex}
                onChange={(e) => {
                  setBaseHex(e.target.value);
                  setHexInput(e.target.value);
                }}
                className="h-9 w-12 rounded border border-border/60 bg-background cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={hexInput}
                onChange={(e) => setHexInput(e.target.value)}
                onBlur={(e) => applyHex(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyHex(hexInput)}
                className="h-9 w-32 rounded-md border border-border/60 bg-background px-3 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary/30"
                maxLength={7}
                placeholder="#6366f1"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Color Name
            </label>
            <input
              type="text"
              value={colorName}
              onChange={(e) => setColorName(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
              className="h-9 w-32 rounded-md border border-border/60 bg-background px-3 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary/30"
              placeholder="brand"
            />
          </div>
        </div>

        {/* Swatches */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Color Scale
          </span>
          <div className="rounded-lg border border-border/60 overflow-hidden">
            {scale.map(({ shade, hex }) => (
              <div
                key={shade}
                className="flex items-center justify-between px-4 py-2.5"
                style={{ backgroundColor: hex }}
              >
                <span
                  className="text-sm font-semibold font-mono"
                  style={{ color: textColor(hex) }}
                >
                  {shade}
                </span>
                <span
                  className="text-sm font-mono"
                  style={{ color: textColor(hex), opacity: 0.85 }}
                >
                  {hex.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tailwind config */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between h-7">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Tailwind Config
            </span>
            <CopyButton text={configOutput} />
          </div>
          <pre className="rounded-lg border border-border/60 bg-muted/30 p-4 text-[13px] font-mono overflow-x-auto text-foreground max-h-64">
            {configOutput}
          </pre>
        </div>

        {/* CSS variables */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between h-7">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              CSS Variables
            </span>
            <CopyButton text={cssVarsFull} />
          </div>
          <pre className="rounded-lg border border-border/60 bg-muted/30 p-4 text-[13px] font-mono overflow-x-auto text-foreground max-h-48">
            {cssVarsFull}
          </pre>
        </div>
      </div>
    </ToolShell>
  );
}
