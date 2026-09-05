"use client";
import { useState, useMemo } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";

// ── BIG font (6 rows, classic block letters) ──────────────────────────────────
const BIG: Record<string, string[]> = {
  A: [" ████ ", "██  ██", "██████", "██  ██", "██  ██", "      "],
  B: ["█████ ", "██  ██", "█████ ", "██  ██", "█████ ", "      "],
  C: [" ████ ", "██    ", "██    ", "██    ", " ████ ", "      "],
  D: ["█████ ", "██  ██", "██  ██", "██  ██", "█████ ", "      "],
  E: ["██████", "██    ", "████  ", "██    ", "██████", "      "],
  F: ["██████", "██    ", "████  ", "██    ", "██    ", "      "],
  G: [" ████ ", "██    ", "██ ███", "██  ██", " █████", "      "],
  H: ["██  ██", "██  ██", "██████", "██  ██", "██  ██", "      "],
  I: ["██████", "  ██  ", "  ██  ", "  ██  ", "██████", "      "],
  J: ["██████", "   ██ ", "   ██ ", "██ ██ ", " ███  ", "      "],
  K: ["██  ██", "██ ██ ", "████  ", "██ ██ ", "██  ██", "      "],
  L: ["██    ", "██    ", "██    ", "██    ", "██████", "      "],
  M: ["██   ██", "███ ███", "███████", "██ █ ██", "██   ██", "       "],
  N: ["██   ██", "███  ██", "████ ██", "██ ████", "██  ███", "       "],
  O: [" ████ ", "██  ██", "██  ██", "██  ██", " ████ ", "      "],
  P: ["█████ ", "██  ██", "█████ ", "██    ", "██    ", "      "],
  Q: [" ████ ", "██  ██", "██  ██", "██ ███", " ██ ██", "      "],
  R: ["█████ ", "██  ██", "█████ ", "██ ██ ", "██  ██", "      "],
  S: [" ████ ", "██    ", " ████ ", "    ██", " ████ ", "      "],
  T: ["██████", "  ██  ", "  ██  ", "  ██  ", "  ██  ", "      "],
  U: ["██  ██", "██  ██", "██  ██", "██  ██", " ████ ", "      "],
  V: ["██  ██", "██  ██", "██  ██", " ████ ", "  ██  ", "      "],
  W: ["██   ██", "██   ██", "██ █ ██", "███ ███", "██   ██", "       "],
  X: ["██  ██", " ████ ", "  ██  ", " ████ ", "██  ██", "      "],
  Y: ["██  ██", "██  ██", " ████ ", "  ██  ", "  ██  ", "      "],
  Z: ["██████", "   ██ ", "  ██  ", " ██   ", "██████", "      "],
  "0": [" ████ ", "██  ██", "██ ███", "███ ██", " ████ ", "      "],
  "1": ["  ██  ", " ███  ", "  ██  ", "  ██  ", "██████", "      "],
  "2": [" ████ ", "    ██", "  ███ ", " ██   ", "██████", "      "],
  "3": [" ████ ", "    ██", "  ███ ", "    ██", " ████ ", "      "],
  "4": ["██  ██", "██  ██", "██████", "    ██", "    ██", "      "],
  "5": ["██████", "██    ", "█████ ", "    ██", "█████ ", "      "],
  "6": [" ████ ", "██    ", "█████ ", "██  ██", " ████ ", "      "],
  "7": ["██████", "    ██", "   ██ ", "  ██  ", "  ██  ", "      "],
  "8": [" ████ ", "██  ██", " ████ ", "██  ██", " ████ ", "      "],
  "9": [" ████ ", "██  ██", " █████", "    ██", " ████ ", "      "],
  " ": ["      ", "      ", "      ", "      ", "      ", "      "],
  "!": ["  ██  ", "  ██  ", "  ██  ", "      ", "  ██  ", "      "],
  "?": [" ████ ", "    ██", "  ███ ", "      ", "  ██  ", "      "],
  ".": ["      ", "      ", "      ", "      ", "  ██  ", "      "],
  ",": ["      ", "      ", "      ", "  ██  ", "  ██  ", " ██   "],
  "-": ["      ", "      ", "██████", "      ", "      ", "      "],
  "_": ["      ", "      ", "      ", "      ", "██████", "      "],
  ":": ["  ██  ", "      ", "      ", "      ", "  ██  ", "      "],
  "+": ["      ", "  ██  ", "██████", "  ██  ", "      ", "      "],
  "@": [" ████ ", "██  ██", "██ ███", "██    ", " █████", "      "],
  "#": [" ██ ██", "██████", " ██ ██", "██████", " ██ ██", "      "],
  "&": [" ███  ", "██  ██", " ███ █", "██  ██", " ███ █", "      "],
  "*": ["██ ██ ", " ███  ", "██████", " ███  ", "██ ██ ", "      "],
  "(": ["  ███ ", " ██   ", " ██   ", " ██   ", "  ███ ", "      "],
  ")": [" ███  ", "   ██ ", "   ██ ", "   ██ ", " ███  ", "      "],
  "/": ["    ██", "   ██ ", "  ██  ", " ██   ", "██    ", "      "],
  "\\": ["██    ", " ██   ", "  ██  ", "   ██ ", "    ██", "      "],
  "=": ["      ", "██████", "      ", "██████", "      ", "      "],
  "<": ["   ███", " ███  ", "██    ", " ███  ", "   ███", "      "],
  ">": ["███   ", "  ███ ", "    ██", "  ███ ", "███   ", "      "],
};

