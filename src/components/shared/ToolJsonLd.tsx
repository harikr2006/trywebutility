import { toolMetadataMap } from "@/lib/tool-metadata";
import { tools } from "@/lib/tools-registry";

interface Props {
  slug: string;
}

const categoryToSubcategory: Record<string, string> = {
  "Formatters & Validators": "FormatterApplication",
  "Encoders & Decoders":     "SecurityApplication",
  "Converters":              "UtilitiesApplication",
  "Generators":              "DesignApplication",
  "Testers & Analysis":      "DeveloperApplication",
};

export default function ToolJsonLd({ slug }: Props) {
  const seo = toolMetadataMap[slug];
  if (!seo) return null;

  const registryTool = tools.find((t) => t.path === `/${slug}`);
  const toolName = registryTool?.name ?? slug;
  const subcategory = registryTool
    ? (categoryToSubcategory[registryTool.category] ?? "DeveloperApplication")
    : "DeveloperApplication";

  const canonicalUrl = `https://trywebutility.com/${slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": canonicalUrl,
    name: toolName,
    description: seo.description,
    url: canonicalUrl,
    applicationCategory: "DeveloperApplication",
    applicationSubCategory: subcategory,
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. No installation needed.",
    isAccessibleForFree: true,
    featureList: registryTool?.tags ?? seo.keywords,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    provider: {
      "@type": "Organization",
      name: "WebUtility",
      url: "https://trywebutility.com",
    },
    audience: {
      "@type": "Audience",
      audienceType: "Developers, Engineers, Designers",
    },
    inLanguage: "en",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
