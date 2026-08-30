"use client";
import { useState, useMemo } from "react";
import ToolShell from "@/components/shared/ToolShell";
import { cn } from "@/lib/utils";
import { HTTP_STATUSES, type HttpStatus } from "@/lib/tools/http-status";

type CategoryFilter = "all" | "1xx" | "2xx" | "3xx" | "4xx" | "5xx";

const CATEGORIES: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "1xx", label: "1xx" },
  { value: "2xx", label: "2xx" },
  { value: "3xx", label: "3xx" },
  { value: "4xx", label: "4xx" },
  { value: "5xx", label: "5xx" },
];

function getBadgeClass(code: number): string {
  if (code < 200) return "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300";
  if (code < 300) return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300";
  if (code < 400) return "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300";
  if (code < 500) return "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300";
  return "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300";
}

export default function HttpStatusPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return HTTP_STATUSES.filter((s: HttpStatus) => {
      const matchesSearch =
        !q ||
        s.code.toString().includes(q) ||
        s.text.toLowerCase().includes(q) ||
        (s.description?.toLowerCase().includes(q) ?? false);

      const matchesCategory =
        categoryFilter === "all" ||
        (categoryFilter === "1xx" && s.code >= 100 && s.code < 200) ||
        (categoryFilter === "2xx" && s.code >= 200 && s.code < 300) ||
        (categoryFilter === "3xx" && s.code >= 300 && s.code < 400) ||
        (categoryFilter === "4xx" && s.code >= 400 && s.code < 500) ||
        (categoryFilter === "5xx" && s.code >= 500 && s.code < 600);

      return matchesSearch && matchesCategory;
    });
  }, [search, categoryFilter]);

  return (
    <ToolShell title="HTTP Status Codes" description="Browse, search, and filter all HTTP status codes with descriptions.">
      <div className="space-y-4">
        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by code or description..."
          className="w-full h-9 rounded-lg border border-border/60 bg-muted/30 px-3 text-sm focus:ring-2 focus:ring-primary/30 focus:outline-none"
        />

        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategoryFilter(cat.value)}
              className={cn(
                "h-8 px-3 rounded-md text-sm font-medium border transition-colors",
                categoryFilter === cat.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/30 border-border/60 text-foreground hover:bg-muted/60"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border/60 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 border-b border-border/60">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground w-28">Code</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground w-48">Text</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Description</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No status codes match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((status: HttpStatus, i: number) => (
                  <tr
                    key={status.code}
                    className={cn(
                      "border-b border-border/40 last:border-0",
                      i % 2 === 0 ? "bg-background" : "bg-muted/10"
                    )}
                  >
                    <td className="px-4 py-2.5">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold font-mono",
                          getBadgeClass(status.code)
                        )}
                      >
                        {status.code}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-medium text-sm">{status.text}</td>
                    <td className="px-4 py-2.5 text-sm text-muted-foreground">{status.description ?? "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-muted-foreground">
          Showing {filtered.length} of {HTTP_STATUSES.length} status codes
        </p>
      </div>
    </ToolShell>
  );
}
