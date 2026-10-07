"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toInteger, toOptionalString } from "@/lib/admin-crud-utils";
import { withToastQuery } from "@/lib/toast-navigation";

function normalizeWrittenTaskPayload(formData: FormData) {
  const seriesId = toOptionalString(formData.get("seriesId"));
  const taskNumber = toInteger(formData.get("taskNumber"), 1, 1);
  const title = toOptionalString(formData.get("title"));
  const minWords = toInteger(formData.get("minWords"), 60, 10);
  const maxWords = toInteger(formData.get("maxWords"), 120, minWords);
  const suggestedDurationMinutes = toInteger(formData.get("suggestedDurationMinutes"), 15, 5);
  const topic = toOptionalString(formData.get("topic"));
  const context = toOptionalString(formData.get("context"));
  const criteriaNote = toOptionalString(formData.get("criteriaNote"));
  const sampleModelC2 = toOptionalString(formData.get("sampleModelC2"));

  if (!seriesId || !title || !topic) {
    throw new Error("La série, le titre de la tâche et la consigne officielle (topic) sont obligatoires.");
  }

  if (taskNumber < 1 || taskNumber > 3) {
    throw new Error("Le numéro de tâche doit être 1, 2 ou 3 conformément aux normes officielles FEI.");
  }

  return {
    seriesId,
    taskNumber,
    title,
    minWords,
    maxWords,
    suggestedDurationMinutes,
    topic,
    context,
    criteriaNote,
    sampleModelC2,
  };
}

export async function upsertWrittenTaskAction(formData: FormData) {
  const id = toOptionalString(formData.get("id"));
  const payload = normalizeWrittenTaskPayload(formData);

  if (id) {
    // Modification
    await prisma.writtenTask.update({
      where: { id },
      data: {
        taskNumber: payload.taskNumber,
        title: payload.title,
        minWords: payload.minWords,
        maxWords: payload.maxWords,
        suggestedDurationMinutes: payload.suggestedDurationMinutes,
        topic: payload.topic,
        context: payload.context,
        criteriaNote: payload.criteriaNote,
        sampleModelC2: payload.sampleModelC2,
      },
    });

    revalidatePath(`/admin/series-ee/${payload.seriesId}/tasks`);
    revalidatePath("/examens");
    redirect(
      withToastQuery(`/admin/series-ee/${payload.seriesId}/tasks`, {
        title: "Tâche EE enregistrée",
        message: `La Tâche ${payload.taskNumber} a été mise à jour avec succès.`,
        variant: "success",
      })
    );
  } else {
    // Création / Upsert sur (seriesId, taskNumber)
    await prisma.writtenTask.upsert({
      where: {
        seriesId_taskNumber: {
          seriesId: payload.seriesId,
          taskNumber: payload.taskNumber,
        },
      },
      update: {
        title: payload.title,
        minWords: payload.minWords,
        maxWords: payload.maxWords,
        suggestedDurationMinutes: payload.suggestedDurationMinutes,
        topic: payload.topic,
        context: payload.context,
        criteriaNote: payload.criteriaNote,
        sampleModelC2: payload.sampleModelC2,
      },
      create: payload,
    });

    revalidatePath(`/admin/series-ee/${payload.seriesId}/tasks`);
    revalidatePath("/examens");
    redirect(
      withToastQuery(`/admin/series-ee/${payload.seriesId}/tasks`, {
        title: "Tâche EE configurée",
        message: `La Tâche ${payload.taskNumber} a été enregistrée dans la série.`,
        variant: "success",
      })
    );
  }
}

export async function deleteWrittenTaskAction(formData: FormData) {
  const id = toOptionalString(formData.get("id"));
  const seriesId = toOptionalString(formData.get("seriesId"));
  if (!id || !seriesId) throw new Error("Paramètres invalides.");

  const deleted = await prisma.writtenTask.delete({ where: { id } });

  revalidatePath(`/admin/series-ee/${seriesId}/tasks`);
  revalidatePath("/examens");
  redirect(
    withToastQuery(`/admin/series-ee/${seriesId}/tasks`, {
      title: "Tâche supprimée",
      message: `La Tâche ${deleted.taskNumber} a été retirée de la série.`,
      variant: "success",
    })
  );
}
