"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toBoolean, toInteger, toOptionalString } from "@/lib/admin-crud-utils";
import { withToastQuery } from "@/lib/toast-navigation";

function normalizeOralSeriesPayload(formData: FormData) {
  const seriesNumber = toInteger(formData.get("seriesNumber"), 101, 1);
  const title = toOptionalString(formData.get("title"));
  const examTypeRaw = toOptionalString(formData.get("examType")) || "TCF_CANADA";
  const durationMinutes = toInteger(formData.get("durationMinutes"), 12, 1);
  const isPublished = toBoolean(formData.get("isPublished"));
  const isFreeDemo = toBoolean(formData.get("isFreeDemo"));

  if (!title) {
    throw new Error("Le titre de la série d'Expression Orale est obligatoire.");
  }

  const validExamTypes = ["TCF_CANADA", "TEF_CANADA"] as const;
  type ValidExamType = (typeof validExamTypes)[number];
  const examType: ValidExamType =
    examTypeRaw && validExamTypes.includes(examTypeRaw as ValidExamType)
      ? (examTypeRaw as ValidExamType)
      : "TCF_CANADA";

  return {
    seriesNumber,
    title,
    examType,
    durationSeconds: durationMinutes * 60,
    isPublished,
    isFreeDemo,
  };
}

export async function createOralSeriesAction(formData: FormData) {
  let createdId: string | null = null;
  let createdNumber: number | null = null;

  try {
    const payload = normalizeOralSeriesPayload(formData);

    const existing = await prisma.oralSeries.findUnique({
      where: { seriesNumber: payload.seriesNumber },
    });

    if (existing) {
      redirect(
        withToastQuery("/admin/series-eo/ajouter", {
          title: "Numéro déjà existant",
          message: `Une série d'Expression Orale portant le numéro ${payload.seriesNumber} existe déjà. Choisissez un autre numéro.`,
          variant: "error",
        })
      );
    }

    const created = await prisma.oralSeries.create({
      data: payload,
    });
    createdId = created.id;
    createdNumber = created.seriesNumber;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Erreur création série EO :", error);
    redirect(
      withToastQuery("/admin/series-eo/ajouter", {
        title: "Erreur de création",
        message: error?.message || "Impossible de créer la série d'Expression Orale.",
        variant: "error",
      })
    );
  }

  revalidatePath("/admin/series-eo");
  revalidatePath("/examens");
  redirect(
    withToastQuery(`/admin/series-eo/${createdId}/tasks`, {
      title: "Série EO créée",
      message: `La Série ${createdNumber} a été créée. Vous pouvez maintenant configurer les 3 tâches orales FEI.`,
      variant: "success",
    })
  );
}

export async function updateOralSeriesAction(formData: FormData) {
  let updatedNumber: number | null = null;
  const id = toOptionalString(formData.get("id"));
  if (!id) throw new Error("Identifiant de série invalide.");

  try {
    const payload = normalizeOralSeriesPayload(formData);

    const updated = await prisma.oralSeries.update({
      where: { id },
      data: payload,
    });
    updatedNumber = updated.seriesNumber;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Erreur mise à jour série EO :", error);
    redirect(
      withToastQuery(`/admin/series-eo/${id}`, {
        title: "Erreur de mise à jour",
        message: error?.message || "Impossible de mettre à jour la série.",
        variant: "error",
      })
    );
  }

  revalidatePath("/admin/series-eo");
  revalidatePath(`/admin/series-eo/${id}`);
  revalidatePath("/examens");
  redirect(
    withToastQuery("/admin/series-eo", {
      title: "Série EO mise à jour",
      message: `La Série ${updatedNumber} a été enregistrée avec succès.`,
      variant: "success",
    })
  );
}

export async function deleteOralSeriesAction(formData: FormData) {
  const id = toOptionalString(formData.get("id"));
  if (!id) throw new Error("Identifiant de série manquant.");

  let deletedNumber: number | null = null;
  let deletedTitle: string = "";

  try {
    const deleted = await prisma.oralSeries.delete({
      where: { id },
    });
    deletedNumber = deleted.seriesNumber;
    deletedTitle = deleted.title;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Erreur suppression série EO :", error);
    redirect(
      withToastQuery("/admin/series-eo", {
        title: "Erreur de suppression",
        message: error?.message || "Impossible de supprimer la série.",
        variant: "error",
      })
    );
  }

  revalidatePath("/admin/series-eo");
  revalidatePath("/examens");
  redirect(
    withToastQuery("/admin/series-eo", {
      title: "Série EO supprimée",
      message: `La Série ${deletedNumber} (${deletedTitle}) et ses tâches ont été supprimées.`,
      variant: "success",
    })
  );
}

export async function toggleOralSeriesPublishAction(id: string, currentStatus: boolean) {
  let isPublished = false;
  let seriesNumber = 0;

  try {
    const updated = await prisma.oralSeries.update({
      where: { id },
      data: { isPublished: !currentStatus },
    });
    isPublished = updated.isPublished;
    seriesNumber = updated.seriesNumber;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Erreur bascule statut série EO :", error);
    redirect(
      withToastQuery("/admin/series-eo", {
        title: "Erreur",
        message: "Impossible de modifier le statut de publication.",
        variant: "error",
      })
    );
  }

  revalidatePath("/admin/series-eo");
  revalidatePath("/examens");
  redirect(
    withToastQuery("/admin/series-eo", {
      title: isPublished ? "Série publiée" : "Série passée en brouillon",
      message: `La Série ${seriesNumber} est désormais ${isPublished ? "accessible aux candidats" : "masquée"}.`,
      variant: "success",
    })
  );
}
