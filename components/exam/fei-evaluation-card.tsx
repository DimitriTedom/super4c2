"use client";

import React from "react";

import type { TaskEvaluation } from "@/lib/exam/written-types";
import { cn } from "@/lib/utils";

interface FeiEvaluationCardProps {
  evaluation: TaskEvaluation;
  className?: string;
}

export function FeiEvaluationCard({ evaluation, className }: FeiEvaluationCardProps) {
  const { criteria, taskScore, nclcEstimatedLevel, wordCount, generalFeedback } = evaluation;

  return (
    <div className={cn("space-y-6 rounded-2xl border bg-card p-6 shadow-sm", className)}>
      {/* Header avec Note globale */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Tâche {evaluation.taskNumber} — Rapport FEI
          </span>
          <h3 className="font-display text-xl font-bold text-foreground">
            Évaluation Détaillée de la Production
          </h3>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-muted-foreground block">Niveau Estimé</span>
            <span className="font-display text-base font-bold text-primary">
              NCLC {nclcEstimatedLevel}
            </span>
          </div>

          <div className="rounded-xl border bg-primary/10 px-4 py-2 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary block">
              Note Tâche
            </span>
            <span className="font-display text-2xl font-black text-primary tabular-nums">
              {taskScore} <span className="text-sm font-normal text-muted-foreground">/ 20</span>
            </span>
          </div>
        </div>
      </div>

      {/* Avis Général */}
      <div className="rounded-xl bg-muted/40 p-4 text-sm text-foreground/90 border">
        <p className="font-semibold text-foreground mb-1">Avis de l&apos;examinateur IA :</p>
        <p className="leading-relaxed">{generalFeedback}</p>
        <p className="mt-2 text-xs text-muted-foreground font-mono">
          Volume constaté : {wordCount} mots.
        </p>
      </div>

      {/* Les 4 Critères Officiels FEI */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Grille des 4 Critères France Éducation International (FEI) :
        </h4>

        <div className="grid gap-3 sm:grid-cols-2">
          {criteria.map((c) => {
            const pct = (c.score / 5) * 100;
            return (
              <div key={c.criterion} className="rounded-xl border bg-background p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">{c.label}</span>
                  <span className="font-mono text-sm font-bold text-primary tabular-nums">
                    {c.score} / 5
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-300",
                      c.score >= 4
                        ? "bg-emerald-500"
                        : c.score >= 3
                        ? "bg-cyan-500"
                        : "bg-amber-500"
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                  {c.feedback}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
