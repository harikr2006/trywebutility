"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"];
const COMMON_HEADERS = [
  "Content-Type",
  "Authorization",
  "X-Requested-With",
  "Accept",
  "Origin",
  "Cache-Control",
];

type Tab = "apache" | "nginx" | "node" | "headers";

interface Config {
  anyOrigin: boolean;
  origins: string;
  methods: Set<string>;
  allowedHeaders: Set<string>;
  customHeader: string;
  exposeHeaders: string;
  maxAge: string;
  credentials: boolean;
}

function getAllowedHeaders(c: Config): string[] {
  const headers = [...c.allowedHeaders];
  if (c.customHeader.trim()) {
    c.customHeader
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean)
      .forEach((h) => {
        if (!headers.includes(h)) headers.push(h);
      });
  }
  return headers;
}

function getOrigins(c: Config): string {
  if (c.anyOrigin) return "*";
  return c.origins.split("\n").map((o) => o.trim()).filter(Boolean).join(", ") || "*";
}

function buildApache(c: Config): string {
  const origin = getOrigins(c);
  const methods = [...c.methods].join(", ");
  const headers = getAllowedHeaders(c).join(", ");
  const lines = [
    `<IfModule mod_headers.c>`,
    `  Header set Access-Control-Allow-Origin "${origin}"`,
    `  Header set Access-Control-Allow-Methods "${methods}"`,
    `  Header set Access-Control-Allow-Headers "${headers}"`,
  ];
  if (c.exposeHeaders.trim())
    lines.push(`  Header set Access-Control-Expose-Headers "${c.exposeHeaders.trim()}"`);
  if (c.maxAge.trim())
    lines.push(`  Header set Access-Control-Max-Age "${c.maxAge.trim()}"`);
  if (c.credentials && !c.anyOrigin)
    lines.push(`  Header set Access-Control-Allow-Credentials "true"`);
  lines.push(`</IfModule>`);
  return lines.join("\n");
}

function buildNginx(c: Config): string {
  const origin = getOrigins(c);
  const methods = [...c.methods].join(", ");
  const headers = getAllowedHeaders(c).join(", ");
  const lines = [
    `add_header 'Access-Control-Allow-Origin' '${origin}' always;`,
    `add_header 'Access-Control-Allow-Methods' '${methods}' always;`,
    `add_header 'Access-Control-Allow-Headers' '${headers}' always;`,
  ];
  if (c.exposeHeaders.trim())
    lines.push(`add_header 'Access-Control-Expose-Headers' '${c.exposeHeaders.trim()}' always;`);
  if (c.maxAge.trim())
    lines.push(`add_header 'Access-Control-Max-Age' '${c.maxAge.trim()}' always;`);
  if (c.credentials && !c.anyOrigin)
    lines.push(`add_header 'Access-Control-Allow-Credentials' 'true' always;`);
  return lines.join("\n");
}

function buildNode(c: Config): string {
  const origin = c.anyOrigin ? "*" : c.origins.split("\n").map((o) => o.trim()).filter(Boolean);
  const methods = [...c.methods].join(", ");
  const headers = getAllowedHeaders(c).join(", ");
  const originStr = Array.isArray(origin)
    ? `[${origin.map((o) => `"${o}"`).join(", ")}]`
    : `"${origin}"`;
  const lines = [
    `// Express / Node.js`,
    `app.use((req, res, next) => {`,
    `  const allowedOrigins = ${originStr};`,
    `  const reqOrigin = req.headers.origin;`,
    ...(c.anyOrigin
      ? [`  res.setHeader("Access-Control-Allow-Origin", "*");`]
      : [
          `  if (Array.isArray(allowedOrigins) && allowedOrigins.includes(reqOrigin)) {`,
          `    res.setHeader("Access-Control-Allow-Origin", reqOrigin);`,
          `  }`,
        ]),
    `  res.setHeader("Access-Control-Allow-Methods", "${methods}");`,
    `  res.setHeader("Access-Control-Allow-Headers", "${headers}");`,
  ];
  if (c.exposeHeaders.trim())
    lines.push(`  res.setHeader("Access-Control-Expose-Headers", "${c.exposeHeaders.trim()}");`);
  if (c.maxAge.trim())
    lines.push(`  res.setHeader("Access-Control-Max-Age", "${c.maxAge.trim()}");`);
  if (c.credentials && !c.anyOrigin)
    lines.push(`  res.setHeader("Access-Control-Allow-Credentials", "true");`);
  lines.push(`  if (req.method === "OPTIONS") return res.sendStatus(204);`);
  lines.push(`  next();`);
  lines.push(`});`);
  return lines.join("\n");
}

function buildHeaders(c: Config): string {
  const origin = getOrigins(c);
  const methods = [...c.methods].join(", ");
  const headers = getAllowedHeaders(c).join(", ");
  const lines = [
    `Access-Control-Allow-Origin: ${origin}`,
    `Access-Control-Allow-Methods: ${methods}`,
    `Access-Control-Allow-Headers: ${headers}`,
  ];
  if (c.exposeHeaders.trim())
    lines.push(`Access-Control-Expose-Headers: ${c.exposeHeaders.trim()}`);
  if (c.maxAge.trim()) lines.push(`Access-Control-Max-Age: ${c.maxAge.trim()}`);
  if (c.credentials && !c.anyOrigin) lines.push(`Access-Control-Allow-Credentials: true`);
  return lines.join("\n");
}

