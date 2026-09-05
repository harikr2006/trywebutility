"use client";
import { useState, useCallback, useRef } from "react";
import ToolShell from "@/components/shared/ToolShell";
import { Button } from "@/components/ui/button";

// ─── Blob math ────────────────────────────────────────────────────────────────

function generateOffsets(n: number): number[] {
  return Array.from({ length: n }, () => Math.random());
}

function buildPoints(numPoints: number, variance: number, offsets: number[]): [number, number][] {
  return offsets.map((off, i) => {
    const angle = (i / numPoints) * 2 * Math.PI - Math.PI / 2;
    const r = 0.75 + (off - 0.5) * (variance / 100) * 1.1;
    const clamped = Math.max(0.15, Math.min(1.1, r));
    return [Math.cos(angle) * clamped, Math.sin(angle) * clamped];
  });
}

function pointsToPath(pts: [number, number][]): string {
  const n = pts.length;
  let d = `M ${pts[0][0].toFixed(4)} ${pts[0][1].toFixed(4)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${cp1x.toFixed(4)} ${cp1y.toFixed(4)} ${cp2x.toFixed(4)} ${cp2y.toFixed(4)} ${p2[0].toFixed(4)} ${p2[1].toFixed(4)}`;
  }
  return d + " Z";
}

function buildSvgString(
  pathD: string,
  size: number,
  fill: string,
  useStroke: boolean,
  strokeColor: string,
  strokeWidth: number
): string {
  const strokeAttrs = useStroke
    ? `stroke="${strokeColor}" stroke-width="${(strokeWidth / (size / 2)).toFixed(4)}"`
    : `stroke="none"`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="-1.3 -1.3 2.6 2.6">
  <path d="${pathD}" fill="${fill}" ${strokeAttrs}/>
</svg>`;
}

// ─── Component ────────────────────────────────────────────────────────────────

const SIZE_OPTIONS = [200, 300, 400, 500];

export default function SvgBlobPage() {
  const [numPoints, setNumPoints] = useState(6);
  const [variance, setVariance] = useState(50);
  const [fill, setFill] = useState("#6366f1");
  const [useStroke, setUseStroke] = useState(false);
  const [strokeColor, setStrokeColor] = useState("#1e1b4b");
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [size, setSize] = useState(300);
  const [offsets, setOffsets] = useState<number[]>(() => generateOffsets(6));
  const [locked, setLocked] = useState(false);
  const [copied, setCopied] = useState(false);
  const anchorRef = useRef<HTMLAnchorElement>(null);

  const pts = buildPoints(numPoints, variance, offsets);
  const pathD = pointsToPath(pts);
  const svgString = buildSvgString(pathD, size, fill, useStroke, strokeColor, strokeWidth);

  const newBlob = useCallback(() => {
    if (!locked) {
      setOffsets(generateOffsets(numPoints));
    }
  }, [locked, numPoints]);

  const handlePointCount = useCallback((n: number) => {
    setNumPoints(n);
    if (!locked) setOffsets(generateOffsets(n));
    else setOffsets(generateOffsets(n)); // reset offsets on point count change regardless
  }, [locked]);

  const copySvg = useCallback(async () => {
    await navigator.clipboard.writeText(svgString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [svgString]);

  const downloadSvg = useCallback(() => {
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = anchorRef.current!;
    a.href = url;
    a.download = "blob.svg";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, [svgString]);

  return (
    <ToolShell
      title="SVG Blob Creator"
      description="Generate organic blob shapes as SVG. Adjust points, variance, color, and download or copy the result."
    >
      {/* Hidden anchor for download */}
      <a ref={anchorRef} className="hidden" aria-hidden="true" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Controls */}
        <div className="flex flex-col gap-4 p-4 rounded-lg border border-border/60 bg-muted/10">
          <h2 className="text-sm font-semibold">Controls</h2>

          {/* Point count */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Points: {numPoints}
            </label>
            <input
              type="range" min={4} max={12} step={1}
              value={numPoints}
              onChange={(e) => handlePointCount(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-xs text-muted-foreground"><span>4</span><span>12</span></div>
          </div>

          {/* Variance */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Randomness: {variance}%
            </label>
            <input
              type="range" min={0} max={100} step={1}
              value={variance}
              onChange={(e) => setVariance(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-xs text-muted-foreground"><span>0%</span><span>100%</span></div>
          </div>

          {/* Fill color */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Fill Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color" value={fill}
                onChange={(e) => setFill(e.target.value)}
                className="h-8 w-12 rounded border border-border/60 bg-background cursor-pointer p-0.5"
              />
              <input
                type="text" value={fill}
                onChange={(e) => setFill(e.target.value)}
                className="h-8 w-28 rounded-md border border-border/60 bg-background px-2 text-sm font-mono"
                maxLength={7}
              />
            </div>
          </div>

          {/* Stroke */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              <input
                type="checkbox"
                checked={useStroke}
                onChange={(e) => setUseStroke(e.target.checked)}
                className="rounded"
              />
              Stroke
            </label>
            {useStroke && (
              <div className="flex flex-wrap items-center gap-3 pl-5">
                <div className="flex items-center gap-2">
                  <input
                    type="color" value={strokeColor}
                    onChange={(e) => setStrokeColor(e.target.value)}
                    className="h-7 w-10 rounded border border-border/60 bg-background cursor-pointer p-0.5"
                  />
                  <input
                    type="text" value={strokeColor}
                    onChange={(e) => setStrokeColor(e.target.value)}
                    className="h-7 w-24 rounded-md border border-border/60 bg-background px-2 text-sm font-mono"
                    maxLength={7}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-muted-foreground">Width</label>
                  <input
                    type="number" min={1} max={20} value={strokeWidth}
                    onChange={(e) => setStrokeWidth(Number(e.target.value))}
                    className="h-7 w-16 rounded-md border border-border/60 bg-background px-2 text-sm"
                  />
                  <span className="text-xs text-muted-foreground">px</span>
                </div>
              </div>
            )}
          </div>

          {/* Size */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Export Size
            </label>
            <div className="flex gap-2">
              {SIZE_OPTIONS.map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant={size === s ? "default" : "outline"}
                  className="h-7 text-xs"
                  onClick={() => setSize(s)}
                >
                  {s}px
                </Button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-1 border-t border-border/40">
            <Button size="sm" onClick={newBlob} className="h-8">
              New Blob
            </Button>
            <Button
              size="sm"
              variant={locked ? "default" : "outline"}
              className="h-8"
              onClick={() => setLocked((v) => !v)}
            >
              {locked ? "Seed Locked" : "Lock Seed"}
            </Button>
            <Button size="sm" variant="outline" className="h-8" onClick={copySvg}>
              {copied ? "Copied!" : "Copy SVG"}
            </Button>
            <Button size="sm" variant="outline" className="h-8" onClick={downloadSvg}>
              Download SVG
            </Button>
          </div>
        </div>

        {/* Preview */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Preview
          </span>
          <div className="rounded-lg border border-border/60 bg-muted/10 p-4 flex items-center justify-center min-h-64">
            <svg
              viewBox="-1.3 -1.3 2.6 2.6"
              width="260"
              height="260"
              style={{ display: "block" }}
            >
              <path
                d={pathD}
                fill={fill}
                stroke={useStroke ? strokeColor : "none"}
                strokeWidth={useStroke ? strokeWidth / (size / 2) : 0}
              />
            </svg>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              SVG Code
            </span>
            <pre className="rounded-lg border border-border/60 bg-muted/30 p-3 text-[11px] font-mono overflow-x-auto max-h-40 text-foreground">
              {svgString}
            </pre>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