// ── BANNER font (1-row, simpler pipe/dash art) ────────────────────────────────
const BANNER_MAP: Record<string, string> = {
  A: "/-\\", B: "|3", C: "(",  D: "|)", E: "=", F: "F", G: "G",
  H: "|-|", I: "|", J: "_|", K: "|<", L: "|_", M: "|V|", N: "|\\|",
  O: "()", P: "|°", Q: "(_)", R: "|2", S: "$", T: "-|-", U: "|_|",
  V: "\\/", W: "\\/\\/", X: "><", Y: "Y", Z: "2",
  "0": "(0)", "1": "1", "2": "2", "3": "3", "4": "4",
  "5": "5", "6": "6", "7": "7", "8": "8", "9": "9",
  " ": "  ", "!": "!", "?": "?", ".": ".", ",": ",",
  "-": "-", "_": "_", ":": ":", "+": "+", "@": "@",
};

// ── BLOCK font (double-width unicode blocks) ──────────────────────────────────
function blockFont(text: string): string {
  return text
    .toUpperCase()
    .split("")
    .map((c) => (c === " " ? "   " : `[${c}]`))
    .join("");
}

// ── BUBBLE font (circled letters) ─────────────────────────────────────────────
const BUBBLE_UPPER = "ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ";
const BUBBLE_LOWER = "ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ";
function bubbleFont(text: string): string {
  return text.split("").map((c) => {
    const u = c.toUpperCase();
    const idx = u.charCodeAt(0) - 65;
    if (idx >= 0 && idx < 26) {
      return c === u ? BUBBLE_UPPER[idx] : BUBBLE_LOWER[idx];
    }
    const d = c.charCodeAt(0) - 48;
    if (d >= 0 && d <= 9) return ["⓪","①","②","③","④","⑤","⑥","⑦","⑧","⑨"][d];
    return c;
  }).join("");
}

