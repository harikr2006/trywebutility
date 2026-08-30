"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { calcAge, diffDates, addDuration } from "@/lib/tools/date-calculator";
import { AlertCircle } from "lucide-react";

const today = new Date().toISOString().split("T")[0];

export default function DateCalculatorPage() {
  const [birthdate, setBirthdate] = useState("1995-06-15");
  const [dateA, setDateA] = useState("2024-01-01");
  const [dateB, setDateB] = useState(today);
  const [addDate, setAddDate] = useState(today);
  const [addAmount, setAddAmount] = useState("30");
  const [addUnit, setAddUnit] = useState<"days" | "weeks" | "months" | "years">("days");

  const age = calcAge(birthdate);
  const diff = diffDates(dateA, dateB);
  const added = addDuration(addDate, Number(addAmount), addUnit);

  const inputCls = "h-9 rounded-md border border-border/60 bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <ToolShell title="Date Calculator" description="Calculate age, days between dates, and add or subtract durations.">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {/* Age Calculator */}
        <div className="rounded-xl border-2 border-blue-400 dark:border-blue-500 bg-card p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold">Age Calculator</h3>
            <p className="text-xs text-muted-foreground mt-1">Calculate exact age from a birthdate to today.</p>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Birthdate</label>
            <input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} className={`w-full ${inputCls}`} />
          </div>
          {age.error ? (
            <div className="flex gap-2 text-sm text-destructive"><AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /><span>{age.error}</span></div>
          ) : (
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 px-4 py-3 space-y-1">
              <p className="font-mono text-xl font-bold text-foreground">{age.years} yrs, {age.months} mos, {age.days} days</p>
              <p className="text-xs text-muted-foreground">{age.totalDays.toLocaleString()} total days</p>
            </div>
          )}
        </div>

        {/* Date Difference */}
        <div className="rounded-xl border-2 border-violet-400 dark:border-violet-500 bg-card p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold">Days Between Dates</h3>
            <p className="text-xs text-muted-foreground mt-1">Find the difference between any two dates.</p>
          </div>
          <div className="space-y-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">From</label>
              <input type="date" value={dateA} onChange={(e) => setDateA(e.target.value)} className={`w-full ${inputCls}`} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">To</label>
              <input type="date" value={dateB} onChange={(e) => setDateB(e.target.value)} className={`w-full ${inputCls}`} />
            </div>
          </div>
          {diff.error ? (
            <div className="flex gap-2 text-sm text-destructive"><AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /><span>{diff.error}</span></div>
          ) : (
            <div className="rounded-lg bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 px-4 py-3 space-y-1">
              <p className="font-mono text-xl font-bold text-foreground">{diff.days.toLocaleString()} days</p>
              <p className="text-xs text-muted-foreground">{diff.weeks} weeks · {diff.months} months · {diff.years} years</p>
            </div>
          )}
        </div>

        {/* Add/Subtract */}
        <div className="rounded-xl border-2 border-emerald-400 dark:border-emerald-500 bg-card p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold">Add / Subtract Duration</h3>
            <p className="text-xs text-muted-foreground mt-1">Add or subtract days, weeks, months, or years from a date.</p>
          </div>
          <div className="space-y-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Start Date</label>
              <input type="date" value={addDate} onChange={(e) => setAddDate(e.target.value)} className={`w-full ${inputCls}`} />
            </div>
            <div className="flex gap-2">
              <input type="number" value={addAmount} onChange={(e) => setAddAmount(e.target.value)}
                className={`${inputCls} w-24`} placeholder="30" />
              <select value={addUnit} onChange={(e) => setAddUnit(e.target.value as typeof addUnit)}
                className={`flex-1 ${inputCls}`}>
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </div>
          </div>
          {added.error ? (
            <div className="flex gap-2 text-sm text-destructive"><AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /><span>{added.error}</span></div>
          ) : (
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-4 py-3 flex items-center justify-between">
              <p className="font-mono text-xl font-bold text-foreground">{added.result}</p>
              <CopyButton text={added.result} />
            </div>
          )}
        </div>
      </div>
    </ToolShell>
  );
}
