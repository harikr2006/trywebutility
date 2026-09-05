"use client";
import { useState, useRef, useEffect } from "react";
import ToolShell from "@/components/shared/ToolShell";
import { Button } from "@/components/ui/button";

type Phase = "work" | "short" | "long";

const LABELS: Record<Phase, string> = {
  work: "Work",
  short: "Short Break",
  long: "Long Break",
};

const COLORS: Record<Phase, string> = {
  work: "#6366f1",   // indigo
  short: "#22c55e",  // green
  long: "#3b82f6",   // blue
};

interface Settings {
  work: number;
  short: number;
  long: number;
  longAfter: number;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export default function PomodoroPage() {
  const [settings, setSettings] = useState<Settings>({
    work: 25,
    short: 5,
    long: 15,
    longAfter: 4,
  });
  const [phase, setPhase] = useState<Phase>("work");
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [pomodoros, setPomodoros] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  // Mutable refs so the interval callback always sees fresh values
  const stateRef = useRef({ phase, secondsLeft, running, pomodoros, settings });
  useEffect(() => {
    stateRef.current = { phase, secondsLeft, running, pomodoros, settings };
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function phaseDurationSecs(p: Phase, s: Settings): number {
    if (p === "work") return s.work * 60;
    if (p === "short") return s.short * 60;
    return s.long * 60;
  }

  function notify(p: Phase) {
    if (typeof Notification === "undefined") return;
    if (Notification.permission === "granted") {
      new Notification(`${LABELS[p]} started`, {
        body: p === "work" ? "Time to focus." : "Take a well-earned break!",
        silent: false,
      });
    }
  }

  function clearTimer() {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function startTimer() {
    clearTimer();
    intervalRef.current = setInterval(() => {
      const { secondsLeft, phase, pomodoros, settings } = stateRef.current;
      const next = secondsLeft - 1;

      if (next <= 0) {
        clearTimer();
        setRunning(false);
        setSecondsLeft(0);

        // Compute next phase
        let newPomodoros = pomodoros;
        if (phase === "work") {
          newPomodoros = pomodoros + 1;
          setPomodoros(newPomodoros);
        }
        const nextPhase: Phase =
          phase !== "work"
            ? "work"
            : newPomodoros % settings.longAfter === 0
            ? "long"
            : "short";

        const secs = phaseDurationSecs(nextPhase, settings);
        setPhase(nextPhase);
        setSecondsLeft(secs);
        notify(nextPhase);
      } else {
        setSecondsLeft(next);
      }
    }, 1000);
  }

  function toggleRunning() {
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission();
    }
    if (stateRef.current.running) {
      setRunning(false);
      clearTimer();
    } else {
      setRunning(true);
      startTimer();
    }
  }

  function reset() {
    clearTimer();
    setRunning(false);
    setSecondsLeft(phaseDurationSecs(stateRef.current.phase, stateRef.current.settings));
  }

  function switchPhase(p: Phase) {
    clearTimer();
    setRunning(false);
    setPhase(p);
    setSecondsLeft(phaseDurationSecs(p, stateRef.current.settings));
  }

  function skip() {
    const { phase, pomodoros, settings } = stateRef.current;
    const nextPhase: Phase =
      phase !== "work"
        ? "work"
        : (pomodoros + 1) % settings.longAfter === 0
        ? "long"
        : "short";
    switchPhase(nextPhase);
  }

  // Update document title while running
  useEffect(() => {
    if (running) {
      document.title = `${pad(Math.floor(secondsLeft / 60))}:${pad(secondsLeft % 60)} — ${LABELS[phase]} | Pomodoro`;
    } else {
      document.title = "Pomodoro Timer | TryWebUtility";
    }
    return () => {
      document.title = "TryWebUtility";
    };
  });

  // Space bar shortcut — re-registers each render to stay fresh
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.code !== "Space") return;
      const tag = (e.target as HTMLElement)?.tagName ?? "";
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "BUTTON" || tag === "SELECT") return;
      e.preventDefault();
      toggleRunning();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  // Cleanup on unmount
  useEffect(() => () => clearTimer(), []);

  // SVG circle progress
  const totalSecs = phaseDurationSecs(phase, settings);
  const progress = totalSecs > 0 ? 1 - secondsLeft / totalSecs : 0;
  const R = 45;
  const circ = 2 * Math.PI * R;
  const dashOffset = circ * (1 - progress);
  const color = COLORS[phase];
  const mm = pad(Math.floor(secondsLeft / 60));
  const ss = pad(secondsLeft % 60);

  return (
    <ToolShell
      title="Pomodoro Timer"
      description="Classic Pomodoro technique timer. 25-minute focus sessions with short and long breaks. Tracks completed sessions and sends browser notifications."
    >
      <div className="space-y-6 max-w-sm mx-auto">
        {/* Phase tabs */}
        <div className="flex gap-2 justify-center">
          {(["work", "short", "long"] as Phase[]).map((p) => (
            <button
              key={p}
              onClick={() => switchPhase(p)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors border ${
                phase === p
                  ? "text-white border-transparent"
                  : "border-border/60 text-muted-foreground hover:bg-muted/60"
              }`}
              style={phase === p ? { backgroundColor: color, borderColor: color } : {}}
            >
              {LABELS[p]}
            </button>
          ))}
        </div>

        {/* Circular timer */}
        <div className="flex justify-center">
          <svg
            viewBox="0 0 100 100"
            className="w-56 h-56"
            role="img"
            aria-label={`${mm}:${ss} remaining in ${LABELS[phase]}`}
          >
            {/* Background track */}
            <circle
              cx="50"
              cy="50"
              r={R}
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-muted/40"
            />
            {/* Progress arc */}
            <circle
              cx="50"
              cy="50"
              r={R}
              fill="none"
              stroke={color}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 50 50)"
              style={{ transition: running ? "stroke-dashoffset 0.9s linear" : "none" }}
            />
            {/* Time display */}
            <text
              x="50"
              y="45"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="18"
              fontWeight="bold"
              fill="currentColor"
              fontFamily="monospace"
            >
              {mm}:{ss}
            </text>
            {/* Phase label */}
            <text
              x="50"
              y="62"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="6"
              fill={color}
              fontWeight="500"
            >
              {LABELS[phase].toUpperCase()}
            </text>
          </svg>
        </div>

        {/* Controls */}
        <div className="flex gap-2 justify-center">
          <Button
            onClick={toggleRunning}
            className="min-w-[80px]"
            style={{ backgroundColor: color, color: "white", borderColor: "transparent" }}
          >
            {running ? "Pause" : "Start"}
          </Button>
          <Button variant="outline" onClick={reset}>
            Reset
          </Button>
          <Button variant="outline" onClick={skip}>
            Skip
          </Button>
        </div>

        {/* Session counter */}
        <div className="text-center space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Completed Sessions
          </p>
          <div className="flex gap-1 justify-center flex-wrap min-h-7 items-center">
            {pomodoros === 0 ? (
              <span className="text-xs text-muted-foreground/60">
                Start your first session to track progress
              </span>
            ) : (
              <>
                {Array.from({ length: Math.min(pomodoros, 24) }).map((_, i) => (
                  <span key={i} role="img" aria-label="pomodoro" className="text-lg leading-none">
                    🍅
                  </span>
                ))}
                {pomodoros > 24 && (
                  <span className="text-xs text-muted-foreground ml-1">
                    +{pomodoros - 24} more
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Settings panel */}
        <div className="border border-border/60 rounded-lg overflow-hidden">
          <button
            onClick={() => setShowSettings((s) => !s)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-muted/40 transition-colors"
          >
            <span>Settings</span>
            <span className="text-muted-foreground text-xs">{showSettings ? "▲" : "▼"}</span>
          </button>

          {showSettings && (
            <div className="px-4 pb-4 pt-3 space-y-3 border-t border-border/60">
              {(
                [
                  { label: "Work duration (min)", key: "work" },
                  { label: "Short break (min)", key: "short" },
                  { label: "Long break (min)", key: "long" },
                  { label: "Long break after N sessions", key: "longAfter" },
                ] as { label: string; key: keyof Settings }[]
              ).map(({ label, key }) => (
                <div key={key} className="flex items-center justify-between gap-4">
                  <label className="text-xs text-muted-foreground flex-1">{label}</label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={settings[key]}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, [key]: Math.max(1, Number(e.target.value)) }))
                    }
                    className="w-20 h-8 rounded-md border border-border/60 bg-background px-3 text-sm text-right focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              ))}
              <Button
                size="sm"
                variant="outline"
                className="w-full mt-1"
                onClick={() => {
                  clearTimer();
                  setRunning(false);
                  setSecondsLeft(phaseDurationSecs(phase, settings));
                }}
              >
                Apply &amp; Reset Timer
              </Button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Press{" "}
          <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border/60 font-mono text-xs">
            Space
          </kbd>{" "}
          to start / pause
        </p>
      </div>
    </ToolShell>
  );
}
