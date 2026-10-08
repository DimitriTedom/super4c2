"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  CircleHelp,
  Search,
  Sparkles,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const DEFAULT_FAQS: FaqItem[] = [
  {
    id: "faq-1",
    question: "Comment le NCLC 7 débloque-t-il +50 points bonus dans Entrée Express ?",
    answer:
      "IRCC (Immigration, Réfugiés et Citoyenneté Canada) attribue jusqu'à 50 points de bonus direct dans le Système de Classement Global (CRS / SCG) dès que vous atteignez le niveau NCLC 7 dans les 4 compétences linguistiques en français (Compréhension Orale, Compréhension Écrite, Expression Orale, Expression Écrite), en complément d'un niveau d'anglais CLB 5 minimum.",
    category: "NCLC & CRS",
  },
  {
    id: "faq-2",
    question: "En quoi le simulateur Super4C2 est-il conforme au CBT officiel de France Éducation International ?",
    answer:
      "Contrairement aux plateformes avec scroll continu, Super4C2 reproduit l'ergonomie stricte du logiciel officiel de FEI : navigation par grille de questions (1 à 39), split-screen figé (document à gauche, questions/réponses à droite), temps imparti officiel au millième de seconde et aucune possibilité de revenir en arrière une fois la section validée.",
    category: "Examen CBT",
  },
  {
    id: "faq-3",
    question: "Comment fonctionne l'examinateur vocal IA pour l'Expression Orale ?",
    answer:
      "Notre tuteur IA 'Aura C2' simule un examinateur certifié FEI en audio bidirectionnel temps réel. Il mène la Tâche 1 (recueil d'informations), la Tâche 2 (conviction/argumentation) et la Tâche 3 (débat d'opinion), puis analyse votre aisance, vos connecteurs logiques, la concordance des temps et votre prononciation selon la grille officielle.",
    category: "Examen CBT",
  },
  {
    id: "faq-4",
    question: "Quelle est la durée de validité des résultats du TCF et du TEF Canada ?",
    answer:
      "L'attestation officielle délivrée par France Éducation International (pour le TCF) ou la Chambre de Commerce et d'Industrie de Paris (pour le TEF) est valable 2 ans à compter de la date de passation de l'épreuve pour tous les programmes d'immigration gérés par IRCC.",
    category: "Général",
  },
  {
    id: "faq-5",
    question: "Peut-on repasser seulement une compétence si on rate le NCLC 7 ?",
    answer:
      "Non. Pour le TCF et TEF Canada, vous devez obligatoirement passer les 4 épreuves lors de la même session. Si vous manquez le NCLC 7 sur une seule compétence (ex: 450 en CE au lieu de 453), vous devez repasser l'intégralité du test après le délai réglementaire de 30 jours. C'est pourquoi la préparation équilibrée sur les 4 épreuves est cruciale.",
    category: "Stratégie",
  },
  {
    id: "faq-6",
    question: "Qu'est-ce que le système de répétition espacée (SRS) SuperMemo-2 ?",
    answer:
      "Notre moteur SRS analyse vos erreurs lors des séries d'entraînement et planifie des révisions ciblées sous forme de flashcards interactives (intervalles 1j, 6j, puis selon votre note de restitution de 0 à 5). Vous ancrez ainsi définitivement le vocabulaire formel C1/C2 et les pièges de grammaire dans votre mémoire à long terme.",
    category: "Technique",
  },
];

const CATEGORIES = [
  "Toutes",
  "NCLC & CRS",
  "Examen CBT",
  "Stratégie",
  "Général",
  "Technique",
] as const;

export function FaqSection({ initialFaqs }: { initialFaqs?: FaqItem[] }) {
  const faqs = initialFaqs && initialFaqs.length > 0 ? initialFaqs : DEFAULT_FAQS;
  const [selectedCategory, setSelectedCategory] = useState<string>("Toutes");
  const [searchQuery, setSearchQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory =
        selectedCategory === "Toutes" || faq.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [faqs, selectedCategory, searchQuery]);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="w-full py-16 sm:py-24 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(229,26,49,0.05),transparent_70%)]" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
            <CircleHelp className="h-3.5 w-3.5" />
            <span>Foire Aux Questions</span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground text-balance">
            Toutes les réponses pour réussir votre{" "}
            <span className="bg-gradient-to-r from-brand-crimson to-rose-500 bg-clip-text text-transparent">
              TCF & TEF Canada
            </span>
          </h2>

          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
            Lever les doutes réglementaires, comprendre les algorithmes de notation et maximiser vos chances de débloquer les 50 points d&apos;Entrée Express.
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div className="mt-8 sm:mt-10 space-y-4">
          {/* Search bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher une question (ex: NCLC 7, oral, validité...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 rounded-2xl bg-card/60 border-border/80 text-sm shadow-xs focus-visible:ring-primary/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                Effacer
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap pt-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all",
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground shadow-xs shadow-primary/25"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="mt-8 space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center">
              <CircleHelp className="h-8 w-8 text-muted-foreground/60 mx-auto mb-2" />
              <p className="text-sm font-semibold text-foreground">
                Aucune question trouvée pour &quot;{searchQuery}&quot;
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Essayez d&apos;autres termes ou réinitialisez les filtres.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("Toutes");
                }}
                className="mt-3 rounded-xl"
              >
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;

              return (
                <div
                  key={faq.id}
                  className={cn(
                    "overflow-hidden rounded-2xl border transition-all duration-200",
                    isOpen
                      ? "border-primary/40 bg-card/90 shadow-md shadow-primary/5 ring-1 ring-primary/20"
                      : "border-border/70 bg-card/50 hover:border-border hover:bg-card/75"
                  )}
                >
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="flex w-full items-center justify-between gap-4 p-4 sm:p-5 text-left transition-colors"
                    aria-expanded={isOpen}
                  >
                    <div className="space-y-1">
                      <span className="inline-block rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {faq.category}
                      </span>
                      <h3 className="font-display text-sm sm:text-base font-bold text-foreground">
                        {faq.question}
                      </h3>
                    </div>

                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-muted/60 transition-transform duration-200",
                        isOpen && "rotate-180 bg-primary/10 text-primary"
                      )}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="border-t border-border/50 px-4 pb-5 pt-3 sm:px-5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                          <p className="whitespace-pre-line">{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Concierge / Contact Helper Box */}
        <div className="mt-12 rounded-3xl border border-border/80 bg-gradient-to-r from-red-950/20 via-background to-card p-6 sm:p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-primary">
              <Sparkles className="h-4 w-4 text-brand-crimson" />
              <span>Assistance Directe</span>
            </div>
            <h4 className="font-display text-base sm:text-lg font-bold text-foreground">
              Vous avez une question spécifique sur votre profil CRS ?
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
              Nos experts pédagogiques certifiés examinateurs vous répondent et évaluent vos chances d&apos;atteindre le NCLC 7.
            </p>
          </div>

          <Button asChild className="rounded-full shrink-0 font-bold px-5 shadow-xs">
            <Link href="/contact" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Poser une question</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
