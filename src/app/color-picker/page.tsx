"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { AlertCircle } from "lucide-react";
import { parseColor } from "@/lib/tools/color-converter";

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

function hslToRgb(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))));
  };
  return `rgb(${f(0)}, ${f(8)}, ${f(4)})`;
}

function SliderRow({
  label,
  value,
  min,
  max,
  onChange,
  background,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  background: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {label}
        </label>
        <span className="text-xs font-mono text-foreground">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-3 rounded-full cursor-pointer appearance-none"
        style={{ background }}
      />
    </div>
  );
}

export default function ColorPickerPage() {
  const [hue, setHue] = useState(210);
  const [saturation, setSaturation] = useState(70);
  const [lightness, setLightness] = useState(50);
  const [hexInput, setHexInput] = useState("");
  const [hexError, setHexError] = useState("");

  const hex = hslToHex(hue, saturation, lightness).toUpperCase();
  const rgb = hslToRgb(hue, saturation, lightness);
  const hsl = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  const swatchColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  const hueGradient = `linear-gradient(to right, hsl(0,${saturation}%,${lightness}%), hsl(30,${saturation}%,${lightness}%), hsl(60,${saturation}%,${lightness}%), hsl(90,${saturation}%,${lightness}%), hsl(120,${saturation}%,${lightness}%), hsl(150,${saturation}%,${lightness}%), hsl(180,${saturation}%,${lightness}%), hsl(210,${saturation}%,${lightness}%), hsl(240,${saturation}%,${lightness}%), hsl(270,${saturation}%,${lightness}%), hsl(300,${saturation}%,${lightness}%), hsl(330,${saturation}%,${lightness}%), hsl(360,${saturation}%,${lightness}%))`;
  const satGradient = `linear-gradient(to right, hsl(${hue},0%,${lightness}%), hsl(${hue},100%,${lightness}%))`;
  const litGradient = `linear-gradient(to right, hsl(${hue},${saturation}%,0%), hsl(${hue},${saturation}%,50%), hsl(${hue},${saturation}%,100%))`;

  function handleHexInput(val: string) {
    setHexInput(val);
    setHexError("");
    const trimmed = val.trim();
    if (!trimmed) return;
    const { result, error } = parseColor(trimmed.startsWith("#") ? trimmed : `#${trimmed}`);
    if (error || !result) {
      setHexError("Invalid hex color");
      return;
    }
    setHue(result.h);
    setSaturation(result.s);
    setLightness(result.l);
  }

  return (
    <ToolShell
      title="Color Picker"
      description="Pick a color using visual HSL sliders and copy in HEX, RGB, or HSL format."
    >
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sliders + hex input */}
          <div className="flex flex-col gap-5">
            <SliderRow
              label={`Hue (0–360)`}
              value={hue}
              min={0}
              max={360}
              onChange={setHue}
              background={hueGradient}
            />
            <SliderRow
              label={`Saturation (0–100)`}
              value={saturation}
              min={0}
              max={100}
              onChange={setSaturation}
              background={satGradient}
            />
            <SliderRow
              label={`Lightness (0–100)`}
              value={lightness}
              min={0}
              max={100}
              onChange={setLightness}
              background={litGradient}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Hex Input
              </label>
              <input
                type="text"
                value={hexInput}
                onChange={(e) => handleHexInput(e.target.value)}
                placeholder="#3b82f6"
                className="h-9 w-full rounded-md border border-border/60 bg-background px-3 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
              {hexError && (
                <div className="flex gap-1.5 text-xs text-destructive items-center">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{hexError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Swatch */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Preview
            </label>
            <div
              className="rounded-xl border border-border/40 flex-1 min-h-40 shadow-sm"
              style={{ backgroundColor: swatchColor }}
            />
          </div>
        </div>

        {/* Output cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "HEX", value: hex },
            { label: "RGB", value: rgb },
            { label: "HSL", value: hsl },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex flex-col gap-2 rounded-lg border border-border/60 bg-muted/20 p-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {label}
                </span>
                <CopyButton text={value} />
              </div>
              <span className="font-mono text-sm text-foreground break-all">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </ToolShell>
  );
}
