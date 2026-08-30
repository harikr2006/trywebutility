"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { tools, categories } from "@/lib/tools-registry";
import { cn } from "@/lib/utils";
import {
  Home,
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
  LucideIcon,
} from "lucide-react";

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
};

const categoryColors: Record<string, string> = {
  "Formatters & Validators": "text-emerald-600 dark:text-emerald-400",
  "Encoders & Decoders": "text-blue-600 dark:text-blue-400",
  "Converters": "text-orange-600 dark:text-orange-400",
  "Generators": "text-pink-600 dark:text-pink-400",
  "Testers & Analysis": "text-violet-600 dark:text-violet-400",
};

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 hidden md:flex flex-col border-r bg-sidebar sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
      <nav className="flex flex-col gap-5 px-3 py-5">
        {/* Home */}
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-semibold transition-all",
            pathname === "/"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-foreground/70 hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <Home className="h-[15px] w-[15px] shrink-0" aria-hidden="true" />
          Home
        </Link>

        {categories.map((cat) => {
          const catTools = tools.filter((t) => t.category === cat);
          return (
            <div key={cat}>
              <p className={cn(
                "px-2 text-[10px] font-bold uppercase tracking-widest mb-1.5",
                categoryColors[cat] ?? "text-muted-foreground"
              )}>
                {cat}
              </p>
              <ul className="space-y-0.5">
                {catTools.map((tool) => {
                  const Icon = iconMap[tool.icon] ?? Braces;
                  const active = pathname === tool.path;
                  return (
                    <li key={tool.path}>
                      <Link
                        href={tool.path}
                        className={cn(
                          "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium transition-all",
                          active
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-foreground/70 hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <Icon className={cn("h-[15px] w-[15px] shrink-0", active ? "opacity-100" : "opacity-60")} />
                        {tool.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
