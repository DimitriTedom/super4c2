"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Clock,
  Send,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Sparkles,
  LogOut,
  Pause,
  Play,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WordCountBadge } from "@/components/exam/word-count-badge";
import { FeiEvaluationCard } from "@/components/exam/fei-evaluation-card";
import { MagicRewriteViewer } from "@/components/exam/magic-rewrite-viewer";
import {
  countWordsFei,
  type TaskEvaluation,
  type WrittenExamResult,
  type WrittenExamSeries,
} from "@/lib/exam/written-types";
import { evaluateWrittenExam, evaluateWrittenTask } from "@/lib/exam/written-evaluator";
import { formatClock } from "@/components/exam/exam-header";
import { triggerGlobalLoading } from "@/components/ui/top-body-loader";
import { CompanionPod } from "@/components/companions/companion-pod";
import { type CompanionId, DEFAULT_COMPANION_ID } from "@/lib/companions/data";
import { cn } from "@/lib/utils";

// Palette de caractères accentués et symboles — Conforme FEI & Objectif Canada
const LOWERCASE_CHARS = [
  "é", "è", "ê", "ë", "à", "â", "ç", "ô", "î", "ï", "ù", "û", "œ", "æ",
] as const;

const UPPERCASE_CHARS = [
  "É", "È", "Ê", "Ë", "À", "Â", "Ç", "Ô", "Î", "Ï", "Ù", "Û", "Œ", "Æ",
] as const;

const PUNCTUATION_CHARS = ["«", "»", "’", "€", "–", "…"] as const;

// Durées requises officielles par tâche en mode entraînement (en secondes)
const TASK_PRACTICE_DURATIONS: Record<0 | 1 | 2, number> = {
  0: 15 * 60, // Tâche 1 : 15 minutes (900s)
  1: 20 * 60, // Tâche 2 : 20 minutes (1200s)
  2: 25 * 60, // Tâche 3 : 25 minutes (1500s)
};

interface WrittenExamEditorProps {
  series: WrittenExamSeries;
  initialMode?: "exam" | "practice";
  initialTaskIndex?: 0 | 1 | 2;
}

