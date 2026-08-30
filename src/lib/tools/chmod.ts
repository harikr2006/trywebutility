export interface ChmodResult {
  numeric: string;
  symbolic: string;
  owner: { read: boolean; write: boolean; execute: boolean };
  group: { read: boolean; write: boolean; execute: boolean };
  others: { read: boolean; write: boolean; execute: boolean };
}

export function octalToChmod(octal: string): ChmodResult | null {
  const num = parseInt(octal, 8);
  if (isNaN(num) || num < 0 || num > 777) return null;
  const parse = (n: number) => ({
    read: !!(n & 4), write: !!(n & 2), execute: !!(n & 1),
  });
  const digits = octal.padStart(3, "0").split("").map(Number);
  const owner = parse(digits[0]);
  const group = parse(digits[1]);
  const others = parse(digits[2]);
  const toSymbol = (p: { read: boolean; write: boolean; execute: boolean }) =>
    (p.read ? "r" : "-") + (p.write ? "w" : "-") + (p.execute ? "x" : "-");
  return {
    numeric: octal.padStart(3, "0"),
    symbolic: toSymbol(owner) + toSymbol(group) + toSymbol(others),
    owner, group, others,
  };
}

export function bitsToChmod(owner: number, group: number, others: number): ChmodResult {
  const octal = `${owner}${group}${others}`;
  return octalToChmod(octal) ?? octalToChmod("000")!;
}
