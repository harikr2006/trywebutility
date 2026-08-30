import TurndownService from "turndown";

let _td: InstanceType<typeof TurndownService> | null = null;

function getTd() {
  if (!_td) {
    _td = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced", bulletListMarker: "-" });
  }
  return _td;
}

export function htmlToMarkdown(html: string): { output: string; error: string | null } {
  try {
    if (!html.trim()) return { output: "", error: null };
    return { output: getTd().turndown(html), error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "Conversion failed" };
  }
}
