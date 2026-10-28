"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DiffViewerRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/diff-checker/"); }, [router]);
  return null;
}
