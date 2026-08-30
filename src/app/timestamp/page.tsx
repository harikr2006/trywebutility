"use client";
import { useState, useEffect } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { nowToUnix, unixToDate, dateToUnix } from "@/lib/tools/timestamp";

export default function TimestampPage() {
  const [now, setNow] = useState<number>(nowToUnix);

  const [unixInput, setUnixInput] = useState("");
  const [unixResult, setUnixResult] = useState<{ utc: string; local: string; iso: string; relative: string } | null>(null);
  const [unixError, setUnixError] = useState("");

  const [dateInput, setDateInput] = useState("");
  const [dateResult, setDateResult] = useState<{ unix: number; ms: number } | null>(null);
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    const id = setInterval(() => setNow(nowToUnix()), 1000);
    return () => clearInterval(id);
  }, []);

  function convertUnixToDate() {
    setUnixError("");
    setUnixResult(null);
    const r = unixToDate(Number(unixInput));
    setUnixResult(r);
  }

  function convertDateToUnix() {
    setDateError("");
    setDateResult(null);
    const r = dateToUnix(dateInput);
    if (r.error) { setDateError(r.error); return; }
    setDateResult({ unix: r.unix, ms: r.ms });
  }

  return (
    <ToolShell
      title="Timestamp Converter"
      description="Convert Unix timestamps to human-readable dates and vice versa."
    >
      <div className="flex flex-col gap-6 max-w-2xl">

        {/* Section 1: Current Time */}
        <div className="rounded-xl border p-4 flex flex-col gap-3">
          <h2 className="text-sm font-semibold">Current Time</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Unix (seconds)</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm">{now}</span>
                <CopyButton text={String(now)} />
              </div>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">UTC</span>
              <span className="font-mono text-sm">{new Date(now * 1000).toUTCString()}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Local</span>
              <span className="font-mono text-sm">{new Date(now * 1000).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Unix → Date */}
        <div className="rounded-xl border p-4 flex flex-col gap-3">
          <h2 className="text-sm font-semibold">Unix → Date</h2>
          <div className="flex gap-2">
            <input
              type="number"
              value={unixInput}
              onChange={(e) => setUnixInput(e.target.value)}
              placeholder="e.g. 1700000000"
              className="flex-1 h-9 rounded-md border border-border/60 bg-background px-3 font-mono text-sm focus:ring-2 focus:ring-primary/30 focus:outline-none"
            />
            <Button size="sm" className="h-9" onClick={convertUnixToDate}>Convert</Button>
          </div>
          {unixError && (
            <div className="flex gap-2 rounded-lg border border-destructive/40 bg-destructive/8 p-3 text-sm text-destructive font-mono">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /><span>{unixError}</span>
            </div>
          )}
          {unixResult && (
            <table className="w-full text-sm">
              <tbody>
                {([
                  ["UTC", unixResult.utc],
                  ["Local", unixResult.local],
                  ["ISO 8601", unixResult.iso],
                  ["Relative", unixResult.relative],
                ] as [string, string][]).map(([label, value]) => (
                  <tr key={label} className="border-b border-border/40 last:border-0">
                    <td className="py-1.5 pr-4 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide w-24">{label}</td>
                    <td className="py-1.5 font-mono text-xs">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Section 3: Date → Unix */}
        <div className="rounded-xl border p-4 flex flex-col gap-3">
          <h2 className="text-sm font-semibold">Date → Unix</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              placeholder="2024-01-15 14:30:00"
              className="flex-1 h-9 rounded-md border border-border/60 bg-background px-3 font-mono text-sm focus:ring-2 focus:ring-primary/30 focus:outline-none"
            />
            <Button size="sm" className="h-9" onClick={convertDateToUnix}>Convert</Button>
          </div>
          {dateError && (
            <div className="flex gap-2 rounded-lg border border-destructive/40 bg-destructive/8 p-3 text-sm text-destructive font-mono">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /><span>{dateError}</span>
            </div>
          )}
          {dateResult && (
            <div className="flex flex-col gap-2">
              {([
                ["Seconds (Unix)", String(dateResult.unix)],
                ["Milliseconds", String(dateResult.ms)],
              ] as [string, string][]).map(([label, value]) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide w-32 shrink-0">{label}</span>
                  <span className="font-mono text-sm">{value}</span>
                  <CopyButton text={value} />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </ToolShell>
  );
}
