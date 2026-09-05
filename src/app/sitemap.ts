import { MetadataRoute } from "next";
import { tools } from "@/lib/tools-registry";

export const dynamic = "force-static";

const BASE = "https://trywebutility.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const toolEntries: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${BASE}${tool.path}/`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: `${BASE}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...toolEntries,
  ];
}
