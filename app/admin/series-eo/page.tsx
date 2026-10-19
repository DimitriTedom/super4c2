import Link from "next/link";
import {
  Mic,
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  ListOrdered,
  Sparkles,
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
  deleteOralSeriesAction,
  toggleOralSeriesPublishAction,
} from "./actions";

export const metadata = {
  title: "Séries Expression Orale (EO) — Back-Office | Super4C2",
};

interface SeriesEoPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    status?: string;
  }>;
}

export default async function SeriesEoPage({ searchParams }: SeriesEoPageProps) {
  const { page: rawPage, q: rawQ, status: rawStatus } = await searchParams;
  const q = toOptionalString(rawQ);
  const status = toOptionalString(rawStatus);

  const whereClause: Prisma.OralSeriesWhereInput = {};

  if (q) {
    whereClause.OR = [
      { title: { contains: q, mode: "insensitive" } },
      ...(Number.isInteger(Number(q)) ? [{ seriesNumber: Number(q) }] : []),
    ];
  }

  if (status === "published") {
    whereClause.isPublished = true;
  } else if (status === "draft") {
    whereClause.isPublished = false;
  }

  const totalItems = await prisma.oralSeries.count({ where: whereClause });
  const pagination = getAdminPagination(totalItems, rawPage, 10);

  const seriesList = await prisma.oralSeries.findMany({
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
          type: true,
          durationSeconds: true,
        },
        orderBy: { taskNumber: "asc" },
      },
    },
  });

  const [totalPublished, totalFreeDemos] = await Promise.all([
    prisma.oralSeries.count({ where: { isPublished: true } }),
    prisma.oralSeries.count({ where: { isFreeDemo: true } }),
  ]);

  return (
    <AdminShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 mb-1.5">
              <Mic className="h-3 w-3" />
              Épreuves Conformes FEI · 3 Tâches avec Examinateur IA
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Séries d&apos;Expression Orale (EO)
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Gérez les simulations d&apos;entretien oral TCF Canada (Tâche 1 : entretien dirigé, Tâche 2 : interaction / jeu de rôle, Tâche 3 : point de vue argumenté).
            </p>
          </div>

          <Button asChild className="gap-2 font-bold shadow-xs shrink-0">
            <Link href="/admin/series-eo/ajouter">
              <Plus className="h-4 w-4" />
              <span>Créer une Série EO</span>
            </Link>
          </Button>
        </div>

        {/* KPI Mini-Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-2xl border bg-card p-4 space-y-1">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Total Séries
            </span>
            <p className="text-2xl font-black text-foreground">{totalItems}</p>
          </div>
          <div className="rounded-2xl border bg-card p-4 space-y-1">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Publiées en Ligne
            </span>
            <p className="text-2xl font-black text-emerald-600">{totalPublished}</p>
          </div>
          <div className="rounded-2xl border bg-card p-4 space-y-1">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Pass Lancement Démo
            </span>
            <p className="text-2xl font-black text-primary">{totalFreeDemos}</p>
          </div>
          <div className="rounded-2xl border bg-card p-4 space-y-1">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Format Officiel
            </span>
            <p className="text-2xl font-black text-foreground">3 Tâches FEI</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-2xl border">
          <form method="GET" className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              name="q"
              defaultValue={q || ""}
              placeholder="Rechercher par titre ou n° (ex: 101)..."
              className="pl-9 h-9 text-xs rounded-xl"
            />
            {status && <input type="hidden" name="status" value={status} />}
          </form>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <Button
              asChild
              variant={!status ? "secondary" : "ghost"}
              size="sm"
              className="rounded-xl h-8 text-xs font-semibold"
            >
              <Link href={`/admin/series-eo${q ? `?q=${encodeURIComponent(q)}` : ""}`}>
                Toutes ({totalItems})
              </Link>
            </Button>
            <Button
              asChild
              variant={status === "published" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-xl h-8 text-xs font-semibold"
            >
              <Link
                href={`/admin/series-eo?status=published${
                  q ? `&q=${encodeURIComponent(q)}` : ""
                }`}
              >
                Publiées ({totalPublished})
              </Link>
            </Button>
            <Button
              asChild
              variant={status === "draft" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-xl h-8 text-xs font-semibold"
            >
              <Link
                href={`/admin/series-eo?status=draft${
                  q ? `&q=${encodeURIComponent(q)}` : ""
                }`}
              >
                Brouillons ({totalItems - totalPublished})
              </Link>
            </Button>
          </div>
        </div>

        {/* Table of Oral Series */}
        {seriesList.length === 0 ? (
          <AdminListEmptyState
            kind="series-eo"
            title="Aucune série d'Expression Orale trouvée"
            description={
              q || status
                ? "Aucun résultat ne correspond à vos critères de filtrage."
                : "Commencez par créer votre première série d'Expression Orale TCF Canada."
            }
            actionHref="/admin/series-eo/ajouter"
            actionLabel="Créer une Série EO"
          />
        ) : (
          <div className="rounded-2xl border bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b text-muted-foreground uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4 font-bold">N°</th>
                    <th className="py-3 px-4 font-bold">Titre & Cadre FEI</th>
                    <th className="py-3 px-4 font-bold">Tâches Configurées</th>
                    <th className="py-3 px-4 font-bold">Durée</th>
                    <th className="py-3 px-4 font-bold">Visibilité</th>
                    <th className="py-3 px-4 font-bold">Statut</th>
                    <th className="py-3 px-4 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {seriesList.map((series) => {
                    const taskCount = series._count.tasks;
                    const isComplete = taskCount === 3;

                    return (
                      <tr
                        key={series.id}
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        {/* Numéro */}
                        <td className="py-3 px-4 font-mono font-black text-sm text-foreground">
                          #{series.seriesNumber}
                        </td>

                        {/* Titre & Info */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-foreground text-xs sm:text-sm">
                            {series.title}
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {series.examType === "TCF_CANADA"
                              ? "TCF Canada Officiel"
                              : "TEF Canada"}
                          </div>
                        </td>

                        {/* Tâches Configurées */}
                        <td className="py-3 px-4">
                          <Link
                            href={`/admin/series-eo/${series.id}/tasks`}
                            className="inline-flex items-center gap-1.5 font-bold hover:underline"
                          >
                            <span
                              className={`px-2 py-0.5 rounded-full font-mono text-[11px] ${
                                isComplete
                                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                  : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                              }`}
                            >
                              {taskCount} / 3 tâches
                            </span>
                          </Link>
                        </td>

                        {/* Durée */}
                        <td className="py-3 px-4 text-muted-foreground font-mono">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            {Math.round(series.durationSeconds / 60)} min
                          </span>
                        </td>

                        {/* Visibilité (Démo vs Standard) */}
                        <td className="py-3 px-4">
                          {series.isFreeDemo ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 border border-purple-500/20">
                              <Sparkles className="h-2.5 w-2.5" />
                              Démo Gratuite
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground">
                              Standard
                            </span>
                          )}
                        </td>

                        {/* Statut (Publié vs Brouillon) */}
                        <td className="py-3 px-4">
                          <form
                            action={async () => {
                              "use server";
                              await toggleOralSeriesPublishAction(
                                series.id,
                                series.isPublished
                              );
                            }}
                          >
                            <button
                              type="submit"
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                                series.isPublished
                                  ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                              }`}
                              title={
                                series.isPublished
                                  ? "Cliquer pour passer en brouillon"
                                  : "Cliquer pour publier"
                              }
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

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="h-8 rounded-xl px-2.5 gap-1 text-[11px] font-semibold"
                            >
                              <Link href={`/admin/series-eo/${series.id}/tasks`}>
                                <ListOrdered className="h-3.5 w-3.5 text-primary" />
                                <span>Tâches</span>
                              </Link>
                            </Button>

                            <Button
                              asChild
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 rounded-xl text-muted-foreground hover:text-foreground"
                              title="Modifier la série"
                            >
                              <Link href={`/admin/series-eo/${series.id}`}>
                                <Pencil className="h-3.5 w-3.5" />
                              </Link>
                            </Button>

                            <form
                              id={`del-series-${series.id}`}
                              action={deleteOralSeriesAction}
                            >
                              <input type="hidden" name="id" value={series.id} />
                            </form>

                            <ConfirmActionDialog
                              trigger={
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 rounded-xl text-muted-foreground hover:text-destructive"
                                  title="Supprimer la série"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              }
                              title={`Supprimer la Série ${series.seriesNumber} ?`}
                              description={`Êtes-vous sûr de vouloir supprimer définitivement la Série ${series.seriesNumber} ("${series.title}") ainsi que toutes ses tâches et scénarios de jeu de rôle associés ? Cette action est irréversible.`}
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

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <AdminTablePagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                basePath="/admin/series-eo"
                search={q ?? undefined}
              />
            )}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
