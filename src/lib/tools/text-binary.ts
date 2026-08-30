export function textToBinary(text: string): { output: string; error: string | null } {
  try {
    const output = text
      .split("")
      .map(c => c.charCodeAt(0).toString(2).padStart(8, "0"))
      .join(" ");
    return { output, error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "Conversion error" };
  }
}

export function binaryToText(binary: string): { output: string; error: string | null } {
  try {
    const groups = binary.trim().split(/\s+/);
    if (groups.some(g => !/^[01]{8}$/.test(g))) {
      return { output: "", error: "Each group must be exactly 8 bits (0s and 1s)" };
    }
    const output = groups.map(g => String.fromCharCode(parseInt(g, 2))).join("");
    return { output, error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "Conversion error" };
  }
}
