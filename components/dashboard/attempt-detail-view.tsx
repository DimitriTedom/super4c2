"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Award,
  Download,
  FileText,
  Loader2,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getAttemptDate,
  getDisciplineMeta,
  getTaskEvaluations,
  parseAnswers,
  type UserAttemptFull,
} from "@/lib/dashboard/attempt-utils";
import { exportAttemptPdf } from "@/lib/dashboard/attempt-export";

interface AttemptDetailViewProps {
  attempt: UserAttemptFull;
  isDemo?: boolean;
}

export function AttemptDetailView({ attempt, isDemo = false }: AttemptDetailViewProps) {
  const [activeTab, setActiveTab] = useState("task-0");
  const [isExporting, setIsExporting] = useState(false);

  const meta = getDisciplineMeta(attempt.discipline);
  const evaluations = getTaskEvaluations(attempt);
  const answers = parseAnswers(attempt);
  const date = getAttemptDate(attempt);
  const validated = attempt.nclcLevel >= 7;
  const isWritten = attempt.discipline === "EXPRESSION_ECRITE";

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportAttemptPdf(attempt);
    } catch (err) {
      console.error("Échec de l'export PDF :", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Retour à l&apos;historique
      </Link>

      {isDemo && (
        <div className="flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
          <Sparkles className="h-4 w-4 shrink-0" />
          Exemple illustratif : vos propres corrections apparaîtront ici avec le même niveau de détail.
        </div>
      )}

      {/* En-tête */}
      <div className="rounded-3xl border bg-gradient-to-r from-brand-crimson/10 via-primary/5 to-amber-500/10 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Rapport de correction FEI
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-2">
              <span>{meta.emoji}</span>
              {meta.label}
            </h1>
            <p className="text-xs text-muted-foreground">
              {date.toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}{" "}
              à {date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div>
              <span className="text-[10px] font-bold uppercase text-muted-foreground block">Note FEI</span>
              <span className="font-mono text-2xl font-black text-foreground">{attempt.rawScore}</span>
              <span className="text-sm text-muted-foreground"> / 20</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-muted-foreground block">Score TCF</span>
              <span className="font-mono text-2xl font-black text-foreground">{attempt.tcfScaledScore}</span>
              <span className="text-sm text-muted-foreground"> / 699</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-muted-foreground block">Palier</span>
              <span
                className={`font-mono text-2xl font-black ${
                  validated ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                }`}
              >
                NCLC {attempt.nclcLevel}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div
            className={`flex items-center gap-2 text-xs font-bold ${
              validated ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
            }`}
          >
            {validated ? <ShieldCheck className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
            <span>
              {validated
                ? "NCLC 7+ atteint : +50 points CRS Entrée Express débloqués."
                : "Palier à consolider : visez 10/20 pour atteindre le NCLC 7 (+50 pts CRS)."}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handleExport} disabled={isExporting} variant="outline" size="sm" className="gap-2 font-bold">
              {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {isExporting ? "Génération…" : "Export PDF"}
            </Button>
            <Button asChild size="sm" className="gap-2 bg-brand-crimson hover:bg-brand-crimson-dark text-white font-bold">
              <Link href={`/examens?discipline=${isWritten ? "ee" : "eo"}`}>
                <RotateCcw className="h-4 w-4" />
                Refaire l&apos;épreuve
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Détail par tâche */}
      {isWritten ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 rounded-2xl p-1 bg-muted/60 h-auto">
            {evaluations.map((ev, idx) => (
              <TabsTrigger key={idx} value={`task-${idx}`} className="rounded-xl py-2 text-xs sm:text-sm font-bold">
                <span className="flex flex-col sm:flex-row sm:gap-1.5 items-center">
                  <span>Tâche {ev.taskNumber}</span>
                  <span className="font-mono opacity-70">{ev.taskScore}/20</span>
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {evaluations.map((ev, idx) => (
            <TabsContent key={idx} value={`task-${idx}`} className="space-y-6 mt-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border bg-card p-4">
                  <span className="text-[11px] font-bold uppercase text-muted-foreground block">Note de la tâche</span>
                  <div className="text-xl font-extrabold text-foreground mt-0.5">
                    {ev.taskScore} <span className="text-xs font-normal text-muted-foreground">/ 20</span>
                  </div>
                </div>
                <div className="rounded-2xl border bg-card p-4">
                  <span className="text-[11px] font-bold uppercase text-muted-foreground block">Décompte de mots</span>
                  <div className="text-xl font-extrabold text-foreground mt-0.5">
                    {ev.wordCount} <span className="text-xs font-normal text-muted-foreground">mots</span>
                  </div>
                  <span
                    className={`text-[11px] font-semibold ${
                      ev.wordCountStatus === "valid"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {ev.wordCountStatus === "valid"
                      ? "✓ Volume conforme"
                      : ev.wordCountStatus === "under"
                      ? "Volume insuffisant"
                      : "Volume excessif"}
                  </span>
                </div>
                <div className="rounded-2xl border bg-card p-4">
                  <span className="text-[11px] font-bold uppercase text-muted-foreground block">Niveau estimé</span>
                  <div className="text-xl font-extrabold text-brand-crimson mt-0.5">NCLC {ev.nclcEstimatedLevel}</div>
                </div>
              </div>

              {ev.generalFeedback && (
                <p className="rounded-2xl border bg-muted/30 p-4 text-sm text-foreground/90 leading-relaxed">
                  {ev.generalFeedback}
                </p>
              )}

              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  Votre rédaction
                </h3>
                <div className="rounded-2xl border bg-card p-4 text-sm font-mono leading-relaxed whitespace-pre-wrap">
                  {answers[idx] || <span className="italic text-muted-foreground">Aucun texte soumis.</span>}
                </div>
              </div>

              {ev.criteria.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-amber-500" />
                    Grille d&apos;évaluation FEI
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {ev.criteria.map((c, cIdx) => (
                      <div key={cIdx} className="rounded-2xl border bg-card p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">{c.label}</span>
                          <span className="font-mono text-xs font-extrabold text-primary">{c.score} / 5</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-brand-crimson to-primary"
                            style={{ width: `${Math.min(100, (c.score / 5) * 100)}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{c.feedback}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {ev.magicRewriteC2 && (
                <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-card to-amber-500/5 p-5 space-y-3">
                  <h3 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    <Sparkles className="h-4 w-4" />
                    Version idéale Magic Rewrite C2
                  </h3>
                  <p className="text-sm font-serif italic leading-relaxed whitespace-pre-wrap rounded-xl border bg-background/60 p-4">
                    {ev.magicRewriteC2}
                  </p>
                  {ev.rewriteHighlights.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {ev.rewriteHighlights.map((hl, i) => (
                        <span
                          key={i}
                          className="rounded-lg border border-amber-500/30 bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-800 dark:text-amber-300"
                        >
                          {hl}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="rounded-3xl border border-dashed bg-card/60 p-10 text-center text-sm text-muted-foreground">
          Le détail question par question de cette épreuve sera disponible prochainement.
        </div>
      )}
    </div>
  );
}
