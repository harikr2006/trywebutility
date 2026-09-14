"use client";

import { useState, useEffect, useCallback } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";

interface GeoData {
  ip: string;
  city: string;
  region: string;
  country_name: string;
  country_code: string;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  org: string;
  asn: string;
  error?: boolean;
  reason?: string;
}

function countryFlag(code: string): string {
  return code
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(c.charCodeAt(0) + 0x1f1a5));
}

export default function IpGeolocationPage() {
  const [ipInput, setIpInput] = useState("");
  const [data, setData] = useState<GeoData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOwnIp, setIsOwnIp] = useState(false);

  const lookup = useCallback(async (ip: string) => {
    setLoading(true);
    setError("");
    setData(null);
    setIsOwnIp(ip === "");

    try {
      const url = ip
        ? `https://ipapi.co/${encodeURIComponent(ip.trim())}/json/`
        : "https://ipapi.co/json/";
      const res = await fetch(url);
      const json = (await res.json()) as GeoData;

      if (json.error) {
        const reason = json.reason ?? "Unknown error";
        if (reason.toLowerCase().includes("rate")) {
          setError("Rate limit reached — try again later");
        } else {
          setError(reason);
        }
      } else {
        setData(json);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Network error — check your connection and try again"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    lookup("");
  }, [lookup]);

  const cards: { label: string; value: string; copy: string }[] = data
    ? [
        {
          label: "IP Address",
          value: data.ip,
          copy: data.ip,
        },
        {
          label: "Country",
          value: data.country_code
            ? `${countryFlag(data.country_code)} ${data.country_name} (${data.country_code})`
            : data.country_name ?? "—",
          copy: data.country_name
            ? `${data.country_name} (${data.country_code})`
            : "",
        },
        {
          label: "City",
          value: data.city || "—",
          copy: data.city || "",
        },
        {
          label: "Region",
          value: data.region || "—",
          copy: data.region || "",
        },
        {
          label: "Postal Code",
          value: data.postal || "—",
          copy: data.postal || "",
        },
        {
          label: "Coordinates",
          value:
            data.latitude != null && data.longitude != null
              ? `${data.latitude}, ${data.longitude}`
              : "—",
          copy:
            data.latitude != null && data.longitude != null
              ? `${data.latitude}, ${data.longitude}`
              : "",
        },
        {
          label: "Timezone",
          value: data.timezone || "—",
          copy: data.timezone || "",
        },
        {
          label: "UTC Offset",
          value: data.utc_offset || "—",
          copy: data.utc_offset || "",
        },
        {
          label: "Organization",
          value: data.org || "—",
          copy: data.org || "",
        },
        {
          label: "ASN",
          value: data.asn || "—",
          copy: data.asn || "",
        },
      ]
    : [];

  return (
    <ToolShell
      title="IP Geolocation"
      description="Look up geographic and network information for any IP address. Leave the field blank to detect your own IP automatically."
    >
      <div className="space-y-5">
        {/* Input row */}
        <div className="flex gap-2">
          <input
            type="text"
            value={ipInput}
            onChange={(e) => setIpInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && lookup(ipInput)}
            placeholder="IP address (leave blank for your IP)"
            autoComplete="off"
            spellCheck={false}
            className="flex-1 h-9 rounded-md border border-border/60 bg-background px-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <Button
            onClick={() => lookup(ipInput)}
            disabled={loading}
            className="h-9 shrink-0"
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

        {/* Loading state */}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            {isOwnIp ? "Detecting your IP…" : "Looking up…"}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="flex gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Results grid */}
        {!loading && data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {cards.map(({ label, value, copy }) => (
              <div
                key={label}
                className="rounded-lg border border-border/60 bg-card p-3 flex flex-col gap-1.5"
              >
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {label}
                </span>
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <span className="text-sm font-mono break-all leading-snug">
                    {value}
                  </span>
                  {copy && <CopyButton text={copy} className="shrink-0" />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolShell>
  );
}
