import { AdminShell } from "@/components/admin/admin-shell";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import { createTestimonialAction } from "../actions";

export const metadata = {
  title: "Ajouter un Témoignage — Back-Office | Super4C2",
};

export const dynamic = "force-dynamic";

export default function AddTestimonialPage() {
  return (
    <AdminShell>
      <TestimonialForm
        action={createTestimonialAction}
        submitLabel="Enregistrer le Témoignage"
      />
    </AdminShell>
  );
}
