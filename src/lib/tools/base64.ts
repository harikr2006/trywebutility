export function encodeBase64(input: string): { output: string; error: string | null } {
  try {
    return { output: btoa(unescape(encodeURIComponent(input))), error: null };
  } catch (e) {
    return { output: "", error: (e as Error).message };
  }
}

export function decodeBase64(input: string): { output: string; error: string | null } {
  try {
    return { output: decodeURIComponent(escape(atob(input.trim()))), error: null };
  } catch {
    return { output: "", error: "Invalid Base64 string" };
  }
}
