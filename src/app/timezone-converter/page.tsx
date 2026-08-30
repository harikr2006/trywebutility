"use client";
import { useState, useEffect } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

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
    // Parse the datetime-local string as a date in the fromZone
    // We treat the input as a wall-clock time in fromZone
    const [datePart, timePart] = datetimeStr.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute] = timePart.split(":").map(Number);

    // Build an ISO string with timezone offset for fromZone
    const tempDate = new Date(`${datePart}T${timePart}:00`);

    // Use Intl to find the UTC equivalent
    // Strategy: format in fromZone and compute offset
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

export default function TimezoneConverterPage() {
  const [datetime, setDatetime] = useState("");
  const [fromZone, setFromZone] = useState("UTC");
  const [toZone, setToZone] = useState("America/New_York");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Set default timezone based on browser
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

  const refDate = datetime ? new Date(`${datetime}:00`) : new Date();
  const fromOffset = getUtcOffset(fromZone, refDate);
  const toOffset = getUtcOffset(toZone, refDate);

  const selectClass =
    "h-8 rounded-md border border-border/60 bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 min-w-40";

  return (
    <ToolShell
      title="Timezone Converter"
      description="Convert a date and time between any two IANA timezones."
    >
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
        <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
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
    </ToolShell>
  );
}
