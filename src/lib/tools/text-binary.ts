export function textToBinary(text: string): { output: string; error: string | null } {
  try {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(text);
    const output = Array.from(bytes).map(b => b.toString(2).padStart(8, "0")).join(" ");
    return { output, error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "Conversion error" };
  }
}

export function binaryToText(binary: string): { output: string; error: string | null } {
  try {
    const trimmed = binary.trim();
    if (!trimmed) return { output: "", error: null };
    const groups = trimmed.split(/\s+/);
    if (groups.some(g => !/^[01]{8}$/.test(g))) {
      return { output: "", error: "Each group must be exactly 8 bits (0s and 1s)" };
    }
    const bytes = new Uint8Array(groups.map(g => parseInt(g, 2)));
    const output = new TextDecoder().decode(bytes);
    return { output, error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "Conversion error" };
  }
}
