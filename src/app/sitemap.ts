import { MetadataRoute } from "next";
import { tools } from "@/lib/tools-registry";

export const dynamic = "force-static";

const BASE = "https://trywebutility.com";
const LAST_UPDATED = new Date("2026-10-10");

export default function sitemap(): MetadataRoute.Sitemap {
  const toolEntries: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${BASE}${tool.path}/`,
    lastModified: LAST_UPDATED,
    changeFrequency: "weekly",
    priority: 0.8,
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
    ...toolEntries,
  ];
}
