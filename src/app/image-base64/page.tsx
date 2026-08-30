"use client";
import { useState, useRef } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { AlertCircle, Upload } from "lucide-react";
import { fileToBase64, base64ToImageTag, base64ToCSSBackground } from "@/lib/tools/image-base64";

export default function ImageBase64Page() {
  const [dataUrl, setDataUrl] = useState("");
  const [mimeType, setMimeType] = useState("");
  const [sizeKB, setSizeKB] = useState(0);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      setError("File too large. Maximum size is 5 MB.");
      return;
    }
    const { dataUrl: url, mimeType: mime, sizeKB: kb, error: err } = await fileToBase64(file);
    if (err) { setError(err); return; }
    setError("");
    setDataUrl(url);
    setMimeType(mime);
    setSizeKB(kb);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <ToolShell title="Image → Base64" description="Encode images to Base64 data URLs for embedding in HTML/CSS. All processing in your browser.">
      <div className="space-y-4">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border/60 bg-muted/20 p-8 gap-3 cursor-pointer hover:border-primary/40 transition-colors"
          onClick={() => fileRef.current?.click()}
        >
          <Upload className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Drop an image or click to upload</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }}
          />
        </div>

        {error && (
          <div className="flex gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {dataUrl && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Type: <code className="font-mono text-foreground">{mimeType}</code></span>
              <span>Size: <code className="font-mono text-foreground">{sizeKB} KB</code></span>
            </div>

            <div className="flex justify-center">
              <img src={dataUrl} alt="Preview" className="max-h-48 rounded-lg border object-contain" />
            </div>

            {[
              { label: "Data URL", value: dataUrl },
              { label: "HTML img tag", value: base64ToImageTag(dataUrl) },
              { label: "CSS background", value: base64ToCSSBackground(dataUrl) },
            ].map(({ label, value }) => (
              <div key={label} className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</label>
                  <CopyButton text={value} />
                </div>
                <div className="rounded-md border bg-muted/30 px-3 py-2 font-mono text-xs break-all max-h-20 overflow-y-auto">
                  {value.slice(0, 120)}…
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolShell>
  );
}
