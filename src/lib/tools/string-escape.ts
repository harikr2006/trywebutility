// JSON string escaping
export function escapeJSON(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t")
    .replace(/\f/g, "\\f")
    .replace(/\b/g, "\\b")
    .replace(/[\x00-\x1f\x7f]/g, (c) => {
      return "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0");
    });
}

export function unescapeJSON(s: string): string {
  try {
    return JSON.parse(`"${s}"`);
  } catch {
    // Manual fallback
    return s
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\")
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "\r")
      .replace(/\\t/g, "\t")
      .replace(/\\f/g, "\f")
      .replace(/\\b/g, "\b")
      .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
        String.fromCharCode(parseInt(hex, 16))
      );
  }
}

// JavaScript string escaping (single or double quote context)
export function escapeJS(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t")
    .replace(/\f/g, "\\f")
    .replace(/\b/g, "\\b")
    .replace(/\0/g, "\\0")
    .replace(/[\x00-\x1f\x7f]/g, (c) => {
      return "\\x" + c.charCodeAt(0).toString(16).padStart(2, "0");
    });
}

export function unescapeJS(s: string): string {
  return s
    .replace(/\\x([0-9a-fA-F]{2})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    )
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    )
    .replace(/\\0/g, "\0")
    .replace(/\\b/g, "\b")
    .replace(/\\f/g, "\f")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\");
}

// SQL single-quote escaping
export function escapeSQLString(s: string): string {
  // Standard SQL: single quotes are escaped by doubling them
  return s.replace(/'/g, "''");
}

export function unescapeSQLString(s: string): string {
  return s.replace(/''/g, "'");
}
