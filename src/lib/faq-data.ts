import type { FAQ } from "@/components/shared/FAQSection";

export const globalFAQs: FAQ[] = [
  {
    q: "Is this tool free to use?",
    a: "Yes — every tool on WebUtility is 100% free with no usage limits, no sign-up, and no paid tiers. All tools run entirely in your browser.",
  },
  {
    q: "Does my data leave the browser?",
    a: "No. Every tool processes your input locally using JavaScript. Nothing is ever sent to a server, so sensitive data like API keys, passwords, tokens, and personal information stays completely private on your device.",
  },
  {
    q: "Which browsers are supported?",
    a: "WebUtility works in all modern browsers — Chrome, Firefox, Safari, and Edge (latest two major versions). No plugins, extensions, or installations are required.",
  },
];

export const faqData: Record<string, FAQ[]> = {

  // ── Formatters & Validators ────────────────────────────────────────────────

  "/json-formatter": [
    {
      q: "What is a JSON formatter and why do I need one?",
      a: "A JSON formatter (also called a JSON beautifier or JSON pretty-printer) parses raw JSON text and re-outputs it with consistent indentation and line breaks. This makes it far easier to read, debug, and review deeply nested data structures — especially when copying JSON from API responses or logs where it arrives as a single compressed line.",
    },
    {
      q: "Does the formatter fix broken or invalid JSON?",
      a: "No — the formatter requires syntactically valid JSON input. If your JSON has errors (trailing commas, unquoted keys, single quotes, JavaScript comments), the tool reports the exact line and character position of the first error so you can fix it manually. Use the error message to pinpoint the issue quickly.",
    },
    {
      q: "Can I minify JSON to reduce payload size?",
      a: "Yes. Switch to Minify mode to strip all whitespace, newlines, and indentation, producing the most compact valid JSON string. This is useful for reducing API payload sizes, config files, and localStorage values.",
    },
    {
      q: "How large a JSON file can I format?",
      a: "The formatter handles JSON files up to several megabytes without issues. Very large files (tens of MB) may cause a brief delay since all processing runs in the browser's JavaScript engine with no server offloading.",
    },
    {
      q: "Is JSON formatting the same as JSON validation?",
      a: "Formatting and validation are related but different. Formatting only restructures valid JSON. Validation checks whether the data conforms to a specific schema (types, required fields, constraints). Use this tool to check syntax; use the JSON Schema Validator tool to check structure.",
    },
  ],

  "/xml-formatter": [
    {
      q: "What does the XML formatter do?",
      a: "It parses your XML document and re-serializes it with consistent indentation and line breaks, making deeply nested markup readable at a glance. It also reports well-formedness errors like unclosed tags, mismatched elements, or missing attribute quotes.",
    },
    {
      q: "Does it validate XML against a DTD or XSD schema?",
      a: "The formatter performs well-formedness checks (balanced tags, correct attribute quoting, a single root element) but does not validate against an XSD or DTD schema. For schema validation you would need a server-side XML tool.",
    },
    {
      q: "Can I format very large XML files?",
      a: "Yes, though files over 5 MB may process slowly since the entire document must be parsed in the browser. For very large XML data consider breaking it into smaller chunks first.",
    },
    {
      q: "Does the formatter handle XML namespaces and CDATA?",
      a: "Yes. Namespace prefixes and declarations (xmlns:) are preserved exactly as written. CDATA sections are kept intact without modification to avoid changing embedded content.",
    },
  ],

  "/sql-formatter": [
    {
      q: "Which SQL dialects are supported?",
      a: "The formatter understands standard SQL keywords plus extensions from MySQL, PostgreSQL, SQLite, SQL Server (T-SQL), and Oracle. Most SELECT, INSERT, UPDATE, DELETE, CREATE, and ALTER statements from any of these dialects will format correctly.",
    },
    {
      q: "Will formatting change my query logic or results?",
      a: "No — the formatter only changes whitespace, indentation, and keyword capitalization. It never rewrites clauses, reorders predicates, or alters the logical meaning of your query. The formatted output is semantically identical to the input.",
    },
    {
      q: "Can I use this to clean up stored procedures and CTEs?",
      a: "Yes. The formatter handles complex queries including CTEs (WITH clauses), subqueries, window functions, CASE expressions, and multi-statement stored procedures.",
    },
    {
      q: "How do I format SQL quickly without copy-pasting?",
      a: "Paste your SQL into the input area and the formatted output appears instantly on the right. Use the copy button to grab the result in one click.",
    },
  ],

  "/css-formatter": [
    {
      q: "What does the CSS formatter do?",
      a: "It parses your CSS stylesheet and outputs it with normalized spacing, consistent brace placement, and one declaration per line. The result is easier to read, review in code diffs, and maintain.",
    },
    {
      q: "Can I minify CSS for production?",
      a: "Yes. Switch to Minify mode to strip all comments, whitespace, and newlines, producing a single-line production-ready stylesheet. Minified CSS reduces file size and improves page load times.",
    },
    {
      q: "Does it handle CSS variables, media queries, and nested rules?",
      a: "Yes — CSS custom properties (--variables), @media, @keyframes, @supports, and pseudo-selectors are all preserved correctly. The formatter works on any valid CSS3/CSS4 syntax.",
    },
    {
      q: "Will the formatter change property order?",
      a: "By default, properties are kept in their original order. The formatter only normalizes whitespace and structure, not the sequence of declarations.",
    },
  ],

  "/html-formatter": [
    {
      q: "What does the HTML formatter do?",
      a: "It parses your HTML markup and re-indents it with consistent nesting, making complex templates and long documents much easier to read, diff, and edit.",
    },
    {
      q: "Will it break inline scripts or styles?",
      a: "No. The contents of <script> and <style> blocks are left completely untouched to avoid inadvertently changing their behavior. Only the surrounding HTML structure is reformatted.",
    },
    {
      q: "Can I minify HTML to reduce page size?",
      a: "Yes — switch to Minify mode to collapse whitespace between tags, remove optional end tags, and strip HTML comments, reducing the size of your HTML markup for production delivery.",
    },
    {
      q: "Does it handle HTML5 void elements correctly?",
      a: "Yes. Void elements like <br>, <img>, <input>, and <meta> are formatted correctly without adding a closing tag or unnecessary self-closing slash.",
    },
  ],

  "/markdown-preview": [
    {
      q: "What Markdown syntax does the preview support?",
      a: "The preview supports CommonMark-compliant Markdown: headings (#), bold (**), italic (*), code blocks (```), inline code, blockquotes (>), ordered and unordered lists, tables, horizontal rules, and links. GitHub Flavored Markdown (GFM) extensions like task lists and strikethrough are also supported.",
    },
    {
      q: "Can I use this to preview README files?",
      a: "Yes — paste your README.md content and the preview renders it exactly as GitHub would. This is useful for checking formatting before committing.",
    },
    {
      q: "Does the preview update in real time?",
      a: "Yes. The rendered HTML preview updates instantly as you type with no need to click a button.",
    },
  ],

  "/json-schema": [
    {
      q: "What is a JSON Schema and what does the generator produce?",
      a: "JSON Schema is a vocabulary for describing the structure of JSON data — specifying types, required fields, allowed values, and nested object shapes. This tool analyzes a sample JSON object and automatically generates a Draft-07 schema that describes it.",
    },
    {
      q: "Which JSON Schema draft is used?",
      a: "The generator outputs JSON Schema Draft-07, which is the most widely supported version across popular validators like Ajv, jsonschema (Python), and everit-org/json-schema (Java).",
    },
    {
      q: "Are the generated schemas always accurate?",
      a: "The schema is inferred from a single JSON sample. If a field is null in your sample it will be typed null, and if an array contains only one type the schema will assume that type. Review and refine the output to add constraints like minLength, enum values, or additional optional fields your sample doesn't include.",
    },
    {
      q: "How do I validate JSON against the generated schema?",
      a: "Copy the generated schema and use it in the JSON Schema Validator tool on this site, or import it into your application with a library like Ajv (JavaScript), jsonschema (Python), or any other JSON Schema Draft-07 compliant validator.",
    },
  ],

  "/yaml-validator": [
    {
      q: "What kinds of YAML errors does the validator catch?",
      a: "It catches indentation mistakes (mixing tabs and spaces), duplicate keys, invalid scalar values, unclosed block sequences, and malformed multiline strings. Clear error messages include the line number so you can jump directly to the problem.",
    },
    {
      q: "Does it also format or prettify YAML?",
      a: "Yes — after validation passes, the tool re-serializes the parsed document as normalized YAML with consistent indentation (2 spaces), sorted keys (optional), and proper quoting of special strings.",
    },
    {
      q: "Is YAML 1.1 or 1.2 supported?",
      a: "The validator uses the js-yaml library which primarily targets YAML 1.2. Most YAML 1.1 documents parse correctly; the key difference is that bare yes/no/on/off values are treated as strings in 1.2, not booleans.",
    },
    {
      q: "Can I validate Kubernetes or Docker Compose YAML files?",
      a: "Yes — the tool validates any YAML file's syntax regardless of its purpose. It confirms the YAML is well-formed but does not check Kubernetes CRD schemas or Docker Compose field constraints.",
    },
  ],

  "/json-schema-validator": [
    {
      q: "What is JSON Schema validation and why is it useful?",
      a: "JSON Schema validation checks that a JSON document conforms to a predefined schema — verifying that required fields are present, values are the correct type, strings match patterns, and numbers are within bounds. It's essential for API contract testing, configuration validation, and data quality checks.",
    },
    {
      q: "Which JSON Schema version does this validator support?",
      a: "The validator uses Ajv and supports JSON Schema Draft-07, including keywords like $ref, allOf, anyOf, oneOf, not, if/then/else, and all standard format validators.",
    },
    {
      q: "How detailed are the validation error messages?",
      a: "Each error includes the JSON path of the failing field (e.g. /user/email), the failed keyword (e.g. format), and the expected vs. actual value. This makes it easy to pinpoint exactly which part of your document fails the schema.",
    },
  ],

  "/js-minifier": [
    {
      q: "What does the JavaScript minifier do?",
      a: "It removes comments (both // and /* */), collapses multiple spaces and newlines into single characters, and eliminates unnecessary whitespace — reducing file size without changing the runtime behavior of the code.",
    },
    {
      q: "Does it rename variables or apply tree-shaking?",
      a: "No — this is a whitespace-only minifier. It does not rename variables, inline constants, or remove dead code. For full optimization use a build tool like esbuild, Terser, or webpack's production mode.",
    },
    {
      q: "Is the minified output safe to use in production?",
      a: "Yes for whitespace removal — the logic is unchanged. However, always test the minified output in your environment before deploying, especially if your code relies on Function.name or error.stack string matching.",
    },
  ],

  "/svg-minifier": [
    {
      q: "What does the SVG minifier remove?",
      a: "It strips XML comments, editor metadata (inkscape:, sodipodi: namespaces), unnecessary whitespace between tags, default attribute values, and redundant group elements — typically reducing SVG file size by 30–70%.",
    },
    {
      q: "Will minification break my SVG animations or styles?",
      a: "The minifier preserves all rendering instructions, paths, styles, and animation attributes. Only non-rendering metadata and unnecessary whitespace are removed.",
    },
    {
      q: "Can I use minified SVGs inline in HTML?",
      a: "Yes — minified SVGs are fully valid and can be embedded directly in HTML, used as CSS backgrounds with data URIs, or referenced as external files.",
    },
  ],

  // ── Encoders & Decoders ────────────────────────────────────────────────────

  "/base64": [
    {
      q: "What is Base64 encoding and when should I use it?",
      a: "Base64 converts binary data (or any text) into a string of 64 ASCII characters (A-Z, a-z, 0-9, +, /). It is used whenever binary data needs to travel over text-based channels: embedding images in HTML/CSS data URLs, encoding email attachments, storing binary values in JSON, and transmitting data in HTTP headers.",
    },
    {
      q: "Can I encode files, not just text?",
      a: "Yes — use the file input to select any binary file (image, PDF, font, audio). The tool reads it as a binary buffer and outputs the Base64 data URL (data:mime/type;base64,...) ready to embed directly in HTML or CSS.",
    },
    {
      q: "What is URL-safe Base64 and when should I use it?",
      a: "Standard Base64 uses + and / which have special meaning in URLs and filenames. URL-safe Base64 replaces + with - and / with _ so the string can appear in a URL query parameter, filename, or cookie without percent-encoding.",
    },
    {
      q: "Why does decoded Base64 sometimes look like garbage?",
      a: "If the original data was binary (an image, PDF, or compressed file), decoding it as text will produce unreadable characters because binary bytes don't map to printable text. The tool is best for text content or use the file download option for binary output.",
    },
  ],

  "/url-encoder": [
    {
      q: "What is URL encoding (percent-encoding)?",
      a: "URL encoding replaces characters that are unsafe in a URL (spaces, #, &, =, <, >, non-ASCII characters) with a % followed by their two-digit hexadecimal byte value. For example, a space becomes %20 and & becomes %26.",
    },
    {
      q: "When should I use encodeURI vs encodeURIComponent?",
      a: "Use encodeURIComponent when encoding an individual query parameter value — it encodes everything except letters, digits, - _ . ! ~ * ' ( ). Use encodeURI when encoding an entire URL — it preserves the structure characters (/ : ? # & =) so the URL remains valid.",
    },
    {
      q: "How do I decode a URL that has %XX sequences?",
      a: "Paste the percent-encoded string into the input field and switch to Decode mode. The tool will replace each %XX sequence with its UTF-8 character, restoring the original string.",
    },
    {
      q: "Does the tool handle Unicode characters in URLs?",
      a: "Yes — non-ASCII characters (accented letters, CJK characters, emoji) are first encoded as UTF-8 bytes, then each byte is percent-encoded per RFC 3986. This is the correct encoding for internationalized URLs (IRIs).",
    },
  ],

  "/jwt-decoder": [
    {
      q: "What parts of a JWT does the decoder show?",
      a: "A JWT has three Base64URL-encoded parts separated by dots: the header (algorithm and token type), the payload (claims like sub, iat, exp, aud), and the signature. The decoder displays both the header and payload as formatted JSON and highlights the expiry time in human-readable form.",
    },
    {
      q: "Does the decoder verify the JWT signature?",
      a: "No — signature verification requires knowing the secret key or public key. The decoder only decodes the header and payload, which are not encrypted. Use the JWT Generator tool to create signed tokens and verify them in your application with a JWT library.",
    },
    {
      q: "Is it safe to paste a production JWT here?",
      a: "The tool runs entirely in your browser — nothing is sent to any server. However, as a security best practice, avoid pasting production access tokens or ID tokens from sensitive systems into any web tool, since anyone with physical access to your browser could see them in history.",
    },
    {
      q: "What does the exp claim in the payload mean?",
      a: "The exp (expiration) claim is a Unix timestamp (seconds since January 1 1970 UTC). The decoder converts it to a human-readable local date/time so you can instantly tell if the token has expired.",
    },
  ],

  "/jwt-generator": [
    {
      q: "Does this tool create real, usable JWT tokens?",
      a: "Yes — it signs tokens using HMAC-SHA256 (HS256) with a secret you provide, producing a standard JWT that any compliant library (jsonwebtoken in Node.js, PyJWT in Python, etc.) can verify using the same secret.",
    },
    {
      q: "Can I use asymmetric algorithms like RS256 or ES256?",
      a: "Currently only HS256 (HMAC-SHA256) is supported. Asymmetric algorithms (RS256, ES256) require PEM keys and may be added in a future update.",
    },
    {
      q: "What claims can I include in the payload?",
      a: "You can include any valid JSON in the payload — standard claims (sub, iss, aud, exp, iat, nbf, jti) and custom claims. Enter them as a JSON object in the payload field.",
    },
    {
      q: "Should I use a generated JWT in production?",
      a: "You can, as long as you use a strong, random secret (at least 256 bits of entropy) and set a sensible expiry (exp). The signing logic here is identical to server-side JWT libraries — the key difference is that this tool runs in your browser.",
    },
  ],

  "/html-entity": [
    {
      q: "What are HTML entities and why are they needed?",
      a: "HTML entities are special sequences (like &amp; for & or &lt; for <) that let you display reserved characters inside HTML without breaking the parser. They are also used for characters that are hard to type directly, like © (&copy;) or → (&rarr;).",
    },
    {
      q: "Which encoding modes are available?",
      a: "The tool supports encoding to named entities (&amp;), decimal numeric references (&#38;), and hexadecimal numeric references (&#x26;). Named entities are most human-readable; numeric references work for any Unicode character even without a named entity.",
    },
    {
      q: "Can I decode an HTML page full of entities back to plain text?",
      a: "Yes — paste the HTML-encoded text and switch to Decode mode. All &name;, &#decimal;, and &#xhex; sequences are replaced with their original characters.",
    },
  ],

  "/string-escape": [
    {
      q: "What does string escaping do?",
      a: "Escaping adds backslash sequences to characters that have special meaning inside a string literal. For example, a double-quote \" becomes \\\", a newline becomes \\n, and a tab becomes \\t — allowing the string to be safely embedded in JavaScript, JSON, SQL, or other code.",
    },
    {
      q: "Which languages are supported?",
      a: "The tool supports escaping and unescaping for JavaScript/JSON strings, SQL string literals, and HTML. Choose the target language from the mode selector.",
    },
    {
      q: "What is the difference between escaping and encoding?",
      a: "Escaping adds backslash sequences for a specific language's string syntax. Encoding (like Base64 or URL encoding) transforms the data into a different representation for transport. Use escaping when embedding a value inside source code; use encoding when transmitting data over a protocol.",
    },
  ],

  "/base32": [
    {
      q: "What is Base32 encoding?",
      a: "Base32 encodes binary data using only 32 characters: uppercase A-Z and digits 2-7. Because it avoids visually similar characters (0/O, 1/l) and is case-insensitive, it is used in contexts where humans might retype data — like TOTP secret keys and Crockford identifiers.",
    },
    {
      q: "Is this RFC 4648 Base32?",
      a: "Yes — the tool uses the standard Base32 alphabet defined in RFC 4648. This is the same encoding used by Google Authenticator, FreeOTP, and most TOTP implementations.",
    },
    {
      q: "How is Base32 different from Base64?",
      a: "Base64 uses 64 characters (including + and / ) and is about 33% larger than the original data. Base32 uses only 32 characters and is about 60% larger, but is safer for human transcription and case-insensitive environments.",
    },
  ],

  "/morse-code": [
    {
      q: "What is Morse code?",
      a: "Morse code represents letters and digits as sequences of short signals (dots ·) and long signals (dashes −). It was invented by Samuel Morse in the 1830s for telegraph communication and is still used in aviation, amateur radio, and accessibility applications.",
    },
    {
      q: "Can I decode Morse code back to text?",
      a: "Yes — paste a Morse code string using dots (.), dashes (-), spaces between characters, and forward slashes (/) between words, then switch to Decode mode.",
    },
    {
      q: "What characters are supported?",
      a: "All 26 letters (A–Z), digits 0–9, and common punctuation marks (., ,, ?, !, /, (, ), :, ;, =, +, −, _, \", $, @).",
    },
  ],

  "/text-encryptor": [
    {
      q: "What encryption algorithm is used?",
      a: "Text is encrypted with AES-256-GCM (Advanced Encryption Standard, 256-bit key, Galois/Counter Mode) using the browser's native Web Crypto API. AES-256-GCM provides authenticated encryption — it both encrypts and integrity-checks the data.",
    },
    {
      q: "Is the encryption secure enough for sensitive data?",
      a: "AES-256-GCM is a NIST-approved standard used by governments and the financial industry. The security depends entirely on your passphrase — use a long, random passphrase for maximum protection.",
    },
    {
      q: "What happens if I lose the passphrase?",
      a: "There is no recovery. AES-256-GCM is designed to be computationally infeasible to break without the key. Keep your passphrase safe — there is no back door.",
    },
    {
      q: "Does the encrypted output leave my browser?",
      a: "No — all encryption and decryption runs locally in your browser using the Web Crypto API. Nothing is sent to any server.",
    },
  ],

  // ── Converters ─────────────────────────────────────────────────────────────

  "/json-yaml": [
    {
      q: "Can the converter handle deeply nested JSON structures?",
      a: "Yes — all nesting levels, arrays, objects, and scalar types (strings, numbers, booleans, nulls) are preserved when converting in both directions.",
    },
    {
      q: "What happens to YAML anchors and aliases when converting to JSON?",
      a: "YAML anchors (&name) and aliases (*name) are resolved before conversion, so the resulting JSON contains the fully expanded data without any YAML-specific syntax.",
    },
    {
      q: "Are there data types that don't convert cleanly?",
      a: "JSON has no native date type — YAML dates like 2024-01-15 become strings in JSON. JSON also lacks YAML's binary and null-alias (~ → null) handling. In most cases these edge cases are handled gracefully with sensible defaults.",
    },
    {
      q: "Which YAML specification is used?",
      a: "The converter targets YAML 1.2, which is the version used by modern tools. The key practical difference from YAML 1.1 is that bare true/false are the only boolean values — yes/no and on/off are treated as strings.",
    },
  ],

  "/csv-json": [
    {
      q: "What CSV formats does the converter support?",
      a: "Comma-separated, semicolon-separated, tab-separated, and pipe-separated files, with or without a header row. Quoted fields containing commas or newlines are handled correctly per RFC 4180.",
    },
    {
      q: "How does the converter handle the header row?",
      a: "When a header row is present, each column name becomes a JSON object key. Without a header, each row becomes a JSON array of values. You can toggle header detection in the options.",
    },
    {
      q: "Can I convert JSON back to CSV?",
      a: "Yes — paste an array of JSON objects and switch to JSON → CSV mode. Each object key becomes a column header and values fill the rows.",
    },
    {
      q: "What happens to empty cells or missing values?",
      a: "Empty CSV cells are converted to empty strings (\"\") in JSON. If you want null instead, you can post-process the JSON or handle it in your application code.",
    },
  ],

  "/json-to-ts": [
    {
      q: "What TypeScript does the generator produce?",
      a: "It infers TypeScript interfaces from a JSON object — generating typed properties for strings, numbers, booleans, arrays, and nested objects. Optional properties are generated for null values.",
    },
    {
      q: "Are the generated types always 100% accurate?",
      a: "The generator infers types from a single JSON sample. Fields that are null in the sample are typed null | string (or similar), and arrays with mixed types may need manual refinement. Always review the output for fields where the real data may vary.",
    },
    {
      q: "Does it handle arrays of objects?",
      a: "Yes — an array of objects generates an interface for the item type and types the property as ItemType[]. Nested arrays and objects are recursively typed.",
    },
    {
      q: "Can I use the generated types directly in my project?",
      a: "Yes — copy the output and paste it into a .ts or .d.ts file in your project. The interfaces are standard TypeScript and compatible with any TypeScript project.",
    },
  ],

  "/color-converter": [
    {
      q: "Which color formats are supported?",
      a: "HEX (#rrggbb, #rgb), RGB (rgb(r, g, b)), RGBA with alpha, HSL (hsl(h, s%, l%)), HSV/HSB, and CSS named colors (e.g. 'tomato', 'dodgerblue'). Enter any format and get all others instantly.",
    },
    {
      q: "What is the difference between HSL and HSV?",
      a: "HSL (Hue, Saturation, Lightness) and HSV (Hue, Saturation, Value/Brightness) are both cylindrical color models but differ in how 'lightness' and 'brightness' work. HSL is more intuitive for CSS; HSV is commonly used in design software color pickers.",
    },
    {
      q: "Can I convert colors with transparency/alpha?",
      a: "Yes — for RGBA and HSLA colors, the alpha channel (0–1 or 0–255) is preserved and shown across all output formats that support it.",
    },
  ],

  "/number-base": [
    {
      q: "Which number bases are supported?",
      a: "Binary (base 2), octal (base 8), decimal (base 10), and hexadecimal (base 16). Enter a number in any base and all four representations update instantly.",
    },
    {
      q: "How do I enter a hexadecimal number?",
      a: "Type the hex digits (0-9, A-F) in the HEX input field — the 0x prefix is optional. The tool accepts both uppercase and lowercase hex digits.",
    },
    {
      q: "What is the largest number the converter handles?",
      a: "The converter handles integers up to JavaScript's Number.MAX_SAFE_INTEGER (2^53 − 1). For larger numbers you would need a BigInt-based tool.",
    },
    {
      q: "Why are binary numbers so long?",
      a: "Each decimal digit can represent 0–9 (10 values), but each binary digit only represents 0 or 1. So decimal 255 requires 8 binary digits (11111111). Hexadecimal is the compact alternative: decimal 255 = hex FF.",
    },
  ],

  "/timestamp": [
    {
      q: "What is a Unix timestamp?",
      a: "A Unix timestamp is the number of seconds (or milliseconds) elapsed since January 1, 1970 00:00:00 UTC — also called the Unix epoch. It is the standard time representation in most programming languages, databases, and APIs because it is timezone-agnostic and easy to compare arithmetically.",
    },
    {
      q: "Does the converter use seconds or milliseconds?",
      a: "Both — the tool auto-detects whether your timestamp is in seconds (10 digits, ~year 2001–2286) or milliseconds (13 digits). You can also switch manually.",
    },
    {
      q: "Which timezone are converted dates shown in?",
      a: "Converted dates are shown in both your browser's local timezone and UTC so you can verify the conversion in either context.",
    },
    {
      q: "What is ISO 8601 format?",
      a: "ISO 8601 is the international standard for date/time strings: e.g. 2024-07-15T14:30:00Z. The T separates date and time, and Z means UTC. This format is unambiguous and widely supported in JSON APIs and databases.",
    },
  ],

  "/xml-json": [
    {
      q: "How are XML attributes handled during conversion?",
      a: "XML attributes are mapped to keys prefixed with @ in the JSON output (e.g. <user id=\"42\"> becomes {\"@id\": \"42\"}). This preserves all information without losing the distinction between attributes and child elements.",
    },
    {
      q: "What happens to XML namespaces?",
      a: "Namespace prefixes and their URIs are preserved in the JSON output. The xmlns declarations appear as @ attributes on the element where they are defined.",
    },
    {
      q: "Can I convert JSON back to XML?",
      a: "Yes — paste JSON and switch to JSON → XML mode. Object keys become element names and @ keys become attributes.",
    },
  ],

  "/date-calculator": [
    {
      q: "What can the date calculator compute?",
      a: "It calculates the difference between two dates in days, weeks, months, and years; adds or subtracts a duration (N days/weeks/months/years) to a date; and shows the day of the week for any date.",
    },
    {
      q: "Does it account for leap years?",
      a: "Yes — the calculator handles leap years correctly for both day-difference calculations and when adding months across a February 29.",
    },
    {
      q: "Can I calculate business days (excluding weekends)?",
      a: "The tool calculates calendar days. For business day calculations that exclude weekends and holidays, you would need to specify a regional holiday calendar which is beyond the scope of this tool.",
    },
  ],

  "/unit-converter": [
    {
      q: "Which unit categories does the converter cover?",
      a: "Length (mm, cm, m, km, in, ft, yd, mi), weight/mass (mg, g, kg, t, oz, lb), temperature (°C, °F, K), area, volume, speed, digital storage (bytes to terabytes), and time.",
    },
    {
      q: "How accurate are the conversions?",
      a: "All conversions use standard SI-defined relationships and IEEE 754 double-precision arithmetic. Results are accurate to approximately 15 significant figures — more than enough for engineering and everyday use.",
    },
    {
      q: "Does the temperature converter handle Kelvin?",
      a: "Yes — all three temperature scales (Celsius, Fahrenheit, Kelvin) are supported. Kelvin uses absolute zero (0 K = −273.15 °C) with no negative values.",
    },
  ],

  "/url-parser": [
    {
      q: "What components does the URL parser extract?",
      a: "Protocol (https://), hostname, port (if non-default), pathname (/path/to/resource), query string broken into individual key-value pairs, and the fragment (#anchor). Each component is shown in a separate labeled field.",
    },
    {
      q: "Can it parse malformed or partial URLs?",
      a: "The parser uses the browser's native URL API which is strict — it requires at minimum a valid protocol and hostname. Relative paths without a host are not supported.",
    },
    {
      q: "Can I use this to debug API endpoint URLs?",
      a: "Absolutely — paste any API endpoint URL to see its query parameters broken out individually. This is useful when debugging OAuth redirect URLs, webhook endpoints, or UTM-tagged links.",
    },
  ],

  "/markdown-html": [
    {
      q: "What Markdown features are converted to HTML?",
      a: "All CommonMark syntax: headings (h1–h6), paragraphs, bold, italic, strikethrough, inline code, fenced code blocks with language, blockquotes, ordered/unordered lists, task lists, tables, and links/images.",
    },
    {
      q: "Can I convert HTML back to Markdown?",
      a: "For HTML → Markdown conversion, use the HTML to Markdown tool on this site, which handles most common HTML elements.",
    },
    {
      q: "Is the output safe to inject into a web page?",
      a: "The converter outputs raw HTML including any script tags or event attributes that were in the original Markdown. Sanitize the output with a library like DOMPurify before injecting it into a page to prevent XSS.",
    },
  ],

  "/image-base64": [
    {
      q: "What image formats can I encode to Base64?",
      a: "Any image format your browser can read: JPEG, PNG, GIF, WebP, SVG, AVIF, and BMP. The output includes the correct MIME type in the data URL (data:image/png;base64,...).",
    },
    {
      q: "How do I use a Base64 image in HTML or CSS?",
      a: "For HTML use <img src=\"data:image/png;base64,...\">. For CSS use background-image: url('data:image/png;base64,...'). Both approaches embed the image directly without a separate HTTP request.",
    },
    {
      q: "Are there downsides to embedding images as Base64?",
      a: "Base64-encoded images are about 33% larger than the original binary file. They also cannot be cached independently by the browser. Use Base64 embedding for small icons or critical above-the-fold images; use regular <img> tags for larger images.",
    },
    {
      q: "Is there a file size limit?",
      a: "There is no enforced limit, but images over 2–3 MB may cause the browser to slow down since the entire file is read and encoded in memory. Consider resizing large images first using the Image Resizer tool.",
    },
  ],

  "/text-binary": [
    {
      q: "What encoding is used for text-to-binary conversion?",
      a: "UTF-8. Each character is first encoded as one or more UTF-8 bytes, and each byte is displayed as 8 binary digits (bits). ASCII characters use a single byte; emoji and accented characters use 2–4 bytes.",
    },
    {
      q: "What does the binary output look like?",
      a: "Each byte is represented as 8 zeros and ones separated by spaces. For example, the letter 'A' (ASCII 65) becomes 01000001.",
    },
    {
      q: "Can I decode binary back to text?",
      a: "Yes — paste a string of 0s and 1s (space-separated bytes) and switch to Decode mode to recover the original text.",
    },
  ],

  "/aspect-ratio": [
    {
      q: "What is an aspect ratio?",
      a: "An aspect ratio is the proportional relationship between a width and height, expressed as W:H. Common examples: 16:9 for HD video and widescreen monitors, 4:3 for older monitors and tablets, 1:1 for square images, and 9:16 for portrait mobile video.",
    },
    {
      q: "How do I calculate a new height from a known width?",
      a: "Enter the original width and height to establish the ratio, then enter your desired new width. The tool calculates the proportional height needed to maintain the exact same aspect ratio.",
    },
    {
      q: "What is the GCD reduction used for?",
      a: "The tool reduces the ratio to its simplest form using the Greatest Common Divisor. For example, 1920×1080 reduces to 16:9 because both numbers divide evenly by 120.",
    },
  ],

  "/html-to-markdown": [
    {
      q: "What HTML elements are converted to Markdown?",
      a: "Headings (h1–h6 → #), paragraphs, bold (strong → **), italic (em → *), links, images, ordered and unordered lists, blockquotes, code blocks (pre/code), tables, and horizontal rules.",
    },
    {
      q: "What happens to unsupported HTML elements?",
      a: "Elements without a Markdown equivalent (div, span, script, style, form) are either stripped or their text content is preserved as a plain text paragraph.",
    },
    {
      q: "Can I use this to migrate blog posts from a CMS to Markdown?",
      a: "Yes — this is one of the most common use cases. Copy the HTML source of a blog post, paste it here, and get clean Markdown ready for a static site generator like Hugo, Jekyll, or Next.js.",
    },
  ],

  "/toml-json": [
    {
      q: "What is TOML and when is it used?",
      a: "TOML (Tom's Obvious Minimal Language) is a configuration file format designed to be easy to read and map directly to a hash table. It is used in Rust projects (Cargo.toml), Hugo sites, and many CLI tools because it is less verbose than JSON and less indentation-sensitive than YAML.",
    },
    {
      q: "Can I convert JSON config files to TOML?",
      a: "Yes — paste any JSON object and switch to JSON → TOML mode. Nested objects become TOML sections ([section]) and arrays map to TOML arrays.",
    },
    {
      q: "Are TOML dates and times preserved in the conversion?",
      a: "TOML has native date, time, and datetime types. When converting TOML → JSON, datetime values become ISO 8601 strings. When converting JSON → TOML, ISO strings may need manual annotation as TOML datetimes.",
    },
  ],

  "/timezone-converter": [
    {
      q: "What is an IANA timezone?",
      a: "An IANA timezone (like America/New_York or Asia/Kolkata) is a named region in the official IANA timezone database that encodes all historical and future DST rules. Using IANA names instead of UTC offsets ensures correct conversions even when daylight saving time changes twice a year.",
    },
    {
      q: "Does the converter handle daylight saving time automatically?",
      a: "Yes — the converter uses the browser's Intl.DateTimeFormat API which applies DST rules automatically. If you enter a date during DST, the offset adjusts accordingly (e.g. New York is UTC-5 in winter but UTC-4 in summer EDT).",
    },
    {
      q: "How do I convert between IST and EST?",
      a: "Select Asia/Kolkata (IST, UTC+5:30) as the source and America/New_York as the destination. India Standard Time is 10h 30m ahead of EST (UTC-5) and 9h 30m ahead of EDT (UTC-4) during US daylight saving time.",
    },
    {
      q: "Can I convert from UTC to a local timezone?",
      a: "Yes — set the source to UTC and the destination to your local IANA zone (e.g. Europe/London, America/Los_Angeles, Asia/Tokyo).",
    },
  ],

  "/html-to-jsx": [
    {
      q: "What does the HTML to JSX converter change?",
      a: "It converts standard HTML to valid React JSX: renames class to className, renames for to htmlFor, converts style attributes from CSS strings to JavaScript objects ({color: 'red'}), self-closes void elements (<br />, <img />), and converts HTML comments to JSX comments.",
    },
    {
      q: "Does it handle SVG inside HTML?",
      a: "Yes — SVG attribute names use camelCase in JSX (strokeWidth, fillRule, etc.) and the converter applies these renames automatically.",
    },
    {
      q: "Can I paste a whole HTML page?",
      a: "Yes, but JSX expects a single root element. If your HTML has multiple top-level elements, the converter will wrap them in a React Fragment (<>) automatically.",
    },
  ],

  "/curl-to-code": [
    {
      q: "Which programming languages does the converter support?",
      a: "JavaScript fetch, JavaScript Axios, Python requests, Go net/http, and PHP cURL. Select the target language and the converter produces a ready-to-run code snippet.",
    },
    {
      q: "Can it handle curl commands with headers, cookies, and POST bodies?",
      a: "Yes — -H (headers), -d / --data (body), -b (cookies), -X (method), --user (basic auth), and -F (form data) are all parsed and mapped to the equivalent API in the target language.",
    },
    {
      q: "What is a practical use case for cURL to code conversion?",
      a: "API documentation often shows example requests as curl commands. This tool converts them into the language you are actually using, saving the time of manually translating headers, methods, and bodies.",
    },
  ],

  "/svg-png": [
    {
      q: "How does the SVG to PNG converter work?",
      a: "It renders the SVG onto an HTML5 Canvas element at the specified scale, then exports the canvas as a PNG image. All SVG rendering (shapes, text, gradients, filters) is handled by the browser's built-in SVG engine.",
    },
    {
      q: "What scale factors are available?",
      a: "1×, 2×, and 3× — giving you retina-ready versions of your SVG without manual resizing. A 100×100 SVG at 2× exports as a 200×200 PNG.",
    },
    {
      q: "Do SVG external fonts or images get included in the PNG?",
      a: "External resources referenced by URL in the SVG (fonts from Google Fonts, external images) may not be included if CORS blocks access. Embed fonts as data URIs and inline images as Base64 for reliable export.",
    },
  ],

  "/age-calculator": [
    {
      q: "What does the age calculator compute?",
      a: "It calculates your exact age in years, months, and days from a birth date to today (or any target date). It also shows total weeks lived, approximate hours, and the day of the week you were born.",
    },
    {
      q: "How is age calculated across different month lengths?",
      a: "The calculator uses the calendar month system: years count the number of times the birthday month/day has passed, months count partial year progress, and remaining days fill the gap. This matches how ages are stated in legal and medical contexts.",
    },
    {
      q: "Can I calculate the age between two arbitrary dates?",
      a: "Yes — change the reference date from 'today' to any past or future date to calculate the age or elapsed time between any two dates.",
    },
  ],

  "/world-clock": [
    {
      q: "How many timezones can I add at once?",
      a: "There is no hard limit — add as many IANA timezones as you need. Clocks tick in real time and update every second.",
    },
    {
      q: "Does the world clock account for DST changes?",
      a: "Yes — clocks use the Intl.DateTimeFormat API with the IANA timezone database, so DST transitions are applied automatically at the correct local moment.",
    },
    {
      q: "Can I use this to schedule international meetings?",
      a: "Yes — add the timezones of all participants to see the current time everywhere simultaneously, making it easy to find a working overlap across continents.",
    },
  ],

  "/crypto-converter": [
    {
      q: "Which cryptocurrencies and units are supported?",
      a: "Bitcoin (BTC → mBTC → μBTC → Satoshi) and Ethereum (ETH → Gwei → Mwei → Kwei → Wei). All conversions are exact integer arithmetic — no floating-point rounding for satoshi and wei.",
    },
    {
      q: "Are live exchange rates used?",
      a: "No — this tool converts between denominations of the same cryptocurrency (e.g. BTC to Satoshi), not between different currencies or fiat. For USD conversion you would need a live price feed.",
    },
  ],

  "/xml-yaml": [
    {
      q: "How are XML attributes mapped in YAML output?",
      a: "XML attributes become keys prefixed with @ in the YAML mapping. For example <item id=\"1\"> becomes item: {\"@id\": \"1\"}.",
    },
    {
      q: "Are XML namespaces preserved in the conversion?",
      a: "Yes — namespace prefixes and their URI declarations are kept as @ attributes on the element where they are declared.",
    },
  ],

  // ── Generators ─────────────────────────────────────────────────────────────

  "/hash-generator": [
    {
      q: "Which hash algorithms are available?",
      a: "MD5, SHA-1, SHA-256, SHA-384, SHA-512, and CRC32. SHA-256 is recommended for most modern use cases; MD5 and SHA-1 are considered cryptographically broken and should only be used for checksums, not security.",
    },
    {
      q: "Are hashes computed server-side?",
      a: "No — all hashing runs in your browser using the Web Crypto API (for SHA-256/384/512) and a JavaScript implementation (for MD5/CRC32). Your input text never leaves your device.",
    },
    {
      q: "Can I hash a file, not just text?",
      a: "Yes — use the file input to select any file and generate its hash. This is useful for verifying file integrity: download a file and compare its SHA-256 hash to the one published by the software vendor.",
    },
    {
      q: "Why is the same text producing a different hash than expected?",
      a: "The most common cause is whitespace: a trailing newline or extra space changes the hash completely. Check for invisible characters, ensure the encoding (UTF-8 vs. ASCII) matches, and verify you are hashing the same string.",
    },
  ],

  "/uuid-generator": [
    {
      q: "What is a UUID and what is it used for?",
      a: "A UUID (Universally Unique Identifier) is a 128-bit identifier formatted as 8-4-4-4-12 hexadecimal digits (e.g. 550e8400-e29b-41d4-a716-446655440000). UUIDs are used as primary keys in databases, unique filenames, session tokens, and anywhere a globally unique ID is needed without a central authority.",
    },
    {
      q: "What is the difference between UUID v4 and UUID v7?",
      a: "UUID v4 is randomly generated with no semantic meaning — each one is a random 128-bit value. UUID v7 is time-ordered: the first 48 bits encode a Unix millisecond timestamp, making v7 UUIDs sortable by creation time. This is better for database primary keys because it reduces index fragmentation.",
    },
    {
      q: "Are generated UUIDs truly unique?",
      a: "UUID v4 uses 122 random bits, giving 2^122 possible values — approximately 5.3 × 10^36. The probability of collision when generating one billion UUIDs per second for 100 years is about 50%. In practice, v4 UUIDs are unique for all practical purposes.",
    },
    {
      q: "Can I generate multiple UUIDs at once?",
      a: "Yes — set the batch count to generate up to 100 UUIDs at once, one per line, ready to copy into your code or database.",
    },
  ],

  "/password-generator": [
    {
      q: "Are generated passwords cryptographically secure?",
      a: "Yes — passwords are generated using the browser's crypto.getRandomValues() API, which produces cryptographically strong random values. This is the same source of randomness used by password managers and security libraries.",
    },
    {
      q: "What character sets can I include?",
      a: "Uppercase letters (A-Z), lowercase letters (a-z), digits (0-9), and symbols (!@#$%^&*). Toggle each set on or off and set the minimum count for each category to enforce complexity requirements.",
    },
    {
      q: "What does the entropy score mean?",
      a: "Entropy (measured in bits) quantifies how unpredictable a password is. A 12-character password with all character types has about 79 bits of entropy — effectively unguessable by brute force. Aim for at least 72 bits for modern security requirements.",
    },
    {
      q: "Should I use this to generate passwords for my accounts?",
      a: "Yes — the passwords are generated locally, never sent to a server, and are as secure as any dedicated password manager generator. Store them in a password manager like Bitwarden, 1Password, or KeePass.",
    },
  ],

  "/lorem-ipsum": [
    {
      q: "What is Lorem Ipsum text and where does it come from?",
      a: "Lorem Ipsum is placeholder text derived from 'de Finibus Bonorum et Malorum' (On the Ends of Good and Evil) by Cicero, written in 45 BC. It has been used as placeholder text in typesetting since the 1500s and remains the industry standard for design mockups.",
    },
    {
      q: "Can I generate by words, sentences, or paragraphs?",
      a: "Yes — choose your unit (words, sentences, or paragraphs) and set the quantity. Paragraphs are typically 5-7 sentences and simulate realistic block content for layout testing.",
    },
    {
      q: "Can I generate random text that starts with 'Lorem ipsum'?",
      a: "Yes — enable the 'Start with Lorem ipsum' option to begin the first paragraph with the classic opening 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...'",
    },
  ],

  "/qr-code": [
    {
      q: "What can I encode in a QR code?",
      a: "Any text string: URLs, Wi-Fi credentials (WIFI:T:WPA;S:NetworkName;P:Password;;), contact cards (vCard/MeCard), plain text, phone numbers (tel:+1234567890), email addresses (mailto:), and SMS.",
    },
    {
      q: "What is the error correction level?",
      a: "QR codes have four error correction levels: L (7%), M (15%), Q (25%), H (30%). Higher levels let the QR code be read even if up to 30% of it is obscured or damaged — useful for codes printed on physical objects that might get scratched. Higher error correction increases code size.",
    },
    {
      q: "Can I download the QR code?",
      a: "Yes — click the download button to save the QR code as a PNG image at the selected size. The downloaded file is ready to use in print, email, or web.",
    },
    {
      q: "What is the maximum amount of data I can encode?",
      a: "A QR code can hold up to 7,089 numeric characters, 4,296 alphanumeric characters, or 2,953 binary bytes. In practice, keep URLs under 200 characters to keep the QR code simple enough to scan reliably with any phone.",
    },
  ],

  "/fake-data": [
    {
      q: "What types of fake data can be generated?",
      a: "Names, email addresses, phone numbers, street addresses, company names, job titles, dates, UUIDs, colors, IP addresses, credit card numbers (test only), and more — all configurable by locale.",
    },
    {
      q: "Which locales are supported?",
      a: "Over 20 locales including en (English), de (German), fr (French), es (Spanish), ja (Japanese), zh_CN (Simplified Chinese), ar (Arabic), pt_BR (Brazilian Portuguese), and more. Locale affects names, addresses, phone formats, and currencies.",
    },
    {
      q: "Can I use fake data in automated tests?",
      a: "Yes — fake data generators are a common pattern for unit and integration tests. Copy the output as JSON or CSV and import it into your test fixtures.",
    },
  ],

  "/css-gradient": [
    {
      q: "What gradient types does the generator support?",
      a: "Linear gradients (any angle in degrees), radial gradients (circle or ellipse from any position), and conic gradients. Add unlimited color stops and adjust their position percentages.",
    },
    {
      q: "Does the output include vendor prefixes?",
      a: "The generated CSS uses the standard unprefixed syntax (background: linear-gradient(...)). Vendor prefixes (-webkit-, -moz-) are no longer needed for gradients in any modern browser.",
    },
    {
      q: "Can I use a gradient as a CSS text fill or border?",
      a: "For text: combine background: linear-gradient(...) with -webkit-background-clip: text and -webkit-text-fill-color: transparent. For borders: use background-clip: border-box or a border-image with the gradient.",
    },
  ],

  "/css-box-shadow": [
    {
      q: "What parameters does the box shadow generator control?",
      a: "Horizontal offset, vertical offset, blur radius, spread radius, color (with opacity), and whether the shadow is inset (inner shadow). Adjust the sliders and the live preview updates instantly.",
    },
    {
      q: "Can I add multiple box shadows?",
      a: "Yes — CSS box-shadow accepts a comma-separated list of shadows. Add as many layers as you need to create layered depth effects.",
    },
    {
      q: "What is the difference between blur radius and spread radius?",
      a: "Blur radius controls how soft and diffused the shadow edge is (0 = hard edge, higher = softer). Spread radius expands or contracts the shadow size before blurring is applied (positive = larger shadow, negative = smaller).",
    },
  ],

  "/color-palette": [
    {
      q: "How does the color palette generator work?",
      a: "Pick a base color and choose a color harmony rule. The tool calculates colors at mathematically defined positions on the HSL color wheel: complementary (180°), triadic (120° apart), analogous (30° steps), split-complementary, or tetradic (90° apart).",
    },
    {
      q: "Which harmony rules are available?",
      a: "Complementary (2 colors), split-complementary (3 colors), triadic (3 colors), analogous (5 colors), tetradic/square (4 colors), and monochromatic (shades of one hue).",
    },
    {
      q: "Can I copy colors as HEX, RGB, or HSL?",
      a: "Yes — click any swatch to copy its value in your preferred format.",
    },
  ],

  "/utm-builder": [
    {
      q: "What are UTM parameters?",
      a: "UTM parameters (Urchin Tracking Module) are query string tags appended to URLs so analytics platforms like Google Analytics 4, Matomo, or Adobe Analytics can attribute traffic to specific campaigns, sources, and mediums.",
    },
    {
      q: "Which UTM parameters are required vs. optional?",
      a: "utm_source (e.g. newsletter, twitter, google) and utm_medium (e.g. email, cpc, organic) are required for meaningful attribution. utm_campaign is strongly recommended. utm_term (for paid keywords) and utm_content (for A/B variants) are optional.",
    },
    {
      q: "Should I use uppercase or lowercase in UTM values?",
      a: "Always use lowercase. Analytics platforms treat 'Email' and 'email' as different sources. Consistent lowercase naming prevents data fragmentation in your reports.",
    },
    {
      q: "Do UTM parameters affect SEO?",
      a: "UTM parameters do not directly affect SEO. Search engines generally ignore them for crawling. However, use canonical tags on pages that receive UTM-tagged traffic to consolidate ranking signals to the clean URL.",
    },
  ],

  "/slug-generator": [
    {
      q: "What is a URL slug?",
      a: "A slug is a URL-safe version of a title or string: lowercase, with spaces replaced by hyphens, special characters removed, and accented letters transliterated to ASCII (e.g. 'Hello, Wörld!' → 'hello-world'). Slugs appear in page URLs (/blog/hello-world) and are indexed by search engines.",
    },
    {
      q: "Does the generator handle accented and non-ASCII characters?",
      a: "Yes — accented letters (é → e, ü → u, ñ → n) are transliterated to their closest ASCII equivalent before slugifying, so international titles produce readable URL slugs.",
    },
    {
      q: "Can I use underscores instead of hyphens?",
      a: "Yes — switch the separator option from hyphens to underscores. Note that Google recommends hyphens as word separators in URLs over underscores for SEO.",
    },
  ],

  "/markdown-table": [
    {
      q: "What is a Markdown table and where can I use it?",
      a: "A Markdown table is a plain-text grid defined with pipe | characters and hyphens. It renders as an HTML <table> in GitHub, GitLab, Bitbucket, Notion, and most documentation platforms that support CommonMark or GFM.",
    },
    {
      q: "How do I set column alignment?",
      a: "Click the alignment button on each column header to cycle between left-aligned, center-aligned, and right-aligned. The Markdown separator row uses colons (:--, :--:, --:) to encode alignment.",
    },
    {
      q: "Can I paste data from a spreadsheet?",
      a: "Yes — copy cells from Excel or Google Sheets and paste into the table editor. Tab-separated data is parsed into columns automatically.",
    },
  ],

  "/meta-tag": [
    {
      q: "What meta tags does the generator create?",
      a: "The essential SEO tags (title, meta description, canonical), Open Graph tags for Facebook and LinkedIn (og:title, og:description, og:image, og:type), Twitter Card tags (twitter:card, twitter:title, twitter:description, twitter:image), and optional robots and viewport tags.",
    },
    {
      q: "What is the optimal meta description length?",
      a: "Google typically displays 150–160 characters of a meta description in search results. Anything longer is truncated with '...'. Write a compelling sentence that includes your primary keyword and a clear value proposition.",
    },
    {
      q: "Does a meta description directly affect Google rankings?",
      a: "No — the meta description is not a direct ranking factor. However, a well-written description improves click-through rate (CTR) in search results, which is an indirect signal. Google may also rewrite your description if it judges another snippet to be more relevant.",
    },
    {
      q: "What image size should I use for Open Graph?",
      a: "The recommended og:image size is 1200×630 pixels (1.91:1 ratio). This renders well across Facebook, LinkedIn, and Twitter/X without cropping. Use PNG or JPEG under 8 MB.",
    },
  ],

  "/css-flexbox": [
    {
      q: "What is CSS Flexbox?",
      a: "Flexbox (Flexible Box Layout) is a CSS layout module for arranging items in one dimension — either a row or a column. It makes it easy to align, distribute space, and reorder elements without using floats or positioning.",
    },
    {
      q: "Which flex properties does the playground cover?",
      a: "flex-direction, flex-wrap, justify-content, align-items, align-content on the container; and flex-grow, flex-shrink, flex-basis, align-self, and order on individual items.",
    },
    {
      q: "When should I use Flexbox vs. CSS Grid?",
      a: "Use Flexbox for one-dimensional layouts (a navigation bar, a row of cards, a toolbar). Use CSS Grid for two-dimensional layouts (page structure, image galleries, dashboards). They are complementary and often used together.",
    },
  ],

  "/color-picker": [
    {
      q: "What color formats does the picker output?",
      a: "HEX (#rrggbb), RGB (r, g, b), HSL (h, s%, l%), and HSV. Click any format label to copy it to clipboard instantly.",
    },
    {
      q: "How do I pick a color from an image?",
      a: "Use the EyeDropper API (available in Chrome and Edge) — click the eyedropper button and select any pixel on your screen. Safari and Firefox do not yet support the EyeDropper API.",
    },
  ],

  "/hmac-generator": [
    {
      q: "What is an HMAC and when is it used?",
      a: "HMAC (Hash-based Message Authentication Code) uses a secret key combined with a hash function to produce a message authentication code. It verifies both data integrity (the message was not tampered with) and authenticity (it came from someone with the key). HMAC-SHA256 is used in JWT signatures, webhook verification, and API request signing.",
    },
    {
      q: "Which HMAC algorithms are supported?",
      a: "HMAC-SHA1, HMAC-SHA256, HMAC-SHA384, and HMAC-SHA512. SHA256 is the standard choice; SHA512 provides a larger digest for applications requiring higher security margin.",
    },
    {
      q: "What output formats are available?",
      a: "Hexadecimal (lowercase hex string) and Base64. Hex is commonly used in API signatures; Base64 is used in JWT signatures and HTTP headers.",
    },
  ],

  "/totp-generator": [
    {
      q: "What is TOTP and how does it work?",
      a: "TOTP (Time-based One-Time Password, RFC 6238) generates a 6-digit code that changes every 30 seconds based on a shared secret key and the current Unix time. It is the algorithm used by Google Authenticator, Authy, and all standard 2FA apps.",
    },
    {
      q: "Is the generated TOTP code compatible with Google Authenticator?",
      a: "Yes — this tool implements RFC 6238 TOTP with HMAC-SHA1, which is the standard used by Google Authenticator, Authy, Microsoft Authenticator, and Bitwarden.",
    },
    {
      q: "What Base32 format should the secret key be in?",
      a: "The secret key must be a Base32-encoded string (uppercase A-Z, digits 2-7, with = padding). This is the format shown in QR codes during 2FA enrollment. You can also enter it from the text code shown during setup (e.g. 'JBSWY3DPEHPK3PXP').",
    },
    {
      q: "Is it safe to test my real 2FA secret here?",
      a: "All processing runs in your browser — nothing is sent to a server. However, as a security precaution, avoid entering 2FA secrets for critical accounts (banking, email) in any web tool. Use this for testing TOTP implementations with test secrets.",
    },
  ],

  "/css-grid": [
    {
      q: "What is CSS Grid and how does it differ from Flexbox?",
      a: "CSS Grid is a two-dimensional layout system that controls both rows and columns simultaneously. Flexbox handles one dimension at a time. Use Grid for page-level layouts (header, sidebar, main content, footer) and Flexbox for components within those areas.",
    },
    {
      q: "What grid properties does the playground generate?",
      a: "grid-template-columns, grid-template-rows, gap (column-gap and row-gap), justify-items, align-items, justify-content, and align-content. The output includes the full CSS for both the container and optional child item spans.",
    },
    {
      q: "What is the fr unit in CSS Grid?",
      a: "fr (fraction) is a flexible unit that distributes remaining space proportionally. For example, grid-template-columns: 1fr 2fr creates two columns where the second is twice as wide as the first. It works like flex-grow for grid tracks.",
    },
  ],

  "/gitignore": [
    {
      q: "What does a .gitignore file do?",
      a: "A .gitignore file tells Git which files and directories to ignore and never track. This prevents build artifacts, dependencies (node_modules/), IDE settings, log files, and environment secrets (.env) from being committed to your repository.",
    },
    {
      q: "Which templates are included?",
      a: "Templates for popular languages (Node.js, Python, Java, Go, Rust, Ruby, PHP, Swift, Kotlin, C++), frameworks (React, Next.js, Laravel, Django, Rails), IDEs (VS Code, JetBrains, Xcode), and operating systems (macOS, Windows, Linux).",
    },
    {
      q: "Can I combine multiple templates?",
      a: "Yes — select multiple languages/frameworks and the tool merges them into a single .gitignore with sections for each. This is useful for full-stack projects (e.g. Node.js + Python + VS Code).",
    },
  ],

  "/web-manifest": [
    {
      q: "What is a web app manifest?",
      a: "A web app manifest (manifest.json) is a JSON file that tells browsers how to display your site when installed as a Progressive Web App (PWA). It defines the app name, icons, theme color, background color, display mode (standalone, fullscreen), and start URL.",
    },
    {
      q: "Which fields are required for PWA installability?",
      a: "Chrome requires at minimum: name or short_name, icons (at least 192×192 and 512×512 PNG), start_url, and display (standalone or fullscreen). The site must also be served over HTTPS and have a Service Worker.",
    },
    {
      q: "What is the difference between name and short_name?",
      a: "name is the full application name shown in install prompts and splash screens. short_name (max ~12 characters) is used where space is limited, like under the icon on a home screen.",
    },
  ],

  "/robots-txt": [
    {
      q: "What is a robots.txt file?",
      a: "robots.txt is a plain text file at the root of your website that instructs web crawlers which pages they are allowed or disallowed from crawling. It is the first file Googlebot and other crawlers request when visiting your site.",
    },
    {
      q: "Does robots.txt prevent pages from appearing in search results?",
      a: "Disallowing a URL in robots.txt prevents crawling but does not guarantee the page won't appear in search results — if other sites link to the page, Google may still index its URL without crawling the content. Use the noindex meta tag or X-Robots-Tag header to prevent indexing.",
    },
    {
      q: "Should I block all bots from my /admin/ pages?",
      a: "Yes — it is good practice to disallow crawlers from admin panels, login pages, and internal search results. However, access control (passwords, auth) is your real security — robots.txt is just a polite instruction that malicious bots ignore.",
    },
  ],

  "/cors-generator": [
    {
      q: "What is CORS and why does it need to be configured?",
      a: "CORS (Cross-Origin Resource Sharing) is a browser security mechanism that blocks web pages from making requests to a different domain than the one that served the page — unless the server explicitly allows it via Access-Control-Allow-Origin headers. Without CORS configuration, browser-based JavaScript cannot call your API from a different domain.",
    },
    {
      q: "Which server configurations does the generator output?",
      a: "Apache (.htaccess with mod_headers), Nginx (location block directives), Node.js/Express (cors middleware config), and generic HTTP header format for any other server.",
    },
    {
      q: "Should I use Access-Control-Allow-Origin: * in production?",
      a: "Only for truly public APIs where any origin should be allowed. For APIs that handle user data or require authentication, specify exact allowed origins (e.g. Access-Control-Allow-Origin: https://yourdomain.com) to prevent unauthorized cross-origin access.",
    },
  ],

  "/npm-scripts": [
    {
      q: "What does the NPM script builder do?",
      a: "It generates the scripts section of your package.json file — letting you visually select common tasks (dev server, build, test, lint, format) for popular tools (Vite, Next.js, Jest, ESLint, Prettier) and get the correct script definitions.",
    },
    {
      q: "Can I define pre/post hooks?",
      a: "Yes — npm automatically runs a prebuild script before build and postbuild after. The builder includes options to add pre/post hooks for common lifecycle events.",
    },
  ],

  "/css-bezier": [
    {
      q: "What is a CSS cubic-bezier timing function?",
      a: "A cubic-bezier() function defines the acceleration curve of a CSS transition or animation — controlling how fast or slow it moves at different points in time. The four arguments (x1, y1, x2, y2) define two control points on a Bézier curve between (0,0) and (1,1).",
    },
    {
      q: "How does this differ from ease, linear, ease-in, ease-out?",
      a: "The keywords are shortcuts: ease = cubic-bezier(0.25, 0.1, 0.25, 1.0), ease-in = cubic-bezier(0.42, 0, 1.0, 1.0), ease-out = cubic-bezier(0, 0, 0.58, 1.0), linear = cubic-bezier(0, 0, 1, 1). The editor lets you create custom curves beyond these presets.",
    },
    {
      q: "Can I compare my curve against the standard presets?",
      a: "Yes — overlay the preset curves on the editor canvas to visually compare your custom timing function with ease, ease-in, ease-out, and ease-in-out.",
    },
  ],

  "/svg-blob": [
    {
      q: "What is an SVG blob?",
      a: "An SVG blob is an organic, rounded shape generated by placing and smoothing random points on a circle. They are popular in modern web design as background decorations, image masks, and abstract illustrations.",
    },
    {
      q: "How do I customize the blob shape?",
      a: "Adjust the number of points (more points = more complex shape), the randomness slider (lower = rounder, higher = more jagged), and the seed value to get different random shapes with the same settings.",
    },
    {
      q: "Can I animate SVG blobs?",
      a: "Yes — generate two blob paths with the same number of points and use CSS or SMIL animation to morph between them. The tool outputs standard SVG <path> elements compatible with animation libraries like GSAP or anime.js.",
    },
  ],

  "/tailwind-colors": [
    {
      q: "What does the Tailwind color generator produce?",
      a: "A full 10-shade palette (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950) from any base color, formatted as a Tailwind CSS theme extension you can drop directly into your tailwind.config.js.",
    },
    {
      q: "How are the shades calculated?",
      a: "The base color is placed at shade 500 and lighter/darker shades are generated by adjusting lightness in the HSL color space with a curve that matches Tailwind's built-in palette progression.",
    },
    {
      q: "Can I use custom colors that aren't in Tailwind's default palette?",
      a: "Yes — this tool is specifically for generating custom palettes to extend Tailwind's theme. Paste the generated object into the extend.colors section of your tailwind.config.js.",
    },
  ],

  "/placeholder-image": [
    {
      q: "What is a placeholder image used for?",
      a: "Placeholder images are temporary stand-ins used during design and development when the real content isn't available yet. They show correct dimensions, maintain layout integrity, and are replaced with real assets before shipping.",
    },
    {
      q: "Can I customize the dimensions, colors, and text?",
      a: "Yes — set any width and height (up to 4096×4096), choose background and text colors, and add custom text (default shows dimensions). Download as PNG.",
    },
  ],

  "/ascii-art": [
    {
      q: "What is ASCII art text?",
      a: "ASCII art text renders a string as large block letters made from ASCII characters (letters, symbols, spaces). It is used in terminal output, README banners, developer console greetings, and retro-style headers.",
    },
    {
      q: "Which font styles are available?",
      a: "Over a dozen styles including Big, Banner, Block, Bubble, Digital, Lean, Mini, Script, Shadow, Slant, and Standard — each producing a different character style.",
    },
  ],

  "/image-resizer": [
    {
      q: "Which image formats are supported for input and output?",
      a: "Input: JPEG, PNG, WebP, GIF, BMP, and AVIF. Output: JPEG, PNG, and WebP. Choose the format that best suits your use case — WebP offers the best compression for web images.",
    },
    {
      q: "Does resizing happen in the browser?",
      a: "Yes — the image is drawn to an HTML5 Canvas at the target dimensions and exported. No image data is sent to any server.",
    },
    {
      q: "What does 'lock aspect ratio' do?",
      a: "When locked, changing the width automatically recalculates the height (and vice versa) to maintain the original proportions, preventing distortion.",
    },
  ],

  "/image-compressor": [
    {
      q: "How much can the compressor reduce file size?",
      a: "JPEG and WebP compression can typically reduce file sizes by 60–80% with minimal visible quality loss at quality 75–85. PNG compression is lossless — sizes reduce less but the image is identical to the original.",
    },
    {
      q: "What is the quality slider?",
      a: "The quality slider (1–100) controls the lossy compression trade-off for JPEG and WebP. Lower values produce smaller files with more visible artifacts; higher values preserve quality at larger file sizes. Quality 80 is a good starting point.",
    },
    {
      q: "Does this work for batch compression?",
      a: "Currently one image at a time. For batch compression of many images consider a build tool plugin like imagemin or Squoosh CLI.",
    },
  ],

  "/favicon-generator": [
    {
      q: "What favicon sizes does the generator create?",
      a: "16×16, 32×32, 48×48, 57×57, 60×60, 72×72, 76×76, 96×96, 114×114, 120×120, 144×144, 152×152, 180×180, 192×192, and 512×512 PNG files. These cover all browsers, iOS home screen icons, Android adaptive icons, and Windows tiles.",
    },
    {
      q: "What image should I use as input?",
      a: "Use a square image (1:1 ratio) of at least 512×512 pixels. SVG or high-resolution PNG works best. Avoid text-heavy designs — they become unreadable at 16×16.",
    },
    {
      q: "Does it generate the HTML snippet too?",
      a: "Yes — the tool outputs a complete <head> snippet with the correct <link rel='icon'> and <link rel='apple-touch-icon'> tags, ready to paste into your HTML.",
    },
  ],

  "/wifi-qr": [
    {
      q: "How do I use the Wi-Fi QR code?",
      a: "Enter your SSID (network name), password, and security type (WPA2/WPA3, WEP, or open), then scan the generated QR code with an iPhone (iOS 11+) or Android (8.0+) camera app. The phone connects automatically — no typing required.",
    },
    {
      q: "Is my Wi-Fi password safe if I use this tool?",
      a: "Yes — the QR code is generated entirely in your browser. Your SSID and password are never sent to any server. The generated QR code only exists on your screen.",
    },
    {
      q: "What is the Wi-Fi QR code format?",
      a: "The standard format is WIFI:T:WPA;S:<SSID>;P:<password>;; — this is the mecard-based format recognized by Android and iOS camera apps natively.",
    },
  ],

  "/code-to-image": [
    {
      q: "What can I do with code-to-image output?",
      a: "Code images are perfect for sharing snippets on Twitter/X, LinkedIn, Instagram, and Slack — places where plain code is hard to read. They preserve syntax highlighting, font, and theme without requiring the viewer to have a code editor.",
    },
    {
      q: "Which themes and fonts are available?",
      a: "Multiple dark and light syntax themes (Dracula, GitHub, Solarized, Monokai, One Dark) and developer-friendly fonts (Fira Code, JetBrains Mono, Source Code Pro). Font ligatures are supported.",
    },
    {
      q: "What languages have syntax highlighting?",
      a: "JavaScript, TypeScript, Python, Go, Rust, Java, C/C++, CSS, HTML, JSON, YAML, Markdown, SQL, Bash/Shell, and more — powered by highlight.js.",
    },
  ],

  "/color-shades": [
    {
      q: "What does the color shades generator produce?",
      a: "An 11-step shade palette (50–950) from any base color, matching the structure of Tailwind CSS's built-in palettes. The base color is placed at 500 with progressively lighter shades above and darker shades below.",
    },
    {
      q: "Can I export the palette as CSS variables or Tailwind config?",
      a: "Yes — the output includes both CSS custom property format (--color-50: #...) and Tailwind config object format for direct use in tailwind.config.js.",
    },
  ],

  "/css-clip-path": [
    {
      q: "What is CSS clip-path?",
      a: "clip-path is a CSS property that visually clips an element to a shape — only the area inside the shape is visible. It creates polygons, circles, ellipses, or SVG paths without additional HTML elements.",
    },
    {
      q: "Can I create custom polygon shapes?",
      a: "Yes — the polygon editor lets you drag points on a canvas to build any convex or concave polygon. The tool outputs the clip-path: polygon(...) CSS code with percentage-based coordinates.",
    },
    {
      q: "Does clip-path affect click/touch events outside the shape?",
      a: "No — clip-path only clips the visual rendering. The element still occupies its full rectangular space for event handling. Use pointer-events: none outside the clipped area if needed.",
    },
  ],

  // ── Testers & Analysis ─────────────────────────────────────────────────────

  "/regex-tester": [
    {
      q: "What regex engine does the tester use?",
      a: "JavaScript's native regex engine (ECMA-262), including modern features from ES2024: named capture groups (?<name>...), lookbehind assertions (?<=...), Unicode property escapes (\\p{} with u flag), and the v flag for set notation.",
    },
    {
      q: "Why does my regex work in one language but fail here?",
      a: "Different languages have different regex dialects. Python uses re (PCRE-like), Java uses java.util.regex (PCRE-like), and JavaScript uses its own engine. Key differences: JavaScript \\d matches only ASCII digits (not \\p{N} without the u flag), and Python's re module supports (?>...) atomic groups which JavaScript does not.",
    },
    {
      q: "What do the regex flags do?",
      a: "g (global): find all matches, not just the first. i (case insensitive). m (multiline): ^ and $ match line starts/ends. s (dotAll): . matches newlines. u (unicode): enables full Unicode support. v (unicodeSets): upgraded Unicode mode with set notation.",
    },
    {
      q: "How do I use named capture groups?",
      a: "Use (?<name>...) syntax: e.g. /(?<year>\\d{4})-(?<month>\\d{2})/. The match object's groups property contains {year: '2024', month: '07'}. Named groups improve readability over numbered groups.",
    },
  ],

  "/cron-tester": [
    {
      q: "What CRON format does the validator use?",
      a: "Standard 5-field CRON: minute (0–59), hour (0–23), day-of-month (1–31), month (1–12), day-of-week (0–7, both 0 and 7 = Sunday). Special strings @hourly, @daily, @weekly, @monthly, and @yearly are also supported.",
    },
    {
      q: "How many future runs does the tool show?",
      a: "The next 10 scheduled run times, displayed in your local timezone alongside their UTC equivalents.",
    },
    {
      q: "Can I use commas, ranges, and step values?",
      a: "Yes — all standard CRON operators: , (list: 1,3,5), - (range: 1-5), / (step: */15 = every 15 units), and * (wildcard: any value).",
    },
    {
      q: "How do I run a job every 5 minutes?",
      a: "Use */5 * * * * — the */5 in the minute field means 'every 5 minutes'. To run only during business hours use */5 9-17 * * 1-5 (every 5 min, hours 9-17, Monday-Friday).",
    },
  ],

  "/diff-viewer": [
    {
      q: "What does the text diff viewer do?",
      a: "It compares two blocks of text line by line, highlighting added lines (green), removed lines (red), and unchanged lines (grey). This makes it easy to see exactly what changed between two versions of any text, code, or document.",
    },
    {
      q: "Can I compare code files?",
      a: "Yes — paste code from any language into both panels and see a line-level diff. The viewer works on any plain text: source code, configuration files, JSON, YAML, Markdown, or prose.",
    },
    {
      q: "Does it support character-level diffing within a line?",
      a: "Yes — changed lines show character-level highlighting within the line so you can see exactly which characters were modified, not just which line changed.",
    },
  ],

  "/diff-checker": [
    {
      q: "What is the difference between diff-viewer and diff-checker?",
      a: "Both compare text, but diff-checker provides a more detailed side-by-side view with line numbers, character-level highlighting within changed lines, and a summary of total additions and deletions — closer to a git diff output.",
    },
    {
      q: "Can I use this to compare JSON or YAML files?",
      a: "Yes — paste any plain text. For structured JSON comparison (showing which keys changed at any nesting level) use the JSON Diff tool instead.",
    },
  ],

  "/word-counter": [
    {
      q: "What statistics does the word counter show?",
      a: "Total characters (with and without spaces), word count, sentence count, paragraph count, and estimated reading time at 200 words per minute (average adult reading speed).",
    },
    {
      q: "How are words counted?",
      a: "Words are counted by splitting on whitespace sequences after stripping punctuation. Hyphenated words (well-known) are counted as one word.",
    },
    {
      q: "Can I use this to check character limits for social media?",
      a: "Yes — the character count (with spaces) matches what Twitter/X, Instagram, and LinkedIn count. Note that Twitter counts URLs as 23 characters regardless of actual length due to t.co shortening.",
    },
  ],

  "/text-case": [
    {
      q: "What case transformations are available?",
      a: "UPPER CASE, lower case, Title Case (each word capitalized), Sentence case (first word of each sentence), camelCase, PascalCase (UpperCamelCase), snake_case, SCREAMING_SNAKE_CASE, kebab-case, and COBOL-CASE.",
    },
    {
      q: "What is the difference between camelCase and PascalCase?",
      a: "In camelCase the first word is lowercase (myVariableName). In PascalCase (also called UpperCamelCase) the first word is also capitalized (MyClassName). PascalCase is used for class names in most languages; camelCase for variable and function names.",
    },
    {
      q: "When would I use snake_case vs. kebab-case?",
      a: "snake_case (words_separated_by_underscores) is the convention in Python, Ruby, and SQL. kebab-case (words-separated-by-hyphens) is used in CSS class names, HTML data attributes, and URL paths. JavaScript uses camelCase for variables.",
    },
  ],

  "/byte-size": [
    {
      q: "What does the byte size calculator show?",
      a: "The size of your text in UTF-8, UTF-16 (LE and BE), and ASCII byte counts. Knowing byte size is essential when working with database field limits (VARCHAR(255) means 255 bytes in some databases), network packet budgets, and HTTP headers.",
    },
    {
      q: "Why does the UTF-8 size differ from the character count?",
      a: "ASCII characters (letters, digits, common symbols) use 1 byte each in UTF-8. Latin accented characters (é, ü) use 2 bytes. CJK characters (Chinese, Japanese, Korean) use 3 bytes. Emoji use 4 bytes. So 'hello' is 5 bytes but '你好' is 6 bytes despite also having 2 'characters'.",
    },
    {
      q: "Does MySQL VARCHAR(255) mean 255 bytes or 255 characters?",
      a: "In MySQL with utf8mb4 charset, VARCHAR(255) stores up to 255 characters regardless of their byte count. However, the maximum row size of 65,535 bytes is shared across all columns, so VARCHAR(255) with utf8mb4 uses up to 1,020 bytes of that budget.",
    },
  ],

  "/http-status": [
    {
      q: "What does the HTTP Status Reference cover?",
      a: "All standardized HTTP status codes from 100 to 599, grouped by class: 1xx Informational, 2xx Success, 3xx Redirection, 4xx Client Error, and 5xx Server Error. Each code includes its official name, RFC reference, and a plain-English description.",
    },
    {
      q: "What is the difference between 401 and 403?",
      a: "401 Unauthorized means the request lacks valid authentication credentials — the client needs to log in or provide an API key. 403 Forbidden means the server understood the request but the authenticated user doesn't have permission. In short: 401 = 'who are you?', 403 = 'I know who you are but you can't access this'.",
    },
    {
      q: "What is the difference between 301 and 302 redirects?",
      a: "301 Moved Permanently tells browsers and search engines to permanently update their records — link equity (PageRank) passes to the new URL. 302 Found is temporary — browsers follow the redirect but keep the original URL in mind. Use 301 for permanent moves; use 302 for temporary redirects or A/B tests.",
    },
    {
      q: "What does status 429 mean?",
      a: "429 Too Many Requests means the client has exceeded the server's rate limit. The response usually includes a Retry-After header indicating how many seconds to wait before retrying. Implement exponential backoff in your client to handle rate limits gracefully.",
    },
  ],

  "/useragent-parser": [
    {
      q: "What does the User-Agent parser show?",
      a: "Browser name and version, operating system name and version, device type (desktop, mobile, tablet, bot), CPU architecture, and rendering engine (Blink, WebKit, Gecko, Trident).",
    },
    {
      q: "Why is User-Agent sniffing considered a bad practice?",
      a: "User-Agent strings are notoriously inconsistent — all major browsers include 'Mozilla/5.0' for historical reasons, and strings can be spoofed. Feature detection (using navigator.supports or CSS @supports) is more reliable for progressive enhancement.",
    },
    {
      q: "Can I parse the User-Agent of my current browser?",
      a: "Yes — click the 'Use my browser' button to auto-fill your current browser's User-Agent string and parse it instantly.",
    },
  ],

  "/jsonpath": [
    {
      q: "What is JSONPath and how does it work?",
      a: "JSONPath is a query language for JSON, analogous to XPath for XML. It lets you extract specific values from deeply nested JSON using a path expression. For example, $.users[*].email extracts all email addresses from an array of user objects.",
    },
    {
      q: "What is the difference between . (dot) and [] (bracket) notation?",
      a: "Both access object properties but bracket notation also handles keys with spaces or special characters, and array indices. $.user.name and $.user['name'] are equivalent. Use $['key with spaces'] when the key contains spaces or starts with a digit.",
    },
    {
      q: "What does the .. (recursive descent) operator do?",
      a: "The .. operator searches all descendants at any depth. $..'name' finds every 'name' key anywhere in the entire JSON document, not just at the top level.",
    },
    {
      q: "How do I filter an array by a condition?",
      a: "Use filter expressions: $.users[?(@.age > 18)] returns all user objects where age is greater than 18. The @ symbol refers to the current element being tested.",
    },
  ],

  "/ip-subnet": [
    {
      q: "What does the subnet calculator show?",
      a: "For any IPv4 address in CIDR notation (e.g. 192.168.1.0/24): network address, broadcast address, usable host range, subnet mask in dotted-decimal and hex, number of usable hosts, and the network class.",
    },
    {
      q: "What is CIDR notation?",
      a: "CIDR (Classless Inter-Domain Routing) notation represents an IP address and its subnet mask as a single string: IP/prefix-length. The prefix length (0–32) is the number of leading 1-bits in the mask. /24 = 255.255.255.0 = 256 addresses, /16 = 255.255.0.0 = 65,536 addresses.",
    },
    {
      q: "How many usable hosts does a /24 subnet have?",
      a: "A /24 subnet has 256 total addresses. Two are reserved — the network address (first) and broadcast address (last) — leaving 254 usable host addresses.",
    },
    {
      q: "What is the difference between public and private IP ranges?",
      a: "Private IP ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) are for internal networks and are not routable on the public internet. They are used for home, office, and cloud VPC networks behind NAT.",
    },
  ],

  "/chmod": [
    {
      q: "How does the chmod calculator work?",
      a: "Toggle the read (r=4), write (w=2), and execute (x=1) checkboxes for Owner, Group, and Others. The numeric octal value (like 755) and symbolic string (like rwxr-xr-x) update in real time.",
    },
    {
      q: "What does chmod 755 mean?",
      a: "755 means: Owner has read+write+execute (7=4+2+1), Group has read+execute (5=4+1), Others have read+execute (5=4+1). This is the standard permission for executable files and web directories.",
    },
    {
      q: "What is the difference between 644 and 755?",
      a: "644 (rw-r--r--) is for regular files: owner can read/write, group and others can only read. 755 (rwxr-xr-x) is for directories and executables: everyone can enter the directory and read its contents, but only the owner can create/delete files.",
    },
    {
      q: "What are the sticky bit, SUID, and SGID?",
      a: "Sticky bit (1000): only the file owner can delete files in a directory (used on /tmp). SUID (4000): execute the file with the owner's permissions. SGID (2000): execute with the group's permissions or inherit group on new directory files.",
    },
  ],

  "/semver": [
    {
      q: "What is Semantic Versioning (SemVer)?",
      a: "SemVer is a versioning convention using three numbers: MAJOR.MINOR.PATCH. Increment MAJOR for breaking changes, MINOR for new backwards-compatible features, and PATCH for backwards-compatible bug fixes. It is the standard used by npm, Cargo, and most modern package ecosystems.",
    },
    {
      q: "What is the difference between a pre-release and a stable release?",
      a: "Pre-release versions append a hyphen and identifier: 1.0.0-alpha, 1.0.0-rc.1. They signal the version is not yet stable. In terms of precedence, 1.0.0-alpha < 1.0.0 — a release always takes precedence over its pre-release.",
    },
    {
      q: "Is '1.0' a valid semver string?",
      a: "No — SemVer 2.0 requires all three parts: MAJOR, MINOR, and PATCH. '1.0' and '2' are not valid semver strings. You must write '1.0.0'.",
    },
    {
      q: "How do npm range specifiers like ^1.2.3 or ~2.0.0 work?",
      a: "^ (caret) matches compatible versions: ^1.2.3 allows >=1.2.3 <2.0.0 (no breaking changes). ~ (tilde) allows patch-level changes: ~2.0.0 allows >=2.0.0 <2.1.0. This tool validates individual version strings; for range evaluation use the npm semver calculator.",
    },
  ],

  "/line-sorter": [
    {
      q: "What sorting options are available?",
      a: "Alphabetical (A-Z and Z-A), reverse original order, random shuffle, sort by line length (shortest to longest), natural numeric sort (so 2 comes before 10), remove duplicate lines, and trim leading/trailing whitespace from each line.",
    },
    {
      q: "What is the difference between alphabetical and natural sort?",
      a: "Alphabetical sort treats all characters as text: 'item10' comes before 'item2' because '1' < '2'. Natural sort understands embedded numbers: 'item2' comes before 'item10' because 2 < 10. Use natural sort for filenames and version lists.",
    },
    {
      q: "Can I remove blank lines?",
      a: "Yes — enable the 'Remove empty lines' option to strip all blank lines from the output.",
    },
  ],

  "/find-replace": [
    {
      q: "Does find & replace support regex?",
      a: "Yes — toggle regex mode to use JavaScript regular expression syntax in the find field. You can also use capture groups in the find pattern and reference them in the replace field with $1, $2, etc.",
    },
    {
      q: "Is the replacement case-sensitive by default?",
      a: "Yes — by default the search is case-sensitive. Toggle the case-insensitive flag (i) to match regardless of letter case.",
    },
    {
      q: "Can I preview changes before applying?",
      a: "Yes — matches are highlighted in the input as you type the search term. The replacement preview shows the result live.",
    },
  ],

  "/percentage": [
    {
      q: "What types of percentage calculations are included?",
      a: "Percentage of a number (X% of Y), what percent one number is of another (X is what % of Y), percentage change between two values ((new-old)/old × 100), and adding/subtracting a percentage from a value.",
    },
    {
      q: "How do I calculate a percentage increase?",
      a: "Use the 'Percentage change' calculator: enter the original value as 'from' and the new value as 'to'. A positive result is an increase; a negative result is a decrease.",
    },
  ],

  "/csv-viewer": [
    {
      q: "What CSV delimiter formats are supported?",
      a: "Comma (,), semicolon (;), tab (\\t), and pipe (|). Select the delimiter from the options panel before loading your file.",
    },
    {
      q: "Can I sort the table by column?",
      a: "Yes — click any column header to sort the table ascending or descending by that column's values.",
    },
    {
      q: "Is there a row limit?",
      a: "The viewer loads the entire file into the browser. Files up to a few thousand rows display instantly; very large files (100k+ rows) may be slower since all rendering happens in the browser DOM.",
    },
    {
      q: "Can I search within the CSV data?",
      a: "Yes — use the search input to filter rows that match your query across all columns.",
    },
  ],

  "/json-diff": [
    {
      q: "What does the JSON diff tool show?",
      a: "It compares two JSON documents and highlights added keys (green +), removed keys (red −), and changed values (yellow ~) at every nesting level — including deeply nested objects and array elements.",
    },
    {
      q: "Does it handle arrays correctly?",
      a: "Yes — array elements are compared by index. If an element is added, removed, or reordered, the diff shows the change at the array index level.",
    },
    {
      q: "What is a practical use case for JSON diff?",
      a: "Comparing API response schemas between environments (development vs. production), reviewing config file changes, or debugging why a frontend receives unexpected data from a backend update.",
    },
  ],

  "/password-strength": [
    {
      q: "How is password strength calculated?",
      a: "Strength is scored on length, character variety (uppercase, lowercase, digits, symbols), absence of common patterns (keyboard walks like 'qwerty', repeated characters, dictionary words), and estimated entropy in bits.",
    },
    {
      q: "What is password entropy?",
      a: "Entropy (bits) measures how unpredictable a password is based on its length and the size of the character set used. Each additional character multiplies the search space: a 12-char password with 95 possible characters has log2(95^12) ≈ 79 bits of entropy.",
    },
    {
      q: "What does 'estimated crack time' mean?",
      a: "It estimates how long a modern GPU-based brute-force attack would take to guess the password, assuming ~10 billion guesses per second. This is for context — actual crack time depends heavily on how the password is stored (bcrypt, Argon2, MD5) and the attacker's hardware.",
    },
  ],

  "/readability": [
    {
      q: "Which readability formulas are calculated?",
      a: "Flesch Reading Ease (100 = very easy, 0 = very hard), Flesch-Kincaid Grade Level (US school grade), Gunning Fog Index (years of education needed), and SMOG Index (grade level based on polysyllabic words).",
    },
    {
      q: "What Flesch Reading Ease score should I target?",
      a: "General web content: 60–70 (8th–9th grade). Technical documentation: 50–60. News articles: 60–70. Marketing copy and landing pages: 70–80 (easy to read). Academic papers: below 30 (very difficult).",
    },
    {
      q: "How are sentences detected?",
      a: "Sentences are split on period, exclamation mark, and question mark, with heuristics to avoid splitting on abbreviations (Mr., Dr., etc.) and decimal numbers.",
    },
  ],

  "/ascii-table": [
    {
      q: "What does the ASCII table show?",
      a: "All 128 standard ASCII characters (0–127) with their decimal, hexadecimal, binary values, and HTML entity where applicable. Control characters (0–31) are shown with their mnemonic names (NUL, SOH, CR, LF, etc.).",
    },
    {
      q: "What are the most important ASCII control characters?",
      a: "9 = Tab (\\t), 10 = Line Feed / newline (\\n), 13 = Carriage Return (\\r), 27 = Escape (\\e), 32 = Space. In Unix, line endings are LF only (10); Windows uses CRLF (13,10); classic Mac used CR only (13).",
    },
    {
      q: "How does ASCII relate to Unicode?",
      a: "ASCII defines 128 characters (7-bit). Unicode is a superset — the first 128 Unicode code points (U+0000 to U+007F) are identical to ASCII, so valid ASCII text is also valid UTF-8 with no byte overhead.",
    },
  ],

  "/color-contrast": [
    {
      q: "What WCAG levels does the contrast checker test?",
      a: "WCAG 2.1 Level AA: requires 4.5:1 for normal text and 3:1 for large text (18pt+ or 14pt+ bold). Level AAA: requires 7:1 for normal text and 4.5:1 for large text. AA is the legal requirement in most jurisdictions; AAA is the higher target.",
    },
    {
      q: "How is contrast ratio calculated?",
      a: "The WCAG formula linearizes sRGB values using gamma correction, computes the relative luminance (0=black, 1=white) of each color, then divides the lighter by the darker: ratio = (L1 + 0.05) / (L2 + 0.05) where L1 >= L2.",
    },
    {
      q: "What counts as 'large text' for WCAG?",
      a: "Large text is defined as at least 18pt (24px) for regular weight, or at least 14pt (18.67px) for bold weight. At these sizes, the lower 3:1 contrast ratio applies.",
    },
    {
      q: "My design doesn't pass AA — what are my options?",
      a: "Darken the text color, lighten the background, or both. Try the contrast checker's color suggestions to find the nearest passing colors that preserve your design palette.",
    },
  ],

  "/number-formatter": [
    {
      q: "What formatting options are available?",
      a: "Locale-aware thousand separators, decimal places (0–20), currency symbols with ISO 4217 codes, compact notation (1.2M, 3.5B), scientific notation (1.23e+6), engineering notation (aligned to powers of 1000), and percent style — all using the browser's Intl.NumberFormat API.",
    },
    {
      q: "Why does India use a different thousands grouping?",
      a: "The en-IN locale uses the Indian numbering system where the first group is 3 digits and subsequent groups are 2 digits: 1,00,00,000 instead of 100,000,000. This reflects the lakh (100,000) and crore (10,000,000) system.",
    },
    {
      q: "What is compact notation?",
      a: "Compact notation abbreviates large numbers: 1,200,000 becomes 1.2M and 1,500,000,000 becomes 1.5B. It is ideal for dashboard KPIs and chart axis labels where space is limited.",
    },
  ],

  "/env-parser": [
    {
      q: "What is a .env file?",
      a: "A .env file stores environment-specific configuration variables as KEY=VALUE pairs. It is loaded by tools like dotenv (Node.js), python-dotenv, and Docker Compose to inject secrets and config into applications without hardcoding them in source code.",
    },
    {
      q: "What syntax errors does the parser detect?",
      a: "Missing = separator, keys with invalid characters, unmatched quotes in values, duplicate keys, and lines that are neither comments nor valid key-value pairs.",
    },
    {
      q: "Can I export the parsed variables as JSON?",
      a: "Yes — click Export as JSON to get a clean JSON object of all key-value pairs, useful for importing into other tools or config systems.",
    },
    {
      q: "Is it safe to paste .env files with real secrets here?",
      a: "All processing runs in your browser — nothing is sent to a server. However, as a security best practice, replace real secrets with placeholder values before pasting into any web tool.",
    },
  ],

  "/css-specificity": [
    {
      q: "What is CSS specificity?",
      a: "CSS specificity determines which rule wins when multiple rules target the same element. It is calculated as a three-part score (IDs, Classes+Attributes+Pseudo-classes, Elements+Pseudo-elements). Higher specificity wins; equal specificity defers to source order.",
    },
    {
      q: "How is specificity scored?",
      a: "Each ID selector (#id) contributes 0-1-0. Each class (.class), attribute ([attr]), and pseudo-class (:hover) contributes 0-0-1 to the middle slot. Each type (div, p) and pseudo-element (::before) contributes 0-0-1 to the last slot. Inline styles are 1-0-0-0 and !important overrides all.",
    },
    {
      q: "Why does !important override specificity?",
      a: "!important removes a declaration from the normal cascade and places it in a separate high-priority origin. It should be used sparingly — overusing it leads to specificity wars that make stylesheets hard to maintain.",
    },
    {
      q: "Does the :not() pseudo-class contribute to specificity?",
      a: "The :not() selector itself adds no specificity, but the argument inside it does. :not(.active) adds the same specificity as .active (0-1-0).",
    },
  ],

  "/text-repeater": [
    {
      q: "What does the text repeater do?",
      a: "It repeats any text string N times with a configurable separator (newline, comma, space, or custom string). Useful for generating test data, seed SQL INSERT values, or filling placeholders in templates.",
    },
    {
      q: "Is there a maximum repeat count?",
      a: "The tool handles up to 10,000 repetitions without issue. Very high counts (100k+) may cause the browser tab to slow down.",
    },
  ],

  "/og-preview": [
    {
      q: "What does the Open Graph preview show?",
      a: "A simulated preview of how your page appears when shared on Twitter/X (summary and summary_large_image cards), LinkedIn, and Facebook — showing title, description, image, and domain.",
    },
    {
      q: "How do I add Open Graph tags to my page?",
      a: "Add <meta property=\"og:title\" content=\"...\">, <meta property=\"og:description\" content=\"...\">, and <meta property=\"og:image\" content=\"...\"> to your page's <head>. Use the Meta Tag Generator tool on this site to build the full snippet.",
    },
    {
      q: "Why does my shared link not show the updated image?",
      a: "Social platforms cache og:image aggressively. Use the platform's scraping debug tools to force a refresh: Facebook Sharing Debugger, Twitter Card Validator, and LinkedIn Post Inspector each have a 'Re-scrape' button.",
    },
  ],

  "/line-counter": [
    {
      q: "What line categories does the counter distinguish?",
      a: "Total lines, blank lines, comment lines (lines beginning with //, #, --, or /* */), and actual code lines (total minus blank minus comment). The breakdown helps estimate meaningful code size.",
    },
    {
      q: "What comment styles are detected?",
      a: "Single-line comments starting with // (JavaScript, Go, Java, C), # (Python, Ruby, Bash, YAML), and --  (SQL, Lua). Block comments /* ... */ spanning multiple lines are also counted.",
    },
  ],

  "/emoji-picker": [
    {
      q: "How do I find a specific emoji?",
      a: "Type any keyword in the search box — try 'smile', 'fire', 'heart', or 'check'. The picker searches by emoji name and common aliases.",
    },
    {
      q: "How do I copy an emoji?",
      a: "Click any emoji to copy it to your clipboard as a Unicode character, ready to paste anywhere — text editors, code comments, commit messages, or chat apps.",
    },
    {
      q: "Are recently used emojis saved?",
      a: "Yes — the Recent tab shows your last used emojis, stored in your browser's localStorage so they persist across sessions.",
    },
  ],

  "/data-sanitizer": [
    {
      q: "What types of PII does the sanitizer detect and redact?",
      a: "Email addresses, phone numbers (international formats), credit card numbers (Luhn-validated), US Social Security Numbers, IP addresses (IPv4 and IPv6), API keys and tokens (patterns like sk-, Bearer, token=), and custom regex patterns.",
    },
    {
      q: "How are matched values replaced?",
      a: "Each PII type is replaced with a labeled placeholder like [EMAIL], [PHONE], [CREDIT_CARD], or [IP_ADDRESS]. This makes the redacted text still readable while removing the sensitive values.",
    },
    {
      q: "Can I use this before sharing logs or bug reports?",
      a: "Yes — paste log output or error traces into the tool, sanitize, then share the cleaned version. All processing runs locally in your browser — the original data is never transmitted.",
    },
  ],

  "/file-metadata": [
    {
      q: "What metadata does the viewer extract?",
      a: "MIME type and magic bytes (actual file type), file size, last modified date, image dimensions (for images), EXIF data (camera model, GPS coordinates, ISO, aperture, shutter speed for JPEG/TIFF), and basic audio/video metadata.",
    },
    {
      q: "Does the file get uploaded to a server?",
      a: "No — the file is read entirely in your browser using the FileReader API. None of its content is transmitted over the network.",
    },
    {
      q: "What are magic bytes?",
      a: "Magic bytes are the first few bytes of a file that identify its true format, regardless of file extension. For example, JPEG files always start with FF D8 FF. This lets you verify a file's actual type even if its extension has been renamed.",
    },
  ],

  "/pomodoro": [
    {
      q: "What is the Pomodoro technique?",
      a: "The Pomodoro Technique is a time management method developed by Francesco Cirillo in the 1980s. Work in focused 25-minute intervals (one 'Pomodoro') followed by a 5-minute break. After 4 Pomodoros take a longer 15–30 minute break.",
    },
    {
      q: "Can I customize the work and break durations?",
      a: "Yes — adjust the work session length, short break length, and long break length to match your personal rhythm. Common alternatives: 50/10 (50 min work, 10 min break) or 90/15 for deep work sessions.",
    },
    {
      q: "Does the timer send browser notifications?",
      a: "Yes — if you grant notification permission, the browser will show an alert when each session ends even if the tab is not in focus.",
    },
  ],

  "/http-tester": [
    {
      q: "What HTTP methods does the tester support?",
      a: "GET, POST, PUT, DELETE, PATCH, HEAD, and OPTIONS — all seven methods used in REST API development.",
    },
    {
      q: "Why do some requests fail with a CORS error?",
      a: "Browsers enforce the Same-Origin Policy: JavaScript can only fetch resources from the same origin unless the server sends Access-Control-Allow-Origin headers. If the target API doesn't include CORS headers, the browser blocks the response. Server-side tools like curl are not subject to CORS.",
    },
    {
      q: "How do I detect if a URL redirects?",
      a: "The tester follows redirects automatically and shows a 'Redirected' banner when the final URL differs from the original. The redirect chain shows the original URL and where it landed.",
    },
    {
      q: "What is the 'Copy as cURL' button for?",
      a: "It generates an equivalent curl command-line call for your current request — including method, URL, all request headers, and body. Paste it into a terminal to replay the same request outside the browser, bypassing CORS restrictions.",
    },
    {
      q: "How do I share a pre-configured request with a teammate?",
      a: "Click 'Share request' to encode the current method, URL, headers, and body into the URL hash. Copy the link and send it — when your teammate opens it, the form is pre-filled with your request.",
    },
  ],

  "/dns-lookup": [
    {
      q: "Which DNS record types can I look up?",
      a: "A (IPv4 address), AAAA (IPv6 address), CNAME (canonical name alias), MX (mail exchange), TXT (arbitrary text, used for SPF, DKIM, domain verification), NS (nameservers), SOA (start of authority), and CAA (certificate authority authorization).",
    },
    {
      q: "Which DNS server is used for lookups?",
      a: "Lookups are made via Google's DNS-over-HTTPS API (dns.google). Responses reflect Google's public resolver cache, which may differ slightly from your ISP's resolver due to propagation delays.",
    },
    {
      q: "What is DNS propagation?",
      a: "After you update a DNS record, the change propagates across global resolvers based on the record's TTL (Time to Live). A TTL of 3600 means resolvers cache the old value for up to 1 hour before refreshing. Full global propagation typically takes 24–48 hours for high-TTL records.",
    },
    {
      q: "How do I verify my domain's SPF or DKIM records?",
      a: "Query the TXT record type for your domain. SPF records start with 'v=spf1' and DKIM records are on the _domainkey subdomain (e.g. selector._domainkey.yourdomain.com).",
    },
  ],

  "/ip-geolocation": [
    {
      q: "How accurate is IP geolocation?",
      a: "Country-level accuracy is typically 95–99%. City-level accuracy is 60–80%. IP geolocation cannot identify exact street addresses and should not be used for precise location. Mobile IP addresses are especially imprecise as they may geolocate to the carrier's switching hub.",
    },
    {
      q: "What information is shown for an IP address?",
      a: "Country, region/state, city, latitude/longitude (approximate), timezone, ISP/ASN, organization name, and whether the IP is a known data center, VPN, or Tor exit node.",
    },
    {
      q: "Can I look up my own IP address?",
      a: "Yes — click 'Detect my IP' to auto-fill and look up your public IP address.",
    },
    {
      q: "Does this tool work for IPv6 addresses?",
      a: "Yes — both IPv4 (e.g. 8.8.8.8) and IPv6 (e.g. 2001:4860:4860::8888) addresses are supported.",
    },
  ],

  "/text-reverser": [
    {
      q: "What reversal modes are available?",
      a: "Reverse characters in the entire string, reverse word order while preserving each word's spelling, reverse each individual word's characters while keeping word order, and flip text upside-down using Unicode special characters.",
    },
    {
      q: "How does the palindrome checker work?",
      a: "It strips punctuation and spaces, lowercases the string, and checks if it reads the same forwards and backwards (e.g. 'racecar', 'A man a plan a canal Panama').",
    },
  ],

  "/countdown-timer": [
    {
      q: "What modes does the countdown timer support?",
      a: "Duration mode (count down from a custom HH:MM:SS), and event mode (count down to a specific future date and time, showing days, hours, minutes, and seconds remaining).",
    },
    {
      q: "Does the timer continue if I switch tabs?",
      a: "Yes — the countdown runs based on wall clock time, not animation frames. Switching tabs or minimizing the window does not affect accuracy.",
    },
  ],

};
