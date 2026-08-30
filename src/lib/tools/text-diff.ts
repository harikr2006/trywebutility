import * as Diff from "diff";

export interface DiffLine {
  value: string;
  added?: boolean;
  removed?: boolean;
}

export function diffTexts(original: string, modified: string): DiffLine[] {
  const changes = Diff.diffLines(original, modified);
  return changes.map((change) => ({
    value: change.value,
    added: change.added,
    removed: change.removed,
  }));
}

export function diffStats(lines: DiffLine[]): { added: number; removed: number; unchanged: number } {
  let added = 0;
  let removed = 0;
  let unchanged = 0;

  for (const line of lines) {
    const lineCount = line.value.split("\n").filter((l, i, arr) => i < arr.length - 1 || l !== "").length;
    if (line.added) {
      added += lineCount;
    } else if (line.removed) {
      removed += lineCount;
    } else {
      unchanged += lineCount;
    }
  }

  return { added, removed, unchanged };
}
