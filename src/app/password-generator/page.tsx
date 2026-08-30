"use client";
import { useState, useEffect } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import {
  generatePassword,
  calcEntropy,
  strengthLabel,
  type PasswordOptions,
} from "@/lib/tools/password";

const STRENGTH_COLORS: Record<string, string> = {
  Weak: "bg-red-500/15 text-red-600 border-red-500/30",
  Fair: "bg-amber-500/15 text-amber-600 border-amber-500/30",
  Strong: "bg-blue-500/15 text-blue-600 border-blue-500/30",
  "Very Strong": "bg-green-500/15 text-green-600 border-green-500/30",
};

const DEFAULT_OPTIONS: PasswordOptions = {
  length: 16,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: false,
};

export default function PasswordGeneratorPage() {
  const [options, setOptions] = useState<PasswordOptions>(DEFAULT_OPTIONS);
  const [password, setPassword] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  function generate(opts: PasswordOptions = options) {
    const pwd = generatePassword(opts);
    setPassword(pwd);
    setHistory((prev) => {
      const next = [pwd, ...prev.filter((p) => p !== pwd)].slice(0, 5);
      return next;
    });
  }

  useEffect(() => {
    generate(options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  function updateOption<K extends keyof PasswordOptions>(
    key: K,
    value: PasswordOptions[K]
  ) {
    setOptions((prev) => ({ ...prev, [key]: value }));
  }

  const entropy = calcEntropy(password);
  const label = strengthLabel(entropy);
  const strengthClass =
    STRENGTH_COLORS[label] ?? "bg-muted text-muted-foreground border-border";

  return (
    <ToolShell
      title="Password Generator"
      description="Generate strong, random passwords with customizable length and character sets."
    >
      <div className="space-y-5">
        {/* Password display */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Password
          </label>
          <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/20 px-4 py-3">
            <span className="flex-1 break-all font-mono text-base tracking-wider text-foreground">
              {password}
            </span>
            <CopyButton text={password} />
            <Button
              size="sm"
              className="h-8 w-8 p-0"
              variant="ghost"
              onClick={() => generate(options)}
              title="Regenerate"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Strength badge */}
        <div className="flex items-center gap-2">
          <span
            className={`rounded border px-2 py-0.5 text-xs font-semibold ${strengthClass}`}
          >
            {label}
          </span>
          <span className="text-xs text-muted-foreground">
            {entropy.toFixed(1)} bits of entropy
          </span>
        </div>

        {/* Length slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Length
            </label>
            <span className="text-sm font-mono text-foreground">
              {options.length}
            </span>
          </div>
          <input
            type="range"
            min={8}
            max={64}
            value={options.length}
            onChange={(e) => updateOption("length", Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        {/* Character set toggles */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Character Sets
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(
              [
                { key: "uppercase", label: "Uppercase (A-Z)" },
                { key: "lowercase", label: "Lowercase (a-z)" },
                { key: "numbers", label: "Numbers (0-9)" },
                { key: "symbols", label: "Symbols (!@#...)" },
              ] as { key: keyof PasswordOptions; label: string }[]
            ).map(({ key, label }) => (
              <label
                key={key}
                className="flex cursor-pointer items-center gap-2 rounded-md border border-border/60 bg-muted/20 px-3 py-2 text-sm select-none hover:bg-muted/40 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={options[key] as boolean}
                  onChange={(e) => updateOption(key, e.target.checked)}
                  className="accent-primary h-3.5 w-3.5"
                />
                <span className="text-xs">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* History */}
        {history.length > 1 && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Recent History
            </label>
            <div className="space-y-1">
              {history.slice(1).map((pwd, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 rounded-md border border-border/40 bg-muted/10 px-3 py-1.5"
                >
                  <span className="font-mono text-xs text-muted-foreground break-all">
                    {pwd}
                  </span>
                  <CopyButton text={pwd} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}

