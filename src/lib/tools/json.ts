export function formatJSON(input: string, indent = 2): { output: string; error: string | null } {
  try {
    const parsed = JSON.parse(input);
    return { output: JSON.stringify(parsed, null, indent), error: null };
  } catch (e) {
    return { output: "", error: (e as Error).message };
  }
}

export function minifyJSON(input: string): { output: string; error: string | null } {
  try {
    const parsed = JSON.parse(input);
    return { output: JSON.stringify(parsed), error: null };
  } catch (e) {
    return { output: "", error: (e as Error).message };
  }
}

export function validateJSON(input: string): { valid: boolean; error: string | null } {
  try {
    JSON.parse(input);
    return { valid: true, error: null };
  } catch (e) {
    return { valid: false, error: (e as Error).message };
  }
}
