export interface SlugOptions {
  separator: "-" | "_" | ".";
  lowercase: boolean;
  removeStopWords: boolean;
}

const STOP_WORDS = new Set(["a","an","the","and","or","but","in","on","at","to","for","of","with","by","from","is","are","was","were","be","been","being","have","has","had","do","does","did","will","would","shall","should","may","might","can","could","not","no"]);

export function generateSlug(input: string, opts: SlugOptions = { separator: "-", lowercase: true, removeStopWords: false }): string {
  if (!input.trim()) return "";
  let result = input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")  // remove diacritics
    .replace(/[^\w\s-]/g, " ")
    .trim();

  if (opts.removeStopWords) {
    result = result.split(/\s+/).filter(w => !STOP_WORDS.has(w.toLowerCase())).join(" ");
  }

  result = result
    .split(/\s+/)
    .filter(Boolean)
    .join(opts.separator);

  if (opts.lowercase) result = result.toLowerCase();

  result = result.replace(new RegExp(`[${opts.separator}]{2,}`, "g"), opts.separator);

  return result;
}

export function slugVariants(input: string): Record<string, string> {
  return {
    "kebab-case": generateSlug(input, { separator: "-", lowercase: true, removeStopWords: false }),
    "snake_case": generateSlug(input, { separator: "_", lowercase: true, removeStopWords: false }),
    "dot.case":   generateSlug(input, { separator: ".", lowercase: true, removeStopWords: false }),
    "SCREAMING":  generateSlug(input, { separator: "_", lowercase: false, removeStopWords: false }).toUpperCase(),
  };
}
