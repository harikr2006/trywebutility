"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import ToolShell from "@/components/shared/ToolShell";
import { Button } from "@/components/ui/button";

// ─── SVG dimension helpers ────────────────────────────────────────────────────

function parseSvgDimensions(svgStr: string): { w: number; h: number } {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgStr, "image/svg+xml");
    const el = doc.documentElement;
    const wAttr = el.getAttribute("width");
    const hAttr = el.getAttribute("height");
    const vb = el.getAttribute("viewBox");
    if (wAttr && hAttr) {
      const w = parseFloat(wAttr);
      const h = parseFloat(hAttr);
      if (w > 0 && h > 0) return { w, h };
    }
    if (vb) {
      const parts = vb.trim().split(/[\s,]+/);
      if (parts.length >= 4) {
        const w = parseFloat(parts[2]);
        const h = parseFloat(parts[3]);
        if (w > 0 && h > 0) return { w, h };
      }
    }
  } catch {}
  return { w: 500, h: 500 };
}

function prepareSvg(svgStr: string, w: number, h: number): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgStr, "image/svg+xml");
    const el = doc.documentElement;
    el.setAttribute("width", String(w));
    el.setAttribute("height", String(h));
    return new XMLSerializer().serializeToString(doc);
  } catch {
    return svgStr;
  }
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

// ─── Component ────────────────────────────────────────────────────────────────

const SCALE_PRESETS = [1, 2, 3];

