import type { Metadata } from "next";
import { HTTP_STATUSES } from "@/lib/tools/http-status";

export function generateStaticParams() {
  return HTTP_STATUSES.map((s) => ({ code: String(s.code) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const status = HTTP_STATUSES.find((s) => s.code === Number(code));
  if (!status) return {};

  const title = `${status.code} ${status.text} — HTTP Status Code`;
  const description = `${status.code} ${status.text}: ${status.description} Learn what causes it, how to fix it, and when servers return this status.`;

  return {
    title,
    description,
    alternates: { canonical: `https://trywebutility.com/http-status/${code}/` },
    openGraph: { title, description, type: "article" },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
