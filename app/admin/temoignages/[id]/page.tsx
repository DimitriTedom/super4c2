import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import { prisma } from "@/lib/prisma";
import { updateTestimonialAction } from "../actions";

export const metadata = {
  title: "Modifier un Témoignage — Back-Office | Super4C2",
};

export const dynamic = "force-dynamic";

interface EditTestimonialPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTestimonialPage({
  params,
}: EditTestimonialPageProps) {
  const { id } = await params;

  const testimonial = await prisma.testimonial.findUnique({
    where: { id },
  });

  if (!testimonial) {
    notFound();
  }

  return (
    <AdminShell>
      <TestimonialForm
        action={updateTestimonialAction}
        testimonial={testimonial}
        submitLabel="Enregistrer les Modifications"
      />
    </AdminShell>
  );
}