export default function SvgPngPage() {
  const [svgText, setSvgText] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [pngUrl, setPngUrl] = useState("");
  const [scale, setScale] = useState(2);
  const [customScale, setCustomScale] = useState(2);
  const [useCustom, setUseCustom] = useState(false);
  const [outputInfo, setOutputInfo] = useState("");
  const [converting, setConverting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevPngUrlRef = useRef<string>("");

  const effectiveScale = useCustom ? customScale : scale;

  // Build SVG preview URL whenever svgText changes
  useEffect(() => {
    if (!svgText.trim()) {
      setPreviewUrl("");
      setPngUrl("");
      setOutputInfo("");
      return;
    }
    const blob = new Blob([svgText], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
    setPngUrl("");
    setOutputInfo("");
    return () => URL.revokeObjectURL(url);
  }, [svgText]);

  const loadFile = useCallback((file: File) => {
    setError("");
    if (!file.type.includes("svg") && !file.name.endsWith(".svg")) {
      setError("Please drop an SVG file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setSvgText(text);
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) loadFile(file);
    },
    [loadFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) loadFile(file);
    },
    [loadFile]
  );

  const convertToPng = useCallback(() => {
    if (!svgText.trim()) return;
    setConverting(true);
    setError("");

    const { w, h } = parseSvgDimensions(svgText);
    const targetW = Math.round(w * effectiveScale);
    const targetH = Math.round(h * effectiveScale);

    const prepared = prepareSvg(svgText, targetW, targetH);
    const blob = new Blob([prepared], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setError("Canvas context unavailable.");
        setConverting(false);
        URL.revokeObjectURL(url);
        return;
      }
      ctx.clearRect(0, 0, targetW, targetH);
      ctx.drawImage(img, 0, 0, targetW, targetH);
      URL.revokeObjectURL(url);

      canvas.toBlob((pngBlob) => {
        if (!pngBlob) {
          setError("Conversion failed. The SVG may contain cross-origin resources.");
          setConverting(false);
          return;
        }
        if (prevPngUrlRef.current) URL.revokeObjectURL(prevPngUrlRef.current);
        const pngUrl = URL.createObjectURL(pngBlob);
        prevPngUrlRef.current = pngUrl;
        setPngUrl(pngUrl);
        setOutputInfo(
          `${targetW} × ${targetH}px · ${formatBytes(pngBlob.size)}`
        );
        setConverting(false);
      }, "image/png");
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setError("Failed to render the SVG. Check that it is valid.");
      setConverting(false);
    };
    img.src = url;
  }, [svgText, effectiveScale]);

  const downloadPng = useCallback(() => {
    if (!pngUrl) return;
    const a = anchorRef.current!;
    a.href = pngUrl;
    a.download = "converted.png";
    a.click();
  }, [pngUrl]);

  const { w: srcW, h: srcH } = svgText.trim()
    ? parseSvgDimensions(svgText)
    : { w: 0, h: 0 };

  return (
    <ToolShell
      title="SVG to PNG Converter"
      description="Convert SVG files or pasted SVG code to PNG at any scale. Drop a file, paste code, choose a scale, and download."
    >
      {/* Hidden elements */}
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
      <a ref={anchorRef} className="hidden" aria-hidden="true" />
      <input
        ref={fileInputRef}
        type="file"
        accept=".svg,image/svg+xml"
        className="hidden"
        onChange={handleFileInput}
        aria-hidden="true"
      />

      <div className="flex flex-col gap-6">
        {/* Drop zone + Textarea */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Drop zone */}
          <div
            className={`flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 cursor-pointer transition-colors ${
              dragOver
                ? "border-primary bg-primary/5"
                : "border-border/60 hover:border-primary/40 bg-muted/10"
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
          >
            <svg
              className="h-10 w-10 text-muted-foreground/50"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <div className="text-center">
              <p className="text-sm font-medium">Drop SVG file here</p>
              <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
            </div>
          </div>

          {/* Paste textarea */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Or paste SVG code
            </label>
            <textarea
              className="flex-1 min-h-[140px] rounded-lg border border-border/60 bg-background px-3 py-2.5 text-[12px] font-mono focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none"
              placeholder={`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">\n  ...\n</svg>`}
              value={svgText}
              onChange={(e) => setSvgText(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Controls */}
        {svgText.trim() && (
          <div className="flex flex-wrap items-end gap-4 p-4 rounded-lg border border-border/60 bg-muted/10">
            {srcW > 0 && (
              <div className="text-xs text-muted-foreground">
                Source: <span className="font-mono font-semibold">{srcW} × {srcH}px</span>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Scale
              </label>
              <div className="flex gap-2 flex-wrap">
                {SCALE_PRESETS.map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={!useCustom && scale === s ? "default" : "outline"}
                    className="h-8 w-12 text-sm"
                    onClick={() => { setScale(s); setUseCustom(false); }}
                  >
                    {s}x
                  </Button>
                ))}
                <Button
                  size="sm"
                  variant={useCustom ? "default" : "outline"}
                  className="h-8 text-sm px-3"
                  onClick={() => setUseCustom(true)}
                >
                  Custom
                </Button>
                {useCustom && (
                  <input
                    type="number"
                    min={0.5}
                    max={10}
                    step={0.5}
                    value={customScale}
                    onChange={(e) => setCustomScale(Number(e.target.value))}
                    className="h-8 w-20 rounded-md border border-border/60 bg-background px-2 text-sm font-mono"
                  />
                )}
              </div>
            </div>

            {srcW > 0 && (
              <div className="text-xs text-muted-foreground">
                Output: <span className="font-mono font-semibold">
                  {Math.round(srcW * effectiveScale)} × {Math.round(srcH * effectiveScale)}px
                </span>
              </div>
            )}

            <Button
              className="h-8"
              onClick={convertToPng}
              disabled={converting || !svgText.trim()}
            >
              {converting ? "Converting…" : "Convert to PNG"}
            </Button>
          </div>
        )}

        {/* Preview + Download */}
        {(previewUrl || pngUrl) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SVG Preview */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                SVG Preview
              </span>
              <div className="rounded-lg border border-border/60 bg-[repeating-conic-gradient(#e5e7eb_0%_25%,transparent_0%_50%)] bg-[length:20px_20px] dark:bg-[repeating-conic-gradient(#374151_0%_25%,transparent_0%_50%)] flex items-center justify-center p-4 min-h-40">
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="SVG preview"
                    style={{ maxWidth: "100%", maxHeight: "300px", objectFit: "contain" }}
                  />
                )}
              </div>
            </div>

            {/* PNG Preview */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  PNG Output
                  {outputInfo && (
                    <span className="ml-2 normal-case font-normal text-muted-foreground">
                      {outputInfo}
                    </span>
                  )}
                </span>
                {pngUrl && (
                  <Button size="sm" className="h-7 text-xs" onClick={downloadPng}>
                    Download PNG
                  </Button>
                )}
              </div>
              <div className="rounded-lg border border-border/60 bg-[repeating-conic-gradient(#e5e7eb_0%_25%,transparent_0%_50%)] bg-[length:20px_20px] dark:bg-[repeating-conic-gradient(#374151_0%_25%,transparent_0%_50%)] flex items-center justify-center p-4 min-h-40">
                {pngUrl ? (
                  <img
                    src={pngUrl}
                    alt="PNG output"
                    style={{ maxWidth: "100%", maxHeight: "300px", objectFit: "contain" }}
                  />
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Click &quot;Convert to PNG&quot; to generate output.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
