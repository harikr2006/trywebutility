import CategoryPage from "@/components/shared/CategoryPage";

export default function EncodersPage() {
  return (
    <CategoryPage
      category="Encoders & Decoders"
      headline="Online Encoders & Decoders"
      subtext="Encode and decode data formats directly in your browser. Base64, URL percent-encoding, HTML entities, JWT tokens, string escaping, HMAC, and more — free, instant, and completely client-side."
    >
      <section className="mt-4 space-y-6 text-sm text-muted-foreground leading-relaxed">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-foreground mb-3">
            What is encoding?
          </h2>
          <p>
            Encoding converts data from one representation to another for safe transmission or storage.
            For example, Base64 encodes binary data as ASCII characters for embedding in JSON or HTML.
            URL encoding replaces reserved characters (like <code className="font-mono text-xs bg-muted px-1 rounded">&amp;</code> and <code className="font-mono text-xs bg-muted px-1 rounded">#</code>) with percent-escaped equivalents so they can safely appear in URLs.
          </p>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-foreground mb-3">
            Common encoding tools
          </h2>
          <ul className="space-y-1.5">
            <li><strong className="text-foreground">Base64 Encoder/Decoder</strong> — encode text or binary files to Base64 strings, or decode them back. Supports files up to 10 MB.</li>
            <li><strong className="text-foreground">URL Encoder/Decoder</strong> — percent-encode query parameters and path segments or decode encoded URLs for readability.</li>
            <li><strong className="text-foreground">JWT Decoder</strong> — inspect the header, payload, and signature of any JWT token without a secret key. Useful for debugging auth flows.</li>
            <li><strong className="text-foreground">HTML Entity Encoder</strong> — escape <code className="font-mono text-xs bg-muted px-1 rounded">&lt;</code>, <code className="font-mono text-xs bg-muted px-1 rounded">&gt;</code>, <code className="font-mono text-xs bg-muted px-1 rounded">&amp;</code>, and other characters to safe HTML entities, or decode entities back to plain text.</li>
            <li><strong className="text-foreground">String Escape/Unescape</strong> — escape backslashes, quotes, and control characters for JSON, JavaScript, and SQL strings.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-foreground mb-3">
            Privacy & security
          </h2>
          <p>
            All encoding and decoding runs entirely in your browser — your API keys, JWT tokens, passwords,
            and sensitive data are never transmitted to any server. You can even use these tools offline
            after the page first loads.
          </p>
        </div>
      </section>
    </CategoryPage>
  );
}
