"use client";
import { useState, useEffect, useRef } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { generateTotp } from "@/lib/tools/totp-generator";

export default function TotpGeneratorPage() {
  const [secret, setSecret] = useState("");
  const [digits, setDigits] = useState<6 | 8>(6);
  const [timeStep, setTimeStep] = useState<30 | 60>(30);
  const [code, setCode] = useState("");
  const [remaining, setRemaining] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function refresh(sec: string, d: 6 | 8, ts: 30 | 60) {
    if (!sec.trim()) {
      setCode("");
      setRemaining(0);
      setError(null);
      return;
    }
    const result = await generateTotp(sec, ts, d);
    if (result.error) {
      setError(result.error);
      setCode("");
      setRemaining(0);
    } else {
      setError(null);
      setCode(result.code);
      setRemaining(result.remaining);
    }
  }

  useEffect(() => {
    refresh(secret, digits, timeStep);

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      refresh(secret, digits, timeStep);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secret, digits, timeStep]);

  const progress = timeStep > 0 ? (remaining / timeStep) * 100 : 0;

  return (
    <ToolShell
      title="TOTP Generator"
      description="Generate Time-based One-Time Passwords (RFC 6238) — compatible with Google Authenticator and similar apps."
    >
      <div className="space-y-4">
        {/* Warning */}
        <div className="flex items-start gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-700 dark:text-yellow-400">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>Never use a real account secret on an untrusted website.</span>
        </div>

        {/* Secret input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Base32 Secret Key
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="e.g. JBSWY3DPEHPK3PXP"
              className="flex h-8 w-full rounded-md border border-border/60 bg-muted/30 px-3 py-1 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <Button
              size="sm"
              className="h-8 shrink-0"
              variant="outline"
              onClick={() => setSecret("JBSWY3DPEHPK3PXP")}
            >
              Use test key
            </Button>
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-wrap gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Digits
            </label>
            <div className="flex gap-2">
              {([6, 8] as const).map((d) => (
                <Button
                  key={d}
                  size="sm"
                  className="h-8"
                  variant={digits === d ? "default" : "outline"}
                  onClick={() => setDigits(d)}
                >
                  {d}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Time Step
            </label>
            <div className="flex gap-2">
              {([30, 60] as const).map((ts) => (
                <Button
                  key={ts}
                  size="sm"
                  className="h-8"
                  variant={timeStep === ts ? "default" : "outline"}
                  onClick={() => setTimeStep(ts)}
                >
                  {ts}s
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Code display */}
        {code && (
          <div className="space-y-3">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Current Code
            </label>
            <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-muted/20 px-6 py-5">
              <span className="flex-1 font-mono text-5xl font-bold tracking-[0.2em] text-foreground">
                {code}
              </span>
              <CopyButton text={code} />
            </div>

            {/* Countdown bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Expires in {remaining}s</span>
                <span className="font-mono">
                  Counter: {Math.floor(Date.now() / 1000 / timeStep)}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted/40">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
