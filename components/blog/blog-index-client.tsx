"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpenText,
  Clock,
  ArrowRight,
  Search,
  Tag,
  Video,
  FileText,
  Calendar,
  Sparkles,
  User,
  RotateCcw,
  Bookmark,
} from "lucide-react";
import type { BlogPost } from "@/lib/blog/types";
import { Button } from "@/components/ui/button";
import { BlogAccountConversionBanner } from "@/components/blog/blog-account-conversion-banner";
import { BlogBookmarkButton } from "@/components/blog/blog-bookmark-button";
import { BlogFilterBar, type BlogFilterState } from "@/components/blog/blog-filter-bar";
import { useBlogBookmarks } from "@/lib/blog/use-blog-bookmarks";

interface BlogIndexClientProps {
  initialPosts: BlogPost[];
}

export function BlogIndexClient({ initialPosts }: BlogIndexClientProps) {
  const [filters, setFilters] = useState<BlogFilterState>({
    discipline: "ALL",
    duration: "ALL",
    sortBy: "NEWEST",
    query: "",
  });

  const { isBookmarked, count: bookmarkCount } = useBlogBookmarks();

  const featured = initialPosts.find((p) => p.featured) || initialPosts[0];

  // Algorithme de filtrage multi-critères & tri intelligent
  const filteredAndSortedPosts = initialPosts
    .filter((post) => {
      // 1. Discipline / Compétence
      const matchesDiscipline = (() => {
        if (filters.discipline === "ALL") return true;
        if (filters.discipline === "FAVORITES") return isBookmarked(post.slug);
        const lower = (post.category + " " + post.slug + " " + post.title).toLowerCase();

        if (filters.discipline === "EE") {
          return (
            lower.includes("ecrite") ||
            lower.includes("écrite") ||
            lower.includes("tache") ||
            lower.includes("tâche") ||
            post.category === "METHODE_TCF"
          );
        }
        if (filters.discipline === "EO") {
          return lower.includes("orale") || lower.includes("oral") || lower.includes("laurent");
        }
        if (filters.discipline === "CRS") {
          return (
            post.category === "ENTREE_EXPRESS" ||
            lower.includes("crs") ||
            lower.includes("express") ||
            lower.includes("bonus") ||
            lower.includes("tef")
          );
        }
        if (filters.discipline === "COMPREHENSION") {
          return (
            lower.includes("comprehension") ||
            lower.includes("compréhension") ||
            lower.includes("piege") ||
            lower.includes("piège") ||
            lower.includes("qcm")
          );
        }
        if (filters.discipline === "IELTS") {
          return post.category === "IELTS_CANADA";
        }
        return post.category === filters.discipline;
      })();

      // 2. Durée de lecture
      const matchesDuration = (() => {
        if (filters.duration === "ALL") return true;
        if (filters.duration === "SHORT") return post.readTimeMinutes <= 5;
        if (filters.duration === "MEDIUM") return post.readTimeMinutes >= 6 && post.readTimeMinutes <= 9;
        if (filters.duration === "DEEP") return post.readTimeMinutes >= 10;
        return true;
      })();

      // 3. Recherche plein-texte
      const queryLower = filters.query.trim().toLowerCase();
      const matchesSearch =
        queryLower.length === 0 ||
        post.title.toLowerCase().includes(queryLower) ||
        post.excerpt.toLowerCase().includes(queryLower) ||
        post.tags.some((t) => t.toLowerCase().includes(queryLower)) ||
        (post.targetKeyword && post.targetKeyword.toLowerCase().includes(queryLower));

      return matchesDiscipline && matchesDuration && matchesSearch;
    })
    .sort((a, b) => {
      if (filters.sortBy === "FEATURED") {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      }
      if (filters.sortBy === "READ_TIME_ASC") {
        return a.readTimeMinutes - b.readTimeMinutes;
      }
      if (filters.sortBy === "READ_TIME_DESC") {
        return b.readTimeMinutes - a.readTimeMinutes;
      }
      // NEWEST
      return 0;
    });

  const isDefaultView =
    filters.discipline === "ALL" &&
    filters.duration === "ALL" &&
    !filters.query.trim();

  return (
    <div className="space-y-12 py-4">
      {/* 🧭 En-tête du blog */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
          <BookOpenText className="h-3.5 w-3.5" />
          <span>Guides d&apos;Autorité, Méthodologie &amp; Stratégie IRCC</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-foreground">
          Le Blog de Référence pour Réussir le TCF Canada &amp; l&apos;IELTS
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Décryptages des grilles FEI, stratégies de déblocage des +50 points CRS en Entrée Express et astuces de notation pour valider le palier NCLC 7 du premier coup.
        </p>
      </div>

      {/* 🌟 Article Vedette (Featured Post) - affiché uniquement en vue globale par défaut */}
      {featured && isDefaultView && (
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card to-primary/5 p-6 sm:p-8 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 sm:gap-8 items-center">
            {/* Text details */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2.5 text-xs">
                <span className="rounded-full bg-primary text-white font-bold px-3 py-0.5 uppercase tracking-wider text-[11px] shadow-2xs">
                  À la une
                </span>
                <span className="rounded-full bg-muted border border-border px-2.5 py-0.5 text-foreground font-medium text-[11px]">
                  {featured.categoryLabel}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground text-xs font-mono">
                  <Clock className="h-3 w-3 text-primary" /> {featured.readTimeMinutes} min de lecture
                </span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight hover:text-primary transition-colors leading-snug">
                <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
              </h2>

              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed line-clamp-3">
                {featured.excerpt}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border/60">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[11px]">
                    {featured.author.name.charAt(0)}
                  </div>
                  <span>
                    Par <strong className="text-foreground">{featured.author.name}</strong> · {featured.publishedAt}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <BlogBookmarkButton
                    slug={featured.slug}
                    articleTitle={featured.title}
                    variant="button"
                  />

                  <Button asChild className="bg-primary hover:bg-primary-dark text-white font-bold h-9 text-xs shadow-xs">
                    <Link href={`/blog/${featured.slug}`}>
                      Lire le guide complet
                      <ArrowRight className="ml-2 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Media preview */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-border/80 bg-muted/30 shadow-md group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  featured.coverImage ||
                  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&auto=format&fit=crop&q=80"
                }
                alt={featured.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {featured.youtubeUrl && (
                <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-xs text-rose-400 flex items-center gap-1.5 text-xs font-bold shadow-md">
                  <Video className="h-3.5 w-3.5" />
                  <span>Vidéo Intégrée</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 🚀 Machine de Conversion en Compte Gratuit (Audio 1) */}
      <BlogAccountConversionBanner sourceContext="blog_index_top" />

      {/* 🧭 Barre de Filtres Avancés & Tri Intelligent (Option B) */}
      <BlogFilterBar
        filters={filters}
        onChange={setFilters}
        totalResults={filteredAndSortedPosts.length}
        bookmarkCount={bookmarkCount}
      />

      {/* 📚 Grille des Articles Modernisés (Audio 2) */}
      {filteredAndSortedPosts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-3">
          {filters.discipline === "FAVORITES" ? (
            <>
              <Bookmark className="h-10 w-10 text-primary/40 mx-auto" />
              <h4 className="font-display text-lg font-bold text-foreground">
                Aucun guide dans vos favoris pour le moment
              </h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Cliquez sur l&apos;icône marque-page présente sur n&apos;importe quel article pour le sauvegarder et préparer vos révisions.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    discipline: "ALL",
                  }))
                }
                className="text-xs"
              >
                Explorer tous les articles
              </Button>
            </>
          ) : (
            <>
              <BookOpenText className="h-10 w-10 text-muted-foreground/40 mx-auto" />
              <h4 className="font-display text-lg font-bold text-foreground">
                Aucun article ne correspond à votre sélection
              </h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Essayez d&apos;élargir vos filtres de durée ou modifiez vos mots-clés de recherche.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setFilters({
                    discipline: "ALL",
                    duration: "ALL",
                    sortBy: "NEWEST",
                    query: "",
                  })
                }
                className="text-xs"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                Réinitialiser tous les filtres
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedPosts.map((post) => {

            const fallbackCover =
              post.coverImage ||
              "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&auto=format&fit=crop&q=80";

            return (
              <article
                key={post.slug}
                className="group flex flex-col justify-between rounded-2xl border border-border bg-card overflow-hidden shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl"
              >
                {/* 🖼️ Vignette 16:9 avec Badges Flottants Modernes & Favoris */}
                <div className="relative aspect-video w-full overflow-hidden bg-muted/40 border-b border-border/60">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fallbackCover}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Catégorie Flottante Top-Left */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-black/70 backdrop-blur-md text-white border border-white/20 shadow-md">
                      {post.categoryLabel}
                    </span>
                  </div>

                  {/* Temps de Lecture & Bouton Favoris Top-Right */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-black/70 backdrop-blur-md text-white/95 border border-white/20 shadow-md">
                      <Clock className="h-2.5 w-2.5 text-primary" /> {post.readTimeMinutes} min
                    </span>
                    <BlogBookmarkButton slug={post.slug} articleTitle={post.title} variant="icon" />
                  </div>

                  {/* Badge Vidéo Bottom-Right si vidéo YouTube */}
                  {post.youtubeUrl && (
                    <div className="absolute bottom-2.5 right-2.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-600/90 backdrop-blur-md text-white border border-rose-400/30 shadow-md">
                        <Video className="h-3 w-3" />
                        Vidéo
                      </span>
                    </div>
                  )}
                </div>


                {/* 📝 Contenu de la Carte */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    {/* Auteur & Date */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
                        {post.author.name.charAt(0)}
                      </div>
                      <span className="font-medium text-foreground text-[11px] truncate max-w-[120px]">
                        {post.author.name}
                      </span>
                      <span>•</span>
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {post.publishedAt}
                      </span>
                    </div>

                    {/* Titre */}
                    <h3 className="font-display text-base sm:text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>

                    {/* Extrait */}
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Footer de la Carte */}
                  <div className="pt-3 border-t border-border/60 space-y-2.5">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-0.5 rounded-md bg-muted/60 px-1.5 py-0.5 text-[10px] text-muted-foreground font-medium"
                        >
                          <Tag className="h-2 w-2 text-primary/70" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Bouton d'Action */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Sparkles className="h-3 w-3" /> Guide Pratique
                      </span>

                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-xs font-bold text-primary group-hover:translate-x-1 transition-transform"
                      >
                        Lire le guide
                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

