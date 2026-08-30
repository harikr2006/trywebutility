function escapeXmlValue(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function indentXml(xml: string, indent = 2): string {
  const INDENT = " ".repeat(indent);
  let formatted = "";
  let depth = 0;
  // Split on tags but keep delimiters
  const tokens = xml.split(/(<[^>]+>)/);

  for (const token of tokens) {
    if (!token.trim()) continue;

    if (token.startsWith("</")) {
      // closing tag
      depth = Math.max(depth - 1, 0);
      formatted += INDENT.repeat(depth) + token + "\n";
    } else if (token.startsWith("<?") || token.startsWith("<!")) {
      // declaration / doctype
      formatted += INDENT.repeat(depth) + token + "\n";
    } else if (token.startsWith("<") && !token.endsWith("/>")) {
      // opening tag
      formatted += INDENT.repeat(depth) + token + "\n";
      depth++;
    } else if (token.startsWith("<") && token.endsWith("/>")) {
      // self-closing
      formatted += INDENT.repeat(depth) + token + "\n";
    } else {
      // text node
      const text = token.trim();
      if (text) {
        formatted += INDENT.repeat(depth) + escapeXmlValue(text) + "\n";
      }
    }
  }

  return formatted.trim();
}

export function formatXML(input: string): { output: string; error: string | null } {
  try {
    const trimmed = input.trim();
    if (!trimmed) return { output: "", error: "Input is empty" };
    if (!trimmed.startsWith("<")) return { output: "", error: "Input does not appear to be XML" };
    return { output: indentXml(trimmed), error: null };
  } catch (e) {
    return { output: "", error: (e as Error).message };
  }
}

export function minifyXML(input: string): { output: string; error: string | null } {
  try {
    const minified = input.replace(/>\s+</g, "><").trim();
    return { output: minified, error: null };
  } catch (e) {
    return { output: "", error: (e as Error).message };
  }
}
