"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";
import type { OralExamEvaluation } from "@/lib/exam/oral-types";
import { cn } from "@/lib/utils";

interface OralDebriefCardProps {
  evaluation: OralExamEvaluation;
  className?: string;
}

export function OralDebriefCard({ evaluation, className }: OralDebriefCardProps) {
  const { totalScore, tcfScaledScore, nclcLevel, crsPointsUnlocked, wordsPerMinute, criteria, examinerDebrief, recommendedPhrasesC2 } = evaluation;

  return (
    <div className={cn("space-y-8 rounded-2xl border bg-card p-6 sm:p-8 shadow-sm", className)}>
      {/* Header des scores */}
      <div className="border-b pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Bilan Officiel de l&apos;Épreuve Orale
        </span>
        <h2 className="font-display text-2xl font-black text-foreground mt-1">
          Rapport d&apos;Évaluation de l&apos;Examinateur FEI
        </h2>

        <div className="grid gap-4 sm:grid-cols-4 mt-6">
          <div className="rounded-xl border bg-primary/5 p-4 text-center">
            <span className="text-[10px] uppercase font-bold tracking-wider text-primary block">
              Note Globale
            </span>
            <span className="font-display text-3xl font-black text-primary tabular-nums">
              {totalScore} <span className="text-sm font-normal text-muted-foreground">/ 20</span>
            </span>
          </div>

          <div className="rounded-xl border bg-muted/40 p-4 text-center">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">
              Score TCF
            </span>
            <span className="font-display text-3xl font-black text-foreground tabular-nums">
              {tcfScaledScore} <span className="text-sm font-normal text-muted-foreground">/ 699</span>
            </span>
          </div>

          <div className="rounded-xl border bg-muted/40 p-4 text-center">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">
              Niveau NCLC
            </span>
            <span className="font-display text-3xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
              NCLC {nclcLevel}
            </span>
          </div>

          <div className="rounded-xl border bg-muted/40 p-4 text-center">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">
              Débit Moyen
            </span>
            <span className="font-display text-3xl font-black text-foreground tabular-nums">
              {wordsPerMinute} <span className="text-xs font-normal text-muted-foreground">mots/min</span>
            </span>
          </div>
        </div>

        {/* Message CRS */}
        <div className="mt-4 pt-4 border-t flex items-center justify-between">
          {crsPointsUnlocked > 0 ? (
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-5 w-5" />
              Palier NCLC 7 validé à l&apos;oral : vos +50 points bonus Entrée Express sont acquis !
            </p>
          ) : (
            <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="h-5 w-5" />
              NCLC {nclcLevel} : Visez une note de 14/20 pour débloquer les 50 points d&apos;Entrée Express.
            </p>
          )}
        </div>
      </div>

      {/* Avis de l'examinateur */}
      <div className="rounded-xl border bg-muted/30 p-5 space-y-2">
        <p className="font-display text-sm font-bold text-foreground">
          Avis Pédagogique de l&apos;Examinateur :
        </p>
        <p className="text-sm text-foreground/90 leading-relaxed">{examinerDebrief}</p>
      </div>

      {/* Grille des 5 critères FEI */}
      <div className="space-y-4">
        <h3 className="font-display text-base font-bold text-foreground">
          Détail des 5 Critères d&apos;Évaluation Officiels :
        </h3>

        <div className="grid gap-3 sm:grid-cols-2">
          {criteria.map((c) => {
            const pct = (c.score / 4) * 100;
            return (
              <div key={c.criterion} className="rounded-xl border bg-background p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">{c.label}</span>
                  <span className="font-mono text-sm font-bold text-primary tabular-nums">
                    {c.score} / 4
                  </span>
                </div>

                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-300",
                      c.score >= 3.2 ? "bg-emerald-500" : c.score >= 2.5 ? "bg-cyan-500" : "bg-amber-500"
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed pt-1">{c.feedback}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommandations C1/C2 */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 space-y-3">
        <div className="flex items-center gap-2 text-primary font-bold text-sm">
          <Sparkles className="h-4 w-4" />
          <span>Tournures Recommandées pour Sublimer votre Oral (Niveau C1/C2) :</span>
        </div>

        <ul className="grid gap-2 sm:grid-cols-2 text-xs text-foreground/90">
          {recommendedPhrasesC2.map((phrase, i) => (
            <li key={i} className="flex items-start gap-2 bg-card p-3 rounded-lg border">
              <span className="text-primary font-bold">•</span>
              <span className="font-medium">{phrase}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
