"use client";

import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Plus, Shuffle, Trash2, Wand2 } from "lucide-react";

interface Swatch {
  id: string;
  hex: string;
  label: string;
}

function randomHex(): string {
  return "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const c = l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
    return Math.round(255 * c).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function randomPalette(count = 5): string[] {
  const hue = Math.floor(Math.random() * 360);
  const step = 360 / count;
  return Array.from({ length: count }, (_, i) => {
    const h = (hue + i * step) % 360;
    const s = 60 + Math.random() * 25;
    const l = 38 + Math.random() * 24;
    return hslToHex(h, s, l);
  });
}

function isValidHex(val: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(val);
}

function contrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? "#000000" : "#ffffff";
}

let idCounter = 0;
function uid() { return `sw-${++idCounter}`; }

export default function ColorSwatchBuilderPage() {
  const [swatches, setSwatches] = useState<Swatch[]>([]);
  const [hexInput, setHexInput] = useState("#3b82f6");
  const [pickerColor, setPickerColor] = useState("#3b82f6");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [exportMode, setExportMode] = useState<"css" | "hex" | "json">("css");

  const hasInput = isValidHex(hexInput);

  function addSwatch(hex: string) {
    if (!isValidHex(hex)) return;
    setSwatches((s) => [...s, { id: uid(), hex: hex.toLowerCase(), label: "" }]);
  }

  function addRandom() { addSwatch(randomHex()); }

  function addPalette() {
    const colors = randomPalette(5);
    setSwatches((s) => [...s, ...colors.map((hex) => ({ id: uid(), hex, label: "" }))]);
  }

  function removeSwatch(id: string) {
    setSwatches((s) => s.filter((c) => c.id !== id));
  }

  function updateLabel(id: string, label: string) {
    setSwatches((s) => s.map((c) => (c.id === id ? { ...c, label } : c)));
  }

  function copyHex(id: string, hex: string) {
    navigator.clipboard.writeText(hex);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  const exportText = (() => {
    if (!swatches.length) return "";
    if (exportMode === "css") {
      const lines = swatches.map((s, i) => {
        const name = s.label ? s.label.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") : `color-${i + 1}`;
        return `  --${name}: ${s.hex};`;
      });
      return `:root {\n${lines.join("\n")}\n}`;
    }
    if (exportMode === "hex") return swatches.map((s) => s.hex).join(", ");
    return JSON.stringify(
      swatches.map((s, i) => ({ name: s.label || `color-${i + 1}`, hex: s.hex })),
      null, 2
    );
  })();

  return (
    <ToolShell
      title="Color Swatch Builder"
      description="Build, name, and export color swatches. Add colors manually, pick from a color wheel, or generate random harmonious palettes."
    >
      <div className="space-y-6">

        {/* ── Add color controls ── */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={pickerColor}
              onChange={(e) => {
                setPickerColor(e.target.value);
                setHexInput(e.target.value);
              }}
              className="h-10 w-12 cursor-pointer rounded-md border border-border/60 bg-transparent p-0.5"
              title="Pick a color"
            />
            <input
              type="text"
              value={hexInput}
              onChange={(e) => {
                let val = e.target.value.trim();
                if (!val.startsWith("#")) val = "#" + val;
                setHexInput(val);
                if (isValidHex(val)) setPickerColor(val);
              }}
              placeholder="#3b82f6"
              maxLength={7}
              spellCheck={false}
              className="h-10 w-28 rounded-md border border-border/60 bg-muted/30 px-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <Button size="sm" className="h-10 gap-1.5" onClick={() => addSwatch(hexInput)} disabled={!hasInput}>
              <Plus className="w-4 h-4" /> Add
            </Button>
          </div>

          <div className="flex gap-2 sm:ml-auto">
            <Button size="sm" variant="outline" className="h-10 gap-1.5" onClick={addRandom}>
              <Shuffle className="w-4 h-4" /> Random Color
            </Button>
            <Button size="sm" variant="outline" className="h-10 gap-1.5" onClick={addPalette}>
              <Wand2 className="w-4 h-4" /> Random Palette
            </Button>
          </div>
        </div>

        {/* ── Swatch grid ── */}
        {swatches.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-border/50 py-16 text-center text-sm text-muted-foreground">
            No swatches yet — add a color or click <strong>Random Palette</strong> to get started.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {swatches.map((swatch) => {
                const fg = contrastColor(swatch.hex);
                const isCopied = copiedId === swatch.id;
                return (
                  <div key={swatch.id} className="group flex flex-col gap-1.5">
                    <div
                      className="relative h-24 rounded-xl cursor-pointer border border-black/10 transition-transform hover:scale-[1.04] active:scale-100 flex items-center justify-center select-none"
                      style={{ backgroundColor: swatch.hex }}
                      onClick={() => copyHex(swatch.id, swatch.hex)}
                      title="Click to copy hex"
                    >
                      <span
                        className={`text-xs font-semibold transition-opacity ${isCopied ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                        style={{ color: fg }}
                      >
                        {isCopied ? "Copied!" : swatch.hex}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeSwatch(swatch.id); }}
                        className="absolute top-1.5 right-1.5 rounded p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ backgroundColor: fg === "#ffffff" ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.35)" }}
                        title="Remove"
                      >
                        <Trash2 className="w-3 h-3" style={{ color: fg }} />
                      </button>
                    </div>
                    <p className="text-[11px] font-mono text-center text-muted-foreground">{swatch.hex.toUpperCase()}</p>
                    <input
                      type="text"
                      placeholder="Label…"
                      value={swatch.label}
                      onChange={(e) => updateLabel(swatch.id, e.target.value)}
                      className="text-xs rounded-md border border-border/50 bg-muted/30 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary/30 text-center"
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {swatches.length} swatch{swatches.length !== 1 ? "es" : ""}
              </span>
              <Button
                size="sm"
                variant="ghost"
                className="text-muted-foreground h-8"
                onClick={() => setSwatches([])}
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Clear all
              </Button>
            </div>

            {/* ── Export ── */}
            <div className="rounded-lg border border-border/60 bg-muted/20 p-4 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Export as</span>
                {(["css", "hex", "json"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setExportMode(m)}
                    className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
                      exportMode === m
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-muted-foreground/30 hover:bg-muted"
                    }`}
                  >
                    {m === "css" ? "CSS Variables" : m === "hex" ? "Hex List" : "JSON"}
                  </button>
                ))}
                <div className="ml-auto">
                  <CopyButton text={exportText} />
                </div>
              </div>
              <pre className="font-mono text-[12px] text-muted-foreground bg-muted/40 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
                {exportText}
              </pre>
            </div>
          </>
        )}
      </div>
    </ToolShell>
  );
}
