import { marked } from "marked";

export function markdownToHTML(input: string): { html: string; error: string | null } {
  try {
    if (!input.trim()) return { html: "", error: null };
    const html = marked.parse(input) as string;
    return { html, error: null };
  } catch (e) {
    return { html: "", error: e instanceof Error ? e.message : "Conversion failed" };
  }
}

export function markdownTableToHTML(input: string): { html: string; error: string | null } {
  try {
    if (!input.trim()) return { html: "", error: null };
    const lines = input.trim().split("\n").filter(l => l.trim());
    if (lines.length < 2) return { html: "", error: "Need at least a header row and separator row" };
    const parseRow = (line: string) =>
      line.split("|").map(c => c.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1);
    const headers = parseRow(lines[0]);
    const rows = lines.slice(2).map(parseRow);
    const th = headers.map(h => `    <th>${h}</th>`).join("\n");
    const trs = rows.map(row =>
      `  <tr>\n${row.map(c => `    <td>${c}</td>`).join("\n")}\n  </tr>`
    ).join("\n");
    const html = `<table>\n  <thead>\n  <tr>\n${th}\n  </tr>\n  </thead>\n  <tbody>\n${trs}\n  </tbody>\n</table>`;
    return { html, error: null };
  } catch (e) {
    return { html: "", error: e instanceof Error ? e.message : "Conversion failed" };
  }
}
