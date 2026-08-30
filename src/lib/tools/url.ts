export function encodeURL(input: string): { output: string; error: string | null } {
  try {
    return { output: encodeURIComponent(input), error: null };
  } catch (e) {
    return { output: "", error: (e as Error).message };
  }
}

export function decodeURL(input: string): { output: string; error: string | null } {
  try {
    return { output: decodeURIComponent(input), error: null };
  } catch {
    return { output: "", error: "Invalid URL-encoded string" };
  }
}
