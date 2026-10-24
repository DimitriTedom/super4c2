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

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
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
      authors: [post.author.name],
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
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getSingleBlogPost(slug);

  if (!post) {
    notFound();
  }

  // Articles recommandés (les plus récents hors l'article actif)
  const allPosts = await listAllBlogPosts();
  const relatedPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  // Extraction des ancres pour le sommaire interactif
  const tocItems = extractTocFromMarkdown(post.content);

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
      name: post.author.name,
      jobTitle: post.author.role,
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
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://super4c2.com/blog/${post.slug}`,
    },
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
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-muted/40 px-2.5 py-0.5 text-[11px] text-muted-foreground font-medium"
                >
                  <Tag className="h-2.5 w-2.5 text-primary" /> {tag}
                </span>
              ))}
            </div>

            {/* Partage Social Rapide */}
            <BlogSocialShare title={post.title} slug={post.slug} />
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
              ctaLabel={post.targetCta.label}
              ctaUrl={post.targetCta.href}
            />

            {/* Boutons de Partage en Fin d'Article */}
            <div className="p-4 rounded-2xl border border-border bg-card/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <span className="text-xs font-semibold text-foreground">
                Ce guide vous a été utile pour votre préparation ?
              </span>
              <BlogSocialShare title={post.title} slug={post.slug} />
            </div>

            {/* 🎯 Encadré d'Action Contextuel Haute Conversion */}
            <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-card via-card to-primary/10 p-6 sm:p-8 space-y-4 shadow-md">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                <Zap className="h-3 w-3" />
                Passer à l&apos;Application Pratique
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-black tracking-tight text-foreground">
                Prêt à Valider votre Palier NCLC 7 et Gagner vos 50 Points CRS ?
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                Rejoignez Super4C2 pour vous entraîner dans les conditions réelles des examens officiels FEI : simulateur CBT chronométré, double notation instantanée et modèles Magic Rewrite C2.
              </p>

              <div className="pt-2">
                <ShimmerButton
                  href={post.targetCta.href}
                  background="#E51A31"
                  shimmerColor="#ffffff"
                  className="font-bold px-7"
                >
                  {post.targetCta.label} →
                </ShimmerButton>
              </div>
            </div>

            {/* ✍️ Signature & Autorité Auteur E-E-A-T */}
            <BlogAuthorBio name={post.author.name} role={post.author.role} />
          </div>

          {/* Colonne Latérale Droite : Sommaire Interactif Sticky Desktop */}
          <div className="hidden lg:block space-y-6">
            <BlogTableOfContents items={tocItems} readTimeMinutes={post.readTimeMinutes} />

            {/* Mini Box d'Appel à l'Action Sticky */}
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 text-center space-y-2.5 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                Objectif NCLC 7+
              </span>
              <h5 className="font-display font-bold text-xs text-foreground leading-snug">
                Simulateur CBT d&apos;Examen Officiel
              </h5>
              <p className="text-[11px] text-muted-foreground">
                Découvrez la double correction IA conforme au barème FEI.
              </p>
              <Button asChild size="sm" className="w-full text-xs font-bold h-8">
                <Link href="/examens">Tester le Simulateur →</Link>
              </Button>
            </div>
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

            <div className="grid gap-4 sm:grid-cols-2">
              {relatedPosts.map((related) => (
                <div
                  key={related.slug}
                  className="group rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-primary uppercase tracking-wide">
                      {related.categoryLabel}
                    </span>
                    <h4 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      <Link href={`/blog/${related.slug}`}>{related.title}</Link>
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {related.excerpt}
                    </p>
                  </div>

                  <Link
                    href={`/blog/${related.slug}`}
                    className="mt-4 inline-flex items-center text-xs font-bold text-primary group-hover:translate-x-0.5 transition-transform"
                  >
                    Lire le guide complet →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
