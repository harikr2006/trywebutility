import CategoryPage from "@/components/shared/CategoryPage";

export default function ConvertersPage() {
  return (
    <CategoryPage
      category="Converters"
      headline="Online Data Format & Unit Converters"
      subtext="Convert between data formats, units, colors, timestamps, and more. JSON↔YAML, XML↔JSON, HEX↔RGB↔HSL, Unix timestamps, timezones, number bases, and 20+ more conversion tools — all running instantly in your browser."
    >
      <section className="mt-4 space-y-6 text-sm text-muted-foreground leading-relaxed">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-foreground mb-3">
            Data format converters
          </h2>
          <p>
            Format converters let you move data between serialization formats without writing code.
            The most common are JSON↔YAML (for switching between API responses and config files),
            XML↔JSON (for legacy integrations), and CSV↔JSON (for spreadsheet data ingestion).
            All converters preserve nested structures and data types.
          </p>
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-foreground mb-3">
            Popular converter tools
          </h2>
          <ul className="space-y-1.5">
            <li><strong className="text-foreground">JSON ↔ YAML</strong> — switch between JSON and YAML without rewriting config. Preserves nested keys, arrays, and multiline strings.</li>
            <li><strong className="text-foreground">Color Converter</strong> — convert between HEX (#1a2b3c), RGB (26,43,60), HSL (209°,40%,17%), and named CSS colors.</li>
            <li><strong className="text-foreground">Timezone Converter</strong> — convert any date and time between 400+ IANA timezone pairs with automatic DST handling.</li>
            <li><strong className="text-foreground">Timestamp Converter</strong> — convert Unix epoch timestamps to human-readable dates and vice versa. Supports seconds and milliseconds.</li>
            <li><strong className="text-foreground">Number Base Converter</strong> — convert integers between binary (base 2), octal (base 8), decimal (base 10), and hexadecimal (base 16).</li>
            <li><strong className="text-foreground">Unit Converter</strong> — convert length (km↔miles), weight (kg↔lbs), temperature (°C↔°F), and more common units.</li>
          </ul>
        </div>
      </section>
    </CategoryPage>
  );
}
