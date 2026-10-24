import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { BLOG_POSTS } from "@/lib/blog/mock-posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://super4c2.com";
  const now = new Date();

  // 1. Pages Principales & Outils Stratégiques
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/examens`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/test-gratuit`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/sujets-recents`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/calculateur-crs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/nclc-calculator`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/carnet-erreurs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/communaute`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/confidentialite`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/mentions-legales`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // 2. Séries d'Examen Officielles
  const seriesIds = ["101", "tcf-101", "demo-101-co", "ielts-gen-18-1"];

  const examRoutes: MetadataRoute.Sitemap = seriesIds.flatMap((id) => [
    {
      url: `${baseUrl}/examens/${id}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/examens/${id}/ce`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/examens/${id}/co`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/examens/${id}/ee/intro`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/examens/${id}/eo/intro`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/examens/${id}/examen-blanc`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ]);

  // 3. Articles de Blog Dynamiques (PostgreSQL + Mock-posts)
  let blogRoutes: MetadataRoute.Sitemap = [];

  try {
    const dbPosts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      select: {
        slug: true,
        updatedAt: true,
        publishedAt: true,
        featured: true,
      },
      orderBy: { publishedAt: "desc" },
    });

    if (dbPosts && dbPosts.length > 0) {
      const dbSlugs = new Set(dbPosts.map((p) => p.slug));

      blogRoutes = dbPosts.map((p) => ({
        url: `${baseUrl}/blog/${p.slug}`,
        lastModified: p.updatedAt || p.publishedAt || now,
        changeFrequency: "weekly" as const,
        priority: p.featured ? 0.9 : 0.85,
      }));

      // Compléter avec les mocks non présents en base
      const missingMocks = BLOG_POSTS.filter((m) => !dbSlugs.has(m.slug));
      for (const m of missingMocks) {
        blogRoutes.push({
          url: `${baseUrl}/blog/${m.slug}`,
          lastModified: now,
          changeFrequency: "weekly" as const,
          priority: m.featured ? 0.9 : 0.85,
        });
      }
    } else {
      // Repli sur les mock-posts si base temporairement inaccessible
      blogRoutes = BLOG_POSTS.map((p) => ({
        url: `${baseUrl}/blog/${p.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: p.featured ? 0.9 : 0.85,
      }));
    }
  } catch (error) {
    console.warn("⚠️ Impossible de requêter prisma.blogPost pour sitemap.xml :", error);
    blogRoutes = BLOG_POSTS.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: p.featured ? 0.9 : 0.85,
    }));
  }

  return [...staticRoutes, ...examRoutes, ...blogRoutes];
}
