import { listAllBlogPosts } from "@/lib/blog/blog-service";
import { BlogIndexClient } from "@/components/blog/blog-index-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog & Guides Stratégiques TCF Canada • NCLC 7 • Entrée Express | Super4C2",
  description:
    "Découvrez nos guides méthodologiques d'experts pour réussir le TCF Canada, valider le palier NCLC 7 et débloquer les 50 points de bonus CRS en Entrée Express.",
};

export default async function BlogIndexPage() {
  const posts = await listAllBlogPosts();

  return <BlogIndexClient initialPosts={posts} />;
}
