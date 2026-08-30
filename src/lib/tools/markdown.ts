import { marked } from "marked";

marked.setOptions({
  breaks: true,
  gfm: true,
});

function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, "")
    .replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"')
    .replace(/src\s*=\s*["']javascript:[^"']*["']/gi, 'src=""');
}

export function renderMarkdown(input: string): { html: string; error: string | null } {
  try {
    const result = marked(input);
    if (result instanceof Promise) {
      throw new Error("Unexpected async result from marked.");
    }
    return { html: sanitizeHtml(result), error: null };
  } catch (err) {
    return { html: "", error: err instanceof Error ? err.message : String(err) };
  }
}
