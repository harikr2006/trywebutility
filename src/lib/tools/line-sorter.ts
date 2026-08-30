export type SortMode = "alpha-asc" | "alpha-desc" | "length-asc" | "length-desc" | "shuffle" | "reverse";

export function sortLines(input: string, mode: SortMode, dedupe: boolean, _seed?: number): string {
  if (!input.trim()) return "";
  let lines = input.split("\n");
  if (dedupe) {
    const seen = new Set<string>();
    lines = lines.filter(l => { const k = l.trim(); if (seen.has(k)) return false; seen.add(k); return true; });
  }
  switch (mode) {
    case "alpha-asc": lines.sort((a, b) => a.localeCompare(b)); break;
    case "alpha-desc": lines.sort((a, b) => b.localeCompare(a)); break;
    case "length-asc": lines.sort((a, b) => a.length - b.length); break;
    case "length-desc": lines.sort((a, b) => b.length - a.length); break;
    case "shuffle": for (let i = lines.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [lines[i], lines[j]] = [lines[j], lines[i]]; } break;
    case "reverse": lines.reverse(); break;
  }
  return lines.join("\n");
}
