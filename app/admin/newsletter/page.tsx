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
  addSubscriberAction,
  deleteSubscriberAction,
  toggleSubscriberStatusAction,
} from "./actions";

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
          email: { contains: searchQuery, mode: "insensitive" as const },
        }
      : {}),
  };

  const [totalCount, activeCount] = await Promise.all([
    prisma.newsletterSubscriber.count({ where: whereClause }),
    prisma.newsletterSubscriber.count({ where: { isActive: true } }),
  ]);

  const pagination = getAdminPagination(totalCount, page, 15);

  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: whereClause,
    orderBy: { subscribedAt: "desc" },
    skip: pagination.skip,
    take: pagination.pageSize,
  });

  return (
    <AdminShell>
      <div className="space-y-6">
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
            Ajouter un Abonné Manuellement
          </h2>
          <form action={addSubscriberAction} className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              name="email"
              placeholder="adresse-email@exemple.com"
              required
              className="flex-1"
            />
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

        {/* Table des Abonnés */}
        {subscribers.length === 0 ? (
          <AdminListEmptyState
            kind="newsletter"
            title="Aucun abonné trouvé"
            description={
              searchQuery || sourceFilter || status
                ? "Aucun e-mail ne correspond à votre filtre de recherche actuel."
                : "La base d'abonnés est actuellement vide. Les inscriptions s'ajouteront automatiquement via le footer et le simulateur NCLC."
            }
          />
        ) : (
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/40 text-xs uppercase text-muted-foreground font-semibold border-b">
                  <tr>
                    <th className="px-4 py-3">Adresse E-mail</th>
                    <th className="px-4 py-3">Origine / Source</th>
                    <th className="px-4 py-3">Date d&apos;inscription</th>
                    <th className="px-4 py-3 text-center">Statut</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {subscribers.map((s) => (
                    <tr
                      key={s.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="font-semibold text-foreground font-mono">
                          {s.email}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                          {s.source}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(s.subscribedAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            s.isActive
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400"
                          }`}
                        >
                          {s.isActive ? (
                            <>
                              <CheckCircle2 className="h-3 w-3" />
                              Actif
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3" />
                              Désinscrit
                            </>
                          )}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Toggle Active / Unsubscribe */}
                          <form action={toggleSubscriberStatusAction}>
                            <input type="hidden" name="id" value={s.id} />
                            <Button
                              type="submit"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              title={
                                s.isActive
                                  ? "Marquer comme désinscrit"
                                  : "Réactiver l'abonnement"
                              }
                            >
                              {s.isActive ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </form>

                          <form id={`del-sub-${s.id}`} action={deleteSubscriberAction}>
                            <input type="hidden" name="id" value={s.id} />
                          </form>

                          <ConfirmActionDialog
                            trigger={
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                title="Supprimer l'abonné"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            }
                            title="Supprimer cet abonné ?"
                            description={`Êtes-vous sûr de vouloir supprimer définitivement ${s.email} de la base de données ?`}
                            confirmLabel="Supprimer"
                            formId={`del-sub-${s.id}`}
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
              basePath="/admin/newsletter"
              search={searchQuery ?? undefined}
            />
          </div>
        )}
      </div>
    </AdminShell>
  );
}
