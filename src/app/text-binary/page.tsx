"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import { textToBinary, binaryToText } from "@/lib/tools/text-binary";

export default function TextBinaryPage() {
  const [text, setText] = useState("Hello");
  const [binary, setBinary] = useState("");
  const [binaryInput, setBinaryInput] = useState("");
  const [textOutput, setTextOutput] = useState("");
  const [error1, setError1] = useState("");
  const [error2, setError2] = useState("");

  function handleTextChange(val: string) {
    setText(val);
    const { output, error } = textToBinary(val);
    setBinary(output);
    setError1(error ?? "");
  }

  function handleBinaryChange(val: string) {
    setBinaryInput(val);
    const { output, error } = binaryToText(val);
    setTextOutput(output);
    setError2(error ?? "");
  }

  return (
    <ToolShell title="Text ↔ Binary" description="Convert text to binary (0s and 1s) and back. Each character is 8 bits.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Text → Binary</h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center h-7">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Input Text</label>
            </div>
            <Textarea
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Type text here..."
              className="font-mono text-[13px] min-h-36 resize-y bg-muted/30 border-border/60"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between h-7">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Binary Output</label>
              <CopyButton text={binary} />
            </div>
            {error1 ? (
              <div className="flex gap-2 text-sm text-destructive"><AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /><span>{error1}</span></div>
            ) : (
              <Textarea readOnly value={binary} className="font-mono text-[13px] min-h-36 bg-muted/30 border-border/60 break-all" />
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Binary → Text</h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center h-7">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Binary Input (space-separated bytes)</label>
            </div>
            <Textarea
              value={binaryInput}
              onChange={(e) => handleBinaryChange(e.target.value)}
              placeholder="01001000 01100101 01101100 01101100 01101111"
              className="font-mono text-[13px] min-h-36 resize-y bg-muted/30 border-border/60"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between h-7">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Text Output</label>
              <CopyButton text={textOutput} />
            </div>
            {error2 ? (
              <div className="flex gap-2 text-sm text-destructive"><AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /><span>{error2}</span></div>
            ) : (
              <Textarea readOnly value={textOutput} className="font-mono text-[13px] min-h-36 bg-muted/30 border-border/60" />
            )}
          </div>
        </div>
      </div>
    </ToolShell>
  );
}
