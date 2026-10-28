"use client";
import { useState, useEffect } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { generateBulk } from "@/lib/tools/uuid";

type Version = 4 | 7;
const COUNT_PRESETS = [1, 5, 10, 20];

function formatUUID(uuid: string, uppercase: boolean, braces: boolean): string {
  let result = uppercase ? uuid.toUpperCase() : uuid;
  if (braces) result = `{${result}}`;
  return result;
}

export default function UUIDGeneratorPage() {
  const [version, setVersion] = useState<Version>(4);
  const [count, setCount] = useState(5);
  const [countInput, setCountInput] = useState("5");
  const [uuids, setUuids] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [uppercase, setUppercase] = useState(false);
  const [braces, setBraces] = useState(false);

  function generate(opts?: { v?: Version; c?: number }) {
    const v = opts?.v ?? version;
    const c = opts?.c ?? count;
    const result = generateBulk(c, v as 4 | 7);
    setUuids(result);
  }

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version, count]);

  function handleCountInput(val: string) {
    setCountInput(val);
    const n = parseInt(val);
    if (!isNaN(n) && n >= 1 && n <= 1000) {
      setCount(n);
    }
  }

  function handleCountPreset(c: number) {
    setCount(c);
    setCountInput(String(c));
  }

  function handleCopyAll() {
    const all = uuids.map((u) => formatUUID(u, uppercase, braces)).join("\n");
    navigator.clipboard.writeText(all).then(() => {
      setCopied("all");
      setTimeout(() => setCopied(null), 2000);
    });
  }

  const formatted = uuids.map((u) => formatUUID(u, uppercase, braces));

  return (
    <ToolShell
      title="UUID Generator"
      description="Generate RFC-compliant UUID v4 (random) or UUID v7 (time-ordered) identifiers in bulk."
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Version */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Version
            </label>
            <div className="flex gap-1">
              {([4, 7] as Version[]).map((v) => (
                <Button
                  key={v}
                  size="sm"
                  className="h-8"
                  variant={version === v ? "default" : "outline"}
                  onClick={() => setVersion(v)}
                >
                  v{v}
                </Button>
              ))}
            </div>
          </div>

          {/* Count presets + custom input */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Count
            </label>
            <div className="flex gap-1">
              {COUNT_PRESETS.map((c) => (
                <Button
                  key={c}
                  size="sm"
                  className="h-8"
                  variant={count === c && COUNT_PRESETS.includes(count) ? "default" : "outline"}
                  onClick={() => handleCountPreset(c)}
                >
                  {c}
                </Button>
              ))}
            </div>
            <input
              type="number"
              min={1}
              max={1000}
              value={countInput}
              onChange={(e) => handleCountInput(e.target.value)}
              className="w-16 h-8 rounded-md border border-border/60 bg-background px-2 text-sm font-mono focus:ring-2 focus:ring-primary/30 focus:outline-none"
              title="Custom count (1–1000)"
            />
          </div>

          <Button size="sm" className="h-8" onClick={() => generate()}>
            Generate
          </Button>
        </div>

        {/* Format options */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="accent-primary h-3.5 w-3.5"
            />
            Uppercase
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={braces}
              onChange={(e) => setBraces(e.target.checked)}
              className="accent-primary h-3.5 w-3.5"
            />
            With braces <span className="font-mono text-xs text-muted-foreground ml-1">{"{...}"}</span>
          </label>
        </div>

        {formatted.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Generated UUIDs
              </label>
              <Button
                size="sm"
                className="h-8"
                variant="outline"
                onClick={handleCopyAll}
              >
                {copied === "all" ? "Copied!" : "Copy All"}
              </Button>
            </div>
            <div className="space-y-1">
              {formatted.map((uuid, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 rounded-md border border-border/60 bg-muted/20 px-3 py-2"
                >
                  <code className="font-mono text-sm text-foreground">
                    {uuid}
                  </code>
                  <CopyButton text={uuid} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
