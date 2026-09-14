import { toolMetadataMap } from "@/lib/tool-metadata";

interface Props {
  slug: string;
}

export default function ToolJsonLd({ slug }: Props) {
  const tool = toolMetadataMap[slug];
  if (!tool) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title.split(" — ")[0].trim(),
    description: tool.description,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    url: `https://trywebutility.com/${slug}`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    provider: {
      "@type": "Organization",
      name: "WebUtility",
      url: "https://trywebutility.com",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
