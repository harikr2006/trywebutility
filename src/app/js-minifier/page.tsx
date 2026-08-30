"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { minifyJs } from "@/lib/tools/js-minifier";

const DEFAULT_INPUT = `// Fetch user data from the API
async function fetchUser(id) {
  /* Make an HTTP request to retrieve the user */
  const response = await fetch(\`https://api.example.com/users/\${id}\`);
  const data = await response.json();
  return data;
}

// Format and display the user
function displayUser(user) {
  const name = user.name || "Unknown";
  const email = user.email || "No email";
  console.log("Name: " + name + ", Email: " + email);
}`;

export default function JsMinifierPage() {
  const [input, setInput] = useState(DEFAULT_INPUT);
  const [result, setResult] = useState<ReturnType<typeof minifyJs> | null>(null);

  function handleMinify() {
    setResult(minifyJs(input));
  }

  function handleClear() {
    setInput("");
    setResult(null);
  }

  const reduction =
    result && result.originalBytes > 0
      ? Math.round((1 - result.minifiedBytes / result.originalBytes) * 100)
      : 0;

  return (
    <ToolShell
      title="JavaScript Minifier"
      description="Remove comments and collapse whitespace from JavaScript code. Basic minification — not AST-based."
    >
      <div className="flex flex-col gap-4">
        {/* Note banner */}
        <div className="flex gap-2 rounded-lg border border-amber-400/40 bg-amber-400/8 p-3 text-sm text-amber-700 dark:text-amber-400">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>
            Note: This is basic comment/whitespace removal. For production use, consider{" "}
            <a
              href="https://terser.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 font-medium"
            >
              Terser
            </a>{" "}
            or{" "}
            <a
              href="https://esbuild.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 font-medium"
            >
              esbuild
            </a>
            .
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" className="h-8" onClick={handleMinify}>
            Minify
          </Button>
          <Button size="sm" className="h-8" variant="ghost" onClick={handleClear}>
            Clear
          </Button>
        </div>

        {result?.error && (
          <div className="flex gap-2 rounded-lg border border-destructive/40 bg-destructive/8 p-3 text-sm text-destructive font-mono">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{result.error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center h-7">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Input
              </label>
            </div>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste JavaScript code here..."
              className="font-mono text-[13px] min-h-72 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between h-7">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Output
              </label>
              {result?.output && <CopyButton text={result.output} />}
            </div>
            <Textarea
              value={result?.output ?? ""}
              readOnly
              placeholder="Minified code will appear here..."
              className="font-mono text-[13px] min-h-72 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
            />
          </div>
        </div>

        {result && result.originalBytes > 0 && (
          <div className="rounded-lg border border-border/60 bg-muted/20 px-4 py-2.5 text-sm font-mono text-muted-foreground">
            Original:{" "}
            <span className="text-foreground font-semibold">
              {result.originalBytes.toLocaleString()} bytes
            </span>{" "}
            &rarr; Minified:{" "}
            <span className="text-foreground font-semibold">
              {result.minifiedBytes.toLocaleString()} bytes
            </span>{" "}
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              ({reduction}% reduction)
            </span>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
