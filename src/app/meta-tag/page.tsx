"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { generateMetaTags, MetaTagInput } from "@/lib/tools/meta-tag";

export default function MetaTagPage() {
  const [form, setForm] = useState<MetaTagInput>({
    title: "My Awesome Page",
    description: "A brief description of what this page is about for search engines.",
    url: "https://example.com/my-page",
    image: "https://example.com/og-image.png",
    siteName: "Example Site",
    twitterHandle: "@example",
    robots: "index, follow",
    canonical: "https://example.com/my-page",
  });

  function set(key: keyof MetaTagInput, value: string) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  const output = generateMetaTags(form);
  const inputCls = "w-full h-9 rounded-md border border-border/60 bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

  const fields: { key: keyof MetaTagInput; label: string; placeholder: string }[] = [
    { key: "title", label: "Page Title", placeholder: "My Awesome Page" },
    { key: "description", label: "Meta Description (max 160 chars)", placeholder: "A brief description..." },
    { key: "url", label: "Page URL", placeholder: "https://example.com/page" },
    { key: "image", label: "OG Image URL", placeholder: "https://example.com/og.png" },
    { key: "siteName", label: "Site Name", placeholder: "My Website" },
    { key: "twitterHandle", label: "Twitter Handle", placeholder: "@username" },
    { key: "robots", label: "Robots", placeholder: "index, follow" },
    { key: "canonical", label: "Canonical URL", placeholder: "https://example.com/page" },
  ];

  return (
    <ToolShell title="Meta Tag Generator" description="Generate SEO, Open Graph, and Twitter Card meta tags for your HTML <head>.">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          {fields.map(({ key, label, placeholder }) => (
            <div key={key} className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</label>
              <input type="text" value={form[key]} onChange={(e) => set(key, e.target.value)}
                placeholder={placeholder} className={inputCls} />
            </div>
          ))}
          {form.description && (
            <p className={`text-xs ${form.description.length > 160 ? "text-destructive" : "text-muted-foreground"}`}>
              {form.description.length}/160 characters
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Generated Tags</label>
            <CopyButton text={output} />
          </div>
          <pre className="flex-1 min-h-[500px] rounded-lg border border-border/60 bg-muted/30 p-4 font-mono text-xs overflow-auto whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      </div>
    </ToolShell>
  );
}
