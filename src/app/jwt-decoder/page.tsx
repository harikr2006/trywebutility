"use client";

import React, { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { decodeJWT, isExpired, formatUnixTime } from "@/lib/tools/jwt";
import { AlertCircle, ShieldAlert, ShieldCheck } from "lucide-react";

export default function JWTDecoderPage() {
  const [input, setInput] = useState("");
  const [decoded, setDecoded] = useState<{
    header: Record<string, unknown>;
    payload: Record<string, unknown>;
    signature: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleDecode() {
    const { data, error: err } = decodeJWT(input);
    setDecoded(data);
    setError(err);
  }

  function handleClear() {
    setInput("");
    setDecoded(null);
    setError(null);
  }

  const expired = decoded ? isExpired(decoded.payload) : false;

  function renderValue(key: string, value: unknown): React.ReactNode {
    if ((key === "exp" || key === "iat" || key === "nbf") && typeof value === "number") {
      return (
        <span>
          <span className="text-foreground">{value}</span>{" "}
          <span className="text-muted-foreground text-xs">({formatUnixTime(value)})</span>
        </span>
      );
    }
    return <span>{JSON.stringify(value)}</span>;
  }

  return (
    <ToolShell
      title="JWT Decoder"
      description="Decode and inspect JWT tokens — header, payload, and signature. No data leaves your browser."
    >
      <div className="flex items-center gap-2">
        <Button onClick={handleDecode} size="sm" className="h-8">Decode</Button>
        <Button onClick={handleClear} size="sm" variant="ghost" className="h-8 text-muted-foreground">Clear</Button>
      </div>

      <Textarea
        className="font-mono text-[13px] min-h-24 resize-none bg-muted/30 border-border/60 focus-visible:ring-primary/30"
        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        spellCheck={false}
      />

      {error && (
        <div className="flex gap-2 rounded-lg border border-destructive/40 bg-destructive/8 p-3 text-sm text-destructive font-mono">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {decoded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Header */}
          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Header</span>
              </div>
              <CopyButton text={JSON.stringify(decoded.header, null, 2)} />
            </div>
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(decoded.header).map(([k, v]) => (
                  <tr key={k} className="border-b border-border/50 last:border-0">
                    <td className="py-1.5 pr-3 font-mono text-xs text-muted-foreground font-medium w-1/3">{k}</td>
                    <td className="py-1.5 font-mono text-xs">{renderValue(k, v)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Payload */}
          <div className="rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">Payload</span>
                {expired ? (
                  <Badge variant="destructive" className="text-[10px] h-4 px-1.5 gap-1">
                    <ShieldAlert className="h-2.5 w-2.5" /> Expired
                  </Badge>
                ) : !!decoded.payload.exp ? (
                  <Badge className="text-[10px] h-4 px-1.5 gap-1 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
                    <ShieldCheck className="h-2.5 w-2.5" /> Valid
                  </Badge>
                ) : null}
              </div>
              <CopyButton text={JSON.stringify(decoded.payload, null, 2)} />
            </div>
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(decoded.payload).map(([k, v]) => (
                  <tr key={k} className="border-b border-border/50 last:border-0">
                    <td className="py-1.5 pr-3 font-mono text-xs text-muted-foreground font-medium w-1/3">{k}</td>
                    <td className="py-1.5 font-mono text-xs break-all">{renderValue(k, v)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signature */}
          <div className="md:col-span-2 rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">Signature</span>
              <CopyButton text={decoded.signature} />
            </div>
            <p className="font-mono text-xs text-muted-foreground break-all leading-relaxed">
              {decoded.signature}
            </p>
          </div>
        </div>
      )}
    </ToolShell>
  );
}
