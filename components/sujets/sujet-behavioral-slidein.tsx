"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SujetBehavioralSlideInProps {
  onOpenLeadDialog: () => void;
  isUnlocked: boolean;
}

export function SujetBehavioralSlideIn({
  onOpenLeadDialog,
  isUnlocked,
}: SujetBehavioralSlideInProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    if (isUnlocked) return;

    try {
      // 1. Vérification si déjà débloqué ou masqué récemment
      const isVip = localStorage.getItem("super4c2:vip_topics_unlocked") === "true";
      if (isVip) return;

      const dismissedAt = localStorage.getItem("super4c2:slidein_dismissed_at");
      if (dismissedAt) {
        const diff = Date.now() - parseInt(dismissedAt, 10);
        // Si fermé il y a moins de 3 jours, ne pas réafficher
        if (diff < 3 * 24 * 60 * 60 * 1000) return;
      }

      // 2. Incrémentation du compteur de visite
      const visitCount = parseInt(localStorage.getItem("super4c2:visit_count") || "0", 10) + 1;
      localStorage.setItem("super4c2:visit_count", visitCount.toString());

      // 3. Déclenchement automatique : après 8 secondes pour les visiteurs récurrents, ou 16s pour les nouveaux
      const delay = visitCount > 1 ? 8000 : 16000;
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);

      return () => clearTimeout(timer);
    } catch {
      // Ignorer si localStorage restreint
    }
  }, [isUnlocked]);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem("super4c2:slidein_dismissed_at", Date.now().toString());
    } catch {}
  };

  const handleActionClick = () => {
    handleDismiss();
    onOpenLeadDialog();
  };

  if (!isVisible || isUnlocked) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 max-w-sm w-[calc(100vw-2rem)] rounded-3xl border border-emerald-500/30 bg-card/95 backdrop-blur-md p-4 sm:p-5 shadow-2xl space-y-3"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
              <MessageSquare className="h-4 w-4" />
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Veille TCF Canada 2026
              </span>
              <h4 className="font-display text-sm font-bold text-foreground">
                Sujets Réels sur WhatsApp
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
          Recevez chaque vendredi le sujet officiel tombé en centre d&apos;examen avec son plan rédigé et son corrigé C1/C2 par M. Laurent.
        </p>

        <div className="pt-1 flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={handleActionClick}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 rounded-xl shadow-md gap-1.5"
          >
            <span>Débloquer l&apos;Accès VIP</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-xs text-muted-foreground hover:text-foreground h-9 rounded-xl"
          >
            Plus tard
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
