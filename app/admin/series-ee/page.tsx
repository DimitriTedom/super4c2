import Link from "next/link";
import {
  PenTool,
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  ListOrdered,
  ExternalLink,
} from "lucide-react";
import { Prisma } from "@prisma/client";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmActionDialog } from "@/components/admin/ConfirmActionDialog";
import { AdminTablePagination } from "@/components/admin/AdminTablePagination";
import { AdminListEmptyState } from "@/components/admin/AdminListEmptyState";
import { getAdminPagination } from "@/lib/admin-pagination";
import { toOptionalString } from "@/lib/admin-crud-utils";
import { prisma } from "@/lib/prisma";
import {
  deleteWrittenSeriesAction,
  toggleWrittenSeriesPublishAction,
} from "./actions";

export const metadata = {
  title: "Séries Expression Écrite (EE) — Back-Office | Super4C2",
};

interface SeriesEePageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    status?: string;
  }>;
}

export default async function SeriesEePage({ searchParams }: SeriesEePageProps) {
  const { page: rawPage, q: rawQ, status: rawStatus } = await searchParams;
  const q = toOptionalString(rawQ);
  const status = toOptionalString(rawStatus);

  const whereClause: Prisma.WrittenSeriesWhereInput = {};

  if (q) {
    whereClause.OR = [
      { title: { contains: q, mode: "insensitive" } },
      ...(Number.isInteger(Number(q))
        ? [{ seriesNumber: Number(q) }]
        : []),
    ];
  }

  if (status === "published") {
    whereClause.isPublished = true;
  } else if (status === "draft") {
    whereClause.isPublished = false;
  }

  const totalItems = await prisma.writtenSeries.count({ where: whereClause });
  const pagination = getAdminPagination(totalItems, rawPage, 10);

  const seriesList = await prisma.writtenSeries.findMany({
    where: whereClause,
    orderBy: { seriesNumber: "asc" },
    skip: pagination.skip,
    take: pagination.pageSize,
    include: {
      _count: {
        select: { tasks: true },
      },
      tasks: {
        select: {
          taskNumber: true,
          minWords: true,
          maxWords: true,
        },
        orderBy: { taskNumber: "asc" },
      },
    },
  });

  return (
    <AdminShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 mb-1.5">
              <PenTool className="h-3 w-3" />
              Épreuves Officielles FEI · 3 Tâches Rédactionnelles
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Séries d&apos;Expression Écrite (EE)
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Gérez les séries de rédaction officielle (Tâche 1 : message, Tâche 2 : article/lettre, Tâche 3 : essai comparatif).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="gap-2 font-bold shadow-xs">
              <Link href="/admin/series-ee/ajouter">
                <Plus className="h-4 w-4" />
                <span>Créer une Série EE</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <form className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              name="q"
              defaultValue={q || ""}
              placeholder="Rechercher par titre ou numéro..."
              className="pl-9 h-9 text-xs rounded-xl bg-card border-border"
            />
            {status && <input type="hidden" name="status" value={status} />}
          </form>

          <div className="flex items-center gap-1.5">
            <Button
              asChild
              variant={!status ? "secondary" : "ghost"}
              size="sm"
              className="text-xs h-8"
            >
              <Link href="/admin/series-ee">Toutes ({totalItems})</Link>
            </Button>
            <Button
              asChild
              variant={status === "published" ? "secondary" : "ghost"}
              size="sm"
              className="text-xs h-8"
            >
              <Link href="/admin/series-ee?status=published">Publiées</Link>
            </Button>
            <Button
              asChild
              variant={status === "draft" ? "secondary" : "ghost"}
              size="sm"
              className="text-xs h-8"
            >
              <Link href="/admin/series-ee?status=draft">Brouillons</Link>
            </Button>
          </div>
        </div>

        {/* Table Container */}
        {seriesList.length === 0 ? (
          <AdminListEmptyState
            kind="series-ee"
            title="Aucune série d'Expression Écrite trouvée"
            description="Commencez par créer une nouvelle série EE pour y configurer les 3 tâches de rédaction officielle."
            actionLabel="Créer une Série EE"
            actionHref="/admin/series-ee/ajouter"
          />
        ) : (
          <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b bg-muted/30 text-muted-foreground font-semibold">
                    <th className="py-3 px-4">Numéro</th>
                    <th className="py-3 px-4">Titre de la Série</th>
                    <th className="py-3 px-4 text-center">Tâches FEI</th>
                    <th className="py-3 px-4 text-center">Durée</th>
                    <th className="py-3 px-4 text-center">Statut</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {seriesList.map((series) => {
                    const taskCount = series._count.tasks;
                    const isComplete = taskCount === 3;

                    return (
                      <tr
                        key={series.id}
                        className="hover:bg-muted/20 transition-colors"
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                          <span className="inline-flex items-center justify-center h-7 w-12 rounded-lg bg-primary/10 text-primary border border-primary/20 text-xs">
                            #{series.seriesNumber}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <p className="font-bold text-foreground text-xs sm:text-sm">
                              {series.title}
                            </p>
                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                              <span>{series.examType.replace("_", " ")}</span>
                              {series.isFreeDemo && (
                                <>
                                  <span>•</span>
                                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                    Démo Gratuite
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2.5 text-xs font-mono font-bold"
                          >
                            <Link href={`/admin/series-ee/${series.id}/tasks`}>
                              <span
                                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${
                                  isComplete
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                                }`}
                              >
                                <ListOrdered className="h-3 w-3" />
                                {taskCount} / 3 tâches
                              </span>
                            </Link>
                          </Button>
                        </td>

                        <td className="py-3.5 px-4 text-center text-muted-foreground font-mono">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {Math.round(series.durationSeconds / 60)} min
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <form
                            action={toggleWrittenSeriesPublishAction}
                            className="inline-block"
                          >
                            <input type="hidden" name="id" value={series.id} />
                            <button
                              type="submit"
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-all ${
                                series.isPublished
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                                  : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                              }`}
                              title="Cliquer pour basculer la publication"
                            >
                              {series.isPublished ? (
                                <>
                                  <Eye className="h-3 w-3" />
                                  <span>Publiée</span>
                                </>
                              ) : (
                                <>
                                  <EyeOff className="h-3 w-3" />
                                  <span>Brouillon</span>
                                </>
                              )}
                            </button>
                          </form>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              asChild
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                              title="Voir en vue candidat (Épreuve réelle)"
                            >
                              <Link href={`/examens/${series.seriesNumber}/ee/intro`} target="_blank">
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Link>
                            </Button>

                            <Button
                              asChild
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="Gérer les 3 tâches"
                            >
                              <Link href={`/admin/series-ee/${series.id}/tasks`}>
                                <ListOrdered className="h-3.5 w-3.5" />
                              </Link>
                            </Button>

                            <Button
                              asChild
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="Modifier les paramètres"
                            >
                              <Link href={`/admin/series-ee/${series.id}`}>
                                <Pencil className="h-3.5 w-3.5" />
                              </Link>
                            </Button>

                            <form
                              id={`del-series-${series.id}`}
                              action={deleteWrittenSeriesAction}
                            >
                              <input type="hidden" name="id" value={series.id} />
                            </form>

                            <ConfirmActionDialog
                              trigger={
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                  title="Supprimer la série"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              }
                              title={`Supprimer la Série ${series.seriesNumber} ?`}
                              description={`Êtes-vous sûr de vouloir supprimer définitivement la Série ${series.seriesNumber} (${series.title}) et ses 3 tâches associées ? Cette action est irréversible.`}
                              confirmLabel="Supprimer définitivement"
                              formId={`del-series-${series.id}`}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <AdminTablePagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              basePath="/admin/series-ee"
              search={q ?? undefined}
            />
          </div>
        )}
      </div>
    </AdminShell>
  );
}
