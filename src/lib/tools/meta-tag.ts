export interface MetaTagInput {
  title: string;
  description: string;
  url: string;
  image: string;
  siteName: string;
  twitterHandle: string;
  robots: string;
  canonical: string;
}

export function generateMetaTags(input: MetaTagInput): string {
  const lines: string[] = [];
  const e = (s: string) => s.replace(/"/g, "&quot;");

  if (input.title) {
    lines.push(`<title>${e(input.title)}</title>`);
    lines.push(`<meta name="title" content="${e(input.title)}">`);
  }
  if (input.description) lines.push(`<meta name="description" content="${e(input.description)}">`);
  if (input.robots) lines.push(`<meta name="robots" content="${e(input.robots)}">`);
  if (input.canonical) lines.push(`<link rel="canonical" href="${e(input.canonical)}">`);

  lines.push("");
  lines.push("<!-- Open Graph / Facebook -->");
  lines.push(`<meta property="og:type" content="website">`);
  if (input.url) lines.push(`<meta property="og:url" content="${e(input.url)}">`);
  if (input.title) lines.push(`<meta property="og:title" content="${e(input.title)}">`);
  if (input.description) lines.push(`<meta property="og:description" content="${e(input.description)}">`);
  if (input.image) lines.push(`<meta property="og:image" content="${e(input.image)}">`);
  if (input.siteName) lines.push(`<meta property="og:site_name" content="${e(input.siteName)}">`);

  lines.push("");
  lines.push("<!-- Twitter -->");
  lines.push(`<meta property="twitter:card" content="summary_large_image">`);
  if (input.url) lines.push(`<meta property="twitter:url" content="${e(input.url)}">`);
  if (input.title) lines.push(`<meta property="twitter:title" content="${e(input.title)}">`);
  if (input.description) lines.push(`<meta property="twitter:description" content="${e(input.description)}">`);
  if (input.image) lines.push(`<meta property="twitter:image" content="${e(input.image)}">`);
  if (input.twitterHandle) lines.push(`<meta name="twitter:site" content="${e(input.twitterHandle)}">`);

  return lines.join("\n");
}
