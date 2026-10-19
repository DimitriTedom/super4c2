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
import { FaqTableClient } from "@/components/admin/faq-table-client";
import { prisma } from "@/lib/prisma";
import { getAdminPagination } from "@/lib/admin-pagination";
import { toOptionalString } from "@/lib/admin-crud-utils";

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

  let totalItems = 0;
  let faqs: any[] = [];
  let dbError: string | null = null;

  try {
    totalItems = await prisma.faq.count({ where: whereClause });
    const paginationData = getAdminPagination(totalItems, rawPage, 10);

    faqs = await prisma.faq.findMany({
      where: whereClause,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      skip: paginationData.skip,
      take: paginationData.pageSize,
    });
  } catch (error) {
    console.error("Erreur chargement des FAQs :", error);
    dbError = "Impossible de récupérer les questions fréquentes en direct. Veuillez vérifier la connexion base de données.";
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

        {/* Table Container with Batch Actions */}
        <FaqTableClient
          faqs={faqs}
          pagination={pagination}
          searchQuery={q ?? undefined}
          statusFilter={status ?? undefined}
          categoryFilter={selectedCategory ?? undefined}
        />
      </div>
    </AdminShell>
  );
}
