"use client";

import Link from "next/link";
import { Braces, Search, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { tools } from "@/lib/tools-registry";
import ThemeToggle from "@/components/shared/ThemeToggle";

export default function Header() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const results =
    query.trim().length > 0
      ? tools
          .filter(
            (t) =>
              t.name.toLowerCase().includes(query.toLowerCase()) ||
              t.description.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 7)
      : [];

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

        {/* Center — Search (absolute so it's truly centred in the header bar) */}
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
              autoComplete="off"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
              onFocus={() => setOpen(true)}
              placeholder="Search tools…"
              className="w-full h-9 rounded-lg border border-border/70 bg-muted/50 pl-9 pr-9 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 focus:bg-background transition-all"
              aria-autocomplete="list"
              aria-expanded={open && results.length > 0}
              aria-owns={open && results.length > 0 ? "search-dropdown" : undefined}
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
              {results.map((tool) => (
                <li key={tool.path} role="option" aria-selected="false">
                  <Link
                    href={tool.path}
                    onClick={() => { setQuery(""); setOpen(false); }}
                    className="flex items-start gap-3 px-3.5 py-2.5 hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-tight">{tool.name}</p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{tool.description}</p>
                    </div>
                    <span className="ml-auto shrink-0 text-[10px] font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5 mt-0.5 whitespace-nowrap">
                      {tool.category.split(" ")[0]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right — Theme toggle + Buy Me Coffee */}
        <div className="ml-auto flex items-center gap-2 shrink-0">
          <span className="hidden md:inline-flex items-center text-xs text-muted-foreground bg-muted/70 rounded-full px-2.5 py-1 select-none">
            {tools.length} tools
          </span>

          <ThemeToggle />

          <a
            href="https://buymeacoffee.com/harikr2006"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Buy me a coffee (opens in new tab)"
            className="hidden sm:inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold text-amber-900 bg-amber-400 hover:bg-amber-300 transition-colors shadow-sm select-none"
          >
            <span aria-hidden="true">☕</span>
            <span className="hidden lg:inline">Buy me a coffee</span>
          </a>
        </div>

      </div>
    </header>
  );
}
