"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { toFetch, toAxios, toPython, toGo } from "@/lib/tools/curl-to-code";

type Lang = "fetch" | "axios" | "python" | "go";

const TABS: { id: Lang; label: string }[] = [
  { id: "fetch", label: "JS Fetch" },
  { id: "axios", label: "Axios" },
  { id: "python", label: "Python" },
  { id: "go", label: "Go" },
];

const DEFAULT_CURL = `curl -X POST https://api.example.com/users -H "Content-Type: application/json" -d '{"name":"Alice"}'`;

function convert(lang: Lang, input: string): { output: string; error: string | null } {
  if (!input.trim()) return { output: "", error: null };
  if (lang === "fetch") return toFetch(input);
  if (lang === "axios") return toAxios(input);
  if (lang === "python") return toPython(input);
  return toGo(input);
}

export default function CurlToCodePage() {
  const [input, setInput] = useState(DEFAULT_CURL);
  const [activeTab, setActiveTab] = useState<Lang>("fetch");

  const { output, error } = convert(activeTab, input);

  function handleInput(value: string) {
    setInput(value);
  }

  function clear() {
    setInput("");
  }

  return (
    <ToolShell
      title="cURL to Code"
      description="Convert a cURL command to JavaScript fetch, Axios, Python requests, or Go."
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between h-7">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              cURL Command
            </label>
            <Button size="sm" className="h-8" variant="ghost" onClick={clear}>
              Clear
            </Button>
          </div>
          <Textarea
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            placeholder="curl https://api.example.com/data"
            className="font-mono text-[13px] min-h-28 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
          />
        </div>

        {error && (
          <div className="flex gap-2 rounded-lg border border-destructive/40 bg-destructive/8 p-3 text-sm text-destructive font-mono">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1 flex-wrap">
              {TABS.map((tab) => (
                <Button
                  key={tab.id}
                  size="sm"
                  className="h-8"
                  variant={activeTab === tab.id ? "default" : "outline"}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </Button>
              ))}
            </div>
            {output && <CopyButton text={output} />}
          </div>
          <Textarea
            value={output}
            readOnly
            placeholder="Generated code will appear here..."
            className="font-mono text-[13px] min-h-72 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
          />
        </div>
      </div>
    </ToolShell>
  );
}
