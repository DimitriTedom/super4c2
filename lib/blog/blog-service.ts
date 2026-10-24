import { prisma } from "@/lib/prisma";
import { BLOG_POSTS, getBlogPost as getMockBlogPost } from "./mock-posts";
import type { BlogPost, BlogCategory } from "./types";

function mapDbCategoryToKey(cat: string): { key: BlogCategory; label: string } {
  const c = cat.toLowerCase();
  if (c.includes("express") || c.includes("crs")) {
    return { key: "ENTREE_EXPRESS", label: "Entrée Express & CRS" };
  }
  if (c.includes("ielts")) {
    return { key: "IELTS_CANADA", label: "IELTS General" };
  }
  if (c.includes("actualit") || c.includes("ircc")) {
    return { key: "ACTUALITES_EXAMENS", label: "Actualités & IRCC" };
  }
  if (c.includes("reussite") || c.includes("temoignage")) {
    return { key: "REUSSITE_CANDIDATS", label: "Réussite Candidats" };
  }
  return { key: "METHODE_TCF", label: "Méthodologie TCF" };
}

export function getDefaultCoverImage(category?: string | null): string {
  const c = category?.toLowerCase() || "";
  if (c.includes("orale") || c.includes("oral") || c.includes("laurent")) {
    return "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80";
  }
  if (c.includes("ecrite") || c.includes("écrit") || c.includes("tache") || c.includes("tâche")) {
    return "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80";
  }
  if (c.includes("ielts") || c.includes("anglais")) {
    return "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80";
  }
  if (c.includes("methode") || c.includes("méthodologie") || c.includes("cbt")) {
    return "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80";
  }
  return "https://images.unsplash.com/photo-1517935703635-27c94660ab4f?auto=format&fit=crop&w=1200&q=80";
}

function resolveCta(ctaType?: string | null, ctaLabel?: string | null, ctaUrl?: string | null) {
  if (ctaType === "CBT_EXAM") {
    return {
      type: "CBT_EXAM" as const,
      label: ctaLabel || "S'entraîner sur le Simulateur CBT Officiel",
      href: ctaUrl || "/examens",
    };
  }
  if (ctaType === "RECENT_TOPICS") {
    return {
      type: "RECENT_TOPICS" as const,
      label: ctaLabel || "Consulter les Sujets Récents d'Examen 2026",
      href: ctaUrl || "/sujets-recents",
    };
  }
  if (ctaType === "COMMUNITY") {
    return {
      type: "COMMUNITY" as const,
      label: ctaLabel || "Rejoindre le Groupe d'Entraide WhatsApp VIP",
      href: ctaUrl || "/communaute",
    };
  }
  if (ctaType === "FREE_TEST") {
    return {
      type: "FREE_TEST" as const,
      label: ctaLabel || "Passer le Test Diagnostique Gratuit",
      href: ctaUrl || "/test-gratuit",
    };
  }
  return {
    type: "CRS_CALCULATOR" as const,
    label: ctaLabel || "Simuler mes 50 points CRS avec le NCLC 7",
    href: ctaUrl || "/nclc-calculator",
  };
}

export async function listAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const dbPosts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    });

    if (dbPosts && dbPosts.length > 0) {
      const mapped: BlogPost[] = dbPosts.map((p) => {
        const { key, label } = mapDbCategoryToKey(p.category);
        return {
          slug: p.slug,
          title: p.title,
          excerpt: p.excerpt,
          category: key,
          categoryLabel: label,
          publishedAt: new Date(p.publishedAt).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          readTimeMinutes: p.readingMinutes || 5,
          author: {
            name: p.authorName || "Équipe Pédagogique Super4C2",
            role: p.authorRole || "Expert NCLC & Ancien Correcteur FEI",
          },
          featured: p.featured,
          coverImage: p.coverImage || getDefaultCoverImage(p.category),
          youtubeUrl: p.youtubeUrl || undefined,
          targetKeyword: p.targetKeyword || undefined,
          tags: p.tags && p.tags.length > 0 ? p.tags : ["TCF Canada", "NCLC 7"],
          content: p.content,
          targetCta: resolveCta(p.ctaType, p.ctaLabel, p.ctaUrl),
        };
      });

      // Si le catalogue en base contient des articles, on les complète avec les mocks manquants
      const existingSlugs = new Set(mapped.map((m) => m.slug));
      const remainingMocks = BLOG_POSTS.filter((m) => !existingSlugs.has(m.slug));
      return [...mapped, ...remainingMocks];
    }
  } catch (error) {
    console.warn("⚠️ Impossible d'interroger prisma.blogPost, repli sur mock-posts :", error);
  }

  return BLOG_POSTS;
}

export async function getSingleBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const dbPost = await prisma.blogPost.findFirst({
      where: { slug, isPublished: true },
    });

    if (dbPost) {
      const { key, label } = mapDbCategoryToKey(dbPost.category);
      return {
        slug: dbPost.slug,
        title: dbPost.title,
        excerpt: dbPost.excerpt,
        category: key,
        categoryLabel: label,
        publishedAt: new Date(dbPost.publishedAt).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        readTimeMinutes: dbPost.readingMinutes || 5,
        author: {
          name: dbPost.authorName || "Équipe Pédagogique Super4C2",
          role: dbPost.authorRole || "Expert NCLC & Ancien Correcteur FEI",
        },
        featured: dbPost.featured,
        coverImage: dbPost.coverImage || getDefaultCoverImage(dbPost.category),
        youtubeUrl: dbPost.youtubeUrl || undefined,
        targetKeyword: dbPost.targetKeyword || undefined,
        tags: dbPost.tags && dbPost.tags.length > 0 ? dbPost.tags : ["TCF Canada", "NCLC 7"],
        content: dbPost.content,
        targetCta: resolveCta(dbPost.ctaType, dbPost.ctaLabel, dbPost.ctaUrl),
      };
    }
  } catch (error) {
    console.warn("⚠️ Impossible d'interroger prisma.post pour slug :", slug, error);
  }

  return getMockBlogPost(slug) || null;
}
