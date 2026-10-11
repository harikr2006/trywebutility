import Link from "next/link";
import { Braces } from "lucide-react";
import { tools, categories } from "@/lib/tools-registry";

const categorySlug: Record<string, string> = {
  "Formatters & Validators": "Formatters+%26+Validators",
  "Encoders & Decoders": "Encoders+%26+Decoders",
  "Converters": "Converters",
  "Generators": "Generators",
  "Testers & Analysis": "Testers+%26+Analysis",
};

export default function Footer() {
  const grouped = categories.map((cat) => ({
    heading: cat,
    links: tools
      .filter((t) => t.category === cat)
      .map((t) => ({ label: t.name, href: t.path })),
  }));

  return (
    <footer role="contentinfo" className="border-t border-border/60 bg-card">
      {/* Links grid */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {grouped.map((col) => (
            <div key={col.heading}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                {col.heading}
              </h3>
              <ul className="space-y-1.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href + "/"}
                      className="text-xs text-foreground/65 hover:text-primary transition-colors leading-snug block"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Braces className="h-4 w-4 text-primary" aria-hidden="true" />
            <span className="text-sm font-semibold">WebUtility</span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Free developer tools. No tracking, no accounts, no data leaves your browser.
          </p>
        </div>
      </div>
    </footer>
  );
}
