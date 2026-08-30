export interface RegexMatch {
  match: string;
  index: number;
  groups: Record<string, string> | null;
}

export interface RegexResult {
  matches: RegexMatch[];
  error: string | null;
  flags: string;
}

export function testRegex(pattern: string, flags: string, testString: string): RegexResult {
  try {
    const re = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
    const matches: RegexMatch[] = [];
    let m: RegExpExecArray | null;
    // guard against infinite loop on zero-length matches
    let lastIndex = -1;
    while ((m = re.exec(testString)) !== null) {
      if (m.index === lastIndex) {
        re.lastIndex++;
        continue;
      }
      lastIndex = m.index;
      matches.push({
        match: m[0],
        index: m.index,
        groups: m.groups ?? null,
      });
    }
    return { matches, error: null, flags };
  } catch (e) {
    return { matches: [], error: (e as Error).message, flags };
  }
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function highlightMatches(text: string, matches: RegexMatch[]): string {
  if (!matches.length) return escapeHtml(text);
  let result = "";
  let cursor = 0;
  for (const m of matches) {
    result += escapeHtml(text.slice(cursor, m.index));
    result += `<mark>${escapeHtml(m.match)}</mark>`;
    cursor = m.index + m.match.length;
  }
  result += escapeHtml(text.slice(cursor));
  return result;
}
