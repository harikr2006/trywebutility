import { JSONPath } from "jsonpath-plus";

export interface JSONPathResult {
  results: unknown[];
  count: number;
  error: string | null;
}

export function testJSONPath(json: string, path: string): JSONPathResult {
  try {
    const parsed = JSON.parse(json) as object;
    const results = JSONPath({ path, json: parsed }) as unknown as unknown[];
    return { results, count: results.length, error: null };
  } catch (e) {
    return { results: [], count: 0, error: e instanceof Error ? e.message : "Error" };
  }
}
