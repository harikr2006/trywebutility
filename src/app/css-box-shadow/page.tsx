"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { generateBoxShadow, defaultLayer, ShadowLayer } from "@/lib/tools/css-box-shadow";

export default function CSSBoxShadowPage() {
  const [layers, setLayers] = useState<ShadowLayer[]>([defaultLayer()]);
  const shadow = generateBoxShadow(layers);
  const css = `box-shadow: ${shadow};`;

  function updateLayer(i: number, key: keyof ShadowLayer, value: number | string | boolean) {
    setLayers(layers.map((l, idx) => idx === i ? { ...l, [key]: value } : l));
  }
  function addLayer() { setLayers([...layers, defaultLayer()]); }
  function removeLayer(i: number) { if (layers.length > 1) setLayers(layers.filter((_, idx) => idx !== i)); }

  const SliderRow = ({ label, i, field, min, max }: { label: string; i: number; field: keyof ShadowLayer; min: number; max: number }) => (
    <div className="flex items-center gap-2">
      <label className="text-xs text-muted-foreground w-16 shrink-0">{label}</label>
      <input type="range" min={min} max={max} value={layers[i][field] as number}
        onChange={(e) => updateLayer(i, field, Number(e.target.value))} className="flex-1 accent-primary" />
      <span className="text-xs font-mono w-12 text-right">{layers[i][field]}px</span>
    </div>
  );

  return (
    <ToolShell title="CSS Box Shadow Generator" description="Create CSS box shadows visually with multiple layers and live preview.">
      <div className="space-y-5 max-w-xl">
        {layers.map((layer, i) => (
          <div key={i} className="rounded-xl border border-border/60 bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Layer {i + 1}</span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                  <input type="checkbox" checked={layer.inset} onChange={(e) => updateLayer(i, "inset", e.target.checked)} className="h-3.5 w-3.5 accent-primary" />
                  Inset
                </label>
                <button onClick={() => removeLayer(i)} disabled={layers.length <= 1} className="text-muted-foreground hover:text-destructive disabled:opacity-30">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <SliderRow label="Offset X" i={i} field="offsetX" min={-50} max={50} />
            <SliderRow label="Offset Y" i={i} field="offsetY" min={-50} max={50} />
            <SliderRow label="Blur" i={i} field="blur" min={0} max={100} />
            <SliderRow label="Spread" i={i} field="spread" min={-50} max={50} />
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground w-16 shrink-0">Color</label>
              <input type="color" value={layer.color} onChange={(e) => updateLayer(i, "color", e.target.value)}
                className="h-8 w-10 rounded border border-border/60 cursor-pointer p-0.5 bg-transparent" />
              <input type="range" min={0} max={100} value={layer.opacity}
                onChange={(e) => updateLayer(i, "opacity", Number(e.target.value))} className="flex-1 accent-primary" />
              <span className="text-xs font-mono w-12 text-right">{layer.opacity}% opacity</span>
            </div>
          </div>
        ))}

        <Button size="sm" variant="outline" onClick={addLayer} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Add Layer
        </Button>

        {/* Preview */}
        <div className="flex items-center justify-center rounded-xl bg-muted/30 border border-border/60 p-10">
          <div className="w-32 h-32 rounded-xl bg-card" style={{ boxShadow: shadow }} />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">CSS</label>
            <CopyButton text={css} />
          </div>
          <code className="block rounded-lg bg-muted/30 border border-border/60 px-4 py-3 font-mono text-sm break-all">{css}</code>
        </div>
      </div>
    </ToolShell>
  );
}
