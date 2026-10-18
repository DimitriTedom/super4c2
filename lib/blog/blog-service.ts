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
          tags: p.tags && p.tags.length > 0 ? p.tags : ["TCF Canada", "NCLC 7"],
          content: p.content,
          targetCta: {
            type: "CRS_CALCULATOR",
            label: "Simuler mes 50 points CRS avec le NCLC 7",
            href: "/nclc-calculator",
          },
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
        tags: dbPost.tags && dbPost.tags.length > 0 ? dbPost.tags : ["TCF Canada", "NCLC 7"],
        content: dbPost.content,
        targetCta: {
          type: "CRS_CALCULATOR",
          label: "Simuler mes 50 points CRS avec le NCLC 7",
          href: "/nclc-calculator",
        },
      };
    }
  } catch (error) {
    console.warn("⚠️ Impossible d'interroger prisma.post pour slug :", slug, error);
  }

  return getMockBlogPost(slug) || null;
}
