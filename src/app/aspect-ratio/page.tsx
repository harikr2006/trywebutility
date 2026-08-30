"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { simplifyRatio, scaleByWidth, scaleByHeight, commonRatios } from "@/lib/tools/aspect-ratio";

export default function AspectRatioPage() {
  const [origW, setOrigW] = useState("1920");
  const [origH, setOrigH] = useState("1080");
  const [newW, setNewW] = useState("1280");
  const [newH, setNewH] = useState("");

  const oW = Number(origW), oH = Number(origH);
  const ratio = (oW > 0 && oH > 0) ? simplifyRatio(oW, oH) : "—";

  const byW = newW && oW > 0 && oH > 0 ? scaleByWidth(oW, oH, Number(newW)) : null;
  const byH = newH && oW > 0 && oH > 0 ? scaleByHeight(oW, oH, Number(newH)) : null;
  const commons = commonRatios();

  return (
    <ToolShell title="Aspect Ratio Calculator" description="Calculate and scale dimensions while preserving the aspect ratio.">
      <div className="space-y-6 max-w-lg">
        <div className="space-y-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Original Dimensions</label>
          <div className="flex items-center gap-2">
            <input type="number" value={origW} onChange={(e) => setOrigW(e.target.value)} placeholder="Width"
              className="flex-1 h-9 rounded-md border border-border/60 bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <span className="text-muted-foreground">×</span>
            <input type="number" value={origH} onChange={(e) => setOrigH(e.target.value)} placeholder="Height"
              className="flex-1 h-9 rounded-md border border-border/60 bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="flex items-center gap-2 rounded-md bg-muted/30 px-3 py-2">
            <span className="text-sm text-muted-foreground">Ratio:</span>
            <span className="font-mono font-bold text-foreground">{ratio}</span>
            <CopyButton text={ratio} />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Scale by Width</label>
          <div className="flex items-center gap-2">
            <input type="number" value={newW} onChange={(e) => { setNewW(e.target.value); setNewH(""); }} placeholder="New width"
              className="flex-1 h-9 rounded-md border border-border/60 bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            {byW && <span className="text-sm text-muted-foreground">→ height: <strong className="font-mono text-foreground">{byW.height}</strong></span>}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Scale by Height</label>
          <div className="flex items-center gap-2">
            <input type="number" value={newH} onChange={(e) => { setNewH(e.target.value); setNewW(""); }} placeholder="New height"
              className="flex-1 h-9 rounded-md border border-border/60 bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            {byH && <span className="text-sm text-muted-foreground">→ width: <strong className="font-mono text-foreground">{byH.width}</strong></span>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Common Ratios</label>
          <div className="grid grid-cols-2 gap-2">
            {commons.map(({ name, ratio: r }) => (
              <button key={r} onClick={() => {
                const [a, b] = r.split(":").map(Number);
                setOrigW(String(a * 160));
                setOrigH(String(b * 160));
              }}
                className="rounded-md border border-border/60 bg-muted/20 px-3 py-2 text-left text-xs hover:bg-muted/40 transition-colors">
                <span className="font-mono font-semibold">{r}</span>
                <span className="text-muted-foreground ml-2">{name.replace(/ \(.*\)/, "")}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
