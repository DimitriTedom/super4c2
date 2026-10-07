"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toBoolean, toInteger, toOptionalString } from "@/lib/admin-crud-utils";
import { withToastQuery } from "@/lib/toast-navigation";

function normalizeWrittenSeriesPayload(formData: FormData) {
  const seriesNumber = toInteger(formData.get("seriesNumber"), 101, 1);
  const title = toOptionalString(formData.get("title"));
  const examTypeRaw = toOptionalString(formData.get("examType")) || "TCF_CANADA";
  const durationSeconds = toInteger(formData.get("durationSeconds"), 3600, 300);
  const isPublished = toBoolean(formData.get("isPublished"));
  const isFreeDemo = toBoolean(formData.get("isFreeDemo"));

  if (!title) {
    throw new Error("Le titre de la série d'Expression Écrite est obligatoire.");
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
    durationSeconds,
    isPublished,
    isFreeDemo,
  };
}

export async function createWrittenSeriesAction(formData: FormData) {
  const payload = normalizeWrittenSeriesPayload(formData);

  const existing = await prisma.writtenSeries.findUnique({
    where: { seriesNumber: payload.seriesNumber },
  });

  if (existing) {
    throw new Error(`Une série d'Expression Écrite portant le numéro ${payload.seriesNumber} existe déjà.`);
  }

  const created = await prisma.writtenSeries.create({
    data: payload,
  });

  revalidatePath("/admin/series-ee");
  revalidatePath("/examens");
  redirect(
    withToastQuery(`/admin/series-ee/${created.id}/tasks`, {
      title: "Série EE créée",
      message: `La Série ${created.seriesNumber} a été créée. Vous pouvez maintenant configurer les 3 tâches.`,
      variant: "success",
    })
  );
}

export async function updateWrittenSeriesAction(formData: FormData) {
  const id = toOptionalString(formData.get("id"));
  if (!id) throw new Error("Identifiant de série invalide.");

  const payload = normalizeWrittenSeriesPayload(formData);

  const updated = await prisma.writtenSeries.update({
    where: { id },
    data: payload,
  });

  revalidatePath("/admin/series-ee");
  revalidatePath(`/admin/series-ee/${id}`);
  revalidatePath("/examens");
  redirect(
    withToastQuery("/admin/series-ee", {
      title: "Série EE mise à jour",
      message: `La Série ${updated.seriesNumber} a été enregistrée avec succès.`,
      variant: "success",
    })
  );
}

export async function deleteWrittenSeriesAction(formData: FormData) {
  const id = toOptionalString(formData.get("id"));
  if (!id) throw new Error("Identifiant de série manquant.");

  const deleted = await prisma.writtenSeries.delete({
    where: { id },
  });

  revalidatePath("/admin/series-ee");
  revalidatePath("/examens");
  redirect(
    withToastQuery("/admin/series-ee", {
      title: "Série EE supprimée",
      message: `La Série ${deleted.seriesNumber} (${deleted.title}) et ses tâches ont été supprimées.`,
      variant: "success",
    })
  );
}

export async function toggleWrittenSeriesPublishAction(formData: FormData) {
  const id = toOptionalString(formData.get("id"));
  if (!id) throw new Error("Identifiant de série manquant.");

  const current = await prisma.writtenSeries.findUnique({
    where: { id },
    select: { isPublished: true, seriesNumber: true },
  });

  if (!current) throw new Error("Série introuvable.");

  await prisma.writtenSeries.update({
    where: { id },
    data: { isPublished: !current.isPublished },
  });

  revalidatePath("/admin/series-ee");
  revalidatePath("/examens");
  redirect(
    withToastQuery("/admin/series-ee", {
      title: current.isPublished ? "Série dépubliée" : "Série publiée",
      message: `La Série ${current.seriesNumber} est désormais ${
        current.isPublished ? "en brouillon" : "accessible aux candidats"
      }.`,
      variant: "success",
    })
  );
}
