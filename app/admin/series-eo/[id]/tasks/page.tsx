import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Mic,
  Plus,
  Pencil,
  Trash2,
  Bot,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { ConfirmActionDialog } from "@/components/admin/ConfirmActionDialog";
import { prisma } from "@/lib/prisma";
import { deleteOralTaskAction } from "./actions";

export const metadata = {
  title: "Tâches d'Expression Orale — Back-Office | Super4C2",
};

interface OralTasksPageProps {
  params: Promise<{ id: string }>;
}

export default async function OralTasksPage({ params }: OralTasksPageProps) {
  const { id } = await params;

  const series = await prisma.oralSeries.findUnique({
    where: { id },
    include: {
      tasks: {
        orderBy: { taskNumber: "asc" },
      },
    },
  });

  if (!series) {
    notFound();
  }

  const tasks = series.tasks;
  const isComplete = tasks.length === 3;

  const standardDurations: Record<number, { label: string; defaultSec: number }> = {
    1: { label: "2 min (120s)", defaultSec: 120 },
    2: { label: "3 min 30 (210s)", defaultSec: 210 },
    3: { label: "4 min 30 (270s)", defaultSec: 270 },
  };

  return (
    <AdminShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground p-0 h-auto hover:bg-transparent hover:text-foreground">
                <Link href="/admin/series-eo">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Séries EO</span>
                </Link>
              </Button>
              <span className="text-muted-foreground">/</span>
              <span className="text-xs font-bold text-primary">Série {series.seriesNumber}</span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-3">
              <span>Tâches de la Série {series.seriesNumber}</span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold border ${
                  isComplete
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                    : "bg-amber-500/10 text-amber-600 border-amber-500/30"
                }`}
              >
                {tasks.length} / 3 tâches orales configurées
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {series.title} — {Math.round(series.durationSeconds / 60)} minutes officielles d&apos;épreuve.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild size="sm" className="gap-2 font-bold shadow-xs">
              <Link href={`/admin/series-eo/${series.id}/tasks/ajouter`}>
                <Plus className="h-4 w-4" />
                <span>Ajouter une Tâche</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* 3 Tasks Cards Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((num) => {
            const task = tasks.find((t) => t.taskNumber === num);
            const standard = standardDurations[num];

            type TaskScenario = {
              situation?: string;
              candidateRole?: string;
              examinerRole?: string;
              instructions?: string;
            };
            const scenario = (task?.roleplayScenario as TaskScenario | null) || null;

            return (
              <div
                key={num}
                className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                  task
                    ? "bg-card shadow-xs border-border"
                    : "bg-muted/10 border-dashed border-border/80"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${
                        task
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      <Mic className="h-3 w-3" />
                      TÂCHE {num}
                    </span>

                    {task ? (
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Prête
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5" />
                        Non configurée
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-foreground mb-1 line-clamp-2">
                    {task ? task.title : `Tâche ${num} à configurer (${standard.label})`}
                  </h3>

                  {task ? (
                    <div className="space-y-2 mt-3 text-xs text-muted-foreground">
                      <div className="flex items-center justify-between pt-1 border-t border-border/40">
                        <span>Durée officielle :</span>
                        <span className="font-mono font-bold text-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3 text-primary" />
                          {Math.floor(task.durationSeconds / 60)} min {task.durationSeconds % 60 > 0 ? `${task.durationSeconds % 60}s` : ""} ({task.durationSeconds}s)
                        </span>
                      </div>

                      {scenario?.situation && (
                        <div className="pt-2 border-t border-border/40">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground">Situation :</span>
                          <p className="line-clamp-2 text-[11px] text-foreground/80 italic mt-0.5">
                            « {scenario.situation} »
                          </p>
                        </div>
                      )}

                      <div className="pt-2 border-t border-border/40 flex items-center gap-1.5 text-[11px] text-primary font-semibold">
                        <Bot className="h-3.5 w-3.5" />
                        <span>Prompt IA configuré</span>
                        <Sparkles className="h-3 w-3 ml-auto text-amber-500" />
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-2">
                      Cliquez ci-dessous pour renseigner le scénario, les consignes et les directives de l&apos;examinateur IA.
                    </p>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-border/40 flex items-center justify-between">
                  {task ? (
                    <>
                      <div className="flex items-center gap-1">
                        <form
                          id={`del-task-${task.id}`}
                          action={deleteOralTaskAction}
                        >
                          <input type="hidden" name="id" value={task.id} />
                          <input type="hidden" name="seriesId" value={series.id} />
                        </form>

                        <ConfirmActionDialog
                          trigger={
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                              title="Supprimer la tâche"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          }
                          title={`Supprimer la Tâche ${task.taskNumber} ?`}
                          description={`Êtes-vous sûr de vouloir supprimer la Tâche ${task.taskNumber} (${task.title}) ?`}
                          confirmLabel="Supprimer"
                          formId={`del-task-${task.id}`}
                        />
                      </div>

                      <Button asChild size="sm" variant="outline" className="gap-1.5 text-xs font-bold">
                        <Link href={`/admin/series-eo/${series.id}/tasks/${task.id}`}>
                          <Pencil className="h-3.5 w-3.5" />
                          <span>Modifier</span>
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <Button asChild size="sm" className="w-full gap-1.5 text-xs font-bold">
                      <Link href={`/admin/series-eo/${series.id}/tasks/ajouter?num=${num}`}>
                        <Plus className="h-3.5 w-3.5" />
                        <span>Configurer Tâche {num}</span>
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminShell>
  );
}
