import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Data & Unit Converters — JSON, YAML, Color, Timezone, Units",
  description:
    "Free browser-based data format and unit converters. Convert JSON↔YAML, XML↔JSON, colors (HEX/RGB/HSL), timestamps, timezones, number bases, units of measurement, and more. No sign-up needed.",
  keywords: [
    "data format converter online", "json to yaml converter", "unit converter online",
    "color converter hex rgb hsl", "timezone converter online", "timestamp converter",
    "number base converter", "free data converter", "xml json converter",
  ],
  alternates: { canonical: "https://trywebutility.com/converters/" },
  openGraph: { url: "https://trywebutility.com/converters/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
