import type { Metadata } from "next";
import { getToolMetadata } from "@/lib/tool-metadata";
import ToolJsonLd from "@/components/shared/ToolJsonLd";

export const metadata: Metadata = getToolMetadata("csv-viewer");

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd slug="csv-viewer" />
      {children}
    </>
  );
}
