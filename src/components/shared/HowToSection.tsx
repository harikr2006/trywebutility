"use client";

import { howToData } from "@/lib/how-to-data";
import { normalizePath } from "@/hooks/useFavorites";
import { usePathname } from "next/navigation";

export default function HowToSection() {
  const pathname = usePathname();
  const entry = howToData[normalizePath(pathname)];
  if (!entry) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use ${entry.name}`,
    step: entry.steps.map((text, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section aria-labelledby="how-to-heading" className="rounded-lg border border-border/60 bg-muted/20 px-5 py-4">
        <h2
          id="how-to-heading"
          className="text-xs font-bold uppercase tracking-widest text-foreground mb-3"
        >
          How to use
        </h2>
        <ol className="space-y-2">
          {entry.steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-muted-foreground">
              <span className="shrink-0 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
