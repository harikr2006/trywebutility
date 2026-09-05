"use client";
import { useState, useRef } from "react";
import ToolShell from "@/components/shared/ToolShell";
import { Button } from "@/components/ui/button";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

interface ImageItem {
  id: string;
  file: File;
  originalUrl: string;
  originalSize: number;
  quality: number;
  compressedBlob: Blob | null;
  compressedSize: number;
  compressing: boolean;
  outputType: string;
}

function compressImageFile(item: ImageItem, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(null); return; }
      ctx.drawImage(img, 0, 0);
      // PNG → WebP for actual compression; JPEG/WebP use native format
      const outType = item.file.type === "image/png" ? "image/webp" : item.file.type;
      canvas.toBlob((blob) => resolve(blob), outType, quality / 100);
    };
    img.onerror = () => resolve(null);
    img.src = item.originalUrl;
  });
}

export default function ImageCompressorPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function addFiles(files: FileList) {
    const newItems: ImageItem[] = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        originalUrl: URL.createObjectURL(file),
        originalSize: file.size,
        quality: 80,
        compressedBlob: null,
        compressedSize: 0,
        compressing: true,
        outputType: file.type === "image/png" ? "image/webp" : file.type,
      }));

    if (newItems.length === 0) return;
    setImages((prev) => [...prev, ...newItems]);

    for (const item of newItems) {
      const blob = await compressImageFile(item, 80);
      setImages((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? { ...i, compressedBlob: blob, compressedSize: blob?.size ?? 0, compressing: false }
            : i
        )
      );
    }
  }

  async function updateQuality(id: string, quality: number) {
    setImages((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quality, compressing: true } : i))
    );
    // Re-read item from current images ref after scheduling update
    setImages((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item) return prev;
      compressImageFile({ ...item, quality }, quality).then((blob) => {
        setImages((curr) =>
          curr.map((i) =>
            i.id === id
              ? { ...i, compressedBlob: blob, compressedSize: blob?.size ?? 0, compressing: false }
              : i
          )
        );
      });
      return prev;
    });
  }

  function downloadOne(item: ImageItem) {
    if (!item.compressedBlob) return;
    const ext = item.outputType.split("/")[1];
    const baseName = item.file.name.replace(/\.[^.]+$/, "");
    const url = URL.createObjectURL(item.compressedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${baseName}_compressed.${ext}`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  function downloadAll() {
    images.forEach((item, i) => {
      setTimeout(() => downloadOne(item), i * 350);
    });
  }

  function removeImage(id: string) {
    setImages((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.originalUrl);
      return prev.filter((i) => i.id !== id);
    });
  }

  const totalOriginal = images.reduce((s, i) => s + i.originalSize, 0);
  const totalCompressed = images.reduce((s, i) => s + i.compressedSize, 0);
  const saved = totalOriginal - totalCompressed;
  const savedPct = totalOriginal > 0 ? Math.round((saved / totalOriginal) * 100) : 0;

  return (
    <ToolShell
      title="Image Compressor"
      description="Compress one or multiple images with adjustable quality. PNG files are converted to WebP for maximum compression."
    >
      <div className="space-y-5">
        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            addFiles(e.dataTransfer.files);
          }}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragging ? "border-primary bg-primary/5" : "border-border/60 hover:border-primary/50"
          }`}
        >
          <p className="text-sm text-muted-foreground">
            Drag & drop images here or{" "}
            <span className="text-primary font-medium">click to upload</span>
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Multiple images supported &mdash; JPEG, PNG, WebP
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && addFiles(e.target.files)}
          />
        </div>

        {images.length > 0 && (
          <>
            {/* Summary bar */}
            <div className="flex flex-wrap items-center gap-4 p-3 bg-muted/30 rounded-lg text-sm">
              <span>
                Original:{" "}
                <strong className="text-foreground">{formatBytes(totalOriginal)}</strong>
              </span>
              <span>
                Compressed:{" "}
                <strong className="text-foreground">{formatBytes(totalCompressed)}</strong>
              </span>
              {saved > 0 && (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  Saved {formatBytes(saved)} ({savedPct}%)
                </span>
              )}
              <div className="ml-auto flex gap-2">
                <Button size="sm" variant="outline" onClick={downloadAll}>
                  Download All
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground"
                  onClick={() => {
                    setImages((prev) => {
                      prev.forEach((item) => URL.revokeObjectURL(item.originalUrl));
                      return [];
                    });
                  }}
                >
                  Clear All
                </Button>
              </div>
            </div>

            {/* Image list */}
            <div className="space-y-3">
              {images.map((item) => {
                const reduction =
                  item.compressedSize > 0
                    ? Math.round(
                        ((item.originalSize - item.compressedSize) / item.originalSize) * 100
                      )
                    : 0;
                return (
                  <div
                    key={item.id}
                    className="border border-border/60 rounded-lg p-4 flex gap-4 items-start"
                  >
                    {/* Thumbnail */}
                    <img
                      src={item.originalUrl}
                      alt={item.file.name}
                      className="w-14 h-14 object-cover rounded border border-border/40 shrink-0"
                    />

                    {/* Details */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <p className="text-sm font-medium truncate">{item.file.name}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span>Original: {formatBytes(item.originalSize)}</span>
                        {item.compressing && (
                          <span className="text-muted-foreground/60 italic">Compressing…</span>
                        )}
                        {!item.compressing && item.compressedSize > 0 && (
                          <>
                            <span>Compressed: {formatBytes(item.compressedSize)}</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                              -{reduction}%
                            </span>
                          </>
                        )}
                        {item.file.type === "image/png" && (
                          <span className="text-amber-600 dark:text-amber-400">PNG → WebP</span>
                        )}
                      </div>

                      {/* Quality slider */}
                      <div className="flex items-center gap-3">
                        <label className="text-xs text-muted-foreground whitespace-nowrap w-24">
                          Quality: {item.quality}%
                        </label>
                        <input
                          type="range"
                          min={10}
                          max={100}
                          value={item.quality}
                          onChange={(e) => updateQuality(item.id, Number(e.target.value))}
                          className="flex-1 accent-primary"
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs"
                        onClick={() => downloadOne(item)}
                        disabled={!item.compressedBlob || item.compressing}
                      >
                        Download
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-xs text-muted-foreground"
                        onClick={() => removeImage(item.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </ToolShell>
  );
}
