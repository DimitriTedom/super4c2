"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Sparkles, ArrowRight, Download, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlogLeadSlideInProps {
  onOpenLeadModal: () => void;
  categoryLabel?: string;
}

export function BlogLeadSlideIn({
  onOpenLeadModal,
  categoryLabel,
}: BlogLeadSlideInProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    try {
      // 1. Si déjà converti, ne pas afficher
      const isCaptured = localStorage.getItem("super4c2:blog_lead_captured") === "true";
      if (isCaptured) return;

      // 2. Si fermé récemment (dans les dernières 24h), ne pas réafficher
      const dismissedAt = localStorage.getItem("super4c2:blog_slidein_dismissed");
      if (dismissedAt) {
        const diff = Date.now() - parseInt(dismissedAt, 10);
        if (diff < 24 * 60 * 60 * 1000) return;
      }

      // 3. Déclencheur temporel : après 12 secondes de lecture
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 12000);

      // 4. Déclencheur de scroll : si l'utilisateur a défilé à 35% de la page
      const handleScroll = () => {
        const scrolled = window.scrollY;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0 && scrolled / totalHeight >= 0.35) {
          setIsVisible(true);
          window.removeEventListener("scroll", handleScroll);
        }
      };

      window.addEventListener("scroll", handleScroll, { passive: true });

      return () => {
        clearTimeout(timer);
        window.removeEventListener("scroll", handleScroll);
      };
    } catch {
      // Ignorer si localStorage restreint
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem("super4c2:blog_slidein_dismissed", Date.now().toString());
    } catch {}
  };

  const handleActionClick = () => {
    handleDismiss();
    onOpenLeadModal();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.aside
        aria-label="Alerte communauté WhatsApp TCF Canada"
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.96 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 max-w-sm w-[calc(100vw-2rem)] rounded-3xl border border-primary/25 bg-card/95 backdrop-blur-md p-4 sm:p-5 shadow-2xl space-y-3"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
              <MessageSquare className="h-4 w-4" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <Users className="h-3 w-3" />
                Communauté TCF Canada
              </span>
              <h4 className="font-display text-sm font-bold text-foreground">
                Sujets Réels 2026 sur WhatsApp
              </h4>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground rounded-full p-1 transition-colors"
            title="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Recevez gratuitement chaque semaine les sujets officiels tombés en centre d&apos;examen avec leurs modèles C1/C2 rédigés par M. Laurent.
        </p>

        <div className="pt-1 flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleActionClick}
            className="w-full text-xs font-bold h-9 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-xs gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Débloquer le Pack Gratuit →</span>
          </Button>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
