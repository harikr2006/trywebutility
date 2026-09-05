"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import ToolShell from "@/components/shared/ToolShell";
import { Button } from "@/components/ui/button";

const PRESETS = [
  { label: "16:9 HD", w: 1280, h: 720 },
  { label: "4:3", w: 800, h: 600 },
  { label: "Square", w: 500, h: 500 },
  { label: "Avatar", w: 150, h: 150 },
  { label: "Banner", w: 1200, h: 400 },
  { label: "Thumbnail", w: 300, h: 200 },
];

export default function PlaceholderImagePage() {
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(300);
  const [bgColor, setBgColor] = useState("#cccccc");
  const [textColor, setTextColor] = useState("#666666");
  const [customText, setCustomText] = useState("{width}×{height}");
  const [autoFontSize, setAutoFontSize] = useState(true);
  const [fixedFontSize, setFixedFontSize] = useState(32);
  const [previewUrl, setPreviewUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const anchorRef = useRef<HTMLAnchorElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Text
    const displayText = customText
      .replace("{width}", String(width))
      .replace("{height}", String(height));

    const fontSize = autoFontSize
      ? Math.max(12, Math.min(Math.floor(width / 8), Math.floor(height / 4), 72))
      : fixedFontSize;

    ctx.font = `bold ${fontSize}px system-ui, sans-serif`;
    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(displayText, width / 2, height / 2);

    setPreviewUrl(canvas.toDataURL("image/png"));
  }, [width, height, bgColor, textColor, customText, autoFontSize, fixedFontSize]);

  useEffect(() => {
    draw();
  }, [draw]);

  const downloadPng = useCallback(() => {
    const url = canvasRef.current?.toDataURL("image/png");
    if (!url) return;
    const a = anchorRef.current!;
    a.href = url;
    a.download = `placeholder-${width}x${height}.png`;
    a.click();
  }, [width, height]);

  const copyUrl = useCallback(async () => {
    const url = canvasRef.current?.toDataURL("image/png");
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const applyPreset = useCallback((w: number, h: number) => {
    setWidth(w);
    setHeight(h);
  }, []);

  return (
    <ToolShell
      title="Placeholder Image Generator"
      description="Generate placeholder images with custom dimensions, colors, and text. Download as PNG or copy the data URL."
    >
      {/* Hidden elements */}
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
      <a ref={anchorRef} className="hidden" aria-hidden="true" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Controls */}
        <div className="flex flex-col gap-4 p-4 rounded-lg border border-border/60 bg-muted/10">
          <h2 className="text-sm font-semibold">Settings</h2>

          {/* Presets */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Presets
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map(({ label, w, h }) => (
                <Button
                  key={label}
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => applyPreset(w, h)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Dimensions */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Width (px)
              </label>
              <input
                type="number"
                min={1}
                max={4096}
                value={width}
                onChange={(e) => setWidth(Math.max(1, Number(e.target.value)))}
                className="h-9 rounded-md border border-border/60 bg-background px-3 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Height (px)
              </label>
              <input
                type="number"
                min={1}
                max={4096}
                value={height}
                onChange={(e) => setHeight(Math.max(1, Number(e.target.value)))}
                className="h-9 rounded-md border border-border/60 bg-background px-3 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Background
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-9 w-10 rounded border border-border/60 bg-background cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-9 flex-1 rounded-md border border-border/60 bg-background px-2 text-sm font-mono"
                  maxLength={7}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Text Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="h-9 w-10 rounded border border-border/60 bg-background cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="h-9 flex-1 rounded-md border border-border/60 bg-background px-2 text-sm font-mono"
                  maxLength={7}
                />
              </div>
            </div>
          </div>

          {/* Custom text */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Text <span className="normal-case font-normal">(use {"{width}"} and {"{height}"})</span>
            </label>
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="h-9 rounded-md border border-border/60 bg-background px-3 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary/30"
              placeholder="{width}×{height}"
            />
          </div>

          {/* Font size */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              <input
                type="checkbox"
                checked={autoFontSize}
                onChange={(e) => setAutoFontSize(e.target.checked)}
                className="rounded"
              />
              Auto font size
            </label>
            {!autoFontSize && (
              <div className="flex items-center gap-2 pl-5">
                <input
                  type="number"
                  min={8}
                  max={200}
                  value={fixedFontSize}
                  onChange={(e) => setFixedFontSize(Number(e.target.value))}
                  className="h-8 w-20 rounded-md border border-border/60 bg-background px-2 text-sm"
                />
                <span className="text-xs text-muted-foreground">px</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1 border-t border-border/40">
            <Button size="sm" className="h-8" onClick={downloadPng}>
              Download PNG
            </Button>
            <Button size="sm" variant="outline" className="h-8" onClick={copyUrl}>
              {copied ? "Copied!" : "Copy Data URL"}
            </Button>
          </div>
        </div>

        {/* Preview */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Preview
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              {width} × {height}px
            </span>
          </div>
          <div className="rounded-lg border border-border/60 bg-[repeating-conic-gradient(#e5e7eb_0%_25%,transparent_0%_50%)] bg-[length:20px_20px] dark:bg-[repeating-conic-gradient(#374151_0%_25%,transparent_0%_50%)] flex items-center justify-center p-4 overflow-hidden">
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Placeholder preview"
                style={{ maxWidth: "100%", maxHeight: "400px", display: "block", objectFit: "contain" }}
              />
            )}
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
