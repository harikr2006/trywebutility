"use client";
import Link from "next/link";
import { type ReactNode } from "react";
import { ArrowRight, LucideIcon,
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
  Send, Wifi, Server, MapPin, FileImage, Droplets, Scissors,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getToolsByCategory } from "@/lib/tools-registry";

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
  Send, Wifi, Server, MapPin, FileImage, Droplets, Scissors,
};

const TECH_KEYWORDS = new Set([
  "html", "css", "sql", "javascript", "js", "json", "xml", "yaml", "python",
  "react", "jsx", "markdown", "base64", "toml", "svg", "regex", "typescript",
  "ts", "http", "curl", "flexbox", "grid", "hmac", "totp", "jwt",
  "sha256", "sha1", "base32", "diff", "env", "morse",
]);

interface CategoryColors {
  color: string;
  bg: string;
  border: string;
  iconBg: string;
  pill: string;
  heroBg: string;
  heroBadge: string;
}

const categoryColors: Record<string, CategoryColors> = {
  "Formatters & Validators": {
    color:    "text-emerald-700 dark:text-emerald-400",
    bg:       "bg-emerald-50 dark:bg-emerald-950/40",
    border:   "border-emerald-200/60 dark:border-emerald-900/60",
    iconBg:   "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300",
    pill:     "bg-emerald-50 text-emerald-700 border border-emerald-200/70 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/50",
    heroBg:   "from-emerald-500/8 via-background to-emerald-500/4",
    heroBadge:"bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400",
  },
  "Encoders & Decoders": {
    color:    "text-blue-700 dark:text-blue-400",
    bg:       "bg-blue-50 dark:bg-blue-950/40",
    border:   "border-blue-200/60 dark:border-blue-900/60",
    iconBg:   "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300",
    pill:     "bg-blue-50 text-blue-700 border border-blue-200/70 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800/50",
    heroBg:   "from-blue-500/8 via-background to-blue-500/4",
    heroBadge:"bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400",
  },
  "Converters": {
    color:    "text-orange-700 dark:text-orange-400",
    bg:       "bg-orange-50 dark:bg-orange-950/40",
    border:   "border-orange-200/60 dark:border-orange-900/60",
    iconBg:   "bg-orange-100 text-orange-700 dark:bg-orange-900/60 dark:text-orange-300",
    pill:     "bg-orange-50 text-orange-700 border border-orange-200/70 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-800/50",
    heroBg:   "from-orange-500/8 via-background to-orange-500/4",
    heroBadge:"bg-orange-500/10 text-orange-700 border-orange-500/20 dark:text-orange-400",
  },
  "Generators": {
    color:    "text-pink-700 dark:text-pink-400",
    bg:       "bg-pink-50 dark:bg-pink-950/40",
    border:   "border-pink-200/60 dark:border-pink-900/60",
    iconBg:   "bg-pink-100 text-pink-700 dark:bg-pink-900/60 dark:text-pink-300",
    pill:     "bg-pink-50 text-pink-700 border border-pink-200/70 dark:bg-pink-950/50 dark:text-pink-300 dark:border-pink-800/50",
    heroBg:   "from-pink-500/8 via-background to-pink-500/4",
    heroBadge:"bg-pink-500/10 text-pink-700 border-pink-500/20 dark:text-pink-400",
  },
  "Testers & Analysis": {
    color:    "text-violet-700 dark:text-violet-400",
    bg:       "bg-violet-50 dark:bg-violet-950/40",
    border:   "border-violet-200/60 dark:border-violet-900/60",
    iconBg:   "bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-300",
    pill:     "bg-violet-50 text-violet-700 border border-violet-200/70 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-800/50",
    heroBg:   "from-violet-500/8 via-background to-violet-500/4",
    heroBadge:"bg-violet-500/10 text-violet-700 border-violet-500/20 dark:text-violet-400",
  },
};

interface Props {
  category: string;
  headline: string;
  subtext: string;
  children?: ReactNode;
}

export default function CategoryPage({ category, headline, subtext, children }: Props) {
  const catTools = getToolsByCategory(category);
  const colors = categoryColors[category] ?? categoryColors["Formatters & Validators"];

  return (
    <div className="min-h-full">
      {/* Hero */}
      <section
        aria-labelledby="cat-hero-heading"
        className={cn(
          "relative overflow-hidden border-b border-border/50 bg-gradient-to-br px-6 py-12 md:py-16",
          colors.heroBg
        )}
      >
        <div aria-hidden="true" className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full bg-current opacity-[0.04] blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-current opacity-[0.04] blur-3xl" />

        <div className="relative max-w-3xl">
          <div className={cn(
            "inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-semibold mb-5 select-none",
            colors.heroBadge
          )}>
            <span className="flex h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
            {category}
          </div>

          <h1
            id="cat-hero-heading"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4 leading-tight"
          >
            {headline}
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl mb-6 leading-relaxed">
            {subtext}
          </p>

          <div className="flex flex-wrap gap-5">
            {[
              { value: `${catTools.length}`, label: "tools" },
              { value: "Free", label: "always" },
              { value: "100%", label: "browser-based" },
              { value: "0", label: "data stored" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tool grid */}
      <div className="px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {catTools.map((tool) => {
            const Icon = iconMap[tool.icon] ?? Braces;
            const tags = tool.tags ?? [];
            const techTags = tags.filter((t) => TECH_KEYWORDS.has(t.toLowerCase())).slice(0, 3);
            const otherTags = tags.filter((t) => !TECH_KEYWORDS.has(t.toLowerCase())).slice(0, 2 - Math.max(0, techTags.length - 1));
            return (
              <Link
                key={tool.path}
                href={tool.path}
                className={cn(
                  "group relative flex flex-col gap-3 rounded-xl border bg-card p-4",
                  "hover:shadow-md hover:-translate-y-0.5 transition-all duration-150",
                  colors.border
                )}
              >
                <div className="flex items-start justify-between">
                  <div className={cn("flex items-center justify-center w-9 h-9 rounded-lg shrink-0", colors.iconBg)}>
                    <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  </div>
                  <ArrowRight
                    className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all mt-0.5"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm mb-0.5 text-foreground">{tool.name}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{tool.description}</p>
                </div>
                {(techTags.length > 0 || otherTags.length > 0) && (
                  <div className="flex gap-1 flex-wrap mt-auto">
                    {techTags.map((tag) => (
                      <span key={tag} className="font-mono text-[10px] font-bold uppercase tracking-wide bg-primary/10 text-primary rounded px-1.5 py-px">
                        {tag}
                      </span>
                    ))}
                    {otherTags.map((tag) => (
                      <span key={tag} className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-md", colors.pill)}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* SEO content — unique per category, passed as children */}
      {children && (
        <div className="px-6 pb-12 max-w-3xl">
          {children}
        </div>
      )}
    </div>
  );
}
