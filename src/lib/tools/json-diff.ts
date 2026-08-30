export type DiffType = "added" | "removed" | "changed" | "unchanged";
export interface DiffEntry { path: string; type: DiffType; oldValue?: unknown; newValue?: unknown }

function diffObjects(a: unknown, b: unknown, path = ""): DiffEntry[] {
  if (a === b) return [{ path: path || "(root)", type: "unchanged", oldValue: a, newValue: b }];
  if (typeof a !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
    return [{ path: path || "(root)", type: "changed", oldValue: a, newValue: b }];
  }
  if (typeof a !== "object" || a === null || b === null) {
    return [{ path: path || "(root)", type: "changed", oldValue: a, newValue: b }];
  }
  const entries: DiffEntry[] = [];
  const aObj = a as Record<string, unknown>;
  const bObj = b as Record<string, unknown>;
  const allKeys = new Set([...Object.keys(aObj), ...Object.keys(bObj)]);
  for (const key of allKeys) {
    const p = path ? `${path}.${key}` : key;
    if (!(key in aObj)) entries.push({ path: p, type: "added", newValue: bObj[key] });
    else if (!(key in bObj)) entries.push({ path: p, type: "removed", oldValue: aObj[key] });
    else entries.push(...diffObjects(aObj[key], bObj[key], p));
  }
  return entries;
}

export function diffJSON(left: string, right: string): { entries: DiffEntry[]; error: string | null } {
  try {
    const a = JSON.parse(left);
    const b = JSON.parse(right);
    const entries = diffObjects(a, b).filter(e => e.type !== "unchanged");
    return { entries, error: null };
  } catch (e) {
    return { entries: [], error: e instanceof Error ? e.message : "Invalid JSON" };
  }
}
