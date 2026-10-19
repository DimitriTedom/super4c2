import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { BlogForm } from "@/components/admin/blog-form";
import { prisma } from "@/lib/prisma";
import { updateBlogPostAction } from "../actions";

export const metadata = {
  title: "Modifier un Article — Back-Office | Super4C2",
};

export const dynamic = "force-dynamic";

interface EditBlogPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const { id } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

  return (
    <AdminShell>
      <BlogForm
        action={updateBlogPostAction}
        post={post}
        submitLabel="Enregistrer les Modifications"
      />
    </AdminShell>
  );
}
