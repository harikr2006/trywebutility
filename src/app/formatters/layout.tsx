import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Code Formatters & Validators — JSON, XML, SQL, CSS, HTML",
  description:
    "Free browser-based formatters and validators for JSON, XML, SQL, CSS, HTML, Markdown, YAML, and SVG. Prettify, validate, and minify code instantly. No data leaves your browser.",
  keywords: [
    "online code formatter", "json formatter online", "xml formatter online",
    "sql formatter online", "css formatter online", "html formatter online",
    "yaml validator online", "code beautifier online", "free code formatter",
  ],
  alternates: { canonical: "https://trywebutility.com/formatters/" },
  openGraph: { url: "https://trywebutility.com/formatters/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
