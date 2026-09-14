"use client";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import ToolShell from "@/components/shared/ToolShell";
import { Button } from "@/components/ui/button";

// ---------------------------------------------------------------------------
// Theme & background definitions
// ---------------------------------------------------------------------------

interface ThemeColors {
  bg: string;
  text: string;
  keyword: string;
  string: string;
  comment: string;
  number: string;
  func: string;
  type: string;
  lineNum: string;
  chromeBg: string;
}

const THEMES: Record<string, ThemeColors> = {
  "dark-plus": {
    bg: "#1e1e1e", text: "#d4d4d4", keyword: "#569cd6", string: "#ce9178",
    comment: "#6a9955", number: "#b5cea8", func: "#dcdcaa", type: "#4ec9b0",
    lineNum: "#858585", chromeBg: "#252526",
  },
  "monokai": {
    bg: "#272822", text: "#f8f8f2", keyword: "#f92672", string: "#e6db74",
    comment: "#75715e", number: "#ae81ff", func: "#a6e22e", type: "#66d9ef",
    lineNum: "#75715e", chromeBg: "#1e1f1c",
  },
  "github-light": {
    bg: "#ffffff", text: "#24292f", keyword: "#cf222e", string: "#0a3069",
    comment: "#6e7781", number: "#0550ae", func: "#8250df", type: "#953800",
    lineNum: "#8c959f", chromeBg: "#f6f8fa",
  },
  "dracula": {
    bg: "#282a36", text: "#f8f8f2", keyword: "#ff79c6", string: "#f1fa8c",
    comment: "#6272a4", number: "#bd93f9", func: "#50fa7b", type: "#8be9fd",
    lineNum: "#6272a4", chromeBg: "#21222c",
  },
};

interface GradientBackground {
  type: "gradient";
  stops: [string, string];
}
interface SolidBackground {
  type: "solid";
  color: string;
}
type Background = GradientBackground | SolidBackground;

const BACKGROUNDS: Record<string, Background> = {
  "gradient-1": { type: "gradient", stops: ["#667eea", "#764ba2"] },
  "gradient-2": { type: "gradient", stops: ["#f093fb", "#f5576c"] },
  "gradient-3": { type: "gradient", stops: ["#4facfe", "#00f2fe"] },
  "gradient-4": { type: "gradient", stops: ["#43e97b", "#38f9d7"] },
  "gradient-5": { type: "gradient", stops: ["#fa709a", "#fee140"] },
  "dark":       { type: "solid", color: "#0d1117" },
  "light":      { type: "solid", color: "#f0f0f0" },
};

// Human-readable labels
const THEME_LABELS: Record<string, string> = {
  "dark-plus":    "Dark+ (VS Code)",
  "monokai":      "Monokai",
  "github-light": "GitHub Light",
  "dracula":      "Dracula",
};

const BG_LABELS: Record<string, string> = {
  "gradient-1": "Purple Gradient",
  "gradient-2": "Pink Gradient",
  "gradient-3": "Ocean Gradient",
  "gradient-4": "Mint Gradient",
  "gradient-5": "Sunset Gradient",
  "dark":       "Dark Solid",
  "light":      "Light Solid",
};

const LANGUAGE_OPTIONS = [
  "javascript", "typescript", "python", "css", "html", "json", "sql", "bash", "other",
];

// ---------------------------------------------------------------------------
// Tokenizer
// ---------------------------------------------------------------------------

interface Token {
  text: string;
  colorKey: keyof ThemeColors;
}

const JS_KEYWORDS = new Set([
  "const", "let", "var", "function", "class", "if", "else", "for", "while", "do",
  "return", "import", "export", "default", "from", "async", "await", "new", "this",
  "typeof", "instanceof", "true", "false", "null", "undefined", "void", "try", "catch",
  "finally", "throw", "switch", "case", "break", "continue", "of", "in", "extends",
  "super", "static", "get", "set", "type", "interface", "enum", "as", "readonly", "abstract",
]);

