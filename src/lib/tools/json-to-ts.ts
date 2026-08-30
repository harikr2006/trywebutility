type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function toPascalCase(s: string): string {
  return s
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (_, c) => c.toUpperCase());
}

function inferType(
  value: JsonValue,
  key: string,
  interfaces: Map<string, string>,
  usedNames: Set<string>
): string {
  if (value === null) return "null";
  if (typeof value === "string") return "string";
  if (typeof value === "number") return Number.isInteger(value) ? "number" : "number";
  if (typeof value === "boolean") return "boolean";

  if (Array.isArray(value)) {
    if (value.length === 0) return "unknown[]";
    // Infer element type from first non-null element
    const elementType = inferType(value[0], key + "Item", interfaces, usedNames);
    return `${elementType}[]`;
  }

  if (typeof value === "object") {
    const interfaceName = generateUniqueName(toPascalCase(key) || "Object", usedNames);
    usedNames.add(interfaceName);
    const lines: string[] = [`interface ${interfaceName} {`];

    for (const [k, v] of Object.entries(value as Record<string, JsonValue>)) {
      const childType = inferType(v, capitalize(k), interfaces, usedNames);
      const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `"${k}"`;
      lines.push(`  ${safeKey}: ${childType};`);
    }

    lines.push("}");
    interfaces.set(interfaceName, lines.join("\n"));
    return interfaceName;
  }

  return "unknown";
}

function generateUniqueName(base: string, used: Set<string>): string {
  if (!used.has(base)) return base;
  let i = 2;
  while (used.has(`${base}${i}`)) i++;
  return `${base}${i}`;
}

export function jsonToTypeScript(
  json: string,
  rootName = "Root"
): { output: string; error: string | null } {
  let parsed: JsonValue;

  try {
    parsed = JSON.parse(json) as JsonValue;
  } catch (e) {
    return {
      output: "",
      error: `Invalid JSON: ${e instanceof Error ? e.message : String(e)}`,
    };
  }

  const interfaces = new Map<string, string>();
  const usedNames = new Set<string>([rootName]);

  if (typeof parsed !== "object" || parsed === null) {
    // Primitive at root
    const type = inferType(parsed, rootName, interfaces, usedNames);
    return {
      output: `type ${rootName} = ${type};`,
      error: null,
    };
  }

  // Generate root interface
  const lines: string[] = [`interface ${rootName} {`];

  if (Array.isArray(parsed)) {
    // Array at root
    const elementType = parsed.length > 0
      ? inferType(parsed[0], rootName + "Item", interfaces, usedNames)
      : "unknown";
    const output = [
      ...Array.from(interfaces.values()),
      `type ${rootName} = ${elementType}[];`,
    ].join("\n\n");
    return { output, error: null };
  }

  for (const [k, v] of Object.entries(parsed as Record<string, JsonValue>)) {
    const childType = inferType(v, capitalize(k), interfaces, usedNames);
    const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : `"${k}"`;
    lines.push(`  ${safeKey}: ${childType};`);
  }

  lines.push("}");
  interfaces.set(rootName, lines.join("\n"));

  // Build output: nested interfaces first (reverse insertion order puts root last)
  const ordered: string[] = [];
  interfaces.forEach((v, k) => {
    if (k !== rootName) ordered.push(v);
  });
  const rootDef = interfaces.get(rootName)!;
  ordered.push(rootDef);

  return {
    output: ordered.join("\n\n"),
    error: null,
  };
}
