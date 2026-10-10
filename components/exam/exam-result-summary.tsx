"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  Printer,
  RotateCcw,
  Sparkles,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { crsBonusForNclc } from "@/lib/exam/scoring";
import {
  OPTION_KEYS,
  type AnswersMap,
  type ExamQuestion,
  type ExamResult,
} from "@/lib/exam/types";
import { cn } from "@/lib/utils";
import {
  createSrsCardFromMistake,
  addCardsToSrsVault,
  getSrsCardsFromVault,
  type SrsCard,
} from "@/lib/srs/sm2-algorithm";

interface ExamResultSummaryProps {
  result: ExamResult;
  questions: ExamQuestion[];
  answers: AnswersMap;
  onRestart: () => void;
  discipline?: "CE" | "CO";
  seriesId?: string;
}

type ReviewFilter = "all" | "errors" | "correct" | "flagged";

export function ExamResultSummary({
  result,
  questions,
  answers,
  onRestart,
  discipline = "CE",
  seriesId = "series-101",
}: ExamResultSummaryProps) {
  const crs = crsBonusForNclc(result.nclcLevel);
  const [filter, setFilter] = useState<ReviewFilter>("all");
  const [expandedDocs, setExpandedDocs] = useState<Record<string, boolean>>({});
  const [savedSrsIds, setSavedSrsIds] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const existing = getSrsCardsFromVault();
      const map: Record<string, boolean> = {};
      existing.forEach((item) => {
        // Associer par ID complet ou par ID de question
        map[item.id] = true;
        if (item.sourceExamId === seriesId || item.id.includes(seriesId)) {
          questions.forEach((q) => {
            if (item.id.includes(q.id) || item.questionPrompt === q.prompt) {
              map[q.id] = true;
            }
          });
        }
      });
      return map;
    } catch {
      // fallback
    }
    return {};
  });

  // Calculate Breakdown by CEFR Tiers
  const tierA = questions.slice(0, 12);
  const tierB = questions.slice(12, 28);
  const tierC = questions.slice(28, 39);

  const scoreA = tierA.reduce((acc, q) => acc + (answers[q.id]?.selected === q.correctOption ? 1 : 0), 0);
  const scoreB = tierB.reduce((acc, q) => acc + (answers[q.id]?.selected === q.correctOption ? 1 : 0), 0);
  const scoreC = tierC.reduce((acc, q) => acc + (answers[q.id]?.selected === q.correctOption ? 1 : 0), 0);

  const errors = questions.filter((q) => answers[q.id]?.selected !== q.correctOption);
  const correct = questions.filter((q) => answers[q.id]?.selected === q.correctOption);
  const flagged = questions.filter((q) => answers[q.id]?.flagged);

  const filteredQuestions = questions.filter((q) => {
    if (filter === "errors") return answers[q.id]?.selected !== q.correctOption;
    if (filter === "correct") return answers[q.id]?.selected === q.correctOption;
    if (filter === "flagged") return answers[q.id]?.flagged;
    return true;
  });

  const toggleDoc = (id: string) => {
    setExpandedDocs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSaveToSrs = (q: ExamQuestion) => {
    const picked = answers[q.id]?.selected;
    const card = createSrsCardFromMistake({
      id: `err-${discipline.toLowerCase()}-${seriesId}-${q.id}`,
      discipline: discipline,
      questionNumber: q.questionNumber,
      questionPrompt: q.prompt,
      documentSnippet: q.documentText ? q.documentText.slice(0, 200) : (q.audioTranscript ? q.audioTranscript.slice(0, 200) : undefined),
      candidateMistake: picked ? `${picked}. ${q.options[picked]}` : "Aucune réponse sélectionnée (Omis)",
      correctAnswer: `${q.correctOption}. ${q.options[q.correctOption]}`,
      ruleExplanation: q.explanation,
      trapType: q.trapAnalysis || "Distracteur officiel FEI",
      sourceExamId: seriesId,
    });

    addCardsToSrsVault([card]);
    setSavedSrsIds((prev) => ({ ...prev, [q.id]: true, [card.id]: true }));
  };

  const handleSyncAllErrorsToSrs = () => {
    const cardsToSave: SrsCard[] = errors.map((q) => {
      const picked = answers[q.id]?.selected;
      return createSrsCardFromMistake({
        id: `err-${discipline.toLowerCase()}-${seriesId}-${q.id}`,
        discipline: discipline,
        questionNumber: q.questionNumber,
        questionPrompt: q.prompt,
        documentSnippet: q.documentText ? q.documentText.slice(0, 200) : (q.audioTranscript ? q.audioTranscript.slice(0, 200) : undefined),
        candidateMistake: picked ? `${picked}. ${q.options[picked]}` : "Aucune réponse sélectionnée (Omis)",
        correctAnswer: `${q.correctOption}. ${q.options[q.correctOption]}`,
        ruleExplanation: q.explanation,
        trapType: q.trapAnalysis || "Distracteur officiel FEI",
        sourceExamId: seriesId,
      });
    });

    addCardsToSrsVault(cardsToSave);
    const updatedMap: Record<string, boolean> = { ...savedSrsIds };
    errors.forEach((q) => {
      updatedMap[q.id] = true;
      updatedMap[`err-${discipline.toLowerCase()}-${seriesId}-${q.id}`] = true;
    });
    setSavedSrsIds(updatedMap);
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 p-4 sm:p-8">
      {/* Official Score Banner */}
      <div className="rounded-3xl border bg-gradient-to-br from-card via-card to-primary/5 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b pb-6">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              <Award className="h-3.5 w-3.5" /> Bilan Officiel Simulé TCF Canada
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              Résultat : {discipline === "CO" ? "Compréhension Orale" : "Compréhension Écrite"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Simulation conforme à la matrice de pondération France Éducation International (FEI).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => window.print()} className="font-medium">
              <Printer className="mr-1.5 h-4 w-4" /> Imprimer le bilan
            </Button>
            <Button variant="outline" size="sm" onClick={onRestart} className="font-medium">
              <RotateCcw className="mr-1.5 h-4 w-4" /> Recommencer
            </Button>
          </div>
        </div>

        {/* 3 Main KPIs */}
        <div className="grid gap-4 sm:grid-cols-3 pt-6">
          <div className="rounded-2xl border bg-card p-5 shadow-2xs">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Score Brut
            </p>
            <p className="mt-2 font-display text-3xl sm:text-4xl font-black tabular-nums text-foreground">
              {result.rawScore} <span className="text-xl font-normal text-muted-foreground">/ {result.total}</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Taux d&apos;exactitude : {Math.round((result.rawScore / result.total) * 100)}%
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-2xs">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Score TCF Échelonné
            </p>
            <p className="mt-2 font-display text-3xl sm:text-4xl font-black tabular-nums text-primary">
              {result.tcfScaledScore} <span className="text-xl font-normal text-muted-foreground">/ 699</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Barème officiel FEI (100–699 pts)
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-5 shadow-2xs">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Équivalence NCLC
            </p>
            <p className="mt-2 font-display text-3xl sm:text-4xl font-black tabular-nums text-foreground">
              {result.nclcLevel ? `NCLC ${result.nclcLevel}` : "< NCLC 4"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {result.nclcLevel >= 7 ? "Seuil NCLC 7 atteint ✓" : "Sous le seuil NCLC 7"}
            </p>
          </div>
        </div>

        {/* Express Entry Immigration Callout */}
        <div
          className={cn(
            "mt-6 rounded-2xl border p-5 transition-colors",
            crs > 0
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-950 dark:text-emerald-200"
              : "border-amber-500/40 bg-amber-500/10 text-amber-950 dark:text-amber-200",
          )}
        >
          <div className="flex items-start gap-3">
            <Sparkles className={cn("mt-0.5 h-5 w-5 shrink-0", crs > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400")} />
            <div className="space-y-1">
              <p className="font-display font-bold text-base">
                {crs > 0
                  ? "🎉 Objectif Entrée Express Atteint : +50 Points CRS Débloqués !"
                  : "Attention : Niveau NCLC 7 Non Validé pour le Bonus Entrée Express"}
              </p>
              <p className="text-sm opacity-90 leading-relaxed">
                {crs > 0
                  ? "Avec un niveau NCLC 7 ou supérieur en Compréhension Écrite, vous maximisez votre capital de points pour le tirage des candidats francophones d'IRCC."
                  : "Pour maximiser vos chances d'extraction dans le bassin Entrée Express Canada (+50 à +62 points CRS), il est indispensable d'obtenir au minimum NCLC 7 (score TCF ≥ 453). Concentrez vos révisions sur les questions 19 à 28 (palier B2)."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown by CEFR Tier */}
      <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
        <h2 className="font-display text-lg font-bold">Performance par Palier CECRL & NCLC</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-muted/30 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span>Palier A1 – A2 (Q1–Q12)</span>
              <span className="font-mono">{scoreA} / 12</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${Math.round((scoreA / 12) * 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground">Fondations et compréhension usuelle</p>
          </div>

          <div className="rounded-xl border bg-muted/30 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span>Palier B1 – B2 (Q13–Q28)</span>
              <span className="font-mono">{scoreB} / 16</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${Math.round((scoreB / 16) * 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-primary font-medium">Seuil critique NCLC 7 Entrée Express</p>
          </div>

          <div className="rounded-xl border bg-muted/30 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span>Palier C1 – C2 (Q29–Q39)</span>
              <span className="font-mono">{scoreC} / 11</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-purple-500 transition-all duration-500"
                style={{ width: `${Math.round((scoreC / 11) * 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground">Nuances implicites & style complexe</p>
          </div>
        </div>
      </div>

      {/* SRS Sync & Error Vault Banner */}
      {errors.length > 0 && (
        <div className="rounded-3xl border border-primary/30 bg-gradient-to-r from-card via-card to-primary/10 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/15 text-primary border border-primary/20">
              <Sparkles className="h-3 w-3 text-primary" />
              <span>Ancrage Mémoriel Automatique (Ebbinghaus SM-2)</span>
            </div>
            <h3 className="font-display text-base sm:text-lg font-black text-foreground">
              {errors.length} erreur(s) archivée(s) dans votre Carnet d&apos;Erreurs SRS
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Chaque piège manqué est programmé pour votre première session de révision à <strong>J+1</strong>, puis <strong>J+3</strong> et <strong>J+7</strong> jusqu&apos;à ancrage définitif.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <Button
              size="sm"
              variant="outline"
              onClick={handleSyncAllErrorsToSrs}
              className="text-xs font-semibold gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5 text-primary" />
              <span>Synchroniser tout</span>
            </Button>

            <Button
              size="sm"
              asChild
              className="font-bold text-xs bg-primary hover:bg-primary/90 text-white gap-1.5 shadow-xs"
            >
              <Link href="/carnet-erreurs">
                <BookOpen className="h-3.5 w-3.5" />
                <span>Ouvrir le Carnet SRS</span>
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Review Section */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
          <div className="space-y-0.5">
            <h2 className="font-display text-xl font-bold">Correction Détaillée & Analyse des Pièges</h2>
            <p className="text-xs text-muted-foreground">
              Comprenez la logique des distracteurs pour ne plus jamais tomber dans les pièges de FEI.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                filter === "all" ? "bg-primary text-primary-foreground font-semibold" : "bg-muted text-muted-foreground hover:bg-muted/80",
              )}
            >
              Toutes ({questions.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("errors")}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                filter === "errors" ? "bg-red-500 text-white font-semibold" : "bg-muted text-muted-foreground hover:bg-muted/80",
              )}
            >
              Erreurs ({errors.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("correct")}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                filter === "correct" ? "bg-emerald-600 text-white font-semibold" : "bg-muted text-muted-foreground hover:bg-muted/80",
              )}
            >
              Réussies ({correct.length})
            </button>
            {flagged.length > 0 && (
              <button
                type="button"
                onClick={() => setFilter("flagged")}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  filter === "flagged" ? "bg-amber-500 text-white font-semibold" : "bg-muted text-muted-foreground hover:bg-muted/80",
                )}
              >
                Signalées ({flagged.length})
              </button>
            )}
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.map((q) => {
            const picked = answers[q.id]?.selected;
            const ok = picked === q.correctOption;
            const isExpanded = !!expandedDocs[q.id];
            const isSavedSrs = !!savedSrsIds[q.id];

            return (
              <article
                key={q.id}
                className={cn(
                  "space-y-4 rounded-2xl border bg-card p-5 sm:p-6 transition-all shadow-2xs",
                  ok ? "border-border/80" : "border-red-500/30 bg-red-500/[0.02]",
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {ok ? (
                      <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-500" aria-hidden />
                    ) : (
                      <XCircle className="mt-1 h-5 w-5 shrink-0 text-red-500" aria-hidden />
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-muted-foreground">
                          Question {q.questionNumber}
                        </span>
                        {q.nclcTargetLevel && (
                          <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                            NCLC {q.nclcTargetLevel}
                          </span>
                        )}
                      </div>
                      <p className="font-display font-semibold text-base sm:text-lg leading-snug">
                        {q.prompt}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Source Document Button */}
                  {q.documentText && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleDoc(q.id)}
                      className="shrink-0 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <FileText className="mr-1 h-3.5 w-3.5" />
                      {isExpanded ? "Masquer document" : "Voir document"}
                      {isExpanded ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />}
                    </Button>
                  )}
                </div>

                {/* Collapsible Document Preview */}
                {isExpanded && q.documentText && (
                  <div className="rounded-xl border bg-muted/40 p-4 text-sm font-sans whitespace-pre-line leading-relaxed text-foreground">
                    <p className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-2">
                      Document Source de l&apos;Épreuve :
                    </p>
                    {q.documentText}
                  </div>
                )}

                {/* Answers Comparison */}
                <div className="grid gap-2 sm:grid-cols-2 rounded-xl border bg-muted/20 p-3 text-sm">
                  <div className={cn("p-2 rounded-lg", !ok ? "bg-red-500/10 text-red-700 dark:text-red-400" : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400")}>
                    <span className="font-bold text-xs uppercase tracking-wider block">Votre Réponse :</span>
                    <span className="font-medium">
                      {picked ? `${picked}. ${q.options[picked]}` : "Aucune réponse sélectionnée"}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                    <span className="font-bold text-xs uppercase tracking-wider block">Bonne Réponse :</span>
                    <span className="font-medium">
                      {q.correctOption}. {q.options[q.correctOption]}
                    </span>
                  </div>
                </div>

                {/* Pedagogical Explanation */}
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Explication Pédagogique :
                  </span>
                  <p className="text-sm leading-relaxed text-foreground/90">{q.explanation}</p>
                </div>

                {/* Trap Analysis */}
                {q.trapAnalysis && (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-sm text-amber-900 dark:text-amber-200">
                    <span className="font-bold flex items-center gap-1.5 mb-1 text-amber-800 dark:text-amber-300">
                      ⚡ Décodage des Pièges FEI :
                    </span>
                    <p className="leading-relaxed">{q.trapAnalysis}</p>
                  </div>
                )}

                {/* Action button: Save to SRS carnet if missed */}
                {!ok && (
                  <div className="flex justify-end pt-1">
                    <Button
                      variant={isSavedSrs ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => handleSaveToSrs(q)}
                      disabled={isSavedSrs}
                      className={cn("text-xs font-semibold", isSavedSrs && "bg-emerald-500/15 text-emerald-600 border-emerald-500/30")}
                    >
                      <BookOpen className="mr-1.5 h-3.5 w-3.5" />
                      {isSavedSrs ? "Enregistré dans le Carnet d'Erreurs ✓" : "Ajouter au Carnet d'Erreurs (SRS)"}
                    </Button>
                  </div>
                )}
                <p className="sr-only">{OPTION_KEYS.length} options</p>
              </article>
            );
          })}
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-6">
        <Button variant="outline" onClick={onRestart}>
          <RotateCcw className="mr-2 h-4 w-4" aria-hidden /> Recommencer cette série 101
        </Button>
        <div className="flex items-center gap-3">
          <Button variant="secondary" asChild>
            <Link href="/carnet-erreurs">
              <BookOpen className="mr-1.5 h-4 w-4" /> Consulter mon Carnet d&apos;Erreurs
            </Link>
          </Button>
          <Button asChild>
            <Link href="/examens">Retour au catalogue d&apos;examens</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
