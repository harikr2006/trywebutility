// TOTP per RFC 6238 using Web Crypto API
const BASE32_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function base32ToBytes(base32: string): Uint8Array {
  const clean = base32.toUpperCase().replace(/=+$/, "").replace(/\s/g, "");
  const bytes: number[] = [];
  let bits = 0, value = 0;
  for (const c of clean) {
    const idx = BASE32_CHARS.indexOf(c);
    if (idx === -1) throw new Error(`Invalid base32 character: ${c}`);
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) { bytes.push((value >>> (bits - 8)) & 0xff); bits -= 8; }
  }
  return new Uint8Array(bytes);
}

export async function generateTotp(secret: string, timeStep = 30, digits = 6): Promise<{ code: string; remaining: number; error: string | null }> {
  try {
    const keyBytes = base32ToBytes(secret);
    const counter = Math.floor(Date.now() / 1000 / timeStep);
    const remaining = timeStep - (Math.floor(Date.now() / 1000) % timeStep);

    // Counter as 8-byte big-endian
    const counterBuffer = new ArrayBuffer(8);
    const view = new DataView(counterBuffer);
    view.setUint32(4, counter & 0xffffffff, false);
    view.setUint32(0, Math.floor(counter / 0x100000000) & 0xffffffff, false);

    const key = await crypto.subtle.importKey(
      "raw", keyBytes.buffer as ArrayBuffer,
      { name: "HMAC", hash: "SHA-1" },
      false, ["sign"]
    );

    const sig = await crypto.subtle.sign("HMAC", key, counterBuffer);
    const hmac = new Uint8Array(sig);

    const offset = hmac[hmac.length - 1] & 0xf;
    const code = (
      ((hmac[offset] & 0x7f) << 24) |
      (hmac[offset + 1] << 16) |
      (hmac[offset + 2] << 8) |
      hmac[offset + 3]
    ) % Math.pow(10, digits);

    return { code: code.toString().padStart(digits, "0"), remaining, error: null };
  } catch (e) {
    return { code: "", remaining: 0, error: e instanceof Error ? e.message : "Generation failed" };
  }
}
