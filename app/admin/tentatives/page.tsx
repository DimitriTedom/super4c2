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
import { ConfirmActionDialog } from "@/components/admin/ConfirmActionDialog";
import { AdminTablePagination } from "@/components/admin/AdminTablePagination";
import { AttemptInspectDialog } from "@/components/admin/attempt-inspect-dialog";
import { getAdminPagination } from "@/lib/admin-pagination";
import { toOptionalString } from "@/lib/admin-crud-utils";
import { prisma } from "@/lib/prisma";
import { getDisciplineMeta } from "@/lib/dashboard/attempt-utils";
import { deleteAttemptAction } from "./actions";

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

  const totalItems = await prisma.userAttempt.count({ where: whereClause });
  const pagination = getAdminPagination(totalItems, rawPage, 10);

  const attempts = await prisma.userAttempt.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    skip: pagination.skip,
    take: pagination.pageSize,
    include: {
      user: {
        include: {
          profile: true,
        },
      },
    },
  });

  // Global KPIs across the entire platform
  const totalAllAttempts = await prisma.userAttempt.count();
  const totalNclc7Plus = await prisma.userAttempt.count({
    where: { nclcLevel: { gte: 7 } },
  });
  const successRate = totalAllAttempts > 0
    ? Math.round((totalNclc7Plus / totalAllAttempts) * 100)
    : 0;

  const avgScaledScoreData = await prisma.userAttempt.aggregate({
    _avg: { tcfScaledScore: true },
  });
  const avgScaledScore = Math.round(avgScaledScoreData._avg.tcfScaledScore ?? 0);

  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recent24h = await prisma.userAttempt.count({
    where: { createdAt: { gte: oneDayAgo } },
  });

  return (
    <AdminShell>
      <div className="space-y-6">
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

        {/* Table of Attempts */}
        {attempts.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-12 text-center bg-card/40 space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto text-primary">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-base text-foreground">Aucune tentative trouvée</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Aucune session d&apos;examen ne correspond à vos filtres actuels.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b bg-muted/30 text-muted-foreground font-semibold">
                    <th className="py-3 px-4">Candidat</th>
                    <th className="py-3 px-4">Épreuve</th>
                    <th className="py-3 px-4 text-center">Score Brut</th>
                    <th className="py-3 px-4 text-center">Score TCF</th>
                    <th className="py-3 px-4 text-center">Niveau NCLC</th>
                    <th className="py-3 px-4 text-center">Bonus CRS</th>
                    <th className="py-3 px-4">Date de Passation</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {attempts.map((attempt) => {
                    const meta = getDisciplineMeta(attempt.discipline);
                    const candidateName =
                      attempt.user?.profile?.displayName ||
                      attempt.user?.email?.split("@")[0] ||
                      "Anonyme";
                    const candidateEmail = attempt.user?.email || "Visiteur non connecté";
                    const isNclc7Plus = attempt.nclcLevel >= 7;

                    return (
                      <tr key={attempt.id} className="hover:bg-muted/30 transition-colors">
                        {/* Candidate */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                              {candidateName.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="space-y-0.5">
                              <p className="font-bold text-foreground text-xs">
                                {candidateName}
                              </p>
                              <p className="text-[11px] text-muted-foreground font-mono">
                                {candidateEmail}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Discipline */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5 font-semibold text-foreground">
                            <span>{meta.emoji}</span>
                            <span>{meta.label}</span>
                          </div>
                        </td>

                        {/* Raw Score */}
                        <td className="py-3 px-4 text-center font-mono">
                          {attempt.discipline === "EXPRESSION_ECRITE"
                            ? `${attempt.rawScore} / 20`
                            : attempt.discipline === "EXPRESSION_ORALE"
                            ? `${attempt.rawScore} / 20`
                            : `${attempt.rawScore} / 39`}
                        </td>

                        {/* Scaled Score */}
                        <td className="py-3 px-4 text-center font-mono font-bold text-primary">
                          {attempt.tcfScaledScore} / 699
                        </td>

                        {/* NCLC Level */}
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                              isNclc7Plus
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                                : "bg-muted text-muted-foreground border-border"
                            }`}
                          >
                            NCLC {attempt.nclcLevel}
                          </span>
                        </td>

                        {/* Bonus CRS */}
                        <td className="py-3 px-4 text-center">
                          {attempt.crsPointsUnlocked > 0 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-mono">
                              <Sparkles className="h-2.5 w-2.5" />
                              +{attempt.crsPointsUnlocked} pts
                            </span>
                          ) : (
                            <span className="text-[11px] text-muted-foreground font-mono">
                              0 pt
                            </span>
                          )}
                        </td>

                        {/* Date */}
                        <td className="py-3 px-4 text-muted-foreground text-[11px]">
                          {new Date(attempt.createdAt).toLocaleString("fr-FR", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <AttemptInspectDialog
                              attempt={{
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
                              }}
                            />

                            <form id={`del-attempt-${attempt.id}`} action={deleteAttemptAction}>
                              <input type="hidden" name="id" value={attempt.id} />
                            </form>

                            <ConfirmActionDialog
                              trigger={
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                  title="Supprimer la session"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              }
                              title="Supprimer cette session d'examen ?"
                              description="Êtes-vous sûr de vouloir supprimer définitivement cette tentative de la base de données ? Cette action est irréversible."
                              confirmLabel="Supprimer"
                              formId={`del-attempt-${attempt.id}`}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <AdminTablePagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                basePath="/admin/tentatives"
                search={q ?? undefined}
              />
            )}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
