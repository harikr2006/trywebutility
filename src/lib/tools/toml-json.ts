import { parse, stringify } from "smol-toml";

export function tomlToJson(toml: string): { output: string; error: string | null } {
  try {
    if (!toml.trim()) return { output: "", error: null };
    const obj = parse(toml);
    return { output: JSON.stringify(obj, null, 2), error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "Parse failed" };
  }
}

export function jsonToToml(json: string): { output: string; error: string | null } {
  try {
    if (!json.trim()) return { output: "", error: null };
    const obj = JSON.parse(json);
    return { output: stringify(obj as Record<string, unknown>), error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "Conversion failed" };
  }
}
