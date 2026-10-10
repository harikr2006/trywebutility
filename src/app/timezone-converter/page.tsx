"use client";
import { useState, useEffect } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { AlertCircle, Globe, Clock, ShieldCheck, Zap, ArrowRight } from "lucide-react";

function toDatetimeLocal(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function getUtcOffset(zone: string, date: Date): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: zone,
      timeZoneName: "shortOffset",
    });
    const parts = formatter.formatToParts(date);
    const offsetPart = parts.find((p) => p.type === "timeZoneName");
    return offsetPart?.value ?? "";
  } catch {
    return "";
  }
}

function convertTime(datetimeStr: string, fromZone: string, toZone: string): string {
  try {
    const [datePart, timePart] = datetimeStr.split("T");
    const tempDate = new Date(`${datePart}T${timePart}:00`);
    const utcDate = new Date(
      new Date(`${datePart}T${timePart}:00`).toLocaleString("en-US", { timeZone: fromZone })
    );
    const diff = tempDate.getTime() - utcDate.getTime();
    const trueUtc = new Date(tempDate.getTime() + diff);
    return trueUtc.toLocaleString("en-US", {
      timeZone: toZone,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  } catch {
    return "Invalid date or timezone";
  }
}

const TIMEZONES = typeof Intl !== "undefined" && "supportedValuesOf" in Intl
  ? (Intl as unknown as { supportedValuesOf: (k: string) => string[] }).supportedValuesOf("timeZone")
  : ["UTC", "America/New_York", "America/Los_Angeles", "Europe/London", "Asia/Kolkata", "Asia/Tokyo"];

const COMMON_PAIRS = [
  { from: "America/New_York", fromLabel: "New York (ET)", to: "Asia/Kolkata", toLabel: "India (IST)", note: "+10:30h (EST) / +9:30h (EDT)" },
  { from: "America/New_York", fromLabel: "New York (ET)", to: "Europe/London", toLabel: "London (GMT/BST)", note: "+5h (EST) / +4h (EDT)" },
  { from: "America/New_York", fromLabel: "New York (ET)", to: "Asia/Tokyo", toLabel: "Tokyo (JST)", note: "+14h (EST) / +13h (EDT)" },
  { from: "America/Los_Angeles", fromLabel: "Los Angeles (PT)", to: "America/New_York", toLabel: "New York (ET)", note: "+3h always" },
  { from: "Europe/London", fromLabel: "London (GMT)", to: "Asia/Kolkata", toLabel: "India (IST)", note: "+5:30h always" },
  { from: "America/New_York", fromLabel: "New York (ET)", to: "Australia/Sydney", toLabel: "Sydney (AEST)", note: "+15h (EST) / +14h (EDT)" },
];

const STEPS = [
  {
    title: "Enter a date & time",
    text: "Type or pick any date and time — or click 'Use Now' to start from the current moment.",
  },
  {
    title: "Select your timezones",
    text: "Choose the origin zone (From) and the destination zone (To). Search by city name or UTC offset.",
  },
  {
    title: "Get the converted time",
    text: "Click Convert to instantly see the exact date, time, and UTC offset for the destination zone.",
  },
];

export default function TimezoneConverterPage() {
  const [datetime, setDatetime] = useState("");
  const [fromZone, setFromZone] = useState("UTC");
  const [toZone, setToZone] = useState("America/New_York");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const local = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (local) setFromZone(local);
    } catch {
      // keep UTC
    }
  }, []);

  function useNow() {
    setDatetime(toDatetimeLocal(new Date()));
  }

  function convert() {
    setError("");
    setResult("");
    if (!datetime) {
      setError("Please select a date and time.");
      return;
    }
    try {
      const converted = convertTime(datetime, fromZone, toZone);
      setResult(converted);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed");
    }
  }

  function loadPair(from: string, to: string) {
    setFromZone(from);
    setToZone(to);
    setResult("");
    setError("");
  }

  const refDate = datetime ? new Date(`${datetime}:00`) : new Date();
  const fromOffset = getUtcOffset(fromZone, refDate);
  const toOffset = getUtcOffset(toZone, refDate);

  const selectClass =
    "h-8 rounded-md border border-border/60 bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-w-40";

  return (
    <ToolShell
      title="Time Zone Converter"
      description="Convert any date and time between 400+ IANA time zones instantly."
    >
      {/* Feature badges */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { icon: Globe, label: "400+ IANA Zones" },
          { icon: Clock, label: "DST-Aware" },
          { icon: ShieldCheck, label: "Runs in Your Browser" },
          { icon: Zap, label: "Instant" },
        ].map(({ icon: Icon, label }) => (
          <span
            key={label}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/8 text-primary border border-primary/20"
          >
            <Icon className="h-3 w-3" aria-hidden="true" />
            {label}
          </span>
        ))}
      </div>

      {/* Tool widget */}
      <div className="flex flex-wrap items-end gap-3 mb-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Date &amp; Time
          </label>
          <input
            type="datetime-local"
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
            className="h-8 rounded-md border border-border/60 bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            From
          </label>
          <select
            value={fromZone}
            onChange={(e) => setFromZone(e.target.value)}
            className={selectClass}
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
          {fromOffset && (
            <span className="text-xs text-muted-foreground">{fromOffset}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            To
          </label>
          <select
            value={toZone}
            onChange={(e) => setToZone(e.target.value)}
            className={selectClass}
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
          {toOffset && (
            <span className="text-xs text-muted-foreground">{toOffset}</span>
          )}
        </div>

        <div className="flex gap-2 items-end">
          <Button size="sm" className="h-8" onClick={convert}>
            Convert
          </Button>
          <Button size="sm" className="h-8" variant="outline" onClick={useNow}>
            Use Now
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex gap-2 rounded-lg border border-destructive/40 bg-destructive/8 p-3 text-sm text-destructive font-mono mb-4">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-4 mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Converted Time ({toZone})
            </span>
            <CopyButton text={result} />
          </div>
          <p className="text-base font-mono font-medium">{result}</p>
          <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span>
              <strong>From:</strong> {fromZone} {fromOffset && `(${fromOffset})`}
            </span>
            <span>
              <strong>To:</strong> {toZone} {toOffset && `(${toOffset})`}
            </span>
          </div>
        </div>
      )}

      {/* Common Conversions */}
      <section className="mt-10 pt-8 border-t border-border/60">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-5">
          Common Time Zone Conversions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {COMMON_PAIRS.map((pair) => (
            <button
              key={`${pair.from}-${pair.to}`}
              onClick={() => loadPair(pair.from, pair.to)}
              className="flex items-center justify-between p-3.5 rounded-xl bg-card border border-border/60 hover:border-primary/40 hover:bg-primary/4 transition-colors text-left group"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm font-medium text-foreground truncate">{pair.fromLabel}</span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium text-foreground truncate">{pair.toLabel}</span>
              </div>
              <span className="text-xs text-muted-foreground shrink-0 ml-2 font-mono">{pair.note}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">Click any pair to load it into the converter above.</p>
      </section>

      {/* How it works */}
      <section className="mt-10 pt-8 border-t border-border/60">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-5">
          How to Convert Time Zones
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {STEPS.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">{step.title}</p>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Explainer — helps Google understand page context */}
      <section className="mt-10 pt-8 border-t border-border/60">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
          About IANA Time Zones & Daylight Saving
        </h2>
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed max-w-2xl">
          <p>
            An <strong className="text-foreground">IANA timezone</strong> (like{" "}
            <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">America/New_York</code> or{" "}
            <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">Asia/Kolkata</code>) is a named
            region in the official timezone database that encodes all historical DST rules. Using an IANA name
            instead of a raw UTC offset like <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">UTC-5</code>{" "}
            means your conversion stays correct even when clocks change in spring or fall.
          </p>
          <p>
            <strong className="text-foreground">Daylight Saving Time</strong> shifts clocks forward by one hour in
            spring and back in fall, affecting most of the US, Canada, and Europe — but not India, Japan, China, or
            most of Africa. When you select a date during a DST period, this tool adjusts the offset automatically.
          </p>
          <p>
            All conversion logic runs in your browser using the built-in{" "}
            <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">Intl.DateTimeFormat</code> API — no
            data is sent to any server.
          </p>
        </div>
      </section>
    </ToolShell>
  );
}
