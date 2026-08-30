export interface ParsedURL {
  href: string;
  protocol: string;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  origin: string;
  params: { key: string; value: string }[];
  error: string | null;
}

export function parseURL(input: string): ParsedURL {
  try {
    const raw = input.trim();
    const url = new URL(raw.startsWith("http") ? raw : "https://" + raw);
    const params: { key: string; value: string }[] = [];
    url.searchParams.forEach((value, key) => params.push({ key, value }));
    return {
      href: url.href,
      protocol: url.protocol.replace(":", ""),
      host: url.host,
      hostname: url.hostname,
      port: url.port || (url.protocol === "https:" ? "443" : "80"),
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
      origin: url.origin,
      params,
      error: null,
    };
  } catch (e) {
    return { href: "", protocol: "", host: "", hostname: "", port: "", pathname: "", search: "", hash: "", origin: "", params: [], error: "Invalid URL" };
  }
}
