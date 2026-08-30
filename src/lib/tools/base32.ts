const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const PADDING = "=";

export function base32Encode(input: string): { output: string; error: string | null } {
  try {
    if (!input) return { output: "", error: null };
    const bytes = new TextEncoder().encode(input);
    let bits = 0;
    let value = 0;
    let output = "";

    for (const byte of bytes) {
      value = (value << 8) | byte;
      bits += 8;
      while (bits >= 5) {
        output += ALPHABET[(value >>> (bits - 5)) & 31];
        bits -= 5;
      }
    }

    if (bits > 0) {
      output += ALPHABET[(value << (5 - bits)) & 31];
    }

    // Padding to multiple of 8
    while (output.length % 8 !== 0) output += PADDING;

    return { output, error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "Encode failed" };
  }
}

export function base32Decode(input: string): { output: string; error: string | null } {
  try {
    if (!input) return { output: "", error: null };
    const clean = input.toUpperCase().replace(/=+$/, "").replace(/\s/g, "");

    const bytes: number[] = [];
    let bits = 0;
    let value = 0;

    for (const char of clean) {
      const idx = ALPHABET.indexOf(char);
      if (idx === -1) return { output: "", error: `Invalid Base32 character: '${char}'` };
      value = (value << 5) | idx;
      bits += 5;
      if (bits >= 8) {
        bytes.push((value >>> (bits - 8)) & 255);
        bits -= 8;
      }
    }

    return { output: new TextDecoder().decode(new Uint8Array(bytes)), error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "Decode failed" };
  }
}
