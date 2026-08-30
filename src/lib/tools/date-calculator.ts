export interface AgeDuration {
  years: number;
  months: number;
  days: number;
  totalDays: number;
}

export function calcAge(birthdate: string): AgeDuration & { error: string | null } {
  try {
    const birth = new Date(birthdate);
    if (isNaN(birth.getTime())) throw new Error("Invalid date");
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();
    if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }
    const totalDays = Math.floor((now.getTime() - birth.getTime()) / 86400000);
    return { years, months, days, totalDays, error: null };
  } catch (e) {
    return { years: 0, months: 0, days: 0, totalDays: 0, error: e instanceof Error ? e.message : "Error" };
  }
}

export interface DiffResult {
  days: number;
  weeks: number;
  months: number;
  years: number;
  error: string | null;
}

export function diffDates(dateA: string, dateB: string): DiffResult {
  try {
    const a = new Date(dateA), b = new Date(dateB);
    if (isNaN(a.getTime()) || isNaN(b.getTime())) throw new Error("Invalid date");
    const msAbs = Math.abs(b.getTime() - a.getTime());
    const days = Math.floor(msAbs / 86400000);
    return { days, weeks: parseFloat((days / 7).toFixed(2)), months: parseFloat((days / 30.44).toFixed(2)), years: parseFloat((days / 365.25).toFixed(2)), error: null };
  } catch (e) {
    return { days: 0, weeks: 0, months: 0, years: 0, error: e instanceof Error ? e.message : "Error" };
  }
}

export function addDuration(date: string, amount: number, unit: "days" | "weeks" | "months" | "years"): { result: string; error: string | null } {
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) throw new Error("Invalid date");
    const r = new Date(d);
    if (unit === "days") r.setDate(r.getDate() + amount);
    else if (unit === "weeks") r.setDate(r.getDate() + amount * 7);
    else if (unit === "months") r.setMonth(r.getMonth() + amount);
    else r.setFullYear(r.getFullYear() + amount);
    return { result: r.toISOString().split("T")[0], error: null };
  } catch (e) {
    return { result: "", error: e instanceof Error ? e.message : "Error" };
  }
}
