import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { ConfirmActionDialog } from "@/components/admin/ConfirmActionDialog";
import { AiSeriesGeneratorDialog } from "@/components/admin/ai-series-generator-dialog";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { deleteQuestionAction } from "./actions";

export const metadata = {
  title: "Gestion des 39 Questions CE — Back-Office | Super4C2",
};

interface QuestionsManagerPageProps {
  params: Promise<{ id: string }>;
}

function getLevelBadge(cefrLevel: string | null, nclcLevel: number | null) {
  const lvl = cefrLevel?.toUpperCase() || "B2";
  if (lvl === "A1") {
    return {
      label: "A1 · NCLC 3",
      className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    };
  }
  if (lvl === "A2") {
    return {
      label: `A2 · NCLC ${nclcLevel || 4}`,
      className: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
    };
  }
  if (lvl === "B1") {
    return {
      label: `B1 · NCLC ${nclcLevel || 6}`,
      className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    };
  }
  if (lvl === "B2") {
    return {
      label: `B2 · NCLC ${nclcLevel || 7} (Seuil CRS)`,
      className: "bg-primary/10 text-primary border-primary/30 font-bold",
    };
  }
  if (lvl === "C1") {
    return {
      label: `C1 · NCLC ${nclcLevel || 9}`,
      className: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    };
  }
  return {
    label: `C2 · NCLC ${nclcLevel || 10}`,
    className: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  };
}

export default async function QuestionsManagerPage({ params }: QuestionsManagerPageProps) {
  const { id } = await params;
  const series = await prisma.examSeries.findUnique({
    where: { id },
    include: {
      questions: {
        orderBy: { questionNumber: "asc" },
      },
    },
  });

  if (!series || series.discipline !== "COMPREHENSION_ECRITE") {
    notFound();
  }

  const questions = series.questions;
  const isComplete = questions.length === 39;

  return (
    <AdminShell>
      <div className="space-y-6">
        {/* Top Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground p-0 h-auto hover:bg-transparent hover:text-foreground">
                <Link href="/admin/series-ce">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Séries CE</span>
                </Link>
              </Button>
              <span className="text-muted-foreground">/</span>
              <span className="text-xs font-bold text-primary">Série {series.seriesNumber}</span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
              <span>Questions de la Série {series.seriesNumber}</span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold border ${
                  isComplete
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                    : "bg-amber-500/10 text-amber-600 border-amber-500/30"
                }`}
              >
                {questions.length} / 39 questions
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {series.title} — {Math.round(series.durationSeconds / 60)} minutes officielles.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm" className="gap-2 font-bold text-xs">
              <Link href={`/examens/demo-101-ce/ce`}>
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>Tester en Mode CBT</span>
              </Link>
            </Button>

            <AiSeriesGeneratorDialog
              initialSeriesId={series.id}
              initialSeriesNumber={series.seriesNumber}
              triggerButton={
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 font-bold text-xs border-primary/30 text-primary hover:bg-primary/10"
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span>
                    {questions.length === 39
                      ? "Régénérer avec IA"
                      : `Compléter avec IA (${39 - questions.length}Q)`}
                  </span>
                </Button>
              }
            />

            <Button asChild size="sm" className="gap-2 font-bold shadow-xs">
              <Link href={`/admin/series-ce/${series.id}/questions/ajouter`}>
                <Plus className="h-4 w-4" />
                <span>Ajouter une Question</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick jump badges bar (1 to 39) */}
        <div className="rounded-2xl border bg-card p-4 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-foreground">Accès direct aux 39 numéros :</span>
            <span className="text-muted-foreground text-[11px]">
              {questions.length === 39 ? "Toutes les questions sont renseignées ✓" : `${39 - questions.length} question(s) restante(s)`}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {Array.from({ length: 39 }, (_, i) => i + 1).map((num) => {
              const existing = questions.find((q) => q.questionNumber === num);
              return (
                <Link
                  key={num}
                  href={
                    existing
                      ? `/admin/series-ce/${series.id}/questions/${existing.id}`
                      : `/admin/series-ce/${series.id}/questions/ajouter?num=${num}`
                  }
                  className={`h-7 w-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center transition-all ${
                    existing
                      ? "bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white"
                      : "bg-muted/40 text-muted-foreground border border-dashed border-border hover:bg-muted"
                  }`}
                  title={`Question ${num} ${existing ? "(Configurer)" : "(À créer)"}`}
                >
                  {num}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Questions Table */}
        <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4 w-32">Palier / NCLC</th>
                  <th className="py-3 px-4">Document Source</th>
                  <th className="py-3 px-4">Question Posée</th>
                  <th className="py-3 px-4 w-20 text-center">Bonne Rép.</th>
                  <th className="py-3 px-4">Piège &amp; Explication FEI</th>
                  <th className="py-3 px-4 text-right w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {questions.map((q) => {
                  const badge = getLevelBadge(q.cefrLevel, q.nclcTargetLevel);
                  return (
                    <tr key={q.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-sm text-foreground">
                        {q.questionNumber}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] border font-semibold ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="space-y-0.5">
                          {q.documentTitle && (
                            <span className="font-bold text-foreground block text-[11px] truncate">
                              {q.documentTitle}
                            </span>
                          )}
                          <p className="text-muted-foreground text-[11px] line-clamp-2 italic">
                            {q.documentText ? `« ${q.documentText} »` : "Aucun document textuel (image)"}
                          </p>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-foreground max-w-xs">
                        <p className="line-clamp-2">{q.prompt}</p>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono font-black text-xs border border-emerald-500/30">
                          {q.correctOption}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="space-y-1">
                          <p className="text-[11px] text-foreground/90 line-clamp-2">
                            {q.explanation}
                          </p>
                          {q.trapAnalysis && (
                            <p className="text-[10px] text-amber-600 dark:text-amber-400 line-clamp-1 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3 shrink-0" />
                              <span>{q.trapAnalysis}</span>
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0" title="Modifier la question">
                            <Link href={`/admin/series-ce/${series.id}/questions/${q.id}`}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Link>
                          </Button>

                          <form id={`del-q-${q.id}`} action={deleteQuestionAction}>
                            <input type="hidden" name="id" value={q.id} />
                            <input type="hidden" name="seriesId" value={series.id} />
                          </form>
                          <ConfirmActionDialog
                            formId={`del-q-${q.id}`}
                            title={`Supprimer la Question ${q.questionNumber} ?`}
                            description="Cette action retirera définitivement cette question de la série."
                            confirmLabel="Supprimer"
                            trigger={
                              <div className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors">
                                <Trash2 className="h-3.5 w-3.5" />
                              </div>
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
