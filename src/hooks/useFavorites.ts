"use client";
import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "wbu_favorites";

export const normalizePath = (path: string) => path.replace(/\/$/, "") || "/";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const paths = (JSON.parse(stored) as string[]).map(normalizePath);
        setFavorites(new Set(paths));
      }
    } catch {
      // ignore corrupt storage
    }
    setMounted(true);
  }, []);

  const toggle = useCallback((path: string) => {
    const key = normalizePath(path);
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
