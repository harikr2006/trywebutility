"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { generateGradientCSS, defaultStops, GradientType, ColorStop } from "@/lib/tools/css-gradient";

export default function CSSGradientPage() {
  const [type, setType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<ColorStop[]>(defaultStops());

  const css = generateGradientCSS(type, angle, stops);
  const preview = css.replace("background: ", "").replace(/;$/, "");

  function updateStop(i: number, field: keyof ColorStop, value: string | number) {
    setStops(stops.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  }
  function addStop() { setStops([...stops, { color: "#a855f7", position: Math.round((stops[stops.length-1].position + 100) / 2) }]); }
  function removeStop(i: number) { if (stops.length > 2) setStops(stops.filter((_, idx) => idx !== i)); }

  return (
    <ToolShell title="CSS Gradient Generator" description="Build linear and radial CSS gradients visually with live preview.">
      <div className="space-y-5 max-w-xl">
        <div className="flex gap-2">
          {(["linear", "radial"] as GradientType[]).map(t => (
            <button key={t} onClick={() => setType(t)}
              className={`rounded-full px-3 py-1 text-xs font-semibold border capitalize transition-colors ${type === t ? "bg-primary text-primary-foreground border-primary" : "bg-muted/30 text-muted-foreground border-border/60 hover:bg-muted/50"}`}>
              {t}
            </button>
          ))}
          {type === "linear" && (
            <div className="flex items-center gap-2 ml-4">
              <label className="text-xs text-muted-foreground">Angle</label>
              <input type="range" min={0} max={360} value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="w-28 accent-primary" />
              <span className="text-xs font-mono text-muted-foreground w-10">{angle}°</span>
            </div>
          )}
        </div>

        {/* Color stops */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Color Stops</label>
          {stops.map((stop, i) => (
            <div key={i} className="flex items-center gap-3">
              <input type="color" value={stop.color} onChange={(e) => updateStop(i, "color", e.target.value)}
                className="h-9 w-12 rounded-md border border-border/60 cursor-pointer p-0.5 bg-transparent" />
              <code className="font-mono text-xs w-20">{stop.color}</code>
              <input type="range" min={0} max={100} value={stop.position} onChange={(e) => updateStop(i, "position", Number(e.target.value))}
                className="flex-1 accent-primary" />
              <span className="text-xs font-mono w-10">{stop.position}%</span>
              <button onClick={() => removeStop(i)} disabled={stops.length <= 2} className="text-muted-foreground hover:text-destructive disabled:opacity-30">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          <Button size="sm" variant="outline" onClick={addStop} className="gap-1.5 mt-1">
            <Plus className="h-3.5 w-3.5" /> Add Stop
          </Button>
        </div>

        {/* Preview */}
        <div className="rounded-xl h-32 border border-border/60" style={{ background: preview }} />

        {/* Output */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">CSS</label>
            <CopyButton text={css} />
          </div>
          <code className="block rounded-lg bg-muted/30 border border-border/60 px-4 py-3 font-mono text-sm">{css}</code>
        </div>
      </div>
    </ToolShell>
  );
}
