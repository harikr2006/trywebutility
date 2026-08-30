"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import { CheckCircle, XCircle } from "lucide-react";
import { checkPasswordStrength } from "@/lib/tools/password-strength";

const SCORE_COLORS = [
  "bg-red-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-emerald-600",
];
const SCORE_TEXT = [
  "text-red-600 dark:text-red-400",
  "text-orange-600 dark:text-orange-400",
  "text-amber-600 dark:text-amber-400",
  "text-emerald-600 dark:text-emerald-400",
  "text-emerald-600 dark:text-emerald-400",
];

export default function PasswordStrengthPage() {
  const [password, setPassword] = useState("MyP@ssw0rd!");
  const [show, setShow] = useState(false);
  const result = checkPasswordStrength(password);

  const checks = [
    { label: "Uppercase letters (A-Z)", pass: result.hasUpper },
    { label: "Lowercase letters (a-z)", pass: result.hasLower },
    { label: "Numbers (0-9)", pass: result.hasDigit },
    { label: "Symbols (!@#$…)", pass: result.hasSymbol },
    { label: "At least 8 characters", pass: result.length >= 8 },
    { label: "12+ characters (recommended)", pass: result.length >= 12 },
  ];

  return (
    <ToolShell title="Password Strength Checker" description="Analyze password strength, entropy bits, and estimated crack time.">
      <div className="space-y-5 max-w-lg">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Password</label>
          <div className="flex gap-2">
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a password to analyze..."
              className="flex-1 h-10 rounded-md border border-border/60 bg-background px-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button onClick={() => setShow(!show)}
              className="h-10 px-3 rounded-md border border-border/60 text-xs font-medium text-muted-foreground hover:bg-muted/40 transition-colors">
              {show ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Strength bar */}
        {password && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Strength</label>
                <span className={`text-sm font-bold ${SCORE_TEXT[result.score]}`}>{result.label}</span>
              </div>
              <div className="flex gap-1 h-2">
                {[0,1,2,3,4].map(i => (
                  <div key={i} className={`flex-1 rounded-full transition-colors ${i <= result.score ? SCORE_COLORS[result.score] : "bg-muted"}`} />
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Entropy", value: `${result.entropy} bits` },
                { label: "Length", value: `${result.length} chars` },
                { label: "Crack Time", value: result.crackTime },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-lg border border-border/60 bg-muted/30 px-4 py-3 space-y-0.5">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
                  <p className="font-mono text-sm font-bold text-foreground">{value}</p>
                </div>
              ))}
            </div>

            {/* Checklist */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Requirements</label>
              <div className="space-y-1.5">
                {checks.map(({ label, pass }) => (
                  <div key={label} className="flex items-center gap-2">
                    {pass
                      ? <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                      : <XCircle className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                    }
                    <span className={`text-sm ${pass ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </ToolShell>
  );
}
