"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toInteger, toOptionalString } from "@/lib/admin-crud-utils";
import { withToastQuery } from "@/lib/toast-navigation";

function normalizeOralTaskPayload(formData: FormData) {
  const seriesId = toOptionalString(formData.get("seriesId"));
  const taskNumber = toInteger(formData.get("taskNumber"), 1, 1);
  const type = toOptionalString(formData.get("type")) || "task1_presentation";
  const title = toOptionalString(formData.get("title"));
  const durationSeconds = toInteger(formData.get("durationSeconds"), 120, 30);
  const examinerPrompt = toOptionalString(formData.get("examinerPrompt"));

  // Scenario fields for roleplay (Task 2) or context (Task 1 & 3)
  const situation = toOptionalString(formData.get("scenario_situation"));
  const candidateRole = toOptionalString(formData.get("scenario_candidateRole"));
  const examinerRole = toOptionalString(formData.get("scenario_examinerRole"));
  const instructions = toOptionalString(formData.get("scenario_instructions"));

  if (!seriesId || !title || !examinerPrompt) {
    throw new Error("La série, l'intitulé de la tâche et les directives pour l'examinateur IA sont obligatoires.");
  }

  if (taskNumber < 1 || taskNumber > 3) {
    throw new Error("Le numéro de tâche doit être 1, 2 ou 3 conformément aux normes officielles FEI.");
  }

  let roleplayScenario = null;
  if (situation || candidateRole || examinerRole || instructions) {
    roleplayScenario = {
      situation: situation || "",
      candidateRole: candidateRole || "",
      examinerRole: examinerRole || "",
      instructions: instructions || "",
    };
  }

  return {
    seriesId,
    taskNumber,
    type,
    title,
    durationSeconds,
    examinerPrompt,
    roleplayScenario,
  };
}

export async function upsertOralTaskAction(formData: FormData) {
  const id = toOptionalString(formData.get("id"));
  const payload = normalizeOralTaskPayload(formData);

  if (id) {
    // Modification
    await prisma.oralTask.update({
      where: { id },
      data: {
        taskNumber: payload.taskNumber,
        type: payload.type,
        title: payload.title,
        durationSeconds: payload.durationSeconds,
        examinerPrompt: payload.examinerPrompt,
        roleplayScenario: payload.roleplayScenario ?? undefined,
      },
    });

    revalidatePath(`/admin/series-eo/${payload.seriesId}/tasks`);
    revalidatePath("/examens");
    redirect(
      withToastQuery(`/admin/series-eo/${payload.seriesId}/tasks`, {
        title: "Tâche EO enregistrée",
        message: `La Tâche ${payload.taskNumber} a été mise à jour avec succès.`,
        variant: "success",
      })
    );
  } else {
    // Création / Upsert sur (seriesId, taskNumber)
    await prisma.oralTask.upsert({
      where: {
        seriesId_taskNumber: {
          seriesId: payload.seriesId,
          taskNumber: payload.taskNumber,
        },
      },
      update: {
        type: payload.type,
        title: payload.title,
        durationSeconds: payload.durationSeconds,
        examinerPrompt: payload.examinerPrompt,
        roleplayScenario: payload.roleplayScenario ?? undefined,
      },
      create: {
        seriesId: payload.seriesId,
        taskNumber: payload.taskNumber,
        type: payload.type,
        title: payload.title,
        durationSeconds: payload.durationSeconds,
        examinerPrompt: payload.examinerPrompt,
        roleplayScenario: payload.roleplayScenario ?? undefined,
      },
    });

    revalidatePath(`/admin/series-eo/${payload.seriesId}/tasks`);
    revalidatePath("/examens");
    redirect(
      withToastQuery(`/admin/series-eo/${payload.seriesId}/tasks`, {
        title: "Tâche EO configurée",
        message: `La Tâche ${payload.taskNumber} a été enregistrée dans la série.`,
        variant: "success",
      })
    );
  }
}

export async function deleteOralTaskAction(formData: FormData) {
  const id = toOptionalString(formData.get("id"));
  const seriesId = toOptionalString(formData.get("seriesId"));
  if (!id || !seriesId) throw new Error("Paramètres invalides.");

  const deleted = await prisma.oralTask.delete({ where: { id } });

  revalidatePath(`/admin/series-eo/${seriesId}/tasks`);
  revalidatePath("/examens");
  redirect(
    withToastQuery(`/admin/series-eo/${seriesId}/tasks`, {
      title: "Tâche EO supprimée",
      message: `La Tâche ${deleted.taskNumber} a été retirée de la série.`,
      variant: "success",
    })
  );
}
