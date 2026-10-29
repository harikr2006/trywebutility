"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import { Star, ShieldCheck } from "lucide-react";
import { useFavorites, normalizePath } from "@/hooks/useFavorites";

const FAQBlock = dynamic(() => import("./FAQBlock"), {
  ssr: false,
  loading: () => null,
});

const HowToSection = dynamic(() => import("./HowToSection"), {
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
  const { favorites, toggle, mounted } = useFavorites();
  const isFav = mounted && favorites.has(normalizePath(pathname));

  return (
    <div className="flex flex-col gap-5 p-5 md:p-8 w-full">
      <header className="pb-4 border-b border-border/60">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight mb-1">{title}</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            <p className="mt-1.5 inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-3 h-3" aria-hidden="true" />
              Runs in your browser — no data leaves your device
            </p>
          </div>
          {mounted && (
            <button
              onClick={() => toggle(pathname)}
              aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
              title={isFav ? "Remove from favorites" : "Add to favorites"}
              className={`shrink-0 mt-0.5 rounded-lg p-1.5 transition-colors ${
                isFav
                  ? "text-amber-500 hover:text-amber-600"
                  : "text-muted-foreground/40 hover:text-amber-400"
              }`}
            >
              <Star
                className="h-5 w-5"
                fill={isFav ? "currentColor" : "none"}
                aria-hidden="true"
              />
            </button>
          )}
        </div>
      </header>
      <div>{children}</div>
      <HowToSection />
      <FAQBlock pathname={pathname} />
    </div>
  );
}
