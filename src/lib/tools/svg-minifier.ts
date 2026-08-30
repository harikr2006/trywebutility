export function minifySvg(svg: string): { output: string; error: string | null; originalBytes: number; minifiedBytes: number } {
  try {
    if (!svg.trim()) return { output: "", error: null, originalBytes: 0, minifiedBytes: 0 };

    const originalBytes = new TextEncoder().encode(svg).length;
    let out = svg;

    // Remove XML declaration
    out = out.replace(/<\?xml[^?]*\?>/g, "");

    // Remove comments
    out = out.replace(/<!--[\s\S]*?-->/g, "");

    // Remove DOCTYPE
    out = out.replace(/<!DOCTYPE[^>]*>/gi, "");

    // Remove metadata elements
    out = out.replace(/<metadata[\s\S]*?<\/metadata>/gi, "");
    out = out.replace(/<title[\s\S]*?<\/title>/gi, "");
    out = out.replace(/<desc[\s\S]*?<\/desc>/gi, "");

    // Remove editor-specific attributes (Inkscape, Sodipodi)
    out = out.replace(/\s+(?:inkscape|sodipodi|dc|cc|rdf|xlink):[\w:.-]+="[^"]*"/g, "");
    out = out.replace(/\s+xmlns:(?:inkscape|sodipodi|dc|cc|rdf)="[^"]*"/g, "");

    // Remove style attributes with only defaults
    out = out.replace(/\s+style="([^"]*)"/g, (m, val) => {
      // Keep non-trivial styles
      const cleaned = val.replace(/\b(?:fill:none|stroke:none|display:inline)\b;?/g, "").trim().replace(/;$/, "");
      return cleaned ? ` style="${cleaned}"` : "";
    });

    // Collapse whitespace between tags
    out = out.replace(/>\s+</g, "><");

    // Collapse multiple spaces in attribute values (not between < >)
    out = out.replace(/\s{2,}/g, " ");

    // Trim
    out = out.trim();

    const minifiedBytes = new TextEncoder().encode(out).length;
    return { output: out, error: null, originalBytes, minifiedBytes };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "Minification failed", originalBytes: 0, minifiedBytes: 0 };
  }
}
