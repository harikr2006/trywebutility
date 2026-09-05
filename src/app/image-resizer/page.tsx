"use client";

import { useState, useRef, useCallback } from "react";
import ToolShell from "@/components/shared/ToolShell";
import { Button } from "@/components/ui/button";
import { Upload, Download, Lock, Unlock, Image as ImageIcon } from "lucide-react";

function resizeImage(file: File, width: number, height: number, format: string, quality: number): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);
      const mime = format === 'PNG' ? 'image/png' : format === 'WebP' ? 'image/webp' : 'image/jpeg';
      canvas.toBlob((blob) => resolve(blob!), mime, quality / 100);
    };
    img.src = url;
  });
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ImageResizerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [origWidth, setOrigWidth] = useState(0);
  const [origHeight, setOrigHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [lockAspect, setLockAspect] = useState(true);
  const [format, setFormat] = useState("JPEG");
  const [quality, setQuality] = useState(85);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevPreviewRef = useRef<string | null>(null);
  const prevDownloadRef = useRef<string | null>(null);

  const handleFile = useCallback((f: File) => {
    const img = new Image();
    const url = URL.createObjectURL(f);
    img.onload = () => {
      URL.revokeObjectURL(url);
      setFile(f);
      setOrigWidth(img.naturalWidth);
      setOrigHeight(img.naturalHeight);
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
      setAspectRatio(img.naturalWidth / img.naturalHeight);
      setPreviewUrl(null);
      setDownloadUrl(null);
      setOutputSize(null);
    };
    img.src = url;
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) handleFile(f);
  }, [handleFile]);

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (lockAspect && aspectRatio) setHeight(Math.round(val / aspectRatio));
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (lockAspect && aspectRatio) setWidth(Math.round(val * aspectRatio));
  };

  const handleResize = async () => {
    if (!file || !width || !height) return;
    setIsProcessing(true);
    if (prevPreviewRef.current) URL.revokeObjectURL(prevPreviewRef.current);
    if (prevDownloadRef.current) URL.revokeObjectURL(prevDownloadRef.current);
    const blob = await resizeImage(file, width, height, format, quality);
    const pUrl = URL.createObjectURL(blob);
    const dUrl = URL.createObjectURL(blob);
    prevPreviewRef.current = pUrl;
    prevDownloadRef.current = dUrl;
    setPreviewUrl(pUrl);
    setDownloadUrl(dUrl);
    setOutputSize(blob.size);
    setIsProcessing(false);
  };

  const ext = format === "PNG" ? "png" : format === "WebP" ? "webp" : "jpg";
  const downloadName = file ? `${file.name.replace(/\.[^.]+$/, "")}-resized.${ext}` : `resized.${ext}`;

  return (
    <ToolShell
      title="Image Resizer & Compressor"
      description="Resize and compress images in your browser using the Canvas API. No upload to any server."
    >
      <div className="space-y-6 max-w-2xl mx-auto">
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/30 hover:border-primary/60 hover:bg-muted/40"
          }`}
        >
          <Upload className="w-8 h-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground text-center">
            Drop an image here or click to browse
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
          />
        </div>

        {file && (
          <div className="rounded-lg border bg-muted/30 px-4 py-3 flex items-center gap-3 text-sm">
            <ImageIcon className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="font-medium truncate">{file.name}</span>
            <span className="text-muted-foreground shrink-0">
              {origWidth} × {origHeight}px &mdash; {formatBytes(file.size)}
            </span>
          </div>
        )}

        {file && (
          <div className="space-y-4">
            <div className="flex items-end gap-3">
              <div className="flex-1 space-y-1">
                <label className="text-sm font-medium">Width (px)</label>
                <input
                  type="number"
                  min={1}
                  value={width}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button
                type="button"
                onClick={() => setLockAspect((v) => !v)}
                className="mb-px p-2 rounded-md border hover:bg-muted transition-colors"
                title={lockAspect ? "Unlock aspect ratio" : "Lock aspect ratio"}
              >
                {lockAspect ? (
                  <Lock className="w-4 h-4 text-primary" />
                ) : (
                  <Unlock className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
              <div className="flex-1 space-y-1">
                <label className="text-sm font-medium">Height (px)</label>
                <input
                  type="number"
                  min={1}
                  value={height}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Output Format</label>
              <div className="flex gap-2">
                {["JPEG", "PNG", "WebP"].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFormat(f)}
                    className={`px-4 py-1.5 rounded-md border text-sm font-medium transition-colors ${
                      format === f
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background hover:bg-muted border-muted-foreground/30"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {format !== "PNG" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Quality: <span className="text-primary">{quality}</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0 — Smallest</span>
                  <span>100 — Best</span>
                </div>
              </div>
            )}

            <Button
              onClick={handleResize}
              disabled={isProcessing || !width || !height}
              className="w-full"
            >
              {isProcessing ? "Processing…" : "Resize & Download"}
            </Button>
          </div>
        )}

        {previewUrl && downloadUrl && (
          <div className="space-y-3">
            <div className="rounded-lg border overflow-hidden bg-muted/20 flex items-center justify-center p-4">
              <img
                src={previewUrl}
                alt="Resized preview"
                className="max-w-full max-h-72 object-contain rounded"
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                Output: {width} × {height}px
                {outputSize !== null && (
                  <span className="ml-2 font-medium text-foreground">
                    &mdash; {formatBytes(outputSize)}
                  </span>
                )}
              </div>
              <a href={downloadUrl} download={downloadName}>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
