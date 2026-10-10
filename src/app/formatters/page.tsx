import CategoryPage from "@/components/shared/CategoryPage";

export default function FormattersPage() {
  return (
    <CategoryPage
      category="Formatters & Validators"
      headline="Online Code Formatters & Validators"
      subtext="Free browser-based tools to format, beautify, and validate JSON, XML, SQL, CSS, HTML, Markdown, YAML, and SVG. Paste your code and get readable, properly-indented output instantly — all processing runs client-side."
    >
      <section className="mt-4 space-y-6 text-sm text-muted-foreground leading-relaxed">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-foreground mb-3">
            What is a code formatter?
          </h2>
          <p>
            A code formatter parses raw source code or data and re-serializes it with consistent indentation,
            line breaks, and spacing. Formatted code is significantly easier to read, review, and debug than
            minified or manually written output.
          </p>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-foreground mb-3">
            Why format in the browser?
          </h2>
          <p>
            All tools on this page run entirely in your browser using JavaScript — no server request is made.
            This means your code (including API keys, secrets, and proprietary logic) never leaves your device.
            It also means formatting is instant, works offline, and has no rate limits.
          </p>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-foreground mb-3">
            Popular formatters
          </h2>
          <ul className="space-y-1.5">
            <li><strong className="text-foreground">JSON Formatter</strong> — beautify and validate JSON with syntax highlighting; switch to Minify mode for production payloads.</li>
            <li><strong className="text-foreground">SQL Formatter</strong> — indent SQL queries for MySQL, PostgreSQL, and T-SQL with keyword capitalization.</li>
            <li><strong className="text-foreground">CSS Formatter</strong> — normalize stylesheets: sort properties, fix indentation, or minify for deployment.</li>
            <li><strong className="text-foreground">XML Formatter</strong> — prettify XML with proper indentation and check well-formedness errors.</li>
            <li><strong className="text-foreground">YAML Validator</strong> — check YAML syntax and format with correct indentation — great for Kubernetes and CI configs.</li>
          </ul>
        </div>
      </section>
    </CategoryPage>
  );
}
