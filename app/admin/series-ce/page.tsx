import Link from "next/link";
import {
  BookOpen,
  Plus,
  Search,
  ListChecks,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminListEmptyState } from "@/components/admin/AdminListEmptyState";
import { ConfirmActionDialog } from "@/components/admin/ConfirmActionDialog";
import { AiSeriesGeneratorDialog } from "@/components/admin/ai-series-generator-dialog";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { deleteSeriesCeAction, toggleSeriesCePublishAction } from "./actions";

export const metadata = {
  title: "Séries de Compréhension Écrite — Back-Office | Super4C2",
};

interface SeriesCeListPageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function SeriesCeListPage({ searchParams }: SeriesCeListPageProps) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";

  const where = {
    discipline: "COMPREHENSION_ECRITE" as const,
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            ...(Number.isFinite(Number(search))
              ? [{ seriesNumber: Number(search) }]
              : []),
          ],
        }
      : {}),
  };

  const seriesList = await prisma.examSeries.findMany({
    where,
    include: {
      _count: {
        select: { questions: true },
      },
    },
    orderBy: { seriesNumber: "asc" },
  });

  const nextSeriesNumber =
    seriesList.length > 0
      ? Math.max(...seriesList.map((s) => s.seriesNumber)) + 1
      : 102;

  return (
    <AdminShell>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 mb-1.5">
              <BookOpen className="h-3 w-3" />
              Épreuve Phare · 60 min · 39 Questions
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Séries de Compréhension Écrite (CE)
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Gérez les séries officielles de Compréhension Écrite, leurs 39 questions authentiques et le décodage des pièges FEI.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <AiSeriesGeneratorDialog initialSeriesNumber={nextSeriesNumber} />
            <Button asChild className="gap-2 font-bold shadow-xs">
              <Link href="/admin/series-ce/ajouter">
                <Plus className="h-4 w-4" />
                <span>Nouvelle Série CE</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-3 rounded-2xl border shadow-xs">
          <form method="get" className="flex items-center gap-2 w-full sm:w-80">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                name="search"
                defaultValue={search}
                placeholder="Rechercher par numéro ou titre..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border bg-muted/30 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
              />
            </div>
          </form>

          <div className="flex items-center gap-2 text-xs text-muted-foreground w-full sm:w-auto justify-end">
            <span className="font-semibold text-foreground">{seriesList.length}</span> série(s) répertoriée(s)
          </div>
        </div>

        {/* Series Table / List */}
        {seriesList.length === 0 ? (
          <AdminListEmptyState
            kind="series-ce"
            title={search ? "Aucune série trouvée" : "Aucune série CE pour le moment"}
            description={
              search
                ? `Aucune série ne correspond à la recherche "${search}".`
                : "Commencez par créer la Série 101 avec ses 39 questions officielles."
            }
            actionHref="/admin/series-ce/ajouter"
            actionLabel="Créer une Série CE"
          />
        ) : (
          <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="py-3 px-4">Série</th>
                    <th className="py-3 px-4">Titre de l&apos;Épreuve</th>
                    <th className="py-3 px-4">Questions</th>
                    <th className="py-3 px-4">Durée</th>
                    <th className="py-3 px-4">Statut</th>
                    <th className="py-3 px-4">Accès</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {seriesList.map((series) => {
                    const isComplete = series._count.questions === 39;
                    return (
                      <tr key={series.id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-display font-black text-sm text-foreground">
                              Série {series.seriesNumber}
                            </span>
                            {series.seriesNumber === 101 && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                                <Sparkles className="h-2.5 w-2.5" /> Flagship
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-medium text-foreground max-w-xs truncate">
                          {series.title}
                        </td>

                        <td className="py-3.5 px-4">
                          <Link
                            href={`/admin/series-ce/${series.id}/questions`}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all hover:scale-105 ${
                              isComplete
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                            }`}
                          >
                            <ListChecks className="h-3.5 w-3.5" />
                            <span>
                              {series._count.questions} / 39 questions
                            </span>
                          </Link>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-muted-foreground">
                          {Math.round(series.durationSeconds / 60)} min
                        </td>

                        <td className="py-3.5 px-4">
                          <form action={toggleSeriesCePublishAction}>
                            <input type="hidden" name="id" value={series.id} />
                            <button
                              type="submit"
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                                series.isPublished
                                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 hover:bg-emerald-500/20"
                                  : "bg-slate-500/10 text-slate-500 border border-slate-500/30 hover:bg-slate-500/20"
                              }`}
                              title="Cliquer pour basculer la visibilité"
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

                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              series.isFreeDemo
                                ? "bg-cyan-500/10 text-cyan-600 border border-cyan-500/20"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {series.isFreeDemo ? "Démo Gratuite" : "Pass Standard"}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              asChild
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                              title="Voir en vue candidat (Épreuve réelle)"
                            >
                              <Link href={`/examens/demo-${series.seriesNumber}-ce`} target="_blank">
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Link>
                            </Button>

                            <Button asChild variant="outline" size="sm" className="h-8 gap-1.5 font-bold text-xs">
                              <Link href={`/admin/series-ce/${series.id}/questions`}>
                                <ListChecks className="h-3.5 w-3.5 text-primary" />
                                <span className="hidden sm:inline">Questions</span>
                              </Link>
                            </Button>

                            <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0" title="Modifier la série">
                              <Link href={`/admin/series-ce/${series.id}`}>
                                <Pencil className="h-3.5 w-3.5" />
                              </Link>
                            </Button>

                            <form id={`del-${series.id}`} action={deleteSeriesCeAction}>
                              <input type="hidden" name="id" value={series.id} />
                            </form>
                            <ConfirmActionDialog
                              formId={`del-${series.id}`}
                              title={`Supprimer la Série ${series.seriesNumber} ?`}
                              description="Cette action est irréversible. Toutes les 39 questions associées et l'historique des tentatives seront définitivement effacés."
                              confirmLabel="Supprimer définitivement"
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
        )}
      </div>
    </AdminShell>
  );
}
