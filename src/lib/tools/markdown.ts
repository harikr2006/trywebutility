import { marked } from "marked";

marked.setOptions({
  breaks: true,
  gfm: true,
});

export function renderMarkdown(input: string): { html: string; error: string | null } {
  try {
    const result = marked(input);
    if (result instanceof Promise) {
      throw new Error("Unexpected async result from marked.");
    }
    return { html: result, error: null };
  } catch (err) {
    return { html: "", error: err instanceof Error ? err.message : String(err) };
  }
}
