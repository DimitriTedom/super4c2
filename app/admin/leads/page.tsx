import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  AlertCircle,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LeadListClient } from "@/components/admin/lead-list-client";
import { prisma } from "@/lib/prisma";
import { getAdminPagination } from "@/lib/admin-pagination";
import { toOptionalString } from "@/lib/admin-crud-utils";
import { LeadStatus } from "@prisma/client";

export const metadata = {
  title: "Demandes de Contact — Back-Office | Super4C2",
};

interface LeadsPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    intent?: string;
    status?: string;
  }>;
}

const INTENTS = [
  { value: "Toutes", label: "Toutes les demandes" },
  { value: "CANDIDATE", label: "Candidats TCF" },
  { value: "URGENT", label: "Urgences Examen" },
  { value: "TECH", label: "Support Technique" },
];

export default async function AdminLeadsPage({ searchParams }: LeadsPageProps) {
  const { page, q, intent, status } = await searchParams;

  const searchQuery = toOptionalString(q);
  const intentFilter = intent && intent !== "Toutes" ? intent : undefined;

  let statusFilter: LeadStatus | undefined = undefined;
  if (
    status &&
    Object.values(LeadStatus).includes(status as LeadStatus)
  ) {
    statusFilter = status as LeadStatus;
  }

  const whereClause = {
    ...(intentFilter ? { intent: intentFilter } : {}),
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(searchQuery
      ? {
          OR: [
            { name: { contains: searchQuery, mode: "insensitive" as const } },
            { email: { contains: searchQuery, mode: "insensitive" as const } },
            { phone: { contains: searchQuery, mode: "insensitive" as const } },
            { message: { contains: searchQuery, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  let totalCount = 0;
  let nouveauCount = 0;
  let enCoursCount = 0;
  let resoluCount = 0;
  let leads: any[] = [];
  let dbError: string | null = null;

  try {
    const [tCount, nCount, eCount, rCount] = await Promise.all([
      prisma.contactLead.count({ where: whereClause }),
      prisma.contactLead.count({ where: { status: "NOUVEAU" } }),
      prisma.contactLead.count({ where: { status: "EN_COURS" } }),
      prisma.contactLead.count({ where: { status: "RESOLU" } }),
    ]);
    totalCount = tCount;
    nouveauCount = nCount;
    enCoursCount = eCount;
    resoluCount = rCount;

    const pagination = getAdminPagination(totalCount, page, 10);

    leads = await prisma.contactLead.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip: pagination.skip,
      take: pagination.pageSize,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des leads :", error);
    dbError = "Impossible de récupérer les demandes en direct. Veuillez vérifier la connexion base de données.";
  }

  const pagination = getAdminPagination(totalCount, page, 10);

  return (
    <AdminShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              Demandes de Contact
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gérez les demandes d&apos;accompagnement, urgences d&apos;examen et messages envoyés par les candidats.
            </p>
          </div>
        </div>

        {dbError && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-800 dark:text-amber-200">
            {dbError}
          </div>
        )}

        {/* Statistiques Rapides */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border bg-card p-4 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Nouvelles Demandes
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                {nouveauCount}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>

          <div className="rounded-xl border bg-card p-4 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                En Traitement
              </p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                {enCoursCount}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>

          <div className="rounded-xl border bg-card p-4 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">
                Dossiers Résolus
              </p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {resoluCount}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Barre de Recherche & Filtres */}
        <div className="rounded-xl border bg-card p-4 shadow-sm space-y-4">
          <form method="GET" className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={searchQuery ?? ""}
                placeholder="Rechercher par nom, email, téléphone ou mot-clé dans le message..."
                className="pl-9"
              />
            </div>
            {intent && <input type="hidden" name="intent" value={intent} />}
            {status && <input type="hidden" name="status" value={status} />}
            <Button type="submit" variant="secondary" className="gap-1.5 shrink-0">
              <Filter className="h-4 w-4" />
              Filtrer
            </Button>
            {Boolean(searchQuery || intentFilter || statusFilter) && (
              <Link href="/admin/leads">
                <Button variant="ghost" type="button" className="shrink-0">
                  Réinitialiser
                </Button>
              </Link>
            )}
          </form>

          {/* Filtres par Intent & Statut */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-muted-foreground font-medium shrink-0 mr-1">
                Type :
              </span>
              {INTENTS.map((it) => {
                const isSelected =
                  (!intent && it.value === "Toutes") || intent === it.value;
                const newParams = new URLSearchParams();
                if (searchQuery) newParams.set("q", searchQuery);
                if (it.value !== "Toutes") newParams.set("intent", it.value);
                if (status) newParams.set("status", status);

                return (
                  <Link
                    key={it.value}
                    href={`/admin/leads?${newParams.toString()}`}
                    className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                      isSelected
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {it.label}
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
                { label: "Nouveaux", val: "NOUVEAU" },
                { label: "En cours", val: "EN_COURS" },
                { label: "Résolus", val: "RESOLU" },
                { label: "Archivés", val: "ARCHIVE" },
              ].map((st) => {
                const isSelected =
                  (!status && st.val === "") || status === st.val;
                const newParams = new URLSearchParams();
                if (searchQuery) newParams.set("q", searchQuery);
                if (intent) newParams.set("intent", intent);
                if (st.val) newParams.set("status", st.val);

                return (
                  <Link
                    key={st.val}
                    href={`/admin/leads?${newParams.toString()}`}
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

        {/* Liste des Demandes avec Batch Actions */}
        <LeadListClient
          leads={leads}
          pagination={pagination}
          searchQuery={searchQuery ?? undefined}
          intentFilter={intentFilter}
          statusFilter={statusFilter}
        />
      </div>
    </AdminShell>
  );
}
