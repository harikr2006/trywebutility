"use client";
import { useState, useRef, useEffect } from "react";
import ToolShell from "@/components/shared/ToolShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Plus, Trash2, Send, ChevronDown, ChevronRight, Link2, Copy, Check, Globe, Zap, ShieldCheck, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"] as const;
type Method = (typeof METHODS)[number];

const METHOD_COLORS: Record<string, string> = {
  GET: "text-emerald-600 dark:text-emerald-400",
  POST: "text-blue-600 dark:text-blue-400",
  PUT: "text-amber-600 dark:text-amber-400",
  DELETE: "text-red-600 dark:text-red-400",
  PATCH: "text-violet-600 dark:text-violet-400",
  HEAD: "text-slate-600 dark:text-slate-400",
  OPTIONS: "text-slate-600 dark:text-slate-400",
};

type Header = { key: string; value: string };

type ResponseData = {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  time: number;
  redirected: boolean;
  finalUrl: string;
  originalUrl: string;
  size: number;
};

function encodeState(method: string, url: string, headers: Header[], body: string) {
  try {
    const state = { m: method, u: url, h: headers.filter((h) => h.key), b: body };
    return btoa(encodeURIComponent(JSON.stringify(state)));
  } catch {
    return null;
  }
}

function decodeState(hash: string) {
  try {
    const json = decodeURIComponent(atob(hash.replace(/^#/, "")));
    const state = JSON.parse(json);
    return {
      method: state.m || "GET",
      url: state.u || "",
      headers: state.h || [],
      body: state.b || "",
    };
  } catch {
    return null;
  }
}

export default function HttpTesterPage() {
  const [method, setMethod] = useState<Method>("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState<Header[]>([{ key: "", value: "" }]);
  const [body, setBody] = useState("");
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [headersOpen, setHeadersOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const [sharecopied, setShareCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // Restore state from URL hash on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (!hash || hash === "#") return;
    const state = decodeState(hash);
    if (state) {
      setMethod(state.method as Method);
      setUrl(state.url);
      if (state.headers.length > 0) setHeaders([...state.headers, { key: "", value: "" }]);
      setBody(state.body);
    }
  }, []);

  function addHeader() { setHeaders((prev) => [...prev, { key: "", value: "" }]); }
  function removeHeader(i: number) { setHeaders((prev) => prev.filter((_, idx) => idx !== i)); }
  function updateHeader(i: number, field: "key" | "value", val: string) {
    setHeaders((prev) => prev.map((h, idx) => (idx === i ? { ...h, [field]: val } : h)));
  }

  function statusColor(status: number) {
    if (status >= 200 && status < 300) return "text-emerald-600 dark:text-emerald-400";
    if (status >= 300 && status < 400) return "text-amber-500 dark:text-amber-400";
    if (status >= 400 && status < 500) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  }

  function cancelRequest() {
    abortRef.current?.abort();
    setLoading(false);
    setError("Request cancelled.");
  }

  function buildCurl(): string {
    const parts = [`curl -X ${method} "${url}"`];
    for (const h of headers) {
      if (h.key.trim()) parts.push(`  -H "${h.key.trim()}: ${h.value}"`);
    }
    if (["POST", "PUT", "PATCH"].includes(method) && body.trim()) {
      parts.push(`  -d '${body.replace(/'/g, "\\'")}'`);
    }
    return parts.join(" \\\n");
  }

  function copyCurl() {
    navigator.clipboard.writeText(buildCurl()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function shareUrl() {
    const encoded = encodeState(method, url, headers, body);
    if (!encoded) return;
    const shareLink = `${window.location.origin}/http-tester/#${encoded}`;
    navigator.clipboard.writeText(shareLink).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
      window.history.replaceState(null, "", `/http-tester/#${encoded}`);
    });
  }

  async function sendRequest() {
    if (!url.trim()) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const timeoutId = setTimeout(() => controller.abort(), 30_000);

    setLoading(true);
    setError(null);
    setResponse(null);

    const requestHeaders: Record<string, string> = {};
    for (const h of headers) {
      if (h.key.trim()) requestHeaders[h.key.trim()] = h.value;
    }

    const fetchOptions: RequestInit = {
      method,
      headers: requestHeaders,
      signal: controller.signal,
      redirect: "follow",
    };

    if (["POST", "PUT", "PATCH"].includes(method) && body.trim()) {
      fetchOptions.body = body;
    }

    const start = performance.now();
    try {
      const res = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);
      const time = Math.round(performance.now() - start);

      const responseHeaders: Record<string, string> = {};
      res.headers.forEach((value, key) => { responseHeaders[key] = value; });

      let bodyText = "";
      let size = 0;
      try {
        const buffer = await res.arrayBuffer();
        size = buffer.byteLength;
        bodyText = new TextDecoder().decode(buffer);
        // Pretty-print if JSON
        try { bodyText = JSON.stringify(JSON.parse(bodyText), null, 2); } catch { /* not JSON */ }
      } catch {
        bodyText = "";
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: responseHeaders,
        body: bodyText,
        time,
        redirected: res.redirected,
        finalUrl: res.url,
        originalUrl: url.trim(),
        size,
      });
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("Request timed out or was cancelled.");
      } else if (err instanceof TypeError) {
        setError(
          "Request blocked by CORS policy. The server must send Access-Control-Allow-Origin headers to allow browser requests. Try a public API or enable CORS on your server."
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
      description="Send HTTP requests and inspect status codes, response headers, redirect chains, and body — all from your browser."
    >
      {/* Feature badges */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[
          { icon: Send, label: "7 Methods" },
          { icon: Globe, label: "Redirect Detection" },
          { icon: Link2, label: "Shareable URL" },
          { icon: ShieldCheck, label: "Browser-Only" },
          { icon: Zap, label: "Response Time" },
        ].map(({ icon: Icon, label }) => (
          <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/8 text-primary border border-primary/20">
            <Icon className="h-3 w-3" aria-hidden="true" />
            {label}
          </span>
        ))}
      </div>

      <div className="space-y-4">
        {/* Method + URL */}
        <div className="flex gap-2 flex-wrap">
          <div className="flex gap-1 flex-wrap">
            {METHODS.map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={cn(
                  "h-8 px-3 rounded-md text-xs font-mono font-bold border transition-colors",
                  method === m
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/30 border-border/60 hover:bg-muted/60",
                  method !== m && METHOD_COLORS[m]
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") sendRequest(); }}
            placeholder="https://api.example.com/endpoint"
            className="flex-1 h-9 font-mono rounded-lg border border-border/60 bg-background px-3 text-sm focus:ring-2 focus:ring-primary/30 focus:outline-none min-w-0"
          />
          <Button size="sm" className="h-9 gap-1.5 shrink-0" onClick={sendRequest} disabled={loading || !url.trim()}>
            <Send className="h-3.5 w-3.5" />
            {loading ? "Sending…" : "Send"}
          </Button>
          {loading && (
            <Button size="sm" variant="outline" className="h-9 shrink-0" onClick={cancelRequest}>Cancel</Button>
          )}
        </div>

        {/* Request Headers */}
        <div className="rounded-lg border border-border/60">
          <div className="flex items-center justify-between px-3 py-2 bg-muted/30 rounded-t-lg border-b border-border/60">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Request Headers</span>
            <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs" onClick={addHeader}>
              <Plus className="h-3 w-3" /> Add
            </Button>
          </div>
          <div className="p-2 space-y-1.5">
            {headers.map((header, i) => (
              <div key={i} className="flex gap-2">
                <input type="text" value={header.key} onChange={(e) => updateHeader(i, "key", e.target.value)}
                  placeholder="Key" className="flex-1 h-8 font-mono rounded-md border border-border/60 bg-background px-2 text-xs focus:ring-2 focus:ring-primary/30 focus:outline-none" />
                <input type="text" value={header.value} onChange={(e) => updateHeader(i, "value", e.target.value)}
                  placeholder="Value" className="flex-1 h-8 font-mono rounded-md border border-border/60 bg-background px-2 text-xs focus:ring-2 focus:ring-primary/30 focus:outline-none" />
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive" onClick={() => removeHeader(i)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {showBody && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Request Body</label>
            <Textarea value={body} onChange={(e) => setBody(e.target.value)}
              placeholder='{"key": "value"}'
              className="font-mono text-[13px] min-h-28 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30" />
          </div>
        )}

        {/* Action row */}
        {url.trim() && (
          <div className="flex gap-2 flex-wrap">
            <button onClick={copyCurl}
              className="inline-flex items-center gap-1.5 h-7 px-3 rounded-md text-xs font-medium border border-border/60 bg-muted/30 hover:bg-muted/60 transition-colors">
              {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied!" : "Copy as cURL"}
            </button>
            <button onClick={shareUrl}
              className="inline-flex items-center gap-1.5 h-7 px-3 rounded-md text-xs font-medium border border-border/60 bg-muted/30 hover:bg-muted/60 transition-colors">
              {sharecopied ? <Check className="h-3 w-3 text-emerald-500" /> : <Link2 className="h-3 w-3" />}
              {sharecopied ? "Link copied!" : "Share request"}
            </button>
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
            {/* Status bar */}
            <div className="flex items-center gap-3 px-4 py-2.5 bg-muted/30 border-b border-border/60 flex-wrap">
              <span className={cn("text-sm font-bold font-mono", statusColor(response.status))}>
                {response.status} {response.statusText}
              </span>
              <span className="text-xs text-muted-foreground">{response.time} ms</span>
              {response.size > 0 && (
                <span className="text-xs text-muted-foreground">
                  {response.size < 1024 ? `${response.size} B` : `${(response.size / 1024).toFixed(1)} KB`}
                </span>
              )}
              {response.headers["content-type"] && (
                <span className="font-mono text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground">
                  {response.headers["content-type"].split(";")[0]}
                </span>
              )}
            </div>

            {/* Redirect chain */}
            {response.redirected && response.finalUrl !== response.originalUrl && (
              <div className="px-4 py-2.5 bg-amber-50/60 dark:bg-amber-950/20 border-b border-amber-200/60 dark:border-amber-800/40 text-xs">
                <p className="font-semibold text-amber-700 dark:text-amber-400 mb-1.5">Redirected</p>
                <div className="flex items-center gap-1.5 flex-wrap font-mono text-[11px] text-muted-foreground">
                  <span className="truncate max-w-[240px]">{response.originalUrl}</span>
                  <ArrowRight className="h-3 w-3 shrink-0 text-amber-500" />
                  <span className="truncate max-w-[240px] text-foreground">{response.finalUrl}</span>
                </div>
              </div>
            )}

            {/* Response headers */}
            <div className="border-b border-border/60">
              <button type="button"
                className="flex w-full items-center gap-2 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:bg-muted/20 transition-colors"
                onClick={() => setHeadersOpen((o) => !o)}>
                {headersOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                Response Headers
                <span className="ml-auto font-normal normal-case tracking-normal">
                  {Object.keys(response.headers).length} headers
                </span>
              </button>
              {headersOpen && (
                <div className="px-4 pb-3 space-y-0.5 font-mono text-xs">
                  {Object.entries(response.headers).map(([k, v]) => (
                    <div key={k} className="flex gap-2 py-0.5 border-b border-border/20 last:border-0">
                      <span className="text-primary/70 shrink-0 min-w-[180px]">{k}:</span>
                      <span className="break-all text-foreground/80">{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Response body */}
            <div className="p-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Response Body</p>
              <pre className="font-mono text-xs overflow-auto max-h-96 rounded-md bg-muted/30 p-3 border border-border/40 whitespace-pre-wrap break-all">
                {response.body || "(empty body)"}
              </pre>
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
