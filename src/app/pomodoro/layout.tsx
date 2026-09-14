import type { Metadata } from "next";
import { getToolMetadata } from "@/lib/tool-metadata";
import ToolJsonLd from "@/components/shared/ToolJsonLd";

export const metadata: Metadata = getToolMetadata("pomodoro");

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd slug="pomodoro" />
      {children}
    </>
  );
}
