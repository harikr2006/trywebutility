"use client";
import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "wbu_favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const paths = (JSON.parse(stored) as string[]).map((p) =>
          p.replace(/\/$/, "") || "/"
        );
        setFavorites(new Set(paths));
      }
    } catch {
      // ignore corrupt storage
    }
    setMounted(true);
  }, []);

  // Normalize path: strip trailing slash so /foo/ and /foo both match registry paths
  const normalize = (path: string) => path.replace(/\/$/, "") || "/";

  const toggle = useCallback((path: string) => {
    const key = normalize(path);
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {}
      return next;
    });
  }, []);

  return { favorites, toggle, mounted };
}
