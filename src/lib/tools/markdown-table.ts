export interface TableData {
  headers: string[];
  rows: string[][];
}

export function renderMarkdownTable(data: TableData): string {
  if (!data.headers.length) return "";
  const colWidths = data.headers.map((h, i) =>
    Math.max(h.length, ...data.rows.map(r => (r[i] ?? "").length), 3)
  );
  const pad = (s: string, n: number) => s + " ".repeat(Math.max(0, n - s.length));
  const header = "| " + data.headers.map((h, i) => pad(h, colWidths[i])).join(" | ") + " |";
  const divider = "| " + colWidths.map(w => "-".repeat(w)).join(" | ") + " |";
  const rows = data.rows.map(row =>
    "| " + data.headers.map((_, i) => pad(row[i] ?? "", colWidths[i])).join(" | ") + " |"
  );
  return [header, divider, ...rows].join("\n");
}

export function emptyTable(cols: number, rows: number): TableData {
  return {
    headers: Array.from({ length: cols }, (_, i) => `Header ${i + 1}`),
    rows: Array.from({ length: rows }, () => Array(cols).fill("")),
  };
}
