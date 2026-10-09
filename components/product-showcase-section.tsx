"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Monitor,
  Mic,
  PenTool,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Play,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const FEATURES = [
  {
    id: "cbt-screen",
    title: "Interface Double Écran CBT",
    subtitle: "Conforme 100% FEI & CCIP",
    icon: Monitor,
    badge: "Exclusif",
    description:
      "Reproduction au pixel près de l'environnement officiel d'examen. Document source à gauche, questions QCM à droite avec grille de 39 pastilles interactives et compte à rebours officiel.",
    bullets: [
      "Navigation instantanée par pastille",
      "Écoute audio unique non réversible conforme",
      "Chronomètre officiel sans pause triche",
    ],
  },
  {
    id: "speech-roleplay",
    title: "Examinateur Vocal Interactif",
    subtitle: "Expression Orale en direct",
    icon: Mic,
    badge: "IA Vocale",
    description:
      "Entraînez-vous à l'épreuve orale avec un examinateur IA interactif qui vous relance, vous pose des questions imprévues et simule un vrai dialogue officiel (Tâche 2 et 3).",
    bullets: [
      "Retranscription phonétique haute fidélité",
      "Relances et objections réalistes",
      "Notation sur les critères de fluidité FEI",
    ],
  },
  {
    id: "instant-ai",
    title: "Correction Écrite Instantanée",
    subtitle: "Grille NCLC 7 à 10",
    icon: PenTool,
    badge: "0 Seconde",
    description:
      "Ne perdez plus 48 heures à attendre une correction vague. Obtenez une analyse mot par mot, une réécriture au niveau C1/C2 et la liste précise de vos fautes d'accord et de syntaxe.",
    bullets: [
      "Score estimé NCLC & CECRL immédiat",
      "Suggestions de connecteurs logiques B2/C1",
      "Exemples de reformulation de haut vol",
    ],
  },
];

export function ProductShowcaseSection() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="relative mx-auto max-w-6xl space-y-10 px-2 sm:px-4">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Aperçu Haute Définition du Simulateur</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
          Conçu pour reproduire l&apos;examen officiel,{" "}
          <span className="bg-gradient-to-r from-brand-crimson to-rose-500 bg-clip-text text-transparent">
            au millimètre près
          </span>
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          Fini le scroll interminable et les PDF passifs. Vous vous entraînez sur la réplique exacte du logiciel officiel des centres agréés.
        </p>
      </div>

      {/* Tabs navigation */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-1 rounded-2xl bg-muted/60 max-w-2xl mx-auto border border-border/50">
        {FEATURES.map((feat, idx) => {
          const Icon = feat.icon;
          const isActive = activeTab === idx;
          return (
            <button
              key={feat.id}
              onClick={() => setActiveTab(idx)}
              className={`flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? "bg-background text-foreground shadow-sm border border-border/60"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/40"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-brand-crimson" : "text-muted-foreground"}`} />
              <span>{feat.title}</span>
            </button>
          );
        })}
      </div>

      {/* Showcase Visual Card */}
      <div className="relative rounded-3xl border border-border/80 bg-gradient-to-b from-card to-card/50 p-3 sm:p-5 shadow-2xl overflow-hidden">
        {/* Glow backdrop */}
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-crimson/15 blur-[100px] rounded-full" />

        {/* Display Frame */}
        <div className="relative rounded-2xl overflow-hidden border border-border/60 bg-slate-950 aspect-[16/10] sm:aspect-[16/9] shadow-inner group">
          <Image
            src="/brand/cbt-platform-preview.jpg"
            alt="Simulateur CBT officiel Super4C2 en double écran"
            fill
            priority
            className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.01]"
            sizes="(max-width: 1200px) 100vw, 1150px"
          />

          {/* Overlay glass info tag */}
          <div className="absolute top-3 left-3 sm:top-5 sm:left-5 flex items-center gap-2 bg-background/85 dark:bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-lg text-xs font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-foreground">Mode Examen Réel</span>
            <span className="text-muted-foreground hidden sm:inline">• Audio Synchronisé</span>
          </div>

          <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5">
            <Button
              asChild
              size="sm"
              className="bg-brand-crimson hover:bg-brand-crimson/90 text-white shadow-lg text-xs font-semibold gap-1.5 rounded-full"
            >
              <Link href="/examens?test=tcf">
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Tester le simulateur</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Feature detail banner below mockup */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {FEATURES[activeTab].bullets.map((b, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 p-3 rounded-xl bg-background/60 border border-border/50 text-xs sm:text-sm text-foreground/90 font-medium"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{b}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
