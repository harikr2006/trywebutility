import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Developer Testing & Analysis Tools — Regex, Diff, HTTP, Password",
  description:
    "Free browser-based testing and analysis tools for developers. Regex tester, diff checker, HTTP status reference, password strength, readability scores, CRON tester, semver validator, and 30+ more — all client-side.",
  keywords: [
    "regex tester online", "diff checker online", "http status codes reference",
    "developer testing tools", "password strength checker", "cron expression tester",
    "semver validator", "analysis tools online", "readability checker online",
  ],
  alternates: { canonical: "https://trywebutility.com/testers/" },
  openGraph: { url: "https://trywebutility.com/testers/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
