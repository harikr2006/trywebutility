import Papa from "papaparse";

export function csvToJson(input: string): { output: string; error: string | null } {
  try {
    const result = Papa.parse(input, { header: true, skipEmptyLines: true });
    if (result.errors && result.errors.length > 0) {
      return { output: "", error: result.errors[0].message };
    }
    const output = JSON.stringify(result.data, null, 2);
    return { output, error: null };
  } catch (err) {
    return { output: "", error: err instanceof Error ? err.message : String(err) };
  }
}

export function jsonToCsv(input: string): { output: string; error: string | null } {
  try {
    const parsed = JSON.parse(input);
    if (!Array.isArray(parsed)) {
      return { output: "", error: "Input must be a JSON array of objects." };
    }
    const output = Papa.unparse(parsed);
    return { output, error: null };
  } catch (err) {
    return { output: "", error: err instanceof Error ? err.message : String(err) };
  }
}
