"use client";
import { useState, useMemo } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Textarea } from "@/components/ui/textarea";

function detectLanguage(code: string): string {
  const firstLine = code.split("\n")[0].trim();
  if (firstLine.startsWith("#!/usr/bin/env python") || firstLine.startsWith("#!/usr/bin/python") || /^\s*import\s+\w+/.test(code) && /def\s+\w+\(/.test(code)) return "Python";
  if (firstLine.startsWith("#!/bin/bash") || firstLine.startsWith("#!/bin/sh")) return "Shell";
  if (/^\s*<\?php/.test(code)) return "PHP";
  if (/^\s*<!DOCTYPE html/i.test(code) || /^\s*<html/i.test(code)) return "HTML";
  if (/^\s*package\s+\w+;/.test(code) && /public\s+class/.test(code)) return "Java";
  if (/using\s+System;/.test(code)) return "C#";
  if (/^\s*#include\s*</.test(code)) return "C/C++";
  if (/import\s+React/.test(code) || /from\s+['"]react['"]/.test(code)) return "React/TSX";
  if (/^\s*fn\s+main\(\)/.test(code) || /let\s+mut\s+/.test(code)) return "Rust";
  if (/^\s*func\s+\w+\(/.test(code) && /package\s+main/.test(code)) return "Go";
  if (/const|let|var/.test(code) && /=>\s*\{/.test(code)) return "JavaScript/TypeScript";
  if (/^\s*SELECT|^\s*INSERT|^\s*UPDATE|^\s*CREATE/i.test(code)) return "SQL";
  if (/^\s*\{[\s\S]*\}/m.test(code) && /"[\w]+"\s*:/.test(code)) return "JSON";
  if (/^\s*---/.test(code) || /^\s*-\s+\w+:/.test(code)) return "YAML";
  return "Unknown";
}

function isCommentLine(line: string): boolean {
  const t = line.trim();
  if (!t) return false;
  return (
    t.startsWith("//") ||
    t.startsWith("/*") ||
    t.startsWith("*") ||
    t.startsWith("*/") ||
    t.startsWith("#") ||
    t.startsWith("--") ||
    t.startsWith("<!--") ||
    t.startsWith("-->") ||
    t.startsWith("'''") ||
    t.startsWith('"""') ||
    t.startsWith("rem ") ||
    t.toLowerCase().startsWith("rem\t")
  );
}

interface Stats {
  total: number;
  blank: number;
  comment: number;
  code: number;
  nonEmpty: number;
  chars: number;
  words: number;
  readTime: string;
  language: string;
}

function analyze(text: string): Stats {
  if (!text) {
    return { total: 0, blank: 0, comment: 0, code: 0, nonEmpty: 0, chars: 0, words: 0, readTime: "< 1 min", language: "—" };
  }
  const lines = text.split("\n");
  const total = lines.length;
  let blank = 0, comment = 0, code = 0;
  for (const line of lines) {
    if (!line.trim()) { blank++; }
    else if (isCommentLine(line)) { comment++; }
    else { code++; }
  }
  const nonEmpty = total - blank;
  const chars = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const mins = Math.max(1, Math.round(words / 200));
  const readTime = mins === 1 ? "~1 min" : `~${mins} min`;
  const language = detectLanguage(text);
  return { total, blank, comment, code, nonEmpty, chars, words, readTime, language };
}

interface StatCardProps { label: string; value: number | string; color?: string; }
function StatCard({ label, value, color = "bg-primary" }: StatCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4 flex flex-col gap-1">
      <span className="text-2xl font-bold text-foreground">{typeof value === "number" ? value.toLocaleString() : value}</span>
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</span>
      <div className={`h-0.5 w-8 rounded-full mt-1 ${color}`} />
    </div>
  );
}

export default function LineCounterPage() {
  const [input, setInput] = useState("");
  const stats = useMemo(() => analyze(input), [input]);

  const total = stats.total || 1;
  const blankPct = Math.round((stats.blank / total) * 100);
  const commentPct = Math.round((stats.comment / total) * 100);
  const codePct = Math.round((stats.code / total) * 100);

  const summary = input
    ? `Lines: ${stats.total} total | ${stats.code} code | ${stats.comment} comment | ${stats.blank} blank`
    : "";

  return (
    <ToolShell
      title="Code Line Counter"
      description="Paste any code to count total lines, code lines, comments, and blank lines. Detects language automatically."
    >
      <div className="space-y-6">
        {/* Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Paste Code</label>
            {stats.language !== "—" && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                {stats.language}
              </span>
            )}
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your code here..."
            className="font-mono text-[13px] min-h-48 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
          />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <StatCard label="Total Lines" value={stats.total} color="bg-blue-500" />
          <StatCard label="Code Lines" value={stats.code} color="bg-green-500" />
          <StatCard label="Comment Lines" value={stats.comment} color="bg-yellow-500" />
          <StatCard label="Blank Lines" value={stats.blank} color="bg-muted-foreground/40" />
          <StatCard label="Non-empty Lines" value={stats.nonEmpty} color="bg-purple-500" />
          <StatCard label="Characters" value={stats.chars} color="bg-cyan-500" />
          <StatCard label="Words" value={stats.words} color="bg-orange-500" />
          <StatCard label="Read Time" value={stats.readTime} color="bg-pink-500" />
        </div>

        {/* Breakdown bar */}
        {input && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Line Breakdown</h3>
            <div className="space-y-2">
              {[
                { label: "Code", pct: codePct, count: stats.code, color: "bg-green-500" },
                { label: "Comments", pct: commentPct, count: stats.comment, color: "bg-yellow-500" },
                { label: "Blank", pct: blankPct, count: stats.blank, color: "bg-muted-foreground/30" },
              ].map(({ label, pct, count, color }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="w-20 text-xs text-muted-foreground text-right shrink-0">{label}</span>
                  <div className="flex-1 h-4 bg-muted/40 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${color} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-16 text-xs text-muted-foreground shrink-0">
                    {count} ({pct}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Copy summary */}
        {summary && (
          <div className="flex items-center justify-between gap-2 p-3 rounded-lg border bg-muted/20">
            <span className="text-xs text-muted-foreground font-mono">{summary}</span>
            <CopyButton text={summary} />
          </div>
        )}
      </div>
    </ToolShell>
  );
}
