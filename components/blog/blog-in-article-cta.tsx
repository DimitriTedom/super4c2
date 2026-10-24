import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Zap, Users, CheckCircle2 } from "lucide-react";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Button } from "@/components/ui/button";

interface BlogInArticleCtaProps {
  category?: string;
  customTitle?: string;
  customHref?: string;
  customLabel?: string;
}

export function BlogInArticleCta({
  category,
  customTitle,
  customHref,
  customLabel,
}: BlogInArticleCtaProps) {
  const isWriting = category?.toLowerCase().includes("écrite") || category?.toLowerCase().includes("tâche");
  const isSpeaking = category?.toLowerCase().includes("orale");

  const title =
    customTitle ||
    (isWriting
      ? "Passez de B2 à C1 en Expression Écrite TCF Canada"
      : isSpeaking
      ? "Maîtrisez les 3 Tâches d'Expression Orale avec l'IA"
      : "Visez le NCLC 7+ et Sécurisez vos 50 Points CRS");

  const subtitle = isWriting
    ? "Simulez vos Tâches 1, 2 et 3 sous le chronomètre officiel FEI et recevez une double notation IA avec réécriture stylistique Magic Rewrite niveau C2."
    : isSpeaking
    ? "Entraînez-vous avec l'examinateur IA vocal interactif sur les 3 tâches réelles du TCF Canada et perfectionnez votre fluidité avant le jour J."
    : "Rejoignez le simulateur CBT Super4C2 conforme aux normes 2026 de France Éducation International. Évaluez votre niveau réel en 5 minutes.";

  const href = customHref || "/test-gratuit";
  const label = customLabel || "Commencer l'évaluation gratuite";

  return (
    <aside
      aria-label="Appel à l'action pédagogique"
      className="my-10 relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 p-6 sm:p-8 shadow-md"
    >
      {/* Decorative ambient gradient ring */}
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 h-36 w-36 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

      <div className="relative space-y-4">
        {/* Badge & Social Proof */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
            <Zap className="h-3.5 w-3.5 fill-primary text-primary" />
            <span>Simulateur Officiel TCF Canada 2026</span>
          </div>

          <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
            <Users className="h-3.5 w-3.5 text-primary" />
            <span>+1 400 candidats préparés</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display text-xl sm:text-2xl font-black tracking-tight text-foreground leading-snug">
          {title}
        </h3>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
          {subtitle}
        </p>

        {/* Key Features Bullet points */}
        <div className="grid sm:grid-cols-2 gap-2 text-xs text-foreground/80 pt-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <span>Double correction IA selon le barème FEI</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <span>Chronomètre CBT &amp; décompte de mots réel</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-3">
          <ShimmerButton
            href={href}
            background="#E51A31"
            shimmerColor="#ffffff"
            className="font-bold px-6 py-2.5 text-xs sm:text-sm text-white shadow-md hover:scale-[1.02] transition-transform"
          >
            <span>{label}</span>
            <ArrowRight className="h-4 w-4 ml-1.5 inline-block" />
          </ShimmerButton>

          <Button variant="ghost" size="sm" asChild className="text-xs text-muted-foreground hover:text-foreground">
            <Link href="/calculateur-crs">
              <span>Calculer mes points CRS Canada →</span>
            </Link>
          </Button>
        </div>

        {/* Trust footer note */}
        <div className="flex items-center gap-2 pt-2 text-[11px] text-muted-foreground/80 border-t border-border/50">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
          <span>Accès instantané sans carte bancaire • Conforme aux spécifications FEI &amp; IRCC</span>
        </div>
      </div>
    </aside>
  );
}
