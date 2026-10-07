import Link from "next/link";
import {
  CircleHelp,
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Filter,
} from "lucide-react";
import { Prisma } from "@prisma/client";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmActionDialog } from "@/components/admin/ConfirmActionDialog";
import { AdminTablePagination } from "@/components/admin/AdminTablePagination";
import { AdminListEmptyState } from "@/components/admin/AdminListEmptyState";
import { prisma } from "@/lib/prisma";
import { getAdminPagination } from "@/lib/admin-pagination";
import { toOptionalString } from "@/lib/admin-crud-utils";
import { deleteFaqAction, toggleFaqActiveAction } from "./actions";

export const metadata = {
  title: "Questions Fréquentes (FAQs) — Back-Office | Super4C2",
};

interface FaqsPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    category?: string;
    status?: string;
  }>;
}

const FAQ_CATEGORIES = [
  "Toutes",
  "Général",
  "Examen CBT",
  "NCLC & CRS",
  "Abonnements",
  "Stratégie",
  "Technique",
] as const;

export default async function FaqsPage({ searchParams }: FaqsPageProps) {
  const { page: rawPage, q: rawQ, category: rawCat, status: rawStatus } =
    await searchParams;
  const q = toOptionalString(rawQ);
  const selectedCategory = toOptionalString(rawCat);
  const status = toOptionalString(rawStatus);

  const whereClause: Prisma.FaqWhereInput = {};

  if (q) {
    whereClause.OR = [
      { question: { contains: q, mode: "insensitive" } },
      { answer: { contains: q, mode: "insensitive" } },
    ];
  }

  if (selectedCategory && selectedCategory !== "Toutes") {
    whereClause.category = selectedCategory;
  }

  if (status === "active") {
    whereClause.isActive = true;
  } else if (status === "inactive") {
    whereClause.isActive = false;
  }

  const totalItems = await prisma.faq.count({ where: whereClause });
  const pagination = getAdminPagination(totalItems, rawPage, 10);

  const faqs = await prisma.faq.findMany({
    where: whereClause,
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    skip: pagination.skip,
    take: pagination.pageSize,
  });

  return (
    <AdminShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 mb-1.5">
              <CircleHelp className="h-3 w-3" />
              Réassurance &amp; Réponses Candidats
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Questions Fréquentes (FAQs)
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Gérez les questions-réponses affichées sur la vitrine publique pour lever les freins à l&apos;achat.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="gap-2 font-bold shadow-xs">
              <Link href="/admin/faqs/ajouter">
                <Plus className="h-4 w-4" />
                <span>Ajouter une FAQ</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <form className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={q || ""}
                placeholder="Rechercher dans les questions ou réponses..."
                className="pl-9 h-9 text-xs rounded-xl bg-card border-border"
              />
              {selectedCategory && (
                <input type="hidden" name="category" value={selectedCategory} />
              )}
              {status && <input type="hidden" name="status" value={status} />}
            </form>

            <div className="flex items-center gap-1.5">
              <Button
                asChild
                variant={!status ? "secondary" : "ghost"}
                size="sm"
                className="text-xs h-8"
              >
                <Link href="/admin/faqs">Toutes ({totalItems})</Link>
              </Button>
              <Button
                asChild
                variant={status === "active" ? "secondary" : "ghost"}
                size="sm"
                className="text-xs h-8"
              >
                <Link href="/admin/faqs?status=active">Actives</Link>
              </Button>
              <Button
                asChild
                variant={status === "inactive" ? "secondary" : "ghost"}
                size="sm"
                className="text-xs h-8"
              >
                <Link href="/admin/faqs?status=inactive">Masquées</Link>
              </Button>
            </div>
          </div>

          {/* Category Pill Filters */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1 mr-1">
              <Filter className="h-3 w-3" />
              Catégorie :
            </span>
            {FAQ_CATEGORIES.map((cat) => {
              const isActive =
                (!selectedCategory && cat === "Toutes") ||
                selectedCategory === cat;
              const href =
                cat === "Toutes"
                  ? `/admin/faqs${status ? `?status=${status}` : ""}`
                  : `/admin/faqs?category=${encodeURIComponent(cat)}${
                      status ? `&status=${status}` : ""
                    }`;

              return (
                <Button
                  key={cat}
                  asChild
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  className={`h-7 px-2.5 text-[11px] rounded-lg transition-all ${
                    isActive ? "font-bold shadow-xs" : "text-muted-foreground"
                  }`}
                >
                  <Link href={href}>{cat}</Link>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Table Container */}
        {faqs.length === 0 ? (
          <AdminListEmptyState
            kind="faqs"
            title="Aucune question fréquente trouvée"
            description="Créez votre première FAQ pour enrichir la section d'aide aux candidats."
            actionLabel="Créer une FAQ"
            actionHref="/admin/faqs/ajouter"
          />
        ) : (
          <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b bg-muted/30 text-muted-foreground font-semibold">
                    <th className="py-3 px-4 w-14 text-center">Ordre</th>
                    <th className="py-3 px-4">Question &amp; Réponse</th>
                    <th className="py-3 px-4 w-32">Catégorie</th>
                    <th className="py-3 px-4 text-center w-24">Statut</th>
                    <th className="py-3 px-4 text-right w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {faqs.map((faq) => (
                    <tr
                      key={faq.id}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-muted-foreground">
                        <span className="inline-flex items-center justify-center h-6 w-8 rounded-md bg-muted text-[11px]">
                          #{faq.order}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 max-w-md">
                        <div className="space-y-1">
                          <p className="font-bold text-foreground text-xs sm:text-sm">
                            {faq.question}
                          </p>
                          <p className="line-clamp-2 text-[11px] text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                          {faq.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <form action={toggleFaqActiveAction} className="inline-block">
                          <input type="hidden" name="id" value={faq.id} />
                          <button
                            type="submit"
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-all ${
                              faq.isActive
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                                : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                            }`}
                            title="Cliquer pour basculer la visibilité"
                          >
                            {faq.isActive ? (
                              <>
                                <Eye className="h-3 w-3" />
                                <span>Active</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="h-3 w-3" />
                                <span>Masquée</span>
                              </>
                            )}
                          </button>
                        </form>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="Modifier la FAQ"
                          >
                            <Link href={`/admin/faqs/${faq.id}`}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Link>
                          </Button>

                          <form id={`del-faq-${faq.id}`} action={deleteFaqAction}>
                            <input type="hidden" name="id" value={faq.id} />
                          </form>

                          <ConfirmActionDialog
                            trigger={
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                title="Supprimer la FAQ"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            }
                            title="Supprimer cette FAQ ?"
                            description={`Êtes-vous sûr de vouloir supprimer définitivement la question : "${faq.question}" ?`}
                            confirmLabel="Supprimer"
                            formId={`del-faq-${faq.id}`}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <AdminTablePagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              basePath="/admin/faqs"
              search={q ?? undefined}
            />
          </div>
        )}
      </div>
    </AdminShell>
  );
}
