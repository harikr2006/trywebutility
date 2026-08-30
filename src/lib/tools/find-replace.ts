export interface FindReplaceResult {
  output: string;
  count: number;
  error: string | null;
}

export function findReplace(
  input: string,
  find: string,
  replace: string,
  useRegex: boolean,
  caseSensitive: boolean
): FindReplaceResult {
  if (!find) return { output: input, count: 0, error: null };
  try {
    let count = 0;
    let output: string;
    if (useRegex) {
      const flags = caseSensitive ? "g" : "gi";
      const allMatches = input.match(new RegExp(find, flags));
      count = allMatches ? allMatches.length : 0;
      output = input.replace(new RegExp(find, flags), replace);
    } else {
      const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const flags = caseSensitive ? "g" : "gi";
      const re = new RegExp(escaped, flags);
      output = input.replace(re, () => { count++; return replace; });
    }
    return { output, count, error: null };
  } catch (e) {
    return { output: input, count: 0, error: e instanceof Error ? e.message : "Invalid pattern" };
  }
}
