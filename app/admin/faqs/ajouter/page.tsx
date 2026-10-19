import { AdminShell } from "@/components/admin/admin-shell";
import { FaqForm } from "@/components/admin/faq-form";
import { createFaqAction } from "../actions";

export const metadata = {
  title: "Ajouter une FAQ — Back-Office | Super4C2",
};

export const dynamic = "force-dynamic";

export default function AddFaqPage() {
  return (
    <AdminShell>
      <FaqForm action={createFaqAction} submitLabel="Créer la Question Fréquente" />
    </AdminShell>
  );
}