const labelClass = "text-xs font-semibold text-muted-foreground uppercase tracking-wide";
const inputClass =
  "w-full rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

export default function CorsGeneratorPage() {
  const [config, setConfig] = useState<Config>({
    anyOrigin: true,
    origins: "",
    methods: new Set(["GET", "POST", "PUT", "DELETE", "OPTIONS"]),
    allowedHeaders: new Set(["Content-Type", "Authorization"]),
    customHeader: "",
    exposeHeaders: "",
    maxAge: "86400",
    credentials: false,
  });
  const [tab, setTab] = useState<Tab>("apache");

  function setField<K extends keyof Config>(key: K, val: Config[K]) {
    setConfig((prev) => ({ ...prev, [key]: val }));
  }

  function toggleMethod(m: string) {
    setConfig((prev) => {
      const next = new Set(prev.methods);
      next.has(m) ? next.delete(m) : next.add(m);
      return { ...prev, methods: next };
    });
  }

  function toggleHeader(h: string) {
    setConfig((prev) => {
      const next = new Set(prev.allowedHeaders);
      next.has(h) ? next.delete(h) : next.add(h);
      return { ...prev, allowedHeaders: next };
    });
  }

  const outputs: Record<Tab, string> = {
    apache: buildApache(config),
    nginx: buildNginx(config),
    node: buildNode(config),
    headers: buildHeaders(config),
  };

  const tabLabels: { key: Tab; label: string }[] = [
    { key: "apache", label: "Apache" },
    { key: "nginx", label: "Nginx" },
    { key: "node", label: "Node/Express" },
    { key: "headers", label: "HTTP Headers" },
  ];

  return (
    <ToolShell
      title="CORS Headers Generator"
      description="Configure Cross-Origin Resource Sharing settings and generate server config snippets."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
        {/* Options */}
        <div className="space-y-5">
          {/* Origins */}
          <div className="space-y-2">
            <p className={labelClass}>Allowed Origins</p>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={config.anyOrigin}
                onChange={(e) => setField("anyOrigin", e.target.checked)}
                className="accent-primary"
              />
              Allow all origins (<code className="text-xs">*</code>)
            </label>
            {!config.anyOrigin && (
              <Textarea
                className="text-sm font-mono resize-none"
                placeholder={"https://example.com\nhttps://app.example.com"}
                rows={3}
                value={config.origins}
                onChange={(e) => setField("origins", e.target.value)}
              />
            )}
          </div>

          {/* Methods */}
          <div className="space-y-2">
            <p className={labelClass}>Allowed Methods</p>
            <div className="flex flex-wrap gap-2">
              {METHODS.map((m) => (
                <label key={m} className="flex items-center gap-1.5 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.methods.has(m)}
                    onChange={() => toggleMethod(m)}
                    className="accent-primary"
                  />
                  {m}
                </label>
              ))}
            </div>
          </div>

          {/* Allowed Headers */}
          <div className="space-y-2">
            <p className={labelClass}>Allowed Headers</p>
            <div className="flex flex-wrap gap-2">
              {COMMON_HEADERS.map((h) => (
                <label key={h} className="flex items-center gap-1.5 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.allowedHeaders.has(h)}
                    onChange={() => toggleHeader(h)}
                    className="accent-primary"
                  />
                  {h}
                </label>
              ))}
            </div>
            <input
              className={inputClass}
              placeholder="Custom headers (comma separated)"
              value={config.customHeader}
              onChange={(e) => setField("customHeader", e.target.value)}
            />
          </div>

          {/* Expose Headers */}
          <div className="space-y-1.5">
            <label className={labelClass}>Expose Headers (optional)</label>
            <input
              className={inputClass}
              placeholder="X-Custom-Header, X-Rate-Limit"
              value={config.exposeHeaders}
              onChange={(e) => setField("exposeHeaders", e.target.value)}
            />
          </div>

          {/* Max Age */}
          <div className="space-y-1.5">
            <label className={labelClass}>Max Age (seconds)</label>
            <input
              type="number"
              className={inputClass}
              placeholder="86400"
              value={config.maxAge}
              onChange={(e) => setField("maxAge", e.target.value)}
            />
          </div>

          {/* Credentials */}
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={config.credentials}
              onChange={(e) => setField("credentials", e.target.checked)}
              className="accent-primary"
              disabled={config.anyOrigin}
            />
            <span className={config.anyOrigin ? "text-muted-foreground/50" : ""}>
              Allow Credentials
              {config.anyOrigin && (
                <span className="text-xs text-muted-foreground ml-1">
                  (incompatible with wildcard origin)
                </span>
              )}
            </span>
          </label>
        </div>

        {/* Output */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1">
            {tabLabels.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${
                  tab === key
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/30 text-muted-foreground border-border/60 hover:bg-muted/50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-end">
            <CopyButton text={outputs[tab]} />
          </div>
          <pre className="rounded-lg bg-muted/30 border border-border/60 px-4 py-3 font-mono text-xs overflow-auto min-h-48 whitespace-pre">
            {outputs[tab]}
          </pre>
        </div>
      </div>
    </ToolShell>
  );
}
