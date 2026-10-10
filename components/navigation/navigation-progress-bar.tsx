"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function ProgressBarInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentUrlRef = useRef<string>("");

  const startProgress = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);

    setVisible(true);
    setProgress(25);

    // Progression logarithmique fluide
    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev < 60) return prev + Math.random() * 15;
        if (prev < 85) return prev + Math.random() * 5;
        if (prev < 92) return prev + 0.8;
        return prev;
      });
    }, 200);

    // Timeout de sécurité au bout de 10s si la navigation est interrompue
    safetyTimeoutRef.current = setTimeout(() => {
      finishProgress();
    }, 10000);
  };

  const finishProgress = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }

    setProgress(100);
    setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        setProgress(0);
      }, 300);
    }, 200);
  };

  // Détection des clics sur les liens de navigation internes
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Ignorer clics modificateurs (ouverture nouvel onglet)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.defaultPrevented) {
        return;
      }

      const target = (e.target as Element).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Ignorer ancres, javascript:, mailto:, tel: ou liens externes
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:") ||
        target.getAttribute("target") === "_blank" ||
        target.getAttribute("download")
      ) {
        return;
      }

      try {
        const url = new URL(href, window.location.href);
        const isSameOrigin = url.origin === window.location.origin;

        if (isSameOrigin) {
          const isSamePage =
            url.pathname === window.location.pathname &&
            url.search === window.location.search;

          if (!isSamePage) {
            startProgress();
          }
        }
      } catch {
        // En cas d'URL non standard, ne rien faire
      }
    };

    // Écouteur pour déclenchements programmatiques
    const handleCustomStart = () => startProgress();
    const handleCustomFinish = () => finishProgress();

    document.addEventListener("click", handleDocumentClick, { capture: true });
    window.addEventListener("super4c2:navigation-start", handleCustomStart);
    window.addEventListener("super4c2:navigation-finish", handleCustomFinish);

    return () => {
      document.removeEventListener("click", handleDocumentClick, { capture: true });
      window.removeEventListener("super4c2:navigation-start", handleCustomStart);
      window.removeEventListener("super4c2:navigation-finish", handleCustomFinish);
    };
  }, []);

  // Détection de la fin du rendu quand l'URL a effectivement changé
  useEffect(() => {
    const newUrl = `${pathname}?${searchParams.toString()}`;
    if (currentUrlRef.current && currentUrlRef.current !== newUrl) {
      finishProgress();
    }
    currentUrlRef.current = newUrl;
  }, [pathname, searchParams]);

  if (!visible && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none h-[3.5px] overflow-hidden"
      aria-hidden="true"
    >
      {/* Barre de progression avec dégradé Crimson / Amber & Shimmer */}
      <div
        className="h-full bg-gradient-to-r from-red-600 via-brand-crimson to-amber-400 shadow-[0_0_12px_rgba(229,26,49,0.85),0_0_4px_rgba(255,183,3,0.7)] transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
          transitionProperty: "width, opacity",
          transitionDuration: progress === 100 ? "150ms" : "250ms",
        }}
      >
        {/* Shimmer laser à la tête de la barre */}
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-white/40 to-white/90 blur-[1px]" />
      </div>
    </div>
  );
}

export function NavigationProgressBar() {
  return (
    <Suspense fallback={null}>
      <ProgressBarInner />
    </Suspense>
  );
}

/**
 * Fonction utilitaire pour déclencher la barre manuellement
 * (utile lors des router.push programmatiques)
 */
export function triggerNavigationProgress() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("super4c2:navigation-start"));
  }
}
