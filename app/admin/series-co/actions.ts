"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toBoolean, toInteger, toOptionalString } from "@/lib/admin-crud-utils";
import { withToastQuery } from "@/lib/toast-navigation";

function normalizeSeriesCoPayload(formData: FormData) {
  const seriesNumber = toInteger(formData.get("seriesNumber"), 101, 1);
  const title = toOptionalString(formData.get("title"));
  const durationMinutes = toInteger(formData.get("durationMinutes"), 35, 5);

  if (!seriesNumber || !title) {
    throw new Error("Le numéro de série et le titre sont obligatoires.");
  }

  return {
    seriesNumber,
    title,
    examType: "TCF_CANADA" as const,
    discipline: "COMPREHENSION_ORALE" as const,
    durationSeconds: durationMinutes * 60,
    isPublished: toBoolean(formData.get("isPublished")),
    isFreeDemo: toBoolean(formData.get("isFreeDemo")),
  };
}

export async function createSeriesCoAction(formData: FormData) {
  const payload = normalizeSeriesCoPayload(formData);

  // Vérifier si le numéro existe déjà pour COMPREHENSION_ORALE
  const existing = await prisma.examSeries.findUnique({
    where: {
      examType_discipline_seriesNumber: {
        examType: "TCF_CANADA",
        discipline: "COMPREHENSION_ORALE",
        seriesNumber: payload.seriesNumber,
      },
    },
  });

  if (existing) {
    redirect(
      withToastQuery("/admin/series-co/ajouter", {
        title: "Numéro déjà existant",
        message: `La série de Compréhension Orale ${payload.seriesNumber} existe déjà. Choisissez un autre numéro.`,
        variant: "error",
      })
    );
  }

  const created = await prisma.examSeries.create({
    data: payload,
  });

  revalidatePath("/admin/series-co");
  revalidatePath("/examens");
  redirect(
    withToastQuery(`/admin/series-co/${created.id}/questions`, {
      title: "Série CO créée (Coming Soon)",
      message: `La Série ${created.seriesNumber} a été créée. Vous pouvez désormais ajouter les pistes audio et les 39 questions QCM.`,
      variant: "success",
    })
  );
}

export async function updateSeriesCoAction(formData: FormData) {
  const id = toOptionalString(formData.get("id"));
  if (!id) throw new Error("Identifiant de série introuvable.");

  const payload = normalizeSeriesCoPayload(formData);

  await prisma.examSeries.update({
    where: { id },
    data: {
      seriesNumber: payload.seriesNumber,
      title: payload.title,
      durationSeconds: payload.durationSeconds,
      isPublished: payload.isPublished,
      isFreeDemo: payload.isFreeDemo,
    },
  });

  revalidatePath("/admin/series-co");
  revalidatePath(`/admin/series-co/${id}`);
  revalidatePath("/examens");
  redirect(
    withToastQuery("/admin/series-co", {
      title: "Série CO mise à jour",
      message: `La Série ${payload.seriesNumber} a été modifiée avec succès.`,
      variant: "success",
    })
  );
}

export async function toggleSeriesCoPublishAction(formData: FormData) {
  const id = toOptionalString(formData.get("id"));
  if (!id) throw new Error("Identifiant de série introuvable.");

  const current = await prisma.examSeries.findUnique({ where: { id } });
  if (!current) throw new Error("Série introuvable.");

  const updated = await prisma.examSeries.update({
    where: { id },
    data: { isPublished: !current.isPublished },
  });

  revalidatePath("/admin/series-co");
  revalidatePath("/examens");
  redirect(
    withToastQuery("/admin/series-co", {
      title: updated.isPublished ? "Série publiée" : "Série passée en brouillon",
      message: `La Série ${updated.seriesNumber} est désormais ${
        updated.isPublished ? "marquée prête (Coming Soon)" : "masquée du catalogue"
      }.`,
      variant: "success",
    })
  );
}

export async function deleteSeriesCoAction(formData: FormData) {
  const id = toOptionalString(formData.get("id"));
  if (!id) throw new Error("Identifiant de série introuvable.");

  const deleted = await prisma.examSeries.delete({ where: { id } });

  revalidatePath("/admin/series-co");
  revalidatePath("/examens");
  redirect(
    withToastQuery("/admin/series-co", {
      title: "Série CO supprimée",
      message: `La Série ${deleted.seriesNumber} et toutes ses questions d'écoute ont été supprimées.`,
      variant: "success",
    })
  );
}
