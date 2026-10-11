"use client";

import { faqData, globalFAQs } from "@/lib/faq-data";
import FAQSection from "./FAQSection";
import { normalizePath } from "@/hooks/useFavorites";

export default function FAQBlock({ pathname }: { pathname: string }) {
  const toolFAQs = faqData[normalizePath(pathname)] ?? [];
  const faqs = [...toolFAQs, ...globalFAQs];
  return <FAQSection faqs={faqs} />;
}
