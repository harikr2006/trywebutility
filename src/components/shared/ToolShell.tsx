"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

/* faq-data.ts (20 KB) is loaded only after the page is interactive.
   Keeping it out of the synchronous import chain eliminates navigation latency. */
const FAQBlock = dynamic(() => import("./FAQBlock"), {
  ssr: false,
  loading: () => null,
});

interface ToolShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function ToolShell({ title, description, children }: ToolShellProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-5 p-5 md:p-8 w-full">
      <header className="pb-4 border-b border-border/60">
        <h1 className="text-xl font-bold tracking-tight mb-1">{title}</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </header>
      <div>{children}</div>
      <FAQBlock pathname={pathname} />
    </div>
  );
}
