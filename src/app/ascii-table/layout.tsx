import type { Metadata } from "next";
import { getToolMetadata } from "@/lib/tool-metadata";
import ToolJsonLd from "@/components/shared/ToolJsonLd";

export const metadata: Metadata = getToolMetadata("ascii-table");

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd slug="ascii-table" />
      {children}
    </>
  );
}
