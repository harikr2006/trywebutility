export function xmlToJson(xml: string): { output: string; error: string | null } {
  try {
    if (!xml.trim()) return { output: "", error: null };
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, "application/xml");
    const parseError = doc.querySelector("parsererror");
    if (parseError) throw new Error(parseError.textContent ?? "XML parse error");
    function nodeToObj(node: Element): unknown {
      const obj: Record<string, unknown> = {};
      // attributes
      for (const attr of Array.from(node.attributes)) {
        obj[`@${attr.name}`] = attr.value;
      }
      const children = Array.from(node.children);
      if (children.length === 0) {
        const text = node.textContent?.trim() ?? "";
        if (Object.keys(obj).length === 0) return text;
        if (text) obj["#text"] = text;
        return obj;
      }
      const grouped: Record<string, unknown[]> = {};
      for (const child of children) {
        if (!grouped[child.tagName]) grouped[child.tagName] = [];
        (grouped[child.tagName] as unknown[]).push(nodeToObj(child));
      }
      for (const [k, v] of Object.entries(grouped)) {
        obj[k] = v.length === 1 ? v[0] : v;
      }
      return obj;
    }
    const root = doc.documentElement;
    const result = { [root.tagName]: nodeToObj(root) };
    return { output: JSON.stringify(result, null, 2), error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "Conversion failed" };
  }
}
