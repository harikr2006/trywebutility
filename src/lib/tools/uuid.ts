export function generateUUID(): string {
  return crypto.randomUUID();
}

export function generateUUIDv7(): string {
  // UUIDv7: 48-bit ms timestamp | version (7) | 12-bit random | variant | 62-bit random
  const now = Date.now();

  // 48-bit timestamp (ms)
  const tsHigh = Math.floor(now / 0x100000000);
  const tsLow = now >>> 0;

  // 12 random bits for sub-ms
  const rand12 = (crypto.getRandomValues(new Uint16Array(1))[0] & 0x0fff);

  // 62 random bits (split across two 32-bit groups)
  const randArr = new Uint32Array(2);
  crypto.getRandomValues(randArr);
  const randA = randArr[0];
  const randB = randArr[1];

  // Build the 128-bit UUID as hex fields
  // time_high (32 bits): upper 32 bits of 48-bit ts
  const f1 = tsHigh.toString(16).padStart(8, "0").slice(-8);

  // time_mid (16 bits): lower 16 bits of ts_high_32...
  // Actually: bytes 0-3 = top 32 of 48-bit ts, bytes 4-5 = bottom 16 of 48-bit ts
  const tsLow16 = (tsLow >>> 16) & 0xffff;
  const f2 = tsLow16.toString(16).padStart(4, "0");

  // version (4 bits = 7) + 12 random bits
  const f3 = (0x7000 | rand12).toString(16).padStart(4, "0");

  // variant (2 bits = 10) + 62 random bits
  const variantBits = (0x8000 | (randA & 0x3fff)).toString(16).padStart(4, "0");
  const f4 = variantBits;
  const f5 = (randA >>> 16).toString(16).padStart(4, "0") + (randB >>> 0).toString(16).padStart(8, "0");

  return `${f1}-${f2}-${f3}-${f4}-${f5}`;
}

export function generateBulk(count: number, version: 4 | 7): string[] {
  const result: string[] = [];
  const n = Math.max(1, Math.min(count, 10000));
  for (let i = 0; i < n; i++) {
    result.push(version === 7 ? generateUUIDv7() : generateUUID());
  }
  return result;
}
