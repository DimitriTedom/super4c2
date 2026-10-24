"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, UserPlus, Zap } from "lucide-react";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Button } from "@/components/ui/button";

interface BlogAccountConversionBannerProps {
  className?: string;
  sourceContext?: string;
}

export function BlogAccountConversionBanner({
  className = "",
  sourceContext = "blog_index",
}: BlogAccountConversionBannerProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-card via-card to-primary/10 p-6 sm:p-8 shadow-xl ${className}`}
    >
      {/* Decorative ambient blur circles */}
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 h-36 w-36 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

      <div className="relative space-y-5">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
            <Zap className="h-3.5 w-3.5 fill-primary text-primary" />
            <span>100% Gratuit — Sans Carte Bancaire</span>
          </div>

          <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
            <UserPlus className="h-3.5 w-3.5 text-primary" />
            <span>Inscription en 30 secondes chrono</span>
          </div>
        </div>

        {/* Headline & Value Proposition */}
        <div className="space-y-2 max-w-2xl">
          <h3 className="font-display text-xl sm:text-3xl font-black tracking-tight text-foreground leading-snug">
            Passez de la Lecture à l&apos;Action : Créez votre Compte Gratuit
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Ne restez pas simple spectateur. Débloquez immédiatement votre accès complet aux simulateurs CBT officiels, enregistrez vos scores et bénéficiez de la double notation IA instantanée.
          </p>
        </div>

        {/* 4 Pillars of Value */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-foreground/90 pt-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Simulateur CBT 60 min avec décompte officiel des mots</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Double correction IA selon le barème FEI sur 20</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Salle d&apos;Expression Orale interactive avec Laurent Mercier</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Historique personnalisé et carnet d&apos;erreurs intelligent</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3.5 pt-2">
          <ShimmerButton
            href={`/auth/register?source=${encodeURIComponent(sourceContext)}`}
            background="#E51A31"
            shimmerColor="#ffffff"
            className="font-bold px-7 py-3 text-xs sm:text-sm text-white shadow-lg hover:scale-[1.02] transition-transform"
          >
            <span>Créer mon compte gratuit en 30s</span>
            <ArrowRight className="h-4 w-4 ml-2 inline-block" />
          </ShimmerButton>

          <Button
            asChild
            variant="outline"
            className="h-11 px-5 text-xs sm:text-sm font-semibold rounded-xl border-border hover:bg-muted/60"
          >
            <Link href="/auth/login">
              Déjà un compte ? Se connecter →
            </Link>
          </Button>
        </div>

        {/* Trust Footer */}
        <div className="flex items-center gap-2 pt-1 text-[11px] text-muted-foreground/80 border-t border-border/50">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
          <span>Accès libre et permanent • Zéro frais cachés • Conforme aux spécifications France Éducation International</span>
        </div>
      </div>
    </div>
  );
}
