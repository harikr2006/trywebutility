"use client";

import { useState, useEffect } from "react";
import ToolShell from "@/components/shared/ToolShell";
import { Button } from "@/components/ui/button";
import { X, Plus, Globe } from "lucide-react";

const DEFAULT_CLOCKS = [
  { city: "UTC", tz: "UTC" },
  { city: "New York", tz: "America/New_York" },
  { city: "London", tz: "Europe/London" },
  { city: "Paris", tz: "Europe/Paris" },
  { city: "Dubai", tz: "Asia/Dubai" },
  { city: "Mumbai", tz: "Asia/Kolkata" },
  { city: "Singapore", tz: "Asia/Singapore" },
  { city: "Tokyo", tz: "Asia/Tokyo" },
  { city: "Sydney", tz: "Australia/Sydney" },
  { city: "Los Angeles", tz: "America/Los_Angeles" },
];

const COMMON_TIMEZONES = [
  "Africa/Cairo",
  "Africa/Johannesburg",
  "Africa/Lagos",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Mexico_City",
  "America/New_York",
  "America/Sao_Paulo",
  "America/Toronto",
  "America/Vancouver",
  "Asia/Bangkok",
  "Asia/Dubai",
  "Asia/Hong_Kong",
  "Asia/Jakarta",
  "Asia/Karachi",
  "Asia/Kolkata",
  "Asia/Seoul",
  "Asia/Shanghai",
  "Asia/Singapore",
  "Asia/Taipei",
  "Asia/Tehran",
  "Asia/Tokyo",
  "Australia/Melbourne",
  "Australia/Perth",
  "Australia/Sydney",
  "Europe/Amsterdam",
  "Europe/Berlin",
  "Europe/Istanbul",
  "Europe/London",
  "Europe/Madrid",
  "Europe/Moscow",
  "Europe/Paris",
  "Europe/Rome",
  "Pacific/Auckland",
  "Pacific/Honolulu",
  "UTC",
];

function formatTime(tz: string, now: Date) {
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(now);
  const date = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(now);
  const offset =
    new Intl.DateTimeFormat("en", { timeZone: tz, timeZoneName: "short" })
      .formatToParts(now)
      .find((p) => p.type === "timeZoneName")?.value ?? tz;
  return { time, date, offset };
}

interface ClockEntry {
  city: string;
  tz: string;
  removable?: boolean;
}

export default function WorldClock() {
  const [now, setNow] = useState<Date>(new Date());
  const [clocks, setClocks] = useState<ClockEntry[]>(DEFAULT_CLOCKS);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function handleAdd() {
    const tz = inputValue.trim();
    if (!tz) return;
    try {
      Intl.DateTimeFormat(undefined, { timeZone: tz });
    } catch {
      return;
    }
    if (clocks.some((c) => c.tz === tz)) {
      setInputValue("");
      return;
    }
    const city = tz.split("/").pop()?.replace(/_/g, " ") ?? tz;
    setClocks((prev) => [...prev, { city, tz, removable: true }]);
    setInputValue("");
  }

  function handleRemove(tz: string) {
    setClocks((prev) => prev.filter((c) => c.tz !== tz));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleAdd();
  }

  return (
    <ToolShell
      title="World Clock"
      description="View current time across multiple timezones simultaneously. Add any IANA timezone to track."
    >
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            list="timezone-list"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add timezone (e.g. Asia/Tokyo)"
            className="w-full pl-9 pr-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <datalist id="timezone-list">
            {COMMON_TIMEZONES.map((tz) => (
              <option key={tz} value={tz} />
            ))}
          </datalist>
        </div>
        <Button onClick={handleAdd} size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {clocks.map((clock) => {
          const { time, date, offset } = formatTime(clock.tz, now);
          return (
            <div
              key={clock.tz}
              className="rounded-lg border border-border/60 bg-muted/20 p-4 relative"
            >
              {clock.removable && (
                <button
                  onClick={() => handleRemove(clock.tz)}
                  className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={`Remove ${clock.city}`}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <p className="font-bold text-base leading-tight">{clock.city}</p>
              <p className="text-xs text-muted-foreground mb-2">{clock.tz}</p>
              <p className="text-3xl font-mono font-bold tracking-tight mb-1">
                {time}
              </p>
              <p className="text-sm text-muted-foreground">{date}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{offset}</p>
            </div>
          );
        })}
      </div>
    </ToolShell>
  );
}
