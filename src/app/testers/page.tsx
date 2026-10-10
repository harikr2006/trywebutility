import CategoryPage from "@/components/shared/CategoryPage";

export default function TestersPage() {
  return (
    <CategoryPage
      category="Testers & Analysis"
      headline="Online Developer Testing & Analysis Tools"
      subtext="Test, debug, and analyze code and data directly in your browser. Regex tester with live highlighting, diff checker, HTTP status reference, password strength, CRON validator, semver checker, readability scorer, and 30+ more."
    >
      <section className="mt-4 space-y-6 text-sm text-muted-foreground leading-relaxed">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-foreground mb-3">
            Code & pattern testers
          </h2>
          <ul className="space-y-1.5">
            <li><strong className="text-foreground">Regex Tester</strong> — test regular expressions with live match highlighting, capture group display, and global/case-insensitive flags.</li>
            <li><strong className="text-foreground">CRON Expression Tester</strong> — validate cron expressions and preview the next 10 scheduled run times in human-readable format.</li>
            <li><strong className="text-foreground">Semver Validator</strong> — parse and validate SemVer 2.0 strings (MAJOR.MINOR.PATCH), check pre-release tags, and compare two versions.</li>
            <li><strong className="text-foreground">JSON Path Tester</strong> — query JSON data with JSONPath expressions and inspect matching nodes.</li>
            <li><strong className="text-foreground">Diff Checker</strong> — compare two text blocks side by side with character-level diff highlighting and line numbers.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-foreground mb-3">
            Security & analysis tools
          </h2>
          <ul className="space-y-1.5">
            <li><strong className="text-foreground">Password Strength Checker</strong> — analyze entropy, character variety, and estimated crack time for any password.</li>
            <li><strong className="text-foreground">HTTP Status Reference</strong> — quick reference for all HTTP 1xx–5xx status codes with descriptions and common use cases.</li>
            <li><strong className="text-foreground">IP Subnet Calculator</strong> — compute network address, broadcast address, host range, and CIDR notation for any IPv4 subnet.</li>
            <li><strong className="text-foreground">Chmod Calculator</strong> — convert Unix file permissions between symbolic (rwxr-xr-x) and numeric (755) representations.</li>
            <li><strong className="text-foreground">Color Contrast Checker</strong> — check WCAG 2.1 AA and AAA contrast ratio for any foreground/background color pair.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-foreground mb-3">
            Text analysis tools
          </h2>
          <ul className="space-y-1.5">
            <li><strong className="text-foreground">Readability Score</strong> — analyze text with Flesch-Kincaid, Gunning Fog, and SMOG readability indices to target the right audience.</li>
            <li><strong className="text-foreground">Word & Character Counter</strong> — count words, characters, lines, sentences, and estimated reading time for any text.</li>
            <li><strong className="text-foreground">Byte Size Calculator</strong> — compute the exact UTF-8 byte size of any string — useful for validating API payload limits.</li>
          </ul>
        </div>
      </section>
    </CategoryPage>
  );
}
