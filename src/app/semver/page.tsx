"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle, Package, GitCompare, Layers, Zap } from "lucide-react";
import { parseSemver, compareSemver } from "@/lib/tools/semver";

const SEMVER_EXAMPLES = [
  { version: "1.0.0", meaning: "First stable release — production ready" },
  { version: "2.0.0", meaning: "Breaking API change — MAJOR bump" },
  { version: "1.3.0", meaning: "New backwards-compatible feature — MINOR bump" },
  { version: "1.2.7", meaning: "Bug fix only — PATCH bump" },
  { version: "1.0.0-alpha.1", meaning: "Pre-release: alpha stage, not stable" },
  { version: "1.0.0-beta.3", meaning: "Pre-release: beta, feature-complete but unpolished" },
  { version: "1.0.0-rc.1", meaning: "Release candidate — last step before stable" },
  { version: "2.1.0+build.20241005", meaning: "With build metadata (ignored in precedence)" },
];

const STEPS = [
  {
    title: "Paste a version string",
    text: "Enter any semver-like string — npm package versions, GitHub release tags, or Python package versions.",
  },
  {
    title: "See the parsed breakdown",
    text: "Instantly see MAJOR, MINOR, PATCH, pre-release identifier, and build metadata split out clearly.",
  },
  {
    title: "Compare two versions",
    text: "Enter two version strings to get a definitive result: which is greater, lesser, or equal.",
  },
];

export default function SemverPage() {
  const [input, setInput] = useState("1.2.3-alpha.1+build.456");
  const [vA, setVA] = useState("1.2.3");
  const [vB, setVB] = useState("1.2.4");

  const info = parseSemver(input);
  const cmpResult = (() => {
    const aInfo = parseSemver(vA);
    const bInfo = parseSemver(vB);
    if (!aInfo.valid) return { error: `Version A: ${aInfo.error}` };
    if (!bInfo.valid) return { error: `Version B: ${bInfo.error}` };
    const r = compareSemver(vA, vB);
    if (r > 0) return { result: `${vA} > ${vB}` };
    if (r < 0) return { result: `${vA} < ${vB}` };
    return { result: `${vA} = ${vB}` };
  })();

  const fields = info.valid ? [
    ["Major", info.major],
    ["Minor", info.minor],
    ["Patch", info.patch],
    ["Pre-release", info.prerelease || "—"],
    ["Build Metadata", info.buildMeta || "—"],
  ] : [];

  return (
    <ToolShell title="Semver Validator & Analyzer" description="Parse, validate, and compare Semantic Versioning strings. Supports SemVer 2.0, pre-release tags, and build metadata.">
      {/* Feature badges */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { icon: Package, label: "SemVer 2.0.0" },
          { icon: GitCompare, label: "Version Compare" },
          { icon: Layers, label: "Pre-release Support" },
          { icon: Zap, label: "Instant Validation" },
        ].map(({ icon: Icon, label }) => (
          <span
            key={label}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/8 text-primary border border-primary/20"
          >
            <Icon className="h-3 w-3" aria-hidden="true" />
            {label}
          </span>
        ))}
      </div>

      {/* Tool widget */}
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
          {cmpResult.error ? (
            <div className="flex gap-2 rounded-lg border border-destructive/40 bg-destructive/8 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{cmpResult.error}</span>
            </div>
          ) : (
            <div className="rounded-lg bg-muted/30 border border-border/60 px-4 py-3 font-mono text-sm">
              {cmpResult.result}
            </div>
          )}
        </div>
      </div>

      {/* How it works */}
      <section className="mt-10 pt-8 border-t border-border/60">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-5">
          How to Use
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {STEPS.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">{step.title}</p>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Version examples reference */}
      <section className="mt-10 pt-8 border-t border-border/60">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-5">
          Common Version Patterns
        </h2>
        <div className="rounded-xl border border-border/60 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 border-b border-border/60">
                <th className="px-4 py-2.5 text-left font-semibold text-foreground w-44">Version</th>
                <th className="px-4 py-2.5 text-left font-semibold text-foreground">What It Means</th>
              </tr>
            </thead>
            <tbody>
              {SEMVER_EXAMPLES.map((ex) => (
                <tr
                  key={ex.version}
                  className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors cursor-pointer"
                  onClick={() => setInput(ex.version)}
                >
                  <td className="px-4 py-2.5 font-mono text-primary font-semibold">{ex.version}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{ex.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Click any row to load it into the validator above.</p>
      </section>

      {/* Explainer */}
      <section className="mt-10 pt-8 border-t border-border/60">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
          What Is Semantic Versioning?
        </h2>
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed max-w-2xl">
          <p>
            <strong className="text-foreground">Semantic Versioning (SemVer)</strong> is a versioning convention defined
            at <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">semver.org</span> that uses three
            numbers: <strong className="text-foreground">MAJOR.MINOR.PATCH</strong>. A MAJOR increment signals a
            breaking change, MINOR signals a new backwards-compatible feature, and PATCH signals a backwards-compatible
            bug fix.
          </p>
          <p>
            <strong className="text-foreground">Pre-release identifiers</strong> like{" "}
            <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">-alpha.1</code>,{" "}
            <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">-beta.2</code>, or{" "}
            <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">-rc.1</code> indicate versions that are
            not yet stable. In precedence order, a pre-release version is always lower than its release:{" "}
            <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">1.0.0-alpha &lt; 1.0.0</code>.
          </p>
          <p>
            <strong className="text-foreground">Build metadata</strong> (appended with{" "}
            <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">+</code>) is ignored when determining
            version precedence — two versions that differ only in build metadata are considered equal.
          </p>
          <p>
            SemVer is used by npm, PyPI, Cargo, RubyGems, and most modern package managers. The{" "}
            <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">^</code> and{" "}
            <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">~</code> range operators in{" "}
            <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">package.json</code> are based on semver
            precedence rules.
          </p>
        </div>
      </section>
    </ToolShell>
  );
}
