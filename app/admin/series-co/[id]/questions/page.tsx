import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Headphones,
  Volume2,
  VolumeX,
  FileText,
  Lock,
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { ConfirmActionDialog } from "@/components/admin/ConfirmActionDialog";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { deleteCoQuestionAction } from "./actions";

export const metadata = {
  title: "Questions de Compréhension Orale (CO) — Back-Office | Super4C2",
};

export const dynamic = "force-dynamic";

interface CoQuestionsManagerPageProps {
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

export default async function CoQuestionsManagerPage({ params }: CoQuestionsManagerPageProps) {
  const { id } = await params;
  const series = await prisma.examSeries.findUnique({
    where: { id },
    include: {
      questions: {
        orderBy: { questionNumber: "asc" },
      },
    },
  });

  if (!series || series.discipline !== "COMPREHENSION_ORALE") {
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
                <Link href="/admin/series-co">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Séries CO</span>
                </Link>
              </Button>
              <span className="text-muted-foreground">/</span>
              <span className="text-xs font-bold text-primary">Série {series.seriesNumber}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                Coming Soon
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
              <span>Questions de la Série CO #{series.seriesNumber}</span>
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
              {series.title} — Écoute et compréhension audio (Format standard FEI 35 min).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="gap-2 font-bold shadow-xs">
              <Link href={`/admin/series-co/${series.id}/questions/ajouter`}>
                <Plus className="h-4 w-4" />
                <span>Ajouter une Question</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Warning / Coming Soon callout */}
        <div className="p-3.5 rounded-xl border border-border/80 bg-muted/20 text-xs text-muted-foreground flex items-center gap-2.5">
          <Lock className="h-4 w-4 text-amber-500 shrink-0" />
          <span>
            Les questions et extraits audios configurés ici sont réservés au pré-calibrage technique. L&apos;épreuve reste étiquetée <strong>Coming Soon</strong> sur les espaces candidats.
          </span>
        </div>

        {/* Questions Table */}
        {questions.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-12 text-center bg-card/40 space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto text-primary">
              <Headphones className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-base text-foreground">Aucune question dans cette série CO</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Ajoutez les 39 questions QCM officielles avec leurs liens audio MP3 et transcriptions pour compléter la série d&apos;écoute.
            </p>
            <div className="pt-2">
              <Button asChild size="sm" className="gap-2 font-bold shadow-xs">
                <Link href={`/admin/series-co/${series.id}/questions/ajouter`}>
                  <Plus className="h-4 w-4" />
                  <span>Ajouter la Question 1</span>
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b bg-muted/30 text-muted-foreground font-semibold">
                    <th className="py-3 px-4">N°</th>
                    <th className="py-3 px-4">Piste Audio &amp; Transcription</th>
                    <th className="py-3 px-4">Question &amp; Intitulé</th>
                    <th className="py-3 px-4 text-center">Niveau NCLC</th>
                    <th className="py-3 px-4 text-center">Bonne Rép.</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {questions.map((q) => {
                    const badge = getLevelBadge(q.cefrLevel, q.nclcTargetLevel);
                    const hasAudio = Boolean(q.audioUrl);

                    return (
                      <tr key={q.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                          Q{q.questionNumber}
                        </td>

                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="space-y-1">
                            {hasAudio ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                <Volume2 className="h-3 w-3" />
                                Audio configuré
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                                <VolumeX className="h-3 w-3" />
                                Audio manquant
                              </span>
                            )}
                            {q.audioTranscript ? (
                              <p className="line-clamp-1 text-[11px] text-muted-foreground italic">
                                « {q.audioTranscript} »
                              </p>
                            ) : (
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <FileText className="h-3 w-3" /> Pas de transcription
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 max-w-md">
                          <p className="font-semibold text-foreground line-clamp-2 leading-relaxed">
                            {q.prompt}
                          </p>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono border ${badge.className}`}>
                            {badge.label}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/10 font-mono font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            {q.correctOption}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0" title="Modifier la question">
                              <Link href={`/admin/series-co/${series.id}/questions/${q.id}`}>
                                <Pencil className="h-3.5 w-3.5" />
                              </Link>
                            </Button>

                            <form id={`del-q-${q.id}`} action={deleteCoQuestionAction}>
                              <input type="hidden" name="id" value={q.id} />
                              <input type="hidden" name="seriesId" value={series.id} />
                            </form>

                            <ConfirmActionDialog
                              trigger={
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive" title="Supprimer la question">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              }
                              title={`Supprimer la Question ${q.questionNumber} ?`}
                              description={`Êtes-vous sûr de vouloir supprimer définitivement la Question ${q.questionNumber} de cette série de Compréhension Orale ?`}
                              confirmLabel="Supprimer"
                              formId={`del-q-${q.id}`}
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
        )}
      </div>
    </AdminShell>
  );
}