// ── DIGITAL font (7-segment style) ───────────────────────────────────────────
const DIGITAL: Record<string, string[]> = {
  "0": [" _ ", "| |", "|_|"],
  "1": ["   ", "  |", "  |"],
  "2": [" _ ", " _|", "|_ "],
  "3": [" _ ", " _|", " _|"],
  "4": ["   ", "|_|", "  |"],
  "5": [" _ ", "|_ ", " _|"],
  "6": [" _ ", "|_ ", "|_|"],
  "7": [" _ ", "  |", "  |"],
  "8": [" _ ", "|_|", "|_|"],
  "9": [" _ ", "|_|", " _|"],
  "A": [" _ ", "|_|", "| |"],
  "B": ["   ", "|_ ", "|_|"],
  "C": [" _ ", "|  ", "|_ "],
  "D": ["   ", " _|", "|_|"],
  "E": [" _ ", "|_ ", "|_ "],
  "F": [" _ ", "|_ ", "|  "],
  "G": [" _ ", "|_ ", "|_|"],
  "H": ["   ", "|_|", "| |"],
  "I": [" _ ", " | ", " _ "],
  "J": ["   ", "  |", "|_|"],
  "K": ["   ", "|<|", "|< "],
  "L": ["   ", "|  ", "|_ "],
  "M": ["   ", "| |", "| |"],
  "N": ["   ", "|\\|", "| |"],
  "O": [" _ ", "| |", "|_|"],
  "P": [" _ ", "|_ ", "|  "],
  "Q": [" _ ", "| |", " _|"],
  "R": ["   ", "|_ ", "|  "],
  "S": [" _ ", "|_ ", " _|"],
  "T": [" _ ", " | ", " | "],
  "U": ["   ", "| |", "|_|"],
  "V": ["   ", "\\ /", " V "],
  "W": ["   ", "| |", "|_|"],
  "X": ["   ", " X ", "/ \\"],
  "Y": ["   ", "|_|", "  |"],
  "Z": [" _ ", " _|", "|_ "],
  " ": ["   ", "   ", "   "],
};
function digitalFont(text: string): string {
  const rows = 3;
  const lines: string[] = Array(rows).fill("");
  for (const ch of text.toUpperCase()) {
    const segs = DIGITAL[ch] ?? ["   ", " ? ", "   "];
    for (let r = 0; r < rows; r++) lines[r] += segs[r] + " ";
  }
  return lines.join("\n");
}

// ── SLANT font (italicized big letters, simple approximation) ─────────────────
const SLANT: Record<string, string[]> = {
  A: ["  /\\  ", " /  \\ ", "/____\\", "/    \\"],
  B: ["|¯¯\\ ", "|__/ ", "|   \\", "|__/ "],
  C: [" /¯¯", "/    ", "\\    ", " \\__/"],
  D: ["|¯\\ ", "|  )", "|  )", "|_/ "],
  E: ["|¯¯¯", "|___", "|   ", "|___"],
  F: ["|¯¯¯", "|___", "|   ", "|   "],
  G: [" /¯¯", "/    ", "| __)", "\\__/"],
  H: ["|  |", "|__|", "|  |", "|  |"],
  I: [" ¯|¯ ", "  |  ", "  |  ", " _|_ "],
  J: ["  ¯|", "   |", "\\  |", " \\_|"],
  K: ["|  /", "| / ", "|<  ", "| \\ "],
  L: ["|   ", "|   ", "|   ", "|___"],
  M: ["|\\  /|", "| \\/ |", "|    |", "|    |"],
  N: ["|\\  |", "| \\ |", "|  \\|", "|   |"],
  O: [" /¯\\ ", "/   \\", "|   |", "\\___/"],
  P: ["|¯¯\\ ", "|__/ ", "|    ", "|    "],
  Q: [" /¯\\ ", "/   \\", "| Q )", "\\__\\/"],
  R: ["|¯¯\\ ", "|__/ ", "| \\  ", "|  \\ "],
  S: [" /¯¯", "\\__  ", "    )", "\\__/ "],
  T: ["¯¯|¯¯", "  |  ", "  |  ", "  |  "],
  U: ["|  |", "|  |", "|  |", "\\__/"],
  V: ["\\  /", " \\/ ", "  \\ ", "  \\  "],
  W: ["|    |", "| \\/ |", "| /\\ |", "|/  \\|"],
  X: ["\\  /", " \\/ ", " /\\ ", "/  \\"],
  Y: ["\\  /", " \\/ ", "  | ", "  | "],
  Z: ["¯¯¯/", "  / ", " /  ", "/___"],
  " ": ["    ", "    ", "    ", "    "],
  "0": [" /¯\\ ", "/   \\", "|   |", "\\___/"],
  "1": ["  /  ", " //  ", " /   ", "/____"],
  "2": [" /¯\\ ", "   / ", "  /  ", " /___"],
  "3": [" /¯\\ ", "  ¯/ ", "   \\", "\\__/ "],
  "4": ["|   |", "|___|", "    |", "    |"],
  "5": ["|¯¯¯ ", "|___ ", "    \\", "\\___/"],
  "6": [" /¯¯ ", "/    ", "|\\__/", "\\___/"],
  "7": ["¯¯¯/ ", "   / ", "  /  ", " /   "],
  "8": [" /¯\\ ", "|___|", "|   |", "\\___/"],
  "9": [" /¯\\ ", "|___/", "    |", " ___/"],
};

