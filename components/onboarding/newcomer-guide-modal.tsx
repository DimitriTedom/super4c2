"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Highlighter,
  Mic,
  ShieldCheck,
  Compass,
  Play,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Step {
  id: number;
  title: string;
  badge: string;
  description: string;
  iconSrc: string;
  highlightText: string;
  actionText?: string;
  actionHref?: string;
  bulletPoints: string[];
}

const STEPS: Step[] = [
  {
    id: 1,
    badge: "Bienvenue sur Super4C2",
    title: "Décrochez vos 4 C2 & Débloquez +50 Points CRS",
    description:
      "Super4C2 est le premier centre d'entraînement numérique officiel reproduisant à l'identique l'environnement CBT (Computer-Based Test) du TCF Canada, TEF et IELTS.",
    iconSrc: "/brand/icons-3d/diploma-achievement.png",
    highlightText: "Objectif Immédiat : Palier NCLC 7+ dans les 4 compétences",
    bulletPoints: [
      "Compréhension Écrite & Orale avec documents sonores réels",
      "Évaluateur IA instantané respectant la grille officielle FEI",
      "Examinateur oral vocal interactif avec détection d'hésitations",
    ],
  },
  {
    id: 2,
    badge: "Innovation Pédagogique",
    title: "Double Mode : Examen Strict vs Entraînement Didactique",
    description:
      "Choisissez selon votre étape de préparation : éprouvez-vous en conditions réelles avec chronomètre inarrêtable, ou apprenez pas à pas avec décodage des pièges.",
    iconSrc: "/brand/icons-3d/cbt-dual-screen-simulator.png",
    highlightText: "Basculez à tout moment via l'en-tête de simulation",
    bulletPoints: [
      "Mode Examen Strict : Chronomètre officiel FEI de 60 min, zéro pause",
      "Mode Didactique : Mettez en pause le chrono et analysez les justifications",
      "Raccourcis clavier physiques officiels (touches A, B, C, D et F pour marquer)",
    ],
  },
  {
    id: 3,
    badge: "Outils Décisifs en Compréhension",
    title: "Feutre Surligneur Interactif & Zoom Typographique",
    description:
      "Repérez instantanément les indices et connecteurs logiques décisifs grâce au feutre surligneur avec curseur personnalisé et agrandissement de police.",
    iconSrc: "/brand/icons-3d/comprehension-ecrite-book.png",
    highlightText: "Pointeur feutre fluorescent avec mire de précision",
    bulletPoints: [
      "Cliquez sur « Surligneur » : le curseur se transforme en feutre biseauté",
      "Sélectionnez le texte clé pour l'illuminer en jaune ambre",
      "Ajustez la taille de lecture (A- / A / A+) pour un confort visuel optimal",
    ],
  },
  {
    id: 4,
    badge: "Laboratoire Vocal Interactif",
    title: "Salle d'Oral Virtuelle & Pré-test Matériel Web Audio",
    description:
      "Ne laissez aucun problème technique gâcher votre performance. Notre pré-test audio vérifie votre micro et vos écouteurs avec la voix de M. Laurent avant l'examen.",
    iconSrc: "/brand/icons-3d/expression-orale-microphone.png",
    highlightText: "Analyseur FFT temps réel & interlocuteur IA vocal",
    bulletPoints: [
      "VU-mètre interactif 16 barres confirmant la clarté de votre voix",
      "Test d'écouteurs avec un enregistrement studio officiel",
      "Débriefing d'oral en 4 critères : Aisance, Lexique, Grammaire, Prononciation",
    ],
  },
  {
    id: 5,
    badge: "Succès Collectif",
    title: "Rejoignez la Communauté VIP des 4 C2",
    description:
      "Entraînez-vous avec les candidats les plus motivés. Échangez sur les sujets tombés cette semaine dans les centres de passation et bénéficiez de corrigés de groupe.",
    iconSrc: "/brand/icons-3d/vip-community-shield.png",
    highlightText: "Accès inclus avec tous les parcours Super4C2",
    bulletPoints: [
      "Radar des Sujets Récents actualisé chaque semaine",
      "Salons d'entraide pour l'Expression Écrite et Orale",
      "Webinaires mensuels avec des correcteurs certifiés",
    ],
    actionText: "Découvrir la Communauté VIP",
    actionHref: "/communaute",
  },
];

