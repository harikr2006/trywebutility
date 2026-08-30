export function formatHTML(input: string): { output: string; error: string | null } {
  // Simple HTML beautifier - indent tags
  try {
    if (!input.trim()) return { output: "", error: null };
    let indent = 0;
    const tab = "  ";
    const voidElements = new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);
    const result: string[] = [];
    // tokenize
    const tokens = input.match(/<[^>]+>|[^<]+/g) ?? [];
    for (const token of tokens) {
      const trimmed = token.trim();
      if (!trimmed) continue;
      if (trimmed.startsWith("</")) {
        indent = Math.max(0, indent - 1);
        result.push(tab.repeat(indent) + trimmed);
      } else if (trimmed.startsWith("<!--")) {
        result.push(tab.repeat(indent) + trimmed);
      } else if (trimmed.startsWith("<")) {
        const tagName = (trimmed.match(/^<([a-zA-Z0-9-]+)/) ?? [])[1]?.toLowerCase() ?? "";
        const isSelfClosing = trimmed.endsWith("/>") || voidElements.has(tagName);
        result.push(tab.repeat(indent) + trimmed);
        if (!isSelfClosing) indent++;
      } else {
        const text = trimmed;
        if (text) result.push(tab.repeat(indent) + text);
      }
    }
    return { output: result.join("\n"), error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "Failed to format HTML" };
  }
}

export function minifyHTML(input: string): { output: string; error: string | null } {
  try {
    if (!input.trim()) return { output: "", error: null };
    const output = input
      .replace(/\s+/g, " ")
      .replace(/>\s+</g, "><")
      .trim();
    return { output, error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "Failed to minify HTML" };
  }
}
