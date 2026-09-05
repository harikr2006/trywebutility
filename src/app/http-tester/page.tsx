"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Plus, Trash2, Send, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"] as const;
type Method = (typeof METHODS)[number];

type Header = { key: string; value: string };

type ResponseData = {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  time: number;
};

export default function HttpTesterPage() {
  const [method, setMethod] = useState<Method>("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState<Header[]>([{ key: "", value: "" }]);
  const [body, setBody] = useState("");
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [headersOpen, setHeadersOpen] = useState(false);

  function addHeader() {
    setHeaders((prev) => [...prev, { key: "", value: "" }]);
  }

  function removeHeader(index: number) {
    setHeaders((prev) => prev.filter((_, i) => i !== index));
  }

  function updateHeader(index: number, field: "key" | "value", val: string) {
    setHeaders((prev) =>
      prev.map((h, i) => (i === index ? { ...h, [field]: val } : h))
    );
  }

  function statusColor(status: number) {
    if (status >= 200 && status < 300) return "text-green-600";
    if (status >= 300 && status < 400) return "text-yellow-500";
    return "text-red-500";
  }

  async function sendRequest() {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setResponse(null);

    const requestHeaders: Record<string, string> = {};
    for (const h of headers) {
      if (h.key.trim()) requestHeaders[h.key.trim()] = h.value;
    }

    const fetchOptions: RequestInit = { method, headers: requestHeaders };

    if (["POST", "PUT", "PATCH"].includes(method) && body.trim()) {
      fetchOptions.body = body;
    }

    const start = performance.now();
    try {
      const res = await fetch(url, fetchOptions);
      const time = Math.round(performance.now() - start);

      const responseHeaders: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      let bodyText = "";
      try {
        const json = await res.json();
        bodyText = JSON.stringify(json, null, 2);
      } catch {
        bodyText = await res.text();
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: responseHeaders,
        body: bodyText,
        time,
      });
    } catch (err) {
      if (err instanceof TypeError) {
        setError(
          "Request blocked by CORS policy. The server must include Access-Control-Allow-Origin headers to allow browser requests."
        );
      } else {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }

  const showBody = ["POST", "PUT", "PATCH"].includes(method);

  return (
    <ToolShell
      title="HTTP Request Tester"
      description="Send HTTP requests directly from your browser using fetch. Test REST APIs, inspect responses, and debug endpoints."
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-1">
          {METHODS.map((m) => (
            <Button
              key={m}
              size="sm"
              className="h-8 font-mono"
              variant={method === m ? "default" : "outline"}
              onClick={() => setMethod(m)}
            >
              {m}
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendRequest();
            }}
            placeholder="https://api.example.com/endpoint"
            className="flex-1 h-9 font-mono rounded-lg border border-border/60 bg-background px-3 text-sm focus:ring-2 focus:ring-primary/30 focus:outline-none"
          />
          <Button
            size="sm"
            className="h-9 gap-1.5"
            onClick={sendRequest}
            disabled={loading || !url.trim()}
          >
            <Send className="h-3.5 w-3.5" />
            {loading ? "Sending…" : "Send"}
          </Button>
        </div>

        <div className="rounded-lg border border-border/60">
          <div className="flex items-center justify-between px-3 py-2 bg-muted/30 rounded-t-lg border-b border-border/60">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Headers
            </span>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 gap-1 text-xs"
              onClick={addHeader}
            >
              <Plus className="h-3 w-3" />
              Add Header
            </Button>
          </div>
          <div className="p-2 space-y-1.5">
            {headers.map((header, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={header.key}
                  onChange={(e) => updateHeader(i, "key", e.target.value)}
                  placeholder="Key"
                  className="flex-1 h-8 font-mono rounded-md border border-border/60 bg-background px-2 text-xs focus:ring-2 focus:ring-primary/30 focus:outline-none"
                />
                <input
                  type="text"
                  value={header.value}
                  onChange={(e) => updateHeader(i, "value", e.target.value)}
                  placeholder="Value"
                  className="flex-1 h-8 font-mono rounded-md border border-border/60 bg-background px-2 text-xs focus:ring-2 focus:ring-primary/30 focus:outline-none"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  onClick={() => removeHeader(i)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {showBody && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Request Body (JSON)
            </label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder='{"key": "value"}'
              className="font-mono text-[13px] min-h-28 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30"
            />
          </div>
        )}

        {error && (
          <div className="flex gap-2 rounded-lg border border-destructive/40 bg-destructive/8 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {response && (
          <div className="rounded-lg border border-border/60 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-2.5 bg-muted/30 border-b border-border/60">
              <span
                className={cn(
                  "text-sm font-bold font-mono",
                  statusColor(response.status)
                )}
              >
                {response.status} {response.statusText}
              </span>
              <span className="text-xs text-muted-foreground">
                {response.time} ms
              </span>
            </div>

            <div className="border-b border-border/60">
              <button
                type="button"
                className="flex w-full items-center gap-2 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:bg-muted/20 transition-colors"
                onClick={() => setHeadersOpen((o) => !o)}
              >
                {headersOpen ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
                Response Headers
              </button>
              {headersOpen && (
                <div className="px-4 pb-3 space-y-0.5 font-mono text-xs">
                  {Object.entries(response.headers).map(([k, v]) => (
                    <div key={k} className="flex gap-2">
                      <span className="text-muted-foreground shrink-0">{k}:</span>
                      <span className="break-all">{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Response Body
              </p>
              <pre className="font-mono text-xs overflow-auto max-h-96 rounded-md bg-muted/30 p-3 border border-border/40 whitespace-pre-wrap break-all">
                {response.body || "(empty)"}
              </pre>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
