import Link from "next/link";
import { Braces, ExternalLink } from "lucide-react";

const footerLinks = [
  {
    heading: "Formatters",
    links: [
      { label: "JSON Formatter", href: "/json-formatter" },
      { label: "XML Formatter", href: "/xml-formatter" },
      { label: "SQL Formatter", href: "/sql-formatter" },
      { label: "CSS Formatter", href: "/css-formatter" },
      { label: "HTML Formatter", href: "/html-formatter" },
    ],
  },
  {
    heading: "Encoders",
    links: [
      { label: "Base64 Encode/Decode", href: "/base64" },
      { label: "URL Encode/Decode", href: "/url-encoder" },
      { label: "JWT Decoder", href: "/jwt-decoder" },
      { label: "HTML Entities", href: "/html-entity" },
      { label: "String Escape", href: "/string-escape" },
    ],
  },
  {
    heading: "Converters",
    links: [
      { label: "JSON ↔ YAML", href: "/json-yaml" },
      { label: "Color Converter", href: "/color-converter" },
      { label: "Timestamp Converter", href: "/timestamp" },
      { label: "Unit Converter", href: "/unit-converter" },
      { label: "Date Calculator", href: "/date-calculator" },
    ],
  },
  {
    heading: "Generators & Testers",
    links: [
      { label: "UUID Generator", href: "/uuid" },
      { label: "Password Generator", href: "/password" },
      { label: "Regex Tester", href: "/regex" },
      { label: "Hash Generator", href: "/hash" },
      { label: "QR Code Generator", href: "/qr-code" },
    ],
  },
];

export default function Footer() {
  return (
    <footer role="contentinfo" className="border-t border-border/60 bg-card">
      {/* Links grid */}
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {footerLinks.map((col) => (
          <div key={col.heading}>
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
              {col.heading}
            </h3>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-foreground/70 hover:text-primary transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Braces className="h-4 w-4 text-primary" aria-hidden="true" />
            <span className="text-sm font-semibold">WebUtility</span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Free developer tools. No tracking, no accounts, no data leaves your browser.
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub (opens in new tab)"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
