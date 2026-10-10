import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Encoders & Decoders — Base64, URL, JWT, HTML Entity",
  description:
    "Free browser-based encoding and decoding tools. Base64 encode/decode, URL encode/decode, JWT decoder, HTML entity encoder, string escaper, and more. Client-side only — no data leaves your browser.",
  keywords: [
    "base64 encoder decoder online", "url encoder decoder", "jwt decoder online",
    "html entity encoder", "string escape unescape", "encoder decoder tools",
    "free encoder online", "decode base64 online",
  ],
  alternates: { canonical: "https://trywebutility.com/encoders/" },
  openGraph: { url: "https://trywebutility.com/encoders/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
