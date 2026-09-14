"use client";
import { useState, useRef } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Plus, RotateCcw } from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────

type Mode = "polygon" | "circle" | "ellipse";
type Point = { x: number; y: number };

// ─── Presets ───────────────────────────────────────────────────────────────────

const PRESETS: Record<string, Point[]> = {
  Triangle: [{ x: 50, y: 0 }, { x: 100, y: 100 }, { x: 0, y: 100 }],
  Diamond: [{ x: 50, y: 0 }, { x: 100, y: 50 }, { x: 50, y: 100 }, { x: 0, y: 50 }],
  Pentagon: [{ x: 50, y: 0 }, { x: 100, y: 38 }, { x: 81, y: 100 }, { x: 19, y: 100 }, { x: 0, y: 38 }],
  Hexagon: [{ x: 25, y: 0 }, { x: 75, y: 0 }, { x: 100, y: 50 }, { x: 75, y: 100 }, { x: 25, y: 100 }, { x: 0, y: 50 }],
  Arrow: [{ x: 0, y: 25 }, { x: 60, y: 25 }, { x: 60, y: 0 }, { x: 100, y: 50 }, { x: 60, y: 100 }, { x: 60, y: 75 }, { x: 0, y: 75 }],
  Parallelogram: [{ x: 25, y: 0 }, { x: 100, y: 0 }, { x: 75, y: 100 }, { x: 0, y: 100 }],
  Star: [{ x: 50, y: 0 }, { x: 61, y: 35 }, { x: 98, y: 35 }, { x: 68, y: 57 }, { x: 79, y: 91 }, { x: 50, y: 70 }, { x: 21, y: 91 }, { x: 32, y: 57 }, { x: 2, y: 35 }, { x: 39, y: 35 }],
  "Chevron Up": [{ x: 0, y: 100 }, { x: 50, y: 0 }, { x: 100, y: 100 }, { x: 100, y: 80 }, { x: 50, y: 20 }, { x: 0, y: 80 }],
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getCssValue(
  mode: Mode,
  points: Point[],
  circleRadius: number,
  ellipseRx: number,
  ellipseRy: number
): string {
  if (mode === "circle") return `circle(${circleRadius}% at 50% 50%)`;
  if (mode === "ellipse") return `ellipse(${ellipseRx}% ${ellipseRy}% at 50% 50%)`;
  const pts = points.map((p) => `${Math.round(p.x)}% ${Math.round(p.y)}%`).join(", ");
  return `polygon(${pts})`;
}

// ─── Preview backgrounds ───────────────────────────────────────────────────────

const PREVIEW_BG = [
  { label: "Purple", style: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { label: "Orange", style: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  {
    label: "Stripes",
    style: "repeating-linear-gradient(45deg, #e5e7eb 0px, #e5e7eb 10px, #d1d5db 10px, #d1d5db 20px)",
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────

export default function CssClipPathPage() {
  const [mode, setMode] = useState<Mode>("polygon");
  const [points, setPoints] = useState<Point[]>(() =>
    PRESETS["Triangle"].map((p) => ({ ...p }))
  );
  const [circleRadius, setCircleRadius] = useState(50);
  const [ellipseRx, setEllipseRx] = useState(50);
  const [ellipseRy, setEllipseRy] = useState(50);
  const [dragging, setDragging] = useState<number | null>(null);
  const [activePreset, setActivePreset] = useState("Triangle");
  const [bgIndex, setBgIndex] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  const cssValue = getCssValue(mode, points, circleRadius, ellipseRx, ellipseRy);
  const cssRule = `clip-path: ${cssValue};`;

  function getSvgCoords(clientX: number, clientY: number): Point {
    const rect = svgRef.current!.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100)),
    };
  }

  function handleSvgMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    if (dragging === null || !svgRef.current) return;
    const { x, y } = getSvgCoords(e.clientX, e.clientY);
    setPoints((pts) => pts.map((p, i) => (i === dragging ? { x, y } : p)));
  }

  function handleSvgDoubleClick(e: React.MouseEvent<SVGSVGElement>) {
    const target = e.target as Element;
    if (target.tagName === "circle") return;
    if (!svgRef.current) return;
    const { x, y } = getSvgCoords(e.clientX, e.clientY);
    setPoints((pts) => [...pts, { x, y }]);
    setActivePreset("");
  }

  function handleSvgTouchMove(e: React.TouchEvent<SVGSVGElement>) {
    if (dragging === null || !svgRef.current) return;
    const touch = e.touches[0];
    const { x, y } = getSvgCoords(touch.clientX, touch.clientY);
    setPoints((pts) => pts.map((p, i) => (i === dragging ? { x, y } : p)));
  }

  function applyPreset(name: string) {
    setPoints(PRESETS[name].map((p) => ({ ...p })));
    setActivePreset(name);
  }

  function addPoint() {
    setPoints((pts) => [...pts, { x: 50, y: 50 }]);
    setActivePreset("");
  }

  function resetPoints() {
    setPoints(PRESETS["Triangle"].map((p) => ({ ...p })));
    setActivePreset("Triangle");
  }

  const svgPolyPoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <ToolShell
      title="CSS Clip Path Generator"
      description="Create CSS clip-path shapes visually. Drag control points, choose presets, or switch to circle and ellipse modes."
    >
      <div className="space-y-5 max-w-3xl">
        {/* Mode tabs */}
        <div className="flex gap-1.5">
          {(["polygon", "circle", "ellipse"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                mode === m
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/30 text-muted-foreground border border-border/60 hover:bg-muted/50"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          {/* ── Left: editor controls ── */}
          <div className="space-y-4">
            {mode === "polygon" && (
              <>
                {/* Presets */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Presets
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.keys(PRESETS).map((name) => (
                      <button
                        key={name}
                        onClick={() => applyPreset(name)}
                        className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                          activePreset === name
                            ? "bg-primary/15 text-primary border border-primary/30"
                            : "bg-muted/30 text-muted-foreground border border-border/60 hover:bg-muted/50"
                        }`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SVG editor */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Editor
                    <span className="ml-1 normal-case font-normal text-muted-foreground/60">
                      — drag · double-click adds · right-click removes
                    </span>
                  </label>
                  <svg
                    ref={svgRef}
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className="w-full rounded-lg border border-border/60 cursor-crosshair touch-none select-none"
                    style={{ aspectRatio: "4/3", display: "block" }}
                    onMouseMove={handleSvgMouseMove}
                    onMouseUp={() => setDragging(null)}
                    onMouseLeave={() => setDragging(null)}
                    onDoubleClick={handleSvgDoubleClick}
                    onTouchMove={handleSvgTouchMove}
                    onTouchEnd={() => setDragging(null)}
                  >
                    <defs>
                      <pattern
                        id="cpchecker"
                        x="0"
                        y="0"
                        width="10"
                        height="10"
                        patternUnits="userSpaceOnUse"
                      >
                        <rect width="5" height="5" fill="#f1f5f9" />
                        <rect x="5" y="5" width="5" height="5" fill="#f1f5f9" />
                        <rect x="5" y="0" width="5" height="5" fill="#e2e8f0" />
                        <rect x="0" y="5" width="5" height="5" fill="#e2e8f0" />
                      </pattern>
                    </defs>
                    <rect width="100" height="100" fill="url(#cpchecker)" />
                    <polygon
                      points={svgPolyPoints}
                      fill="rgba(59,130,246,0.25)"
                      stroke="#3b82f6"
                      strokeWidth="0.7"
                    />
                    {points.map((p, i) => (
                      <circle
                        key={i}
                        cx={p.x}
                        cy={p.y}
                        r={dragging === i ? 3.2 : 2.3}
                        fill={dragging === i ? "#1d4ed8" : "#3b82f6"}
                        stroke="white"
                        strokeWidth="0.6"
                        style={{ cursor: "grab" }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setDragging(i);
                        }}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          if (points.length > 3) {
                            setPoints((pts) => pts.filter((_, idx) => idx !== i));
                            setActivePreset("");
                          }
                        }}
                        onTouchStart={(e) => {
                          e.preventDefault();
                          setDragging(i);
                        }}
                      />
                    ))}
                  </svg>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={addPoint}
                      className="gap-1.5 h-7 text-xs"
                    >
                      <Plus className="h-3 w-3" /> Add Point
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={resetPoints}
                      className="gap-1.5 h-7 text-xs"
                    >
                      <RotateCcw className="h-3 w-3" /> Reset
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      {points.length} point{points.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </>
            )}

            {mode === "circle" && (
              <div className="space-y-3">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Radius
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={circleRadius}
                    onChange={(e) => setCircleRadius(Number(e.target.value))}
                    className="flex-1 accent-primary"
                  />
                  <span className="text-xs font-mono w-10 text-right">
                    {circleRadius}%
                  </span>
                </div>
              </div>
            )}

            {mode === "ellipse" && (
              <div className="space-y-4">
                {(
                  [
                    { label: "Radius X", value: ellipseRx, set: setEllipseRx },
                    { label: "Radius Y", value: ellipseRy, set: setEllipseRy },
                  ] as Array<{
                    label: string;
                    value: number;
                    set: (v: number) => void;
                  }>
                ).map(({ label, value, set }) => (
                  <div key={label} className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      {label}
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={value}
                        onChange={(e) => set(Number(e.target.value))}
                        className="flex-1 accent-primary"
                      />
                      <span className="text-xs font-mono w-10 text-right">
                        {value}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: preview ── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Preview
              </label>
              <div className="flex gap-1">
                {PREVIEW_BG.map((bg, i) => (
                  <button
                    key={i}
                    onClick={() => setBgIndex(i)}
                    className={`rounded px-2 py-1 text-xs transition-colors ${
                      bgIndex === i
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/30 text-muted-foreground border border-border/60 hover:bg-muted/50"
                    }`}
                  >
                    {bg.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center rounded-lg border border-border/60 bg-muted/10 p-8 min-h-56">
              <div
                className="w-48 h-48"
                style={{
                  background: PREVIEW_BG[bgIndex].style,
                  clipPath: cssValue,
                  transition: "clip-path 0.1s ease",
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Output ── */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            CSS Output
          </label>
          <code className="block rounded-lg bg-muted/30 border border-border/60 px-4 py-3 font-mono text-sm break-all">
            {cssRule}
          </code>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Value only:</span>
              <CopyButton text={cssValue} />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Full rule:</span>
              <CopyButton text={cssRule} />
            </div>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
