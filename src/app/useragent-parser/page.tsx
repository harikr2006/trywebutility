"use client";
import { useState, useEffect, useMemo } from "react";
import ToolShell from "@/components/shared/ToolShell";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Globe, Monitor, Smartphone, Bot, Cpu, Layers } from "lucide-react";
import { parseUserAgent, type UAResult } from "@/lib/tools/useragent";

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoCard({ icon, label, value }: InfoCardProps) {
  return (
    <div className="rounded-lg border bg-card p-3 flex items-start gap-3">
      <div className="mt-0.5 text-muted-foreground shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium mt-0.5 break-words">{value || "—"}</p>
      </div>
    </div>
  );
}

export default function UserAgentParserPage() {
  const [input, setInput] = useState("");

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setInput(navigator.userAgent);
    }
  }, []);

  const result: UAResult | null = useMemo(() => {
    if (!input.trim()) return null;
    try {
      return parseUserAgent(input);
    } catch {
      return null;
    }
  }, [input]);

  const handleUseMyUA = () => {
    if (typeof navigator !== "undefined") {
      setInput(navigator.userAgent);
    }
  };

  return (
    <ToolShell title="User-Agent Parser" description="Parse and decode a User-Agent string to identify browser, OS, device type, and engine.">
      <div className="space-y-5">
        {/* Textarea + button */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">User-Agent String</label>
            <Button size="sm" variant="outline" className="h-8 text-xs" onClick={handleUseMyUA}>
              Use my User-Agent
            </Button>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste a User-Agent string here..."
            className="font-mono text-[13px] min-h-20 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
          />
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4">
            {/* Info cards grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <InfoCard
                icon={<Globe className="h-4 w-4" />}
                label="Browser"
                value={result.browser}
              />
              <InfoCard
                icon={<Layers className="h-4 w-4" />}
                label="Version"
                value={result.browserVersion}
              />
              <InfoCard
                icon={<Monitor className="h-4 w-4" />}
                label="OS"
                value={result.os}
              />
              <InfoCard
                icon={<Monitor className="h-4 w-4" />}
                label="OS Version"
                value={result.osVersion}
              />
              <InfoCard
                icon={<Smartphone className="h-4 w-4" />}
                label="Device Type"
                value={result.device}
              />
              <InfoCard
                icon={<Cpu className="h-4 w-4" />}
                label="Engine"
                value={result.engine}
              />
            </div>

            {/* Boolean badges */}
            <div className="flex flex-wrap gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                  result.isMobile
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Smartphone className="h-3 w-3" />
                {result.isMobile ? "Mobile" : "Not Mobile"}
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                  result.isBot
                    ? "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Bot className="h-3 w-3" />
                {result.isBot ? "Bot Detected" : "Not a Bot"}
              </span>
            </div>

            {/* Raw UA block */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Raw User-Agent</label>
              <div className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5">
                <code className="font-mono text-xs break-all text-foreground/80">{input}</code>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
