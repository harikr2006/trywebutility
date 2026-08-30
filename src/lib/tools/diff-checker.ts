import * as Diff from "diff";

export interface SideChar {
  text: string;
  highlight: boolean;
}

export interface SideLine {
  lineNo: number;
  content: string;
  chars?: SideChar[];
  type: "removed" | "added" | "unchanged";
}

export interface DiffRow {
  left: SideLine | null;
  right: SideLine | null;
}

function splitLines(text: string): string[] {
  const lines = text.split("\n");
  if (lines[lines.length - 1] === "") lines.pop();
  return lines;
}

function charDiff(a: string, b: string): { leftChars: SideChar[]; rightChars: SideChar[] } {
  const changes = Diff.diffChars(a, b);
  const leftChars: SideChar[] = [];
  const rightChars: SideChar[] = [];
  for (const c of changes) {
    if (c.removed) {
      for (const ch of c.value) leftChars.push({ text: ch, highlight: true });
    } else if (c.added) {
      for (const ch of c.value) rightChars.push({ text: ch, highlight: true });
    } else {
      for (const ch of c.value) {
        leftChars.push({ text: ch, highlight: false });
        rightChars.push({ text: ch, highlight: false });
      }
    }
  }
  return { leftChars, rightChars };
}

export function buildSideBySide(original: string, modified: string): DiffRow[] {
  const chunks = Diff.diffLines(original, modified);
  const rows: DiffRow[] = [];
  let lLine = 1;
  let rLine = 1;
  let i = 0;

  while (i < chunks.length) {
    const chunk = chunks[i];

    if (!chunk.added && !chunk.removed) {
      for (const ln of splitLines(chunk.value)) {
        rows.push({
          left: { lineNo: lLine++, content: ln, type: "unchanged" },
          right: { lineNo: rLine++, content: ln, type: "unchanged" },
        });
      }
    } else if (chunk.removed) {
      const removed = splitLines(chunk.value);
      let added: string[] = [];
      if (i + 1 < chunks.length && chunks[i + 1].added) {
        added = splitLines(chunks[i + 1].value);
        i++;
      }
      const max = Math.max(removed.length, added.length);
      for (let j = 0; j < max; j++) {
        const hasLeft = j < removed.length;
        const hasRight = j < added.length;
        let left: SideLine | null = null;
        let right: SideLine | null = null;

        if (hasLeft && hasRight) {
          const { leftChars, rightChars } = charDiff(removed[j], added[j]);
          left = { lineNo: lLine++, content: removed[j], chars: leftChars, type: "removed" };
          right = { lineNo: rLine++, content: added[j], chars: rightChars, type: "added" };
        } else if (hasLeft) {
          left = { lineNo: lLine++, content: removed[j], type: "removed" };
        } else {
          right = { lineNo: rLine++, content: added[j], type: "added" };
        }
        rows.push({ left, right });
      }
    } else if (chunk.added) {
      for (const ln of splitLines(chunk.value)) {
        rows.push({ left: null, right: { lineNo: rLine++, content: ln, type: "added" } });
      }
    }
    i++;
  }

  return rows;
}

export interface DiffStats {
  added: number;
  removed: number;
  unchanged: number;
}

export function calcStats(rows: DiffRow[]): DiffStats {
  let added = 0, removed = 0, unchanged = 0;
  for (const row of rows) {
    if (row.left?.type === "removed") removed++;
    if (row.right?.type === "added") added++;
    if (row.left?.type === "unchanged") unchanged++;
  }
  return { added, removed, unchanged };
}
