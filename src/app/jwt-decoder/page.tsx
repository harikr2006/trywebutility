"use client";

import React, { useState, useEffect } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { decodeJWT, isExpired, formatUnixTime } from "@/lib/tools/jwt";
import { AlertCircle, ShieldAlert, Clock, KeyRound, Layers, ShieldCheck, Zap } from "lucide-react";

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

  // Auto-decode when input looks like a JWT
  useEffect(() => {
    const trimmed = input.trim();
    if (/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*$/.test(trimmed)) {
      handleDecode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

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
      {/* Feature badges */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[
          { icon: KeyRound, label: "Header + Payload" },
          { icon: Layers, label: "Claim Inspector" },
          { icon: ShieldCheck, label: "Expiry Check" },
          { icon: Zap, label: "Client-Side Only" },
        ].map(({ icon: Icon, label }) => (
          <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/8 text-primary border border-primary/20">
            <Icon className="h-3 w-3" aria-hidden="true" />
            {label}
          </span>
        ))}
      </div>

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
                  <Badge className="text-[10px] h-4 px-1.5 gap-1 bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                    <Clock className="h-2.5 w-2.5" /> Not Expired
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
            <p className="mt-2 text-[11px] text-amber-600 dark:text-amber-400">
              ⚠ Signature not verified — this tool only decodes the token. Do not use the &quot;Not Expired&quot; badge as a trust signal.
            </p>
          </div>
        </div>
      )}

      {/* JWT Claims Reference */}
      <section className="mt-10 pt-8 border-t border-border/60">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-5">Standard JWT Claims Reference</h2>
        <div className="rounded-xl border border-border/60 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 border-b border-border/60">
                <th className="px-4 py-2.5 text-left font-semibold text-foreground w-20">Claim</th>
                <th className="px-4 py-2.5 text-left font-semibold text-foreground w-36">Name</th>
                <th className="px-4 py-2.5 text-left font-semibold text-foreground">Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                { claim: "iss", name: "Issuer", desc: "Who issued the token — typically the authentication server URL." },
                { claim: "sub", name: "Subject", desc: "Who the token is about — usually a user ID or email." },
                { claim: "aud", name: "Audience", desc: "Who the token is intended for — the API or client that should accept it." },
                { claim: "exp", name: "Expiration", desc: "Unix timestamp after which the token must not be accepted." },
                { claim: "nbf", name: "Not Before", desc: "Unix timestamp before which the token must not be accepted." },
                { claim: "iat", name: "Issued At", desc: "Unix timestamp when the token was issued." },
                { claim: "jti", name: "JWT ID", desc: "A unique identifier for the token — used to prevent replay attacks." },
              ].map((row) => (
                <tr key={row.claim} className="border-b border-border/40 last:border-0">
                  <td className="px-4 py-2.5 font-mono text-xs font-bold text-primary">{row.claim}</td>
                  <td className="px-4 py-2.5 font-medium text-sm">{row.name}</td>
                  <td className="px-4 py-2.5 text-sm text-muted-foreground">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* What is JWT */}
      <section className="mt-10 pt-8 border-t border-border/60">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">What is a JWT?</h2>
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed max-w-2xl">
          <p>
            A <strong className="text-foreground">JSON Web Token (JWT)</strong> is a compact, URL-safe token format
            defined by RFC 7519. It consists of three Base64URL-encoded parts separated by dots:{" "}
            <code className="font-mono text-xs bg-muted px-1 rounded">header.payload.signature</code>.
          </p>
          <p>
            The <strong className="text-foreground">header</strong> contains the token type and signing algorithm
            (e.g. <code className="font-mono text-xs bg-muted px-1 rounded">HS256</code> or{" "}
            <code className="font-mono text-xs bg-muted px-1 rounded">RS256</code>). The{" "}
            <strong className="text-foreground">payload</strong> contains claims — assertions about the user
            or session. The <strong className="text-foreground">signature</strong> verifies the token was
            issued by a trusted party and has not been tampered with.
          </p>
          <p className="text-amber-600 dark:text-amber-400 text-xs">
            This decoder reads the header and payload without verifying the signature — it is for inspection
            and debugging only. Never trust a JWT claim without server-side signature verification.
          </p>
        </div>
      </section>
    </ToolShell>
  );
}
