import Link from "next/link";
import {
  CheckCircle2, XCircle, ArrowRight, ShieldCheck, Zap, Lock,
  Globe, Braces, Binary, ArrowLeftRight, Wand2, Regex,
} from "lucide-react";

const competitors = [
  {
    name: "CodeBeautify",
    url: "codebeautify.org",
    pain: "Server-side processing — your code is sent to their servers. Traffic declining 21% YoY.",
    tools: "~50 tools",
    serverSide: true,
    loginRequired: false,
    ads: true,
    darkMode: true,
  },
  {
    name: "JSONFormatter.org",
    url: "jsonformatter.org",
    pain: "Single-purpose site. Great for JSON only — but you need to tab between 5 different sites for a full workflow.",
    tools: "~8 tools",
    serverSide: true,
    loginRequired: false,
    ads: true,
    darkMode: false,
  },
  {
    name: "SmallDev.tools",
    url: "smalldev.tools",
    pain: "Only 20+ tools, rarely updated, and development has stalled.",
    tools: "~20 tools",
    serverSide: false,
    loginRequired: false,
    ads: false,
    darkMode: true,
  },
  {
    name: "IT-Tools",
    url: "it-tools.tech",
    pain: "Requires self-hosting for full privacy. Cloud version relies on third-party hosting.",
    tools: "~65 tools",
    serverSide: false,
    loginRequired: false,
    ads: false,
    darkMode: true,
  },
  {
    name: "WebUtility",
    url: "trywebutility.com",
    pain: null,
    tools: "111+ tools",
    serverSide: false,
    loginRequired: false,
    ads: false,
    darkMode: true,
    highlight: true,
  },
];

const toolHighlights = [
  {
    category: "Formatters & Validators",
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-200/60 dark:border-emerald-800/50",
    iconBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300",
    Icon: Braces,
    tools: [
      { name: "JSON Formatter", href: "/json-formatter" },
      { name: "XML Formatter", href: "/xml-formatter" },
      { name: "SQL Formatter", href: "/sql-formatter" },
      { name: "HTML Formatter", href: "/html-formatter" },
      { name: "CSS Formatter", href: "/css-formatter" },
      { name: "YAML Validator", href: "/yaml-validator" },
    ],
  },
  {
    category: "Encoders & Decoders",
    color: "text-blue-700 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    border: "border-blue-200/60 dark:border-blue-800/50",
    iconBg: "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300",
    Icon: Binary,
    tools: [
      { name: "Base64 Encoder/Decoder", href: "/base64" },
      { name: "URL Encoder/Decoder", href: "/url-encoder" },
      { name: "JWT Decoder", href: "/jwt-decoder" },
      { name: "JWT Generator", href: "/jwt-generator" },
      { name: "HTML Entity Encoder", href: "/html-entity" },
      { name: "Text Encryptor (AES-256)", href: "/text-encryptor" },
    ],
  },
  {
    category: "Converters",
    color: "text-orange-700 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-950/40",
    border: "border-orange-200/60 dark:border-orange-800/50",
    iconBg: "bg-orange-100 text-orange-700 dark:bg-orange-900/60 dark:text-orange-300",
    Icon: ArrowLeftRight,
    tools: [
      { name: "JSON ↔ YAML", href: "/json-yaml" },
      { name: "CSV ↔ JSON", href: "/csv-json" },
      { name: "JSON → TypeScript", href: "/json-to-ts" },
      { name: "Unix Timestamp Converter", href: "/timestamp" },
      { name: "Color Converter", href: "/color-converter" },
      { name: "cURL to Code", href: "/curl-to-code" },
    ],
  },
  {
    category: "Generators",
    color: "text-pink-700 dark:text-pink-400",
    bg: "bg-pink-50 dark:bg-pink-950/40",
    border: "border-pink-200/60 dark:border-pink-800/50",
    iconBg: "bg-pink-100 text-pink-700 dark:bg-pink-900/60 dark:text-pink-300",
    Icon: Wand2,
    tools: [
      { name: "UUID Generator", href: "/uuid-generator" },
      { name: "Password Generator", href: "/password-generator" },
      { name: "Hash Generator (MD5/SHA)", href: "/hash-generator" },
      { name: "CSS Gradient Generator", href: "/css-gradient" },
      { name: "QR Code Generator", href: "/qr-code" },
      { name: "Favicon Generator", href: "/favicon-generator" },
    ],
  },
  {
    category: "Testers & Analysis",
    color: "text-violet-700 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-950/40",
    border: "border-violet-200/60 dark:border-violet-800/50",
    iconBg: "bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-300",
    Icon: Regex,
    tools: [
      { name: "Regex Tester", href: "/regex-tester" },
      { name: "CRON Expression Tester", href: "/cron-tester" },
      { name: "JSON Diff Checker", href: "/json-diff" },
      { name: "IP Subnet Calculator", href: "/ip-subnet" },
      { name: "Color Contrast Checker", href: "/color-contrast" },
      { name: "HTTP Request Tester", href: "/http-tester" },
    ],
  },
];

