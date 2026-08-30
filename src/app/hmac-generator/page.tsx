"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

type Algorithm = "SHA-256" | "SHA-1" | "SHA-512";
type OutputFormat = "hex" | "base64";

const ALGORITHMS: Algorithm[] = ["SHA-256", "SHA-1", "SHA-512"];

async function generateHmac(
  message: string,
  key: string,
  algo: Algorithm,
  format: OutputFormat
): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(key),
    { name: "HMAC", hash: algo },
    false,
    ["sign"]
  );
  const sig = await window.crypto.subtle.sign("HMAC", cryptoKey, enc.encode(message));
  const bytes = new Uint8Array(sig);
  if (format === "hex") {
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  // base64
  return btoa(String.fromCharCode(...bytes));
}

export default function HmacGeneratorPage() {
  const [message, setMessage] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [algorithm, setAlgorithm] = useState<Algorithm>("SHA-256");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("hex");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    if (!message.trim()) {
      setError("Please enter a message.");
      return;
    }
    if (!secretKey) {
      setError("Please enter a secret key.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await generateHmac(message, secretKey, algorithm, outputFormat);
      setOutput(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "HMAC generation failed.");
      setOutput("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolShell
      title="HMAC Generator"
      description="Generate HMAC message authentication codes using SHA-256, SHA-1, or SHA-512."
    >
      <div className="space-y-4">
        {/* Message */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Message
          </label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter message to authenticate..."
            className="font-mono text-[13px] min-h-72 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
          />
        </div>

        {/* Secret Key */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Secret Key
          </label>
          <input
            type="text"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            placeholder="Enter secret key..."
            className="w-full rounded-md border border-border/60 bg-muted/30 px-3 py-2 font-mono text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          />
        </div>

        {/* Algorithm */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Algorithm
          </label>
          <div className="flex flex-wrap gap-2">
            {ALGORITHMS.map((algo) => (
              <Button
                key={algo}
                size="sm"
                className="h-8"
                variant={algorithm === algo ? "default" : "outline"}
                onClick={() => setAlgorithm(algo)}
              >
                HMAC-{algo}
              </Button>
            ))}
          </div>
        </div>

        {/* Output Format */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Output Format
          </label>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="h-8"
              variant={outputFormat === "hex" ? "default" : "outline"}
              onClick={() => setOutputFormat("hex")}
            >
              Hex
            </Button>
            <Button
              size="sm"
              className="h-8"
              variant={outputFormat === "base64" ? "default" : "outline"}
              onClick={() => setOutputFormat("base64")}
            >
              Base64
            </Button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Generate Button */}
        <Button size="sm" className="h-8" onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate HMAC"}
        </Button>

        {/* Output */}
        {output && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                HMAC Output ({outputFormat === "hex" ? "Hex" : "Base64"})
              </label>
              <CopyButton text={output} />
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
              <p className="font-mono text-xs break-all text-foreground">{output}</p>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
