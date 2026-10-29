import { MetadataRoute } from "next";
import { tools } from "@/lib/tools-registry";
import { HTTP_STATUSES } from "@/lib/tools/http-status";

export const dynamic = "force-static";

const BASE = "https://trywebutility.com";
const LAST_UPDATED = new Date("2026-10-29");

export default function sitemap(): MetadataRoute.Sitemap {
  const toolEntries: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${BASE}${tool.path}/`,
    lastModified: LAST_UPDATED,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const statusCodeEntries: MetadataRoute.Sitemap = HTTP_STATUSES.map((s) => ({
    url: `${BASE}/http-status/${s.code}/`,
    lastModified: LAST_UPDATED,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [
    {
      url: `${BASE}/`,
      lastModified: LAST_UPDATED,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE}/alternatives/`,
      lastModified: LAST_UPDATED,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    // Category landing pages
    { url: `${BASE}/formatters/`, lastModified: LAST_UPDATED, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/encoders/`, lastModified: LAST_UPDATED, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/converters/`, lastModified: LAST_UPDATED, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/generators/`, lastModified: LAST_UPDATED, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/testers/`, lastModified: LAST_UPDATED, changeFrequency: "weekly", priority: 0.9 },
    // HTTP status reference
    { url: `${BASE}/http-status/`, lastModified: LAST_UPDATED, changeFrequency: "monthly", priority: 0.85 },
    ...statusCodeEntries,
    ...toolEntries,
  ];
}
