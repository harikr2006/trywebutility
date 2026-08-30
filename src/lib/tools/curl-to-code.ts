export interface CurlParsed {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string | null;
}

export function parseCurl(curl: string): CurlParsed {
  // normalize line continuations
  const input = curl.replace(/\\\n\s*/g, " ").trim();
  if (!/^curl\b/.test(input)) throw new Error("Input must start with 'curl'");

  const opts: CurlParsed = { url: "", method: "GET", headers: {}, body: null };

  // tokenize respecting quotes
  const tokens: string[] = [];
  const re = /'([^']*)'|"((?:[^"\\]|\\.)*)"|(\S+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(input)) !== null) {
    tokens.push(m[1] ?? (m[2] !== undefined ? m[2].replace(/\\"/g, '"').replace(/\\\\/g, '\\') : m[3]));
  }

  for (let i = 1; i < tokens.length; i++) {
    const t = tokens[i];
    if (t === "-X" || t === "--request") opts.method = tokens[++i] || opts.method;
    else if (t === "-H" || t === "--header") {
      const h = tokens[++i] || "";
      const idx = h.indexOf(":");
      if (idx > -1) opts.headers[h.slice(0, idx).trim()] = h.slice(idx + 1).trim();
    }
    else if (t === "-d" || t === "--data" || t === "--data-raw" || t === "--data-binary" || t === "--data-urlencode") {
      opts.body = tokens[++i] || "";
      if (opts.method === "GET") opts.method = "POST";
    }
    else if (t === "--url") opts.url = tokens[++i] || opts.url;
    else if (t === "-u" || t === "--user") {
      const creds = tokens[++i] || "";
      opts.headers["Authorization"] = `Basic ${typeof btoa !== "undefined" ? btoa(creds) : Buffer.from(creds).toString("base64")}`;
    }
    else if (!t.startsWith("-") && !opts.url && /^https?:/.test(t)) opts.url = t;
    else if (!t.startsWith("-") && !opts.url && i === 1) opts.url = t;
  }

  // fallback URL extraction
  if (!opts.url) {
    const urlMatch = input.match(/https?:\/\/[^\s'"]+/);
    if (urlMatch) opts.url = urlMatch[0];
  }

  if (!opts.url) throw new Error("Could not find URL in cURL command");
  return opts;
}

function headersCode(headers: Record<string, string>, indent = "  ", quote = '"'): string {
  return Object.entries(headers)
    .map(([k, v]) => `${indent}${quote}${k}${quote}: ${quote}${v}${quote},`)
    .join("\n");
}

export function toFetch(curl: string): { output: string; error: string | null } {
  try {
    const o = parseCurl(curl);
    const hasHeaders = Object.keys(o.headers).length > 0;
    const isJson = o.headers["Content-Type"]?.toLowerCase().includes("json");
    const lines = [`const response = await fetch("${o.url}", {`];
    if (o.method !== "GET") lines.push(`  method: "${o.method}",`);
    if (hasHeaders) {
      lines.push(`  headers: {`);
      lines.push(headersCode(o.headers, "    "));
      lines.push(`  },`);
    }
    if (o.body) lines.push(`  body: ${isJson ? `JSON.stringify(${o.body})` : `"${o.body.replace(/"/g, '\\"')}"`},`);
    lines.push(`});`);
    lines.push(`const data = await response.json();`);
    return { output: lines.join("\n"), error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "Parse failed" };
  }
}

export function toPython(curl: string): { output: string; error: string | null } {
  try {
    const o = parseCurl(curl);
    const hasHeaders = Object.keys(o.headers).length > 0;
    const isJson = o.headers["Content-Type"]?.toLowerCase().includes("json");
    const lines = ["import requests", ""];
    if (hasHeaders) {
      lines.push("headers = {");
      lines.push(headersCode(o.headers, "    ", '"'));
      lines.push("}", "");
    }
    const method = o.method.toLowerCase();
    const args: string[] = [`"${o.url}"`];
    if (hasHeaders) args.push("headers=headers");
    if (o.body) args.push(isJson ? `json=${o.body}` : `data="${o.body.replace(/"/g, '\\"')}"`);
    lines.push(`response = requests.${method}(${args.join(", ")})`);
    lines.push("data = response.json()");
    return { output: lines.join("\n"), error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "Parse failed" };
  }
}

export function toAxios(curl: string): { output: string; error: string | null } {
  try {
    const o = parseCurl(curl);
    const hasHeaders = Object.keys(o.headers).length > 0;
    const isJson = o.headers["Content-Type"]?.toLowerCase().includes("json");
    const lines = ['import axios from "axios";', ""];
    const config: string[] = [];
    if (o.method !== "GET") config.push(`  method: "${o.method.toLowerCase()}",`);
    config.push(`  url: "${o.url}",`);
    if (hasHeaders) {
      config.push(`  headers: {`);
      config.push(headersCode(o.headers, "    "));
      config.push(`  },`);
    }
    if (o.body) config.push(`  data: ${isJson ? o.body : `"${o.body.replace(/"/g, '\\"')}"`},`);
    lines.push("const response = await axios({");
    lines.push(...config);
    lines.push("});");
    lines.push("const data = response.data;");
    return { output: lines.join("\n"), error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "Parse failed" };
  }
}

export function toGo(curl: string): { output: string; error: string | null } {
  try {
    const o = parseCurl(curl);
    const hasHeaders = Object.keys(o.headers).length > 0;
    const lines = ["package main", "", "import (", '\t"fmt"', '\t"net/http"', '\t"io"'];
    if (o.body) lines.splice(5, 0, '\t"strings"');
    lines.push(")", "");
    lines.push("func main() {");
    if (o.body) {
      lines.push(`\tbody := strings.NewReader(\`${o.body}\`)`);
      lines.push(`\treq, _ := http.NewRequest("${o.method}", "${o.url}", body)`);
    } else {
      lines.push(`\treq, _ := http.NewRequest("${o.method}", "${o.url}", nil)`);
    }
    if (hasHeaders) {
      for (const [k, v] of Object.entries(o.headers)) {
        lines.push(`\treq.Header.Set("${k}", "${v}")`);
      }
    }
    lines.push("\tclient := &http.Client{}");
    lines.push("\tresp, _ := client.Do(req)");
    lines.push("\tdefer resp.Body.Close()");
    lines.push("\tbody2, _ := io.ReadAll(resp.Body)");
    lines.push('\tfmt.Println(string(body2))');
    lines.push("}");
    return { output: lines.join("\n"), error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : "Parse failed" };
  }
}
