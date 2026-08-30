import { load, dump } from "js-yaml";

export function validateYAML(input: string): { valid: boolean; formatted: string; error: string | null } {
  try {
    if (!input.trim()) return { valid: true, formatted: "", error: null };
    const parsed = load(input);
    const formatted = dump(parsed, { indent: 2, lineWidth: 120, noRefs: true });
    return { valid: true, formatted, error: null };
  } catch (e) {
    return { valid: false, formatted: "", error: e instanceof Error ? e.message : "Invalid YAML" };
  }
}
