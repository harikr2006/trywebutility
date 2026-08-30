export interface UTMParams {
  url: string;
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
}

export function buildUTMUrl(params: UTMParams): { url: string; error: string | null } {
  try {
    if (!params.url.trim()) return { url: "", error: null };
    const base = params.url.trim().startsWith("http") ? params.url.trim() : "https://" + params.url.trim();
    const url = new URL(base);
    if (params.source.trim()) url.searchParams.set("utm_source", params.source.trim());
    if (params.medium.trim()) url.searchParams.set("utm_medium", params.medium.trim());
    if (params.campaign.trim()) url.searchParams.set("utm_campaign", params.campaign.trim());
    if (params.term.trim()) url.searchParams.set("utm_term", params.term.trim());
    if (params.content.trim()) url.searchParams.set("utm_content", params.content.trim());
    return { url: url.toString(), error: null };
  } catch (e) {
    return { url: "", error: "Invalid URL" };
  }
}

export const UTM_PRESETS = {
  mediums: ["cpc", "email", "social", "organic", "referral", "display", "affiliate", "video"],
  sources: ["google", "facebook", "twitter", "linkedin", "newsletter", "instagram", "youtube", "bing"],
};
