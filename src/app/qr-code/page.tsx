"use client";
import { useState, useEffect } from "react";
import ToolShell from "@/components/shared/ToolShell";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { generateQRDataURL } from "@/lib/tools/qrcode-gen";

const SIZE_OPTIONS = [200, 300, 400];

export default function QRCodePage() {
  const [input, setInput] = useState("https://example.com");
  const [dataUrl, setDataUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [size, setSize] = useState(300);
  const [loading, setLoading] = useState(false);

  async function handleGenerate(text: string = input, qrSize: number = size) {
    if (!text.trim()) {
      setError("Please enter a URL or text.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const { dataUrl: url, error: qrErr } = await generateQRDataURL(text, qrSize);
      if (qrErr) { setError(qrErr); } else { setDataUrl(url); }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate QR code.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleGenerate(input, size);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ToolShell
      title="QR Code Generator"
      description="Convert any URL or text into a scannable QR code. Download as PNG."
    >
      <div className="space-y-4">
        {/* Text input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            URL or Text
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter URL or text..."
            className="w-full h-9 rounded-md border border-border/60 bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          />
        </div>

        {/* Size selector + Generate */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Size
            </label>
            <div className="flex gap-1">
              {SIZE_OPTIONS.map((s) => (
                <Button
                  key={s}
                  size="sm"
                  className="h-8"
                  variant={size === s ? "default" : "outline"}
                  onClick={() => setSize(s)}
                >
                  {s}px
                </Button>
              ))}
            </div>
          </div>

          <Button
            size="sm"
            className="h-8"
            onClick={() => handleGenerate(input, size)}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate"}
          </Button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* QR display */}
        {dataUrl && (
          <div className="space-y-3">
            <div className="flex justify-center">
              <img
                src={dataUrl}
                alt="QR Code"
                width={size}
                height={size}
                className="rounded-lg border p-4 bg-white"
              />
            </div>
            <div className="flex justify-center">
              <a href={dataUrl} download="qrcode.png">
                <Button variant="outline" size="sm">
                  Download PNG
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
