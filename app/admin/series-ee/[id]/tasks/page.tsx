import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  PenTool,
  Plus,
  Pencil,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { ConfirmActionDialog } from "@/components/admin/ConfirmActionDialog";
import { prisma } from "@/lib/prisma";
import { deleteWrittenTaskAction } from "./actions";

export const metadata = {
  title: "Tâches d'Expression Écrite — Back-Office | Super4C2",
};

interface WrittenTasksPageProps {
  params: Promise<{ id: string }>;
}

export default async function WrittenTasksPage({ params }: WrittenTasksPageProps) {
  const { id } = await params;

  const series = await prisma.writtenSeries.findUnique({
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

  return (
    <AdminShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground p-0 h-auto hover:bg-transparent hover:text-foreground">
                <Link href="/admin/series-ee">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Séries EE</span>
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
                {tasks.length} / 3 tâches configurées
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {series.title} — {Math.round(series.durationSeconds / 60)} minutes officielles.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild size="sm" className="gap-2 font-bold shadow-xs">
              <Link href={`/admin/series-ee/${series.id}/tasks/ajouter`}>
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
                      <PenTool className="h-3 w-3" />
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
                    {task ? task.title : `Tâche ${num} à configurer`}
                  </h3>

                  {task ? (
                    <div className="space-y-2 mt-3 text-xs text-muted-foreground">
                      <div className="flex items-center justify-between pt-1 border-t border-border/40">
                        <span>Fourchette de mots :</span>
                        <span className="font-mono font-bold text-foreground">
                          {task.minWords} – {task.maxWords} mots
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Temps conseillé :</span>
                        <span className="font-mono font-bold text-foreground">
                          {task.suggestedDurationMinutes} min
                        </span>
                      </div>
                      <div className="pt-2 border-t border-border/40">
                        <p className="line-clamp-3 text-[11px] text-foreground/80 italic">
                          « {task.topic} »
                        </p>
                      </div>
                      {task.sampleModelC2 && (
                        <div className="pt-1 flex items-center gap-1 text-[11px] text-primary font-semibold">
                          <Sparkles className="h-3 w-3" />
                          <span>Modèle C2 inclus</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-2">
                      Cliquez ci-dessous pour renseigner la consigne, le contexte et la fourchette de mots.
                    </p>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-border/40 flex items-center justify-between">
                  {task ? (
                    <>
                      <div className="flex items-center gap-1">
                        <form
                          id={`del-task-${task.id}`}
                          action={deleteWrittenTaskAction}
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
                        <Link href={`/admin/series-ee/${series.id}/tasks/${task.id}`}>
                          <Pencil className="h-3.5 w-3.5" />
                          <span>Modifier</span>
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <Button asChild size="sm" className="w-full gap-1.5 text-xs font-bold">
                      <Link href={`/admin/series-ee/${series.id}/tasks/ajouter?num=${num}`}>
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