const PY_KEYWORDS = new Set([
  "def", "class", "if", "elif", "else", "for", "while", "return", "import", "from",
  "as", "pass", "break", "continue", "True", "False", "None", "and", "or", "not",
  "in", "is", "lambda", "with", "try", "except", "finally", "raise", "del", "global",
  "nonlocal", "yield", "assert",
]);

const CSS_KEYWORDS = new Set([
  "important", "px", "em", "rem", "vh", "vw", "auto", "none", "inherit", "initial",
  "unset", "normal", "bold", "italic",
]);

const SQL_KEYWORDS = new Set([
  "SELECT", "FROM", "WHERE", "AND", "OR", "NOT", "INSERT", "INTO", "VALUES",
  "UPDATE", "SET", "DELETE", "CREATE", "TABLE", "DROP", "ALTER", "ADD", "COLUMN",
  "INDEX", "JOIN", "LEFT", "RIGHT", "INNER", "OUTER", "ON", "GROUP", "BY", "ORDER",
  "HAVING", "LIMIT", "OFFSET", "DISTINCT", "AS", "NULL", "PRIMARY", "KEY",
  "FOREIGN", "REFERENCES", "DEFAULT", "UNIQUE", "INDEX", "IF", "EXISTS",
  "select", "from", "where", "and", "or", "not", "insert", "into", "values",
  "update", "set", "delete", "create", "table", "drop", "alter", "add", "column",
  "join", "left", "right", "inner", "outer", "on", "group", "by", "order",
  "having", "limit", "offset", "distinct", "as", "null", "primary", "key",
]);

