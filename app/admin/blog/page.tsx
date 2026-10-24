import Link from "next/link";
import {
  FolderKanban,
  Plus,
  Search,
  ExternalLink,
  FileText,
  Eye,
  EyeOff,
  TrendingUp,
} from "lucide-react";
import { Prisma } from "@prisma/client";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminTablePagination } from "@/components/admin/AdminTablePagination";
import { AdminListEmptyState } from "@/components/admin/AdminListEmptyState";
import { BlogListClient, AdminBlogPostItem } from "@/components/admin/blog-list-client";
import { prisma } from "@/lib/prisma";
import { getAdminPagination } from "@/lib/admin-pagination";
import { toOptionalString } from "@/lib/admin-crud-utils";

export const metadata = {
  title: "Blog & Guides SEO — Back-Office | Super4C2",
};

export const dynamic = "force-dynamic";

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    category?: string;
    status?: string;
  }>;
}

const BLOG_CATEGORIES = [
  "Toutes",
  "Stratégie TCF",
  "Entrée Express & CRS",
  "Expression Écrite",
  "Expression Orale",
  "Compréhension Écrite",
  "Méthodologie NCLC 7",
  "Actualités Immigration",
] as const;

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { page: rawPage, q: rawQ, category: rawCat, status: rawStatus } =
    await searchParams;
  const q = toOptionalString(rawQ) || "";
  const selectedCategory = toOptionalString(rawCat) || "Toutes";
  const status = toOptionalString(rawStatus) || "all";

  const whereClause: Prisma.BlogPostWhereInput = {};

  if (q) {
    whereClause.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { excerpt: { contains: q, mode: "insensitive" } },
      { content: { contains: q, mode: "insensitive" } },
      { targetKeyword: { contains: q, mode: "insensitive" } },
    ];
  }

  if (selectedCategory && selectedCategory !== "Toutes") {
    whereClause.category = selectedCategory;
  }

  if (status === "published") {
    whereClause.isPublished = true;
  } else if (status === "draft") {
    whereClause.isPublished = false;
  } else if (status === "featured") {
    whereClause.featured = true;
  }

  let totalItems = 0;
  let posts: any[] = [];
  let dbError: string | null = null;

  // Global KPIs
  let totalCount = 0;
  let publishedCount = 0;
  let draftCount = 0;
  let totalViews = 0;

  try {
    [totalCount, publishedCount, draftCount, totalItems] = await Promise.all([
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { isPublished: true } }),
      prisma.blogPost.count({ where: { isPublished: false } }),
      prisma.blogPost.count({ where: whereClause }),
    ]);

    const aggregateViews = await prisma.blogPost.aggregate({
      _sum: { viewCount: true },
    });
    totalViews = aggregateViews._sum.viewCount || 0;

    const paginationData = getAdminPagination(totalItems, rawPage, 10);

    posts = await prisma.blogPost.findMany({
      where: whereClause,
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
      skip: paginationData.skip,
      take: paginationData.pageSize,
    });
  } catch (error) {
    console.error("Erreur chargement des articles de blog :", error);
    dbError = "Impossible de récupérer les articles en direct. Veuillez vérifier la connexion base de données.";
  }

  const pagination = getAdminPagination(totalItems, rawPage, 10);

  const mappedPosts: AdminBlogPostItem[] = posts.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    category: p.category,
    coverImage: p.coverImage,
    youtubeUrl: p.youtubeUrl,
    targetKeyword: p.targetKeyword,
    isPublished: p.isPublished,
    featured: p.featured,
    viewCount: p.viewCount,
    readingMinutes: p.readingMinutes || 5,
    publishedAt: p.publishedAt ? new Date(p.publishedAt).toISOString() : "",
    createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : "",
  }));

  return (
    <AdminShell>
      <div className="space-y-6">
        {dbError && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-800 dark:text-amber-200">
            {dbError}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 mb-1.5">
              <FolderKanban className="h-3 w-3" />
              Acquisition Organique &amp; Studio SEO
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Blog &amp; Guides Stratégiques
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Rédigez, illustrez avec YouTube et optimisez vos articles pour capter le trafic Google TCF &amp; Entrée Express.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
              <Link href="/blog" target="_blank">
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Voir le Blog Public</span>
              </Link>
            </Button>

            <Button asChild size="sm" className="gap-2 font-bold shadow-xs">
              <Link href="/admin/blog/ajouter">
                <Plus className="h-4 w-4" />
                <span>Rédiger un Article</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Total Articles</span>
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl font-black text-foreground mt-1 font-mono">{totalCount}</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Contenus enregistrés</p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">En Ligne (Publiés)</span>
              <Eye className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
              {publishedCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Indexables sur Google</p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Brouillons</span>
              <EyeOff className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 font-mono">
              {draftCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">En cours d&apos;édition</p>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Lectures Cumulées</span>
              <TrendingUp className="h-4 w-4 text-sky-500" />
            </div>
            <div className="text-2xl font-black text-foreground mt-1 font-mono">
              {totalViews.toLocaleString("fr-FR")}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Vues de pages globales</p>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap border-b border-border/60 pb-3">
            {[
              { id: "all", label: "Tous les articles", count: totalCount },
              { id: "published", label: "Publiés", count: publishedCount },
              { id: "draft", label: "Brouillons", count: draftCount },
              { id: "featured", label: "À la une", count: undefined },
            ].map((tab) => {
              const isActive = status === tab.id;
              const href = `/admin/blog?status=${tab.id}${q ? `&q=${encodeURIComponent(q)}` : ""}${
                selectedCategory && selectedCategory !== "Toutes"
                  ? `&category=${encodeURIComponent(selectedCategory)}`
                  : ""
              }`;
              return (
                <Link
                  key={tab.id}
                  href={href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Search + Category Form */}
          <form method="GET" action="/admin/blog" className="grid grid-cols-1 sm:grid-cols-[1fr_200px_auto] gap-2.5">
            <input type="hidden" name="status" value={status} />

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="Rechercher par titre, extrait ou mot-clé SEO..."
                className="pl-8.5 h-9 text-xs rounded-xl bg-background"
              />
            </div>

            <select
              name="category"
              defaultValue={selectedCategory}
              className="h-9 text-xs rounded-xl border border-input bg-background px-3 text-foreground"
            >
              {BLOG_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <Button type="submit" size="sm" variant="secondary" className="h-9 text-xs font-semibold px-4">
              Filtrer
            </Button>
          </form>
        </div>

        {/* Table or Empty State */}
        {mappedPosts.length === 0 ? (
          <AdminListEmptyState
            kind="blog"
            title="Aucun article trouvé"
            description={
              q || (selectedCategory && selectedCategory !== "Toutes") || status !== "all"
                ? "Aucun article ne correspond à vos critères de recherche actuels."
                : "Commencez par rédiger votre premier guide de préparation TCF Canada pour capter le trafic SEO."
            }
            actionLabel="Rédiger un Article"
            actionHref="/admin/blog/ajouter"
          />
        ) : (
          <>
            <BlogListClient
              posts={mappedPosts}
              totalCount={totalItems}
              currentQuery={q}
              currentCategory={selectedCategory}
              currentStatus={status}
            />

            <AdminTablePagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              basePath="/admin/blog"
              extraParams={{
                q: q || undefined,
                category: selectedCategory !== "Toutes" ? selectedCategory : undefined,
                status: status !== "all" ? status : undefined,
              }}
            />
          </>
        )}
      </div>
    </AdminShell>
  );
}
