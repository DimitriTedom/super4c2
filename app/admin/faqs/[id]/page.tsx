import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { FaqForm } from "@/components/admin/faq-form";
import { prisma } from "@/lib/prisma";
import { updateFaqAction } from "../actions";

export const metadata = {
  title: "Modifier une FAQ — Back-Office | Super4C2",
};

export const dynamic = "force-dynamic";

interface EditFaqPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditFaqPage({ params }: EditFaqPageProps) {
  const { id } = await params;

  const faq = await prisma.faq.findUnique({
    where: { id },
  });

  if (!faq) {
    notFound();
  }

  return (
    <AdminShell>
      <FaqForm
        action={updateFaqAction}
        faq={faq}
        submitLabel="Enregistrer les Modifications"
      />
    </AdminShell>
  );
}
