"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { parseSemver, compareSemver } from "@/lib/tools/semver";

export default function SemverPage() {
  const [input, setInput] = useState("1.2.3-alpha.1+build.456");
  const [vA, setVA] = useState("1.2.3");
  const [vB, setVB] = useState("1.2.4");

  const info = parseSemver(input);
  const cmp = (() => {
    const r = compareSemver(vA, vB);
    if (r > 0) return `${vA} > ${vB}`;
    if (r < 0) return `${vA} < ${vB}`;
    return `${vA} = ${vB}`;
  })();

  const fields = info.valid ? [
    ["Major", info.major],
    ["Minor", info.minor],
    ["Patch", info.patch],
    ["Pre-release", info.prerelease || "—"],
    ["Build Metadata", info.buildMeta || "—"],
  ] : [];

  return (
    <ToolShell title="Semver Analyzer" description="Parse, validate, and compare Semantic Versioning (semver) strings.">
      <div className="space-y-6 max-w-lg">
        <div className="space-y-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Version String</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="1.2.3-alpha.1+build.456"
            className="w-full h-9 rounded-md border border-border/60 bg-background px-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <div className="flex items-center gap-2">
            {info.valid
              ? <><CheckCircle className="h-4 w-4 text-emerald-500" /><span className="text-sm text-emerald-600">Valid semver</span></>
              : <><XCircle className="h-4 w-4 text-destructive" /><span className="text-sm text-destructive">{info.error}</span></>
            }
          </div>
          {fields.length > 0 && (
            <div className="rounded-lg border border-border/60 overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {fields.map(([label, value]) => (
                    <tr key={String(label)} className="border-b border-border/40 last:border-0">
                      <td className="px-4 py-2.5 text-muted-foreground font-medium w-36">{label}</td>
                      <td className="px-4 py-2.5 font-mono font-bold text-foreground">{String(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Compare Versions</label>
          <div className="flex gap-2 items-center">
            <input type="text" value={vA} onChange={(e) => setVA(e.target.value)}
              className="flex-1 h-9 rounded-md border border-border/60 bg-background px-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <span className="text-muted-foreground font-mono">vs</span>
            <input type="text" value={vB} onChange={(e) => setVB(e.target.value)}
              className="flex-1 h-9 rounded-md border border-border/60 bg-background px-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="rounded-lg bg-muted/30 border border-border/60 px-4 py-3 font-mono text-sm">
            {cmp}
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
