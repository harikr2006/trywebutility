"use client";
import { useState, useEffect, useRef } from "react";
import ToolShell from "@/components/shared/ToolShell";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

function fmt(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function CountdownTimerPage() {
  const [tab, setTab] = useState<"timer" | "date">("timer");

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [target, setTarget] = useState("");
  const [diff, setDiff] = useState<number | null>(null);
  const dateIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running && remaining !== null && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r === null || r <= 1) {
            setRunning(false);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, remaining]);

  useEffect(() => {
    if (tab === "date" && target) {
      const compute = () => {
        const d = Math.floor((new Date(target).getTime() - Date.now()) / 1000);
        setDiff(d);
      };
      compute();
      dateIntervalRef.current = setInterval(compute, 1000);
    } else {
      if (dateIntervalRef.current) clearInterval(dateIntervalRef.current);
      setDiff(null);
    }
    return () => {
      if (dateIntervalRef.current) clearInterval(dateIntervalRef.current);
    };
  }, [tab, target]);

  function handleStart() {
    if (remaining === null) {
      const total = hours * 3600 + minutes * 60 + seconds;
      if (total <= 0) return;
      setRemaining(total);
    }
    setRunning(true);
  }

  function handlePause() {
    setRunning(false);
  }

  function handleReset() {
    setRunning(false);
    setRemaining(null);
  }

  const displayValue = remaining !== null ? remaining : hours * 3600 + minutes * 60 + seconds;
  const isZero = remaining === 0;

  const diffDays = diff !== null && diff >= 0 ? Math.floor(diff / 86400) : 0;
  const diffHours = diff !== null && diff >= 0 ? Math.floor((diff % 86400) / 3600) : 0;
  const diffMinutes = diff !== null && diff >= 0 ? Math.floor((diff % 3600) / 60) : 0;
  const diffSeconds = diff !== null && diff >= 0 ? diff % 60 : 0;

  return (
    <ToolShell
      title="Countdown Timer"
      description="Count down from a custom duration or count down to a specific date and time."
    >
      <div className="space-y-6">
        <div className="flex rounded-lg border border-border/60 overflow-hidden w-fit">
          <button
            onClick={() => setTab("timer")}
            className={`px-5 py-2 text-sm font-medium transition-colors ${
              tab === "timer"
                ? "bg-primary text-primary-foreground"
                : "bg-muted/30 text-muted-foreground hover:bg-muted/60"
            }`}
          >
            Timer
          </button>
          <button
            onClick={() => setTab("date")}
            className={`px-5 py-2 text-sm font-medium transition-colors ${
              tab === "date"
                ? "bg-primary text-primary-foreground"
                : "bg-muted/30 text-muted-foreground hover:bg-muted/60"
            }`}
          >
            Countdown to Date
          </button>
        </div>

        {tab === "timer" && (
          <div className="space-y-6">
            <div className="flex gap-3 items-end">
              {[
                { label: "Hours", value: hours, max: 99, set: setHours },
                { label: "Minutes", value: minutes, max: 59, set: setMinutes },
                { label: "Seconds", value: seconds, max: 59, set: setSeconds },
              ].map(({ label, value, max, set }) => (
                <div key={label} className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {label}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={max}
                    value={value}
                    disabled={running || remaining !== null}
                    onChange={(e) => {
                      const v = Math.max(0, Math.min(max, parseInt(e.target.value) || 0));
                      set(v);
                    }}
                    className="w-20 h-10 rounded-lg border border-border/60 bg-muted/30 px-3 text-sm font-mono text-center focus:ring-2 focus:ring-primary/30 focus:outline-none disabled:opacity-50"
                  />
                </div>
              ))}
            </div>

            <div
              className={`text-6xl font-mono font-bold tabular-nums tracking-tight transition-colors ${
                isZero ? "text-red-500" : ""
              }`}
            >
              {fmt(displayValue)}
            </div>

            {isZero && (
              <div className="text-red-500 font-semibold text-lg animate-pulse">
                Time&apos;s up!
              </div>
            )}

            <div className="flex gap-2">
              {!running ? (
                <Button size="sm" onClick={handleStart} disabled={isZero && remaining === 0 && remaining !== null}>
                  <Play className="h-4 w-4 mr-1" />
                  {remaining !== null && remaining > 0 ? "Resume" : "Start"}
                </Button>
              ) : (
                <Button size="sm" variant="outline" onClick={handlePause}>
                  <Pause className="h-4 w-4 mr-1" />
                  Pause
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </div>
          </div>
        )}

        {tab === "date" && (
          <div className="space-y-6">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Target Date &amp; Time
              </label>
              <input
                type="datetime-local"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-fit h-10 rounded-lg border border-border/60 bg-muted/30 px-3 text-sm font-mono focus:ring-2 focus:ring-primary/30 focus:outline-none"
              />
            </div>

            {target && diff !== null && diff < 0 && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/8 px-4 py-3 text-sm text-destructive font-medium">
                This date has already passed.
              </div>
            )}

            {target && diff !== null && diff >= 0 && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-6">
                  {[
                    { label: "Days", value: diffDays },
                    { label: "Hours", value: diffHours },
                    { label: "Minutes", value: diffMinutes },
                    { label: "Seconds", value: diffSeconds },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex flex-col items-center gap-1">
                      <span className="text-6xl font-mono font-bold tabular-nums">
                        {String(value).padStart(2, "0")}
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolShell>
  );
}