const ONBOARDING_STORAGE_KEY = "super4c2:newcomer_guide_viewed";

export function NewcomerGuideModal() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);

  const isSuppressed =
    /^\/examens\/[^/]+\/(ce|co|ee|eo|examen-blanc)\/?$/.test(pathname || "") ||
    pathname?.startsWith("/auth") ||
    pathname?.startsWith("/admin");

  // Auto-open on first visit after a slight delay (only on public / student pages)
  useEffect(() => {
    if (isSuppressed) return;

    try {
      const alreadyViewed = localStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (!alreadyViewed) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore storage errors
    }
  }, [isSuppressed]);

  // Listen for manual trigger event
  useEffect(() => {
    const handleOpen = () => {
      setCurrentStep(1);
      setIsOpen(true);
    };
    window.addEventListener("super4c2:open-guide", handleOpen);
    return () => window.removeEventListener("super4c2:open-guide", handleOpen);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
    } catch {
      // Ignore storage errors
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const step = STEPS[currentStep - 1];
  const progressPercent = (currentStep / STEPS.length) * 100;

  if (isSuppressed) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop avec flou profond */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
          />

          {/* Card Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl border border-border/80 bg-background/95 dark:bg-card/95 shadow-2xl backdrop-blur-xl flex flex-col"
          >
            {/* Barre de progression laser en haut */}
            <div className="relative h-1.5 w-full bg-muted overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary via-rose-500 to-indigo-600 shadow-[0_0_8px_rgba(229,26,49,0.7)]"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              title="Fermer le guide"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Contenu principal de l'étape */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Badge + Icone 3D */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                    <Sparkles className="h-3 w-3" />
                    <span>{step.badge}</span>
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    Étape {currentStep} sur {STEPS.length}
                  </span>
                </div>

                <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 drop-shadow-md">
                  <Image
                    src={step.iconSrc}
                    alt={step.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Titre & Description */}
              <div className="space-y-2">
                <h3 className="font-display text-xl sm:text-2xl font-black tracking-tight text-foreground leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Highlight callout box */}
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10 p-3.5 flex items-center gap-2.5">
                <Compass className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  {step.highlightText}
                </span>
              </div>

              {/* Bullet points concrets */}
              <ul className="space-y-2.5 text-xs sm:text-sm">
                {step.bulletPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-foreground/90">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between border-t border-border/80 bg-muted/30 px-6 py-4">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="gap-1.5 text-xs font-semibold"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Précédent</span>
              </Button>

              <div className="flex items-center gap-1.5">
                {STEPS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setCurrentStep(s.id)}
                    className={`h-2 rounded-full transition-all duration-200 ${
                      s.id === currentStep
                        ? "w-6 bg-primary"
                        : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                    }`}
                    title={`Aller à l'étape ${s.id}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                {step.actionHref ? (
                  <Button
                    type="button"
                    size="sm"
                    asChild
                    onClick={handleClose}
                    className="gap-1.5 text-xs font-bold bg-primary text-white shadow-sm"
                  >
                    <Link href={step.actionHref}>
                      <span>{step.actionText || "Explorer"}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleNext}
                    className="gap-1.5 text-xs font-bold bg-primary text-white shadow-sm"
                  >
                    <span>{currentStep === STEPS.length ? "Terminer" : "Suivant"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/**
 * Trigger programmatic opening of the newcomer guide
 */
export function openNewcomerGuide() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("super4c2:open-guide"));
  }
}
