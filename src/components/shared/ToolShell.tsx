"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import { Star } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";

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
  const { favorites, toggle, mounted } = useFavorites();
  const isFav = mounted && favorites.has(pathname);

  return (
    <div className="flex flex-col gap-5 p-5 md:p-8 w-full">
      <header className="pb-4 border-b border-border/60">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight mb-1">{title}</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
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
      <FAQBlock pathname={pathname} />
    </div>
  );
}
