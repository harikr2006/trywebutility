export function repeatText(
  text: string,
  count: number,
  separator: string,
  newlineAfterEach: boolean
): { output: string; error: string | null } {
  if (!text) return { output: "", error: null };
  if (count < 1 || count > 10000) return { output: "", error: "Count must be between 1 and 10,000" };
  const sep = newlineAfterEach ? "\n" : separator;
  return { output: Array(count).fill(text).join(sep), error: null };
}
