"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { generatePalettes } from "@/lib/tools/color-palette";

export default function ColorPalettePage() {
  const [base, setBase] = useState("#6366f1");
  const isValidHex = /^#[0-9a-fA-F]{3}$|^#[0-9a-fA-F]{6}$/.test(base);
  const palettes = isValidHex ? generatePalettes(base) : [];

  return (
    <ToolShell title="Color Palette Generator" description="Generate harmonious color palettes from a base color — complementary, triadic, analogous, and more.">
      <div className="space-y-5 max-w-2xl">
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Base Color</label>
          <input type="color" value={base} onChange={(e) => setBase(e.target.value)}
            className="h-10 w-16 rounded-md border border-border/60 cursor-pointer p-0.5 bg-transparent" />
          <input type="text" value={base} onChange={(e) => setBase(e.target.value)} maxLength={7}
            className={`w-28 h-10 rounded-md border bg-background px-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 ${!isValidHex ? "border-destructive text-destructive" : "border-border/60"}`} />
          {!isValidHex && <span className="text-xs text-destructive">Invalid hex</span>}
        </div>

        <div className="space-y-4">
          {palettes.map((palette) => (
            <div key={palette.name} className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{palette.name}</label>
              <div className="flex gap-2 flex-wrap">
                {palette.colors.map((color) => (
                  <div key={color} className="flex flex-col items-center gap-1 group">
                    <div className="w-14 h-14 rounded-lg border border-border/40 shadow-sm cursor-pointer transition-transform group-hover:scale-105"
                      style={{ backgroundColor: color }}
                      onClick={() => navigator.clipboard.writeText(color)} />
                    <div className="flex items-center gap-0.5">
                      <code className="text-[10px] font-mono text-muted-foreground">{color}</code>
                      <CopyButton text={color} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolShell>
  );
}
