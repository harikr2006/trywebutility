export function convertBase(
  value: string,
  fromBase: 2 | 8 | 10 | 16
): {
  binary: string;
  octal: string;
  decimal: string;
  hex: string;
  error: string | null;
} {
  const empty = { binary: "", octal: "", decimal: "", hex: "", error: null };

  if (!value || !value.trim()) {
    return { ...empty, error: "Empty input" };
  }

  const trimmed = value.trim().toLowerCase().replace(/^0x/, "");

  // Validate characters for the given base
  const validChars: Record<number, RegExp> = {
    2: /^[01]+$/,
    8: /^[0-7]+$/,
    10: /^[0-9]+$/,
    16: /^[0-9a-f]+$/,
  };

  if (!validChars[fromBase].test(trimmed)) {
    return {
      ...empty,
      error: `Invalid characters for base ${fromBase}: "${value}"`,
    };
  }

  // JavaScript's parseInt handles bases 2–36 natively
  const decimal = parseInt(trimmed, fromBase);

  if (!isFinite(decimal)) {
    return { ...empty, error: "Value is too large or invalid" };
  }

  return {
    binary: decimal.toString(2),
    octal: decimal.toString(8),
    decimal: decimal.toString(10),
    hex: decimal.toString(16).toUpperCase(),
    error: null,
  };
}
