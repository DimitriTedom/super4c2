"use client";

import { useEffect, useState, useCallback } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const STORAGE_KEY = "super4c2:bookmarked_slugs";
const EVENT_NAME = "super4c2:bookmarks-changed";

export function useBlogBookmarks() {
  const [bookmarkedSlugs, setBookmarkedSlugs] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Charger les favoris depuis le localStorage
  const loadBookmarks = useCallback(() => {
    try {
      if (typeof window === "undefined") return;
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setBookmarkedSlugs(parsed);
        }
      } else {
        setBookmarkedSlugs([]);
      }
    } catch (e) {
      console.warn("Impossible de lire les favoris du blog :", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Détecter l'authentification de l'utilisateur
  useEffect(() => {
    let isMounted = true;
    try {
      const supabase = createSupabaseBrowserClient();
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (isMounted) {
          setIsAuthenticated(!!session?.user);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (isMounted) {
          setIsAuthenticated(!!session?.user);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch {
      if (isMounted) setIsAuthenticated(false);
    }
  }, []);

  // Écouter les changements multi-composants et multi-onglets
  useEffect(() => {
    loadBookmarks();

    const handleCustomEvent = () => loadBookmarks();
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) loadBookmarks();
    };

    window.addEventListener(EVENT_NAME, handleCustomEvent);
    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener(EVENT_NAME, handleCustomEvent);
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, [loadBookmarks]);

  const isBookmarked = useCallback(
    (slug: string) => bookmarkedSlugs.includes(slug),
    [bookmarkedSlugs]
  );

  const toggleBookmark = useCallback(
    (slug: string): boolean => {
      try {
        let updated: string[];
        const alreadySaved = bookmarkedSlugs.includes(slug);
        if (alreadySaved) {
          updated = bookmarkedSlugs.filter((s) => s !== slug);
        } else {
          updated = [slug, ...bookmarkedSlugs];
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setBookmarkedSlugs(updated);

        // Notifier tous les autres composants réactifs sur la page
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { slug, saved: !alreadySaved } }));

        return !alreadySaved;
      } catch (e) {
        console.warn("Impossible de modifier les favoris :", e);
        return false;
      }
    },
    [bookmarkedSlugs]
  );

  return {
    bookmarkedSlugs,
    count: bookmarkedSlugs.length,
    isLoaded,
    isAuthenticated,
    isBookmarked,
    toggleBookmark,
  };
}
