import Link from "next/link";
import {
  Search,
  Users as UsersIcon,
  CalendarClock,
  Target,
  Clock,
  GraduationCap,
  MessageCircle,
} from "lucide-react";

import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { AdminTablePagination } from "@/components/admin/AdminTablePagination";
import { AdminExportButton } from "@/components/admin/admin-export-button";
import { UserListClient } from "@/components/admin/user-list-client";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Candidats inscrits — Back-Office | Super4C2",
};

export const dynamic = "force-dynamic";

const PAGE_SIZE = 15;

interface UsersPageProps {
  searchParams: Promise<{ q?: string; page?: string; filter?: string }>;
}

function formatDate(date: Date | null | undefined) {
  if (!date) return "—";
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function AdminUsersPage({ searchParams }: UsersPageProps) {
  const { q, page, filter } = await searchParams;
  const query = q?.trim() ?? "";
  const currentFilter = filter || "all";
  const currentPage = Math.max(1, Number.parseInt(page ?? "1", 10) || 1);

  const baseSearchWhere = query
    ? {
        OR: [
          { email: { contains: query, mode: "insensitive" as const } },
          { profile: { displayName: { contains: query, mode: "insensitive" as const } } },
        ],
      }
    : {};

  const filterWhere: any = {};
  if (currentFilter === "zero_attempts") {
    filterWhere.attempts = { none: {} };
  } else if (currentFilter === "active") {
    filterWhere.attempts = { some: {} };
  } else if (currentFilter === "has_phone") {
    filterWhere.profile = { phone: { not: null } };
  }

  const where = {
    ...baseSearchWhere,
    ...filterWhere,
  };

  let total = 0;
  let allCount = 0;
  let zeroCount = 0;
  let activeCount = 0;
  let hasPhoneCount = 0;
  let users: any[] = [];
  let dbError: string | null = null;

  try {
    const [t, uList, totalAll, totalZero, totalActive, totalPhone] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (currentPage - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: {
          profile: true,
          attempts: {
            select: {
              id: true,
              discipline: true,
              rawScore: true,
              tcfScaledScore: true,
              nclcLevel: true,
              crsPointsUnlocked: true,
              createdAt: true,
            },
            orderBy: { createdAt: "desc" },
          },
          _count: { select: { attempts: true } },
        },
      }),
      prisma.user.count({ where: baseSearchWhere }),
      prisma.user.count({ where: { ...baseSearchWhere, attempts: { none: {} } } }),
      prisma.user.count({ where: { ...baseSearchWhere, attempts: { some: {} } } }),
      prisma.user.count({ where: { ...baseSearchWhere, profile: { phone: { not: null } } } }),
    ]);
    total = t;
    users = uList;
    allCount = totalAll;
    zeroCount = totalZero;
    activeCount = totalActive;
    hasPhoneCount = totalPhone;
  } catch (error) {
    console.error("Erreur lors du chargement des candidats :", error);
    dbError = "Impossible de récupérer les candidats en direct. Veuillez vérifier la connexion base de données.";
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const adminEmails = (process.env.ADMIN_EMAILS ?? "admin@super4c2.com")
    .split(",")
    .map((e) => e.trim().toLowerCase());

  const userRows = users.map((u) => ({
    id: u.id,
    email: u.email,
    createdAt: u.createdAt,
    displayName: u.profile?.displayName || null,
    targetNclc: u.profile?.targetNclc ?? 7,
    examDate: u.profile?.examDate || null,
    phone: u.profile?.phone || null,
    country: u.profile?.country || null,
    attemptsCount: u._count.attempts,
    attempts: (u.attempts || []).map((a: any) => ({
      id: a.id,
      discipline: a.discipline,
      rawScore: a.rawScore,
      tcfScaledScore: a.tcfScaledScore,
      nclcLevel: a.nclcLevel,
      crsPointsUnlocked: a.crsPointsUnlocked,
      createdAt: a.createdAt,
    })),
    isAdmin: adminEmails.includes(u.email.toLowerCase()),
  }));

  const exportUsers = userRows.map((u) => ({
    role: u.isAdmin ? "Super Admin" : "Candidat",
    nom: u.displayName || "Candidat",
    email: u.email,
    telephone: u.phone || "Non renseigné",
    pays: u.country || "Non spécifié",
    nclc: `NCLC ${u.targetNclc}`,
    examen: u.examDate ? new Date(u.examDate).toLocaleDateString("fr-FR") : "Non fixée",
    tentatives: u.attemptsCount,
    inscription: new Date(u.createdAt).toLocaleDateString("fr-FR"),
  }));

  return (
    <AdminShell>
      <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b pb-4">
          <div className="space-y-1">
            <h1 className="font-display text-2xl font-extrabold tracking-tight flex items-center gap-2">
              <UsersIcon className="h-6 w-6 text-primary" />
              Candidats inscrits
            </h1>
            <p className="text-sm text-muted-foreground">
              {total} compte{total > 1 ? "s" : ""} {query ? "correspondant à la recherche" : "au total"}.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <AdminExportButton
              filename={`candidats-super4c2-${new Date().toISOString().slice(0, 10)}`}
              data={exportUsers}
              columns={[
                { key: "role", label: "Rôle" },
                { key: "nom", label: "Nom" },
                { key: "email", label: "Email" },
                { key: "telephone", label: "Téléphone" },
                { key: "pays", label: "Pays" },
                { key: "nclc", label: "Niveau NCLC visé" },
                { key: "examen", label: "Date d'examen prévue" },
                { key: "tentatives", label: "Nombre de simulations" },
                { key: "inscription", label: "Date d'inscription" },
              ]}
            />
            <form action="/admin/users" method="GET" className="flex w-full gap-2 sm:w-auto">
              {currentFilter !== "all" && (
                <input type="hidden" name="filter" value={currentFilter} />
              )}
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  name="q"
                  defaultValue={query}
                  placeholder="Rechercher un nom ou e-mail…"
                  aria-label="Rechercher un candidat"
                  className="h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                />
              </div>
              <Button type="submit" size="sm">
                Rechercher
              </Button>
            </form>
          </div>
        </header>

        {/* Quick Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Link
            href={`/admin/users?${new URLSearchParams({ ...(query && { q: query }) }).toString()}`}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
              currentFilter === "all"
                ? "bg-primary text-primary-foreground shadow-xs font-bold"
                : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            Tous les candidats ({allCount})
          </Link>

          <Link
            href={`/admin/users?${new URLSearchParams({ ...(query && { q: query }), filter: "zero_attempts" }).toString()}`}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
              currentFilter === "zero_attempts"
                ? "bg-amber-500 text-white shadow-xs font-bold"
                : "bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20"
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>À relancer (0 simulation)</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/20 font-bold">
              {zeroCount}
            </span>
          </Link>

          <Link
            href={`/admin/users?${new URLSearchParams({ ...(query && { q: query }), filter: "active" }).toString()}`}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
              currentFilter === "active"
                ? "bg-emerald-600 text-white shadow-xs font-bold"
                : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20"
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Actifs (1+ simulations)</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-500/20 font-bold">
              {activeCount}
            </span>
          </Link>

          <Link
            href={`/admin/users?${new URLSearchParams({ ...(query && { q: query }), filter: "has_phone" }).toString()}`}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
              currentFilter === "has_phone"
                ? "bg-emerald-500 text-white shadow-xs font-bold"
                : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20"
            }`}
          >
            <MessageCircle className="h-3.5 w-3.5 fill-current" />
            <span>Avec WhatsApp</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-500/20 font-bold">
              {hasPhoneCount}
            </span>
          </Link>
        </div>

        {dbError && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-800 dark:text-amber-200">
            {dbError}
          </div>
        )}

        <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
          <UserListClient users={userRows} query={query} />

          {/* Pied de tableau avec AdminTablePagination */}
          <AdminTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/admin/users"
            search={query || undefined}
            extraParams={{ filter: currentFilter !== "all" ? currentFilter : undefined }}
          />
        </div>
      </div>
    </AdminShell>
  );
}
