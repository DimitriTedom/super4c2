import Link from "next/link";
import {
  Headphones,
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  ListOrdered,
  Sparkles,
  Lock,
  Volume2,
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
  deleteSeriesCoAction,
  toggleSeriesCoPublishAction,
} from "./actions";

export const metadata = {
  title: "Séries Compréhension Orale (CO) — Back-Office | Super4C2",
};

interface SeriesCoPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    status?: string;
  }>;
}

export default async function SeriesCoPage({ searchParams }: SeriesCoPageProps) {
  const { page: rawPage, q: rawQ, status: rawStatus } = await searchParams;
  const q = toOptionalString(rawQ);
  const status = toOptionalString(rawStatus);

  const whereClause: Prisma.ExamSeriesWhereInput = {
    examType: "TCF_CANADA",
    discipline: "COMPREHENSION_ORALE",
    ...(q && {
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        ...(Number.isInteger(Number(q))
          ? [{ seriesNumber: Number(q) }]
          : []),
      ],
    }),
    ...(status === "published" && { isPublished: true }),
    ...(status === "draft" && { isPublished: false }),
  };

  let totalItems = 0;
  let totalPublished = 0;
  let totalDemo = 0;
  let seriesList: any[] = [];
  let dbError: string | null = null;

  try {
    const [tItems, tPub, tDem] = await Promise.all([
      prisma.examSeries.count({ where: whereClause }),
      prisma.examSeries.count({
        where: {
          examType: "TCF_CANADA",
          discipline: "COMPREHENSION_ORALE",
          isPublished: true,
        },
      }),
      prisma.examSeries.count({
        where: {
          examType: "TCF_CANADA",
          discipline: "COMPREHENSION_ORALE",
          isFreeDemo: true,
        },
      }),
    ]);
    totalItems = tItems;
    totalPublished = tPub;
    totalDemo = tDem;

    const paginationData = getAdminPagination(totalItems, rawPage, 10);

    seriesList = await prisma.examSeries.findMany({
      where: whereClause,
      orderBy: { seriesNumber: "asc" },
      skip: paginationData.skip,
      take: paginationData.pageSize,
      include: {
        _count: {
          select: { questions: true },
        },
      },
    });
  } catch (error) {
    console.error("Erreur chargement séries CO :", error);
    dbError = "Impossible de récupérer les séries en direct. Veuillez vérifier la connexion base de données.";
  }

  const pagination = getAdminPagination(totalItems, rawPage, 10);

  return (
    <AdminShell>
      <div className="space-y-6">
        {dbError && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-800 dark:text-amber-200">
            {dbError}
          </div>
        )}
        {/* COMING SOON STRATEGIC BANNER */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 sm:p-5 text-amber-900 dark:text-amber-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm sm:text-base text-foreground">
                  Module Compréhension Orale · Bientôt Disponible (Coming Soon)
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-full bg-amber-500 text-white shadow-xs">
                  Coming Soon
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-3xl leading-relaxed">
                Conformément à la stratégie d&apos;excellence Super4C2 focalisée sur les épreuves discriminantes (Expression Écrite &amp; Expression Orale), ce module permet de pré-configurer et d&apos;uploader les pistes audio FEI avant leur ouverture publique officielle aux candidats.
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <Button asChild size="sm" className="gap-2 font-bold shadow-xs">
              <Link href="/admin/series-co/ajouter">
                <Plus className="h-4 w-4" />
                <span>Créer une Série CO</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* 4 KPI CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="rounded-2xl border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Total Séries CO
              </span>
              <Headphones className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-mono text-2xl font-bold tracking-tight text-foreground">
                {totalItems}
              </span>
              <span className="text-xs text-muted-foreground">séries</span>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Prêtes (Publiées)
              </span>
              <Eye className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-mono text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                {totalPublished}
              </span>
              <span className="text-xs text-muted-foreground">actives</span>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Accès Démo
              </span>
              <Sparkles className="h-4 w-4 text-purple-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-mono text-2xl font-bold tracking-tight text-purple-600 dark:text-purple-400">
                {totalDemo}
              </span>
              <span className="text-xs text-muted-foreground">gratuites</span>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Format Officiel FEI
              </span>
              <Volume2 className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-mono text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                39 QCM
              </span>
              <span className="text-xs text-muted-foreground">~35 min d&apos;écoute</span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <form method="GET" className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              name="q"
              defaultValue={q ?? ""}
              placeholder="Rechercher par titre ou numéro..."
              className="pl-9 h-9 text-xs rounded-xl bg-card"
            />
          </form>

          <div className="flex items-center gap-1.5 bg-card p-1 rounded-xl border">
            <Button
              asChild
              variant={!status ? "secondary" : "ghost"}
              size="sm"
              className="text-xs h-8"
            >
              <Link href="/admin/series-co">Toutes</Link>
            </Button>
            <Button
              asChild
              variant={status === "published" ? "secondary" : "ghost"}
              size="sm"
              className="text-xs h-8"
            >
              <Link href="/admin/series-co?status=published">Publiées</Link>
            </Button>
            <Button
              asChild
              variant={status === "draft" ? "secondary" : "ghost"}
              size="sm"
              className="text-xs h-8"
            >
              <Link href="/admin/series-co?status=draft">Brouillons</Link>
            </Button>
          </div>
        </div>

        {/* Table Container */}
        {seriesList.length === 0 ? (
          <AdminListEmptyState
            kind="series-co"
            title="Aucune série de Compréhension Orale trouvée"
            description="Créez votre première série CO (marquée Coming Soon) pour y associer des fichiers audios et les 39 questions FEI."
            actionLabel="Créer une Série CO"
            actionHref="/admin/series-co/ajouter"
          />
        ) : (
          <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b bg-muted/30 text-muted-foreground font-semibold">
                    <th className="py-3 px-4">Numéro</th>
                    <th className="py-3 px-4">Titre de la Série CO</th>
                    <th className="py-3 px-4 text-center">Questions &amp; Audio</th>
                    <th className="py-3 px-4 text-center">Durée</th>
                    <th className="py-3 px-4 text-center">Disponibilité</th>
                    <th className="py-3 px-4 text-center">Statut</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {seriesList.map((series) => {
                    const questionCount = series._count.questions;
                    const isComplete = questionCount === 39;

                    return (
                      <tr
                        key={series.id}
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-xs">
                            #{series.seriesNumber}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <p className="font-bold text-foreground text-xs sm:text-sm">
                              {series.title}
                            </p>
                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                              <span>TCF Canada · Compréhension Orale</span>
                              {series.isFreeDemo && (
                                <>
                                  <span>•</span>
                                  <span className="text-purple-600 dark:text-purple-400 font-semibold">
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
                            <Link href={`/admin/series-co/${series.id}/questions`}>
                              <span
                                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${
                                  isComplete
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                                }`}
                              >
                                <ListOrdered className="h-3 w-3" />
                                {questionCount} / 39 questions
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

                        {/* Coming Soon Indicator */}
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-mono">
                            <Lock className="h-2.5 w-2.5" />
                            Coming Soon
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <form action={toggleSeriesCoPublishAction}>
                            <input type="hidden" name="id" value={series.id} />
                            <Button
                              type="submit"
                              variant="ghost"
                              size="sm"
                              className={`h-7 px-2 rounded-full text-[11px] font-bold ${
                                series.isPublished
                                  ? "text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 bg-emerald-500/10"
                                  : "text-muted-foreground hover:text-foreground bg-muted"
                              }`}
                            >
                              {series.isPublished ? (
                                <span className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" /> Publiée
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <EyeOff className="h-3 w-3" /> Brouillon
                                </span>
                              )}
                            </Button>
                          </form>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              asChild
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="Modifier les paramètres"
                            >
                              <Link href={`/admin/series-co/${series.id}`}>
                                <Pencil className="h-3.5 w-3.5" />
                              </Link>
                            </Button>

                            <form
                              id={`del-series-${series.id}`}
                              action={deleteSeriesCoAction}
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
                              title={`Supprimer la Série CO ${series.seriesNumber} ?`}
                              description={`Êtes-vous sûr de vouloir supprimer définitivement la Série ${series.seriesNumber} (${series.title}) et ses questions d'écoute associées ? Cette action est irréversible.`}
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
              basePath="/admin/series-co"
              search={q ?? undefined}
            />
          </div>
        )}
      </div>
    </AdminShell>
  );
}
