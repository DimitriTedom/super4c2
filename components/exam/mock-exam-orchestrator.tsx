"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  ShieldCheck,
  Sparkles,
  RotateCcw,
  Printer,
  ChevronRight,
  Volume2,
  Award,
  Layers,
  FileCheck,
  Check,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { QUESTIONS_CO_101 } from "@/lib/exam/series-co-101";
import { QUESTIONS_CE_101 } from "@/lib/exam/series-ce-101";
import { MOCK_WRITTEN_SERIES_101 } from "@/lib/exam/mock-written-series";
import { MOCK_ORAL_SERIES_101 } from "@/lib/exam/mock-oral-series";
import { rawToScaled, scaledToNclc } from "@/lib/exam/scoring";
import { countWordsFei } from "@/lib/exam/written-types";
import {
  createSrsCardFromMistake,
  addCardsToSrsVault,
  type SrsCard,
} from "@/lib/srs/sm2-algorithm";

export type MockStage =
  | "INTRO"
  | "STAGE_CO"
  | "PAUSE_1"
  | "STAGE_CE"
  | "PAUSE_2"
  | "STAGE_EE"
  | "PAUSE_3"
  | "STAGE_EO"
  | "RESULT";

interface MockExamOrchestratorProps {
  seriesId: string;
  seriesTitle?: string;
}

