const VOID_ELEMENTS = new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);

const ATTR_MAP: Record<string, string> = {
  class: "className", for: "htmlFor", tabindex: "tabIndex",
  readonly: "readOnly", maxlength: "maxLength", minlength: "minLength",
  colspan: "colSpan", rowspan: "rowSpan", crossorigin: "crossOrigin",
  accesskey: "accessKey", contenteditable: "contentEditable",
  enctype: "encType", "http-equiv": "httpEquiv", autofocus: "autoFocus",
  autocomplete: "autoComplete", novalidate: "noValidate", spellcheck: "spellCheck",
};

const EVENT_MAP: Record<string, string> = {
  onclick: "onClick", onchange: "onChange", onsubmit: "onSubmit",
  onkeydown: "onKeyDown", onkeyup: "onKeyUp", onkeypress: "onKeyPress",
  onmousedown: "onMouseDown", onmouseup: "onMouseUp", onmouseover: "onMouseOver",
  onmouseout: "onMouseOut", onfocus: "onFocus", onblur: "onBlur",
  oninput: "onInput", ondblclick: "onDoubleClick", onload: "onLoad",
};

function convertStyleAttr(styleVal: string): string {
  const pairs = styleVal.split(";").map(s => s.trim()).filter(Boolean);
  const entries = pairs.map(p => {
    const idx = p.indexOf(":");
    if (idx === -1) return null;
    const key = p.slice(0, idx).trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    const val = p.slice(idx + 1).trim();
    return `${key}: "${val}"`;
  }).filter((e): e is string => e !== null);
  return `{{ ${entries.join(", ")} }}`;
}

export function htmlToJsx(html: string): { output: string; error: string | null } {
  try {
    if (!html.trim()) return { output: "", error: null };
    let out = html;

    // HTML comments → JSX comments
    out = out.replace(/<!--([\s\S]*?)-->/g, (_, c) => `{/*${c}*/}`);

    // Process opening tags
    out = out.replace(/<([a-zA-Z][a-zA-Z0-9-]*)(\s[^>]*)?(\/?)>/g, (match, tag, attrsStr, selfClose) => {
      let attrs = attrsStr || "";

      // style attribute
      attrs = attrs.replace(/\bstyle="([^"]*)"/g, (_: string, v: string) => `style=${convertStyleAttr(v)}`);

      // Known attribute renames + events (case insensitive key match)
      attrs = attrs.replace(/\b([a-zA-Z-]+)(=)/g, (_m: string, attrName: string, eq: string) => {
        const lower = attrName.toLowerCase();
        return (ATTR_MAP[lower] || EVENT_MAP[lower] || attrName) + eq;
      });

      const isVoid = VOID_ELEMENTS.has(tag.toLowerCase());
      const closing = isVoid || selfClose === "/" ? " />" : ">";
      return `<${tag}${attrs}${closing}`;
    });

    // Self-close void elements that missed the above (no existing /)
    for (const el of VOID_ELEMENTS) {
      out = out.replace(new RegExp(`<(${el})(\\s[^>]*)?>`, "gi"), (_, t, a) => `<${t}${a || ""} />`);
    }

    return { output: out, error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "Conversion failed" };
  }
}
