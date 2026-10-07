import Link from "next/link";
import {
  FolderKanban,
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Filter,
  Star,
  Clock,
  ExternalLink,
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
import {
  deleteBlogPostAction,
  toggleBlogPostFeaturedAction,
  toggleBlogPostPublishAction,
} from "./actions";

export const metadata = {
  title: "Blog & Guides SEO — Back-Office | Super4C2",
};

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
  "Compréhension Écrite",
  "Méthodologie NCLC 7",
  "Actualités Immigration",
] as const;

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { page: rawPage, q: rawQ, category: rawCat, status: rawStatus } =
    await searchParams;
  const q = toOptionalString(rawQ);
  const selectedCategory = toOptionalString(rawCat);
  const status = toOptionalString(rawStatus);

  const whereClause: Prisma.BlogPostWhereInput = {};

  if (q) {
    whereClause.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { excerpt: { contains: q, mode: "insensitive" } },
      { content: { contains: q, mode: "insensitive" } },
    ];
  }

  if (selectedCategory && selectedCategory !== "Toutes") {
    whereClause.category = selectedCategory;
  }

  if (status === "published") {
    whereClause.isPublished = true;
  } else if (status === "draft") {
    whereClause.isPublished = false;
  }

  const totalItems = await prisma.blogPost.count({ where: whereClause });
  const pagination = getAdminPagination(totalItems, rawPage, 10);

  const posts = await prisma.blogPost.findMany({
    where: whereClause,
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
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
              <FolderKanban className="h-3 w-3" />
              Acquisition Organique &amp; Stratégie Éditoriale
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Blog &amp; Guides Stratégiques
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Gérez les guides de préparation, articles d&apos;autorité et comparatifs pour attirer des candidats qualifiés.
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

        {/* Filters Bar */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <form className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={q || ""}
                placeholder="Rechercher par titre, mot-clé ou extrait..."
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
                <Link href="/admin/blog">Tous ({totalItems})</Link>
              </Button>
              <Button
                asChild
                variant={status === "published" ? "secondary" : "ghost"}
                size="sm"
                className="text-xs h-8"
              >
                <Link href="/admin/blog?status=published">Publiés</Link>
              </Button>
              <Button
                asChild
                variant={status === "draft" ? "secondary" : "ghost"}
                size="sm"
                className="text-xs h-8"
              >
                <Link href="/admin/blog?status=draft">Brouillons</Link>
              </Button>
            </div>
          </div>

          {/* Category Pill Filters */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1 mr-1">
              <Filter className="h-3 w-3" />
              Catégorie :
            </span>
            {BLOG_CATEGORIES.map((cat) => {
              const isActive =
                (!selectedCategory && cat === "Toutes") ||
                selectedCategory === cat;
              const href =
                cat === "Toutes"
                  ? `/admin/blog${status ? `?status=${status}` : ""}`
                  : `/admin/blog?category=${encodeURIComponent(cat)}${
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
        {posts.length === 0 ? (
          <AdminListEmptyState
            kind="blog"
            title="Aucun article de blog trouvé"
            description="Rédigez votre premier article pour commencer à générer du trafic organique ciblé."
            actionLabel="Rédiger un Article"
            actionHref="/admin/blog/ajouter"
          />
        ) : (
          <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b bg-muted/30 text-muted-foreground font-semibold">
                    <th className="py-3 px-4">Article</th>
                    <th className="py-3 px-4">Catégorie</th>
                    <th className="py-3 px-4">Auteur</th>
                    <th className="py-3 px-4 text-center">Lecture</th>
                    <th className="py-3 px-4 text-center">À la une</th>
                    <th className="py-3 px-4 text-center">Statut</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {posts.map((post) => (
                    <tr
                      key={post.id}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="space-y-1">
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="font-bold text-foreground text-xs sm:text-sm hover:text-primary transition-colors line-clamp-2"
                          >
                            {post.title}
                          </Link>
                          <p className="line-clamp-1 text-[11px] text-muted-foreground">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
                            <span>/blog/{post.slug}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                          {post.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-muted-foreground">
                        <p className="font-medium text-foreground">{post.authorName}</p>
                        <p className="text-[10px] text-muted-foreground">{post.authorRole}</p>
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readingMinutes} min
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <form action={toggleBlogPostFeaturedAction} className="inline-block">
                          <input type="hidden" name="id" value={post.id} />
                          <button
                            type="submit"
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border transition-all ${
                              post.featured
                                ? "bg-amber-500/10 text-amber-600 border-amber-500/30 hover:bg-amber-500/20"
                                : "bg-muted/40 text-muted-foreground border-border hover:bg-muted"
                            }`}
                            title="Bascule mise à la une"
                          >
                            <Star
                              className={`h-3 w-3 ${
                                post.featured ? "fill-current" : ""
                              }`}
                            />
                            <span>{post.featured ? "Vedette" : "Non"}</span>
                          </button>
                        </form>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <form action={toggleBlogPostPublishAction} className="inline-block">
                          <input type="hidden" name="id" value={post.id} />
                          <button
                            type="submit"
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-all ${
                              post.isPublished
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                                : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                            }`}
                            title="Bascule publication"
                          >
                            {post.isPublished ? (
                              <>
                                <Eye className="h-3 w-3" />
                                <span>Publié</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="h-3 w-3" />
                                <span>Brouillon</span>
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
                            title="Modifier l'article"
                          >
                            <Link href={`/admin/blog/${post.id}`}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Link>
                          </Button>

                          <form id={`del-post-${post.id}`} action={deleteBlogPostAction}>
                            <input type="hidden" name="id" value={post.id} />
                          </form>

                          <ConfirmActionDialog
                            trigger={
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                title="Supprimer l'article"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            }
                            title="Supprimer cet article ?"
                            description={`Êtes-vous sûr de vouloir supprimer définitivement l'article "${post.title}" ? Cette action est irréversible.`}
                            confirmLabel="Supprimer définitivement"
                            formId={`del-post-${post.id}`}
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
              basePath="/admin/blog"
              search={q ?? undefined}
            />
          </div>
        )}
      </div>
    </AdminShell>
  );
}
