export function minifyJs(code: string): { output: string; error: string | null; originalBytes: number; minifiedBytes: number } {
  try {
    if (!code.trim()) return { output: "", error: null, originalBytes: 0, minifiedBytes: 0 };

    const originalBytes = new TextEncoder().encode(code).length;
    let out = code;

    // Remove single-line comments (not inside strings)
    out = out.replace(/\/\/[^\n]*/g, "");

    // Remove multi-line comments
    out = out.replace(/\/\*[\s\S]*?\*\//g, "");

    // Collapse whitespace (preserve string contents by processing line by line smartly)
    // Simple approach: collapse sequences of whitespace outside strings
    // This is a basic minifier - not AST-based
    out = out
      .split("\n")
      .map(l => l.trim())
      .filter(Boolean)
      .join("\n");

    // Collapse multiple spaces into one (outside strings - simplified)
    out = out.replace(/[ \t]+/g, " ");

    // Remove spaces around common operators
    out = out.replace(/ *([\{\}\(\)\[\],;:]) */g, "$1");
    out = out.replace(/ *([=<>!+\-*\/%&|^~?]) */g, "$1");

    // Collapse multiple newlines
    out = out.replace(/\n+/g, "\n").trim();

    const minifiedBytes = new TextEncoder().encode(out).length;
    return { output: out, error: null, originalBytes, minifiedBytes };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "Minification failed", originalBytes: 0, minifiedBytes: 0 };
  }
}

export function beautifyJs(code: string): { output: string; error: string | null } {
  // Basic indentation beautifier
  try {
    if (!code.trim()) return { output: "", error: null };
    let out = "";
    let indent = 0;
    const INDENT = "  ";
    for (const char of code) {
      if (char === "{" || char === "[" || char === "(") {
        out += char + "\n" + INDENT.repeat(++indent);
      } else if (char === "}" || char === "]" || char === ")") {
        out = out.trimEnd() + "\n" + INDENT.repeat(--indent) + char;
      } else if (char === ";") {
        out += char + "\n" + INDENT.repeat(indent);
      } else {
        out += char;
      }
    }
    return { output: out.trim(), error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "Beautify failed" };
  }
}
