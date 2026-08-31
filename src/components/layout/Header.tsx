"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Braces, Search, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { tools } from "@/lib/tools-registry";
import ThemeToggle from "@/components/shared/ThemeToggle";

const TECH_TAGS = new Set([
  "html", "css", "sql", "javascript", "js", "json", "xml", "yaml", "python",
  "react", "jsx", "markdown", "base64", "toml", "svg", "regex", "typescript",
  "ts", "graphql", "http", "curl", "flexbox", "grid", "hmac", "totp", "jwt",
  "sha256", "sha1", "rsa", "base32", "diff", "env", "dotenv", "morse",
]);

function techTagsFor(tags?: string[]) {
  return (tags ?? []).filter((t) => TECH_TAGS.has(t.toLowerCase())).slice(0, 3);
}

export default function Header() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const results =
    query.trim().length > 0
      ? tools
          .filter((t) => {
            const q = query.toLowerCase();
            return (
              t.name.toLowerCase().includes(q) ||
              t.description.toLowerCase().includes(q) ||
              t.tags?.some((tag) => tag.toLowerCase().includes(q))
            );
          })
          .slice(0, 8)
      : [];

  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "/" && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = activeIndex >= 0 ? results[activeIndex] : results[0];
      if (target) {
        router.push(target.path);
        setQuery("");
        setOpen(false);
      }
    }
  }

  function clear() {
    setQuery("");
    setOpen(false);
    inputRef.current?.focus();
  }

  return (
    <header
      role="banner"
      className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
    >
      <div className="relative flex h-14 items-center px-4 md:px-5 gap-3">

        {/* Left — Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0 group"
          aria-label="WebUtility — go to homepage"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground shadow-sm group-hover:opacity-90 transition-opacity">
            <Braces className="h-4 w-4" aria-hidden="true" />
          </div>
          <span className="font-bold text-[15px] tracking-tight hidden sm:block select-none">
            WebUtility
          </span>
        </Link>

        {/* Center — Search */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-full max-w-sm md:max-w-md lg:max-w-lg px-2"
          role="search"
          ref={containerRef}
        >
          <label htmlFor="header-search" className="sr-only">Search tools</label>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              id="header-search"
              type="search"
              role="combobox"
              autoComplete="off"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
              onFocus={() => setOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search tools…"
              className="w-full h-9 rounded-lg border border-border/70 bg-muted/50 pl-9 pr-9 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 focus:bg-background transition-all"
              aria-autocomplete="list"
              aria-expanded={open && results.length > 0}
              aria-controls={open && results.length > 0 ? "search-dropdown" : undefined}
              aria-activedescendant={activeIndex >= 0 ? `search-item-${activeIndex}` : undefined}
              aria-haspopup="listbox"
            />
            {query.length === 0 && (
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center justify-center h-5 px-1.5 rounded border border-border/60 bg-muted text-[10px] text-muted-foreground font-mono select-none pointer-events-none">
                /
              </kbd>
            )}
            {query.length > 0 && (
              <button
                type="button"
                onClick={clear}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Dropdown */}
          {open && results.length > 0 && (
            <ul
              id="search-dropdown"
              role="listbox"
              aria-label="Search results"
              className="absolute top-full mt-1.5 left-2 right-2 rounded-xl border border-border/70 bg-popover shadow-lg py-1.5 z-50 overflow-hidden"
            >
              {results.map((tool, idx) => {
                const techTags = techTagsFor(tool.tags);
                const isActive = idx === activeIndex;
                return (
                  <li
                    key={tool.path}
                    id={`search-item-${idx}`}
                    role="option"
                    aria-selected={isActive}
                  >
                    <Link
                      href={tool.path}
                      onClick={() => { setQuery(""); setOpen(false); }}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`flex items-start gap-3 px-3.5 py-2.5 transition-colors ${
                        isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium leading-tight">{tool.name}</p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{tool.description}</p>
                        {techTags.length > 0 && (
                          <div className="flex gap-1 mt-1.5 flex-wrap">
                            {techTags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-block font-mono text-[10px] font-semibold uppercase tracking-wide bg-primary/10 text-primary rounded px-1.5 py-px"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="ml-auto shrink-0 text-[10px] font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5 mt-0.5 whitespace-nowrap">
                        {tool.category.split(" ")[0]}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Right — Theme toggle + Buy Me Coffee */}
        <div className="ml-auto flex items-center gap-2 shrink-0">
          <span className="hidden md:inline-flex items-center text-xs text-muted-foreground bg-muted/70 rounded-full px-2.5 py-1 select-none">
            {tools.length} tools
          </span>

          <ThemeToggle />

          {/* buy-me-coffee hidden */}
        </div>

      </div>
    </header>
  );
}
