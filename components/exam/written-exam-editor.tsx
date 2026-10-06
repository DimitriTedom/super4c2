"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Clock, Send, RotateCcw, AlertTriangle, CheckCircle2, ChevronRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WordCountBadge } from "@/components/exam/word-count-badge";
import { FeiEvaluationCard } from "@/components/exam/fei-evaluation-card";
import { MagicRewriteViewer } from "@/components/exam/magic-rewrite-viewer";
import { countWordsFei, type WrittenExamResult, type WrittenExamSeries } from "@/lib/exam/written-types";
import { evaluateWrittenExam } from "@/lib/exam/written-evaluator";
import { formatClock } from "@/components/exam/exam-header";
import { cn } from "@/lib/utils";

interface WrittenExamEditorProps {
  series: WrittenExamSeries;
}

export function WrittenExamEditor({ series }: WrittenExamEditorProps) {
  const storageKey = `super4c2:written:${series.id}`;
  const [activeTaskIndex, setActiveTaskIndex] = useState<0 | 1 | 2>(0);
  const [texts, setTexts] = useState<[string, string, string]>(["", "", ""]);
  const [remaining, setRemaining] = useState<number>(series.durationSeconds);
  const [deadline, setDeadline] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [result, setResult] = useState<WrittenExamResult | null>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState<boolean>(false);
  const [hydrated, setHydrated] = useState<boolean>(false);
  const finishedRef = useRef<boolean>(false);

  // Hydratation localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.texts) setTexts(parsed.texts);
        if (parsed.activeTaskIndex !== undefined) setActiveTaskIndex(parsed.activeTaskIndex);
        if (parsed.deadline) setDeadline(parsed.deadline);
        if (parsed.isFinished) {
          setIsFinished(true);
          finishedRef.current = true;
          if (parsed.result) setResult(parsed.result);
        }
      } else {
        setDeadline(Date.now() + series.durationSeconds * 1000);
      }
    } catch {
      setDeadline(Date.now() + series.durationSeconds * 1000);
    }
    setHydrated(true);
  }, [storageKey, series.durationSeconds]);

  // Sauvegarde continue
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ texts, activeTaskIndex, deadline, isFinished, result })
      );
    } catch {
      // localStorage indisponible
    }
  }, [hydrated, storageKey, texts, activeTaskIndex, deadline, isFinished, result]);

  const handleSubmit = useCallback(() => {
    finishedRef.current = true;
    setIsFinished(true);
    const evalResult = evaluateWrittenExam(series, texts);
    setResult(evalResult);
  }, [series, texts]);

  // Décompte temps officiel
  useEffect(() => {
    if (!hydrated || isFinished) return;
    const tick = () => {
      const left = Math.max(0, Math.round((deadline - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0 && !finishedRef.current) {
        handleSubmit();
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [hydrated, isFinished, deadline, handleSubmit]);

  const handleTextChange = (value: string) => {
    if (isFinished) return;
    setTexts((prev) => {
      const next: [string, string, string] = [...prev];
      next[activeTaskIndex] = value;
      return next;
    });
  };

  const handleRestart = () => {
    localStorage.removeItem(storageKey);
    finishedRef.current = false;
    setTexts(["", "", ""]);
    setActiveTaskIndex(0);
    setIsFinished(false);
    setResult(null);
    setDeadline(Date.now() + series.durationSeconds * 1000);
  };

  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center font-display text-muted-foreground">
        Initialisation de la salle d&apos;examen...
      </div>
    );
  }

  const currentTask = series.tasks[activeTaskIndex];
  const currentText = texts[activeTaskIndex];
  const currentWordCount = countWordsFei(currentText);

  const urgent = remaining <= 300;
  const critical = remaining <= 60;

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Barre d'en-tête officielle CBT */}
      <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-card px-4 sm:px-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            TCF Canada — Expression Écrite
          </p>
          <h1 className="font-display text-base font-bold sm:text-lg truncate">{series.title}</h1>
        </div>

        {/* Minuteur strict */}
        <div
          role="timer"
          className={cn(
            "flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-xl font-bold tabular-nums transition-colors",
            urgent && "border-orange-500/50 bg-orange-500/10 text-orange-600",
            critical && "animate-pulse border-red-500/60 bg-red-500/10 text-red-600"
          )}
        >
          <Clock className="h-4 w-4" />
          {formatClock(remaining)}
        </div>

        <div>
          {!isFinished ? (
            <Button onClick={() => setIsSubmitOpen(true)} className="gap-2">
              <Send className="h-4 w-4" />
              Soumettre l&apos;épreuve
            </Button>
          ) : (
            <Button variant="outline" onClick={handleRestart} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Recommencer
            </Button>
          )}
        </div>
      </header>

      {/* Vue Résultats ou Vue Rédaction */}
      {isFinished && result ? (
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 max-w-5xl mx-auto w-full">
          {/* Bannière de synthèse */}
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

            {/* Impact Entrée Express */}
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

          {/* Débriefing tâche par tâche */}
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
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          {/* Sélecteur d'onglets des 3 tâches */}
          <div className="flex border-b bg-muted/40 px-6 py-2 gap-3 overflow-x-auto">
            {series.tasks.map((task, idx) => {
              const count = countWordsFei(texts[idx]);
              const active = activeTaskIndex === idx;
              return (
                <button
                  key={task.taskNumber}
                  type="button"
                  onClick={() => setActiveTaskIndex(idx as 0 | 1 | 2)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all select-none border",
                    active
                      ? "bg-card text-foreground border-primary shadow-sm"
                      : "bg-transparent text-muted-foreground border-transparent hover:bg-muted"
                  )}
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Tâche {task.taskNumber}</span>
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

          {/* Écran scindé : Sujet à gauche, Éditeur à droite */}
          <div className="grid min-h-0 flex-1 grid-cols-1 divide-y lg:grid-cols-2 lg:divide-x lg:divide-y-0">
            {/* Volet Gauche : Sujet Officiel */}
            <div className="min-h-0 overflow-y-auto bg-muted/20 p-6 sm:p-8 space-y-6">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  {currentTask.title}
                </span>
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Consigne & Documents
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
                <p>• Temps conseillé : ~{currentTask.suggestedDurationMinutes} minutes.</p>
                <p>• Le correcteur orthographique est volontairement désactivé pour simuler l&apos;examen réel.</p>
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

              {/* Textarea sécurisé sans correcteur automatique */}
              <textarea
                value={currentText}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Rédigez votre texte ici..."
                spellCheck={false}
                autoCorrect="off"
                autoCapitalize="sentences"
                className="flex-1 resize-none rounded-2xl border bg-card p-5 font-sans text-base leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />

              <div className="flex justify-between items-center text-xs text-muted-foreground pt-2">
                <span>Raccourcis : Sauvegarde automatique continue</span>
                {activeTaskIndex < 2 ? (
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
      )}

      {/* Dialogue de confirmation de soumission */}
      <Dialog open={isSubmitOpen} onOpenChange={setIsSubmitOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Soumettre votre épreuve d&apos;expression écrite ?</DialogTitle>
            <DialogDescription>
              L&apos;IA de Super4C2 va analyser vos 3 tâches selon les critères officiels de France Éducation International.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-3 text-sm">
            {series.tasks.map((task, i) => {
              const count = countWordsFei(texts[i]);
              const ok = count >= task.minWords && count <= task.maxWords;
              return (
                <div key={i} className="flex items-center justify-between rounded-lg border p-2.5">
                  <span className="font-medium">Tâche {task.taskNumber}</span>
                  <span
                    className={cn(
                      "font-mono text-xs font-bold",
                      ok ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600"
                    )}
                  >
                    {count} / {task.minWords}-{task.maxWords} mots {ok ? "✓" : "⚠"}
                  </span>
                </div>
              );
            })}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmitOpen(false)}>
              Continuer à écrire
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
    </div>
  );
}
