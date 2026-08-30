import * as yaml from "js-yaml";

// Reuse the same DOM-based XML→JSON logic from xml-json.ts
function xmlToObj(xml: string): unknown {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "application/xml");
  const parseError = doc.querySelector("parsererror");
  if (parseError) throw new Error(parseError.textContent ?? "XML parse error");

  function nodeToObj(node: Element): unknown {
    const obj: Record<string, unknown> = {};
    for (const attr of Array.from(node.attributes)) {
      obj[`@${attr.name}`] = attr.value;
    }
    const children = Array.from(node.children);
    if (children.length === 0) {
      const text = node.textContent?.trim() ?? "";
      return Object.keys(obj).length === 0 ? text : { ...obj, "#text": text };
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
  return { [root.tagName]: nodeToObj(root) };
}

export function xmlToYaml(xml: string): { output: string; error: string | null } {
  try {
    if (!xml.trim()) return { output: "", error: null };
    const obj = xmlToObj(xml);
    return { output: yaml.dump(obj, { indent: 2 }), error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "Conversion failed" };
  }
}

export function yamlToXml(yamlStr: string): { output: string; error: string | null } {
  try {
    if (!yamlStr.trim()) return { output: "", error: null };
    const obj = yaml.load(yamlStr) as Record<string, unknown>;

    function objToXml(key: string, val: unknown, indent = 0): string {
      const pad = "  ".repeat(indent);
      if (val === null || val === undefined) return `${pad}<${key}/>`;
      if (typeof val !== "object") return `${pad}<${key}>${String(val)}</${key}>`;
      if (Array.isArray(val)) {
        return val.map(item => objToXml(key, item, indent)).join("\n");
      }
      const children = Object.entries(val as Record<string, unknown>)
        .filter(([k]) => !k.startsWith("@") && k !== "#text")
        .map(([k, v]) => objToXml(k, v, indent + 1))
        .join("\n");
      const text = (val as Record<string, unknown>)["#text"];
      const attrStr = Object.entries(val as Record<string, unknown>)
        .filter(([k]) => k.startsWith("@"))
        .map(([k, v]) => ` ${k.slice(1)}="${v}"`)
        .join("");
      if (!children && !text) return `${pad}<${key}${attrStr}/>`;
      if (!children) return `${pad}<${key}${attrStr}>${text}</${key}>`;
      return `${pad}<${key}${attrStr}>\n${children}\n${pad}</${key}>`;
    }

    const rootKey = Object.keys(obj)[0];
    if (!rootKey) throw new Error("Empty YAML");
    const xmlStr = `<?xml version="1.0" encoding="UTF-8"?>\n${objToXml(rootKey, obj[rootKey])}`;
    return { output: xmlStr, error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "Conversion failed" };
  }
}
