"use client";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { generateJWT } from "@/lib/tools/jwt-generator";

type Algorithm = "HS256" | "HS384" | "HS512";

const DEFAULT_PAYLOAD = '{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}';

export default function JWTGeneratorPage() {
  const [payloadStr, setPayloadStr] = useState(DEFAULT_PAYLOAD);
  const [secret, setSecret] = useState("");
  const [algorithm, setAlgorithm] = useState<Algorithm>("HS256");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  async function handleGenerate() {
    setError("");
    setOutput("");

    let parsedPayload: Record<string, unknown>;
    try {
      parsedPayload = JSON.parse(payloadStr);
    } catch {
      setError("Invalid JSON payload. Please check the payload and try again.");
      return;
    }

    const { token, error: err } = await generateJWT(parsedPayload, secret, algorithm);
    if (err) { setError(err); return; }
    setOutput(token);
  }

  return (
    <ToolShell title="JWT Generator" description="Generate signed JSON Web Tokens (JWT). All processing in your browser.">
      <div className="flex flex-col gap-4">
        {/* Payload */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Payload (JSON)
          </label>
          <Textarea
            value={payloadStr}
            onChange={(e) => setPayloadStr(e.target.value)}
            placeholder='{ "sub": "1234567890" }'
            className="font-mono text-[13px] min-h-40 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
          />
        </div>

        {/* Secret + Algorithm */}
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="your-256-bit-secret"
            className="flex-1 h-8 rounded-md border border-border/60 bg-background px-3 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
            className="h-8 rounded-md border border-border/60 bg-background px-2 text-xs"
          >
            <option value="HS256">HS256</option>
            <option value="HS384">HS384</option>
            <option value="HS512">HS512</option>
          </select>
        </div>

        {/* Generate button */}
        <div>
          <Button size="sm" className="h-8" onClick={handleGenerate}>
            Generate
          </Button>
        </div>

        {/* Output */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Generated JWT
            </label>
            <CopyButton text={output} />
          </div>
          {error ? (
            <div className="flex gap-2 rounded-lg border border-destructive/40 bg-destructive/8 p-3 text-sm text-destructive font-mono min-h-20">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          ) : (
            <Textarea
              readOnly
              value={output}
              placeholder="Generated JWT will appear here..."
              className="font-mono text-[13px] min-h-20 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30 break-all"
            />
          )}
        </div>
      </div>
    </ToolShell>
  );
}
