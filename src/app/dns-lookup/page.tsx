"use client";

import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";

const RECORD_TYPES = ["A", "AAAA", "MX", "CNAME", "TXT", "NS", "SOA", "PTR"] as const;
type RecordType = (typeof RECORD_TYPES)[number];

const TYPE_NAMES: Record<number, string> = {
  1: "A",
  2: "NS",
  5: "CNAME",
  6: "SOA",
  12: "PTR",
  15: "MX",
  16: "TXT",
  28: "AAAA",
};

interface DnsRecord {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

interface DnsResponse {
  Status: number;
  Answer?: DnsRecord[];
  Authority?: DnsRecord[];
}

export default function DnsLookupPage() {
  const [domain, setDomain] = useState("");
  const [recordType, setRecordType] = useState<RecordType>("A");
  const [results, setResults] = useState<DnsRecord[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastQuery, setLastQuery] = useState({ domain: "", type: "" });

  async function handleLookup() {
    const trimmed = domain.trim().replace(/\.+$/, "");
    if (!trimmed) return;

    setLoading(true);
    setError("");
    setResults(null);

    try {
      const url = `https://dns.google/resolve?name=${encodeURIComponent(trimmed)}&type=${recordType}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const data = (await res.json()) as DnsResponse;

      setLastQuery({ domain: trimmed, type: recordType });

      if (data.Answer && data.Answer.length > 0) {
        setResults(data.Answer);
      } else if (data.Authority && data.Authority.length > 0) {
        setResults(data.Authority);
      } else {
        setError("No records found for this domain and type");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error — check your connection and try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolShell
      title="DNS Lookup"
      description="Query DNS records for any domain using Google's DNS-over-HTTPS API. Supports A, AAAA, MX, CNAME, TXT, NS, SOA, and PTR records."
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left panel — inputs */}
        <div className="md:w-64 lg:w-72 shrink-0 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="dns-domain">
              Domain Name
            </label>
            <input
              id="dns-domain"
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLookup()}
              placeholder="google.com"
              autoComplete="off"
              spellCheck={false}
              className="w-full h-9 rounded-md border border-border/60 bg-background px-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="dns-type">
              Record Type
            </label>
            <select
              id="dns-type"
              value={recordType}
              onChange={(e) => setRecordType(e.target.value as RecordType)}
              className="w-full h-9 rounded-md border border-border/60 bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {RECORD_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <Button
            className="w-full"
            onClick={handleLookup}
            disabled={loading || !domain.trim()}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Looking up…
              </span>
            ) : (
              "Look up"
            )}
          </Button>
        </div>

        {/* Right panel — results */}
        <div className="flex-1 min-w-0">
          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Looking up DNS records…
            </div>
          )}

          {!loading && error && (
            <div className="flex gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && results === null && (
            <p className="text-sm text-muted-foreground py-2">
              Enter a domain and click Look up
            </p>
          )}

          {!loading && results && results.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{results.length}</span>{" "}
                record{results.length !== 1 ? "s" : ""} found for{" "}
                <span className="font-semibold font-mono text-foreground">
                  {lastQuery.domain}
                </span>{" "}
                ({lastQuery.type})
              </p>

              <div className="rounded-lg border border-border/60 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/40 border-b border-border/60">
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Name
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Type
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        TTL
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Value
                      </th>
                      <th className="px-2 py-2.5" />
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((rec, i) => (
                      <tr
                        key={i}
                        className="border-b border-border/40 last:border-0 even:bg-muted/20"
                      >
                        <td className="px-4 py-2.5 font-mono text-xs break-all max-w-[140px]">
                          {rec.name}
                        </td>
                        <td className="px-4 py-2.5 whitespace-nowrap">
                          <span className="rounded px-1.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary">
                            {TYPE_NAMES[rec.type] ?? String(rec.type)}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                          {rec.TTL}s
                        </td>
                        <td className="px-4 py-2.5 font-mono text-xs break-all">
                          {rec.data}
                        </td>
                        <td className="px-2 py-2.5 text-right whitespace-nowrap">
                          <CopyButton text={rec.data} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolShell>
  );
}
