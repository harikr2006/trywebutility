export function nowToUnix(): number {
  return Math.floor(Date.now() / 1000);
}

export function unixToDate(
  unix: number
): { utc: string; local: string; iso: string; relative: string } {
  const ms = unix * 1000;
  const d = new Date(ms);

  const utc = d.toUTCString();
  const local = d.toLocaleString();
  const iso = d.toISOString();

  // Relative time
  const diffSeconds = Math.floor((Date.now() - ms) / 1000);
  const abs = Math.abs(diffSeconds);
  const future = diffSeconds < 0;
  let relative: string;

  if (abs < 60) {
    relative = abs === 0 ? "just now" : `${abs} second${abs !== 1 ? "s" : ""} ${future ? "from now" : "ago"}`;
  } else if (abs < 3600) {
    const m = Math.floor(abs / 60);
    relative = `${m} minute${m !== 1 ? "s" : ""} ${future ? "from now" : "ago"}`;
  } else if (abs < 86400) {
    const h = Math.floor(abs / 3600);
    relative = `${h} hour${h !== 1 ? "s" : ""} ${future ? "from now" : "ago"}`;
  } else if (abs < 2592000) {
    const dy = Math.floor(abs / 86400);
    relative = `${dy} day${dy !== 1 ? "s" : ""} ${future ? "from now" : "ago"}`;
  } else if (abs < 31536000) {
    const mo = Math.floor(abs / 2592000);
    relative = `${mo} month${mo !== 1 ? "s" : ""} ${future ? "from now" : "ago"}`;
  } else {
    const yr = Math.floor(abs / 31536000);
    relative = `${yr} year${yr !== 1 ? "s" : ""} ${future ? "from now" : "ago"}`;
  }

  return { utc, local, iso, relative };
}

export function dateToUnix(
  dateStr: string
): { unix: number; ms: number; error: string | null } {
  if (!dateStr || !dateStr.trim()) {
    return { unix: 0, ms: 0, error: "Empty input" };
  }

  const d = new Date(dateStr.trim());

  if (isNaN(d.getTime())) {
    return { unix: 0, ms: 0, error: `Could not parse date: "${dateStr}"` };
  }

  const ms = d.getTime();
  const unix = Math.floor(ms / 1000);

  return { unix, ms, error: null };
}
