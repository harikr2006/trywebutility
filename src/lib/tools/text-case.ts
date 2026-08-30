// Split input into words, handling camelCase, PascalCase, snake_case, kebab-case, spaces, etc.
function splitWords(s: string): string[] {
  // Insert space before uppercase letters that follow lowercase letters or digits (camelCase/PascalCase)
  const expanded = s
    .replace(/([a-z\d])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2");

  return expanded
    .split(/[\s\-_\/\\\.]+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 0);
}

export function toCamelCase(s: string): string {
  const words = splitWords(s);
  if (words.length === 0) return "";
  return (
    words[0].toLowerCase() +
    words
      .slice(1)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join("")
  );
}

export function toPascalCase(s: string): string {
  return splitWords(s)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("");
}

export function toSnakeCase(s: string): string {
  return splitWords(s)
    .map((w) => w.toLowerCase())
    .join("_");
}

export function toKebabCase(s: string): string {
  return splitWords(s)
    .map((w) => w.toLowerCase())
    .join("-");
}

export function toConstantCase(s: string): string {
  return splitWords(s)
    .map((w) => w.toUpperCase())
    .join("_");
}

export function toTitleCase(s: string): string {
  return splitWords(s)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export function toLowerCase(s: string): string {
  return s.toLowerCase();
}

export function toUpperCase(s: string): string {
  return s.toUpperCase();
}
