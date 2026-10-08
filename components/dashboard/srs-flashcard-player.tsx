"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  BookOpen,
  X,
  Volume2,
  Flame,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SrsCard,
  Sm2Rating,
  calculateNextSm2Review,
} from "@/lib/srs/sm2-algorithm";
import { motion, AnimatePresence } from "framer-motion";

interface SrsFlashcardPlayerProps {
  cards: SrsCard[];
  onComplete: (updatedCards: SrsCard[]) => void;
  onClose: () => void;
}

export function SrsFlashcardPlayer({
  cards,
  onComplete,
  onClose,
}: SrsFlashcardPlayerProps) {
  const [deck, setDeck] = useState<SrsCard[]>(cards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [sessionResults, setSessionResults] = useState<{
    reviewedCount: number;
    againCount: number;
    goodCount: number;
  }>({ reviewedCount: 0, againCount: 0, goodCount: 0 });
  const [isFinished, setIsFinished] = useState(false);

  const currentCard = deck[currentIndex];

  const handleGrade = useCallback(
    (rating: Sm2Rating) => {
      if (!currentCard) return;

      const updatedCard = calculateNextSm2Review(currentCard, rating);

      // Mettre à jour la carte dans le deck
      setDeck((prev) =>
        prev.map((c, i) => (i === currentIndex ? updatedCard : c))
      );

      // Statistiques de session
      setSessionResults((prev) => ({
        reviewedCount: prev.reviewedCount + 1,
        againCount: prev.againCount + (rating === 1 ? 1 : 0),
        goodCount: prev.goodCount + (rating >= 4 ? 1 : 0),
      }));

      // Passer à la carte suivante
      setIsRevealed(false);
      if (currentIndex + 1 < deck.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setIsFinished(true);
      }
    },
    [currentCard, currentIndex, deck.length]
  );

  // Gestion des raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFinished) return;

      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (!isRevealed) {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          setIsRevealed(true);
        }
      } else {
        if (e.key === "1") {
          e.preventDefault();
          handleGrade(1);
        } else if (e.key === "2") {
          e.preventDefault();
          handleGrade(3);
        } else if (e.key === "3") {
          e.preventDefault();
          handleGrade(4);
        } else if (e.key === "4") {
          e.preventDefault();
          handleGrade(5);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRevealed, isFinished, handleGrade, onClose]);

  if (isFinished) {
    return (
      <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full rounded-3xl border bg-card p-7 shadow-2xl text-center space-y-6"
        >
          <div className="mx-auto h-16 w-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
            <Award className="h-9 w-9" />
          </div>

          <div className="space-y-1.5">
            <h2 className="font-display text-2xl font-black text-foreground">
              Session Terminée avec Succès !
            </h2>
            <p className="text-xs text-muted-foreground">
              Toutes les flashcards dues aujourd&apos;hui ont été révisées selon l&apos;algorithme SM-2.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-2xl border bg-muted/30 p-3 text-center">
              <span className="text-muted-foreground block text-[11px]">Cartes révisées</span>
              <span className="font-display font-black text-xl text-foreground">
                {sessionResults.reviewedCount}
              </span>
            </div>
            <div className="rounded-2xl border bg-emerald-500/10 border-emerald-500/20 p-3 text-center">
              <span className="text-emerald-600 dark:text-emerald-400 block text-[11px]">Assimilation réussie</span>
              <span className="font-display font-black text-xl text-emerald-600 dark:text-emerald-400">
                {sessionResults.goodCount}
              </span>
            </div>
          </div>

          <Button
            className="w-full font-bold bg-primary hover:bg-primary/90 text-white shadow-md"
            onClick={() => {
              onComplete(deck);
              onClose();
            }}
          >
            Retourner au Carnet SRS
          </Button>
        </motion.div>
      </div>
    );
  }

  if (!currentCard) return null;

  const progressPercent = Math.round(((currentIndex) / deck.length) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6">
      {/* Top Bar */}
      <div className="w-full max-w-3xl flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
            <Flame className="h-3.5 w-3.5 text-primary" />
            Mode Entraînement SM-2
          </span>
          <span className="text-xs font-bold text-muted-foreground">
            Carte {currentIndex + 1} / {deck.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            title="Quitter la session (Échap)"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-3xl h-1.5 bg-muted rounded-full overflow-hidden my-2">
        <div
          className="h-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Center Interactive Flashcard */}
      <div className="w-full max-w-3xl flex-1 flex flex-col justify-center py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full rounded-3xl border bg-card p-6 sm:p-8 shadow-xl space-y-6"
          >
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary font-mono text-xs font-bold">
                  {currentCard.discipline} · Q{currentCard.questionNumber}
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  {currentCard.trapType}
                </span>
              </div>

              <div className="text-[11px] font-mono text-muted-foreground">
                Répétition #{currentCard.repetitions} · Facteur EF : {currentCard.easinessFactor}
              </div>
            </div>

            {/* Prompt & Document */}
            <div className="space-y-3">
              <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">
                {currentCard.questionPrompt}
              </h3>

              {currentCard.documentSnippet && (
                <div className="p-3.5 rounded-2xl bg-muted/40 border text-xs text-muted-foreground italic leading-relaxed">
                  « {currentCard.documentSnippet} »
                </div>
              )}
            </div>

            {/* Mistake Card */}
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 space-y-1">
              <div className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                <XCircle className="h-4 w-4" />
                Erreur commise lors du test :
              </div>
              <p className="text-xs text-foreground/90 font-medium">
                {currentCard.candidateMistake}
              </p>
            </div>

            {/* REVEALED SECTION (VERSO) */}
            {isRevealed ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-4 pt-2 border-t"
              >
                {/* Expected answer */}
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-1">
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    Bonne réponse & Formulation attendue :
                  </div>
                  <p className="text-xs text-foreground font-semibold">
                    {currentCard.correctAnswer}
                  </p>
                </div>

                {/* Explanation */}
                <div className="rounded-2xl bg-muted/50 p-4 text-xs space-y-1.5">
                  <div className="font-bold text-foreground flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-primary" />
                    Règle et Astuce Anti-Piège :
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {currentCard.ruleExplanation}
                  </p>
                </div>

                {/* SM-2 Grade Buttons */}
                <div className="pt-3 space-y-2">
                  <div className="text-center text-[11px] text-muted-foreground font-medium">
                    Comment évaluez-vous votre mémorisation ? (Touches 1, 2, 3, 4) :
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => handleGrade(1)}
                      className="p-3 rounded-2xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-all text-center space-y-0.5"
                    >
                      <div className="font-bold text-xs">[1] À revoir</div>
                      <div className="text-[10px] opacity-80">Revoir demain (1 j)</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleGrade(3)}
                      className="p-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 transition-all text-center space-y-0.5"
                    >
                      <div className="font-bold text-xs">[2] Difficile</div>
                      <div className="text-[10px] opacity-80">
                        +{Math.max(currentCard.intervalDays + 1, Math.round(currentCard.intervalDays * 1.2))} j
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleGrade(4)}
                      className="p-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-all text-center space-y-0.5"
                    >
                      <div className="font-bold text-xs">[3] Bon</div>
                      <div className="text-[10px] opacity-80">
                        +{Math.round(currentCard.intervalDays * currentCard.easinessFactor)} j
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleGrade(5)}
                      className="p-3 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 transition-all text-center space-y-0.5"
                    >
                      <div className="font-bold text-xs">[4] Facile</div>
                      <div className="text-[10px] opacity-80">
                        +{Math.round(currentCard.intervalDays * currentCard.easinessFactor * 1.3)} j
                      </div>
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="pt-2 text-center">
                <Button
                  size="lg"
                  onClick={() => setIsRevealed(true)}
                  className="w-full sm:w-auto px-8 font-bold bg-primary hover:bg-primary/90 text-white shadow-md gap-2"
                >
                  <span>Afficher la Réponse & Règle Anti-Piège</span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md font-mono">
                    Espace
                  </span>
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Hint */}
      <div className="w-full max-w-3xl flex items-center justify-between text-[11px] text-muted-foreground border-t pt-3">
        <span>Raccourcis : [Espace] Dévoiler · [1 à 4] Noter · [Échap] Quitter</span>
        <span>Algorithme SuperMemo-2 vérifié</span>
      </div>
    </div>
  );
}
