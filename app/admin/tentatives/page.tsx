import Link from "next/link";
import {
  GraduationCap,
  Search,
  Trash2,
  Sparkles,
  TrendingUp,
  Award,
  Clock,
  User,
  Filter,
} from "lucide-react";
import { Prisma } from "@prisma/client";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminTablePagination } from "@/components/admin/AdminTablePagination";
import { AdminExportButton } from "@/components/admin/admin-export-button";
import { AttemptListClient } from "@/components/admin/attempt-list-client";
import { getAdminPagination } from "@/lib/admin-pagination";
import { toOptionalString } from "@/lib/admin-crud-utils";
import { prisma } from "@/lib/prisma";
import { getDisciplineMeta } from "@/lib/dashboard/attempt-utils";

export const metadata = {
  title: "Tentatives & Copies Candidats — Back-Office | Super4C2",
};

interface TentativesPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    discipline?: string;
    nclc?: string;
  }>;
}

export default async function TentativesPage({ searchParams }: TentativesPageProps) {
  const { page: rawPage, q: rawQ, discipline: rawDiscipline, nclc: rawNclc } = await searchParams;
  const q = toOptionalString(rawQ);
  const discipline = toOptionalString(rawDiscipline);
  const nclcFilter = toOptionalString(rawNclc);

  const whereClause: Prisma.UserAttemptWhereInput = {
    ...(discipline && discipline !== "ALL" && {
      discipline: discipline as Prisma.EnumDisciplineFilter["equals"],
    }),
    ...(nclcFilter === "gte7" && { nclcLevel: { gte: 7 } }),
    ...(nclcFilter === "lt7" && { nclcLevel: { lt: 7 } }),
    ...(q && {
      OR: [
        { id: { contains: q, mode: "insensitive" } },
        { user: { email: { contains: q, mode: "insensitive" } } },
        { user: { profile: { displayName: { contains: q, mode: "insensitive" } } } },
      ],
    }),
  };

  let totalItems = 0;
  let attempts: any[] = [];
  let totalAllAttempts = 0;
  let totalNclc7Plus = 0;
  let successRate = 0;
  let avgScaledScore = 0;
  let recent24h = 0;
  let dbError: string | null = null;

  try {
    totalItems = await prisma.userAttempt.count({ where: whereClause });
    const paginationData = getAdminPagination(totalItems, rawPage, 10);

    const [attList, tAll, tNclc7, avgData, r24] = await Promise.all([
      prisma.userAttempt.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip: paginationData.skip,
        take: paginationData.pageSize,
        include: {
          user: {
            include: {
              profile: true,
            },
          },
        },
      }),
      prisma.userAttempt.count(),
      prisma.userAttempt.count({
        where: { nclcLevel: { gte: 7 } },
      }),
      prisma.userAttempt.aggregate({
        _avg: { tcfScaledScore: true },
      }),
      prisma.userAttempt.count({
        where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      }),
    ]);

    attempts = attList;
    totalAllAttempts = tAll;
    totalNclc7Plus = tNclc7;
    successRate = totalAllAttempts > 0 ? Math.round((totalNclc7Plus / totalAllAttempts) * 100) : 0;
    avgScaledScore = Math.round(avgData._avg.tcfScaledScore ?? 0);
    recent24h = r24;
  } catch (error) {
    console.error("Erreur chargement des tentatives :", error);
    dbError = "Impossible de récupérer les tentatives en direct. Veuillez vérifier la connexion base de données.";
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 mb-1.5">
              <GraduationCap className="h-3 w-3" />
              Console Pédagogique &amp; Audit des Copies
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Tentatives &amp; Copies Candidats
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Supervisez les simulations passées, examinez les rédactions réelles et auditez les évaluations IA.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <AdminExportButton
              filename={`tentatives-copies-${new Date().toISOString().slice(0, 10)}`}
              data={attempts.map((a) => ({
                candidat: a.user?.profile?.displayName || a.user?.email || "Candidat",
                email: a.user?.email || "",
                discipline: a.discipline,
                scoreBrut: a.rawScore,
                scoreTCF: a.tcfScaledScore,
                niveauNCLC: `NCLC ${a.nclcLevel}`,
                pointsCRS: a.crsPointsUnlocked,
                date: new Date(a.createdAt).toLocaleString("fr-FR"),
              }))}
              columns={[
                { key: "candidat", label: "Candidat" },
                { key: "email", label: "Email" },
                { key: "discipline", label: "Discipline" },
                { key: "scoreBrut", label: "Score Brut" },
                { key: "scoreTCF", label: "Score TCF (/699)" },
                { key: "niveauNCLC", label: "Niveau NCLC" },
                { key: "pointsCRS", label: "Points CRS Canada" },
                { key: "date", label: "Date de Passation" },
              ]}
              label="Exporter les Copies (CSV)"
            />
          </div>
        </div>

        {/* 4 Shadcn Executive KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="rounded-2xl border bg-card shadow-xs">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Simulations Passées
                </span>
                <GraduationCap className="h-4 w-4 text-primary" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-mono text-2xl font-bold tracking-tight text-foreground">
                  {totalAllAttempts}
                </span>
                <span className="text-xs text-muted-foreground">sessions</span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border bg-card shadow-xs">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Réussite NCLC 7+ (CRS)
                </span>
                <Award className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-mono text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                  {successRate}%
                </span>
                <span className="text-xs text-muted-foreground">
                  ({totalNclc7Plus} qualifiés)
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border bg-card shadow-xs">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Score Moyen Échelonné
                </span>
                <TrendingUp className="h-4 w-4 text-amber-500" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-mono text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                  {avgScaledScore}
                </span>
                <span className="text-xs text-muted-foreground">/ 699 pts FEI</span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border bg-card shadow-xs">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Dernières 24 Heures
                </span>
                <Clock className="h-4 w-4 text-purple-500" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-mono text-2xl font-bold tracking-tight text-purple-600 dark:text-purple-400">
                  {recent24h}
                </span>
                <span className="text-xs text-muted-foreground">nouvelles copies</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <form method="GET" className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              name="q"
              defaultValue={q ?? ""}
              placeholder="Rechercher par candidat, email ou ID..."
              className="pl-9 h-9 text-xs rounded-xl bg-card"
            />
            {discipline && <input type="hidden" name="discipline" value={discipline} />}
            {nclcFilter && <input type="hidden" name="nclc" value={nclcFilter} />}
          </form>

          {/* Discipline and NCLC pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <div className="flex items-center gap-1 bg-card p-1 rounded-xl border text-xs">
              <Button
                asChild
                variant={!discipline || discipline === "ALL" ? "secondary" : "ghost"}
                size="sm"
                className="text-xs h-7 px-2.5"
              >
                <Link href={`/admin/tentatives?${new URLSearchParams({ ...(q && { q }), ...(nclcFilter && { nclc: nclcFilter }) }).toString()}`}>
                  Toutes
                </Link>
              </Button>
              <Button
                asChild
                variant={discipline === "EXPRESSION_ECRITE" ? "secondary" : "ghost"}
                size="sm"
                className="text-xs h-7 px-2.5"
              >
                <Link href={`/admin/tentatives?${new URLSearchParams({ discipline: "EXPRESSION_ECRITE", ...(q && { q }), ...(nclcFilter && { nclc: nclcFilter }) }).toString()}`}>
                  ✍️ Écrit
                </Link>
              </Button>
              <Button
                asChild
                variant={discipline === "EXPRESSION_ORALE" ? "secondary" : "ghost"}
                size="sm"
                className="text-xs h-7 px-2.5"
              >
                <Link href={`/admin/tentatives?${new URLSearchParams({ discipline: "EXPRESSION_ORALE", ...(q && { q }), ...(nclcFilter && { nclc: nclcFilter }) }).toString()}`}>
                  🎙️ Oral
                </Link>
              </Button>
              <Button
                asChild
                variant={discipline === "COMPREHENSION_ECRITE" ? "secondary" : "ghost"}
                size="sm"
                className="text-xs h-7 px-2.5"
              >
                <Link href={`/admin/tentatives?${new URLSearchParams({ discipline: "COMPREHENSION_ECRITE", ...(q && { q }), ...(nclcFilter && { nclc: nclcFilter }) }).toString()}`}>
                  📖 CE
                </Link>
              </Button>
              <Button
                asChild
                variant={discipline === "COMPREHENSION_ORALE" ? "secondary" : "ghost"}
                size="sm"
                className="text-xs h-7 px-2.5"
              >
                <Link href={`/admin/tentatives?${new URLSearchParams({ discipline: "COMPREHENSION_ORALE", ...(q && { q }), ...(nclcFilter && { nclc: nclcFilter }) }).toString()}`}>
                  🎧 CO
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-1 bg-card p-1 rounded-xl border text-xs">
              <Button
                asChild
                variant={!nclcFilter ? "secondary" : "ghost"}
                size="sm"
                className="text-xs h-7 px-2"
              >
                <Link href={`/admin/tentatives?${new URLSearchParams({ ...(q && { q }), ...(discipline && { discipline }) }).toString()}`}>
                  Tous NCLC
                </Link>
              </Button>
              <Button
                asChild
                variant={nclcFilter === "gte7" ? "secondary" : "ghost"}
                size="sm"
                className="text-xs h-7 px-2"
              >
                <Link href={`/admin/tentatives?${new URLSearchParams({ nclc: "gte7", ...(q && { q }), ...(discipline && { discipline }) }).toString()}`}>
                  NCLC 7+
                </Link>
              </Button>
              <Button
                asChild
                variant={nclcFilter === "lt7" ? "secondary" : "ghost"}
                size="sm"
                className="text-xs h-7 px-2"
              >
                <Link href={`/admin/tentatives?${new URLSearchParams({ nclc: "lt7", ...(q && { q }), ...(discipline && { discipline }) }).toString()}`}>
                  &lt; NCLC 7
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Table interactive avec Sélection Multiple, Purge en Lot & Inspection */}
        <AttemptListClient
          attempts={attempts.map((attempt) => ({
            id: attempt.id,
            discipline: attempt.discipline,
            rawScore: attempt.rawScore,
            tcfScaledScore: attempt.tcfScaledScore,
            nclcLevel: attempt.nclcLevel,
            crsPointsUnlocked: attempt.crsPointsUnlocked,
            answers: attempt.answers,
            feedback: attempt.feedback,
            createdAt: attempt.createdAt,
            user: attempt.user,
          }))}
        />

        {/* Pagination du Tableau */}
        {attempts.length > 0 && pagination.totalPages > 1 && (
          <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
            <AdminTablePagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              basePath="/admin/tentatives"
              search={q ?? undefined}
            />
          </div>
        )}
      </div>
    </AdminShell>
  );
}
