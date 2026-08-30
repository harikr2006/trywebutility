"use client";
import { useState } from "react";
import ToolShell from "@/components/shared/ToolShell";
import CopyButton from "@/components/shared/CopyButton";
import { Textarea } from "@/components/ui/textarea";

interface OgFields {
  title: string;
  description: string;
  image: string;
  siteName: string;
  url: string;
  twitterCard: "summary" | "summary_large_image";
}

function SocialCard({
  fields,
  variant,
}: {
  fields: OgFields;
  variant: "twitter" | "linkedin";
}) {
  const isLargeImage =
    variant === "twitter"
      ? fields.twitterCard === "summary_large_image"
      : true;

  const ImagePlaceholder = () => (
    <div className="flex items-center justify-center bg-muted/50 text-xs text-muted-foreground">
      {fields.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={fields.image}
          alt="og:image preview"
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
            (e.currentTarget.nextSibling as HTMLElement | null)?.removeAttribute(
              "hidden"
            );
          }}
        />
      ) : null}
      <span hidden={!!fields.image}>No image provided</span>
    </div>
  );

  const domain = (() => {
    try {
      return fields.url ? new URL(fields.url).hostname : fields.siteName || "";
    } catch {
      return fields.siteName || fields.url || "";
    }
  })();

  if (isLargeImage) {
    return (
      <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
        <div className="h-48 w-full overflow-hidden">
          <ImagePlaceholder />
        </div>
        <div className="space-y-1 p-3">
          {domain && (
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              {domain}
            </p>
          )}
          <p className="truncate text-sm font-semibold text-foreground">
            {fields.title || "Page title"}
          </p>
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {fields.description || "Page description will appear here."}
          </p>
        </div>
      </div>
    );
  }

  // Summary card (small image on the side)
  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
      <div className="flex h-24 items-stretch">
        <div className="w-24 shrink-0 overflow-hidden">
          <ImagePlaceholder />
        </div>
        <div className="flex flex-col justify-center gap-1 px-3 py-2">
          {domain && (
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              {domain}
            </p>
          )}
          <p className="truncate text-sm font-semibold text-foreground">
            {fields.title || "Page title"}
          </p>
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {fields.description || "Page description will appear here."}
          </p>
        </div>
      </div>
    </div>
  );
}

function generateHtml(fields: OgFields): string {
  const lines: string[] = [];
  if (fields.title)
    lines.push(`<meta property="og:title" content="${fields.title}" />`);
  if (fields.description)
    lines.push(
      `<meta property="og:description" content="${fields.description}" />`
    );
  if (fields.image)
    lines.push(`<meta property="og:image" content="${fields.image}" />`);
  if (fields.url)
    lines.push(`<meta property="og:url" content="${fields.url}" />`);
  if (fields.siteName)
    lines.push(
      `<meta property="og:site_name" content="${fields.siteName}" />`
    );
  lines.push(
    `<meta name="twitter:card" content="${fields.twitterCard}" />`
  );
  if (fields.title)
    lines.push(`<meta name="twitter:title" content="${fields.title}" />`);
  if (fields.description)
    lines.push(
      `<meta name="twitter:description" content="${fields.description}" />`
    );
  if (fields.image)
    lines.push(`<meta name="twitter:image" content="${fields.image}" />`);
  return lines.join("\n");
}

export default function OgPreviewPage() {
  const [fields, setFields] = useState<OgFields>({
    title: "",
    description: "",
    image: "",
    siteName: "",
    url: "",
    twitterCard: "summary_large_image",
  });

  function update(key: keyof OgFields, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  const metaHtml = generateHtml(fields);

  return (
    <ToolShell
      title="Open Graph Preview"
      description="Preview how your page will look when shared on social media — fill in the meta tags and see a live card preview."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: form */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              og:title
            </label>
            <input
              type="text"
              value={fields.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="My Awesome Page"
              className="flex h-8 w-full rounded-md border border-border/60 bg-muted/30 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              og:description
            </label>
            <Textarea
              value={fields.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="A short description of the page content..."
              rows={2}
              className="min-h-16 resize-y bg-muted/30 border-border/60 focus-visible:ring-primary/30 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              og:image (URL)
            </label>
            <input
              type="url"
              value={fields.image}
              onChange={(e) => update("image", e.target.value)}
              placeholder="https://example.com/image.png"
              className="flex h-8 w-full rounded-md border border-border/60 bg-muted/30 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              og:site_name
            </label>
            <input
              type="text"
              value={fields.siteName}
              onChange={(e) => update("siteName", e.target.value)}
              placeholder="My Site"
              className="flex h-8 w-full rounded-md border border-border/60 bg-muted/30 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              og:url
            </label>
            <input
              type="url"
              value={fields.url}
              onChange={(e) => update("url", e.target.value)}
              placeholder="https://example.com/page"
              className="flex h-8 w-full rounded-md border border-border/60 bg-muted/30 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Twitter card type
            </label>
            <select
              value={fields.twitterCard}
              onChange={(e) =>
                update(
                  "twitterCard",
                  e.target.value as "summary" | "summary_large_image"
                )
              }
              className="flex h-8 w-full rounded-md border border-border/60 bg-muted/30 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="summary">summary</option>
              <option value="summary_large_image">summary_large_image</option>
            </select>
          </div>
        </div>

        {/* Right: previews */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Twitter / X
            </label>
            <SocialCard fields={fields} variant="twitter" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              LinkedIn / Facebook
            </label>
            <SocialCard fields={fields} variant="linkedin" />
          </div>
        </div>
      </div>

      {/* Meta tag output */}
      <div className="space-y-1.5 mt-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Generated Meta Tags
          </label>
          {metaHtml && <CopyButton text={metaHtml} />}
        </div>
        <pre className="min-h-20 w-full overflow-x-auto rounded-lg border border-border/60 bg-muted/30 p-3 font-mono text-xs text-foreground whitespace-pre-wrap">
          {metaHtml || <span className="text-muted-foreground">Fill in the fields above to generate meta tags.</span>}
        </pre>
      </div>
    </ToolShell>
  );
}