function renderBig(text: string): string {
  const chars = text.toUpperCase().split("");
  const rows = 6;
  const lines: string[] = Array(rows).fill("");
  for (const ch of chars) {
    const glyph = BIG[ch] ?? BIG["?"] ?? Array(rows).fill("  ? ");
    for (let r = 0; r < rows; r++) {
      lines[r] += (glyph[r] ?? "      ") + " ";
    }
  }
  return lines.join("\n");
}

function renderBanner(text: string): string {
  const upper = text.toUpperCase();
  const top    = upper.split("").map(() => "####").join("#");
  const middle = upper.split("").map((c) => BANNER_MAP[c] ?? c).join(" ");
  const bottom = upper.split("").map(() => "####").join("#");
  return `${top}\n  ${middle}  \n${bottom}`;
}

function renderSlant(text: string): string {
  const chars = text.toUpperCase().split("");
  const rows = 4;
  const lines: string[] = Array(rows).fill("");
  for (const ch of chars) {
    const glyph = SLANT[ch] ?? SLANT[" "] ?? Array(rows).fill("    ");
    for (let r = 0; r < rows; r++) {
      lines[r] += (glyph[r] ?? "    ") + " ";
    }
  }
  return lines.join("\n");
}

type FontKey = "Big" | "Banner" | "Block" | "Bubble" | "Digital" | "Slant";

const FONTS: { key: FontKey; label: string }[] = [
  { key: "Big", label: "Big" },
  { key: "Banner", label: "Banner" },
  { key: "Block", label: "Block" },
  { key: "Bubble", label: "Bubble" },
  { key: "Digital", label: "Digital" },
  { key: "Slant", label: "Slant" },
];

function renderFont(text: string, font: FontKey): string {
  if (!text.trim()) return "";
  switch (font) {
    case "Big":     return renderBig(text);
    case "Banner":  return renderBanner(text);
    case "Block":   return blockFont(text);
    case "Bubble":  return bubbleFont(text);
    case "Digital": return digitalFont(text);
    case "Slant":   return renderSlant(text);
    default:        return text;
  }
}

export default function AsciiArtPage() {
  const [text, setText] = useState("HELLO");
  const [font, setFont] = useState<FontKey>("Big");

  const output = useMemo(() => renderFont(text, font), [text, font]);
  const width = output ? Math.max(...output.split("\n").map((l) => l.length)) : 0;

  return (
    <ToolShell
      title="ASCII Art Generator"
      description="Convert text into ASCII art using classic font styles. Choose Big, Banner, Block, Bubble, Digital, or Slant."
    >
      <div className="space-y-5">
        {/* Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Text</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 30))}
            placeholder="Type text (max 30 chars)..."
            className="w-full rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Font selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Font Style</label>
          <div className="flex flex-wrap gap-2">
            {FONTS.map(({ key, label }) => (
              <Button
                key={key}
                variant={font === key ? "default" : "outline"}
                size="sm"
                onClick={() => setFont(key)}
                className="text-xs"
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Output — {font} Font
            </label>
            <div className="flex items-center gap-3">
              {width > 0 && (
                <span className="text-xs text-muted-foreground">Width: {width} chars</span>
              )}
              <CopyButton text={output} />
            </div>
          </div>
          <pre
            className="rounded-lg border bg-muted/30 p-4 overflow-x-auto text-[13px] leading-tight font-mono text-foreground min-h-20 whitespace-pre"
            style={{ fontFamily: "Courier New, Courier, monospace" }}
          >
            {output || <span className="text-muted-foreground italic">Type text above to generate ASCII art…</span>}
          </pre>
        </div>

        {/* Tips */}
        <p className="text-xs text-muted-foreground">
          Tip: Big and Banner fonts support A–Z, 0–9, and common symbols. Bubble uses Unicode circle letters. Digital simulates a 7-segment display.
        </p>
      </div>
    </ToolShell>
  );
}
