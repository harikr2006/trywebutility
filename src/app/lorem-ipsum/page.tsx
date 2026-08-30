"use client";
import { useState, useEffect } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  generateWords,
  generateSentences,
  generateParagraphs,
} from "@/lib/tools/lorem-ipsum";

type LoremType = "words" | "sentences" | "paragraphs";

const TYPE_OPTIONS: { value: LoremType; label: string }[] = [
  { value: "words", label: "Words" },
  { value: "sentences", label: "Sentences" },
  { value: "paragraphs", label: "Paragraphs" },
];

const LOREM_START =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";

export default function LoremIpsumPage() {
  const [type, setType] = useState<LoremType>("paragraphs");
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState("");
  const [startWithLorem, setStartWithLorem] = useState(true);

  function generate(
    t: LoremType = type,
    c: number = count,
    lorem: boolean = startWithLorem
  ) {
    let result = "";
    if (t === "words") result = generateWords(c);
    else if (t === "sentences") result = generateSentences(c);
    else result = generateParagraphs(c);

    if (lorem && result) {
      result = LOREM_START + result;
    }
    setOutput(result);
  }

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ToolShell
      title="Lorem Ipsum Generator"
      description="Generate placeholder Latin text for layouts, mockups, and design prototypes."
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Type toggle */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Type
            </label>
            <div className="flex gap-1">
              {TYPE_OPTIONS.map(({ value, label }) => (
                <Button
                  key={value}
                  size="sm"
                  className="h-8"
                  variant={type === value ? "default" : "outline"}
                  onClick={() => setType(value)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Count input */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Count
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) =>
                setCount(Math.max(1, Math.min(100, Number(e.target.value))))
              }
              className="h-8 w-16 rounded-md border border-border/60 bg-background px-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <Button
            size="sm"
            className="h-8"
            onClick={() => generate(type, count, startWithLorem)}
          >
            Generate
          </Button>
        </div>

        {/* Start with Lorem checkbox */}
        <label className="flex cursor-pointer items-center gap-2 text-sm select-none">
          <input
            type="checkbox"
            checked={startWithLorem}
            onChange={(e) => setStartWithLorem(e.target.checked)}
            className="accent-primary h-3.5 w-3.5"
          />
          <span>Start with &ldquo;Lorem ipsum...&rdquo;</span>
        </label>

        {/* Output */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between h-7">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Output
            </label>
            <CopyButton text={output} />
          </div>
          <Textarea
            value={output}
            readOnly
            className="font-mono text-[13px] min-h-64 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
          />
        </div>
      </div>
    </ToolShell>
  );
}