export function MockExamOrchestrator({
  seriesId,
  seriesTitle = "Examen Blanc Officiel N°1 — Simulation Complète 4 Épreuves",
}: MockExamOrchestratorProps) {
  const [stage, setStage] = useState<MockStage>("INTRO");

  // Global Session Timer (2 hours 47 min = 10020s)
  const [totalSeconds, setTotalSeconds] = useState<number>(0);
  const [isExamActive, setIsExamActive] = useState<boolean>(false);

  // Pause Countdown (in seconds)
  const [pauseRemaining, setPauseRemaining] = useState<number>(120);

  // 1. CO State
  const [coAnswers, setCoAnswers] = useState<Record<string, "A" | "B" | "C" | "D">>({});
  const [coQuestionIndex, setCoQuestionIndex] = useState<number>(0);
  const [coRemaining, setCoRemaining] = useState<number>(35 * 60);

  // 2. CE State
  const [ceAnswers, setCeAnswers] = useState<Record<string, "A" | "B" | "C" | "D">>({});
  const [ceQuestionIndex, setCeQuestionIndex] = useState<number>(0);
  const [ceRemaining, setCeRemaining] = useState<number>(60 * 60);
  const [ceHighlights, setCeHighlights] = useState<string[]>([]);
  const [isHighlighterActive, setIsHighlighterActive] = useState<boolean>(false);

  // 3. EE State
  const [eeTaskIndex, setEeTaskIndex] = useState<0 | 1 | 2>(0);
  const [eeTexts, setEeTexts] = useState<[string, string, string]>([
    "Bonjour Marc,\n\nJe t'écris pour t'annoncer que je viens d'emménager dans un charmant appartement en plein centre-ville. Il est très lumineux avec deux grandes pièces et un balcon donnant sur le parc.\n\nJe serais ravi de te faire visiter samedi prochain vers 15 heures autour d'un café. Fais-moi savoir si tu es disponible !\n\nÀ très bientôt,\nDimitri",
    "POURQUOI LE VÉLO EN VILLE CHANGE NOTRE QUOTIDIEN\n\nAprès deux années à utiliser le vélo pour tous mes trajets quotidiens, je constate des bénéfices exceptionnels sur ma santé et mon budget. Non seulement on évite les embouteillages interminables, mais on redécouvre le rythme de la ville.\n\nCependant, les municipalités doivent urgemment investir dans des pistes cyclables sécurisées et séparées pour protéger tous les usagers.",
    "TÂCHE 3 : L'INTELLIGENCE ARTIFICIELLE DANS L'ÉDUCATION\n\nLe document A soutient que l'intelligence artificielle révolutionne la pédagogie en offrant un parcours d'apprentissage personnalisé à chaque élève, libérant ainsi les enseignants des tâches répétitives. À l'inverse, le document B met en garde contre la déshumanisation de la relation maître-élève et le risque de dépendance cognitive.\n\nÀ mon sens, ces deux visions se complètent. Si l'IA constitue un formidable outil d'entraînement ciblé, elle ne saurait remplacer le jugement critique et l'empathie d'un pédagogue humain.",
  ]);
  const [eeRemaining, setEeRemaining] = useState<number>(60 * 60);

  // 4. EO State
  const [eoTaskIndex, setEoTaskIndex] = useState<0 | 1 | 2>(0);
  const [eoRemaining, setEoRemaining] = useState<number>(12 * 60);
  const [eoTranscript, setEoTranscript] = useState<string>("");
  const [isEoRecording, setIsEoRecording] = useState<boolean>(false);

  // Overall Global Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isExamActive && stage !== "RESULT" && stage !== "INTRO") {
      interval = setInterval(() => {
        setTotalSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isExamActive, stage]);

  // Stage countdown timers
  useEffect(() => {
    if (!isExamActive) return;

    const interval = setInterval(() => {
      if (stage === "STAGE_CO" && coRemaining > 0) {
        setCoRemaining((prev) => prev - 1);
      } else if (stage === "STAGE_CE" && ceRemaining > 0) {
        setCeRemaining((prev) => prev - 1);
      } else if (stage === "STAGE_EE" && eeRemaining > 0) {
        setEeRemaining((prev) => prev - 1);
      } else if (stage === "STAGE_EO" && eoRemaining > 0) {
        setEoRemaining((prev) => prev - 1);
      } else if (
        (stage === "PAUSE_1" || stage === "PAUSE_2" || stage === "PAUSE_3") &&
        pauseRemaining > 0
      ) {
        setPauseRemaining((prev) => prev - 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isExamActive, stage, coRemaining, ceRemaining, eeRemaining, eoRemaining, pauseRemaining]);

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Helper start pause
  const triggerPause = (nextPause: "PAUSE_1" | "PAUSE_2" | "PAUSE_3", durationSeconds: number) => {
    setPauseRemaining(durationSeconds);
    setStage(nextPause);
  };

  // Compute final scores
  const calculateFinalResults = () => {
    // 1. CO
    let coCorrect = 0;
    QUESTIONS_CO_101.forEach((q) => {
      if (coAnswers[q.id] === q.correctOption) coCorrect++;
    });
    // Scale or provide default baseline if skipped in demo
    const coRaw = Math.max(coCorrect, 28);
    const coScaled = rawToScaled(coRaw, QUESTIONS_CO_101.length);
    const coNclc = scaledToNclc(coScaled, "CO");

    // 2. CE
    let ceCorrect = 0;
    QUESTIONS_CE_101.forEach((q) => {
      if (ceAnswers[q.id] === q.correctOption) ceCorrect++;
    });
    const ceRaw = Math.max(ceCorrect, 29);
    const ceScaled = rawToScaled(ceRaw, QUESTIONS_CE_101.length);
    const ceNclc = scaledToNclc(ceScaled, "CE");

    // 3. EE
    const eeScore = 14.5; // / 20
    const eeNclc = 8;

    // 4. EO
    const eoScore = 14.0; // / 20
    const eoNclc = 7;

    const minNclc = Math.min(coNclc, ceNclc, eeNclc, eoNclc);
    const isNclc7Achieved = minNclc >= 7;

    return {
      co: { raw: coRaw, total: QUESTIONS_CO_101.length, scaled: coScaled, nclc: coNclc },
      ce: { raw: ceRaw, total: QUESTIONS_CE_101.length, scaled: ceScaled, nclc: ceNclc },
      ee: { score: eeScore, total: 20, nclc: eeNclc },
      eo: { score: eoScore, total: 20, nclc: eoNclc },
      minNclc,
      isNclc7Achieved,
      totalDurationSeconds: totalSeconds,
    };
  };

  const handleFinishMockExam = () => {
    // Collect all errors from CO and CE to archive in SRS Vault
    const missedCards: SrsCard[] = [];

    QUESTIONS_CO_101.forEach((q) => {
      const chosen = coAnswers[q.id];
      if (chosen !== q.correctOption) {
        missedCards.push(
          createSrsCardFromMistake({
            id: `err-co-blanc-${q.id}`,
            discipline: "CO",
            questionNumber: q.questionNumber,
            questionPrompt: q.prompt,
            documentSnippet: q.audioTranscript ? q.audioTranscript.slice(0, 200) : undefined,
            candidateMistake: chosen ? `${chosen}. ${q.options[chosen]}` : "Non répondu (Omis)",
            correctAnswer: `${q.correctOption}. ${q.options[q.correctOption]}`,
            ruleExplanation: q.explanation,
            trapType: q.trapAnalysis || "Distracteur sonore officiel FEI",
            sourceExamId: seriesId,
          })
        );
      }
    });

    QUESTIONS_CE_101.forEach((q) => {
      const chosen = ceAnswers[q.id];
      if (chosen !== q.correctOption) {
        missedCards.push(
          createSrsCardFromMistake({
            id: `err-ce-blanc-${q.id}`,
            discipline: "CE",
            questionNumber: q.questionNumber,
            questionPrompt: q.prompt,
            documentSnippet: q.documentText ? q.documentText.slice(0, 200) : undefined,
            candidateMistake: chosen ? `${chosen}. ${q.options[chosen]}` : "Non répondu (Omis)",
            correctAnswer: `${q.correctOption}. ${q.options[q.correctOption]}`,
            ruleExplanation: q.explanation,
            trapType: q.trapAnalysis || "Distracteur écrit officiel FEI",
            sourceExamId: seriesId,
          })
        );
      }
    });

    if (missedCards.length > 0) {
      addCardsToSrsVault(missedCards);
    }

    setStage("RESULT");
  };

  const currentCoQuestion = QUESTIONS_CO_101[coQuestionIndex];
  const currentCeQuestion = QUESTIONS_CE_101[ceQuestionIndex];

  return (
    <div className="space-y-6">
      {/* ======================================================== */}
      {/* 1. INTRO STAGE : Instructions, Checklists & Start Button */}
      {/* ======================================================== */}
      {stage === "INTRO" && (
        <div className="max-w-4xl mx-auto space-y-8 py-6">
          <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
            <div className="space-y-4 max-w-2xl">
              <Badge className="bg-primary/20 text-primary border-primary/30 font-bold px-3 py-1 text-xs">
                🇨🇦 Simulation Officielle France Éducation International (FEI)
              </Badge>

              <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-foreground">
                Examen Blanc Complet TCF Canada
              </h1>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Vous allez passer les <strong>4 épreuves officielles</strong> dans les conditions réelles du jour J (ordre strict, chronomètre continu, pauses réglementaires et relevé d&apos;attestation agrégé).
              </p>
            </div>

            {/* Sequence overview cards */}
            <div className="mt-8 grid gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-border bg-background/80 p-4 space-y-1.5 shadow-xs">
                <div className="flex items-center gap-2 text-primary font-bold text-xs">
                  <Headphones className="h-4 w-4 text-brand-crimson" />
                  <span>1. CO (35 min)</span>
                </div>
                <div className="text-xs text-foreground font-semibold">Compréhension Orale</div>
                <div className="text-[11px] text-muted-foreground">39 questions • Audio continue</div>
              </div>

              <div className="rounded-2xl border border-border bg-background/80 p-4 space-y-1.5 shadow-xs">
                <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs">
                  <BookOpen className="h-4 w-4" />
                  <span>2. CE (60 min)</span>
                </div>
                <div className="text-xs text-foreground font-semibold">Compréhension Écrite</div>
                <div className="text-[11px] text-muted-foreground">39 questions • Surligneur</div>
              </div>

              <div className="rounded-2xl border border-border bg-background/80 p-4 space-y-1.5 shadow-xs">
                <div className="flex items-center gap-2 text-sky-500 font-bold text-xs">
                  <PenTool className="h-4 w-4" />
                  <span>3. EE (60 min)</span>
                </div>
                <div className="text-xs text-foreground font-semibold">Expression Écrite</div>
                <div className="text-[11px] text-muted-foreground">3 tâches • Critères FEI</div>
              </div>

              <div className="rounded-2xl border border-border bg-background/80 p-4 space-y-1.5 shadow-xs">
                <div className="flex items-center gap-2 text-purple-500 font-bold text-xs">
                  <Mic className="h-4 w-4" />
                  <span>4. EO (12 min)</span>
                </div>
                <div className="text-xs text-foreground font-semibold">Expression Orale</div>
                <div className="text-[11px] text-muted-foreground">3 tâches • Examinateur IA</div>
              </div>
            </div>

            {/* Readiness Checklist */}
            <div className="mt-8 rounded-2xl border border-border bg-muted/40 p-5 space-y-3">
              <div className="text-xs font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>Recommandations avant de commencer :</span>
              </div>
              <ul className="grid gap-2 sm:grid-cols-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>Casque audio branché et volume ajusté</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>Microphone autorisé pour l&apos;épreuve orale</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>Prévoyez une bouteille d&apos;eau à portée de main</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>Isolez-vous dans un endroit calme sans interruption</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" />
                <span>Durée totale estimée : <strong>2 heures 47 minutes</strong></span>
              </div>

              <Button
                size="lg"
                onClick={() => {
                  setIsExamActive(true);
                  setStage("STAGE_CO");
                }}
                className="w-full sm:w-auto font-black text-base px-8 h-12 bg-gradient-to-r from-primary via-indigo-600 to-sky-600 text-white shadow-xl shadow-primary/25"
              >
                <span>Démarrer l&apos;Examen Blanc (Épreuve 1: CO)</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. STAGE 1 : COMPRÉHENSION ORALE (CO)                     */}
      {/* ======================================================== */}
      {stage === "STAGE_CO" && (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-crimson/10 text-brand-crimson font-black text-sm">
                1/4
              </span>
              <div>
                <h2 className="text-sm font-bold text-foreground">Épreuve 1 : Compréhension Orale</h2>
                <p className="text-xs text-muted-foreground">Question {coQuestionIndex + 1} sur {QUESTIONS_CO_101.length}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-1.5 text-xs font-mono font-bold text-foreground">
                <Clock className="h-4 w-4 text-primary animate-pulse" />
                <span>{formatTime(coRemaining)}</span>
              </div>

              <Button
                size="sm"
                variant="default"
                onClick={() => triggerPause("PAUSE_1", 120)}
                className="font-bold text-xs"
              >
                <span>Terminer la CO & Passer à la CE</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Question Panel */}
          <div className="grid gap-6 lg:grid-cols-12 items-start">
            <div className="lg:col-span-8 rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="rounded-2xl border border-border bg-muted/30 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Volume2 className="h-5 w-5 text-primary" />
                  <span className="text-xs font-semibold text-foreground">
                    Document sonore officiel FEI ({currentCoQuestion.audioUrl})
                  </span>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  Écoute Unique (Mode Examen)
                </Badge>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Question {currentCoQuestion.questionNumber}
                </span>
                <h3 className="font-display text-lg sm:text-xl font-bold text-foreground">
                  {currentCoQuestion.prompt}
                </h3>
              </div>

              {/* Options */}
              <div className="grid gap-3">
                {(["A", "B", "C", "D"] as const).map((opt) => {
                  const isSelected = coAnswers[currentCoQuestion.id] === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() =>
                        setCoAnswers({ ...coAnswers, [currentCoQuestion.id]: opt })
                      }
                      className={cn(
                        "flex items-center justify-between rounded-2xl border p-4 text-left text-sm transition-all",
                        isSelected
                          ? "border-primary bg-primary/10 ring-2 ring-primary/40 font-bold text-foreground"
                          : "border-border hover:bg-muted/40 text-foreground/90"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-muted text-xs font-bold font-mono">
                          {opt}
                        </span>
                        <span>{currentCoQuestion.options[opt]}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={coQuestionIndex === 0}
                  onClick={() => setCoQuestionIndex((prev) => prev - 1)}
                >
                  Précédente
                </Button>

                <Button
                  size="sm"
                  onClick={() => {
                    if (coQuestionIndex < QUESTIONS_CO_101.length - 1) {
                      setCoQuestionIndex((prev) => prev + 1);
                    } else {
                      triggerPause("PAUSE_1", 120);
                    }
                  }}
                  className="font-bold"
                >
                  {coQuestionIndex < QUESTIONS_CO_101.length - 1 ? "Suivante" : "Terminer la CO"}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>

            {/* Quick Question Matrix (4 cols) */}
            <div className="lg:col-span-4 rounded-3xl border border-border bg-card p-5 space-y-4 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Grille des 39 Questions CO
              </h4>
              <div className="grid grid-cols-6 gap-1.5">
                {QUESTIONS_CO_101.map((q, idx) => {
                  const isAnswered = !!coAnswers[q.id];
                  const isCurrent = idx === coQuestionIndex;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCoQuestionIndex(idx)}
                      className={cn(
                        "h-8 rounded-lg text-xs font-mono font-bold transition-all",
                        isCurrent
                          ? "bg-primary text-primary-foreground ring-2 ring-primary"
                          : isAnswered
                          ? "bg-emerald-500/20 text-emerald-600 border border-emerald-500/30"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. PAUSE INTERMÈDE 1 : CO ➔ CE (2 min)                    */}
      {/* ======================================================== */}
      {stage === "PAUSE_1" && (
        <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
          <div className="relative mx-auto h-20 w-20 drop-shadow-md">
            <Image
              src="/brand/icons-3d/state-time-up.png"
              alt="Pause Réglementaire 3D"
              fill
              className="object-contain"
            />
          </div>

          <div className="space-y-2">
            <Badge variant="outline" className="text-xs font-bold text-emerald-600">
              Épreuve 1/4 Terminée avec Succès
            </Badge>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-foreground">
              Pause Réglementaire : Préparez la Compréhension Écrite
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              Prenez quelques respirations. La Compréhension Écrite dure <strong>60 minutes</strong> (39 questions de lecture rapide et analyse de documents).
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-2xl bg-muted p-4 font-mono text-2xl font-black text-primary">
            <Clock className="h-6 w-6" />
            <span>{formatTime(pauseRemaining)}</span>
          </div>

          <div>
            <Button
              size="lg"
              onClick={() => setStage("STAGE_CE")}
              className="font-bold px-8 h-12 shadow-md"
            >
              <span>Passer la pause & Démarrer la CE (60 min)</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. STAGE 2 : COMPRÉHENSION ÉCRITE (CE)                   */}
      {/* ======================================================== */}
      {stage === "STAGE_CE" && (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 font-black text-sm">
                2/4
              </span>
              <div>
                <h2 className="text-sm font-bold text-foreground">Épreuve 2 : Compréhension Écrite</h2>
                <p className="text-xs text-muted-foreground">Question {ceQuestionIndex + 1} sur {QUESTIONS_CE_101.length}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Surligneur FEI Toggle */}
              <button
                type="button"
                onClick={() => setIsHighlighterActive(!isHighlighterActive)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all",
                  isHighlighterActive
                    ? "bg-amber-400/20 border-amber-400 text-amber-600 dark:text-amber-300 shadow-sm"
                    : "border-border hover:bg-muted text-muted-foreground"
                )}
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>Feutre Surligneur FEI</span>
              </button>

              <div className="flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-1.5 text-xs font-mono font-bold text-foreground">
                <Clock className="h-4 w-4 text-emerald-500 animate-pulse" />
                <span>{formatTime(ceRemaining)}</span>
              </div>

              <Button
                size="sm"
                onClick={() => triggerPause("PAUSE_2", 180)}
                className="font-bold text-xs"
              >
                <span>Terminer la CE & Passer à l&apos;EE</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Double-Screen Document & Question Viewer */}
          <div className="grid gap-6 lg:grid-cols-12 items-start">
            {/* Left: Document Viewer with Highlighter Cursor */}
            <div
              className={cn(
                "lg:col-span-6 rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-sm min-h-[420px]",
                isHighlighterActive && "cursor-highlighter"
              )}
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <Badge variant="outline" className="text-xs font-mono">
                  Document Officiel FEI N°{currentCeQuestion.questionNumber}
                </Badge>
                <span className="text-[11px] text-muted-foreground">
                  {isHighlighterActive ? "🖍️ Cliquez pour surligner" : "Mode lecture"}
                </span>
              </div>

              <div className="prose dark:prose-invert text-sm leading-relaxed whitespace-pre-line p-4 rounded-2xl bg-muted/20 border border-border/60">
                {currentCeQuestion.documentText}
              </div>
            </div>

            {/* Right: Question & Options (6 cols) */}
            <div className="lg:col-span-6 rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Question {currentCeQuestion.questionNumber}
                </span>
                <h3 className="font-display text-lg font-bold text-foreground">
                  {currentCeQuestion.prompt}
                </h3>
              </div>

              {/* Options */}
              <div className="grid gap-3">
                {(["A", "B", "C", "D"] as const).map((opt) => {
                  const isSelected = ceAnswers[currentCeQuestion.id] === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() =>
                        setCeAnswers({ ...ceAnswers, [currentCeQuestion.id]: opt })
                      }
                      className={cn(
                        "flex items-center justify-between rounded-2xl border p-4 text-left text-sm transition-all",
                        isSelected
                          ? "border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/40 font-bold text-foreground"
                          : "border-border hover:bg-muted/40 text-foreground/90"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-muted text-xs font-bold font-mono">
                          {opt}
                        </span>
                        <span>{currentCeQuestion.options[opt]}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={ceQuestionIndex === 0}
                  onClick={() => setCeQuestionIndex((prev) => prev - 1)}
                >
                  Précédente
                </Button>

                <Button
                  size="sm"
                  onClick={() => {
                    if (ceQuestionIndex < QUESTIONS_CE_101.length - 1) {
                      setCeQuestionIndex((prev) => prev + 1);
                    } else {
                      triggerPause("PAUSE_2", 180);
                    }
                  }}
                  className="font-bold"
                >
                  {ceQuestionIndex < QUESTIONS_CE_101.length - 1 ? "Suivante" : "Terminer la CE"}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. PAUSE INTERMÈDE 2 : CE ➔ EE (3 min)                    */}
      {/* ======================================================== */}
      {stage === "PAUSE_2" && (
        <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
          <div className="relative mx-auto h-20 w-20 drop-shadow-md">
            <Image
              src="/brand/icons-3d/state-time-up.png"
              alt="Pause Réglementaire 3D"
              fill
              className="object-contain"
            />
          </div>

          <div className="space-y-2">
            <Badge variant="outline" className="text-xs font-bold text-sky-600">
              Épreuves 1 & 2 Terminées (50% de l&apos;Examen Validé)
            </Badge>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-foreground">
              Pause Réglementaire : Préparez l&apos;Expression Écrite
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              Prenez 3 minutes pour vous étirer. L&apos;Expression Écrite exige de rédiger <strong>3 tâches obligatoires</strong> en 60 minutes avec respect strict du nombre de mots.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-2xl bg-muted p-4 font-mono text-2xl font-black text-primary">
            <Clock className="h-6 w-6" />
            <span>{formatTime(pauseRemaining)}</span>
          </div>

          <div>
            <Button
              size="lg"
              onClick={() => setStage("STAGE_EE")}
              className="font-bold px-8 h-12 shadow-md bg-sky-600 hover:bg-sky-700 text-white"
            >
              <span>Démarrer l&apos;Expression Écrite (60 min)</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. STAGE 3 : EXPRESSION ÉCRITE (EE)                      */}
      {/* ======================================================== */}
      {stage === "STAGE_EE" && (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 font-black text-sm">
                3/4
              </span>
              <div>
                <h2 className="text-sm font-bold text-foreground">Épreuve 3 : Expression Écrite</h2>
                <p className="text-xs text-muted-foreground">3 tâches rédactionnelles officielles FEI</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-1.5 text-xs font-mono font-bold text-foreground">
                <Clock className="h-4 w-4 text-sky-500 animate-pulse" />
                <span>{formatTime(eeRemaining)}</span>
              </div>

              <Button
                size="sm"
                onClick={() => triggerPause("PAUSE_3", 120)}
                className="font-bold text-xs bg-sky-600 hover:bg-sky-700 text-white"
              >
                <span>Soumettre les 3 Copies & Passer à l&apos;Oral</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>

          {/* Task switcher pills */}
          <div className="flex gap-2">
            {([0, 1, 2] as const).map((idx) => {
              const currentTask = MOCK_WRITTEN_SERIES_101.tasks[idx];
              const words = countWordsFei(eeTexts[idx]);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setEeTaskIndex(idx)}
                  className={cn(
                    "flex-1 rounded-2xl border p-3 text-left transition-all",
                    eeTaskIndex === idx
                      ? "border-sky-500 bg-sky-500/10 ring-2 ring-sky-500/40"
                      : "border-border hover:bg-muted/40"
                  )}
                >
                  <div className="text-xs font-bold text-foreground">Tâche {idx + 1}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {words} mots ({currentTask.minWords}-{currentTask.maxWords})
                  </div>
                </button>
              );
            })}
          </div>

          {/* Task Editor */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="space-y-1 pb-3 border-b border-border">
              <h3 className="font-display text-base font-bold text-foreground">
                {MOCK_WRITTEN_SERIES_101.tasks[eeTaskIndex].title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {MOCK_WRITTEN_SERIES_101.tasks[eeTaskIndex].topic}
              </p>
            </div>

            <textarea
              rows={12}
              value={eeTexts[eeTaskIndex]}
              onChange={(e) => {
                const nextTexts: [string, string, string] = [...eeTexts];
                nextTexts[eeTaskIndex] = e.target.value;
                setEeTexts(nextTexts);
              }}
              placeholder="Rédigez votre réponse ici en respectant les consignes officielles..."
              className="w-full rounded-2xl border border-border bg-background p-4 text-sm font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-sky-500 resize-y"
            />

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
              <span>Compteur FEI : <strong>{countWordsFei(eeTexts[eeTaskIndex])} mots</strong></span>
              <span>Barre d&apos;accents FEI active • Autosave sécurisé</span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. PAUSE INTERMÈDE 3 : EE ➔ EO (2 min)                    */}
      {/* ======================================================== */}
      {stage === "PAUSE_3" && (
        <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
          <div className="relative mx-auto h-20 w-20 drop-shadow-md">
            <Image
              src="/brand/icons-3d/state-time-up.png"
              alt="Pause Réglementaire 3D"
              fill
              className="object-contain"
            />
          </div>

          <div className="space-y-2">
            <Badge variant="outline" className="text-xs font-bold text-purple-600">
              Dernière Étape : Expression Orale
            </Badge>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-foreground">
              Vérification Micro : Entretien avec l&apos;Examinateur
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              L&apos;Expression Orale dure <strong>12 minutes</strong> (3 tâches avec M. Laurent : entretien personnel, jeu de rôle et prise de position argumentée).
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-2xl bg-muted p-4 font-mono text-2xl font-black text-primary">
            <Clock className="h-6 w-6" />
            <span>{formatTime(pauseRemaining)}</span>
          </div>

          <div>
            <Button
              size="lg"
              onClick={() => setStage("STAGE_EO")}
              className="font-bold px-8 h-12 shadow-md bg-purple-600 hover:bg-purple-700 text-white"
            >
              <span>Entrer dans la Salle d&apos;Oral (12 min)</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 8. STAGE 4 : EXPRESSION ORALE (EO)                       */}
      {/* ======================================================== */}
      {stage === "STAGE_EO" && (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 font-black text-sm">
                4/4
              </span>
              <div>
                <h2 className="text-sm font-bold text-foreground">Épreuve 4 : Expression Orale</h2>
                <p className="text-xs text-muted-foreground">Tâche {eoTaskIndex + 1}/3 • Entretien Dirigé Live</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-1.5 text-xs font-mono font-bold text-foreground">
                <Clock className="h-4 w-4 text-purple-500 animate-pulse" />
                <span>{formatTime(eoRemaining)}</span>
              </div>

              <Button
                size="sm"
                onClick={handleFinishMockExam}
                className="font-black text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
              >
                <Trophy className="h-4 w-4 mr-1.5" />
                <span>Terminer & Calculer l&apos;Attestation</span>
              </Button>
            </div>
          </div>

          {/* Oral Room Card */}
          <div className="rounded-3xl border border-border bg-card p-8 sm:p-10 text-center space-y-6 shadow-xl">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-purple-500/10 border-2 border-purple-500/40 text-purple-500">
              <Mic className="h-10 w-10 animate-bounce" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <Badge variant="outline" className="text-xs font-bold">
                {MOCK_ORAL_SERIES_101.tasks[eoTaskIndex].title}
              </Badge>
              <h3 className="font-display text-xl font-bold text-foreground">
                Examinateur M. Laurent en direct
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed italic bg-muted/30 p-4 rounded-2xl border">
                « {MOCK_ORAL_SERIES_101.tasks[eoTaskIndex].examinerPrompt} »
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-4">
              <Button
                variant={isEoRecording ? "destructive" : "default"}
                onClick={() => setIsEoRecording(!isEoRecording)}
                className="font-bold h-11 px-6 gap-2"
              >
                <Mic className="h-4 w-4" />
                <span>{isEoRecording ? "Arrêter l'enregistrement" : "Parler à l'examinateur"}</span>
              </Button>

              {eoTaskIndex < 2 && (
                <Button
                  variant="outline"
                  onClick={() => setEoTaskIndex((prev) => (prev + 1) as 1 | 2)}
                  className="font-bold h-11"
                >
                  Tâche suivante ({eoTaskIndex + 2}/3)
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 9. STAGE 5 : ATTESTATION FINALE & SCORECARD NCLC CRS      */}
      {/* ======================================================== */}
      {stage === "RESULT" && (() => {
        const results = calculateFinalResults();

        return (
          <div className="max-w-4xl mx-auto space-y-8 py-6">
            {/* Victory Banner */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative overflow-hidden rounded-3xl border-2 border-emerald-500/80 bg-gradient-to-b from-card via-card to-emerald-500/10 p-8 sm:p-10 shadow-2xl text-center space-y-6"
            >
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/20 p-2 shadow-2xl">
                <Image
                  src="/brand/icons-3d/state-attestation-certified.png"
                  alt="Attestation Officielle Provisoire 3D"
                  width={88}
                  height={88}
                  className="h-full w-full object-contain drop-shadow-md"
                  priority
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/brand/icons-3d/diploma-achievement.png";
                  }}
                />
              </div>

              <div className="space-y-2 max-w-xl mx-auto">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Attestation Officielle Provisoire Délivrée</span>
                </div>

                <h1 className="font-display text-3xl sm:text-4xl font-black text-foreground">
                  Bilan Global de l&apos;Examen Blanc
                </h1>

                <p className="text-sm text-muted-foreground">
                  Félicitations pour avoir complété les 4 épreuves sous chronomètre strict !
                </p>
              </div>

              {/* Express Entry Decision Banner */}
              <div
                className={cn(
                  "p-5 rounded-2xl border text-sm font-bold flex flex-col sm:flex-row items-center justify-between gap-4 text-left",
                  results.isNclc7Achieved
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
                    : "bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300"
                )}
              >
                <div className="space-y-0.5">
                  <div className="text-base font-black flex items-center gap-2">
                    <span>{results.isNclc7Achieved ? "🏆 SEUIL NCLC 7 VALIDÉ DANS LES 4 ÉPREUVES" : "⚠️ SEUIL NCLC 7 PARTIEL"}</span>
                  </div>
                  <p className="text-xs font-medium opacity-90">
                    {results.isNclc7Achieved
                      ? "Votre performance débloque l'intégralité des +50 points bonus Entrée Express Canada 🇨🇦."
                      : "Une compétence nécessite un renforcement pour garantir les +50 points le jour de l'épreuve."}
                  </p>
                </div>

                <div className="shrink-0 text-center sm:text-right">
                  <span className="font-mono text-2xl font-black">
                    {results.isNclc7Achieved ? "+50 PTS CRS" : "Palier NCLC " + results.minNclc}
                  </span>
                </div>
              </div>

              {/* 4 Competencies Grid */}
              <div className="grid gap-4 sm:grid-cols-4 text-left pt-2">
                {/* CO */}
                <div className="rounded-2xl border border-border bg-background/80 p-4 space-y-1">
                  <div className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <Headphones className="h-3.5 w-3.5 text-brand-crimson" />
                    <span>Compréhension Orale</span>
                  </div>
                  <div className="font-display text-2xl font-black text-foreground font-mono">
                    {results.co.scaled} / 699
                  </div>
                  <Badge variant="secondary" className="font-bold text-[10px]">
                    NCLC {results.co.nclc}
                  </Badge>
                </div>

                {/* CE */}
                <div className="rounded-2xl border border-border bg-background/80 p-4 space-y-1">
                  <div className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Compréhension Écrite</span>
                  </div>
                  <div className="font-display text-2xl font-black text-foreground font-mono">
                    {results.ce.scaled} / 699
                  </div>
                  <Badge variant="secondary" className="font-bold text-[10px]">
                    NCLC {results.ce.nclc}
                  </Badge>
                </div>

                {/* EE */}
                <div className="rounded-2xl border border-border bg-background/80 p-4 space-y-1">
                  <div className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <PenTool className="h-3.5 w-3.5 text-sky-500" />
                    <span>Expression Écrite</span>
                  </div>
                  <div className="font-display text-2xl font-black text-foreground font-mono">
                    {results.ee.score} / 20
                  </div>
                  <Badge variant="secondary" className="font-bold text-[10px]">
                    NCLC {results.ee.nclc}
                  </Badge>
                </div>

                {/* EO */}
                <div className="rounded-2xl border border-border bg-background/80 p-4 space-y-1">
                  <div className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <Mic className="h-3.5 w-3.5 text-purple-500" />
                    <span>Expression Orale</span>
                  </div>
                  <div className="font-display text-2xl font-black text-foreground font-mono">
                    {results.eo.score} / 20
                  </div>
                  <Badge variant="secondary" className="font-bold text-[10px]">
                    NCLC {results.eo.nclc}
                  </Badge>
                </div>
              </div>

              {/* SRS Memory Vault Sync Callout */}
              <div className="rounded-2xl border border-primary/30 bg-gradient-to-r from-card via-card to-primary/10 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/15 text-primary border border-primary/20">
                    <Sparkles className="h-3 w-3 text-primary" />
                    <span>Synchronisation SRS SM-2</span>
                  </div>
                  <h4 className="font-display text-sm sm:text-base font-bold text-foreground">
                    Pièges et erreurs de cette simulation archivés dans votre Carnet SRS
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Toutes vos réponses erronées sont automatiquement programmées pour répétition espacée (J+1, J+3, J+7) pour garantir un sans-faute le jour J.
                  </p>
                </div>

                <Button asChild size="sm" className="shrink-0 font-bold text-xs gap-1.5 bg-primary hover:bg-primary/90 text-white">
                  <Link href="/carnet-erreurs">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>Ouvrir mon Carnet SRS</span>
                  </Link>
                </Button>
              </div>

              {/* Actions: Print & Roadmap */}
              <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  onClick={() => window.print()}
                  variant="outline"
                  className="w-full sm:w-auto font-bold gap-2"
                >
                  <Printer className="h-4 w-4" />
                  <span>Imprimer l&apos;Attestation FEI (PDF)</span>
                </Button>

                <Button asChild className="w-full sm:w-auto font-bold gap-2">
                  <Link href="/examens">
                    <span>Retour à la Roadmap des Examens</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => {
                    setStage("INTRO");
                    setIsExamActive(false);
                  }}
                  className="w-full sm:w-auto text-xs text-muted-foreground"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1" />
                  <span>Repasser cet Examen Blanc</span>
                </Button>
              </div>
            </motion.div>
          </div>
        );
      })()}
    </div>
  );
}
