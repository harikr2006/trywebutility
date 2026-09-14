"use client";
import { usePathname } from "next/navigation";

const BASE = "https://trywebutility.com";

export default function CanonicalLink() {
  const pathname = usePathname();
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return <link rel="canonical" href={`${BASE}${path}`} />;
}
