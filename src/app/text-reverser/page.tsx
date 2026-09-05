"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RotateCcw, AlignJustify, AlignLeft, ArrowUpDown, FlipHorizontal, CheckCircle2 } from "lucide-react";

type ModeId =
  | "reverse-chars"
  | "reverse-words"
  | "reverse-lines"
  | "flip-upside-down"
  | "mirror"
  | "palindrome";

const UPSIDE_DOWN: Record<string, string> = {
  a: "ɐ", b: "q", c: "ɔ", d: "p", e: "ə", f: "ɟ", g: "ƃ", h: "ɥ",
  i: "ᴉ", j: "ɾ", k: "ʞ", l: "l", m: "ɯ", n: "u", o: "o", p: "d",
  q: "b", r: "ɹ", s: "s", t: "ʇ", u: "n", v: "ʌ", w: "ʍ", x: "x",
  y: "ʎ", z: "z",
};

const MODES: { id: ModeId; label: string; Icon: React.ElementType }[] = [
  { id: "reverse-chars", label: "Reverse Characters", Icon: RotateCcw },
  { id: "reverse-words", label: "Reverse Words", Icon: AlignJustify },
  { id: "reverse-lines", label: "Reverse Lines", Icon: AlignLeft },
  { id: "flip-upside-down", label: "Flip Upside Down", Icon: ArrowUpDown },
  { id: "mirror", label: "Mirror (Left-Right)", Icon: FlipHorizontal },
  { id: "palindrome", label: "Palindrome Check", Icon: CheckCircle2 },
];

function reverseChars(text: string): string {
  return text.split("").reverse().join("");
}

function reverseWords(text: string): string {
  return text
    .split("\n")
    .map((line) => line.split(" ").reverse().join(" "))
    .join("\n");
}

function reverseLines(text: string): string {
  return text.split("\n").reverse().join("\n");
}

function flipUpsideDown(text: string): string {
  return text
    .split("")
    .map((c) => UPSIDE_DOWN[c] ?? c)
    .reverse()
    .join("");
}

function transform(text: string, mode: ModeId): string {
  switch (mode) {
    case "reverse-chars":
      return reverseChars(text);
    case "reverse-words":
      return reverseWords(text);
    case "reverse-lines":
      return reverseLines(text);
    case "flip-upside-down":
      return flipUpsideDown(text);
    case "mirror":
      return reverseChars(text);
    default:
      return "";
  }
}

function isPalindrome(text: string): boolean {
  const clean = text.toLowerCase().replace(/[^a-z0-9]/g, "");
  return clean.length > 0 && clean === clean.split("").reverse().join("");
}

export default function TextReverserPage() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<ModeId>("reverse-chars");

  const output = transform(input, mode);
  const palindromeResult = isPalindrome(input);

  return (
    <ToolShell
      title="Text Reverser"
      description="Reverse, flip, mirror, or palindrome-check your text — 6 transformation modes applied instantly."
    >
      <div className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Input Text
          </label>
          <Textarea
            rows={6}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to transform..."
            className="font-mono text-[13px] resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
          />
          <p className="text-xs text-muted-foreground">
            {input.length.toLocaleString()} character{input.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Mode
          </label>
          <div className="flex flex-wrap gap-2">
            {MODES.map(({ id, label, Icon }) => (
              <Button
                key={id}
                size="sm"
                variant={mode === id ? "default" : "outline"}
                className="h-8 gap-1.5"
                onClick={() => setMode(id)}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        {mode === "palindrome" ? (
          <div className="flex items-center justify-center py-8">
            {input.trim() ? (
              palindromeResult ? (
                <div className="rounded-xl border border-green-500/40 bg-green-500/10 px-10 py-6 text-center">
                  <p className="text-3xl font-bold tracking-tight text-green-600 dark:text-green-400">
                    YES
                  </p>
                  <p className="mt-1 text-sm font-medium text-green-600/80 dark:text-green-400/80">
                    This is a palindrome
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-muted/40 px-10 py-6 text-center">
                  <p className="text-3xl font-bold tracking-tight text-muted-foreground">
                    NO
                  </p>
                  <p className="mt-1 text-sm font-medium text-muted-foreground/70">
                    Not a palindrome
                  </p>
                </div>
              )
            ) : (
              <p className="text-sm text-muted-foreground">Enter text above to check...</p>
            )}
          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Output
              </label>
              {output && <CopyButton text={output} />}
            </div>
            <Textarea
              readOnly
              rows={6}
              value={output}
              placeholder="Transformed text will appear here..."
              className="font-mono text-[13px] resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
            />
          </div>
        )}
      </div>
    </ToolShell>
  );
}
