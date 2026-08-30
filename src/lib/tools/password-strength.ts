export interface StrengthResult {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  entropy: number;
  crackTime: string;
  feedback: string[];
  hasUpper: boolean;
  hasLower: boolean;
  hasDigit: boolean;
  hasSymbol: boolean;
  length: number;
}

export function checkPasswordStrength(password: string): StrengthResult {
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const length = password.length;

  let poolSize = 0;
  if (hasLower) poolSize += 26;
  if (hasUpper) poolSize += 26;
  if (hasDigit) poolSize += 10;
  if (hasSymbol) poolSize += 32;
  if (poolSize === 0) poolSize = 26;

  const entropy = Math.log2(Math.pow(poolSize, Math.max(length, 1)));

  const feedback: string[] = [];
  if (length < 8) feedback.push("Use at least 8 characters");
  if (!hasUpper) feedback.push("Add uppercase letters");
  if (!hasLower) feedback.push("Add lowercase letters");
  if (!hasDigit) feedback.push("Add numbers");
  if (!hasSymbol) feedback.push("Add symbols (!, @, #…)");
  if (length < 12) feedback.push("Longer passwords are stronger");

  let score: 0 | 1 | 2 | 3 | 4 = 0;
  if (entropy >= 28) score = 1;
  if (entropy >= 36) score = 2;
  if (entropy >= 50) score = 3;
  if (entropy >= 64) score = 4;

  const labels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];

  // Crack time estimate at 1 billion guesses/second
  const combinations = Math.pow(poolSize, length);
  const seconds = combinations / 2 / 1e9;
  let crackTime: string;
  if (seconds < 1) crackTime = "Instantly";
  else if (seconds < 60) crackTime = `${Math.round(seconds)}s`;
  else if (seconds < 3600) crackTime = `${Math.round(seconds / 60)} minutes`;
  else if (seconds < 86400) crackTime = `${Math.round(seconds / 3600)} hours`;
  else if (seconds < 31536000) crackTime = `${Math.round(seconds / 86400)} days`;
  else if (seconds < 3153600000) crackTime = `${Math.round(seconds / 31536000)} years`;
  else crackTime = "Centuries+";

  return { score, label: labels[score], entropy: Math.round(entropy), crackTime, feedback, hasUpper, hasLower, hasDigit, hasSymbol, length };
}
