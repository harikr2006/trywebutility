"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Eye, EyeOff, Copy, Trash2, AlertCircle, Info } from "lucide-react";

type Mode = "encrypt" | "decrypt";

async function encrypt(text: string, passphrase: string): Promise<string> {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(passphrase), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial, { name: "AES-GCM", length: 256 }, false, ["encrypt"]
  );
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(text));
  const combined = new Uint8Array(salt.byteLength + iv.byteLength + ciphertext.byteLength);
  combined.set(salt, 0);
  combined.set(iv, 16);
  combined.set(new Uint8Array(ciphertext), 28);
  return btoa(String.fromCharCode(...combined));
}

async function decrypt(base64: string, passphrase: string): Promise<string> {
  const data = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  const salt = data.slice(0, 16);
  const iv = data.slice(16, 28);
  const ciphertext = data.slice(28);
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(passphrase), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial, { name: "AES-GCM", length: 256 }, false, ["decrypt"]
  );
  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
  return new TextDecoder().decode(decrypted);
}

export default function TextEncryptorPage() {
  const [mode, setMode] = useState<Mode>("encrypt");
  const [passphrase, setPassphrase] = useState("");
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleModeChange(next: Mode) {
    setMode(next);
    setInput("");
    setOutput("");
    setError(null);
  }

  async function handleRun() {
    if (!input.trim()) {
      setError(mode === "encrypt" ? "Please enter text to encrypt." : "Please enter ciphertext to decrypt.");
      return;
    }
    if (!passphrase) {
      setError("Please enter a passphrase.");
      return;
    }
    setError(null);
    setLoading(true);
    setOutput("");
    try {
      const result = mode === "encrypt"
        ? await encrypt(input, passphrase)
        : await decrypt(input.trim(), passphrase);
      setOutput(result);
    } catch {
      if (mode === "decrypt") {
        setError("Decryption failed. Check your passphrase.");
      } else {
        setError("Encryption failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setInput("");
    setOutput("");
    setError(null);
    setPassphrase("");
  }

  async function handleCopy() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <ToolShell
      title="Text Encryptor / Decryptor"
      description="Encrypt and decrypt text with AES-256-GCM using a passphrase. Everything runs in your browser."
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Mode
          </label>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="h-8"
              variant={mode === "encrypt" ? "default" : "outline"}
              onClick={() => handleModeChange("encrypt")}
            >
              Encrypt
            </Button>
            <Button
              size="sm"
              className="h-8"
              variant={mode === "decrypt" ? "default" : "outline"}
              onClick={() => handleModeChange("decrypt")}
            >
              Decrypt
            </Button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Passphrase
          </label>
          <div className="relative">
            <input
              type={showPassphrase ? "text" : "password"}
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Enter passphrase..."
              className="w-full rounded-md border border-border/60 bg-muted/30 px-3 py-2 pr-10 font-mono text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            />
            <button
              type="button"
              onClick={() => setShowPassphrase((v) => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassphrase ? "Hide passphrase" : "Show passphrase"}
            >
              {showPassphrase ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {mode === "encrypt" ? "Text to Encrypt" : "Ciphertext (base64)"}
          </label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encrypt" ? "Enter plaintext to encrypt..." : "Paste base64 ciphertext here..."}
            className="font-mono text-[13px] min-h-32 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex gap-2">
          <Button size="sm" className="h-8" onClick={handleRun} disabled={loading}>
            {loading ? (mode === "encrypt" ? "Encrypting..." : "Decrypting...") : (mode === "encrypt" ? "Encrypt" : "Decrypt")}
          </Button>
          <Button size="sm" className="h-8" variant="outline" onClick={handleClear}>
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Clear
          </Button>
        </div>

        {output && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {mode === "encrypt" ? "Encrypted Output (base64)" : "Decrypted Text"}
              </label>
              <Button size="sm" className="h-7 gap-1.5" variant="outline" onClick={handleCopy}>
                <Copy className="h-3.5 w-3.5" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <Textarea
              readOnly
              value={output}
              className="font-mono text-[13px] min-h-32 resize-y bg-muted/20 border-border/60 focus-visible:ring-primary/30"
            />
          </div>
        )}

        <div className="flex items-start gap-2 rounded-lg border border-border/40 bg-muted/20 px-3 py-2.5 text-xs text-muted-foreground">
          <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>All encryption happens in your browser. Nothing is sent to any server.</span>
        </div>
      </div>
    </ToolShell>
  );
}
