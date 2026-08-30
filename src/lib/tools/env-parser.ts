export interface EnvEntry {
  key: string;
  value: string;
  comment: string;
  line: number;
}

export interface EnvParseResult {
  entries: EnvEntry[];
  errors: string[];
}

export function parseEnv(content: string): EnvParseResult {
  const lines = content.split("\n");
  const entries: EnvEntry[] = [];
  const errors: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();

    // skip empty lines and comment-only lines
    if (!trimmed || trimmed.startsWith("#")) continue;

    // inline comment extraction (crude: anything after unquoted #)
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) {
      errors.push(`Line ${i + 1}: missing "=" in "${trimmed}"`);
      continue;
    }

    const key = trimmed.slice(0, eqIdx).trim();
    if (!key) { errors.push(`Line ${i + 1}: empty key`); continue; }
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
      errors.push(`Line ${i + 1}: invalid key "${key}"`);
    }

    let val = trimmed.slice(eqIdx + 1);
    let comment = "";

    // Strip inline comment (only outside quotes)
    const inlineCommentMatch = val.match(/^([^#"']*|'[^']*'|"(?:[^"\\]|\\.)*")*?(#.*)$/);
    if (inlineCommentMatch?.[2]) {
      comment = inlineCommentMatch[2].slice(1).trim();
      val = val.slice(0, val.length - inlineCommentMatch[2].length).trim();
    }

    // Strip surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }

    // Handle escaped newlines in double-quoted values
    if (trimmed.slice(eqIdx + 1).trimStart().startsWith('"')) {
      val = val.replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\r/g, "\r");
    }

    entries.push({ key, value: val, comment, line: i + 1 });
  }

  return { entries, errors };
}

export function entriesToJson(entries: EnvEntry[]): string {
  const obj: Record<string, string> = {};
  for (const e of entries) obj[e.key] = e.value;
  return JSON.stringify(obj, null, 2);
}
