import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Free Online Developer Tools — No Signup, No Install",
  description:
    "Looking for a CodeBeautify, JSONFormatter, or SmallDev.tools alternative? WebUtility offers 111+ free browser-based developer tools with no login, no ads, and zero data sent to any server.",
  keywords: [
    "codebeautify alternative",
    "jsonformatter alternative",
    "smalldev tools alternative",
    "it-tools alternative",
    "free online developer tools",
    "best developer tools online",
    "online tools no signup",
    "browser based developer tools",
    "free web utilities",
    "developer toolkit online",
  ],
  openGraph: {
    title: "Best Free Online Developer Tools — No Signup, No Install | WebUtility",
    description:
      "111+ free browser-based developer tools. A privacy-first alternative to CodeBeautify, JSONFormatter.org, and SmallDev.tools. No login, no data leaves your browser.",
    type: "website",
    url: "https://trywebutility.com/alternatives",
    siteName: "WebUtility",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Free Online Developer Tools — No Signup | WebUtility",
    description:
      "111+ free browser-based developer tools. Privacy-first, no login, no data sent to servers.",
  },
  alternates: {
    canonical: "https://trywebutility.com/alternatives",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
