"use client";

import React, { useState } from "react";
import { MessageSquare, Download, Sparkles, ShieldCheck, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlogLeadModal } from "./blog-lead-modal";
import { BlogLeadSlideIn } from "./blog-lead-slidein";

interface BlogLeadEngagementProps {
  articleTitle: string;
  categoryLabel?: string;
}

export function BlogLeadEngagement({
  articleTitle,
  categoryLabel,
}: BlogLeadEngagementProps) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  return (
    <>
      {/* 1. Interactive Modal for WhatsApp / Email lead capture */}
      <BlogLeadModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        articleTitle={articleTitle}
      />

      {/* 2. Floating behavioral slide-in after 12s of reading */}
      <BlogLeadSlideIn
        onOpenLeadModal={() => setModalOpen(true)}
        categoryLabel={categoryLabel}
      />

      {/* 3. High-Converting In-Page Banner for Free Pack & WhatsApp Community */}
      <section
        aria-label="Pack Gratuit et Communauté WhatsApp TCF"
        className="my-10 relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-card via-card to-emerald-500/10 p-6 sm:p-8 space-y-4 shadow-md"
      >
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>100% Gratuit — Communauté Officielle 2026</span>
          </div>

          <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
            <Users className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>+1 400 candidats actifs</span>
          </div>
        </div>

        <h3 className="font-display text-xl sm:text-2xl font-black tracking-tight text-foreground leading-snug">
          Téléchargez les 10 Modèles C1/C2 (PDF) &amp; Recevez les Sujets Réels sur WhatsApp
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
          Complétez ce guide avec notre kit officiel 100% gratuit : plans rédigés, formules de politesse validées par les grilles FEI et veille des sujets tombés en session cette semaine.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button
            onClick={() => setModalOpen(true)}
            className="h-11 px-6 font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md gap-2"
          >
            <Download className="h-4 w-4" />
            <span>Débloquer mon Pack Gratuit &amp; WhatsApp →</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            <a
              href="https://chat.whatsapp.com/super4c2_nclc7"
              target="_blank"
              rel="noopener noreferrer"
            >
              Rejoindre directement le WhatsApp VIP →
            </a>
          </Button>
        </div>

        <div className="flex items-center gap-2 pt-2 text-[11px] text-muted-foreground/80 border-t border-border/50">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
          <span>Accès libre et immédiat sans carte bancaire • Respect de votre vie privée</span>
        </div>
      </section>
    </>
  );
}
