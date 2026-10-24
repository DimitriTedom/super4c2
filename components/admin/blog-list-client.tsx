"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Star,
  ExternalLink,
  CheckSquare,
  Square,
  MinusSquare,
  Video,
  FileText,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AdminBatchActionBar } from "@/components/admin/admin-batch-action-bar";
import { ConfirmActionDialog } from "@/components/admin/ConfirmActionDialog";
import {
  batchDeleteBlogPostsAction,
  batchUpdateBlogPostsPublishAction,
  deleteBlogPostAction,
  toggleFeaturedDirectAction,
  togglePublishDirectAction,
} from "@/app/admin/blog/actions";

export interface AdminBlogPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  coverImage: string | null;
  youtubeUrl: string | null;
  targetKeyword: string | null;
  isPublished: boolean;
  featured: boolean;
  viewCount: number;
  readingMinutes: number;
  publishedAt: string;
  createdAt: string;
}

interface BlogListClientProps {
  posts: AdminBlogPostItem[];
  totalCount: number;
  currentQuery?: string;
  currentCategory?: string;
  currentStatus?: string;
}

export function BlogListClient({
  posts: initialPosts,
  totalCount,
  currentQuery = "",
  currentCategory = "Toutes",
  currentStatus = "all",
}: BlogListClientProps) {
  const router = useRouter();
  const [posts, setPosts] = useState<AdminBlogPostItem[]>(initialPosts);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  // Synchronise if initialPosts change from server
  React.useEffect(() => {
    setPosts(initialPosts);
    setSelectedIds([]);
  }, [initialPosts]);

  // Selection logic
  const isAllSelected = posts.length > 0 && selectedIds.length === posts.length;
  const isPartiallySelected = selectedIds.length > 0 && selectedIds.length < posts.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(posts.map((p) => p.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Quick single toggle publish
  const handleTogglePublish = async (post: AdminBlogPostItem) => {
    const nextState = !post.isPublished;
    // Optimistic
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, isPublished: nextState } : p))
    );

    const res = await togglePublishDirectAction(post.id, nextState);
    if (!res.success) {
      toast.error("Erreur lors de la mise à jour du statut.");
      // Rollback
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, isPublished: !nextState } : p))
      );
    } else {
      toast.success(nextState ? "Article publié en ligne" : "Article passé en brouillon");
      router.refresh();
    }
  };

  // Quick single toggle featured
  const handleToggleFeatured = async (post: AdminBlogPostItem) => {
    const nextState = !post.featured;
    // Optimistic
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, featured: nextState } : p))
    );

    const res = await toggleFeaturedDirectAction(post.id, nextState);
    if (!res.success) {
      toast.error("Erreur lors de la mise à jour de la mise à la une.");
      // Rollback
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, featured: !nextState } : p))
      );
    } else {
      toast.success(nextState ? "Article mis à la une" : "Article retiré de la une");
      router.refresh();
    }
  };

  // Batch actions
  const handleBatchPublish = async (targetPublished: boolean) => {
    if (selectedIds.length === 0) return;
    const res = await batchUpdateBlogPostsPublishAction(selectedIds, targetPublished);
    if (res.success) {
      toast.success(
        targetPublished
          ? `${res.count} article(s) publié(s) avec succès`
          : `${res.count} article(s) passé(s) en brouillon`
      );
      setSelectedIds([]);
      router.refresh();
    } else {
      toast.error(res.error || "Erreur lors de l'opération en lot.");
    }
  };

  const handleConfirmBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    const res = await batchDeleteBlogPostsAction(selectedIds);
    if (res.success) {
      toast.success(`${res.count} article(s) supprimé(s) définitivement.`);
      setSelectedIds([]);
      router.refresh();
    } else {
      toast.error(res.error || "Erreur lors de la suppression en lot.");
    }
  };

  // Export CSV UTF-8 BOM
  const handleExportCsv = () => {
    const itemsToExport =
      selectedIds.length > 0
        ? posts.filter((p) => selectedIds.includes(p.id))
        : posts;

    if (itemsToExport.length === 0) {
      toast.info("Aucun article à exporter.");
      return;
    }

    const headers = [
      "ID",
      "Titre",
      "Slug",
      "Catégorie",
      "Mot-Clé Principal",
      "Statut",
      "À la une",
      "Vues",
      "Temps de Lecture (min)",
      "URL Vidéo YouTube",
      "Date de Publication",
    ];

    const rows = itemsToExport.map((p) => [
      `"${p.id}"`,
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.slug}"`,
      `"${p.category}"`,
      `"${p.targetKeyword || ""}"`,
      p.isPublished ? "Publié" : "Brouillon",
      p.featured ? "Oui" : "Non",
      p.viewCount,
      p.readingMinutes,
      `"${p.youtubeUrl || ""}"`,
      `"${p.publishedAt}"`,
    ]);

    const csvContent =
      "\uFEFF" +
      [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `super4c2-articles-blog-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`${itemsToExport.length} article(s) exporté(s) en CSV.`);
  };

  return (
    <div className="space-y-4">
      {/* Batch Floating Action Bar */}
      <AdminBatchActionBar
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds([])}
        itemName="articles"
        onDeleteSelected={handleConfirmBatchDelete}
        onToggleActiveSelected={(active) => handleBatchPublish(active)}
        onExportCsv={handleExportCsv}
      />

      {/* Main Table */}
      <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                <th className="py-3 px-3.5 w-10 text-center">
                  <button
                    type="button"
                    onClick={handleToggleSelectAll}
                    className="p-1 rounded hover:bg-muted text-muted-foreground transition-colors"
                    title={isAllSelected ? "Tout désélectionner" : "Tout sélectionner"}
                  >
                    {isAllSelected ? (
                      <CheckSquare className="h-4 w-4 text-brand-crimson" />
                    ) : isPartiallySelected ? (
                      <MinusSquare className="h-4 w-4 text-brand-crimson" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-3 min-w-[280px]">Article &amp; Mot-Clé SEO</th>
                <th className="py-3 px-3 min-w-[130px]">Catégorie</th>
                <th className="py-3 px-3 text-center w-24">Statut</th>
                <th className="py-3 px-3 text-center w-20">À la une</th>
                <th className="py-3 px-3 text-right w-20">Vues</th>
                <th className="py-3 px-3 text-right min-w-[110px]">Date</th>
                <th className="py-3 px-3 text-right w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {posts.map((post) => {
                const isChecked = selectedIds.includes(post.id);
                return (
                  <tr
                    key={post.id}
                    className={`transition-colors hover:bg-muted/30 ${
                      isChecked ? "bg-primary/5" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleSelect(post.id)}
                        className="p-1 rounded hover:bg-muted text-muted-foreground transition-colors"
                      >
                        {isChecked ? (
                          <CheckSquare className="h-4 w-4 text-brand-crimson" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </td>

                    {/* Article Details + Media Thumbnail */}
                    <td className="py-3 px-3">
                      <div className="flex items-start gap-3">
                        {/* Thumbnail */}
                        <div className="relative h-12 w-20 shrink-0 rounded-lg overflow-hidden border border-border/80 bg-muted/50">
                          {post.coverImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-muted-foreground/40">
                              <FileText className="h-5 w-5" />
                            </div>
                          )}
                          {post.youtubeUrl && (
                            <span className="absolute bottom-1 right-1 p-0.5 rounded bg-black/75 text-rose-500">
                              <Video className="h-3 w-3" />
                            </span>
                          )}
                        </div>

                        {/* Title & SEO keyword */}
                        <div className="space-y-1 min-w-0">
                          <Link
                            href={`/admin/blog/${post.id}`}
                            className="font-bold text-foreground hover:text-brand-crimson line-clamp-2 transition-colors"
                          >
                            {post.title}
                          </Link>
                          <div className="flex items-center gap-2 flex-wrap text-[11px] text-muted-foreground">
                            <span className="font-mono text-muted-foreground/80">
                              /blog/{post.slug}
                            </span>
                            {post.targetKeyword && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400 font-medium">
                                <Tag className="h-2.5 w-2.5" />
                                <span>{post.targetKeyword}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3">
                      <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold bg-muted text-foreground border border-border/70">
                        {post.category}
                      </span>
                    </td>

                    {/* Publish Status Toggle */}
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(post)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border transition-all ${
                          post.isPublished
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                            : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                        }`}
                        title={
                          post.isPublished
                            ? "Cliquez pour passer en brouillon"
                            : "Cliquez pour publier l'article"
                        }
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
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(post)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          post.featured
                            ? "bg-amber-500/15 text-amber-500 border-amber-500/30 hover:bg-amber-500/25"
                            : "text-muted-foreground/40 border-transparent hover:bg-muted hover:text-muted-foreground"
                        }`}
                        title={post.featured ? "Retirer de la une" : "Mettre à la une"}
                      >
                        <Star
                          className={`h-4 w-4 ${post.featured ? "fill-current" : ""}`}
                        />
                      </button>
                    </td>

                    {/* Views */}
                    <td className="py-3 px-3 text-right font-mono font-medium text-foreground">
                      {post.viewCount.toLocaleString("fr-FR")}
                    </td>

                    {/* Date */}
                    <td className="py-3 px-3 text-right text-muted-foreground text-[11px]">
                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString(
                        "fr-FR",
                        { day: "numeric", month: "short", year: "numeric" }
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* View on live site */}
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          title="Voir sur le site public"
                        >
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        </Button>

                        {/* Edit */}
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-brand-crimson"
                          title="Modifier l'article"
                        >
                          <Link href={`/admin/blog/${post.id}`}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Link>
                        </Button>

                        {/* Delete Single */}
                        <ConfirmActionDialog
                          trigger={
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              title="Supprimer l'article"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          }
                          title="Supprimer l'article"
                          description={`Êtes-vous certain de vouloir supprimer définitivement l'article "${post.title}" ?`}
                          confirmLabel="Supprimer"
                          onConfirm={() => {
                            const formData = new FormData();
                            formData.append("id", post.id);
                            startTransition(async () => {
                              await deleteBlogPostAction(formData);
                            });
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
