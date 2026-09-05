"use client";
import { useState, useRef } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";

const SIZES = [16, 32, 48, 64, 128, 180, 192, 512];

function sizeName(size: number): string {
  if (size === 180) return "apple-touch-icon.png";
  if (size <= 48) return `favicon-${size}x${size}.png`;
  return `icon-${size}x${size}.png`;
}

function sizeHref(size: number): string {
  if (size === 180) return "/apple-touch-icon.png";
  if (size <= 48) return `/favicon-${size}x${size}.png`;
  return `/icon-${size}x${size}.png`;
}

function buildHtmlSnippet(): string {
  return SIZES.map((size) => {
    if (size === 180) {
      return `<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">`;
    }
    if (size === 32) {
      return `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">`;
    }
    if (size === 16) {
      return `<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">`;
    }
    if (size === 192) {
      return `<link rel="icon" type="image/png" sizes="192x192" href="/icon-192x192.png">`;
    }
    if (size === 512) {
      return `<link rel="icon" type="image/png" sizes="512x512" href="/icon-512x512.png">`;
    }
    return `<link rel="icon" type="image/png" sizes="${size}x${size}" href="${sizeHref(size)}">`;
  }).join("\n");
}

const HTML_SNIPPET = buildHtmlSnippet();

export default function FaviconGeneratorPage() {
  const [previews, setPreviews] = useState<Record<number, string>>({});
  const [dragging, setDragging] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function generateFavicons(img: HTMLImageElement) {
    const result: Record<number, string> = {};
    for (const size of SIZES) {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, size, size);
      result[size] = canvas.toDataURL("image/png");
    }
    setPreviews(result);
    setHasImage(true);
  }

  function loadFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => generateFavicons(img);
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  function downloadSize(size: number) {
    const url = previews[size];
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = sizeName(size);
    a.click();
  }

  function downloadAll() {
    SIZES.forEach((size, i) => {
      setTimeout(() => downloadSize(size), i * 200);
    });
  }

  return (
    <ToolShell
      title="Favicon Generator"
      description="Generate favicon images in all standard sizes from any image. Download individually or all at once, with a ready-to-use HTML snippet."
    >
      <div className="space-y-5">
        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const f = e.dataTransfer.files[0];
            if (f) loadFile(f);
          }}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragging ? "border-primary bg-primary/5" : "border-border/60 hover:border-primary/50"
          }`}
        >
          <p className="text-sm text-muted-foreground">
            Drag & drop an image or{" "}
            <span className="text-primary font-medium">click to upload</span>
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            PNG, SVG, or JPG &mdash; square images work best
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && loadFile(e.target.files[0])}
          />
        </div>

        {hasImage && Object.keys(previews).length > 0 && (
          <>
            {/* Header + Download All */}
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Generated Favicons</h2>
              <Button size="sm" variant="outline" onClick={downloadAll}>
                Download All
              </Button>
            </div>

            {/* Size grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SIZES.map((size) => {
                const previewSize = Math.min(size, 64);
                return (
                  <div
                    key={size}
                    className="border border-border/60 rounded-lg p-3 flex flex-col items-center gap-2"
                  >
                    {/* Checkered background to show transparency */}
                    <div
                      className="rounded overflow-hidden flex items-center justify-center"
                      style={{
                        width: 64,
                        height: 64,
                        backgroundImage:
                          "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
                        backgroundSize: "12px 12px",
                        backgroundPosition: "0 0, 0 6px, 6px -6px, -6px 0px",
                      }}
                    >
                      <img
                        src={previews[size]}
                        alt={`${size}x${size}`}
                        style={{ width: previewSize, height: previewSize }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-center leading-tight">
                      {size}×{size}
                      {size === 180 && (
                        <span className="block text-[10px] text-muted-foreground/60">
                          apple-touch-icon
                        </span>
                      )}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full h-7 text-xs"
                      onClick={() => downloadSize(size)}
                    >
                      Download
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* HTML snippet */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">HTML Snippet</h2>
                <CopyButton text={HTML_SNIPPET} />
              </div>
              <pre className="bg-muted/40 border border-border/60 rounded-lg p-4 text-xs font-mono overflow-x-auto whitespace-pre">
                {HTML_SNIPPET}
              </pre>
              <p className="text-xs text-muted-foreground">
                Add these tags inside your{" "}
                <code className="font-mono bg-muted px-1 rounded">&lt;head&gt;</code>{" "}
                element. Place the downloaded files in your site&apos;s root directory.
              </p>
            </div>
          </>
        )}
      </div>
    </ToolShell>
  );
}
