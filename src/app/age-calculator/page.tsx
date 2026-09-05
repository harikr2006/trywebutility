"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";

function localDate(d: Date = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const today = localDate();

function calcAge(dob: Date, asOf: Date) {
  let years = asOf.getFullYear() - dob.getFullYear();
  let months = asOf.getMonth() - dob.getMonth();
  let days = asOf.getDate() - dob.getDate();
  if (days < 0) { months--; days += new Date(asOf.getFullYear(), asOf.getMonth(), 0).getDate(); }
  if (months < 0) { years--; months += 12; }
  const totalDays = Math.floor((asOf.getTime() - dob.getTime()) / 86400000);
  const dayOfWeek = dob.toLocaleDateString("en-US", { weekday: "long" });
  let nextBday = new Date(asOf.getFullYear(), dob.getMonth(), dob.getDate());
  if (nextBday <= asOf) nextBday.setFullYear(nextBday.getFullYear() + 1);
  const daysToNext = Math.ceil((nextBday.getTime() - asOf.getTime()) / 86400000);
  return { years, months, days, totalDays, totalWeeks: Math.floor(totalDays / 7), totalHours: totalDays * 24, dayOfWeek, daysToNext, nextBday };
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-center">
      <p className="text-2xl font-bold font-mono text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

export default function AgeCalculatorPage() {
  const [dob, setDob] = useState("1990-01-01");
  const [asOf, setAsOf] = useState(today);

  const inputCls = "h-9 rounded-md border border-border/60 bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 w-full";

  const dobDate = new Date(dob + "T00:00:00");
  const asOfDate = new Date(asOf + "T00:00:00");
  const valid = dob && asOf && !isNaN(dobDate.getTime()) && !isNaN(asOfDate.getTime()) && dobDate <= asOfDate;
  const result = valid ? calcAge(dobDate, asOfDate) : null;

  return (
    <ToolShell
      title="Age Calculator"
      description="Calculate your exact age in years, months, and days, along with total days, weeks, hours lived, and days until your next birthday."
    >
      <div className="flex flex-col gap-6 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Calculate Age As Of</label>
            <input
              type="date"
              value={asOf}
              onChange={(e) => setAsOf(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        <Button
          onClick={() => {
            setDob(dob);
            setAsOf(asOf);
          }}
          className="w-full sm:w-auto self-start"
        >
          <CalendarDays className="h-4 w-4 mr-2" />
          Calculate Age
        </Button>

        {!valid && dob && asOf && (
          <p className="text-sm text-destructive">Date of birth must be before or equal to the "As of" date.</p>
        )}

        {result && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <StatCard value={result.years.toString()} label="Years" />
            <StatCard value={result.months.toString()} label="Months" />
            <StatCard value={result.days.toString()} label="Days" />
            <StatCard value={result.totalDays.toLocaleString()} label="Total Days Lived" />
            <StatCard value={result.totalWeeks.toLocaleString()} label="Total Weeks Lived" />
            <StatCard value={result.totalHours.toLocaleString()} label="Total Hours Lived (approx.)" />
            <StatCard
              value={`${result.daysToNext} day${result.daysToNext === 1 ? "" : "s"}`}
              label={`Next Birthday — ${result.nextBday.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`}
            />
            <StatCard value={result.dayOfWeek} label="Day of Week Born" />
          </div>
        )}
      </div>
    </ToolShell>
  );
}
