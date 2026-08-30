export function formatCSS(
  input: string
): { output: string; error: string | null } {
  if (!input || !input.trim()) {
    return { output: "", error: null };
  }

  try {
    // Remove existing extra whitespace
    let css = input.trim();

    // Remove block comments (/* ... */)
    css = css.replace(/\/\*[\s\S]*?\*\//g, (comment) => {
      // Preserve comments but normalize spacing around them
      return "\n" + comment.trim() + "\n";
    });

    const result: string[] = [];
    let indentLevel = 0;
    const indent = "  ";

    // Tokenize by { } ;
    const tokens = css.split(/([\{\};])/).map((t) => t.trim()).filter((t) => t.length > 0);

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      if (token === "{") {
        // The selector is the previous result entry
        if (result.length > 0) {
          result[result.length - 1] = result[result.length - 1] + " {";
        }
        indentLevel++;
      } else if (token === "}") {
        indentLevel = Math.max(0, indentLevel - 1);
        result.push(indent.repeat(indentLevel) + "}");
        // Add blank line after closing brace at root level
        if (indentLevel === 0) {
          result.push("");
        }
      } else if (token === ";") {
        // Attach semicolon to previous declaration
        if (result.length > 0 && !result[result.length - 1].endsWith("{")) {
          result[result.length - 1] = result[result.length - 1] + ";";
        }
      } else {
        // Could be selector, property: value, or multi-line content
        const lines = token.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
        for (const line of lines) {
          if (line.startsWith("/*") || line.endsWith("*/")) {
            result.push(indent.repeat(indentLevel) + line);
          } else {
            result.push(indent.repeat(indentLevel) + line);
          }
        }
      }
    }

    const output = result.join("\n").replace(/\n{3,}/g, "\n\n").trim();
    return { output, error: null };
  } catch (e) {
    return {
      output: "",
      error: `Formatting error: ${e instanceof Error ? e.message : String(e)}`,
    };
  }
}

export function minifyCSS(
  input: string
): { output: string; error: string | null } {
  if (!input || !input.trim()) {
    return { output: "", error: null };
  }

  try {
    let css = input;

    // Remove block comments
    css = css.replace(/\/\*[\s\S]*?\*\//g, "");

    // Remove line comments (not standard CSS but used sometimes)
    css = css.replace(/\/\/[^\n]*/g, "");

    // Collapse whitespace
    css = css.replace(/\s+/g, " ");

    // Remove spaces around { } : ; , >  + ~
    css = css
      .replace(/\s*\{\s*/g, "{")
      .replace(/\s*\}\s*/g, "}")
      .replace(/\s*;\s*/g, ";")
      .replace(/\s*:\s*/g, ":")
      .replace(/\s*,\s*/g, ",")
      .replace(/\s*>\s*/g, ">")
      .replace(/\s*\+\s*/g, "+")
      .replace(/\s*~\s*/g, "~");

    // Remove trailing semicolons before closing braces
    css = css.replace(/;}/g, "}");

    // Remove leading/trailing whitespace
    css = css.trim();

    return { output: css, error: null };
  } catch (e) {
    return {
      output: "",
      error: `Minification error: ${e instanceof Error ? e.message : String(e)}`,
    };
  }
}
