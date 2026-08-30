"use client";
import { useState, useEffect } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { generateBulk } from "@/lib/tools/uuid";

type Version = 4 | 7;
const COUNT_OPTIONS = [1, 5, 10, 20];

export default function UUIDGeneratorPage() {
  const [version, setVersion] = useState<Version>(4);
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  function generate() {
    const result = generateBulk(count, version as 4 | 7);
    setUuids(result);
  }

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version, count]);

  function handleCopyAll() {
    const all = uuids.join("\n");
    navigator.clipboard.writeText(all).then(() => {
      setCopied("all");
      setTimeout(() => setCopied(null), 2000);
    });
  }

  return (
    <ToolShell
      title="UUID Generator"
      description="Generate RFC-compliant UUID v4 (random) or UUID v7 (time-ordered) identifiers in bulk."
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
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

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Count
            </label>
            <div className="flex gap-1">
              {COUNT_OPTIONS.map((c) => (
                <Button
                  key={c}
                  size="sm"
                  className="h-8"
                  variant={count === c ? "default" : "outline"}
                  onClick={() => setCount(c)}
                >
                  {c}
                </Button>
              ))}
            </div>
          </div>

          <Button size="sm" className="h-8" onClick={generate}>
            Generate
          </Button>
        </div>

        {uuids.length > 0 && (
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
              {uuids.map((uuid, i) => (
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