export function WrittenExamEditor({
  series,
  initialMode = "exam",
  initialTaskIndex = 0,
}: WrittenExamEditorProps) {
  const [mode, setMode] = useState<"exam" | "practice">(initialMode);
  const storageKey = `super4c2:written:${series.id}:${mode}`;

  const [activeTaskIndex, setActiveTaskIndex] = useState<0 | 1 | 2>(initialTaskIndex);
  const [texts, setTexts] = useState<[string, string, string]>(["", "", ""]);
  const [isCapsActive, setIsCapsActive] = useState<boolean>(false);

  // Durée totale selon le mode
  const totalDuration =
    mode === "practice"
      ? TASK_PRACTICE_DURATIONS[activeTaskIndex]
      : series.durationSeconds; // 3600s = 60 min

  const [remaining, setRemaining] = useState<number>(totalDuration);
  const [deadline, setDeadline] = useState<number>(0);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);
  const [autoSubmitted, setAutoSubmitted] = useState<boolean>(false);

  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [result, setResult] = useState<WrittenExamResult | null>(null);
  const [practiceSingleResult, setPracticeSingleResult] = useState<TaskEvaluation | null>(null);

  const [isSubmitOpen, setIsSubmitOpen] = useState<boolean>(false);
  const [isExitOpen, setIsExitOpen] = useState<boolean>(false);
  const [hydrated, setHydrated] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  const [userCompanionId, setUserCompanionId] = useState<CompanionId>(DEFAULT_COMPANION_ID);

  const finishedRef = useRef<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialisation et hydratation depuis le localStorage
  useEffect(() => {
    try {
      const savedCompanion = localStorage.getItem("super4c2:user_companion") as CompanionId;
      if (savedCompanion) setUserCompanionId(savedCompanion);

      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.texts) setTexts(parsed.texts);
        if (parsed.activeTaskIndex !== undefined) setActiveTaskIndex(parsed.activeTaskIndex);
        if (parsed.deadline && parsed.deadline > Date.now()) {
          setDeadline(parsed.deadline);
          setRemaining(Math.max(0, Math.round((parsed.deadline - Date.now()) / 1000)));
        } else {
          setDeadline(Date.now() + totalDuration * 1000);
          setRemaining(totalDuration);
        }
        if (parsed.isFinished) {
          setIsFinished(true);
          finishedRef.current = true;
          if (parsed.result) setResult(parsed.result);
          if (parsed.practiceSingleResult) setPracticeSingleResult(parsed.practiceSingleResult);
          if (parsed.autoSubmitted) setAutoSubmitted(parsed.autoSubmitted);
        }
      } else {
        setDeadline(Date.now() + totalDuration * 1000);
        setRemaining(totalDuration);
      }
    } catch {
      setDeadline(Date.now() + totalDuration * 1000);
      setRemaining(totalDuration);
    }
    setHydrated(true);
  }, [storageKey, totalDuration]);

  // Sauvegarde continue avec télémétrie visuelle
  useEffect(() => {
    if (!hydrated) return;
    setSaveStatus("saving");

    const timer = setTimeout(() => {
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            texts,
            activeTaskIndex,
            deadline,
            isFinished,
            result,
            practiceSingleResult,
            autoSubmitted,
          })
        );
        const now = new Date();
        setLastSavedAt(
          now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
        );
        setSaveStatus("saved");
      } catch {
        setSaveStatus("saved");
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [
    hydrated,
    storageKey,
    texts,
    activeTaskIndex,
    deadline,
    isFinished,
    result,
    practiceSingleResult,
    autoSubmitted,
  ]);

  // Évaluation : Globale ou Tâche par Tâche
  const handleSubmit = useCallback(async () => {
    finishedRef.current = true;
    setIsFinished(true);
    setIsEvaluating(true);
    triggerGlobalLoading(true);

    if (mode === "practice") {
      // Évaluation ciblée de la tâche en cours
      const currentTask = series.tasks[activeTaskIndex];
      const currentText = texts[activeTaskIndex] || "";

      try {
        const response = await fetch("/api/ai/evaluate-written", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ seriesId: series.id, texts }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.ok && data.result?.taskEvaluations?.[activeTaskIndex]) {
            setPracticeSingleResult(data.result.taskEvaluations[activeTaskIndex]);
            setIsEvaluating(false);
            triggerGlobalLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Bascule sur le moteur FEI local pour tâche d'entraînement :", err);
      }

      const singleEval = evaluateWrittenTask({ task: currentTask, text: currentText });
      setPracticeSingleResult(singleEval);
      setIsEvaluating(false);
      triggerGlobalLoading(false);
      return;
    }

    // Mode Examen : Évaluation globale des 3 tâches
    try {
      const response = await fetch("/api/ai/evaluate-written", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seriesId: series.id, texts }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.ok && data.result) {
          setResult(data.result);
          setIsEvaluating(false);
          triggerGlobalLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Échec API, bascule sur le moteur FEI local :", err);
    }

    const evalResult = evaluateWrittenExam(series, texts);
    setResult(evalResult);
    setIsEvaluating(false);
    triggerGlobalLoading(false);
  }, [series, texts, mode, activeTaskIndex]);

  // Décompte officiel et soumission automatique à expiration
  useEffect(() => {
    if (!hydrated || isFinished || isTimerPaused) return;

    const tick = () => {
      const left = Math.max(0, Math.round((deadline - Date.now()) / 1000));
      setRemaining(left);

      if (left <= 0 && !finishedRef.current) {
        setAutoSubmitted(true);
        setIsSubmitOpen(false);
        handleSubmit();
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [hydrated, isFinished, deadline, isTimerPaused, handleSubmit]);

  const handleTextChange = (value: string) => {
    if (isFinished) return;
    setTexts((prev) => {
      const next: [string, string, string] = [...prev];
      next[activeTaskIndex] = value;
      return next;
    });
  };

  // Insertion de caractère à la position du curseur
  const insertSpecialCharacter = (char: string) => {
    if (isFinished) return;
    const textarea = textareaRef.current;
    const current = texts[activeTaskIndex] || "";

    if (!textarea) {
      handleTextChange(current + char);
      return;
    }

    const start = textarea.selectionStart ?? current.length;
    const end = textarea.selectionEnd ?? current.length;
    const updated = current.slice(0, start) + char + current.slice(end);
    handleTextChange(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + char.length, start + char.length);
    }, 0);
  };

  // Bascule Mode Examen <-> Mode Entraînement
  const handleToggleMode = () => {
    const nextMode = mode === "exam" ? "practice" : "exam";
    setMode(nextMode);
    finishedRef.current = false;
    setIsFinished(false);
    setResult(null);
    setPracticeSingleResult(null);
    setAutoSubmitted(false);
    setIsTimerPaused(false);

    const nextDuration =
      nextMode === "practice"
        ? TASK_PRACTICE_DURATIONS[activeTaskIndex]
        : series.durationSeconds;
    setRemaining(nextDuration);
    setDeadline(Date.now() + nextDuration * 1000);
  };

  // Changement de tâche en mode entraînement (recalibre le chrono sur le temps requis)
  const handleSelectPracticeTask = (index: 0 | 1 | 2) => {
    setActiveTaskIndex(index);
    if (mode === "practice") {
      const taskDuration = TASK_PRACTICE_DURATIONS[index];
      setRemaining(taskDuration);
      setDeadline(Date.now() + taskDuration * 1000);
      setIsTimerPaused(false);
      finishedRef.current = false;
      setIsFinished(false);
      setPracticeSingleResult(null);
    }
  };

  const handleRestart = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch {}
    finishedRef.current = false;
    setTexts(["", "", ""]);
    setIsFinished(false);
    setResult(null);
    setPracticeSingleResult(null);
    setAutoSubmitted(false);
    setIsTimerPaused(false);
    setRemaining(totalDuration);
    setDeadline(Date.now() + totalDuration * 1000);
  };

  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center font-display text-muted-foreground">
        Initialisation de la salle d&apos;examen CBT...
      </div>
    );
  }

  const currentTask = series.tasks[activeTaskIndex];
  const currentText = texts[activeTaskIndex] || "";
  const currentWordCount = countWordsFei(currentText);

  // Télémétrie d'urgence
  const urgent = remaining <= (mode === "practice" ? 180 : 300);
  const critical = remaining <= 60;
  const elapsedSeconds = Math.max(0, totalDuration - remaining);
  const progressPercent = Math.min(100, Math.max(0, (remaining / totalDuration) * 100));

  return (
    <div className="flex h-screen flex-col bg-background select-none">
      {/* 🏛️ BARRE D'EN-TÊTE OFFICIELLE CBT */}
      <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-card px-4 sm:px-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              TCF Canada — Expression Écrite
            </p>

            {/* Commutateur de Mode : Examen Strict vs Entraînement Tâche par Tâche */}
            <button
              type="button"
              onClick={handleToggleMode}
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all border shadow-2xs",
                mode === "practice"
                  ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/25"
                  : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 hover:bg-blue-500/20"
              )}
              title="Cliquer pour basculer entre le Mode Examen (60 min) et le Mode Entraînement Tâche par Tâche"
            >
              {mode === "practice" ? (
                <>
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  <span>Mode Entraînement (Tâche par Tâche)</span>
                </>
              ) : (
                <>
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <span>Mode Examen Blanc (60 min)</span>
                </>
              )}
            </button>
          </div>
          <h1 className="font-display text-base font-bold sm:text-lg truncate">{series.title}</h1>
        </div>

        {/* ⏱️ Minuteur numérique + Contrôles */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div
              role="timer"
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 sm:px-4 py-1.5 font-mono text-base sm:text-lg font-bold tabular-nums transition-colors shadow-2xs",
                isTimerPaused && "border-amber-500/50 bg-amber-500/10 text-amber-600",
                !isTimerPaused && urgent && "border-orange-500/50 bg-orange-500/10 text-orange-600",
                !isTimerPaused && critical && "animate-pulse border-red-500/60 bg-red-500/10 text-red-600",
                !isTimerPaused && !urgent && !critical && "border-border/80 bg-background text-foreground"
              )}
            >
              <Clock className="h-4 w-4" />
              <span>{isTimerPaused ? "PAUSE" : formatClock(remaining)}</span>
            </div>

            {/* Bouton Pause en mode entraînement */}
            {mode === "practice" && !isFinished && (
              <button
                type="button"
                onClick={() => setIsTimerPaused(!isTimerPaused)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border transition-all",
                  isTimerPaused
                    ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                title={isTimerPaused ? "Reprendre le chronomètre" : "Mettre en pause le chronomètre"}
              >
                {isTimerPaused ? <Play className="h-3.5 w-3.5 fill-current" /> : <Pause className="h-3.5 w-3.5" />}
              </button>
            )}
          </div>

          {/* Badge d'autosave continu */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-muted-foreground border rounded-full px-3 py-1 bg-muted/30">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                saveStatus === "saving" ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
              )}
            />
            <span className="font-mono text-[11px]">
              {saveStatus === "saving"
                ? "Sauvegarde..."
                : lastSavedAt
                ? `Sauvegardé à ${lastSavedAt}`
                : "Sauvegarde auto active"}
            </span>
          </div>
        </div>

        {/* Actions : Quitter & Soumettre */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExitOpen(true)}
            className="text-xs text-muted-foreground hover:text-foreground gap-1.5"
            title="Quitter la salle d'examen"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Quitter</span>
          </Button>

          {!isFinished ? (
            <Button onClick={() => setIsSubmitOpen(true)} className="gap-2">
              <Send className="h-4 w-4" />
              {mode === "practice" ? "Évaluer cette tâche" : "Soumettre l'épreuve"}
            </Button>
          ) : (
            <Button variant="outline" onClick={handleRestart} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Recommencer
            </Button>
          )}
        </div>
      </header>

      {/* 📊 BARRE DU TEMPS VISUELLE OFFICIELLE CBT */}
      {!isFinished && (
        <div className="relative w-full border-b bg-card">
          {/* Piste de progression du temps */}
          <div className="relative h-1.5 w-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-1000 ease-linear shadow-xs",
                remaining > totalDuration * 0.25
                  ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600"
                  : remaining > 60
                  ? "bg-gradient-to-r from-amber-500 to-orange-500"
                  : "bg-gradient-to-r from-red-600 to-rose-600 animate-pulse"
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Bandeau de télémétrie du temps */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-1 text-[11px] font-mono font-medium text-muted-foreground bg-muted/20">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "font-bold tabular-nums",
                  remaining <= 60
                    ? "text-red-600 animate-pulse"
                    : remaining <= totalDuration * 0.25
                    ? "text-amber-600"
                    : "text-foreground"
                )}
              >
                Temps restant : {formatClock(remaining)}
              </span>
              <span>•</span>
              <span>
                Écoulé : {formatClock(elapsedSeconds)} / {formatClock(totalDuration)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {mode === "practice" ? (
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30">
                  Tâche {activeTaskIndex + 1} ({Math.round(totalDuration / 60)} min conseillées)
                </span>
              ) : (
                <span className="text-[10px] text-muted-foreground">Épreuve globale (60 min)</span>
              )}
              <span className="tabular-nums font-semibold">{Math.round(progressPercent)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* ⚠️ BANDEAU SOUMISSION AUTOMATIQUE SI TEMPS ÉCOULÉ */}
      {autoSubmitted && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 text-center text-xs font-semibold text-amber-800 dark:text-amber-300 flex items-center justify-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
          <span>
            Temps écoulé ! Votre travail a été automatiquement soumis et évalué par l&apos;IA selon la grille officielle de France Éducation International.
          </span>
        </div>
      )}

      {/* Vue Résultats ou Vue Rédaction ou Évaluation en cours */}
      {isEvaluating ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 text-center space-y-6">
          <div className="relative flex items-center justify-center">
            <div className="absolute h-24 w-24 rounded-full bg-brand-crimson/15 animate-ping" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-crimson text-white shadow-xl shadow-brand-crimson/25">
              <Sparkles className="h-10 w-10 animate-pulse" />
            </div>
          </div>
          <div className="space-y-2 max-w-md">
            <h2 className="font-display text-2xl font-black text-foreground">
              Correction IA Officielle FEI en cours...
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {mode === "practice"
                ? `Analyse de votre Tâche ${activeTaskIndex + 1} selon la grille de France Éducation International et génération du modèle Magic Rewrite C1/C2.`
                : "Notre moteur analyse vos 3 tâches selon la grille officielle de France Éducation International et génère vos modèles Magic Rewrite C1/C2."}
            </p>
          </div>
          <div className="w-full max-w-sm rounded-xl border bg-card p-4 text-xs text-left space-y-2.5 text-muted-foreground shadow-xs">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="h-4 w-4" /> Comptage officiel des mots (norme FEI)
            </div>
            <div className="flex items-center gap-2 text-primary font-medium">
              <div className="h-2 w-2 rounded-full bg-primary animate-ping ml-1 mr-1" /> Évaluation syntaxique &amp; connecteurs logiques
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground ml-1.5 mr-1.5" /> Génération du Magic Rewrite C1/C2
            </div>
          </div>
        </div>
      ) : isFinished ? (
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 max-w-5xl mx-auto w-full">
          {mode === "practice" && practiceSingleResult ? (
            /* Bilan Tâche Unique (Mode Entraînement) */
            <div className="space-y-6">
              <div className="rounded-2xl border bg-card p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Bilan d&apos;Entraînement — Tâche {activeTaskIndex + 1}
                  </span>
                  <h2 className="font-display text-2xl font-black text-foreground mt-1">
                    {series.tasks[activeTaskIndex].title}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Temps imparti : {Math.round(TASK_PRACTICE_DURATIONS[activeTaskIndex] / 60)} min • Production : {practiceSingleResult.wordCount} mots
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-center px-4 py-2 rounded-xl bg-primary/10 border border-primary/20">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Note Tâche</p>
                    <p className="font-display text-3xl font-black text-primary">
                      {practiceSingleResult.taskScore} <span className="text-sm font-normal text-muted-foreground">/ 20</span>
                    </p>
                  </div>
                  <div className="text-center px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Niveau Estimé</p>
                    <p className="font-display text-3xl font-black text-emerald-600 dark:text-emerald-400">
                      NCLC {practiceSingleResult.nclcEstimatedLevel}
                    </p>
                  </div>
                </div>
              </div>

              <CompanionPod
                companionId={userCompanionId}
                contextTitle={`Débriefing • Tâche ${activeTaskIndex + 1}`}
                message={
                  practiceSingleResult.taskScore >= 14
                    ? `Félicitations ! Vous décrochez ${practiceSingleResult.taskScore}/20 (NCLC ${practiceSingleResult.nclcEstimatedLevel}). Votre maîtrise de cette tâche valide le palier requis pour les +50 points CRS. Observez la réécriture Magic Rewrite ci-dessous pour perfectionner vos connecteurs C1/C2 !`
                    : `Beau travail d'entraînement ! Vous obtenez ${practiceSingleResult.taskScore}/20. Pour franchir le seuil NCLC 7 (14/20), appliquez les formules modèles de la réécriture Magic Rewrite C1/C2 ci-dessous.`
                }
              />

              <FeiEvaluationCard evaluation={practiceSingleResult} />
              <MagicRewriteViewer
                originalText={texts[activeTaskIndex]}
                rewrittenText={practiceSingleResult.magicRewriteC2}
                highlights={practiceSingleResult.rewriteHighlights}
              />

              {/* Actions de navigation vers d'autres tâches */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t">
                <Button variant="outline" onClick={handleRestart} className="gap-2 w-full sm:w-auto">
                  <RotateCcw className="h-4 w-4" /> Réécrire cette Tâche
                </Button>

                <div className="flex gap-2 w-full sm:w-auto">
                  {activeTaskIndex < 2 ? (
                    <Button
                      onClick={() => handleSelectPracticeTask((activeTaskIndex + 1) as 0 | 1 | 2)}
                      className="gap-2 w-full sm:w-auto"
                    >
                      <span>Passer à la Tâche {activeTaskIndex + 2}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={handleToggleMode} className="gap-2 w-full sm:w-auto">
                      <span>Passer l&apos;Examen Blanc Complet (60 min)</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : result ? (
            /* Bilan Global des 3 Tâches (Mode Examen) */
            <>
              <div className="rounded-2xl border bg-card p-6 shadow-sm">
                <div className="grid gap-6 sm:grid-cols-3 text-center sm:text-left border-b pb-6">
                  <div>
                    <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                      Score Total EE
                    </p>
                    <p className="font-display text-4xl font-black text-primary mt-1">
                      {result.totalScore} <span className="text-lg font-normal text-muted-foreground">/ 20</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                      Score TCF Équivalent
                    </p>
                    <p className="font-display text-4xl font-black text-foreground mt-1">
                      {result.tcfScaledScore} <span className="text-lg font-normal text-muted-foreground">/ 699</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                      Échelon NCLC Décroché
                    </p>
                    <p className="font-display text-4xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                      NCLC {result.nclcLevel}
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">
                    {result.crsPointsUnlocked > 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="h-5 w-5" />
                        Félicitations ! Vous validez le palier NCLC 7 : +50 points bonus Entrée Express débloqués !
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                        <AlertTriangle className="h-5 w-5" />
                        Objectif NCLC 7 non atteint : visez une note de 14/20 pour débloquer les 50 points CRS.
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <CompanionPod
                companionId={userCompanionId}
                contextTitle="Débriefing Examen Blanc • Bilan des 3 Tâches"
                message={
                  result.totalScore >= 14
                    ? `Mission accomplie ! Avec ${result.totalScore}/20 (${result.tcfScaledScore} pts TCF), vous décrochez le palier NCLC ${result.nclcLevel} et débloquez l'intégralité des +50 points bonus Entrée Express !`
                    : `Session terminée avec ${result.totalScore}/20. Vous êtes tout près du seuil NCLC 7 (14/20). Consultez les modèles Magic Rewrite de chaque tâche ci-dessous pour repérer les tournures à renforcer.`
                }
              />

              {result.taskEvaluations.map((evalItem, idx) => (
                <div key={idx} className="space-y-6 pt-4">
                  <FeiEvaluationCard evaluation={evalItem} />
                  <MagicRewriteViewer
                    originalText={texts[idx]}
                    rewrittenText={evalItem.magicRewriteC2}
                    highlights={evalItem.rewriteHighlights}
                  />
                </div>
              ))}
            </>
          ) : null}
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          {/* 📑 SÉLECTEUR D'ONGLETS DES 3 TÂCHES */}
          <div className="flex items-center justify-between border-b bg-muted/40 px-4 sm:px-6 py-2 gap-3 overflow-x-auto">
            <div className="flex items-center gap-2">
              {series.tasks.map((task, idx) => {
                const count = countWordsFei(texts[idx] || "");
                const active = activeTaskIndex === idx;
                const reqMinutes = Math.round(TASK_PRACTICE_DURATIONS[idx as 0 | 1 | 2] / 60);

                return (
                  <button
                    key={task.taskNumber}
                    type="button"
                    onClick={() => {
                      if (mode === "practice") {
                        handleSelectPracticeTask(idx as 0 | 1 | 2);
                      } else {
                        setActiveTaskIndex(idx as 0 | 1 | 2);
                      }
                    }}
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all select-none border",
                      active
                        ? "bg-card text-foreground border-primary shadow-2xs"
                        : "bg-transparent text-muted-foreground border-transparent hover:bg-muted"
                    )}
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>Tâche {task.taskNumber}</span>
                    <span className="text-[10px] text-muted-foreground hidden sm:inline">
                      (~{reqMinutes}m)
                    </span>
                    <span
                      className={cn(
                        "font-mono text-[11px] rounded px-1.5 py-0.5",
                        count >= task.minWords && count <= task.maxWords
                          ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {count} mots
                    </span>
                  </button>
                );
              })}
            </div>

            {mode === "practice" && (
              <span className="text-[11px] text-amber-700 dark:text-amber-400 font-medium hidden md:inline-flex items-center gap-1">
                <HelpCircle className="h-3.5 w-3.5" />
                Mode Tâche par Tâche : évaluez chaque tâche séparément avec son temps requis
              </span>
            )}
          </div>

          {/* 🪟 ÉCRAN SCINDÉ : SUJET À GAUCHE, ÉDITEUR À DROITE */}
          <div className="grid min-h-0 flex-1 grid-cols-1 divide-y lg:grid-cols-2 lg:divide-x lg:divide-y-0">
            {/* Volet Gauche : Sujet Officiel */}
            <div className="min-h-0 overflow-y-auto bg-muted/20 p-6 sm:p-8 space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  {currentTask.title}
                </span>
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Consigne &amp; Documents
                </h2>
              </div>

              <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
                <div className="text-sm font-medium leading-relaxed whitespace-pre-line text-foreground">
                  {currentTask.topic}
                </div>
                {currentTask.context && (
                  <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 text-xs leading-relaxed text-amber-900 dark:text-amber-200">
                    <p className="font-bold mb-1">Rappel de méthode :</p>
                    {currentTask.context}
                  </div>
                )}
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>
                  • Temps requis : ~{Math.round(TASK_PRACTICE_DURATIONS[activeTaskIndex] / 60)} minutes
                  (calibrage officiel FEI).
                </p>
                <p>
                  • Volume obligatoire : entre {currentTask.minWords} et {currentTask.maxWords} mots.
                </p>
                <p>• Le correcteur orthographique automatique est désactivé conformément au poste d&apos;examen.</p>
              </div>
            </div>

            {/* Volet Droit : Zone de Rédaction */}
            <div className="flex min-h-0 flex-col p-6 sm:p-8 space-y-4 bg-background">
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-semibold text-foreground">
                  Votre production écrite :
                </span>
                <WordCountBadge
                  current={currentWordCount}
                  min={currentTask.minWords}
                  max={currentTask.maxWords}
                />
              </div>

              {/* ⌨️ CLAVIER VIRTUEL COMPLET (Conforme Objectif Canada & France Éducation International) */}
              <div className="p-2.5 rounded-xl border bg-muted/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Caractères Accentués (FEI) :
                    </span>
                    {/* Commutateur Majuscules / Minuscules */}
                    <button
                      type="button"
                      onClick={() => setIsCapsActive(!isCapsActive)}
                      className={cn(
                        "h-6 px-2 rounded-md border text-[10px] font-bold transition-all shadow-2xs select-none",
                        isCapsActive
                          ? "bg-primary text-white border-primary"
                          : "bg-card text-foreground hover:bg-muted"
                      )}
                      title="Basculer entre minuscules et majuscules (Caps)"
                    >
                      {isCapsActive ? "MAJ (Activé)" : "a / A"}
                    </button>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono hidden sm:inline">
                    Idéal pour claviers QWERTY
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1">
                  {/* Caractères selon casse active */}
                  {(isCapsActive ? UPPERCASE_CHARS : LOWERCASE_CHARS).map((char) => (
                    <button
                      key={char}
                      type="button"
                      onClick={() => insertSpecialCharacter(char)}
                      className="h-7 w-7 rounded-lg border bg-card text-xs font-semibold text-foreground hover:bg-primary hover:text-white hover:border-primary active:scale-95 transition-all shadow-2xs select-none"
                      title={`Insérer « ${char} »`}
                    >
                      {char}
                    </button>
                  ))}

                  {/* Ponctuation et symboles typographiques */}
                  <span className="h-4 w-px bg-border/80 mx-0.5" />
                  {PUNCTUATION_CHARS.map((char) => (
                    <button
                      key={char}
                      type="button"
                      onClick={() => insertSpecialCharacter(char)}
                      className="h-7 w-7 rounded-lg border bg-card text-xs font-semibold text-foreground hover:bg-primary hover:text-white hover:border-primary active:scale-95 transition-all shadow-2xs select-none"
                      title={`Insérer « ${char} »`}
                    >
                      {char}
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea sécurisé sans correcteur automatique */}
              <textarea
                ref={textareaRef}
                value={currentText}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Rédigez votre texte ici..."
                spellCheck={false}
                autoCorrect="off"
                autoCapitalize="sentences"
                className="flex-1 resize-none rounded-2xl border bg-card p-5 font-sans text-base leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />

              <div className="flex justify-between items-center text-xs text-muted-foreground pt-2">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full",
                      saveStatus === "saving" ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
                    )}
                  />
                  <span className="font-mono text-[11px]">
                    {saveStatus === "saving"
                      ? "Enregistrement en local..."
                      : lastSavedAt
                      ? `Sauvegardé à ${lastSavedAt}`
                      : "Sauvegarde automatique active"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {mode === "practice" ? (
                    <Button size="sm" onClick={() => setIsSubmitOpen(true)} className="gap-1.5">
                      <Send className="h-3.5 w-3.5" />
                      Évaluer la Tâche {activeTaskIndex + 1}
                    </Button>
                  ) : activeTaskIndex < 2 ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTaskIndex((activeTaskIndex + 1) as 1 | 2)}
                      className="gap-1"
                    >
                      Passer à la Tâche {activeTaskIndex + 2}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => setIsSubmitOpen(true)} className="gap-1">
                      Terminer et évaluer
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🛑 DIALOGUE DE CONFIRMATION DE SOUMISSION */}
      <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {mode === "practice"
                ? `Évaluer votre Tâche ${activeTaskIndex + 1} ?`
                : "Soumettre votre épreuve d'expression écrite ?"}
            </DialogTitle>
            <DialogDescription>
              {mode === "practice"
                ? "L'IA Super4C2 va analyser votre production selon les critères officiels de France Éducation International et générer votre modèle Magic Rewrite C1/C2."
                : "L'IA Super4C2 va analyser vos 3 tâches selon les critères officiels de France Éducation International."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-3 text-sm">
            {mode === "practice" ? (
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="font-medium">{series.tasks[activeTaskIndex].title}</span>
                <span
                  className={cn(
                    "font-mono text-xs font-bold",
                    currentWordCount >= series.tasks[activeTaskIndex].minWords &&
                      currentWordCount <= series.tasks[activeTaskIndex].maxWords
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-amber-600"
                  )}
                >
                  {currentWordCount} / {series.tasks[activeTaskIndex].minWords}-
                  {series.tasks[activeTaskIndex].maxWords} mots{" "}
                  {currentWordCount >= series.tasks[activeTaskIndex].minWords ? "✓" : "⚠"}
                </span>
              </div>
            ) : (
              series.tasks.map((task, i) => {
                const count = countWordsFei(texts[i] || "");
                const ok = count >= task.minWords && count <= task.maxWords;
                const empty = count === 0;

                return (
                  <div key={i} className="flex items-center justify-between rounded-lg border p-2.5">
                    <span className="font-medium">Tâche {task.taskNumber}</span>
                    <span
                      className={cn(
                        "font-mono text-xs font-bold",
                        empty
                          ? "text-muted-foreground"
                          : ok
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-amber-600"
                      )}
                    >
                      {empty
                        ? "Non rédigée (0 mot)"
                        : `${count} / ${task.minWords}-${task.maxWords} mots ${ok ? "✓" : "⚠"}`}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmitOpen(false)}>
              Continuer à rédiger
            </Button>
            <Button
              onClick={() => {
                setIsSubmitOpen(false);
                handleSubmit();
              }}
            >
              Confirmer et évaluer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 🚪 DIALOGUE DE CONFIRMATION DE SORTIE */}
      <Dialog open={isExitOpen} onOpenChange={setIsExitOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground font-display text-lg">
              <LogOut className="h-5 w-5 text-primary" />
              Quitter la salle d&apos;Expression Écrite ?
            </DialogTitle>
            <DialogDescription className="space-y-2 pt-2 text-sm leading-relaxed text-muted-foreground">
              <p>
                Vos brouillons et votre chronomètre sont <strong>sauvegardés automatiquement</strong> sur cet appareil.
              </p>
              <p>Vous pourrez reprendre cette session à tout moment depuis le catalogue.</p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-4">
            <Button variant="outline" onClick={() => setIsExitOpen(false)}>
              Poursuivre la rédaction
            </Button>
            <Button asChild variant="destructive">
              <Link href="/examens/demo-101-ce">Quitter la session</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
