"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  slugify,
  toBoolean,
  toCsvArray,
  toOptionalString,
} from "@/lib/admin-crud-utils";
import { withToastQuery } from "@/lib/toast-navigation";

function normalizeBlogPostPayload(formData: FormData) {
  const title = toOptionalString(formData.get("title"));
  const rawSlug = toOptionalString(formData.get("slug"));
  const excerpt = toOptionalString(formData.get("excerpt"));
  const content = toOptionalString(formData.get("content"));
  const coverImage = toOptionalString(formData.get("coverImage"));
  const authorName =
    toOptionalString(formData.get("authorName")) || "Équipe Pédagogique Super4C2";
  const authorRole =
    toOptionalString(formData.get("authorRole")) || "Expert NCLC & Ancien Correcteur FEI";
  const category = toOptionalString(formData.get("category")) || "Stratégie TCF";
  const tags = toCsvArray(formData.get("tags"));
  const isPublished = toBoolean(formData.get("isPublished"));
  const featured = toBoolean(formData.get("featured"));

  if (!title || !excerpt || !content) {
    throw new Error("Le titre, l'extrait et le contenu Markdown sont obligatoires.");
  }

  const slug = rawSlug ? slugify(rawSlug) : slugify(title);

  // Auto-calculate reading minutes based on word count (~200 words per minute)
  const wordCount = content.trim().split(/\s+/).length;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return {
    title,
    slug,
    excerpt,
    content,
    coverImage,
    authorName,
    authorRole,
    readingMinutes,
    category,
    tags,
    isPublished,
    featured,
  };
}

export async function createBlogPostAction(formData: FormData) {
  const payload = normalizeBlogPostPayload(formData);

  // Check unique slug
  const existing = await prisma.blogPost.findUnique({
    where: { slug: payload.slug },
  });

  if (existing) {
    payload.slug = `${payload.slug}-${Date.now().toString().slice(-4)}`;
  }

  const created = await prisma.blogPost.create({
    data: payload,
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/");
  redirect(
    withToastQuery("/admin/blog", {
      title: "Article de blog créé",
      message: `L'article "${created.title.slice(0, 40)}..." a été enregistré avec succès.`,
      variant: "success",
    })
  );
}

export async function updateBlogPostAction(formData: FormData) {
  const id = toOptionalString(formData.get("id"));
  if (!id) throw new Error("Identifiant de l'article manquant.");

  const payload = normalizeBlogPostPayload(formData);

  // Check unique slug on other articles
  const conflict = await prisma.blogPost.findFirst({
    where: {
      slug: payload.slug,
      NOT: { id },
    },
  });

  if (conflict) {
    payload.slug = `${payload.slug}-${Date.now().toString().slice(-4)}`;
  }

  const updated = await prisma.blogPost.update({
    where: { id },
    data: payload,
  });

  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${id}`);
  revalidatePath("/blog");
  revalidatePath(`/blog/${updated.slug}`);
  revalidatePath("/");
  redirect(
    withToastQuery("/admin/blog", {
      title: "Article mis à jour",
      message: `L'article "${updated.title.slice(0, 40)}..." a été actualisé.`,
      variant: "success",
    })
  );
}

export async function deleteBlogPostAction(formData: FormData) {
  const id = toOptionalString(formData.get("id"));
  if (!id) throw new Error("Identifiant d'article manquant.");

  const deleted = await prisma.blogPost.delete({
    where: { id },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/");
  redirect(
    withToastQuery("/admin/blog", {
      title: "Article supprimé",
      message: `L'article "${deleted.title.slice(0, 40)}..." a bien été retiré du blog.`,
      variant: "success",
    })
  );
}

export async function toggleBlogPostPublishAction(formData: FormData) {
  const id = toOptionalString(formData.get("id"));
  if (!id) throw new Error("Identifiant d'article manquant.");

  const current = await prisma.blogPost.findUnique({
    where: { id },
    select: { isPublished: true, title: true, slug: true },
  });

  if (!current) throw new Error("Article introuvable.");

  await prisma.blogPost.update({
    where: { id },
    data: { isPublished: !current.isPublished },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/");
  redirect(
    withToastQuery("/admin/blog", {
      title: current.isPublished ? "Article dépublié" : "Article publié",
      message: `L'article est désormais ${
        current.isPublished ? "en brouillon" : "accessible aux lecteurs"
      }.`,
      variant: "success",
    })
  );
}

export async function toggleBlogPostFeaturedAction(formData: FormData) {
  const id = toOptionalString(formData.get("id"));
  if (!id) throw new Error("Identifiant d'article manquant.");

  const current = await prisma.blogPost.findUnique({
    where: { id },
    select: { featured: true, title: true },
  });

  if (!current) throw new Error("Article introuvable.");

  await prisma.blogPost.update({
    where: { id },
    data: { featured: !current.featured },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/");
  redirect(
    withToastQuery("/admin/blog", {
      title: current.featured ? "Article retiré de la une" : "Article mis à la une",
      message: `L'article ${
        current.featured ? "n'est plus mis en avant" : "apparaît désormais en tête du blog"
      }.`,
      variant: "success",
    })
  );
}
