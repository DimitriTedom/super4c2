import Link from "next/link";
import {
  Mail,
  Search,
  Filter,
  Download,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  EyeOff,
  Eye,
  Phone,
  MessageCircle,
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminTablePagination } from "@/components/admin/AdminTablePagination";
import { NewsletterListClient } from "@/components/admin/newsletter-list-client";
import { prisma } from "@/lib/prisma";
import { getAdminPagination } from "@/lib/admin-pagination";
import { toOptionalString } from "@/lib/admin-crud-utils";
import { addSubscriberAction } from "./actions";

export const metadata = {
  title: "Abonnés Newsletter — Back-Office | Super4C2",
};

interface NewsletterPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    source?: string;
    status?: string;
  }>;
}

const SOURCES = [
  { value: "Toutes", label: "Toutes les sources" },
  { value: "footer", label: "Footer Site" },
  { value: "nclc_calculator", label: "Simulateur NCLC" },
  { value: "test_gratuit", label: "Test Gratuit" },
  { value: "blog", label: "Articles Blog" },
  { value: "admin_manual", label: "Ajout Manuel" },
];

export default async function AdminNewsletterPage({
  searchParams,
}: NewsletterPageProps) {
  const { page, q, source, status } = await searchParams;

  const searchQuery = toOptionalString(q);
  const sourceFilter =
    source && source !== "Toutes" ? source : undefined;

  let activeFilter: boolean | undefined = undefined;
  if (status === "active") activeFilter = true;
  if (status === "inactive") activeFilter = false;

  const whereClause = {
    ...(sourceFilter ? { source: sourceFilter } : {}),
    ...(activeFilter !== undefined ? { isActive: activeFilter } : {}),
    ...(searchQuery
      ? {
          OR: [
            { email: { contains: searchQuery, mode: "insensitive" as const } },
            { name: { contains: searchQuery, mode: "insensitive" as const } },
            { phone: { contains: searchQuery, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  let totalCount = 0;
  let activeCount = 0;
  let subscribers: any[] = [];
  let dbError: string | null = null;

  try {
    const [tCount, aCount] = await Promise.all([
      prisma.newsletterSubscriber.count({ where: whereClause }),
      prisma.newsletterSubscriber.count({ where: { isActive: true } }),
    ]);
    totalCount = tCount;
    activeCount = aCount;

    const paginationData = getAdminPagination(totalCount, page, 15);

    subscribers = await prisma.newsletterSubscriber.findMany({
      where: whereClause,
      orderBy: { subscribedAt: "desc" },
      skip: paginationData.skip,
      take: paginationData.pageSize,
    });
  } catch (error) {
    console.error("Erreur chargement de la newsletter :", error);
    dbError = "Impossible de récupérer les abonnés en direct. Veuillez vérifier la connexion base de données.";
  }

  const pagination = getAdminPagination(totalCount, page, 15);

  return (
    <AdminShell>
      <div className="space-y-6">
        {dbError && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-800 dark:text-amber-200">
            {dbError}
          </div>
        )}
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <Mail className="h-6 w-6 text-primary" />
                Abonnés Newsletter & Leads NCLC
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                {activeCount} actifs
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Liste de diffusion des candidats abonnés aux fiches de synthèse, conseils Entrée Express et actualités TCF.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a href="/api/admin/newsletter/export" download>
              <Button variant="outline" className="gap-2 font-medium">
                <Download className="h-4 w-4" />
                Exporter CSV
              </Button>
            </a>
          </div>
        </div>

        {/* Formulaire Rapide d'Ajout d'un Abonné */}
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
            <Plus className="h-3.5 w-3.5 text-primary" />
            Ajouter un Abonné Manuellement (avec WhatsApp)
          </h2>
          <form action={addSubscriberAction} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <Input
              type="text"
              name="name"
              placeholder="Nom du candidat"
              className="text-xs"
            />
            <Input
              type="email"
              name="email"
              placeholder="adresse-email@exemple.com"
              required
              className="text-xs"
            />
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="tel"
                name="phone"
                placeholder="WhatsApp (ex: +237 6... ou +33...)"
                className="pl-9 text-xs"
              />
            </div>
            <input type="hidden" name="source" value="admin_manual" />
            <Button type="submit" className="gap-2 shrink-0">
              <Plus className="h-4 w-4" />
              Inscrire
            </Button>
          </form>
        </div>

        {/* Barre de Recherche & Filtres */}
        <div className="rounded-xl border bg-card p-4 shadow-sm space-y-4">
          <form method="GET" className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={searchQuery ?? ""}
                placeholder="Rechercher par adresse e-mail..."
                className="pl-9"
              />
            </div>
            {source && <input type="hidden" name="source" value={source} />}
            {status && <input type="hidden" name="status" value={status} />}
            <Button type="submit" variant="secondary" className="gap-1.5 shrink-0">
              <Filter className="h-4 w-4" />
              Filtrer
            </Button>
            {Boolean(searchQuery || sourceFilter || status) && (
              <Link href="/admin/newsletter">
                <Button variant="ghost" type="button" className="shrink-0">
                  Réinitialiser
                </Button>
              </Link>
            )}
          </form>

          {/* Filtres par Source & Statut */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-muted-foreground font-medium shrink-0 mr-1">
                Source :
              </span>
              {SOURCES.map((s) => {
                const isSelected =
                  (!source && s.value === "Toutes") || source === s.value;
                const newParams = new URLSearchParams();
                if (searchQuery) newParams.set("q", searchQuery);
                if (s.value !== "Toutes") newParams.set("source", s.value);
                if (status) newParams.set("status", status);

                return (
                  <Link
                    key={s.value}
                    href={`/admin/newsletter?${newParams.toString()}`}
                    className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                      isSelected
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {s.label}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-muted-foreground font-medium mr-1">
                Statut :
              </span>
              {[
                { label: "Tous", val: "" },
                { label: "Actifs", val: "active" },
                { label: "Désinscrits", val: "inactive" },
              ].map((st) => {
                const isSelected =
                  (!status && st.val === "") || status === st.val;
                const newParams = new URLSearchParams();
                if (searchQuery) newParams.set("q", searchQuery);
                if (source) newParams.set("source", source);
                if (st.val) newParams.set("status", st.val);

                return (
                  <Link
                    key={st.val}
                    href={`/admin/newsletter?${newParams.toString()}`}
                    className={`px-2.5 py-1 rounded-full transition-colors ${
                      isSelected
                        ? "bg-secondary text-secondary-foreground font-semibold border"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {st.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Table interactive avec Sélection Multiple & Actions en Lot */}
        <NewsletterListClient
          subscribers={subscribers.map((s) => ({
            id: s.id,
            email: s.email,
            name: s.name,
            phone: s.phone,
            source: s.source,
            isActive: s.isActive,
            subscribedAt: s.subscribedAt,
            crsScore: s.crsScore,
            nclcProfile: s.nclcProfile,
          }))}
          searchQuery={searchQuery ?? undefined}
          sourceFilter={sourceFilter ?? undefined}
          statusFilter={status ?? undefined}
        />

        {/* Pagination du Tableau */}
        {subscribers.length > 0 && (
          <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
            <AdminTablePagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              basePath="/admin/newsletter"
              search={searchQuery ?? undefined}
            />
          </div>
        )}
      </div>
    </AdminShell>
  );
}
