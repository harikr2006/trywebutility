import CategoryPage from "@/components/shared/CategoryPage";

export default function GeneratorsPage() {
  return (
    <CategoryPage
      category="Generators"
      headline="Online Code & Asset Generators"
      subtext="Generate UUIDs, QR codes, passwords, CSS gradients, box shadows, favicons, placeholder images, Lorem Ipsum text, fake test data, and much more — all free, instantly, with no account required."
    >
      <section className="mt-4 space-y-6 text-sm text-muted-foreground leading-relaxed">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-foreground mb-3">
            Developer generators
          </h2>
          <ul className="space-y-1.5">
            <li><strong className="text-foreground">UUID Generator</strong> — generate RFC-compliant UUID v4 and v7 identifiers in bulk — copy as JSON array or plain list.</li>
            <li><strong className="text-foreground">Password Generator</strong> — generate cryptographically strong passwords with custom length, character sets, and entropy score.</li>
            <li><strong className="text-foreground">Hash Generator</strong> — generate MD5, SHA-1, SHA-256, and SHA-512 hashes from any text string or file content.</li>
            <li><strong className="text-foreground">Fake Data Generator</strong> — generate mock names, emails, phone numbers, addresses, and company names for testing and prototyping.</li>
            <li><strong className="text-foreground">Lorem Ipsum Generator</strong> — generate placeholder text by word, sentence, or paragraph count in classic or random Lorem Ipsum.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-foreground mb-3">
            CSS & design generators
          </h2>
          <ul className="space-y-1.5">
            <li><strong className="text-foreground">CSS Gradient Generator</strong> — build linear and radial CSS gradients visually with live preview and copy-ready code.</li>
            <li><strong className="text-foreground">CSS Box Shadow Generator</strong> — design layered box shadows with a drag-and-drop editor and get the CSS output.</li>
            <li><strong className="text-foreground">CSS Flexbox Playground</strong> — configure flexbox properties visually and copy the generated CSS for your layout.</li>
            <li><strong className="text-foreground">CSS Grid Playground</strong> — define grid columns, rows, gap, and alignment visually and export the CSS.</li>
            <li><strong className="text-foreground">Tailwind Color Generator</strong> — generate a full 50–950 shade palette from any base color in Tailwind CSS format.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-foreground mb-3">
            Image & asset generators
          </h2>
          <ul className="space-y-1.5">
            <li><strong className="text-foreground">QR Code Generator</strong> — generate a QR code from any text or URL and download as a PNG file.</li>
            <li><strong className="text-foreground">Favicon Generator</strong> — create all favicon sizes (16×16 to 512×512) from any image and download with the HTML snippet.</li>
            <li><strong className="text-foreground">Placeholder Image</strong> — generate placeholder images with custom width, height, colors, and text for mockups.</li>
            <li><strong className="text-foreground">Code to Image</strong> — turn a code snippet into a shareable, beautifully formatted image with syntax highlighting.</li>
          </ul>
        </div>
      </section>
    </CategoryPage>
  );
}
