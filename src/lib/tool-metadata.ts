import type { Metadata } from "next";

interface ToolSEO {
  title: string;
  description: string;
  keywords: string[];
}

const toolMetadataMap: Record<string, ToolSEO> = {
  "json-formatter": {
    title: "Format & Validate JSON Online — Free JSON Formatter",
    description:
      "Free online JSON formatter, validator, and minifier. Paste JSON to beautify with syntax highlighting or minify to one line. 100% client-side — no data leaves your browser.",
    keywords: ["json formatter", "json validator", "json beautifier", "json minifier", "format json online", "json pretty print"],
  },
  "xml-formatter": {
    title: "Format & Validate XML Online — Free XML Formatter",
    description:
      "Free online XML formatter and validator. Prettify XML with proper indentation or validate documents instantly. Detailed error messages. No data is sent to any server.",
    keywords: ["xml formatter", "xml validator", "xml beautifier", "format xml online", "xml prettifier"],
  },
  "sql-formatter": {
    title: "Format SQL Queries Online — Free SQL Beautifier",
    description:
      "Free online SQL formatter and beautifier. Format and indent SQL queries for MySQL, PostgreSQL, and T-SQL for better readability. All processing done in your browser.",
    keywords: ["sql formatter", "sql beautifier", "format sql online", "sql query formatter", "sql pretty print"],
  },
  "css-formatter": {
    title: "Format & Minify CSS Online — Free CSS Beautifier",
    description:
      "Free online CSS formatter and minifier. Prettify CSS stylesheets with proper indentation or minify to reduce file size for production. Runs in your browser.",
    keywords: ["css formatter", "css beautifier", "css minifier", "format css online", "css prettifier"],
  },
  "markdown-preview": {
    title: "Markdown Live Preview — Free Online Markdown Editor",
    description:
      "Free online Markdown editor with live HTML preview. Write GitHub Flavored Markdown and see the formatted output instantly in a split-pane view. No account needed.",
    keywords: ["markdown preview", "markdown editor online", "markdown live preview", "gfm preview", "readme editor"],
  },
  "html-formatter": {
    title: "Format & Minify HTML Online — Free HTML Beautifier",
    description:
      "Free online HTML formatter and minifier. Prettify HTML markup for readability or minify to reduce page load size. All processing done entirely in your browser.",
    keywords: ["html formatter", "html beautifier", "html minifier", "format html online", "html prettifier"],
  },
  "json-schema": {
    title: "Generate JSON Schema Online — Free Schema Builder",
    description:
      "Free online JSON Schema generator. Automatically generate a Draft-07 JSON Schema from any JSON object. Instant output with required fields and types inferred. No server needed.",
    keywords: ["json schema generator", "json schema builder", "generate json schema online", "json schema from json"],
  },
  "yaml-validator": {
    title: "Validate & Format YAML Online — Free YAML Linter",
    description:
      "Free online YAML validator and formatter. Paste YAML to check for syntax errors, see clear error messages, and format with correct indentation. Client-side processing.",
    keywords: ["yaml validator", "yaml linter", "validate yaml online", "yaml formatter", "yaml checker"],
  },
  "json-schema-validator": {
    title: "Validate JSON Against Schema Online — Free Tool",
    description:
      "Free online JSON Schema validator. Test JSON data against a JSON Schema (Draft-07) using AJV. Get detailed validation error messages. Runs entirely in your browser.",
    keywords: ["json schema validator", "validate json schema online", "ajv validator", "json schema draft-07"],
  },
  "js-minifier": {
    title: "Minify JavaScript Online — Free JS Minifier Tool",
    description:
      "Free online JavaScript minifier. Remove comments and collapse whitespace to reduce JS file size instantly. No configuration needed — paste and minify. Client-side only.",
    keywords: ["javascript minifier", "js minifier online", "minify javascript", "js compressor", "compress js online"],
  },
  "svg-minifier": {
    title: "Minify SVG Online — Free SVG Optimizer Tool",
    description:
      "Free online SVG minifier and optimizer. Remove comments, metadata, and whitespace from SVG files to reduce file size without losing visual quality. No upload to servers.",
    keywords: ["svg minifier", "svg optimizer online", "minify svg", "optimize svg", "compress svg online"],
  },
  "base64": {
    title: "Encode & Decode Base64 Online — Free Base64 Tool",
    description:
      "Free online Base64 encoder and decoder. Convert text or files to Base64 strings and decode them back instantly. Supports files up to 10 MB. No data leaves your browser.",
    keywords: ["base64 encoder decoder", "encode base64 online", "decode base64 online", "base64 converter", "base64 tool"],
  },
  "url-encoder": {
    title: "URL Encode & Decode Online — Free URI Tool",
    description:
      "Free online URL encoder and decoder. Percent-encode URL components and query strings or decode percent-encoded URLs instantly. All processing client-side.",
    keywords: ["url encoder decoder", "url encode online", "url decode online", "percent encode url", "uri encoder"],
  },
  "jwt-decoder": {
    title: "Decode JWT Tokens Online — Free JWT Inspector",
    description:
      "Free online JWT decoder. Inspect the header, payload, and signature of any JSON Web Token instantly. Great for debugging auth tokens. Nothing is sent to any server.",
    keywords: ["jwt decoder online", "decode jwt token", "jwt inspector", "json web token decoder", "jwt parser"],
  },
  "jwt-generator": {
    title: "Generate Signed JWTs Online — Free JWT Builder",
    description:
      "Free online JWT generator. Create signed JSON Web Tokens with custom payload, algorithm (HS256/RS256), and secret key. All signing done client-side in your browser.",
    keywords: ["jwt generator online", "generate jwt token", "jwt builder", "create jwt online", "json web token generator"],
  },
  "html-entity": {
    title: "HTML Entity Encode & Decode Online — Free Tool",
    description:
      "Free online HTML entity encoder and decoder. Convert special characters like <, >, & to HTML entities and decode them back. Handles all named and numeric entities.",
    keywords: ["html entity encoder", "html entity decoder", "html entities online", "encode html entities", "html escape tool"],
  },
  "string-escape": {
    title: "Escape & Unescape Strings Online — Free Tool",
    description:
      "Free online string escape and unescape tool. Escape or unescape JSON, JavaScript, and SQL strings. Handles newlines, tabs, quotes, and Unicode sequences. No upload.",
    keywords: ["string escape online", "json escape unescape", "javascript string escape", "unescape string online"],
  },
  "base32": {
    title: "Encode & Decode Base32 Online — Free Base32 Tool",
    description:
      "Free online Base32 encoder and decoder (RFC 4648). Convert text to Base32 format or decode Base32 strings back to plain text. Instant, client-side. No login required.",
    keywords: ["base32 encoder decoder", "encode base32 online", "decode base32 online", "rfc 4648 base32"],
  },
  "morse-code": {
    title: "Morse Code Translator Online — Encode & Decode",
    description:
      "Free online Morse code translator. Convert plain text to dots and dashes or decode Morse code back to text. Visual audio playback option. No data sent to servers.",
    keywords: ["morse code translator", "morse code encoder decoder", "text to morse code", "decode morse code online"],
  },
  "text-encryptor": {
    title: "Encrypt & Decrypt Text Online — AES-256-GCM Tool",
    description:
      "Free online text encryption tool using AES-256-GCM. Encrypt and decrypt messages with a password. 100% client-side — your password and data never leave your browser.",
    keywords: ["text encryptor online", "aes encryption online", "encrypt text browser", "decrypt text online", "aes-256 tool"],
  },
  "json-yaml": {
    title: "Convert JSON to YAML Online — Free Converter",
    description:
      "Free online JSON to YAML converter. Paste JSON and get clean YAML output instantly, or convert YAML back to JSON. Bidirectional conversion. Runs in your browser.",
    keywords: ["json to yaml converter", "yaml to json converter", "convert json yaml online", "json yaml tool"],
  },
  "csv-json": {
    title: "Convert CSV to JSON Online — Free Converter",
    description:
      "Free online CSV to JSON converter. Transform CSV data to JSON arrays with automatic header detection, or convert JSON back to CSV. No upload required.",
    keywords: ["csv to json converter", "json to csv converter", "convert csv json online", "csv json tool"],
  },
  "json-to-ts": {
    title: "Generate TypeScript from JSON Online — Free Tool",
    description:
      "Free online JSON to TypeScript converter. Generate TypeScript interfaces and type definitions automatically from any JSON object. Runs entirely in your browser.",
    keywords: ["json to typescript", "generate typescript interfaces", "json typescript converter", "json to ts online"],
  },
  "color-converter": {
    title: "Convert Colors HEX RGB HSL Online — Free Tool",
    description:
      "Free online color converter. Convert colors between HEX, RGB, HSL, and CSS named colors instantly with a visual swatch preview. Runs entirely in your browser.",
    keywords: ["color converter", "hex to rgb", "rgb to hsl", "hex to hsl converter", "color format converter online"],
  },
  "number-base": {
    title: "Number Base Converter — Binary Hex Decimal Online",
    description:
      "Free online number base converter. Convert numbers between binary, octal, decimal, and hexadecimal instantly. Supports large integers. All calculations client-side.",
    keywords: ["number base converter", "binary to decimal", "hex to decimal", "decimal to binary online", "base converter"],
  },
  "timestamp": {
    title: "Unix Timestamp Converter Online — Free Epoch Tool",
    description:
      "Free online Unix timestamp converter. Convert epoch timestamps to human-readable dates and vice versa. Live current timestamp display. Supports milliseconds and seconds.",
    keywords: ["unix timestamp converter", "epoch converter online", "timestamp to date", "date to unix timestamp", "epoch time tool"],
  },
  "xml-json": {
    title: "Convert XML to JSON Online — Free Converter",
    description:
      "Free online XML to JSON converter. Transform XML documents to JSON format instantly with proper structure preservation. Client-side — no data sent to servers.",
    keywords: ["xml to json converter", "convert xml to json online", "xml json transformer", "xml to json tool"],
  },
  "date-calculator": {
    title: "Date Calculator Online — Days Between Dates",
    description:
      "Free online date calculator. Calculate the number of days between two dates, add or subtract durations, and compute age in years, months, and days. Client-side.",
    keywords: ["date calculator online", "days between dates", "date difference calculator", "add subtract days from date"],
  },
  "unit-converter": {
    title: "Unit Converter Online — Length Weight Temperature",
    description:
      "Free online unit converter. Convert length, weight, temperature, area, volume, speed, and more between common units. All calculations run locally in your browser.",
    keywords: ["unit converter online", "length converter", "weight converter", "temperature converter", "measurement converter"],
  },
  "url-parser": {
    title: "URL Parser Online — Inspect URL Components",
    description:
      "Free online URL parser. Break any URL into its components: protocol, hostname, path, port, query parameters, and hash fragment. Instant visual breakdown. No login.",
    keywords: ["url parser online", "url component inspector", "parse url online", "url query parameter parser", "uri parser"],
  },
  "markdown-html": {
    title: "Convert Markdown to HTML Online — Free Tool",
    description:
      "Free online Markdown to HTML converter. Convert Markdown documents and tables to clean HTML markup instantly. Supports GitHub Flavored Markdown (GFM). No login.",
    keywords: ["markdown to html converter", "convert markdown html online", "markdown html tool", "md to html"],
  },
  "image-base64": {
    title: "Image to Base64 Encoder Online — Free Tool",
    description:
      "Free online image to Base64 encoder. Convert images to Base64 data URLs for embedding in HTML, CSS, or JSON. Supports PNG, JPG, WebP, GIF. No upload to servers.",
    keywords: ["image to base64 online", "encode image base64", "base64 image encoder", "image data url generator"],
  },
  "text-binary": {
    title: "Text to Binary Converter Online — Free Tool",
    description:
      "Free online text to binary converter. Convert plain text to binary (0s and 1s) or decode binary back to text. Supports ASCII and Unicode. Runs in your browser.",
    keywords: ["text to binary converter", "binary to text online", "convert text binary", "ascii to binary online"],
  },
  "aspect-ratio": {
    title: "Aspect Ratio Calculator Online — Scale Any Resolution",
    description:
      "Free online aspect ratio calculator. Calculate equivalent resolutions and scale dimensions while preserving ratio. Perfect for responsive images, video, and design work.",
    keywords: ["aspect ratio calculator", "image aspect ratio", "resolution calculator", "scale aspect ratio online"],
  },
  "html-to-markdown": {
    title: "Convert HTML to Markdown Online — Free Tool",
    description:
      "Free online HTML to Markdown converter. Transform HTML markup into clean, readable Markdown text. Great for content migration and documentation. Runs in your browser.",
    keywords: ["html to markdown converter", "convert html markdown online", "html markdown tool", "html to md"],
  },
  "toml-json": {
    title: "Convert TOML to JSON Online — Free Converter",
    description:
      "Free online TOML to JSON converter. Convert TOML configuration files to JSON or convert JSON back to TOML format. Bidirectional support. Runs in your browser.",
    keywords: ["toml to json converter", "json to toml converter", "convert toml json online", "toml json tool"],
  },
  "timezone-converter": {
    title: "Timezone Converter Online — Convert Any IANA Zone",
    description:
      "Free online timezone converter. Convert a date and time between any two IANA timezones instantly. Supports daylight saving time. No login required.",
    keywords: ["timezone converter online", "convert timezone online", "iana timezone converter", "time zone tool"],
  },
  "html-to-jsx": {
    title: "Convert HTML to React JSX Online — Free Tool",
    description:
      "Free online HTML to JSX converter for React. Converts class to className, self-closes void elements, and transforms inline styles to JSX format. Instant output.",
    keywords: ["html to jsx converter", "convert html to react jsx", "html jsx online", "react jsx converter"],
  },
  "curl-to-code": {
    title: "Convert cURL to Code Online — Fetch Axios Python",
    description:
      "Free online cURL to code converter. Convert cURL commands to JavaScript fetch, Axios, Python requests, or Go HTTP client code. Perfect for API integration work.",
    keywords: ["curl to code converter", "curl to javascript fetch", "curl to python requests", "curl to axios", "curl converter online"],
  },
  "xml-yaml": {
    title: "Convert XML to YAML Online — Free Converter",
    description:
      "Free online XML to YAML converter. Transform XML documents to YAML format or convert YAML back to XML. Bidirectional, instant conversion. Runs in your browser.",
    keywords: ["xml to yaml converter", "yaml to xml converter", "convert xml yaml online", "xml yaml tool"],
  },
  "svg-png": {
    title: "Convert SVG to PNG Online — Free Converter",
    description:
      "Free online SVG to PNG converter. Convert SVG files or code to PNG at 1×, 2×, or 3× resolution scale. Drop a file or paste SVG markup. No upload to servers.",
    keywords: ["svg to png converter", "convert svg png online", "svg png export", "svg to image converter"],
  },
  "crypto-converter": {
    title: "Crypto Unit Converter — BTC ETH Gwei Satoshi Online",
    description:
      "Free online crypto unit converter. Convert between Bitcoin units (BTC, mBTC, Satoshi) and Ethereum units (ETH, Gwei, Wei). Real-time calculations in your browser.",
    keywords: ["crypto unit converter", "bitcoin unit converter", "satoshi to btc", "ethereum unit converter", "gwei to eth"],
  },
  "age-calculator": {
    title: "Age Calculator Online — Exact Age in Years & Days",
    description:
      "Free online age calculator. Calculate exact age in years, months, and days from any birthdate. Shows total weeks, hours, minutes, and days until your next birthday.",
    keywords: ["age calculator online", "birthday age calculator", "date of birth calculator", "how old am i calculator"],
  },
  "world-clock": {
    title: "World Clock Online — Live Clocks for Any Timezone",
    description:
      "Free online world clock. View live clocks for multiple IANA timezones simultaneously. Add any timezone and watch them tick in real time. No login required.",
    keywords: ["world clock online", "multiple timezone clock", "live world time", "time zone clocks", "international clock"],
  },
  "hash-generator": {
    title: "Hash Generator Online — MD5 SHA-256 SHA-512 Free",
    description:
      "Free online hash generator. Compute MD5, SHA-1, SHA-256, and SHA-512 cryptographic hashes from any text input instantly. All hashing runs entirely in your browser.",
    keywords: ["hash generator online", "md5 generator", "sha256 generator", "sha512 hash online", "cryptographic hash tool"],
  },
  "uuid-generator": {
    title: "UUID Generator Online — Free v4 & v7 UUID Creator",
    description:
      "Free online UUID generator. Generate RFC-compliant UUID v4 and v7 in bulk. Copy individual UUIDs or export a list. No login required — runs entirely in your browser.",
    keywords: ["uuid generator online", "guid generator", "generate uuid v4", "uuid v7 generator", "random uuid online"],
  },
  "password-generator": {
    title: "Password Generator Online — Secure Random Passwords",
    description:
      "Free online password generator. Create strong, customizable passwords with entropy score. Adjust length, uppercase, digits, and symbols. Runs entirely in your browser.",
    keywords: ["password generator online", "random password generator", "strong password generator", "secure password tool"],
  },
  "lorem-ipsum": {
    title: "Lorem Ipsum Generator Online — Free Placeholder Text",
    description:
      "Free online Lorem Ipsum generator. Generate placeholder text by words, sentences, or paragraphs for any design mockup or prototype. No login or account required.",
    keywords: ["lorem ipsum generator", "placeholder text generator", "dummy text generator", "lorem ipsum online"],
  },
  "qr-code": {
    title: "QR Code Generator Online — Free PNG Download",
    description:
      "Free online QR code generator. Create QR codes from any text or URL and download as PNG. Customize size and error correction level. No login required.",
    keywords: ["qr code generator online", "create qr code", "qr code maker", "free qr generator", "url to qr code"],
  },
  "fake-data": {
    title: "Fake Data Generator Online — Mock Names & Addresses",
    description:
      "Free online fake data generator. Generate realistic mock names, emails, phone numbers, addresses, and more for development and testing. No login or upload required.",
    keywords: ["fake data generator", "mock data generator", "random data generator", "test data generator", "dummy data online"],
  },
  "css-gradient": {
    title: "CSS Gradient Generator Online — Visual Builder Free",
    description:
      "Free online CSS gradient generator. Build linear and radial CSS gradients visually with a color picker and live preview. Copy the CSS background code instantly.",
    keywords: ["css gradient generator", "linear gradient generator", "radial gradient tool", "css background gradient online"],
  },
  "css-box-shadow": {
    title: "CSS Box Shadow Generator Online — Live Preview",
    description:
      "Free online CSS box shadow generator. Create and preview box shadows visually with offset, blur, spread, and color controls. Copy the CSS box-shadow property instantly.",
    keywords: ["css box shadow generator", "box shadow tool online", "css shadow generator", "box-shadow css builder"],
  },
  "color-palette": {
    title: "Color Palette Generator Online — Harmonious Colors",
    description:
      "Free online color palette generator. Generate complementary, triadic, and analogous color palettes from any base color. Export HEX and RGB values. No login needed.",
    keywords: ["color palette generator", "color scheme generator", "complementary colors online", "color harmony tool"],
  },
  "utm-builder": {
    title: "UTM Builder Online — Free Campaign URL Builder",
    description:
      "Free online UTM link builder. Add UTM parameters to any URL for Google Analytics and campaign tracking. Copy the full tagged URL instantly. No account required.",
    keywords: ["utm builder online", "utm link generator", "campaign url builder", "utm parameters tool", "google analytics utm"],
  },
  "slug-generator": {
    title: "Slug Generator Online — Convert Text to URL Slug",
    description:
      "Free online URL slug generator. Convert any text to a clean, URL-safe slug for permalinks and page paths. Handles accents, special characters, and spaces. No login.",
    keywords: ["slug generator online", "url slug converter", "text to slug", "permalink generator", "kebab case converter"],
  },
  "markdown-table": {
    title: "Markdown Table Generator Online — Visual Builder",
    description:
      "Free online Markdown table generator. Build Markdown tables visually with a grid editor and copy the formatted output. No special syntax knowledge needed. No login.",
    keywords: ["markdown table generator", "create markdown table online", "md table builder", "markdown table tool"],
  },
  "meta-tag": {
    title: "Meta Tag Generator Online — SEO & Open Graph Tags",
    description:
      "Free online meta tag generator. Generate SEO meta tags, Open Graph (og:), and Twitter Card tags for HTML head. Preview how your page looks when shared on social media.",
    keywords: ["meta tag generator", "seo meta tags", "open graph generator", "twitter card generator", "html meta tags tool"],
  },
  "css-flexbox": {
    title: "CSS Flexbox Playground — Visual Layout Builder",
    description:
      "Free online CSS Flexbox playground. Build flex container layouts visually with controls for direction, wrap, justify-content, and align-items. Copy the generated CSS.",
    keywords: ["css flexbox playground", "flexbox generator online", "flexbox visual builder", "css flex layout tool"],
  },
  "color-picker": {
    title: "Color Picker Online — HEX RGB HSL Visual Tool",
    description:
      "Free online color picker. Choose colors with HSL and RGB sliders, copy in HEX, RGB, or HSL format. Visual swatch preview included. Runs entirely in your browser.",
    keywords: ["color picker online", "hex color picker", "rgb color picker", "hsl color picker", "visual color selector"],
  },
  "hmac-generator": {
    title: "HMAC Generator Online — SHA-256 SHA-512 Free Tool",
    description:
      "Free online HMAC generator. Compute HMAC authentication codes using SHA-256, SHA-1, or SHA-512. Enter a message and secret key. Runs entirely in your browser.",
    keywords: ["hmac generator online", "hmac sha256 generator", "hmac sha512 tool", "message authentication code", "hmac online"],
  },
  "totp-generator": {
    title: "TOTP Generator Online — 2FA Code Testing Tool",
    description:
      "Free online TOTP generator. Generate RFC 6238 time-based one-time passwords — compatible with Google Authenticator and Authy. Useful for testing 2FA integrations.",
    keywords: ["totp generator online", "2fa code generator", "otp generator", "google authenticator tester", "totp tool"],
  },
  "css-grid": {
    title: "CSS Grid Playground — Visual Grid Layout Builder",
    description:
      "Free online CSS Grid playground. Design grid layouts visually — set columns, rows, gap, and alignment. See the live preview and copy the generated CSS instantly.",
    keywords: ["css grid playground", "css grid generator online", "grid layout builder", "css grid visual editor"],
  },
  "gitignore": {
    title: ".gitignore Generator Online — Any Language or OS",
    description:
      "Free online .gitignore generator. Create a .gitignore file for any language, framework, or OS with one click. Supports Node.js, Python, Java, Go, Rust, and more.",
    keywords: ["gitignore generator online", "create gitignore file", "gitignore builder", "git ignore generator"],
  },
  "web-manifest": {
    title: "Web App Manifest Generator Online — PWA Builder",
    description:
      "Free online web app manifest.json generator for PWAs. Set app name, icons, display mode, theme colors, and start URL. Copy the JSON instantly. No login required.",
    keywords: ["web manifest generator", "pwa manifest builder", "manifest.json generator", "web app manifest online"],
  },
  "robots-txt": {
    title: "Robots.txt Generator Online — Free SEO Tool",
    description:
      "Free online robots.txt generator. Build a robots.txt file with allow/disallow rules per search bot and add your sitemap URL. Copy and deploy instantly. No login.",
    keywords: ["robots.txt generator", "robots txt builder online", "create robots.txt file", "seo robots tool"],
  },
  "cors-generator": {
    title: "CORS Header Generator — Nginx Apache Express Config",
    description:
      "Free online CORS header config generator. Generate CORS headers for Apache .htaccess, Nginx config, or Node/Express middleware. Copy the configuration code instantly.",
    keywords: ["cors header generator", "cors config generator", "nginx cors config", "apache cors headers", "express cors middleware"],
  },
  "npm-scripts": {
    title: "NPM Script Builder Online — package.json Generator",
    description:
      "Free online NPM script builder. Generate your package.json scripts section with common dev, build, test, and lint tasks. Copy and paste directly into your project.",
    keywords: ["npm script builder", "package.json scripts generator", "npm scripts online", "node npm script tool"],
  },
  "css-bezier": {
    title: "CSS Cubic Bezier Generator — Animation Easing Tool",
    description:
      "Free online CSS cubic-bezier timing function generator. Create custom easing curves with a draggable interactive curve editor and preview your animation timing live.",
    keywords: ["css cubic bezier generator", "bezier easing generator", "css animation timing", "easing function tool online"],
  },
  "svg-blob": {
    title: "SVG Blob Generator Online — Organic Shape Creator",
    description:
      "Free online SVG blob generator. Create organic, randomized blob shapes with adjustable complexity and smoothness. Copy the SVG code or download the file. No login.",
    keywords: ["svg blob generator", "organic shape generator", "blob shape maker", "svg blob creator online"],
  },
  "tailwind-colors": {
    title: "Tailwind Color Generator — Custom Palette Shades",
    description:
      "Free online Tailwind CSS color generator. Generate a full 50–950 shade scale from any base color. Copy the ready-to-use Tailwind config object for your project.",
    keywords: ["tailwind color generator", "tailwind color palette", "tailwind custom colors", "tailwind shades generator"],
  },
  "placeholder-image": {
    title: "Placeholder Image Generator Online — Custom Size",
    description:
      "Free online placeholder image generator. Create placeholder images with custom dimensions, background color, text label, and font. Download as PNG. No login required.",
    keywords: ["placeholder image generator", "dummy image generator", "create placeholder image online", "test image generator"],
  },
  "ascii-art": {
    title: "ASCII Art Generator Online — Text to ASCII Fonts",
    description:
      "Free online ASCII art generator. Convert text to ASCII art in multiple font styles including Big, Banner, Block, and Bubble. Copy or download the output. No login.",
    keywords: ["ascii art generator", "text to ascii art online", "ascii font generator", "figlet online", "ascii text art"],
  },
  "image-resizer": {
    title: "Image Resizer Online — Free Browser-Based Tool",
    description:
      "Free online image resizer. Resize and crop images in your browser — set exact dimensions, lock aspect ratio, and choose PNG, JPEG, or WebP output. No upload needed.",
    keywords: ["image resizer online", "resize image online", "crop image online", "image dimension tool", "photo resizer free"],
  },
  "image-compressor": {
    title: "Image Compressor Online — JPEG PNG WebP Free",
    description:
      "Free online image compressor. Compress JPEG, PNG, and WebP images directly in your browser. Adjust quality slider and download the smaller file instantly. No upload.",
    keywords: ["image compressor online", "compress image online", "jpg compressor", "png compressor", "reduce image size free"],
  },
  "favicon-generator": {
    title: "Favicon Generator Online — All Sizes & HTML Snippet",
    description:
      "Free online favicon generator. Create all favicon sizes (16×16 to 512×512) from any image and download with the complete HTML link tag snippet. No login required.",
    keywords: ["favicon generator online", "create favicon online", "favicon maker", "icon generator", "favicon ico generator"],
  },
  "wifi-qr": {
    title: "WiFi QR Code Generator Online — Share WiFi Easily",
    description:
      "Free online WiFi QR code generator. Create a scannable QR code that auto-connects phones to your WiFi network — no password typing required. Download as PNG.",
    keywords: ["wifi qr code generator", "wifi qr maker", "share wifi qr code", "wifi network qr generator"],
  },
  "regex-tester": {
    title: "Regex Tester Online — Live Match Highlighting",
    description:
      "Free online regex tester. Test regular expressions with live match highlighting, capture groups, and named groups. Supports all JavaScript regex flags. No login needed.",
    keywords: ["regex tester online", "regular expression tester", "regexp online", "regex match highlighter", "javascript regex tool"],
  },
  "cron-tester": {
    title: "CRON Expression Tester Online — Validate Schedule",
    description:
      "Free online CRON expression tester and validator. Validate cron syntax and preview the next scheduled run times in human-readable format. Supports 5 and 6 field cron.",
    keywords: ["cron expression tester", "cron validator online", "cron schedule tester", "cron job validator", "crontab tester"],
  },
  "diff-viewer": {
    title: "Text Diff Viewer Online — Compare Two Files",
    description:
      "Free online text diff viewer. Compare two text blocks side by side with highlighted additions, deletions, and unchanged lines. No data is sent to any server.",
    keywords: ["text diff viewer online", "file diff tool", "compare text online", "online diff checker", "side by side diff"],
  },
  "word-counter": {
    title: "Word & Character Counter Online — Free Tool",
    description:
      "Free online word and character counter. Count words, characters with/without spaces, lines, sentences, and estimate reading time. Instant results in your browser.",
    keywords: ["word counter online", "character counter", "word character count tool", "reading time calculator", "word count checker"],
  },
  "text-case": {
    title: "Text Case Converter — camelCase snake_case Online",
    description:
      "Free online text case converter. Convert text between camelCase, snake_case, PascalCase, kebab-case, UPPER_CASE, and Title Case in one click. No login required.",
    keywords: ["text case converter", "camelcase converter", "snake_case converter", "pascalcase online", "kebab case tool"],
  },
  "byte-size": {
    title: "String Byte Size Calculator Online — UTF-8 Tool",
    description:
      "Free online UTF-8 byte size calculator. Find out the exact byte length of any string in UTF-8 encoding. Useful for API payload limits and database field sizing.",
    keywords: ["byte size calculator", "string byte length", "utf-8 byte counter", "payload size calculator", "string size tool"],
  },
  "http-status": {
    title: "HTTP Status Codes Reference — Complete Code Guide",
    description:
      "Free online HTTP status codes reference. Browse all 1xx, 2xx, 3xx, 4xx, and 5xx HTTP codes with descriptions, typical use cases, and RFC links. Filterable list.",
    keywords: ["http status codes", "http status code reference", "http error codes", "rest api status codes", "http code list"],
  },
  "useragent-parser": {
    title: "User-Agent Parser Online — Browser & Device Detect",
    description:
      "Free online User-Agent parser. Detect browser name, version, engine, OS, and device type from any UA string. Paste a User-Agent string and analyze it instantly.",
    keywords: ["user agent parser online", "useragent parser", "browser detect online", "ua string parser", "user agent analyzer"],
  },
  "jsonpath": {
    title: "JSONPath Tester Online — Query & Extract JSON Data",
    description:
      "Free online JSONPath expression tester. Run JSONPath queries against JSON data and inspect matching results. Supports dot notation and bracket expressions. No login.",
    keywords: ["jsonpath tester online", "jsonpath query tool", "json path expression tester", "jsonpath playground"],
  },
  "ip-subnet": {
    title: "IP Subnet Calculator Online — CIDR & Host Range",
    description:
      "Free online IP subnet calculator. Calculate network address, broadcast address, usable host range, and CIDR notation from any IPv4 address and subnet mask.",
    keywords: ["ip subnet calculator", "cidr calculator online", "subnet mask calculator", "network address calculator", "ipv4 subnet tool"],
  },
  "chmod": {
    title: "Chmod Calculator Online — Unix File Permissions",
    description:
      "Free online chmod calculator. Convert Unix file permissions between symbolic notation (rwxrwxrwx) and octal numeric mode. Toggle permissions with visual checkboxes.",
    keywords: ["chmod calculator online", "unix permissions calculator", "chmod number converter", "linux file permissions tool"],
  },
  "semver": {
    title: "Semver Analyzer Online — Parse & Validate Versions",
    description:
      "Free online semantic versioning analyzer. Parse, compare, validate, and sort semver strings (major.minor.patch). Check ranges and pre-release identifiers. No login.",
    keywords: ["semver analyzer", "semantic version validator", "semver parser online", "version comparison tool", "semver checker"],
  },
  "line-sorter": {
    title: "Line Sorter Online — Sort, Deduplicate & Shuffle",
    description:
      "Free online line sorter. Sort text lines alphabetically (A–Z or Z–A), remove duplicate lines, shuffle randomly, or reverse the order. Runs entirely in your browser.",
    keywords: ["line sorter online", "sort lines of text", "remove duplicate lines", "text line sort tool", "shuffle lines online"],
  },
  "find-replace": {
    title: "Find & Replace Text Online — Regex Supported",
    description:
      "Free online find and replace tool. Find and replace text with plain string or regex patterns. Supports case-insensitive search and global replace. Instant output.",
    keywords: ["find and replace online", "text find replace tool", "regex find replace", "string replace online"],
  },
  "percentage": {
    title: "Percentage Calculator Online — Discounts & Changes",
    description:
      "Free online percentage calculator. Calculate what % of a value is, percentage change, discounts, markups, and increases or decreases. Instant results in your browser.",
    keywords: ["percentage calculator online", "percent calculator", "discount calculator", "percentage change calculator"],
  },
  "csv-viewer": {
    title: "CSV Viewer Online — Preview CSV as Interactive Table",
    description:
      "Free online CSV viewer. Upload or paste CSV data and preview it as a sortable, filterable interactive table. Supports comma, semicolon, and tab delimiters. No login.",
    keywords: ["csv viewer online", "csv table viewer", "view csv online", "csv file preview", "csv to table online"],
  },
  "json-diff": {
    title: "JSON Diff Checker Online — Compare JSON Objects",
    description:
      "Free online JSON diff tool. Compare two JSON objects and highlight added, removed, and changed keys with a clear visual diff. All comparison runs in your browser.",
    keywords: ["json diff checker", "compare json objects online", "json comparison tool", "json diff viewer", "json diff online"],
  },
  "password-strength": {
    title: "Password Strength Checker — Entropy & Crack Time",
    description:
      "Free online password strength checker. Analyze entropy, character variety, and estimated brute-force crack time. No password is ever sent to any server.",
    keywords: ["password strength checker", "password entropy calculator", "check password strength online", "password security tool"],
  },
  "readability": {
    title: "Readability Score Checker Online — Flesch-Kincaid",
    description:
      "Free online readability analyzer. Score your text using Flesch-Kincaid, Gunning Fog, SMOG, and ARI formulas to assess reading level and comprehension difficulty.",
    keywords: ["readability score checker", "flesch kincaid calculator", "text readability tool", "gunning fog index online"],
  },
  "ascii-table": {
    title: "ASCII Table Reference — Hex Decimal Binary Codes",
    description:
      "Free online ASCII character reference table. Browse all 128 ASCII characters with decimal, hexadecimal, octal, binary codes, and HTML entities. Extended ASCII included.",
    keywords: ["ascii table", "ascii character codes", "ascii reference table", "hex ascii table", "ascii code chart"],
  },
  "color-contrast": {
    title: "Color Contrast Checker — WCAG AA & AAA Compliance",
    description:
      "Free online color contrast checker. Check foreground/background color contrast ratios against WCAG 2.1 AA and AAA accessibility standards. Find accessible color pairs.",
    keywords: ["color contrast checker", "wcag contrast checker", "accessibility contrast tool", "aa aaa contrast ratio", "color accessibility"],
  },
  "number-formatter": {
    title: "Number Formatter Online — Currency & Locale Format",
    description:
      "Free online number formatter. Format numbers with locale-specific separators, currency symbols, and decimal precision. Supports all IANA locales. Runs in your browser.",
    keywords: ["number formatter online", "currency formatter", "locale number format", "number format tool", "decimal formatter"],
  },
  "env-parser": {
    title: ".env File Parser Online — Extract Key-Value Pairs",
    description:
      "Free online .env file parser. Paste a dotenv file to extract key-value pairs, detect syntax errors, and export variables as JSON. Runs entirely in your browser.",
    keywords: ["env file parser online", "dotenv parser", "parse env file online", "env to json converter", "environment file parser"],
  },
  "css-specificity": {
    title: "CSS Specificity Calculator Online — Selector Score",
    description:
      "Free online CSS specificity calculator. Calculate the specificity score (IDs, classes, elements) for any CSS selector and understand cascade and override rules.",
    keywords: ["css specificity calculator", "css selector specificity", "specificity score online", "css cascade calculator"],
  },
  "text-repeater": {
    title: "Text Repeater Online — Repeat Strings N Times",
    description:
      "Free online text repeater. Repeat any text or string a custom number of times with an optional separator between repetitions. Instant output. No login required.",
    keywords: ["text repeater online", "string repeater tool", "repeat text online", "duplicate string n times"],
  },
  "og-preview": {
    title: "Open Graph Preview Online — Twitter LinkedIn Share",
    description:
      "Free online Open Graph preview tool. Preview how your webpage looks when shared on Twitter/X, LinkedIn, and Facebook. Enter your URL or fill in meta tags manually.",
    keywords: ["open graph preview", "og preview tool", "social share preview", "twitter card preview", "facebook og preview"],
  },
  "diff-checker": {
    title: "Diff Checker Online — Line & Character Comparison",
    description:
      "Free online diff checker. Compare two texts side by side with line numbers and character-level highlighting. Clearly see additions and removals. No login required.",
    keywords: ["diff checker online", "text comparison tool", "line diff tool", "compare two texts online", "character diff checker"],
  },
  "line-counter": {
    title: "Code Line Counter Online — Blank, Comment & Code",
    description:
      "Free online code line counter. Paste code and count total lines, blank lines, comment lines, and code lines with a visual percentage breakdown by category.",
    keywords: ["code line counter", "count lines of code online", "loc counter", "blank lines counter", "code stats tool"],
  },
  "emoji-picker": {
    title: "Emoji Picker Online — Search & Copy Unicode Emojis",
    description:
      "Free online emoji picker. Search emojis by name or keyword, browse by category, and click to copy to clipboard. Tracks recently used emojis. Works in all browsers.",
    keywords: ["emoji picker online", "emoji search copy", "unicode emoji picker", "copy emoji online", "emoji keyboard tool"],
  },
  "data-sanitizer": {
    title: "PII Data Sanitizer Online — Redact Emails & Phones",
    description:
      "Free online PII data sanitizer. Remove or redact emails, phone numbers, credit card numbers, IP addresses, API keys, and SSNs from text. 100% client-side.",
    keywords: ["pii data sanitizer", "redact pii online", "data anonymizer", "remove pii from text", "privacy data cleaner"],
  },
  "file-metadata": {
    title: "File Metadata Viewer Online — EXIF GPS & More",
    description:
      "Free online file metadata viewer. Extract EXIF data, image dimensions, GPS coordinates, creation date, and magic bytes from images and other files. No upload to servers.",
    keywords: ["file metadata viewer", "exif viewer online", "image metadata tool", "exif data extractor", "gps exif reader"],
  },
  "pomodoro": {
    title: "Pomodoro Timer Online — 25 Min Focus Sessions",
    description:
      "Free online Pomodoro timer. Stay productive with 25-minute work sessions and customizable short and long break intervals. Tracks your completed session count.",
    keywords: ["pomodoro timer online", "focus timer tool", "25 minute timer", "productivity timer", "work break timer"],
  },
  "http-tester": {
    title: "HTTP Request Tester Online — Send API Requests",
    description:
      "Free online HTTP request tester. Send GET, POST, PUT, and DELETE requests directly from your browser and inspect response headers, status, and body. No Postman needed.",
    keywords: ["http request tester online", "api tester browser", "http client online", "rest api tester free", "fetch api tester"],
  },
  "text-reverser": {
    title: "Text Reverser Online — Reverse Words & Characters",
    description:
      "Free online text reverser. Reverse characters in a string, reverse word order, reverse lines, flip text upside-down, and check if a string is a palindrome.",
    keywords: ["text reverser online", "reverse string online", "flip text online", "reverse words tool", "palindrome checker"],
  },
  "countdown-timer": {
    title: "Countdown Timer Online — Count to Any Date or Time",
    description:
      "Free online countdown timer. Count down from a custom duration or to a specific future date and time. Great for events, deadlines, product launches, and exams.",
    keywords: ["countdown timer online", "event countdown timer", "date countdown tool", "deadline timer online", "count down to date"],
  },
};

export function getToolMetadata(slug: string): import("next").Metadata {
  const tool = toolMetadataMap[slug];
  if (!tool) return {};

  return {
    title: tool.title,
    description: tool.description,
    keywords: tool.keywords,
    openGraph: {
      title: `${tool.title} | WebUtility`,
      description: tool.description,
      type: "website",
      url: `https://trywebutility.com/${slug}`,
      siteName: "WebUtility",
    },
    twitter: {
      card: "summary",
      title: `${tool.title} | WebUtility`,
      description: tool.description,
    },
    alternates: {
      canonical: `https://trywebutility.com/${slug}`,
    },
  };
}

export { toolMetadataMap };
export type { ToolSEO };
