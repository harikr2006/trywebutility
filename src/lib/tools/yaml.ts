import * as jsYaml from "js-yaml";

export function jsonToYaml(input: string): { output: string; error: string | null } {
  try {
    const parsed = JSON.parse(input);
    const output = jsYaml.dump(parsed);
    return { output, error: null };
  } catch (err) {
    return { output: "", error: err instanceof Error ? err.message : String(err) };
  }
}

export function yamlToJson(input: string): { output: string; error: string | null } {
  try {
    const parsed = jsYaml.load(input);
    const output = JSON.stringify(parsed, null, 2);
    return { output, error: null };
  } catch (err) {
    return { output: "", error: err instanceof Error ? err.message : String(err) };
  }
}
