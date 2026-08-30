// Cron expression: minute hour day-of-month month day-of-week
// Supports: * (any), number, ranges (1-5), lists (1,2,3), step (*/5, 1-5/2)

interface CronField {
  type: "any" | "values";
  values: number[];
}

const FIELD_RANGES = [
  { name: "minute", min: 0, max: 59 },
  { name: "hour", min: 0, max: 23 },
  { name: "day", min: 1, max: 31 },
  { name: "month", min: 1, max: 12 },
  { name: "weekday", min: 0, max: 6 },
];

const MONTH_NAMES: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

const WEEKDAY_NAMES: Record<string, number> = {
  sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6,
};

function resolveAlias(token: string, fieldIndex: number): string {
  const lower = token.toLowerCase();
  if (fieldIndex === 3 && MONTH_NAMES[lower] !== undefined) {
    return String(MONTH_NAMES[lower]);
  }
  if (fieldIndex === 4 && WEEKDAY_NAMES[lower] !== undefined) {
    return String(WEEKDAY_NAMES[lower]);
  }
  return token;
}

function parseField(
  expr: string,
  fieldIndex: number
): { field: CronField | null; error: string | null } {
  const { min, max } = FIELD_RANGES[fieldIndex];
  const values = new Set<number>();

  const parts = expr.split(",");
  for (const part of parts) {
    const resolved = resolveAlias(part.trim(), fieldIndex);

    if (resolved === "*") {
      // All values
      for (let i = min; i <= max; i++) values.add(i);
      continue;
    }

    // Step: */N or range/N
    if (resolved.includes("/")) {
      const [rangeStr, stepStr] = resolved.split("/");
      const step = parseInt(stepStr);
      if (isNaN(step) || step < 1) {
        return { field: null, error: `Invalid step in "${expr}"` };
      }
      let rangeMin = min;
      let rangeMax = max;
      if (rangeStr !== "*") {
        if (rangeStr.includes("-")) {
          const [rMin, rMax] = rangeStr.split("-").map(Number);
          rangeMin = rMin;
          rangeMax = rMax;
        } else {
          rangeMin = parseInt(rangeStr);
          rangeMax = max;
        }
      }
      for (let i = rangeMin; i <= rangeMax; i += step) values.add(i);
      continue;
    }

    // Range: N-M
    if (resolved.includes("-")) {
      const [rMin, rMax] = resolved.split("-").map(Number);
      if (isNaN(rMin) || isNaN(rMax) || rMin > rMax) {
        return { field: null, error: `Invalid range in "${expr}"` };
      }
      for (let i = rMin; i <= rMax; i++) values.add(i);
      continue;
    }

    // Single value
    const n = parseInt(resolved);
    if (isNaN(n)) {
      return { field: null, error: `Invalid value "${resolved}" in field "${expr}"` };
    }
    if (n < min || n > max) {
      return {
        field: null,
        error: `Value ${n} out of range [${min}-${max}] in "${expr}"`,
      };
    }
    values.add(n);
  }

  const sorted = Array.from(values).sort((a, b) => a - b);
  const isAny =
    sorted.length === max - min + 1 &&
    sorted[0] === min &&
    sorted[sorted.length - 1] === max;

  return {
    field: { type: isAny ? "any" : "values", values: sorted },
    error: null,
  };
}

function parseCron(
  expr: string
): { fields: CronField[] | null; error: string | null } {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) {
    return {
      fields: null,
      error: `Expected 5 fields, got ${parts.length}. Format: minute hour day month weekday`,
    };
  }

  const fields: CronField[] = [];
  for (let i = 0; i < 5; i++) {
    const { field, error } = parseField(parts[i], i);
    if (error || !field) return { fields: null, error: error ?? "Parse error" };
    fields.push(field);
  }

  return { fields, error: null };
}

export function validateCron(
  expr: string
): { valid: boolean; error: string | null } {
  const { error } = parseCron(expr);
  return { valid: error === null, error };
}

export function cronToHuman(expr: string): string {
  const { fields, error } = parseCron(expr);
  if (error || !fields) return `Invalid cron expression: ${error}`;

  const [minute, hour, day, month, weekday] = fields;

  const monthNames = [
    "", "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const minuteStr =
    minute.type === "any"
      ? "every minute"
      : minute.values.length === 1
      ? `at minute ${minute.values[0]}`
      : `at minutes ${minute.values.join(", ")}`;

  const hourStr =
    hour.type === "any"
      ? ""
      : hour.values.length === 1
      ? ` past hour ${hour.values[0]}`
      : ` past hours ${hour.values.join(", ")}`;

  const dayStr =
    day.type === "any"
      ? ""
      : day.values.length === 1
      ? ` on day ${day.values[0]} of the month`
      : ` on days ${day.values.join(", ")} of the month`;

  const monthStr =
    month.type === "any"
      ? ""
      : month.values.length === 1
      ? ` in ${monthNames[month.values[0]]}`
      : ` in ${month.values.map((m) => monthNames[m]).join(", ")}`;

  const weekdayStr =
    weekday.type === "any"
      ? ""
      : weekday.values.length === 1
      ? ` on ${weekdayNames[weekday.values[0]]}`
      : ` on ${weekday.values.map((d) => weekdayNames[d]).join(", ")}`;

  // Special common patterns
  const raw = expr.trim();
  if (raw === "* * * * *") return "Every minute";
  if (raw === "0 * * * *") return "Every hour";
  if (raw === "0 0 * * *") return "Every day at midnight";
  if (raw === "0 12 * * *") return "Every day at noon";
  if (raw === "0 0 * * 0") return "Every Sunday at midnight";
  if (raw === "0 0 1 * *") return "Every month on the 1st at midnight";
  if (raw === "0 0 1 1 *") return "Every year on January 1st at midnight";
  if (raw === "0 0 * * 1-5") return "Every weekday at midnight";

  return `Runs ${minuteStr}${hourStr}${dayStr}${monthStr}${weekdayStr}.`;
}

export function getNextRuns(expr: string, count = 5): Date[] {
  const { fields, error } = parseCron(expr);
  if (error || !fields) return [];

  const [minuteField, hourField, dayField, monthField, weekdayField] = fields;

  const results: Date[] = [];
  const now = new Date();

  // Start searching from the next minute
  const start = new Date(now);
  start.setSeconds(0, 0);
  start.setMinutes(start.getMinutes() + 1);

  const limit = 100000; // max iterations to prevent infinite loops
  let iter = 0;
  let current = new Date(start);

  while (results.length < count && iter < limit) {
    iter++;

    const m = current.getMonth() + 1; // 1-12
    const d = current.getDate();
    const h = current.getHours();
    const min = current.getMinutes();
    const wd = current.getDay(); // 0-6

    const monthMatch = monthField.type === "any" || monthField.values.includes(m);
    const dayMatch = dayField.type === "any" || dayField.values.includes(d);
    const weekdayMatch = weekdayField.type === "any" || weekdayField.values.includes(wd);
    const hourMatch = hourField.type === "any" || hourField.values.includes(h);
    const minuteMatch = minuteField.type === "any" || minuteField.values.includes(min);

    if (monthMatch && dayMatch && weekdayMatch && hourMatch && minuteMatch) {
      results.push(new Date(current));
    }

    // Advance by one minute
    current = new Date(current.getTime() + 60000);
  }

  return results;
}
