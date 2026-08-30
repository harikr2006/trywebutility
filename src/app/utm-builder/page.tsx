"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { buildUTMUrl, UTMParams, UTM_PRESETS } from "@/lib/tools/utm-builder";
import { AlertCircle } from "lucide-react";

export default function UTMBuilderPage() {
  const [form, setForm] = useState<UTMParams>({
    url: "https://example.com",
    source: "google",
    medium: "cpc",
    campaign: "spring_sale",
    term: "",
    content: "",
  });

  const { url: result, error } = buildUTMUrl(form);
  function set(k: keyof UTMParams, v: string) { setForm(f => ({ ...f, [k]: v })); }

  const inputCls = "w-full h-9 rounded-md border border-border/60 bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <ToolShell title="UTM Builder" description="Build UTM-tagged URLs for campaign tracking in Google Analytics and other tools.">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-3xl">
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Website URL *</label>
            <input type="text" value={form.url} onChange={(e) => set("url", e.target.value)} placeholder="https://example.com" className={inputCls} />
          </div>
          {[
            { key: "source" as const, label: "Campaign Source *", placeholder: "google, newsletter, facebook", presets: UTM_PRESETS.sources },
            { key: "medium" as const, label: "Campaign Medium *", placeholder: "cpc, email, social", presets: UTM_PRESETS.mediums },
            { key: "campaign" as const, label: "Campaign Name *", placeholder: "spring_sale, brand_awareness", presets: [] },
            { key: "term" as const, label: "Campaign Term (optional)", placeholder: "running+shoes", presets: [] },
            { key: "content" as const, label: "Campaign Content (optional)", placeholder: "banner_v1, text_link", presets: [] },
          ].map(({ key, label, placeholder, presets }) => (
            <div key={key} className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</label>
              <input type="text" value={form[key]} onChange={(e) => set(key, e.target.value)} placeholder={placeholder} className={inputCls} />
              {presets.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {presets.map(p => (
                    <button key={p} onClick={() => set(key, p)}
                      className={`rounded px-2 py-0.5 text-[11px] border transition-colors ${form[key] === p ? "bg-primary text-primary-foreground border-primary" : "bg-muted/30 text-muted-foreground border-border/60 hover:bg-muted/50"}`}>
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Generated URL</label>
          {error ? (
            <div className="flex gap-2 text-sm text-destructive"><AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /><span>{error}</span></div>
          ) : (
            <>
              <div className="rounded-xl border-2 border-primary/40 bg-muted/20 p-4 flex flex-col gap-3">
                <p className="font-mono text-xs break-all text-foreground">{result || "Fill in the fields above to generate your URL"}</p>
                {result && <CopyButton text={result} />}
              </div>
              {result && (
                <div className="rounded-lg border border-border/60 overflow-hidden">
                  <table className="w-full text-xs">
                    <tbody>
                      {new URL(result).searchParams.entries && [...new URL(result).searchParams.entries()].map(([k, v]) => (
                        <tr key={k} className="border-b border-border/40 last:border-0">
                          <td className="px-3 py-2 text-muted-foreground font-medium w-32">{k}</td>
                          <td className="px-3 py-2 font-mono text-foreground">{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ToolShell>
  );
}