const reasons = [
  {
    Icon: Lock,
    title: "Zero data leaves your browser",
    body: "Every single tool runs 100% client-side using the Web Crypto API and in-browser processing. CodeBeautify and JSONFormatter.org send your code to their servers — WebUtility never does.",
  },
  {
    Icon: Zap,
    title: "111+ tools, one tab",
    body: "Stop switching between jsonformatter.org for JSON, regextester.com for regex, and another site for JWT. Everything lives at one URL with instant search across all tools.",
  },
  {
    Icon: ShieldCheck,
    title: "No login, no ads, no tracking",
    body: "We don't require an account, show interstitial ads, or fingerprint you. The site is statically generated and served via CDN — no session cookies, no user profiling.",
  },
  {
    Icon: Globe,
    title: "Works offline after first load",
    body: "Because everything is client-side JavaScript, once the page loads you can use most tools without an internet connection — unlike server-side tools that break when the server is slow.",
  },
];

function Check() {
  return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" aria-label="Yes" />;
}
function Cross() {
  return <XCircle className="h-4 w-4 text-red-400 shrink-0" aria-label="No" />;
}

export default function AlternativesPage() {
  return (
    <div className="min-h-full">
      {/* ── Hero ── */}
      <section
        aria-labelledby="alt-hero-heading"
        className="relative overflow-hidden border-b border-border/50 bg-gradient-to-br from-primary/5 via-background to-accent/10 px-6 py-14 md:py-20"
      >
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/8 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3.5 py-1 text-xs font-semibold text-primary mb-5 select-none">
            <span className="flex h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            CodeBeautify · JSONFormatter · SmallDev · IT-Tools Alternative
          </div>
          <h1
            id="alt-hero-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-5 leading-tight"
          >
            The Best Free Online{" "}
            <span className="text-primary">Developer Tools</span>
            {" "}— No Signup, No Install
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            111+ free browser-based utilities. JSON formatter, regex tester, JWT decoder, UUID
            generator, and more — all run locally in your browser. No account, no ads, no data
            ever sent to a server.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
            >
              Browse all 111 tools
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/json-formatter"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold hover:bg-muted transition-colors"
            >
              Try JSON Formatter
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-14 space-y-20">

        {/* ── Why switch ── */}
        <section aria-labelledby="why-heading">
          <h2 id="why-heading" className="text-2xl font-bold tracking-tight text-foreground mb-2">
            Why developers are switching
          </h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-2xl">
            The most popular developer tool sites have trade-offs that affect security, speed, and
            workflow. Here&apos;s what makes WebUtility different.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {reasons.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="rounded-xl border border-border/70 bg-card p-5 flex gap-4"
              >
                <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground mb-1">{title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Comparison table ── */}
        <section aria-labelledby="compare-heading">
          <h2 id="compare-heading" className="text-2xl font-bold tracking-tight text-foreground mb-2">
            Feature comparison
          </h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
            How WebUtility stacks up against CodeBeautify, JSONFormatter.org, SmallDev.tools, and IT-Tools.
          </p>
          <div className="overflow-x-auto rounded-xl border border-border/60">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-border/60 bg-muted/40">
                  <th className="text-left px-4 py-3 font-semibold text-foreground w-36">Tool site</th>
                  <th className="px-4 py-3 font-semibold text-foreground text-center">Tools</th>
                  <th className="px-4 py-3 font-semibold text-foreground text-center">100% client-side</th>
                  <th className="px-4 py-3 font-semibold text-foreground text-center">No login</th>
                  <th className="px-4 py-3 font-semibold text-foreground text-center">No ads</th>
                  <th className="px-4 py-3 font-semibold text-foreground text-center">Dark mode</th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((c, i) => (
                  <tr
                    key={c.name}
                    className={
                      c.highlight
                        ? "bg-primary/5 border-l-2 border-l-primary"
                        : i % 2 === 0
                        ? "bg-background"
                        : "bg-muted/20"
                    }
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {c.highlight ? (
                        <span className="flex items-center gap-1.5">
                          {c.name}
                          <span className="text-[10px] font-bold bg-primary text-primary-foreground rounded px-1.5 py-0.5 uppercase tracking-wide">
                            This site
                          </span>
                        </span>
                      ) : (
                        c.name
                      )}
                      <span className="block text-[11px] text-muted-foreground font-normal">{c.url}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={c.highlight ? "font-bold text-primary" : "text-muted-foreground"}>
                        {c.tools}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="flex justify-center">{c.serverSide ? <Cross /> : <Check />}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="flex justify-center">{c.loginRequired ? <Cross /> : <Check />}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="flex justify-center">{c.ads ? <Cross /> : <Check />}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="flex justify-center">{c.darkMode ? <Check /> : <Cross />}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            * Data based on publicly available information as of 2025. Server-side status assessed by network request analysis.
          </p>
        </section>

        {/* ── Pain points ── */}
        <section aria-labelledby="pain-heading">
          <h2 id="pain-heading" className="text-2xl font-bold tracking-tight text-foreground mb-6">
            Common complaints about popular alternatives
          </h2>
          <div className="space-y-4">
            {competitors.filter((c) => c.pain).map((c) => (
              <div
                key={c.name}
                className="rounded-xl border border-border/60 bg-card p-5"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  {c.name} ({c.url})
                </p>
                <p className="text-sm text-foreground/80 leading-relaxed">{c.pain}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Tool highlights by category ── */}
        <section aria-labelledby="tools-heading">
          <h2 id="tools-heading" className="text-2xl font-bold tracking-tight text-foreground mb-2">
            Popular tools by category
          </h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-2xl">
            A snapshot of what&apos;s available — browse the{" "}
            <Link href="/" className="text-primary hover:underline underline-offset-2">
              full directory
            </Link>{" "}
            to see all 111 tools with search and filters.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {toolHighlights.map(({ category, color, bg, border, iconBg, Icon, tools }) => (
              <div
                key={category}
                className={`rounded-xl border ${border} ${bg} p-5`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className={`flex items-center justify-center w-7 h-7 rounded-lg ${iconBg}`}>
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </div>
                  <h3 className={`text-xs font-bold uppercase tracking-widest ${color}`}>
                    {category}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {tools.map((t) => (
                    <li key={t.href}>
                      <Link
                        href={t.href}
                        className="flex items-center justify-between text-sm text-foreground/80 hover:text-primary transition-colors group"
                      >
                        {t.name}
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── Frequently Asked ── */}
        <section aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-bold tracking-tight text-foreground mb-6">
            Frequently asked questions
          </h2>
          <div className="space-y-5">
            {[
              {
                q: "Is WebUtility really free?",
                a: "Yes — every tool is free with no usage limits, no paid tier, and no account required. There is no freemium model.",
              },
              {
                q: "Does my data get sent to your servers?",
                a: "No. All tools run entirely in your browser using JavaScript and the Web Crypto API. Nothing is uploaded or transmitted. You can verify this by opening your browser's network inspector — you'll see zero outgoing requests when using a tool.",
              },
              {
                q: "How is this different from CodeBeautify?",
                a: "CodeBeautify processes data server-side, meaning your SQL queries, JSON payloads, and code are sent to their servers. WebUtility processes everything locally. We also have more tools (111+ vs ~50) and no interstitial ads.",
              },
              {
                q: "How is this different from JSONFormatter.org?",
                a: "JSONFormatter.org is excellent for JSON specifically, but it's a single-purpose site. WebUtility covers JSON formatting plus 110 other tools — regex testing, JWT decoding, color conversion, CSS generators, and more — all in one place.",
              },
              {
                q: "What makes this better than IT-Tools?",
                a: "IT-Tools is a great open-source project. WebUtility offers a hosted, always-available alternative with no self-hosting required, 111 tools (vs ~65), and a focus on static generation for maximum speed.",
              },
              {
                q: "Can I use these tools offline?",
                a: "Once the page has loaded, most tools work without an internet connection because all processing is client-side. This is not possible with server-side tools like CodeBeautify.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="rounded-xl border border-border/60 bg-card p-5">
                <h3 className="font-semibold text-sm text-foreground mb-2">{q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section
          aria-labelledby="cta-heading"
          className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/8 via-background to-accent/10 p-10 text-center"
        >
          <h2 id="cta-heading" className="text-2xl font-bold tracking-tight text-foreground mb-3">
            Ready to try it?
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto mb-6">
            No account to create, no extension to install. Open a tool and start working — it&apos;s
            that fast.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
            >
              Browse all 111 tools
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/json-formatter"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-7 py-3 text-sm font-semibold hover:bg-muted transition-colors"
            >
              JSON Formatter
            </Link>
            <Link
              href="/regex-tester"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-7 py-3 text-sm font-semibold hover:bg-muted transition-colors"
            >
              Regex Tester
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
