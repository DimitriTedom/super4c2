import Link from "next/link";
import {
  MessageSquareQuote,
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Filter,
  Star,
  Globe,
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmActionDialog } from "@/components/admin/ConfirmActionDialog";
import { AdminTablePagination } from "@/components/admin/AdminTablePagination";
import { AdminListEmptyState } from "@/components/admin/AdminListEmptyState";
import { prisma } from "@/lib/prisma";
import { getAdminPagination } from "@/lib/admin-pagination";
import { toOptionalString } from "@/lib/admin-crud-utils";
import {
  deleteTestimonialAction,
  toggleTestimonialActiveAction,
  toggleTestimonialFeaturedAction,
} from "./actions";

export const metadata = {
  title: "Témoignages Candidats — Back-Office | Super4C2",
};

interface TestimonialsPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    country?: string;
    status?: string;
  }>;
}

const COUNTRIES = [
  "Tous",
  "Cameroun",
  "Côte d'Ivoire",
  "Sénégal",
  "Maroc",
  "Algérie",
  "Tunisie",
  "France",
];

export default async function AdminTestimonialsPage({
  searchParams,
}: TestimonialsPageProps) {
  const { page, q, country, status } = await searchParams;

  const searchQuery = toOptionalString(q);
  const countryFilter =
    country && country !== "Tous" ? country : undefined;

  let activeFilter: boolean | undefined = undefined;
  if (status === "active") activeFilter = true;
  if (status === "inactive") activeFilter = false;

  const whereClause = {
    ...(countryFilter ? { country: countryFilter } : {}),
    ...(activeFilter !== undefined ? { isActive: activeFilter } : {}),
    ...(searchQuery
      ? {
          OR: [
            { candidateName: { contains: searchQuery, mode: "insensitive" as const } },
            { quote: { contains: searchQuery, mode: "insensitive" as const } },
            { achievedNclc: { contains: searchQuery, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const totalCount = await prisma.testimonial.count({ where: whereClause });
  const pagination = getAdminPagination(totalCount, page, 10);

  const testimonials = await prisma.testimonial.findMany({
    where: whereClause,
    orderBy: [
      { order: "asc" },
      { createdAt: "desc" },
    ],
    skip: pagination.skip,
    take: pagination.pageSize,
  });

  return (
    <AdminShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <MessageSquareQuote className="h-6 w-6 text-primary" />
              Témoignages Candidats & Réussites NCLC
            </h1>
            <p className="text-sm text-muted-foreground">
              Gérez les avis vérifiés des candidats ayant validé leur seuil d&apos;admissibilité Entrée Express grâce à Super4C2.
            </p>
          </div>
          <Link href="/admin/temoignages/ajouter">
            <Button className="gap-2 font-semibold shadow-sm">
              <Plus className="h-4 w-4" />
              Ajouter un Témoignage
            </Button>
          </Link>
        </div>

        {/* Barre de Filtres & Recherche */}
        <div className="rounded-xl border bg-card p-4 shadow-sm space-y-4">
          <form method="GET" className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={searchQuery ?? ""}
                placeholder="Rechercher par candidat, mot-clé dans la citation ou NCLC..."
                className="pl-9"
              />
            </div>
            {country && <input type="hidden" name="country" value={country} />}
            {status && <input type="hidden" name="status" value={status} />}
            <Button type="submit" variant="secondary" className="gap-1.5 shrink-0">
              <Filter className="h-4 w-4" />
              Filtrer
            </Button>
            {Boolean(searchQuery || countryFilter || status) && (
              <Link href="/admin/temoignages">
                <Button variant="ghost" type="button" className="shrink-0">
                  Réinitialiser
                </Button>
              </Link>
            )}
          </form>

          {/* Filtres par Pays */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-muted-foreground font-medium shrink-0 mr-1">
              Pays :
            </span>
            {COUNTRIES.map((c) => {
              const isSelected =
                (!country && c === "Tous") || country === c;
              const newParams = new URLSearchParams();
              if (searchQuery) newParams.set("q", searchQuery);
              if (c !== "Tous") newParams.set("country", c);
              if (status) newParams.set("status", status);

              return (
                <Link
                  key={c}
                  href={`/admin/temoignages?${newParams.toString()}`}
                  className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                    isSelected
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {c}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Table des Témoignages */}
        {testimonials.length === 0 ? (
          <AdminListEmptyState
            kind="testimonials"
            title="Aucun témoignage trouvé"
            description={
              searchQuery || countryFilter || status
                ? "Aucun résultat ne correspond à vos critères de recherche actuels."
                : "Commencez par ajouter le premier témoignage d'un candidat ayant obtenu son NCLC 7+."
            }
            actionHref="/admin/temoignages/ajouter"
            actionLabel="Ajouter un Témoignage"
          />
        ) : (
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/40 text-xs uppercase text-muted-foreground font-semibold border-b">
                  <tr>
                    <th className="px-4 py-3 w-12 text-center">Ordre</th>
                    <th className="px-4 py-3">Candidat</th>
                    <th className="px-4 py-3">Pays & Score</th>
                    <th className="px-4 py-3">Citation (Aperçu)</th>
                    <th className="px-4 py-3 text-center">Étoiles</th>
                    <th className="px-4 py-3 text-center">Statut</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {testimonials.map((t) => (
                    <tr
                      key={t.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3 text-center font-mono text-xs text-muted-foreground">
                        #{t.order}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {t.avatar ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={t.avatar}
                              alt={t.candidateName}
                              className="h-9 w-9 rounded-full object-cover border"
                            />
                          ) : (
                            <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-xs text-primary shrink-0">
                              {t.candidateName.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-1.5 font-semibold text-foreground">
                              {t.candidateName}
                              {t.isFeatured && (
                                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              Cible: {t.targetScore}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Globe className="h-3 w-3" />
                            {t.country}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              {t.achievedNclc}
                            </span>
                            {t.crsPointsGained > 0 && (
                              <span className="text-[11px] text-muted-foreground font-mono">
                                +{t.crsPointsGained} CRS
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 max-w-xs md:max-w-md">
                        <p className="text-xs text-muted-foreground line-clamp-2 italic">
                          &ldquo;{t.quote}&rdquo;
                        </p>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <div className="inline-flex items-center gap-0.5 text-amber-500">
                          {Array.from({ length: t.rating }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-500" />
                          ))}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                            t.isActive
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400"
                          }`}
                        >
                          {t.isActive ? "En ligne" : "Masqué"}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Toggle Featured */}
                          <form action={toggleTestimonialFeaturedAction}>
                            <input type="hidden" name="id" value={t.id} />
                            <Button
                              type="submit"
                              variant="ghost"
                              size="icon"
                              className={`h-8 w-8 ${
                                t.isFeatured
                                  ? "text-amber-500 hover:text-amber-600"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                              title={
                                t.isFeatured
                                  ? "Retirer de la une"
                                  : "Mettre en avant"
                              }
                            >
                              <Star
                                className={`h-4 w-4 ${
                                  t.isFeatured ? "fill-amber-500" : ""
                                }`}
                              />
                            </Button>
                          </form>

                          {/* Toggle Active */}
                          <form action={toggleTestimonialActiveAction}>
                            <input type="hidden" name="id" value={t.id} />
                            <Button
                              type="submit"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              title={t.isActive ? "Masquer" : "Activer"}
                            >
                              {t.isActive ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </form>

                          {/* Modifier */}
                          <Link href={`/admin/temoignages/${t.id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              title="Modifier"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>

                          <form id={`del-testimonial-${t.id}`} action={deleteTestimonialAction}>
                            <input type="hidden" name="id" value={t.id} />
                          </form>

                          {/* Supprimer Dialog */}
                          <ConfirmActionDialog
                            trigger={
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                title="Supprimer le témoignage"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            }
                            title="Supprimer ce témoignage ?"
                            description={`Êtes-vous sûr de vouloir supprimer définitivement le témoignage de ${t.candidateName} ? Cette action est irréversible.`}
                            confirmLabel="Supprimer définitivement"
                            formId={`del-testimonial-${t.id}`}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <AdminTablePagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              basePath="/admin/temoignages"
              search={searchQuery ?? undefined}
            />
          </div>
        )}
      </div>
    </AdminShell>
  );
}
