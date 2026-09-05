"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";

const PADDING = 36;
const SVG_SIZE = 300;
const DRAWABLE = SVG_SIZE - 2 * PADDING;

function toSvg(x: number, y: number): [number, number] {
  return [PADDING + x * DRAWABLE, SVG_SIZE - PADDING - y * DRAWABLE];
}

function fromSvg(svgX: number, svgY: number): [number, number] {
  return [
    Math.max(0, Math.min(1, (svgX - PADDING) / DRAWABLE)),
    Math.max(0, Math.min(1, (SVG_SIZE - PADDING - svgY) / DRAWABLE)),
  ];
}

const PRESETS: Record<string, [number, number, number, number]> = {
  ease: [0.25, 0.1, 0.25, 1.0],
  "ease-in": [0.42, 0, 1.0, 1.0],
  "ease-out": [0, 0, 0.58, 1.0],
  "ease-in-out": [0.42, 0, 0.58, 1.0],
  linear: [0, 0, 1, 1],
  bounce: [0.34, 1.56, 0.64, 1],
};

export default function CssBezierPage() {
  const [p1, setP1] = useState<[number, number]>([0.25, 0.1]);
  const [p2, setP2] = useState<[number, number]>([0.25, 1.0]);
  const dragging = useRef<"p1" | "p2" | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setAnimating((v) => !v), 1400);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current || !svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const sx = (e.clientX - rect.left) * (SVG_SIZE / rect.width);
      const sy = (e.clientY - rect.top) * (SVG_SIZE / rect.height);
      const [x, y] = fromSvg(sx, sy);
      if (dragging.current === "p1") setP1([x, y]);
      else setP2([x, y]);
    };
    const onUp = () => { dragging.current = null; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const fmt = (n: number) => n.toFixed(2);
  const cssValue = `cubic-bezier(${fmt(p1[0])}, ${fmt(p1[1])}, ${fmt(p2[0])}, ${fmt(p2[1])})`;

  const [p0s, p3s, p1s, p2s] = [
    toSvg(0, 0), toSvg(1, 1), toSvg(p1[0], p1[1]), toSvg(p2[0], p2[1]),
  ];

  const pathD = `M ${p0s[0]} ${p0s[1]} C ${p1s[0]} ${p1s[1]} ${p2s[0]} ${p2s[1]} ${p3s[0]} ${p3s[1]}`;

  const applyPreset = useCallback((key: string) => {
    const [x1, y1, x2, y2] = PRESETS[key];
    setP1([x1, y1]);
    setP2([x2, y2]);
  }, []);

  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <ToolShell
      title="CSS Cubic Bezier Generator"
      description="Drag the control points to craft a custom cubic-bezier timing function, then copy it for use in CSS transitions and animations."
    >
      <div className="flex flex-col gap-6">
        {/* Presets */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Presets
          </span>
          <div className="flex flex-wrap gap-2">
            {Object.keys(PRESETS).map((key) => (
              <Button
                key={key}
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                onClick={() => applyPreset(key)}
              >
                {key}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* SVG Curve Editor */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Curve Editor
            </span>
            <div className="rounded-lg border border-border/60 bg-muted/10 p-2 inline-block select-none">
              <svg
                ref={svgRef}
                width={SVG_SIZE}
                height={SVG_SIZE}
                viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
                style={{ cursor: "default", touchAction: "none", display: "block" }}
              >
                {/* Grid */}
                {gridLines.map((v) => {
                  const [gx] = toSvg(v, 0);
                  const [, gy] = toSvg(0, v);
                  return (
                    <g key={v}>
                      <line
                        x1={gx} y1={PADDING} x2={gx} y2={SVG_SIZE - PADDING}
                        stroke="currentColor" strokeOpacity="0.08" strokeWidth="1"
                      />
                      <line
                        x1={PADDING} y1={gy} x2={SVG_SIZE - PADDING} y2={gy}
                        stroke="currentColor" strokeOpacity="0.08" strokeWidth="1"
                      />
                    </g>
                  );
                })}

                {/* Axis border */}
                <rect
                  x={PADDING} y={PADDING}
                  width={DRAWABLE} height={DRAWABLE}
                  fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1"
                />

                {/* Diagonal reference */}
                <line
                  x1={p0s[0]} y1={p0s[1]} x2={p3s[0]} y2={p3s[1]}
                  stroke="currentColor" strokeOpacity="0.15" strokeWidth="1"
                  strokeDasharray="4 4"
                />

                {/* Handle lines */}
                <line
                  x1={p0s[0]} y1={p0s[1]} x2={p1s[0]} y2={p1s[1]}
                  stroke="#6366f1" strokeWidth="1.5" strokeOpacity="0.6"
                />
                <line
                  x1={p3s[0]} y1={p3s[1]} x2={p2s[0]} y2={p2s[1]}
                  stroke="#ec4899" strokeWidth="1.5" strokeOpacity="0.6"
                />

                {/* Curve */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Fixed endpoints */}
                <circle cx={p0s[0]} cy={p0s[1]} r="5" fill="#64748b" stroke="white" strokeWidth="1.5" />
                <circle cx={p3s[0]} cy={p3s[1]} r="5" fill="#64748b" stroke="white" strokeWidth="1.5" />

                {/* Axis labels */}
                <text x={PADDING - 4} y={SVG_SIZE - PADDING + 16} fontSize="9" fill="currentColor" opacity="0.4" textAnchor="middle">0</text>
                <text x={SVG_SIZE - PADDING + 4} y={SVG_SIZE - PADDING + 16} fontSize="9" fill="currentColor" opacity="0.4" textAnchor="middle">1</text>
                <text x={PADDING - 14} y={PADDING + 3} fontSize="9" fill="currentColor" opacity="0.4" textAnchor="middle">1</text>

                {/* Draggable P1 (indigo) */}
                <circle
                  cx={p1s[0]} cy={p1s[1]} r="9"
                  fill="#6366f1" stroke="white" strokeWidth="2"
                  style={{ cursor: "grab" }}
                  onMouseDown={(e) => { e.preventDefault(); dragging.current = "p1"; }}
                />

                {/* Draggable P2 (pink) */}
                <circle
                  cx={p2s[0]} cy={p2s[1]} r="9"
                  fill="#ec4899" stroke="white" strokeWidth="2"
                  style={{ cursor: "grab" }}
                  onMouseDown={(e) => { e.preventDefault(); dragging.current = "p2"; }}
                />
              </svg>
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="inline-block w-2 h-2 rounded-full bg-indigo-500 mr-1" />
              P1 ({fmt(p1[0])}, {fmt(p1[1])}) &nbsp;
              <span className="inline-block w-2 h-2 rounded-full bg-pink-500 mr-1" />
              P2 ({fmt(p2[0])}, {fmt(p2[1])})
            </p>
          </div>

          {/* Right panel */}
          <div className="flex flex-col gap-4">
            {/* Animation preview */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Live Preview
              </span>
              <div className="rounded-lg border border-border/60 bg-muted/10 p-4 h-20 flex items-center overflow-hidden">
                <div
                  className="w-10 h-10 rounded-lg bg-blue-500 flex-shrink-0 shadow"
                  style={{
                    transform: animating ? "translateX(188px)" : "translateX(0px)",
                    transition: `transform 1.1s ${cssValue}`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">Box animates using your timing function.</p>
            </div>

            {/* CSS output */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  CSS Value
                </span>
                <CopyButton text={cssValue} />
              </div>
              <pre className="rounded-lg border border-border/60 bg-muted/30 p-3 text-[13px] font-mono overflow-x-auto text-foreground">
                {cssValue}
              </pre>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Full Declaration
                </span>
                <CopyButton text={`transition-timing-function: ${cssValue};`} />
              </div>
              <pre className="rounded-lg border border-border/60 bg-muted/30 p-3 text-[13px] font-mono overflow-x-auto text-foreground">
                {`transition-timing-function:\n  ${cssValue};`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
