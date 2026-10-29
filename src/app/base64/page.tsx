"use client";

import { useState, useRef, useCallback } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { encodeBase64, decodeBase64 } from "@/lib/tools/base64";
import { AlertCircle, ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight, Upload, Download, X } from "lucide-react";
import { cn } from "@/lib/utils";

function isBinaryOutput(str: string): boolean {
  for (let i = 0; i < Math.min(str.length, 512); i++) {
    const code = str.charCodeAt(i);
    if (code < 32 && code !== 9 && code !== 10 && code !== 13) return true;
  }
  return false;
}

export default function Base64Page() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"encode" | "decode" | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isFileBinary, setIsFileBinary] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleEncode() {
    if (isFileBinary) {
      // Already encoded from file load, output is already set
      setMode("encode");
      return;
    }
    const { output: out, error: err } = encodeBase64(input);
    setOutput(out);
    setError(err);
    setMode("encode");
  }

  function handleDecode() {
    const { output: out, error: err } = decodeBase64(input);
    setOutput(out);
    setError(err);
    setMode("decode");
  }

  function handleSwap() {
    setInput(output);
    setOutput("");
    setError(null);
    setMode(null);
    setFileName(null);
    setIsFileBinary(false);
  }

  function handleClear() {
    setInput("");
    setOutput("");
    setError(null);
    setMode(null);
    setFileName(null);
    setIsFileBinary(false);
  }

  function loadFile(file: File) {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      // Strip data:<mime>;base64, prefix
      const base64 = dataUrl.split(",")[1] ?? "";
      setOutput(base64);
      setInput("");
      setError(null);
      setMode("encode");
      setIsFileBinary(true);
    };
    reader.readAsDataURL(file);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
    e.target.value = "";
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadFile(file);
  }, []);

  function handleDownloadBinary() {
    try {
      const raw = atob(input.trim());
      const bytes = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
      const blob = new Blob([bytes]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "decoded-file";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Failed to decode as binary. Is this valid Base64?");
    }
  }

  const decodedIsBinary = mode === "decode" && output && isBinaryOutput(output);
  const hasInput = input.trim().length > 0;

  return (
    <ToolShell
      title="Base64 Encoder / Decoder"
      description="Encode text or files to Base64, or decode Base64 strings. All processing in your browser."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input panel */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between h-7">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {mode === "decode" ? "Base64 Input" : "Text Input"}
            </label>
            <div className="flex items-center gap-2">
              {fileName && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md border border-border/50">
                  {fileName}
                  <button
                    onClick={handleClear}
                    className="ml-0.5 text-muted-foreground/60 hover:text-foreground transition-colors"
                    aria-label="Remove file"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {!isFileBinary && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Upload file
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="*"
                className="hidden"
                onChange={handleFileInput}
              />
            </div>
          </div>

          <div
            className={cn(
              "relative rounded-lg transition-colors",
              isDragging && "ring-2 ring-primary ring-offset-1 bg-primary/5"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {isFileBinary ? (
              <div className="min-h-64 rounded-lg border border-border/60 bg-muted/30 flex items-center justify-center p-4">
                <div className="text-center text-sm text-muted-foreground">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                  <p className="font-medium">{fileName}</p>
                  <p className="text-xs mt-1">File encoded to Base64. See output →</p>
                </div>
              </div>
            ) : (
              <Textarea
                className="font-mono text-[13px] min-h-64 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
                placeholder={"Enter text to encode, or Base64 to decode...\n\n— or drag & drop any file to encode it"}
                value={input}
                onChange={(e) => { setInput(e.target.value); if (fileName) { setFileName(null); setIsFileBinary(false); } }}
                spellCheck={false}
              />
            )}
            {isDragging && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-lg pointer-events-none">
                <Upload className="h-8 w-8 text-primary/70" />
                <span className="text-sm font-medium text-primary/80">Drop file to encode as Base64</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button onClick={handleEncode} size="sm" className="h-8 gap-1.5" disabled={!hasInput && !isFileBinary}>
              <ArrowDownToLine className="h-3.5 w-3.5" /> Encode
            </Button>
            <Button onClick={handleDecode} size="sm" variant="outline" className="h-8 gap-1.5" disabled={!hasInput}>
              <ArrowUpFromLine className="h-3.5 w-3.5" /> Decode
            </Button>
            <Button onClick={handleSwap} size="sm" variant="outline" className="h-8 gap-1.5" disabled={!output}>
              <ArrowLeftRight className="h-3.5 w-3.5" /> Use output as input
            </Button>
            <Button onClick={handleClear} size="sm" variant="ghost" className="h-8 ml-auto text-muted-foreground" disabled={!input && !output && !isFileBinary}>Clear</Button>
          </div>
        </div>

        {/* Output panel */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between h-7">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {mode === "encode" ? "Base64 Output" : "Output"}
            </label>
            <div className="flex items-center gap-2">
              {decodedIsBinary && (
                <button
                  onClick={handleDownloadBinary}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download binary
                </button>
              )}
              <CopyButton text={output} />
            </div>
          </div>
          {error ? (
            <div className="flex gap-2 rounded-lg border border-destructive/40 bg-destructive/8 p-3 text-sm text-destructive font-mono min-h-64">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          ) : decodedIsBinary ? (
            <div className="min-h-64 rounded-lg border border-border/60 bg-muted/30 flex items-center justify-center p-4">
              <div className="text-center text-sm text-muted-foreground">
                <Download className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                <p className="font-medium">Binary content detected</p>
                <p className="text-xs mt-1">Use "Download binary" to save the decoded file</p>
              </div>
            </div>
          ) : (
            <Textarea
              className="font-mono text-[13px] min-h-64 resize-y bg-muted/30 border-border/60"
              value={output}
              readOnly
              placeholder="Output will appear here..."
              spellCheck={false}
            />
          )}
        </div>
      </div>
    </ToolShell>
  );
}
