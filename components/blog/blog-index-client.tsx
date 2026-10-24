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
  Sparkles,
  Calendar,
} from "lucide-react";
import type { BlogPost } from "@/lib/blog/types";
import { Button } from "@/components/ui/button";

const CATEGORIES: { key: string; label: string }[] = [
  { key: "ALL", label: "Tous les Articles" },
  { key: "ENTREE_EXPRESS", label: "Entrée Express & CRS" },
  { key: "METHODE_TCF", label: "Méthodologie TCF" },
  { key: "IELTS_CANADA", label: "IELTS General" },
  { key: "ACTUALITES_EXAMENS", label: "Actualités & IRCC" },
  { key: "REUSSITE_CANDIDATS", label: "Réussite Candidats" },
];

interface BlogIndexClientProps {
  initialPosts: BlogPost[];
}

export function BlogIndexClient({ initialPosts }: BlogIndexClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const featured = initialPosts.find((p) => p.featured) || initialPosts[0];

  const filteredPosts = initialPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === "ALL" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (post.targetKeyword && post.targetKeyword.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

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

      {/* 🌟 Article Vedette (Featured Post) */}
      {featured && selectedCategory === "ALL" && !searchQuery && (
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
                <div className="text-xs text-muted-foreground">
                  Par <strong className="text-foreground">{featured.author.name}</strong> · {featured.publishedAt}
                </div>

                <Button asChild className="bg-primary hover:bg-primary-dark text-white font-bold h-9 text-xs shadow-xs">
                  <Link href={`/blog/${featured.slug}`}>
                    Lire le guide complet
                    <ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Media preview */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-border/80 bg-muted/30 shadow-md">
              {featured.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={featured.coverImage}
                  alt={featured.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground text-xs gap-1.5">
                  <FileText className="h-8 w-8 opacity-30" />
                  <span>Guide Stratégique Super4C2</span>
                </div>
              )}
              {featured.youtubeUrl && (
                <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-xs text-rose-500 flex items-center gap-1.5 text-xs font-bold">
                  <Video className="h-3.5 w-3.5" />
                  <span>Vidéo Intégrée</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 🔍 Barre de Recherche & Filtres Catégories */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Catégories */}
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  selectedCategory === cat.key
                    ? "bg-primary text-white shadow-xs"
                    : "border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Recherche */}
          <div className="relative sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un guide, NCLC 7..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-input bg-card py-2 pl-9 pr-4 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* 📚 Grille des Articles */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <article
            key={post.slug}
            className="group flex flex-col justify-between rounded-2xl border border-border bg-card overflow-hidden shadow-xs transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
          >
            {/* Thumbnail */}
            {post.coverImage ? (
              <div className="relative aspect-video w-full overflow-hidden bg-muted/40 border-b border-border/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {post.youtubeUrl && (
                  <span className="absolute bottom-2 right-2 p-1 rounded-md bg-black/80 text-rose-500 flex items-center gap-1 text-[10px] font-bold">
                    <Video className="h-3 w-3" />
                    Vidéo
                  </span>
                )}
              </div>
            ) : null}

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="rounded-md border border-border/80 bg-muted/50 px-2 py-0.5 font-semibold text-foreground text-[10px] uppercase tracking-wider">
                    {post.categoryLabel}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-mono">
                    <Clock className="h-3 w-3 text-primary" /> {post.readTimeMinutes} min
                  </span>
                </div>

                <h3 className="font-display text-base sm:text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-border/60 space-y-2.5">
                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-0.5 rounded bg-muted/60 px-1.5 py-0.5 text-[10px] text-muted-foreground"
                    >
                      <Tag className="h-2 w-2" />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-muted-foreground">
                    {post.publishedAt}
                  </span>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-xs font-bold text-primary group-hover:translate-x-0.5 transition-transform"
                  >
                    Lire l&apos;article →
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
