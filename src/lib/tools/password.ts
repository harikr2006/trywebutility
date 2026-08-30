export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;':\",./<>?";

export function generatePassword(options: PasswordOptions): string {
  const { length, uppercase, lowercase, numbers, symbols } = options;

  let charset = "";
  const required: string[] = [];

  if (uppercase) {
    charset += UPPERCASE;
    required.push(UPPERCASE[Math.floor(Math.random() * UPPERCASE.length)]);
  }
  if (lowercase) {
    charset += LOWERCASE;
    required.push(LOWERCASE[Math.floor(Math.random() * LOWERCASE.length)]);
  }
  if (numbers) {
    charset += NUMBERS;
    required.push(NUMBERS[Math.floor(Math.random() * NUMBERS.length)]);
  }
  if (symbols) {
    charset += SYMBOLS;
    required.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
  }

  if (!charset) {
    return "";
  }

  const safeLength = Math.max(length, required.length);
  const randomBytes = new Uint32Array(safeLength);
  crypto.getRandomValues(randomBytes);

  const chars: string[] = required.slice();
  for (let i = chars.length; i < safeLength; i++) {
    chars.push(charset[randomBytes[i] % charset.length]);
  }

  // Fisher-Yates shuffle using crypto random
  const shuffleBytes = new Uint32Array(chars.length);
  crypto.getRandomValues(shuffleBytes);
  for (let i = chars.length - 1; i > 0; i--) {
    const j = shuffleBytes[i] % (i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.slice(0, length).join("");
}

export function calcEntropy(password: string): number {
  if (!password) return 0;

  let charsetSize = 0;
  if (/[A-Z]/.test(password)) charsetSize += UPPERCASE.length;
  if (/[a-z]/.test(password)) charsetSize += LOWERCASE.length;
  if (/[0-9]/.test(password)) charsetSize += NUMBERS.length;
  if (/[^A-Za-z0-9]/.test(password)) charsetSize += SYMBOLS.length;

  if (charsetSize === 0) return 0;

  return Math.log2(Math.pow(charsetSize, password.length));
}

export function strengthLabel(
  entropy: number
): "Weak" | "Fair" | "Strong" | "Very Strong" {
  if (entropy < 40) return "Weak";
  if (entropy < 60) return "Fair";
  if (entropy < 80) return "Strong";
  return "Very Strong";
}
