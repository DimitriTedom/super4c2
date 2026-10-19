import { AdminShell } from "@/components/admin/admin-shell";
import { BlogForm } from "@/components/admin/blog-form";
import { createBlogPostAction } from "../actions";

export const metadata = {
  title: "Rédiger un Article — Back-Office | Super4C2",
};

export const dynamic = "force-dynamic";

export default function AddBlogPostPage() {
  return (
    <AdminShell>
      <BlogForm action={createBlogPostAction} submitLabel="Publier l'Article" />
    </AdminShell>
  );
}
