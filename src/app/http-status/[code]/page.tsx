import Link from "next/link";
import { notFound } from "next/navigation";
import { HTTP_STATUSES } from "@/lib/tools/http-status";
import { getStatusDetail } from "@/lib/tools/http-status-content";
import { ArrowLeft, ExternalLink } from "lucide-react";

function badgeColor(code: number) {
  if (code < 200) return "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800";
  if (code < 300) return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
  if (code < 400) return "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800";
  if (code < 500) return "bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-800";
  return "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-200 dark:border-red-800";
}

function heroBg(code: number) {
  if (code < 200) return "from-blue-50/60 dark:from-blue-950/20";
  if (code < 300) return "from-emerald-50/60 dark:from-emerald-950/20";
  if (code < 400) return "from-amber-50/60 dark:from-amber-950/20";
  if (code < 500) return "from-orange-50/60 dark:from-orange-950/20";
  return "from-red-50/60 dark:from-red-950/20";
}

export default async function StatusCodePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const status = HTTP_STATUSES.find((s) => s.code === Number(code));
  if (!status) notFound();

  const detail = getStatusDetail(status.code);

  const relatedStatuses = detail?.related
    .map((c) => HTTP_STATUSES.find((s) => s.code === c))
    .filter(Boolean) ?? [];

  const categoryStatuses = HTTP_STATUSES.filter(
    (s) => s.category === status.category && s.code !== status.code
  ).slice(0, 6);

  return (
    <div className="flex flex-col gap-0 w-full">
      {/* Hero */}
      <div className={`bg-gradient-to-b ${heroBg(status.code)} to-transparent px-5 md:px-8 pt-8 pb-6`}>
        <Link
          href="/http-status/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-5 transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          All HTTP Status Codes
        </Link>

        <div className="flex items-start gap-4 flex-wrap">
          <div className={`font-mono text-5xl font-black px-5 py-3 rounded-2xl border-2 ${badgeColor(status.code)}`}>
            {status.code}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight mt-1">{status.text}</h1>
            <p className="text-sm text-muted-foreground mt-1">{status.category}</p>
            {detail?.rfc && (
              <span className="inline-block mt-2 text-xs font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">
                {detail.rfc}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 md:px-8 py-6 space-y-8 max-w-3xl">

        {/* What it means */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">What it means</h2>
          <p className="text-sm text-foreground/90 leading-relaxed">
            {detail?.what ?? status.description}
          </p>
        </section>

        {/* Causes */}
        {detail?.causes && detail.causes.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Common causes</h2>
            <ul className="space-y-1.5">
              {detail.causes.map((cause) => (
                <li key={cause} className="flex items-start gap-2 text-sm text-foreground/80">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                  {cause}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* How to fix */}
        {detail?.fix && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">How to fix it</h2>
            <p className="text-sm text-foreground/80 leading-relaxed">{detail.fix}</p>
          </section>
        )}

        {/* Example */}
        {detail?.example && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Example response</h2>
            <pre className="font-mono text-xs bg-muted/40 border border-border/60 rounded-lg p-4 overflow-auto whitespace-pre-wrap">
              {detail.example}
            </pre>
          </section>
        )}

        {/* CTA */}
        <section className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-semibold">Test this status code live</p>
            <p className="text-xs text-muted-foreground mt-0.5">Send real HTTP requests and inspect status codes directly in your browser.</p>
          </div>
          <Link
            href="/http-tester/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity shrink-0"
          >
            Open HTTP Tester
            <ExternalLink className="h-3 w-3" />
          </Link>
        </section>

        {/* Related codes */}
        {relatedStatuses.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Related status codes</h2>
            <div className="flex flex-wrap gap-2">
              {relatedStatuses.map((s) => s && (
                <Link
                  key={s.code}
                  href={`/http-status/${s.code}/`}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium hover:opacity-80 transition-opacity ${badgeColor(s.code)}`}
                >
                  <span className="font-mono font-bold">{s.code}</span>
                  <span>{s.text}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Other codes in this range */}
        {categoryStatuses.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Other {status.category} codes
            </h2>
            <div className="flex flex-wrap gap-2">
              {categoryStatuses.map((s) => (
                <Link
                  key={s.code}
                  href={`/http-status/${s.code}/`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/60 bg-muted/30 text-xs font-medium hover:bg-muted/60 transition-colors"
                >
                  <span className="font-mono font-bold text-foreground">{s.code}</span>
                  <span className="text-muted-foreground">{s.text}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="pt-2 border-t border-border/40">
          <Link href="/http-status/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← View all HTTP status codes
          </Link>
        </div>
      </div>
    </div>
  );
}
