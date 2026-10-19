"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toBoolean, toInteger, toOptionalString } from "@/lib/admin-crud-utils";
import { withToastQuery } from "@/lib/toast-navigation";

function normalizeSeriesCePayload(formData: FormData) {
  const seriesNumber = toInteger(formData.get("seriesNumber"), 0, 1);
  const title = toOptionalString(formData.get("title"));
  const durationMinutes = toInteger(formData.get("durationMinutes"), 60, 5);

  if (!seriesNumber || !title) {
    throw new Error("Le numéro de série et le titre sont obligatoires.");
  }

  return {
    seriesNumber,
    title,
    examType: "TCF_CANADA" as const,
    discipline: "COMPREHENSION_ECRITE" as const,
    durationSeconds: durationMinutes * 60,
    isPublished: toBoolean(formData.get("isPublished")),
    isFreeDemo: toBoolean(formData.get("isFreeDemo")),
  };
}

export async function createSeriesCeAction(formData: FormData) {
  let createdId: string | null = null;
  let createdNumber: number | null = null;

  try {
    const payload = normalizeSeriesCePayload(formData);

    // Vérifier si le numéro existe déjà
    const existing = await prisma.examSeries.findUnique({
      where: {
        examType_discipline_seriesNumber: {
          examType: "TCF_CANADA",
          discipline: "COMPREHENSION_ECRITE",
          seriesNumber: payload.seriesNumber,
        },
      },
    });

    if (existing) {
      redirect(
        withToastQuery("/admin/series-ce/ajouter", {
          title: "Numéro déjà existant",
          message: `La série CE ${payload.seriesNumber} existe déjà. Choisissez un autre numéro.`,
          variant: "error",
        })
      );
    }

    const created = await prisma.examSeries.create({
      data: payload,
    });
    createdId = created.id;
    createdNumber = created.seriesNumber;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Erreur création série CE :", error);
    redirect(
      withToastQuery("/admin/series-ce/ajouter", {
        title: "Erreur de création",
        message: error?.message || "Impossible de créer la série de Lecture.",
        variant: "error",
      })
    );
  }

  revalidatePath("/admin/series-ce");
  revalidatePath("/examens");
  redirect(
    withToastQuery(`/admin/series-ce/${createdId}/questions`, {
      title: "Série CE créée",
      message: `La Série ${createdNumber} a été créée. Vous pouvez désormais ajouter les 39 questions.`,
      variant: "success",
    })
  );
}

export async function updateSeriesCeAction(formData: FormData) {
  const id = toOptionalString(formData.get("id"));
  if (!id) throw new Error("Identifiant de série introuvable.");

  const payload = normalizeSeriesCePayload(formData);

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

  revalidatePath("/admin/series-ce");
  revalidatePath(`/admin/series-ce/${id}`);
  revalidatePath("/examens");
  redirect(
    withToastQuery("/admin/series-ce", {
      title: "Série mise à jour",
      message: `La Série ${payload.seriesNumber} a été modifiée avec succès.`,
      variant: "success",
    })
  );
}

export async function toggleSeriesCePublishAction(formData: FormData) {
  const id = toOptionalString(formData.get("id"));
  if (!id) throw new Error("Identifiant de série introuvable.");

  const current = await prisma.examSeries.findUnique({ where: { id } });
  if (!current) throw new Error("Série introuvable.");

  const updated = await prisma.examSeries.update({
    where: { id },
    data: { isPublished: !current.isPublished },
  });

  revalidatePath("/admin/series-ce");
  revalidatePath("/examens");
  redirect(
    withToastQuery("/admin/series-ce", {
      title: updated.isPublished ? "Série publiée" : "Série passée en brouillon",
      message: `La Série ${updated.seriesNumber} est désormais ${
        updated.isPublished ? "visible des candidats" : "masquée du catalogue"
      }.`,
      variant: "success",
    })
  );
}

export async function deleteSeriesCeAction(formData: FormData) {
  const id = toOptionalString(formData.get("id"));
  if (!id) throw new Error("Identifiant de série introuvable.");

  const deleted = await prisma.examSeries.delete({ where: { id } });

  revalidatePath("/admin/series-ce");
  revalidatePath("/examens");
  redirect(
    withToastQuery("/admin/series-ce", {
      title: "Série supprimée",
      message: `La Série ${deleted.seriesNumber} et toutes ses questions ont été supprimées.`,
      variant: "success",
    })
  );
}
