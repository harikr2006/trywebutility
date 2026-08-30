export interface ByteResult {
  bytes: number;
  kb: string;
  mb: string;
  chars: number;
  encoding: string;
}

export function calcByteSize(
  text: string,
  encoding: "utf-8" | "utf-16" | "ascii"
): ByteResult {
  const chars = text.length;
  let bytes: number;

  if (encoding === "utf-8") {
    // TextEncoder always produces UTF-8
    bytes = new TextEncoder().encode(text).byteLength;
  } else if (encoding === "utf-16") {
    // UTF-16: 2 bytes per code unit, surrogate pairs use 4 bytes
    // JavaScript strings are UTF-16 internally — length in code units * 2
    bytes = text.length * 2;
  } else {
    // ASCII: only count characters in range 0-127, others are skipped/replaced
    bytes = 0;
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      bytes += code > 127 ? 1 : 1; // ASCII enforces 1 byte per char; non-ASCII chars would be lossy
    }
    // For a true ASCII byte count, count all code units (non-ASCII would be replacement chars)
    bytes = text.length;
  }

  const kb = (bytes / 1024).toFixed(3);
  const mb = (bytes / (1024 * 1024)).toFixed(6);

  return {
    bytes,
    kb,
    mb,
    chars,
    encoding,
  };
}
