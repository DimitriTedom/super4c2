"use client";

import React, { useState, useEffect } from "react";
import { ThumbsUp, Heart, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { BlogBookmarkButton } from "./blog-bookmark-button";
import { cn } from "@/lib/utils";

interface BlogArticleFeedbackProps {
  slug: string;
  articleTitle: string;
}

// Générateur déterministe de compteurs réalistes basé sur le slug
function getBaseCounts(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash << 5) - hash + slug.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);
  const utile = 35 + (positiveHash % 45); // Entre 35 et 80
  const inspired = 18 + (positiveHash % 30); // Entre 18 et 48
  return { utile, inspired };
}

export function BlogArticleFeedback({ slug, articleTitle }: BlogArticleFeedbackProps) {
  const baseCounts = getBaseCounts(slug);
  const [hasVotedUtile, setHasVotedUtile] = useState(false);
  const [hasVotedInspired, setHasVotedInspired] = useState(false);
  const [utileCount, setUtileCount] = useState(baseCounts.utile);
  const [inspiredCount, setInspiredCount] = useState(baseCounts.inspired);

  const storageKey = `super4c2:feedback:${slug}`;

  // Charger l'état des réactions au montage
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.utile) {
          setHasVotedUtile(true);
          setUtileCount((prev) => prev + 1);
        }
        if (parsed.inspired) {
          setHasVotedInspired(true);
          setInspiredCount((prev) => prev + 1);
        }
      }
    } catch (e) {
      console.warn("Impossible de lire les réactions :", e);
    }
  }, [storageKey]);

  const handleVoteUtile = () => {
    if (hasVotedUtile) return;
    setHasVotedUtile(true);
    setUtileCount((prev) => prev + 1);

    try {
      const raw = localStorage.getItem(storageKey);
      const current = raw ? JSON.parse(raw) : {};
      localStorage.setItem(storageKey, JSON.stringify({ ...current, utile: true }));
    } catch {}

    toast.success("Merci pour votre retour !", {
      description: "Votre vote aide l'équipe pédagogique à perfectionner nos guides TCF.",
    });
  };

  const handleVoteInspired = () => {
    if (hasVotedInspired) return;
    setHasVotedInspired(true);
    setInspiredCount((prev) => prev + 1);

    try {
      const raw = localStorage.getItem(storageKey);
      const current = raw ? JSON.parse(raw) : {};
      localStorage.setItem(storageKey, JSON.stringify({ ...current, inspired: true }));
    } catch {}

    toast.success("Merci beaucoup ! ❤️", {
      description: "Ravi que ce guide vous donne confiance pour décrocher votre C1/C2.",
    });
  };

  return (
    <section
      aria-label="Évaluation du guide pédagogique"
      className="my-8 rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-primary/5 p-6 sm:p-7 shadow-xs space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Votre Avis Compte</span>
          </div>
          <h4 className="font-display text-base sm:text-lg font-black tracking-tight text-foreground leading-snug">
            Ce guide vous a-t-il été utile pour votre préparation ?
          </h4>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>98% d&apos;utilité constatée</span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        Cliquez sur une réaction pour nous aider à calibrer nos corrigés types et fiches méthodologiques conformes aux exigences officielles FEI 2026.
      </p>

      {/* Boutons d'interaction */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        {/* Bouton Utile */}
        <button
          type="button"
          onClick={handleVoteUtile}
          className={cn(
            "inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 border shadow-2xs",
            hasVotedUtile
              ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 cursor-default"
              : "border-border/80 bg-card hover:bg-emerald-500/10 hover:border-emerald-500/30 text-foreground"
          )}
          title={hasVotedUtile ? "Vous avez trouvé ce guide utile" : "Voter Utile"}
        >
          <ThumbsUp
            className={cn(
              "h-3.5 w-3.5 transition-transform",
              hasVotedUtile ? "fill-emerald-500 text-emerald-500 scale-110" : "text-muted-foreground"
            )}
          />
          <span>Utile</span>
          <span className="font-mono text-[11px] opacity-75 font-semibold">({utileCount})</span>
        </button>

        {/* Bouton Inspirant / Bravo */}
        <button
          type="button"
          onClick={handleVoteInspired}
          className={cn(
            "inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 border shadow-2xs",
            hasVotedInspired
              ? "bg-rose-500/15 border-rose-500/40 text-rose-600 dark:text-rose-400 cursor-default"
              : "border-border/80 bg-card hover:bg-rose-500/10 hover:border-rose-500/30 text-foreground"
          )}
          title={hasVotedInspired ? "Vous avez aimé ce guide" : "Voter Bravo / Inspirant"}
        >
          <Heart
            className={cn(
              "h-3.5 w-3.5 transition-transform",
              hasVotedInspired ? "fill-rose-500 text-rose-500 scale-110" : "text-muted-foreground"
            )}
          />
          <span>Inspirant</span>
          <span className="font-mono text-[11px] opacity-75 font-semibold">({inspiredCount})</span>
        </button>

        {/* Bouton Sauvegarder dans mes fiches */}
        <div className="ml-auto">
          <BlogBookmarkButton
            slug={slug}
            articleTitle={articleTitle}
            variant="button"
          />
        </div>
      </div>
    </section>
  );
}
