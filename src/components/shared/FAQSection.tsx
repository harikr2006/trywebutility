"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FAQ {
  q: string;
  a: string;
}

export default function FAQSection({ faqs }: { faqs: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (faqs.length === 0) return null;

  return (
    <section aria-labelledby="faq-heading" className="mt-10 border-t pt-8">
      <h2
        id="faq-heading"
        className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground mb-4"
      >
        Frequently Asked Questions
      </h2>
      <dl className="space-y-2">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="rounded-xl border border-border/60 bg-card overflow-hidden"
            >
              <dt>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-4 py-3.5 text-sm font-medium text-left hover:bg-muted/40 transition-colors"
                  aria-expanded={isOpen}
                  aria-controls={`faq-body-${i}`}
                  id={`faq-btn-${i}`}
                >
                  <span className="text-foreground">{faq.q}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200",
                      isOpen && "rotate-180"
                    )}
                    aria-hidden="true"
                  />
                </button>
              </dt>
              <dd
                id={`faq-body-${i}`}
                role="region"
                aria-labelledby={`faq-btn-${i}`}
                className={cn(
                  "overflow-hidden transition-all duration-200",
                  isOpen ? "max-h-96" : "max-h-0"
                )}
              >
                <p className="px-4 pb-4 pt-0.5 text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
