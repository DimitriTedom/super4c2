import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Tag,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { getSingleBlogPost, listAllBlogPosts } from "@/lib/blog/blog-service";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { ReadingProgressBar } from "@/components/blog/reading-progress-bar";
import { BlogTableOfContents, extractTocFromMarkdown } from "@/components/blog/blog-toc";
import { BlogVideoPlayer, extractYouTubeId } from "@/components/blog/blog-video-player";
import { BlogSocialShare } from "@/components/blog/blog-social-share";
import { BlogAuthorBio } from "@/components/blog/blog-author-bio";
import { BlogContentRenderer } from "@/components/blog/blog-content-renderer";
import { BlogLeadEngagement } from "@/components/blog/blog-lead-engagement";
import { BlogBookmarkButton } from "@/components/blog/blog-bookmark-button";
import { BlogArticleFeedback } from "@/components/blog/blog-article-feedback";
import { BlogCommentsSection } from "@/components/blog/blog-comments-section";
import { BlogArticleFooterCta } from "@/components/blog/blog-article-footer-cta";
import { BlogSidebarStickyCta } from "@/components/blog/blog-sidebar-sticky-cta";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await getSingleBlogPost(slug);
    if (!post) {
      return { title: "Article introuvable — Super4C2" };
    }

    const ogImage =
      post.coverImage ||
      (post.youtubeUrl && extractYouTubeId(post.youtubeUrl)
        ? `https://img.youtube.com/vi/${extractYouTubeId(post.youtubeUrl)}/maxresdefault.jpg`
        : "https://super4c2.com/brand/cbt-platform-preview.jpg");

    return {
      title: `${post.title} | Super4C2`,
      description: post.excerpt,
      keywords: post.tags,
      alternates: {
        canonical: `https://super4c2.com/blog/${post.slug}`,
      },
      openGraph: {
        title: `${post.title} | Super4C2`,
        description: post.excerpt,
        type: "article",
        url: `https://super4c2.com/blog/${post.slug}`,
        publishedTime: post.publishedAt,
        authors: [post.author?.name || "Super4C2"],
        tags: post.tags,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${post.title} | Super4C2`,
        description: post.excerpt,
        images: [ogImage],
      },
    };
  } catch (err) {
    console.warn("⚠️ Erreur lors de la génération des métadonnées du blog :", err);
    return {
      title: "Blog & Guides Stratégiques TCF / TEF Canada — Super4C2",
    };
  }
}

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getSingleBlogPost(slug);

  if (!post) {
    notFound();
  }

  // Articles recommandés (sécurisés contre toute panne DB)
  let relatedPosts: any[] = [];
  try {
    const allPosts = await listAllBlogPosts();
    if (Array.isArray(allPosts)) {
      relatedPosts = allPosts.filter((p) => p && p.slug !== post.slug).slice(0, 2);
    }
  } catch (recErr) {
    console.warn("⚠️ Impossible de charger les articles recommandés :", recErr);
    relatedPosts = [];
  }

  // Fallbacks défensifs pour garantir un rendu 100% robuste
  const authorName = post.author?.name || "Équipe Pédagogique Super4C2";
  const authorRole = post.author?.role || "Expert TCF Canada & Concepteur Pédagogique";
  const targetCta = post.targetCta || {
    type: "CBT_EXAM",
    label: "Tester le Simulateur CBT en Conditions Réelles",
    href: "/examens",
  };

  // Extraction des ancres pour le sommaire interactif
  const tocItems = extractTocFromMarkdown(post.content || "");

  // YouTube ID si disponible
  const ytId = post.youtubeUrl ? extractYouTubeId(post.youtubeUrl) : null;

  // Données structurées Schema.org JSON-LD
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage || (ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : undefined),
    datePublished: post.publishedAt,
    author: {
      "@type": "Person",
      name: authorName,
      jobTitle: authorRole,
    },
    publisher: {
      "@type": "Organization",
      name: "Super4C2",
      url: "https://super4c2.com",
      logo: {
        "@type": "ImageObject",
        url: "https://super4c2.com/brand/Le%20Logo%20Primaire.png",
      },
    },
    isAccessibleForFree: true,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://super4c2.com/blog/${post.slug}`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: "https://super4c2.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog TCF Canada",
        item: "https://super4c2.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://super4c2.com/blog/${post.slug}`,
      },
    ],
  };

  const videoJsonLd = ytId
    ? {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: post.title,
        description: post.excerpt,
        thumbnailUrl: `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`,
        embedUrl: `https://www.youtube.com/embed/${ytId}`,
        uploadDate: post.publishedAt,
      }
    : null;

  return (
    <>
      {/* 📊 Barre de Progression de Lecture au Défilement */}
      <ReadingProgressBar />

      {/* 🏷️ Balises de Données Structurées JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {videoJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }}
        />
      )}

      <article className="mx-auto max-w-5xl space-y-8 py-6 px-4 sm:px-6">
        {/* 🧭 Fil d'Ariane Sémantique & Bouton Retour */}
        <nav
          aria-label="Fil d'Ariane"
          className="flex items-center justify-between gap-2 text-xs text-muted-foreground border-b border-border/60 pb-3"
        >
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-foreground transition-colors">
              Accueil
            </Link>
            <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
            <Link href="/blog" className="hover:text-foreground transition-colors">
              Blog
            </Link>
            <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
            <span className="font-semibold text-primary truncate max-w-[200px] sm:max-w-none">
              {post.categoryLabel}
            </span>
          </div>

          <Button variant="ghost" size="sm" asChild className="h-7 text-xs gap-1.5 shrink-0">
            <Link href="/blog">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Tous les articles</span>
            </Link>
          </Button>
        </nav>

        {/* 📰 En-tête de l'Article */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground">
            <span className="px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-primary/10 text-primary border border-primary/20">
              {post.categoryLabel}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> {post.publishedAt}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-mono">
              <Clock className="h-3.5 w-3.5 text-primary" /> {post.readTimeMinutes} min de lecture
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-foreground leading-[1.15]">
            {post.title}
          </h1>

          <p className="text-base sm:text-xl text-muted-foreground leading-relaxed font-normal">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div className="flex flex-wrap gap-1.5">
              {(post.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-muted/40 px-2.5 py-0.5 text-[11px] text-muted-foreground font-medium"
                >
                  <Tag className="h-2.5 w-2.5 text-primary" /> {tag}
                </span>
              ))}
            </div>

            {/* Partage Social Rapide & Favoris */}
            <div className="flex items-center gap-2">
              <BlogBookmarkButton slug={post.slug} articleTitle={post.title} variant="button" />
              <BlogSocialShare title={post.title} slug={post.slug} />
            </div>
          </div>
        </header>

        {/* 🎥 Bloc Média : Vidéo YouTube ou Image de Couverture */}
        {ytId ? (
          <BlogVideoPlayer urlOrId={ytId} title={post.title} />
        ) : post.coverImage ? (
          <div className="my-6 aspect-video w-full rounded-2xl overflow-hidden border border-border/80 shadow-lg bg-muted/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : null}

        {/* 📖 Layout Scindé : Flux de Lecture + Sommaire Flottant Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10 items-start pt-2">
          {/* Colonne Principale de Lecture */}
          <div className="space-y-10 min-w-0">
            {/* Sommaire Mobile Déployable */}
            <BlogTableOfContents items={tocItems} readTimeMinutes={post.readTimeMinutes} />

            {/* Rendu Markdown Haute Fidélité avec Ancres & Callout de Milieu d'Article */}
            <BlogContentRenderer
              content={post.content}
              categoryLabel={post.categoryLabel}
              ctaLabel={targetCta.label}
              ctaUrl={targetCta.href}
            />

            {/* 💬 Évaluation & Réactions Candidat (Option A) */}
            <BlogArticleFeedback slug={post.slug} articleTitle={post.title} />

            {/* 🎁 Capture de Lead VIP 100% Gratuite : Pack Modèles PDF & Communauté WhatsApp */}
            <BlogLeadEngagement
              articleTitle={post.title}
              categoryLabel={post.categoryLabel}
            />

            {/* 🎯 Encadré d'Action Contextuel Haute Conversion */}
            <BlogArticleFooterCta targetCta={targetCta} />

            {/* ✍️ Signature & Autorité Auteur E-E-A-T */}
            <BlogAuthorBio name={authorName} role={authorRole} />

            {/* 💬 Salon de Mentorat & Échange Pédagogique (Option C) */}
            <BlogCommentsSection
              slug={post.slug}
              category={post.category}
              articleTitle={post.title}
            />
          </div>

          {/* Colonne Latérale Droite : Sommaire Interactif Sticky Desktop */}
          <div className="hidden lg:block space-y-6">
            <BlogTableOfContents items={tocItems} readTimeMinutes={post.readTimeMinutes} />

            {/* Mini Box d'Appel à l'Action Sticky */}
            <BlogSidebarStickyCta />
          </div>
        </div>

        {/* 🔗 Articles Recommandés Connexes */}
        {relatedPosts.length > 0 && (
          <div className="space-y-4 border-t border-border/80 pt-10">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl sm:text-2xl font-black text-foreground">
                Poursuivre votre Préparation
              </h3>
              <Button asChild variant="ghost" size="sm" className="text-xs">
                <Link href="/blog">Voir tous les guides →</Link>
              </Button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {relatedPosts.map((related) => {
                const relatedCover =
                  related.coverImage ||
                  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&auto=format&fit=crop&q=80";

                return (
                  <div
                    key={related.slug}
                    className="group rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg flex flex-col justify-between"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video w-full overflow-hidden bg-muted/40 border-b border-border/60">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={relatedCover}
                        alt={related.title}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide bg-black/70 backdrop-blur-md text-white border border-white/20">
                          {related.categoryLabel}
                        </span>
                      </div>
                      <div className="absolute top-2.5 right-2.5">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-black/70 backdrop-blur-md text-white/90 border border-white/20 flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5 text-primary" /> {related.readTimeMinutes} min
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <h4 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                          <Link href={`/blog/${related.slug}`}>{related.title}</Link>
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {related.excerpt}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                        <span className="text-[11px] text-muted-foreground">
                          {related.publishedAt}
                        </span>
                        <Link
                          href={`/blog/${related.slug}`}
                          className="inline-flex items-center text-xs font-bold text-primary group-hover:translate-x-0.5 transition-transform"
                        >
                          Lire le guide →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
