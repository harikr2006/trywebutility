"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { tools, categories } from "@/lib/tools-registry";
import {
  Braces, Code2, Binary, Link as LinkIcon, KeyRound, Regex,
  Database, Paintbrush, BookOpen, KeySquare, FileCode, Terminal,
  ArrowLeftRight, Table2, FileType, Palette, Hash, Clock,
  ShieldCheck, Fingerprint, Lock, AlignLeft, QrCode,
  CalendarClock, Columns2, FileText, CaseSensitive, HardDrive, Globe, Monitor,
  Layers, UserRound, ImageIcon, Cpu, Maximize2,
  Search, Network, Shield, Tag, ArrowUpDown, Replace, Percent, Table,
  FileJson2, CalendarDays, Ruler, Link2, TableProperties, Tags, Eye, Calculator,
  FileCheck2, Unlink, FileSpreadsheet, Wand2, Frame, PaintBucket, Share2,
  GitCompare, ShieldAlert, GraduationCap, Grid3x3,
  Bot, Spline, ListOrdered, Smile, Minimize2, FileSearch, Timer,
  Send, Wifi,
  ArrowRight, Star, LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/useFavorites";

const iconMap: Record<string, LucideIcon> = {
  Braces, Code2, Binary, Link: LinkIcon, KeyRound, Regex,
  Database, Paintbrush, BookOpen, KeySquare, FileCode, Terminal,
  ArrowLeftRight, Table2, FileType, Palette, Hash, Clock,
  ShieldCheck, Fingerprint, Lock, AlignLeft, QrCode,
  CalendarClock, Columns2, FileText, CaseSensitive, HardDrive, Globe, Monitor,
  Layers, UserRound, ImageIcon, Cpu, Maximize2,
  Search, Network, Shield, Tag, ArrowUpDown, Replace, Percent, Table,
  FileJson2, CalendarDays, Ruler, Link2, TableProperties, Tags, Eye, Calculator,
  FileCheck2, Unlink, FileSpreadsheet, Wand2, Frame, PaintBucket, Share2,
  GitCompare, ShieldAlert, GraduationCap, Grid3x3,
  Bot, Spline, ListOrdered, Smile, Minimize2, FileSearch, Timer,
  Send, Wifi,
};

const categoryMeta: Record<string, { color: string; bg: string; border: string; iconBg: string; pill: string }> = {
  "Formatters & Validators": {
    color:   "text-emerald-700 dark:text-emerald-400",
    bg:      "bg-emerald-50 dark:bg-emerald-950/40",
    border:  "border-emerald-200/60 dark:border-emerald-900/60",
    iconBg:  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300",
    pill:    "bg-emerald-50 text-emerald-700 border border-emerald-200/70 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/50",
  },
  "Encoders & Decoders": {
    color:   "text-blue-700 dark:text-blue-400",
    bg:      "bg-blue-50 dark:bg-blue-950/40",
    border:  "border-blue-200/60 dark:border-blue-900/60",
    iconBg:  "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300",
    pill:    "bg-blue-50 text-blue-700 border border-blue-200/70 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800/50",
  },
  "Converters": {
    color:   "text-orange-700 dark:text-orange-400",
    bg:      "bg-orange-50 dark:bg-orange-950/40",
    border:  "border-orange-200/60 dark:border-orange-900/60",
    iconBg:  "bg-orange-100 text-orange-700 dark:bg-orange-900/60 dark:text-orange-300",
    pill:    "bg-orange-50 text-orange-700 border border-orange-200/70 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800/50",
  },
  "Generators": {
    color:   "text-pink-700 dark:text-pink-400",
    bg:      "bg-pink-50 dark:bg-pink-950/40",
    border:  "border-pink-200/60 dark:border-pink-900/60",
    iconBg:  "bg-pink-100 text-pink-700 dark:bg-pink-900/60 dark:text-pink-300",
    pill:    "bg-pink-50 text-pink-700 border border-pink-200/70 dark:bg-pink-950/50 dark:text-pink-300 dark:border-pink-800/50",
  },
  "Testers & Analysis": {
    color:   "text-violet-700 dark:text-violet-400",
    bg:      "bg-violet-50 dark:bg-violet-950/40",
    border:  "border-violet-200/60 dark:border-violet-900/60",
    iconBg:  "bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-300",
    pill:    "bg-violet-50 text-violet-700 border border-violet-200/70 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-800/50",
  },
};

const ALL = "All";
const FAVORITES = "★ Favorites";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState(ALL);
  const { favorites, toggle, mounted } = useFavorites();

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return tools.filter((t) => {
      if (activeCat === FAVORITES) {
        if (!favorites.has(t.path)) return false;
      } else {
        const matchesCat = activeCat === ALL || t.category === activeCat;
        if (!matchesCat) return false;
      }
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags?.some((tag) => tag.includes(q))
      );
    });
  }, [query, activeCat, favorites]);

  const isSearching = query.trim().length > 0 || activeCat !== ALL;
  const showFavTab = mounted && favorites.size > 0;

  return (
    <div className="min-h-full">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        aria-labelledby="hero-heading"
        className="relative overflow-hidden border-b border-border/50 bg-gradient-to-br from-primary/5 via-background to-accent/10 px-6 py-12 md:py-16"
      >
        {/* decorative blobs — aria-hidden */}
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/8 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative max-w-3xl mx-auto text-center">
          {/* badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3.5 py-1 text-xs font-semibold text-primary mb-5 select-none">
            <span className="flex h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            Free · Privacy-First · No Sign-up Required
          </div>

          <h1
            id="hero-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4 leading-tight"
          >
            Developer &amp; Tech{" "}
            <span className="text-primary">Utilities</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
            {tools.length}+ free browser-based tools. JSON, regex, Base64, color,
            units, and more — all run locally, no data ever leaves your browser.
          </p>

          {/* Hero search */}
          <div className="relative max-w-lg mx-auto" role="search">
            <label htmlFor="hero-search" className="sr-only">Search tools</label>
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="hero-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${tools.length} tools…`}
              className="w-full h-12 rounded-xl border border-border/80 bg-background pl-11 pr-5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/60 transition-all"
            />
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
            {[
              { value: tools.length + "+", label: "Tools" },
              { value: categories.length.toString(), label: "Categories" },
              { value: "100%", label: "Free" },
              { value: "0", label: "Data stored" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category filter tabs ──────────────────────────────── */}
      <div className="sticky top-14 z-30 bg-background/95 backdrop-blur border-b border-border/50 px-6 py-3">
        <div
          role="tablist"
          aria-label="Filter by category"
          className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none"
        >
          {/* Favorites tab — only visible once the user has starred at least one tool */}
          {showFavTab && (
            <button
              role="tab"
              aria-selected={activeCat === FAVORITES}
              onClick={() => setActiveCat(FAVORITES)}
              className={cn(
                "shrink-0 inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap",
                activeCat === FAVORITES
                  ? "bg-amber-400 text-amber-950 shadow-sm"
                  : "bg-amber-50 text-amber-700 border border-amber-200/70 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/50 dark:hover:bg-amber-950/50"
              )}
            >
              <Star className="h-3 w-3" fill="currentColor" aria-hidden="true" />
              Favorites
              <span className={cn(
                "inline-flex items-center justify-center rounded-full text-[10px] font-bold px-1.5 py-0.5 min-w-[18px]",
                activeCat === FAVORITES ? "bg-amber-950/20 text-amber-950" : "bg-amber-200/60 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
              )}>
                {favorites.size}
              </span>
            </button>
          )}
          {[ALL, ...categories].map((cat) => {
            const count = cat === ALL ? tools.length : tools.filter((t) => t.category === cat).length;
            const isActive = activeCat === cat;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCat(cat)}
                className={cn(
                  "shrink-0 inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all whitespace-nowrap",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {cat}
                <span className={cn(
                  "inline-flex items-center justify-center rounded-full text-[10px] font-bold px-1.5 py-0.5 min-w-[18px]",
                  isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-border/70 text-muted-foreground"
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tool grid ─────────────────────────────────────────── */}
      <div className="px-6 py-8">
        {isSearching ? (
          /* Flat filtered results (search / category / favorites) */
          <>
            {activeCat !== FAVORITES && (
              <p className="text-sm text-muted-foreground mb-5">
                {filtered.length === 0
                  ? "No tools matched your search."
                  : `${filtered.length} tool${filtered.length !== 1 ? "s" : ""} found`}
              </p>
            )}
            {activeCat === FAVORITES && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
                <Star className="h-10 w-10 text-amber-300" fill="currentColor" aria-hidden="true" />
                <p className="text-sm font-medium text-muted-foreground">
                  {query.trim() ? "No favorites match your search." : "Star tools to add them here."}
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filtered.map((tool) => {
                const meta = categoryMeta[tool.category];
                const Icon = iconMap[tool.icon] ?? Braces;
                return (
                  <ToolCard
                    key={tool.path}
                    tool={tool}
                    meta={meta}
                    Icon={Icon}
                    isFavorited={mounted && favorites.has(tool.path)}
                    onToggleFav={(e) => { e.preventDefault(); toggle(tool.path); }}
                  />
                );
              })}
            </div>
          </>
        ) : (
          /* Grouped by category */
          categories.map((cat) => {
            const catTools = tools.filter((t) => t.category === cat);
            const meta = categoryMeta[cat];
            return (
              <section key={cat} className="mb-10" aria-labelledby={`cat-${cat}`}>
                <div className="flex items-center gap-2 mb-4">
                  <h2
                    id={`cat-${cat}`}
                    className={cn("text-xs font-bold uppercase tracking-widest", meta.color)}
                  >
                    {cat}
                  </h2>
                  <span className="text-xs text-muted-foreground">({catTools.length})</span>
                  <div className="flex-1 h-px bg-border/60" aria-hidden="true" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {catTools.map((tool) => {
                    const Icon = iconMap[tool.icon] ?? Braces;
                    return (
                      <ToolCard
                        key={tool.path}
                        tool={tool}
                        meta={meta}
                        Icon={Icon}
                        isFavorited={mounted && favorites.has(tool.path)}
                        onToggleFav={(e) => { e.preventDefault(); toggle(tool.path); }}
                      />
                    );
                  })}
                </div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}

const TECH_KEYWORDS = new Set([
  "html", "css", "sql", "javascript", "js", "json", "xml", "yaml", "python",
  "react", "jsx", "markdown", "base64", "toml", "svg", "regex", "typescript",
  "ts", "http", "curl", "flexbox", "grid", "hmac", "totp", "jwt",
  "sha256", "sha1", "base32", "diff", "env", "morse", "graphql",
]);

/* ── Tool card ─────────────────────────────────────────────── */
function ToolCard({
  tool,
  meta,
  Icon,
  isFavorited = false,
  onToggleFav,
}: {
  tool: (typeof tools)[0];
  meta: (typeof categoryMeta)[string];
  Icon: LucideIcon;
  isFavorited?: boolean;
  onToggleFav?: (e: React.MouseEvent) => void;
}) {
  const tags = tool.tags ?? [];
  const techTags = tags.filter((t) => TECH_KEYWORDS.has(t.toLowerCase())).slice(0, 3);
  const otherTags = tags.filter((t) => !TECH_KEYWORDS.has(t.toLowerCase())).slice(0, 2 - Math.max(0, techTags.length - 1));

  return (
    <Link
      href={tool.path}
      className={cn(
        "group relative flex flex-col gap-3 rounded-xl border bg-card p-4",
        "hover:shadow-md hover:-translate-y-0.5 transition-all duration-150",
        meta.border
      )}
    >
      <div className="flex items-start justify-between">
        <div className={cn("flex items-center justify-center w-9 h-9 rounded-lg shrink-0", meta.iconBg)}>
          <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
        </div>
        <div className="flex items-center gap-1">
          {onToggleFav && (
            <button
              onClick={onToggleFav}
              aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
              className={cn(
                "rounded p-0.5 transition-colors opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
                isFavorited
                  ? "opacity-100 text-amber-500 hover:text-amber-600"
                  : "text-muted-foreground/40 hover:text-amber-400"
              )}
            >
              <Star
                className="h-3.5 w-3.5"
                fill={isFavorited ? "currentColor" : "none"}
                aria-hidden="true"
              />
            </button>
          )}
          <ArrowRight
            className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all mt-0.5"
            aria-hidden="true"
          />
        </div>
      </div>
      <div>
        <p className="font-semibold text-sm mb-0.5 text-foreground">{tool.name}</p>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {tool.description}
        </p>
      </div>
      {(techTags.length > 0 || otherTags.length > 0) && (
        <div className="flex gap-1 flex-wrap mt-auto" aria-label="Tags">
          {techTags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] font-bold uppercase tracking-wide bg-primary/10 text-primary rounded px-1.5 py-px"
            >
              {tag}
            </span>
          ))}
          {otherTags.map((tag) => (
            <span
              key={tag}
              className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-md", meta.pill)}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
