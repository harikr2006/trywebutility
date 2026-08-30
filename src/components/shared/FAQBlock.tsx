"use client";

import { faqData, globalFAQs } from "@/lib/faq-data";
import FAQSection from "./FAQSection";

export default function FAQBlock({ pathname }: { pathname: string }) {
  const toolFAQs = faqData[pathname] ?? [];
  const faqs = [...toolFAQs, ...globalFAQs];
  return <FAQSection faqs={faqs} />;
}
