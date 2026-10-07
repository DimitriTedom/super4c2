"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpenText,
  Clock,
  ArrowRight,
  Search,
  Tag,
} from "lucide-react";
import { BLOG_POSTS, getFeaturedBlogPost } from "@/lib/blog/mock-posts";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

const CATEGORIES: { key: string; label: string }[] = [
  { key: "ALL", label: "Tous les Articles" },
  { key: "ENTREE_EXPRESS", label: "Entrée Express & CRS" },
  { key: "METHODE_TCF", label: "Méthodologie TCF" },
  { key: "IELTS_CANADA", label: "IELTS General" },
  { key: "ACTUALITES_EXAMENS", label: "Actualités & IRCC" },
];

export default function BlogIndexPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const featured = getFeaturedBlogPost();

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory =
      selectedCategory === "ALL" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12 py-4">
      {/* 🧭 En-tête du blog */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
          <BookOpenText className="h-3.5 w-3.5" />
          <span>Guides Officiels, Méthodologie & Stratégie IRCC</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-foreground">
          Le Blog de Référence pour Réussir le TCF Canada &amp; l&apos;IELTS
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Décryptages des grilles FEI, stratégies de déblocage des +50 points CRS en Entrée Express et astuces pour franchir le palier NCLC 7 du premier coup.
        </p>
      </div>

      {/* 🌟 Article Vedette (Featured Post) */}
      {featured && selectedCategory === "ALL" && !searchQuery && (
        <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-card via-card to-primary/5 p-6 sm:p-10 shadow-lg">
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="rounded-full bg-primary text-white font-bold px-3 py-1 uppercase tracking-wider text-[11px]">
                À la une
              </span>
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-muted-foreground font-medium">
                {featured.categoryLabel}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> {featured.readTimeMinutes} min de lecture
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight hover:text-primary transition-colors">
              <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
            </h2>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              {featured.excerpt}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-border/50">
              <div className="text-xs text-muted-foreground">
                Par <strong className="text-foreground">{featured.author.name}</strong> · {featured.publishedAt}
              </div>

              <Button asChild className="bg-primary hover:bg-primary-dark text-white font-bold">
                <Link href={`/blog/${featured.slug}`}>
                  Lire le guide complet
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 🔍 Barre de Recherche & Filtres Catégories */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Catégories */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                  selectedCategory === cat.key
                    ? "bg-primary text-white shadow-xs"
                    : "border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Recherche */}
          <div className="relative sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher un guide, NCLC 7..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border bg-card py-2 pl-9 pr-4 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* 📚 Grille des Articles */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <article
            key={post.slug}
            className="group flex flex-col justify-between rounded-2xl border bg-card p-6 shadow-xs transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="rounded-md border bg-muted/50 px-2 py-0.5 font-medium text-foreground text-[11px]">
                  {post.categoryLabel}
                </span>
                <span className="flex items-center gap-1 text-[11px]">
                  <Clock className="h-3 w-3" /> {post.readTimeMinutes} min
                </span>
              </div>

              <h3 className="font-display text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h3>

              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
            </div>

            <div className="pt-6 border-t mt-4 space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded bg-muted/60 px-1.5 py-0.5 text-[10px] text-muted-foreground"
                  >
                    <Tag className="h-2.5 w-2.5" /> {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[11px] text-muted-foreground">{post.publishedAt}</span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="font-bold text-primary inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                >
                  Lire →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="rounded-2xl border border-dashed p-12 text-center space-y-3">
          <BookOpenText className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-semibold text-foreground">
            Aucun article ne correspond à votre recherche &quot;{searchQuery}&quot;.
          </p>
          <Button variant="outline" size="sm" onClick={() => { setSearchQuery(""); setSelectedCategory("ALL"); }}>
            Réinitialiser les filtres
          </Button>
        </div>
      )}

      {/* 🚀 Bannière Kit Pédagogique Gratuit */}
      <div className="rounded-3xl border bg-muted/30 p-8 sm:p-12 text-center space-y-4">
        <span className="rounded-full bg-primary/10 text-primary font-bold px-3 py-1 text-xs">
          Accélérateur de Révision
        </span>
        <h3 className="font-display text-2xl sm:text-3xl font-black tracking-tight">
          Passez Directement à l&apos;Action avec le Simulateur Officiel
        </h3>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Lire les guides est essentiel, mais la réussite repose sur la pratique en temps réel avec le chronomètre officiel de 60 minutes.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <ShimmerButton
            href="/examens/demo-101-ce/ce"
            background="#E51A31"
            shimmerColor="#ffffff"
            className="font-bold px-7"
          >
            Lancer la Série 101 CBT (39Q)
          </ShimmerButton>
          <InteractiveHoverButton href="/test-gratuit" className="text-xs font-semibold px-6">
            Faire le test diagnostique gratuit
          </InteractiveHoverButton>
        </div>
      </div>
    </div>
  );
}