function tokenizeLine(line: string, language: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  const push = (text: string, colorKey: keyof ThemeColors) => {
    if (text.length > 0) tokens.push({ text, colorKey });
  };

  if (language === "javascript" || language === "typescript") {
    while (i < line.length) {
      // Single-line comment
      if (line[i] === "/" && line[i + 1] === "/") {
        push(line.slice(i), "comment");
        break;
      }
      // Multi-line comment start (on same line, simplified: treat rest as comment)
      if (line[i] === "/" && line[i + 1] === "*") {
        const end = line.indexOf("*/", i + 2);
        if (end !== -1) {
          push(line.slice(i, end + 2), "comment");
          i = end + 2;
        } else {
          push(line.slice(i), "comment");
          break;
        }
        continue;
      }
      // String literals
      if (line[i] === '"' || line[i] === "'" || line[i] === "`") {
        const quote = line[i];
        let j = i + 1;
        while (j < line.length) {
          if (line[j] === "\\" && j + 1 < line.length) { j += 2; continue; }
          if (line[j] === quote) { j++; break; }
          j++;
        }
        push(line.slice(i, j), "string");
        i = j;
        continue;
      }
      // Number
      const numMatch = /^\b\d+\.?\d*\b/.exec(line.slice(i));
      if (numMatch && (i === 0 || /\W/.test(line[i - 1]))) {
        push(numMatch[0], "number");
        i += numMatch[0].length;
        continue;
      }
      // Word (keyword / function call / identifier)
      const wordMatch = /^[a-zA-Z_$][a-zA-Z0-9_$]*/.exec(line.slice(i));
      if (wordMatch) {
        const word = wordMatch[0];
        const afterWord = i + word.length;
        if (JS_KEYWORDS.has(word)) {
          push(word, "keyword");
        } else if (line[afterWord] === "(") {
          push(word, "func");
        } else {
          push(word, "text");
        }
        i += word.length;
        continue;
      }
      // Fallback: emit single char as text
      push(line[i], "text");
      i++;
    }
    return tokens;
  }

  if (language === "python") {
    while (i < line.length) {
      // Comment
      if (line[i] === "#") {
        push(line.slice(i), "comment");
        break;
      }
      // Triple-quoted strings (simplified: same-line only)
      if ((line[i] === '"' || line[i] === "'") &&
          line[i + 1] === line[i] && line[i + 2] === line[i]) {
        const quote3 = line.slice(i, i + 3);
        const end = line.indexOf(quote3, i + 3);
        if (end !== -1) {
          push(line.slice(i, end + 3), "string");
          i = end + 3;
        } else {
          push(line.slice(i), "string");
          break;
        }
        continue;
      }
      // Single/double quoted strings
      if (line[i] === '"' || line[i] === "'") {
        const quote = line[i];
        let j = i + 1;
        while (j < line.length) {
          if (line[j] === "\\" && j + 1 < line.length) { j += 2; continue; }
          if (line[j] === quote) { j++; break; }
          j++;
        }
        push(line.slice(i, j), "string");
        i = j;
        continue;
      }
      // Number
      const numMatch = /^\b\d+\.?\d*\b/.exec(line.slice(i));
      if (numMatch && (i === 0 || /\W/.test(line[i - 1]))) {
        push(numMatch[0], "number");
        i += numMatch[0].length;
        continue;
      }
      // Word
      const wordMatch = /^[a-zA-Z_][a-zA-Z0-9_]*/.exec(line.slice(i));
      if (wordMatch) {
        const word = wordMatch[0];
        const afterWord = i + word.length;
        if (PY_KEYWORDS.has(word)) {
          push(word, "keyword");
        } else if (line[afterWord] === "(") {
          push(word, "func");
        } else {
          push(word, "text");
        }
        i += word.length;
        continue;
      }
      push(line[i], "text");
      i++;
    }
    return tokens;
  }

  if (language === "css") {
    while (i < line.length) {
      // Comment
      if (line[i] === "/" && line[i + 1] === "*") {
        const end = line.indexOf("*/", i + 2);
        if (end !== -1) {
          push(line.slice(i, end + 2), "comment");
          i = end + 2;
        } else {
          push(line.slice(i), "comment");
          break;
        }
        continue;
      }
      // Strings
      if (line[i] === '"' || line[i] === "'") {
        const quote = line[i];
        let j = i + 1;
        while (j < line.length && line[j] !== quote) j++;
        push(line.slice(i, j + 1), "string");
        i = j + 1;
        continue;
      }
      // Hex color or number with unit
      const numMatch = /^#?[0-9a-fA-F]+\.?\d*(%|px|em|rem|vh|vw|s|ms)?/.exec(line.slice(i));
      if (numMatch && (i === 0 || /\W/.test(line[i - 1])) && /\d/.test(numMatch[0])) {
        push(numMatch[0], "number");
        i += numMatch[0].length;
        continue;
      }
      // Property (word before colon)
      const propMatch = /^[a-zA-Z-]+(?=\s*:)/.exec(line.slice(i));
      if (propMatch) {
        push(propMatch[0], "keyword");
        i += propMatch[0].length;
        continue;
      }
      push(line[i], "text");
      i++;
    }
    return tokens;
  }

  if (language === "html") {
    while (i < line.length) {
      // Comment
      if (line.slice(i, i + 4) === "<!--") {
        const end = line.indexOf("-->", i + 4);
        if (end !== -1) {
          push(line.slice(i, end + 3), "comment");
          i = end + 3;
        } else {
          push(line.slice(i), "comment");
          break;
        }
        continue;
      }
      // Tag
      if (line[i] === "<") {
        const tagEnd = line.indexOf(">", i);
        const tagStr = tagEnd !== -1 ? line.slice(i, tagEnd + 1) : line.slice(i);
        // Tokenize inner parts
        push("<", "keyword");
        i++;
        // tag name
        const tagNameMatch = /^\/?\w+/.exec(line.slice(i));
        if (tagNameMatch) {
          push(tagNameMatch[0], "func");
          i += tagNameMatch[0].length;
        }
        const closeIdx = tagEnd !== -1 ? tagEnd : line.length - 1;
        // attrs region
        while (i < closeIdx) {
          // attr string values
          if (line[i] === '"' || line[i] === "'") {
            const q = line[i];
            let j = i + 1;
            while (j < line.length && line[j] !== q) j++;
            push(line.slice(i, j + 1), "string");
            i = j + 1;
            continue;
          }
          // attr name
          const attrMatch = /^[a-zA-Z_:][a-zA-Z0-9_:.-]*/.exec(line.slice(i));
          if (attrMatch) {
            push(attrMatch[0], "type");
            i += attrMatch[0].length;
            continue;
          }
          push(line[i], "text");
          i++;
        }
        if (tagEnd !== -1) {
          push(">", "keyword");
          i = tagEnd + 1;
        }
        continue;
      }
      push(line[i], "text");
      i++;
    }
    return tokens;
  }

  if (language === "json") {
    while (i < line.length) {
      // String keys and values
      if (line[i] === '"') {
        let j = i + 1;
        while (j < line.length) {
          if (line[j] === "\\" && j + 1 < line.length) { j += 2; continue; }
          if (line[j] === '"') { j++; break; }
          j++;
        }
        const str = line.slice(i, j);
        // Determine if it's a key (followed by colon)
        let k = j;
        while (k < line.length && line[k] === " ") k++;
        if (line[k] === ":") {
          push(str, "keyword");
        } else {
          push(str, "string");
        }
        i = j;
        continue;
      }
      // Numbers
      const numMatch = /^-?\d+\.?\d*([eE][+-]?\d+)?/.exec(line.slice(i));
      if (numMatch) {
        push(numMatch[0], "number");
        i += numMatch[0].length;
        continue;
      }
      // Booleans/null
      const boolMatch = /^(true|false|null)/.exec(line.slice(i));
      if (boolMatch) {
        push(boolMatch[0], "func");
        i += boolMatch[0].length;
        continue;
      }
      push(line[i], "text");
      i++;
    }
    return tokens;
  }

  if (language === "sql") {
    while (i < line.length) {
      // Comment --
      if (line[i] === "-" && line[i + 1] === "-") {
        push(line.slice(i), "comment");
        break;
      }
      // String
      if (line[i] === "'" || line[i] === '"') {
        const quote = line[i];
        let j = i + 1;
        while (j < line.length && line[j] !== quote) j++;
        push(line.slice(i, j + 1), "string");
        i = j + 1;
        continue;
      }
      // Number
      const numMatch = /^\b\d+\.?\d*\b/.exec(line.slice(i));
      if (numMatch && (i === 0 || /\W/.test(line[i - 1]))) {
        push(numMatch[0], "number");
        i += numMatch[0].length;
        continue;
      }
      // Keyword
      const wordMatch = /^[a-zA-Z_][a-zA-Z0-9_]*/.exec(line.slice(i));
      if (wordMatch) {
        const word = wordMatch[0];
        if (SQL_KEYWORDS.has(word)) {
          push(word, "keyword");
        } else {
          push(word, "text");
        }
        i += word.length;
        continue;
      }
      push(line[i], "text");
      i++;
    }
    return tokens;
  }

  if (language === "bash") {
    while (i < line.length) {
      // Comment
      if (line[i] === "#") {
        push(line.slice(i), "comment");
        break;
      }
      // String
      if (line[i] === '"' || line[i] === "'") {
        const quote = line[i];
        let j = i + 1;
        while (j < line.length) {
          if (line[j] === "\\" && j + 1 < line.length) { j += 2; continue; }
          if (line[j] === quote) { j++; break; }
          j++;
        }
        push(line.slice(i, j), "string");
        i = j;
        continue;
      }
      push(line[i], "text");
      i++;
    }
    return tokens;
  }

  // "other" and fallback: strings + # // -- comments
  while (i < line.length) {
    if (line[i] === "#" || (line[i] === "/" && line[i + 1] === "/") ||
        (line[i] === "-" && line[i + 1] === "-")) {
      push(line.slice(i), "comment");
      break;
    }
    if (line[i] === '"' || line[i] === "'") {
      const quote = line[i];
      let j = i + 1;
      while (j < line.length && line[j] !== quote) j++;
      push(line.slice(i, j + 1), "string");
      i = j + 1;
      continue;
    }
    push(line[i], "text");
    i++;
  }
  return tokens;
}

