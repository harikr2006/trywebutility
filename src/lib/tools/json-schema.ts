type JSONValue = string | number | boolean | null | JSONValue[] | { [k: string]: JSONValue };

export function generateJSONSchema(input: string): { output: string; error: string | null } {
  try {
    const parsed = JSON.parse(input) as JSONValue;
    const schema = buildSchema(parsed);
    return { output: JSON.stringify(schema, null, 2), error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "Invalid JSON" };
  }
}

function buildSchema(value: JSONValue): object {
  if (value === null) return { type: "null" };
  if (typeof value === "boolean") return { type: "boolean" };
  if (typeof value === "number") {
    return Number.isInteger(value) ? { type: "integer" } : { type: "number" };
  }
  if (typeof value === "string") return { type: "string" };
  if (Array.isArray(value)) {
    if (value.length === 0) return { type: "array", items: {} };
    return { type: "array", items: buildSchema(value[0]) };
  }
  const props: Record<string, object> = {};
  const required: string[] = [];
  for (const [k, v] of Object.entries(value as Record<string, JSONValue>)) {
    props[k] = buildSchema(v);
    required.push(k);
  }
  return { type: "object", properties: props, required };
}
