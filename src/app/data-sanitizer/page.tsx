"use client";
import { useState, useMemo } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Textarea } from "@/components/ui/textarea";

interface Rule {
  id: string;
  label: string;
  pattern: RegExp;
  replacement: string;
  defaultEnabled: boolean;
}

const BUILT_IN_RULES: Rule[] = [
  {
    id: "email",
    label: "Email addresses",
    pattern: /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g,
    replacement: "[EMAIL]",
    defaultEnabled: true,
  },
  {
    id: "phone",
    label: "Phone numbers",
    pattern: /(\+?1[-.\s]?)?(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/g,
    replacement: "[PHONE]",
    defaultEnabled: true,
  },
  {
    id: "creditcard",
    label: "Credit card numbers",
    pattern: /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11}|\d{4}[- ]\d{4}[- ]\d{4}[- ]\d{4})\b/g,
    replacement: "[CREDIT_CARD]",
    defaultEnabled: true,
  },
  {
    id: "ssn",
    label: "SSN / National ID",
    pattern: /\b\d{3}[- ]\d{2}[- ]\d{4}\b/g,
    replacement: "[SSN]",
    defaultEnabled: true,
  },
  {
    id: "ip",
    label: "IP addresses",
    pattern: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
    replacement: "[IP_ADDRESS]",
    defaultEnabled: false,
  },
  {
    id: "url",
    label: "URLs",
    pattern: /https?:\/\/[^\s<>"{}|\\^`[\]]+/g,
    replacement: "[URL]",
    defaultEnabled: false,
  },
  {
    id: "jwt",
    label: "JWT tokens",
    pattern: /eyJ[A-Za-z0-9_\-]+\.eyJ[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+/g,
    replacement: "[JWT]",
    defaultEnabled: true,
  },
  {
    id: "apikey",
    label: "API keys / secrets",
    pattern: /\b(?:sk-[a-zA-Z0-9]{20,}|Bearer\s+[a-zA-Z0-9\._\-]{10,}|(?:password|passwd|pwd|secret|token|api[_\-]?key)\s*[=:]\s*["']?[^\s"',;)]{6,}["']?)/gi,
    replacement: "[API_KEY]",
    defaultEnabled: true,
  },
];

interface DiffPart {
  text: string;
  redacted: boolean;
  tag: string;
}

function buildDiff(original: string, sanitized: string, _rules: Rule[], enabledRules: Set<string>): DiffPart[] {
  // Simple approach: re-run rules and track spans
  const spans: { start: number; end: number; tag: string }[] = [];
  for (const rule of BUILT_IN_RULES) {
    if (!enabledRules.has(rule.id)) continue;
    const re = new RegExp(rule.pattern.source, rule.pattern.flags.includes("g") ? rule.pattern.flags : rule.pattern.flags + "g");
    let m: RegExpExecArray | null;
    while ((m = re.exec(original)) !== null) {
      spans.push({ start: m.index, end: m.index + m[0].length, tag: rule.replacement });
    }
  }
  spans.sort((a, b) => a.start - b.start);

  const parts: DiffPart[] = [];
  let cursor = 0;
  for (const span of spans) {
    if (span.start < cursor) continue; // overlapping — skip
    if (span.start > cursor) {
      parts.push({ text: original.slice(cursor, span.start), redacted: false, tag: "" });
    }
    parts.push({ text: original.slice(span.start, span.end), redacted: true, tag: span.tag });
    cursor = span.end;
  }
  if (cursor < original.length) {
    parts.push({ text: original.slice(cursor), redacted: false, tag: "" });
  }
  void sanitized;
  return parts;
}

function sanitize(text: string, enabledRules: Set<string>, customRules: { pattern: string; replacement: string }[], globalReplacement: string): { output: string; count: number } {
  let output = text;
  let count = 0;

  for (const rule of BUILT_IN_RULES) {
    if (!enabledRules.has(rule.id)) continue;
    const re = new RegExp(rule.pattern.source, rule.pattern.flags.includes("g") ? rule.pattern.flags : rule.pattern.flags + "g");
    const rep = globalReplacement === "" ? rule.replacement : globalReplacement;
    output = output.replace(re, () => { count++; return rep; });
  }

  for (const cr of customRules) {
    if (!cr.pattern) continue;
    try {
      const re = new RegExp(cr.pattern, "g");
      const rep = cr.replacement || "[REDACTED]";
      output = output.replace(re, () => { count++; return rep; });
    } catch {
      // invalid regex — skip
    }
  }

  return { output, count };
}

export default function DataSanitizerPage() {
  const [input, setInput] = useState("");
  const [enabled, setEnabled] = useState<Set<string>>(
    new Set(BUILT_IN_RULES.filter((r) => r.defaultEnabled).map((r) => r.id))
  );
  const [globalReplacement, setGlobalReplacement] = useState("");
  const [customRules, setCustomRules] = useState<{ pattern: string; replacement: string }[]>([
    { pattern: "", replacement: "[REDACTED]" },
  ]);
  const [showDiff, setShowDiff] = useState(true);

  const { output, count } = useMemo(
    () => sanitize(input, enabled, customRules, globalReplacement),
    [input, enabled, customRules, globalReplacement]
  );

  const diffParts = useMemo(
    () => (showDiff && input ? buildDiff(input, output, BUILT_IN_RULES, enabled) : []),
    [showDiff, input, output, enabled]
  );

  function toggleRule(id: string) {
    setEnabled((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function updateCustomRule(idx: number, field: "pattern" | "replacement", value: string) {
    setCustomRules((prev) => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r));
  }

  return (
    <ToolShell
      title="Data Sanitizer / PII Remover"
      description="Redact emails, phone numbers, credit cards, SSNs, API keys, and other sensitive data from text automatically."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: input + rules */}
          <div className="space-y-5">
            {/* Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Input Text</label>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste text containing sensitive data..."
                className="font-mono text-[13px] min-h-40 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
              />
            </div>

            {/* Rules */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Redact Rules</label>
              <div className="rounded-lg border bg-card divide-y divide-border/50">
                {BUILT_IN_RULES.map((rule) => (
                  <label key={rule.id} className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-muted/20 transition-colors">
                    <input
                      type="checkbox"
                      checked={enabled.has(rule.id)}
                      onChange={() => toggleRule(rule.id)}
                      className="rounded border-border"
                    />
                    <span className="text-sm text-foreground flex-1">{rule.label}</span>
                    <span className="text-xs font-mono text-muted-foreground">{rule.replacement}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Global replacement */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Override replacement string <span className="font-normal">(leave blank to use per-rule defaults)</span>
              </label>
              <input
                type="text"
                value={globalReplacement}
                onChange={(e) => setGlobalReplacement(e.target.value)}
                placeholder="e.g. [REDACTED] or ████"
                className="w-full rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* Custom regex */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Custom Regex Rules</label>
              {customRules.map((cr, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={cr.pattern}
                    onChange={(e) => updateCustomRule(i, "pattern", e.target.value)}
                    placeholder="Regex pattern..."
                    className="flex-1 rounded-md border border-border/60 bg-muted/30 px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <input
                    type="text"
                    value={cr.replacement}
                    onChange={(e) => updateCustomRule(i, "replacement", e.target.value)}
                    placeholder="[REDACTED]"
                    className="w-28 rounded-md border border-border/60 bg-muted/30 px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <button
                    onClick={() => setCustomRules((prev) => prev.filter((_, j) => j !== i))}
                    className="px-2 py-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                onClick={() => setCustomRules((prev) => [...prev, { pattern: "", replacement: "[REDACTED]" }])}
                className="text-xs text-primary hover:underline"
              >
                + Add custom rule
              </button>
            </div>
          </div>

          {/* Right: output */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sanitized Output</label>
              <div className="flex items-center gap-3">
                {count > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium">
                    {count} replacement{count !== 1 ? "s" : ""}
                  </span>
                )}
                <CopyButton text={output} />
              </div>
            </div>
            <Textarea
              value={output}
              readOnly
              placeholder="Sanitized text appears here..."
              className="font-mono text-[13px] min-h-40 resize-y bg-muted/30 border-border/60 text-foreground"
            />

            {/* Diff view */}
            {input && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Diff View (original)</label>
                  <button
                    onClick={() => setShowDiff((v) => !v)}
                    className="text-xs text-primary hover:underline"
                  >
                    {showDiff ? "Hide" : "Show"}
                  </button>
                </div>
                {showDiff && (
                  <div className="rounded-lg border bg-muted/20 p-3 font-mono text-[13px] leading-relaxed break-words whitespace-pre-wrap max-h-64 overflow-y-auto">
                    {diffParts.map((part, i) =>
                      part.redacted ? (
                        <span
                          key={i}
                          title={`Matched: ${part.text}\nReplaced with: ${part.tag}`}
                          className="bg-destructive/20 text-destructive rounded px-0.5 cursor-help"
                        >
                          {part.tag}
                        </span>
                      ) : (
                        <span key={i}>{part.text}</span>
                      )
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
