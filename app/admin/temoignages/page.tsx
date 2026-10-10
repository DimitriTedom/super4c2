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
import { TestimonialTableClient } from "@/components/admin/testimonial-table-client";
import { prisma } from "@/lib/prisma";
import { getAdminPagination } from "@/lib/admin-pagination";
import { toOptionalString } from "@/lib/admin-crud-utils";

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

        {/* Table des Témoignages avec Batch Actions */}
        <TestimonialTableClient
          testimonials={testimonials}
          pagination={pagination}
          searchQuery={searchQuery ?? undefined}
          countryFilter={countryFilter ?? undefined}
          statusFilter={status ?? undefined}
        />
      </div>
    </AdminShell>
  );
}
