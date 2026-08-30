import type { FAQ } from "@/components/shared/FAQSection";

/* Global FAQs shown on every tool page */
export const globalFAQs: FAQ[] = [
  {
    q: "Is this tool free to use?",
    a: "Yes, all tools on WebUtility are completely free with no usage limits, no sign-up, and no paid tiers.",
  },
  {
    q: "Does my data leave the browser?",
    a: "No. Every tool runs entirely in your browser using JavaScript. Your input is never sent to any server, so sensitive data like API keys, passwords, and personal information stays private.",
  },
  {
    q: "Which browsers are supported?",
    a: "WebUtility works in all modern browsers — Chrome, Firefox, Safari, and Edge. No plugins or extensions are required.",
  },
];

/* Per-tool FAQs keyed by pathname (e.g. "/json-formatter") */
export const faqData: Record<string, FAQ[]> = {
  "/json-formatter": [
    {
      q: "What is a JSON formatter?",
      a: "A JSON formatter parses raw JSON text and outputs it with consistent indentation and line breaks, making it easy to read and debug complex nested structures.",
    },
    {
      q: "Does the formatter fix broken JSON?",
      a: "No — the formatter requires valid JSON input. If your JSON has a syntax error (e.g. a trailing comma or missing quote) the tool will show the exact error location so you can fix it manually.",
    },
    {
      q: "Can I minify JSON?",
      a: "Yes. Switch to Minify mode to strip all whitespace and produce the most compact form of your JSON, ideal for reducing payload sizes in APIs.",
    },
  ],
  "/xml-formatter": [
    {
      q: "What does the XML formatter do?",
      a: "It parses your XML and re-serializes it with proper indentation, making deeply nested markup readable at a glance.",
    },
    {
      q: "Can it validate XML?",
      a: "The formatter performs well-formedness checks (balanced tags, proper attribute quoting). It does not validate against an XSD or DTD schema.",
    },
  ],
  "/sql-formatter": [
    {
      q: "Which SQL dialects are supported?",
      a: "The formatter supports standard SQL as well as common dialect keywords from MySQL, PostgreSQL, SQLite, and MS SQL Server.",
    },
    {
      q: "Will formatting change my query logic?",
      a: "No. The formatter only changes whitespace and capitalization — it never rewrites clauses or alters the logical meaning of your query.",
    },
  ],
  "/css-formatter": [
    {
      q: "What does the CSS formatter do?",
      a: "It normalizes your CSS: sorts properties, adds consistent spacing, and formats rules so the stylesheet is easy to read and review.",
    },
    {
      q: "Can I minify CSS?",
      a: "Yes. Switch to Minify mode to collapse whitespace and produce a production-ready single line of CSS.",
    },
  ],
  "/markdown-formatter": [
    {
      q: "What does the Markdown formatter do?",
      a: "It normalizes Markdown: consistent heading levels, proper list indentation, and removes extraneous blank lines so the source is clean and renderable.",
    },
  ],
  "/html-formatter": [
    {
      q: "What does the HTML formatter do?",
      a: "It parses and re-indents your HTML with consistent nesting, making complex templates easier to read and diff.",
    },
    {
      q: "Will it break inline styles or scripts?",
      a: "Script and style blocks are left untouched to avoid altering their behavior.",
    },
  ],
  "/json-schema": [
    {
      q: "What is JSON Schema validation?",
      a: "JSON Schema is a vocabulary for describing the structure of JSON. This tool validates a JSON document against a schema definition and reports exactly which fields fail and why.",
    },
    {
      q: "Which JSON Schema version is supported?",
      a: "The validator supports JSON Schema draft-07, which covers the most commonly used keywords like type, required, properties, pattern, and format.",
    },
  ],
  "/yaml-validator": [
    {
      q: "What is YAML?",
      a: "YAML (YAML Ain't Markup Language) is a human-readable data serialization format commonly used in config files, CI/CD pipelines, and Kubernetes manifests.",
    },
    {
      q: "What errors does the validator catch?",
      a: "It catches indentation mistakes, mixed tab/space errors, duplicate keys, and invalid scalar values.",
    },
  ],
  "/base64": [
    {
      q: "What is Base64 encoding?",
      a: "Base64 converts binary data (or any text) into a string of ASCII characters so it can be safely transported over text-based protocols like HTTP headers or JSON payloads.",
    },
    {
      q: "Can I encode files?",
      a: "Yes. Use the file input to encode any binary file (image, PDF, etc.) to a Base64 data URL.",
    },
    {
      q: "Is URL-safe Base64 supported?",
      a: "Yes. Toggle URL-safe mode to replace + with - and / with _ making the output safe for use in URLs and filenames.",
    },
  ],
  "/url-encoder": [
    {
      q: "What is URL encoding?",
      a: "URL encoding (percent-encoding) replaces special characters with % followed by their hex code, ensuring a URL string can be safely transmitted and parsed.",
    },
    {
      q: "When should I use encodeURI vs encodeURIComponent?",
      a: "Use encodeURIComponent for encoding individual query parameter values. Use encodeURI for encoding an entire URL while preserving its structure (slashes, colons, etc.).",
    },
  ],
  "/jwt-decoder": [
    {
      q: "What does the JWT decoder show?",
      a: "It decodes and displays the header (algorithm, token type) and payload (claims like sub, iat, exp) as formatted JSON. It does not verify the signature.",
    },
    {
      q: "Is it safe to paste a real JWT here?",
      a: "The tool runs entirely in your browser — nothing is sent to any server. However, as a general security practice, avoid pasting production JWTs into any web tool if they grant sensitive access.",
    },
  ],
  "/jwt-generator": [
    {
      q: "Does this tool sign real JWTs?",
      a: "Yes. It signs tokens using HMAC-SHA256 (HS256) with a secret you provide, producing a valid JWT you can verify with any JWT library.",
    },
    {
      q: "Can I use asymmetric keys (RS256)?",
      a: "Currently only HS256 is supported. RS256/ES256 with PEM keys may be added in a future update.",
    },
  ],
  "/html-entity": [
    {
      q: "What are HTML entities?",
      a: "HTML entities are special character sequences (like &amp; for & or &lt; for <) that allow reserved or non-ASCII characters to appear in HTML without breaking the markup.",
    },
  ],
  "/string-escape": [
    {
      q: "What does string escaping do?",
      a: "It adds backslash escape sequences to characters that have special meaning in JavaScript, JSON, or other languages (e.g. converting a double-quote \" to \\\").",
    },
  ],
  "/json-yaml": [
    {
      q: "Can the converter handle deeply nested structures?",
      a: "Yes. The converter preserves all nesting levels, arrays, and scalar types when converting in both directions.",
    },
    {
      q: "What happens to YAML anchors and aliases?",
      a: "YAML anchors and aliases are resolved before conversion, so the resulting JSON contains the fully expanded data.",
    },
  ],
  "/csv-json": [
    {
      q: "What CSV formats are supported?",
      a: "The tool supports comma-separated and semicolon-separated files with or without a header row. Values wrapped in double quotes (with embedded commas or newlines) are handled correctly.",
    },
  ],
  "/json-ts": [
    {
      q: "What TypeScript does the generator produce?",
      a: "It infers TypeScript interfaces with optional properties for nullable fields, union types for mixed arrays, and nested interfaces for nested objects.",
    },
    {
      q: "Are the types always 100% accurate?",
      a: "The generator infers types from a single JSON sample. Fields that are null or always the same type may need manual refinement if the real data varies.",
    },
  ],
  "/color-converter": [
    {
      q: "Which color formats are supported?",
      a: "HEX, RGB, HSL, HSV, and CSS named colors. The tool also shows the nearest named CSS color.",
    },
  ],
  "/number-base": [
    {
      q: "Which bases are supported?",
      a: "Binary (2), octal (8), decimal (10), and hexadecimal (16). Enter a number in any base and see it converted to all others instantly.",
    },
  ],
  "/timestamp": [
    {
      q: "What time formats does the converter support?",
      a: "Unix timestamp (seconds and milliseconds), ISO 8601 / RFC 3339, and human-readable local time.",
    },
    {
      q: "Which timezone is used?",
      a: "Timestamps are displayed in your browser's local timezone as well as UTC.",
    },
  ],
  "/xml-json": [
    {
      q: "Does the XML-to-JSON converter preserve attributes?",
      a: "Yes. XML attributes are mapped to a special @ key by default so no information is lost.",
    },
  ],
  "/date-calculator": [
    {
      q: "What can the date calculator do?",
      a: "It calculates the difference between two dates (in days, weeks, months, years), adds or subtracts a duration from a date, and converts between common date formats.",
    },
  ],
  "/unit-converter": [
    {
      q: "Which unit categories are covered?",
      a: "Length, weight/mass, temperature, area, volume, speed, data storage, and time.",
    },
  ],
  "/image-base64": [
    {
      q: "What image formats can I encode?",
      a: "Any format your browser can read: PNG, JPEG, GIF, WebP, SVG, and BMP.",
    },
    {
      q: "Is there a file size limit?",
      a: "There is no hard limit, but very large images (several megabytes) may slow down the browser. For large files, consider resizing first.",
    },
  ],
  "/text-binary": [
    {
      q: "What encoding is used for text-to-binary conversion?",
      a: "UTF-8. Each character is converted to its byte representation in binary (8 bits per byte).",
    },
  ],
  "/aspect-ratio": [
    {
      q: "What is an aspect ratio?",
      a: "An aspect ratio describes the proportional relationship between width and height (e.g. 16:9 means 16 units wide for every 9 units tall).",
    },
  ],
  "/url-parser": [
    {
      q: "What does the URL parser show?",
      a: "It breaks a URL into its components: protocol, hostname, port, pathname, query string parameters (as key-value pairs), and fragment.",
    },
  ],
  "/markdown-html": [
    {
      q: "Which Markdown features are supported?",
      a: "Standard CommonMark syntax: headings, paragraphs, bold, italic, code blocks, blockquotes, lists, tables, and links.",
    },
  ],
  "/hash": [
    {
      q: "Which hash algorithms are available?",
      a: "MD5, SHA-1, SHA-256, SHA-384, SHA-512, and CRC32.",
    },
    {
      q: "Are hashes computed server-side?",
      a: "No. Hashing runs entirely in your browser using the Web Crypto API and a WASM implementation — your data never leaves your machine.",
    },
  ],
  "/uuid": [
    {
      q: "Which UUID versions are generated?",
      a: "v4 (random) is the default. The tool can also generate v1 (time-based) and nil UUIDs.",
    },
  ],
  "/password": [
    {
      q: "Are the generated passwords cryptographically secure?",
      a: "Yes. Passwords are generated using the browser's crypto.getRandomValues() API, which produces cryptographically strong random values.",
    },
  ],
  "/lorem": [
    {
      q: "What is Lorem Ipsum?",
      a: "Lorem Ipsum is placeholder text derived from a work by Cicero. It is widely used in design and publishing to fill space before final copy is available, without distracting readers with meaningful content.",
    },
  ],
  "/qr-code": [
    {
      q: "What can I encode in a QR code?",
      a: "Any text string: URLs, Wi-Fi credentials, contact cards (vCard), plain text, or phone numbers.",
    },
    {
      q: "Can I download the generated QR code?",
      a: "Yes. Click the download button to save the QR code as a PNG image.",
    },
  ],
  "/fake-data": [
    {
      q: "What kinds of fake data can be generated?",
      a: "Names, emails, phone numbers, addresses, companies, dates, UUIDs, colors, and more — all configurable by locale.",
    },
  ],
  "/slug": [
    {
      q: "What is a URL slug?",
      a: "A slug is a URL-friendly version of a string: lowercase, with spaces replaced by hyphens and special characters removed (e.g. 'Hello World!' becomes 'hello-world').",
    },
  ],
  "/markdown-table": [
    {
      q: "What is a Markdown table?",
      a: "A Markdown table is a text-based grid defined with pipes | and hyphens. It renders as an HTML table in most Markdown processors like GitHub, GitLab, and Notion.",
    },
  ],
  "/meta-tag": [
    {
      q: "What meta tags does the generator create?",
      a: "Basic title/description, Open Graph (og:*) tags for Facebook and LinkedIn, and Twitter Card tags.",
    },
  ],
  "/css-gradient": [
    {
      q: "What gradient types are supported?",
      a: "Linear gradient (any angle) and radial gradient. You can add unlimited color stops and copy the resulting CSS.",
    },
  ],
  "/css-shadow": [
    {
      q: "Can I preview the shadow live?",
      a: "Yes. Adjust the sliders for X offset, Y offset, blur, spread, and color and the preview updates in real time.",
    },
  ],
  "/color-palette": [
    {
      q: "How does the palette generator work?",
      a: "Pick a base color and choose a harmony rule (complementary, triadic, analogous, split-complementary, or tetradic). The tool generates a matching palette with all HEX and HSL values.",
    },
  ],
  "/utm-builder": [
    {
      q: "What are UTM parameters?",
      a: "UTM parameters are query string tags added to URLs so analytics tools like Google Analytics can attribute traffic to specific campaigns, sources, and mediums.",
    },
    {
      q: "Are there required UTM parameters?",
      a: "utm_source and utm_medium are required. utm_campaign is strongly recommended. utm_term and utm_content are optional.",
    },
  ],
  "/regex": [
    {
      q: "What regex flavors are supported?",
      a: "JavaScript regex (the native browser regex engine), including all ES2024 features like named capture groups, lookbehind assertions, and the v flag for set notation.",
    },
    {
      q: "Why does my regex work in one tool but not here?",
      a: "Different languages have slightly different regex engines. This tool uses JavaScript's engine specifically. Features like \\p{} Unicode property escapes require the u or v flag.",
    },
  ],
  "/cron": [
    {
      q: "What CRON format is used?",
      a: "Standard 5-field CRON format: minute hour day-of-month month day-of-week. The tool also supports non-standard extensions like @daily and @weekly shorthand.",
    },
    {
      q: "How many future runs does the tool show?",
      a: "The tool displays the next 10 scheduled run times in your local timezone.",
    },
  ],
  "/text-diff": [
    {
      q: "What diff algorithm is used?",
      a: "The tool uses a line-by-line diff algorithm (similar to Unix diff) highlighting added, removed, and unchanged lines with color coding.",
    },
  ],
  "/word-counter": [
    {
      q: "What does the word counter measure?",
      a: "Characters (with and without spaces), words, sentences, paragraphs, and estimated reading time at 200 words per minute.",
    },
  ],
  "/text-case": [
    {
      q: "What case transformations are available?",
      a: "UPPER CASE, lower case, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, and dot.case.",
    },
  ],
  "/byte-size": [
    {
      q: "What does the byte size calculator show?",
      a: "The byte size of your text in UTF-8, UTF-16, and ASCII encodings — useful when working with database field limits or network payload budgets.",
    },
  ],
  "/http-status": [
    {
      q: "What does the HTTP status tool do?",
      a: "It provides the official meaning, category, and common use cases for any HTTP status code from 100 to 599.",
    },
  ],
  "/user-agent": [
    {
      q: "What does the user-agent parser show?",
      a: "Browser name and version, OS name and version, device type (desktop/mobile/tablet), and rendering engine.",
    },
  ],
  "/jsonpath": [
    {
      q: "What is JSONPath?",
      a: "JSONPath is a query language for JSON, similar to XPath for XML. It lets you extract specific values or arrays of values from JSON using dot-notation and bracket-notation paths.",
    },
    {
      q: "Which JSONPath syntax is supported?",
      a: "JSONPath Plus (a superset of Goessner's original specification) including recursive descent (..), wildcards (*), filter expressions (?()) and union ([a,b]).",
    },
  ],
  "/ip-subnet": [
    {
      q: "What does the subnet calculator show?",
      a: "For any IP address in CIDR notation (e.g. 192.168.1.0/24) it shows the network address, broadcast address, subnet mask, usable host range, and total host count.",
    },
  ],
  "/chmod": [
    {
      q: "How does the chmod calculator work?",
      a: "Toggle the read, write, and execute checkboxes for Owner, Group, and Others. The tool shows the resulting numeric (octal) and symbolic permission string.",
    },
  ],
  "/semver": [
    {
      q: "What is Semantic Versioning?",
      a: "SemVer is a versioning scheme using three numbers MAJOR.MINOR.PATCH. Breaking changes bump MAJOR, new backwards-compatible features bump MINOR, and bug fixes bump PATCH.",
    },
  ],
  "/line-sorter": [
    {
      q: "What sorting options are available?",
      a: "Alphabetical (A-Z, Z-A), reverse, random shuffle, by line length, numeric, remove duplicates, and trim whitespace.",
    },
  ],
  "/find-replace": [
    {
      q: "Does find & replace support regex?",
      a: "Yes. Toggle regex mode to use JavaScript regular expression syntax in the find field.",
    },
  ],
  "/percentage": [
    {
      q: "What types of percentage calculations are included?",
      a: "Percentage of a number, what percent X is of Y, percentage change between two values, and adding or subtracting a percentage from a value.",
    },
  ],
  "/csv-viewer": [
    {
      q: "What CSV features does the viewer support?",
      a: "Paste or upload CSV data and view it as a sortable table with support for comma, semicolon, and tab delimiters.",
    },
  ],
  "/json-diff": [
    {
      q: "What does the JSON diff tool show?",
      a: "It compares two JSON documents and highlights added keys (green), removed keys (red), and changed values (yellow) at every nesting level.",
    },
  ],
  "/password-strength": [
    {
      q: "How is password strength calculated?",
      a: "Strength is scored based on length, character variety (uppercase, lowercase, numbers, symbols), and common weak patterns. Estimated crack time is shown for context.",
    },
  ],
  "/readability": [
    {
      q: "Which readability scores are shown?",
      a: "Flesch Reading Ease, Flesch-Kincaid Grade Level, Gunning Fog Index, and SMOG Index.",
    },
  ],
  "/ascii-table": [
    {
      q: "What does the ASCII table show?",
      a: "All 128 standard ASCII characters with their decimal, hexadecimal, binary values, and HTML entity (where applicable).",
    },
  ],
  "/color-contrast": [
    {
      q: "What WCAG levels does the contrast checker test?",
      a: "WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large text) and AAA (7:1 for normal text, 4.5:1 for large text).",
    },
    {
      q: "How is contrast ratio calculated?",
      a: "Using the WCAG relative luminance formula: it linearizes sRGB values and computes the ratio of the lighter to the darker luminance.",
    },
  ],
  "/number-formatter": [
    {
      q: "What formatting options are available?",
      a: "Locale-aware thousand separators, decimal places, prefix/suffix, and currency formatting using the browser's Intl.NumberFormat API.",
    },
  ],
  "/markdown-html-table": [
    {
      q: "How do I use the Markdown table converter?",
      a: "Paste your Markdown table (using | and - syntax) and the tool outputs clean HTML <table> markup with thead/tbody and optional CSS classes.",
    },
    {
      q: "Can it also convert HTML tables back to Markdown?",
      a: "Yes. Paste an HTML table and toggle to HTML → Markdown mode to get the corresponding Markdown table.",
    },
  ],
};
