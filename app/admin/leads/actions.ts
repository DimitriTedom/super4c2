"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toOptionalString } from "@/lib/admin-crud-utils";
import { withToastQuery } from "@/lib/toast-navigation";
import { LeadStatus } from "@prisma/client";

export async function updateLeadStatusAction(formData: FormData) {
  const id = toOptionalString(formData.get("id"));
  const rawStatus = toOptionalString(formData.get("status"));

  if (!id || !rawStatus) {
    throw new Error("Identifiant ou statut manquant.");
  }

  const validStatuses = Object.values(LeadStatus);
  if (!validStatuses.includes(rawStatus as LeadStatus)) {
    throw new Error(`Statut invalide : ${rawStatus}`);
  }

  const updated = await prisma.contactLead.update({
    where: { id },
    data: { status: rawStatus as LeadStatus },
  });

  revalidatePath("/admin/leads");
  redirect(
    withToastQuery("/admin/leads", {
      title: "Statut actualisé",
      message: `La demande de ${updated.name} est passée à "${updated.status}".`,
      variant: "success",
    })
  );
}

export async function updateLeadNotesAction(formData: FormData) {
  const id = toOptionalString(formData.get("id"));
  const adminNotes = toOptionalString(formData.get("adminNotes"));

  if (!id) throw new Error("Identifiant manquant.");

  const updated = await prisma.contactLead.update({
    where: { id },
    data: { adminNotes },
  });

  revalidatePath("/admin/leads");
  redirect(
    withToastQuery("/admin/leads", {
      title: "Notes enregistrées",
      message: `Notes internes mises à jour pour ${updated.name}.`,
      variant: "success",
    })
  );
}

export async function deleteLeadAction(formData: FormData) {
  const id = toOptionalString(formData.get("id"));
  if (!id) throw new Error("Identifiant manquant.");

  const deleted = await prisma.contactLead.delete({
    where: { id },
  });

  revalidatePath("/admin/leads");
  redirect(
    withToastQuery("/admin/leads", {
      title: "Demande supprimée",
      message: `La demande de ${deleted.name} a été supprimée définitivement.`,
      variant: "success",
    })
  );
}

export async function batchDeleteLeadsAction(ids: string[]) {
  if (!ids || ids.length === 0) return { count: 0 };

  const result = await prisma.contactLead.deleteMany({
    where: { id: { in: ids } },
  });

  revalidatePath("/admin/leads");
  return { count: result.count };
}

export async function batchUpdateLeadStatusAction(ids: string[], status: LeadStatus) {
  if (!ids || ids.length === 0) return { count: 0 };

  const result = await prisma.contactLead.updateMany({
    where: { id: { in: ids } },
    data: { status },
  });

  revalidatePath("/admin/leads");
  return { count: result.count };
}

