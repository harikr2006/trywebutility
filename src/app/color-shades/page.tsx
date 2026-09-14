"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";

// ─── Color math helpers ────────────────────────────────────────────────────────

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / delta + 2) / 6;
    else h = ((r - g) / delta + 4) / 6;
  }
  return [h * 360, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

function contrastColor(hex: string): string {
  const [r, g, b] = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

// ─── Shade generation ──────────────────────────────────────────────────────────

const SHADE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const SHADE_LIGHTNESS: Record<number, number> = {
  50: 97,
  100: 94,
  200: 86,
  300: 73,
  400: 60,
  500: 50,
  600: 40,
  700: 30,
  800: 22,
  900: 14,
  950: 8,
};

interface ShadeEntry {
  shade: number;
  hex: string;
  rgb: string;
  hsl: string;
}

function generateShades(hex: string): ShadeEntry[] {
  const [h, s] = hexToHsl(hex);
  return SHADE_STEPS.map((shade) => {
    const l = SHADE_LIGHTNESS[shade];
    const shadeHex = hslToHex(h, s, l);
    const [r, g, b] = hexToRgb(shadeHex);
    return {
      shade,
      hex: shadeHex,
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: `hsl(${Math.round(h)}, ${Math.round(s)}%, ${l}%)`,
    };
  });
}

// ─── Component ─────────────────────────────────────────────────────────────────

type OutputTab = "tailwind" | "css";

export default function ColorShadesPage() {
  const [baseHex, setBaseHex] = useState("#3b82f6");
  const [hexInput, setHexInput] = useState("#3b82f6");
  const [activeTab, setActiveTab] = useState<OutputTab>("tailwind");

  const hexValid = /^#[0-9a-f]{6}$/i.test(baseHex);
  const shades = hexValid ? generateShades(baseHex) : [];

  function handleColorPicker(value: string) {
    setBaseHex(value);
    setHexInput(value);
  }

  function handleHexInput(value: string) {
    setHexInput(value);
    if (/^#[0-9a-f]{6}$/i.test(value)) {
      setBaseHex(value);
    }
  }

  const tailwindOutput = shades.length
    ? `colors: {\n  custom: {\n${shades
        .map((s) => `    ${s.shade}: '${s.hex}',`)
        .join("\n")}\n  }\n}`
    : "";

  const cssOutput = shades.length
    ? `:root {\n${shades
        .map((s) => `  --color-${s.shade}: ${s.hex};`)
        .join("\n")}\n}`
    : "";

  const currentOutput = activeTab === "tailwind" ? tailwindOutput : cssOutput;

  return (
    <ToolShell
      title="Color Shades Generator"
      description="Generate a full 11-step shade palette from any base color. Copy as Tailwind config or CSS custom properties."
    >
      <div className="space-y-6 max-w-3xl">
        {/* Color input */}
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Base Color
          </label>
          <input
            type="color"
            value={baseHex}
            onChange={(e) => handleColorPicker(e.target.value)}
            className="h-10 w-16 rounded-md border border-border/60 cursor-pointer p-0.5 bg-transparent"
          />
          <input
            type="text"
            value={hexInput}
            onChange={(e) => handleHexInput(e.target.value)}
            maxLength={7}
            placeholder="#3b82f6"
            className={`h-10 w-28 rounded-md border bg-background px-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 ${
              /^#[0-9a-f]{6}$/i.test(hexInput) || hexInput === ""
                ? "border-border/60"
                : "border-destructive text-destructive"
            }`}
          />
          {hexInput && !/^#[0-9a-f]{6}$/i.test(hexInput) && (
            <span className="text-xs text-destructive">
              Enter a valid 6-digit hex (e.g. #3b82f6)
            </span>
          )}
        </div>

        {/* Shade rows */}
        {shades.length > 0 && (
          <div className="rounded-xl border border-border/60 overflow-hidden">
            {shades.map(({ shade, hex, rgb, hsl }) => {
              const fg = contrastColor(hex);
              return (
                <div
                  key={shade}
                  className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-opacity hover:opacity-90"
                  style={{ backgroundColor: hex }}
                  onClick={() => navigator.clipboard.writeText(hex)}
                  title={`Click to copy ${hex}`}
                >
                  <span
                    className="font-mono text-xs font-bold w-9 shrink-0"
                    style={{ color: fg }}
                  >
                    {shade}
                  </span>
                  <span
                    className="font-mono text-sm font-semibold w-20 shrink-0"
                    style={{ color: fg }}
                  >
                    {hex}
                  </span>
                  <span
                    className="font-mono text-xs hidden sm:block w-40 shrink-0"
                    style={{ color: fg, opacity: 0.75 }}
                  >
                    {rgb}
                  </span>
                  <span
                    className="font-mono text-xs hidden lg:block flex-1"
                    style={{ color: fg, opacity: 0.75 }}
                  >
                    {hsl}
                  </span>
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="ml-auto shrink-0"
                  >
                    <CopyButton text={hex} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Output section */}
        {shades.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex gap-1.5">
                {(["tailwind", "css"] as OutputTab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                      activeTab === tab
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/30 text-muted-foreground border border-border/60 hover:bg-muted/50"
                    }`}
                  >
                    {tab === "tailwind" ? "Tailwind Config" : "CSS Variables"}
                  </button>
                ))}
              </div>
              <CopyButton text={currentOutput} />
            </div>
            <pre className="rounded-lg bg-muted/30 border border-border/60 px-4 py-3 font-mono text-xs overflow-x-auto leading-relaxed">
              {currentOutput}
            </pre>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
