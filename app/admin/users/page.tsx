import Link from "next/link";
import { Search, Users as UsersIcon, CalendarClock, Target } from "lucide-react";

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
  searchParams: Promise<{ q?: string; page?: string }>;
}

function formatDate(date: Date | null | undefined) {
  if (!date) return "—";
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function AdminUsersPage({ searchParams }: UsersPageProps) {
  const { q, page } = await searchParams;
  const query = q?.trim() ?? "";
  const currentPage = Math.max(1, Number.parseInt(page ?? "1", 10) || 1);

  const where = query
    ? {
        OR: [
          { email: { contains: query, mode: "insensitive" as const } },
          { profile: { displayName: { contains: query, mode: "insensitive" as const } } },
        ],
      }
    : {};

  let total = 0;
  let users: any[] = [];
  let dbError: string | null = null;

  try {
    const [t, uList] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (currentPage - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: { profile: true, _count: { select: { attempts: true } } },
      }),
    ]);
    total = t;
    users = uList;
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
          />
        </div>
      </div>
    </AdminShell>
  );
}
