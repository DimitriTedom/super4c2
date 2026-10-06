"use client";

import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { crsBonusForNclc } from "@/lib/exam/scoring";
import {
  OPTION_KEYS,
  type AnswersMap,
  type ExamQuestion,
  type ExamResult,
} from "@/lib/exam/types";
import { cn } from "@/lib/utils";

interface ExamResultSummaryProps {
  result: ExamResult;
  questions: ExamQuestion[];
  answers: AnswersMap;
  onRestart: () => void;
}

export function ExamResultSummary({
  result,
  questions,
  answers,
  onRestart,
}: ExamResultSummaryProps) {
  const crs = crsBonusForNclc(result.nclcLevel);
  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 overflow-y-auto p-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Score brut" value={`${result.rawScore} / ${result.total}`} />
        <Stat label="Score TCF estimé" value={`${result.tcfScaledScore} / 699`} />
        <Stat
          label="Niveau NCLC"
          value={result.nclcLevel ? `NCLC ${result.nclcLevel}` : "< NCLC 4"}
          accent
        />
      </div>

      <p
        className={cn(
          "rounded-xl border p-4 text-sm font-medium",
          crs > 0
            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
            : "bg-muted text-muted-foreground",
        )}
      >
        {crs > 0
          ? `+${crs} points CRS Entrée Express débloqués grâce au niveau NCLC 7+ !`
          : "Visez NCLC 7 pour débloquer +50 points CRS Entrée Express."}
      </p>

      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold">Correction détaillée</h2>
        {questions.map((q) => {
          const picked = answers[q.id]?.selected;
          const ok = picked === q.correctOption;
          return (
            <article key={q.id} className="space-y-3 rounded-xl border bg-card p-5">
              <div className="flex items-start gap-3">
                {ok ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" aria-hidden />
                ) : (
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" aria-hidden />
                )}
                <div className="space-y-1">
                  <p className="font-semibold">
                    {q.questionNumber}. {q.prompt}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Votre réponse : {picked ? `${picked}. ${q.options[picked]}` : "aucune"} · Bonne
                    réponse : {q.correctOption}. {q.options[q.correctOption]}
                  </p>
                </div>
              </div>
              <p className="text-sm">{q.explanation}</p>
              {q.trapAnalysis && (
                <p className="rounded-lg bg-amber-500/10 p-3 text-sm text-amber-800 dark:text-amber-300">
                  <span className="font-semibold">Pièges : </span>
                  {q.trapAnalysis}
                </p>
              )}
              <p className="sr-only">{OPTION_KEYS.length} propositions</p>
            </article>
          );
        })}
      </div>

      <Button variant="outline" onClick={onRestart}>
        <RotateCcw className="mr-2 h-4 w-4" aria-hidden /> Recommencer la série
      </Button>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 font-display text-3xl font-extrabold tabular-nums",
          accent && "text-primary",
        )}
      >
        {value}
      </p>
    </div>
  );
}
