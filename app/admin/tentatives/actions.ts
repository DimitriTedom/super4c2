"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toOptionalString } from "@/lib/admin-crud-utils";
import { withToastQuery } from "@/lib/toast-navigation";

export async function deleteAttemptAction(formData: FormData) {
  const id = toOptionalString(formData.get("id"));
  if (!id) throw new Error("Identifiant de tentative introuvable.");

  const deleted = await prisma.userAttempt.delete({
    where: { id },
  });

  revalidatePath("/admin/tentatives");
  revalidatePath("/admin");
  redirect(
    withToastQuery("/admin/tentatives", {
      title: "Tentative supprimée",
      message: `La session d'examen (${deleted.discipline}) a été retirée de la base de données.`,
      variant: "success",
    })
  );
}

export async function batchDeleteAttemptsAction(ids: string[]) {
  if (!ids || ids.length === 0) return { count: 0 };

  const result = await prisma.userAttempt.deleteMany({
    where: { id: { in: ids } },
  });

  revalidatePath("/admin/tentatives");
  revalidatePath("/admin");
  return { count: result.count };
}