// Merge consecutive tokens with the same color key for cleaner output
function mergeTokens(tokens: Token[]): Token[] {
  const merged: Token[] = [];
  for (const t of tokens) {
    if (merged.length > 0 && merged[merged.length - 1].colorKey === t.colorKey) {
      merged[merged.length - 1] = { text: merged[merged.length - 1].text + t.text, colorKey: t.colorKey };
    } else {
      merged.push({ ...t });
    }
  }
  return merged;
}

// ---------------------------------------------------------------------------
// Rounded rect helper
// ---------------------------------------------------------------------------
function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  w: number, h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// ---------------------------------------------------------------------------
// Default code
// ---------------------------------------------------------------------------
const DEFAULT_CODE = `// Paste your code here
const greeting = 'Hello, World!';
console.log(greeting);`;

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function CodeToImagePage() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("dark-plus");
  const [background, setBackground] = useState("gradient-1");
  const [fontSize, setFontSize] = useState(14);
  const [padding, setPadding] = useState(40);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [showWindowChrome, setShowWindowChrome] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colors = THEMES[theme];
    const bg = BACKGROUNDS[background];

    const FONT = `${fontSize}px "Fira Code", "Cascadia Code", "Consolas", monospace`;
    const LINE_HEIGHT = fontSize * 1.6;
    const CHAR_WIDTH = fontSize * 0.6;

    const lines = code.split("\n");
    const lineNumWidth = showLineNumbers
      ? (String(lines.length).length + 1) * CHAR_WIDTH + 12
      : 0;

    // Measure max line length
    ctx.font = FONT;
    let maxLineChars = 0;
    for (const line of lines) {
      if (line.length > maxLineChars) maxLineChars = line.length;
    }

    const contentWidth = Math.max(maxLineChars * CHAR_WIDTH + lineNumWidth, 200);
    const chromeHeight = showWindowChrome ? 44 : 0;

    const innerW = contentWidth + padding * 2;
    const innerH = chromeHeight + padding * 2 + lines.length * LINE_HEIGHT;

    const canvasW = innerW + padding * 2;
    const canvasH = innerH + padding * 2;

    canvas.width = canvasW;
    canvas.height = canvasH;

    // 1. Background
    if (bg.type === "gradient") {
      const grad = ctx.createLinearGradient(0, 0, canvasW, canvasH);
      grad.addColorStop(0, bg.stops[0]);
      grad.addColorStop(1, bg.stops[1]);
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = bg.color;
    }
    ctx.fillRect(0, 0, canvasW, canvasH);

    // 2. Code window (rounded rect)
    const winX = padding;
    const winY = padding;
    roundedRect(ctx, winX, winY, innerW, innerH, 12);
    ctx.fillStyle = colors.bg;
    ctx.fill();

    // 3. Window chrome
    if (showWindowChrome) {
      // Chrome bar
      roundedRect(ctx, winX, winY, innerW, 44, 12);
      // Clip bottom corners of chrome
      ctx.save();
      ctx.beginPath();
      ctx.rect(winX, winY, innerW, 44);
      ctx.clip();
      roundedRect(ctx, winX, winY, innerW, 44, 12);
      ctx.fillStyle = colors.chromeBg;
      ctx.fill();
      ctx.restore();

      // Traffic light dots
      const dotY = winY + 22;
      const dotPositions = [winX + 24, winX + 44, winX + 64];
      const dotColors = ["#ff5f57", "#ffbd2e", "#28c840"];
      for (let d = 0; d < 3; d++) {
        ctx.beginPath();
        ctx.arc(dotPositions[d], dotY, 7, 0, Math.PI * 2);
        ctx.fillStyle = dotColors[d];
        ctx.fill();
      }
    }

    // 4. Code content
    ctx.font = FONT;
    ctx.textBaseline = "middle";

    const codeStartX = winX + padding + lineNumWidth;
    const codeStartY = winY + chromeHeight + padding + LINE_HEIGHT / 2;

    for (let li = 0; li < lines.length; li++) {
      const y = codeStartY + li * LINE_HEIGHT;

      // Line number
      if (showLineNumbers) {
        const lineNumStr = String(li + 1);
        const maxDigits = String(lines.length).length;
        const paddedNum = lineNumStr.padStart(maxDigits, " ");
        ctx.fillStyle = colors.lineNum;
        ctx.textAlign = "right";
        ctx.fillText(paddedNum, winX + padding + lineNumWidth - 8, y);
        ctx.textAlign = "left";
      }

      // Tokenize and draw
      const rawTokens = tokenizeLine(lines[li], language);
      const lineTokens = mergeTokens(rawTokens);
      let x = codeStartX;
      for (const token of lineTokens) {
        ctx.fillStyle = colors[token.colorKey];
        ctx.fillText(token.text, x, y);
        x += ctx.measureText(token.text).width;
      }
    }

    // Convert to preview URL
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    }, "image/png");
  }, [code, language, theme, background, fontSize, padding, showLineNumbers, showWindowChrome]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "code-image.png";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, "image/png");
  }

  // Background swatch color for display
  const bgSwatchStyle = useMemo(() => {
    const bg = BACKGROUNDS[background];
    if (bg.type === "gradient") {
      return { background: `linear-gradient(135deg, ${bg.stops[0]}, ${bg.stops[1]})` };
    }
    return { background: bg.color };
  }, [background]);

  return (
    <ToolShell
      title="Code to Image"
      description="Render your code snippet as a beautiful styled PNG — like carbon.now.sh. Pick a theme, background, and download."
    >
      {/* Hidden canvas for actual rendering */}
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ---- Controls panel ---- */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Code textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Code
            </label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-64 rounded-md border border-border/60 bg-background px-3 py-2 font-mono text-sm leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-primary/30"
              spellCheck={false}
              placeholder="Paste your code here..."
            />
          </div>

          {/* Language + Theme row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full h-9 rounded-md border border-border/60 bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {LANGUAGE_OPTIONS.map((l) => (
                  <option key={l} value={l}>
                    {l.charAt(0).toUpperCase() + l.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Theme
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full h-9 rounded-md border border-border/60 bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {Object.keys(THEMES).map((t) => (
                  <option key={t} value={t}>
                    {THEME_LABELS[t] ?? t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Background row */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Background
            </label>
            <div className="flex gap-2 items-center">
              <div
                className="h-6 w-6 rounded flex-shrink-0 border border-border/40"
                style={bgSwatchStyle}
                aria-hidden="true"
              />
              <select
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                className="flex-1 h-9 rounded-md border border-border/60 bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {Object.keys(BACKGROUNDS).map((b) => (
                  <option key={b} value={b}>
                    {BG_LABELS[b] ?? b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Font size + Padding */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Font Size: {fontSize}px
              </label>
              <input
                type="range"
                min={12}
                max={20}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Padding: {padding}px
              </label>
              <input
                type="range"
                min={24}
                max={64}
                value={padding}
                onChange={(e) => setPadding(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap gap-5">
            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showLineNumbers}
                onChange={(e) => setShowLineNumbers(e.target.checked)}
                className="h-4 w-4 accent-primary rounded"
              />
              Show line numbers
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showWindowChrome}
                onChange={(e) => setShowWindowChrome(e.target.checked)}
                className="h-4 w-4 accent-primary rounded"
              />
              Show window chrome
            </label>
          </div>
        </div>

        {/* ---- Preview panel ---- */}
        <div className="lg:flex-1 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Preview
            </span>
            <Button size="sm" onClick={handleDownload} disabled={!previewUrl}>
              Download PNG
            </Button>
          </div>

          <div className="border border-border/60 rounded-xl overflow-hidden bg-muted/20 flex items-center justify-center min-h-48 p-3">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Code preview"
                className="max-w-full h-auto rounded-lg shadow-md"
                style={{ imageRendering: "auto" }}
              />
            ) : (
              <span className="text-sm text-muted-foreground">Rendering...</span>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            The preview updates automatically as you edit. Click &quot;Download PNG&quot; to save the full-resolution image.
          </p>
        </div>
      </div>
    </ToolShell>
  );
}
