"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toInteger, toOptionalString } from "@/lib/admin-crud-utils";
import { withToastQuery } from "@/lib/toast-navigation";

function normalizeCoQuestionPayload(formData: FormData) {
  const seriesId = toOptionalString(formData.get("seriesId"));
  const questionNumber = toInteger(formData.get("questionNumber"), 1, 1);
  const prompt = toOptionalString(formData.get("prompt"));
  const optionA = toOptionalString(formData.get("optionA"));
  const optionB = toOptionalString(formData.get("optionB"));
  const optionC = toOptionalString(formData.get("optionC"));
  const optionD = toOptionalString(formData.get("optionD"));
  const correctOption = toOptionalString(formData.get("correctOption"))?.toUpperCase();
  const explanation = toOptionalString(formData.get("explanation"));

  if (!seriesId || !prompt || !optionA || !optionB || !optionC || !optionD || !correctOption || !explanation) {
    throw new Error("L'intitulé, les 4 options, la bonne réponse et l'explication didactique sont obligatoires.");
  }

  if (!["A", "B", "C", "D"].includes(correctOption)) {
    throw new Error("La bonne réponse doit être A, B, C ou D.");
  }

  const cefrLevel = toOptionalString(formData.get("cefrLevel")) || "B2";
  const nclcTargetLevel = toInteger(formData.get("nclcTargetLevel"), 7, 3);
  const audioUrl = toOptionalString(formData.get("audioUrl"));
  const audioTranscript = toOptionalString(formData.get("audioTranscript"));
  const documentTitle = toOptionalString(formData.get("documentTitle"));
  const documentImageUrl = toOptionalString(formData.get("documentImageUrl"));
  const trapAnalysis = toOptionalString(formData.get("trapAnalysis"));

  return {
    seriesId,
    questionNumber,
    discipline: "COMPREHENSION_ORALE" as const,
    prompt,
    optionA,
    optionB,
    optionC,
    optionD,
    correctOption,
    explanation,
    cefrLevel,
    nclcTargetLevel,
    audioUrl,
    audioTranscript,
    documentTitle,
    documentImageUrl,
    trapAnalysis,
  };
}

export async function upsertCoQuestionAction(formData: FormData) {
  const id = toOptionalString(formData.get("id"));
  const payload = normalizeCoQuestionPayload(formData);

  if (id) {
    // Modification
    await prisma.question.update({
      where: { id },
      data: {
        questionNumber: payload.questionNumber,
        prompt: payload.prompt,
        optionA: payload.optionA,
        optionB: payload.optionB,
        optionC: payload.optionC,
        optionD: payload.optionD,
        correctOption: payload.correctOption,
        explanation: payload.explanation,
        cefrLevel: payload.cefrLevel,
        nclcTargetLevel: payload.nclcTargetLevel,
        audioUrl: payload.audioUrl,
        audioTranscript: payload.audioTranscript,
        documentTitle: payload.documentTitle,
        documentImageUrl: payload.documentImageUrl,
        trapAnalysis: payload.trapAnalysis,
      },
    });

    revalidatePath(`/admin/series-co/${payload.seriesId}/questions`);
    revalidatePath("/examens");
    redirect(
      withToastQuery(`/admin/series-co/${payload.seriesId}/questions`, {
        title: "Question CO enregistrée",
        message: `La Question ${payload.questionNumber} a été mise à jour avec succès.`,
        variant: "success",
      })
    );
  } else {
    // Création
    await prisma.question.upsert({
      where: {
        seriesId_questionNumber: {
          seriesId: payload.seriesId,
          questionNumber: payload.questionNumber,
        },
      },
      update: {
        prompt: payload.prompt,
        optionA: payload.optionA,
        optionB: payload.optionB,
        optionC: payload.optionC,
        optionD: payload.optionD,
        correctOption: payload.correctOption,
        explanation: payload.explanation,
        cefrLevel: payload.cefrLevel,
        nclcTargetLevel: payload.nclcTargetLevel,
        audioUrl: payload.audioUrl,
        audioTranscript: payload.audioTranscript,
        documentTitle: payload.documentTitle,
        documentImageUrl: payload.documentImageUrl,
        trapAnalysis: payload.trapAnalysis,
      },
      create: payload,
    });

    revalidatePath(`/admin/series-co/${payload.seriesId}/questions`);
    revalidatePath("/examens");
    redirect(
      withToastQuery(`/admin/series-co/${payload.seriesId}/questions`, {
        title: "Question CO créée",
        message: `La Question ${payload.questionNumber} a été enregistrée dans la série.`,
        variant: "success",
      })
    );
  }
}

export async function deleteCoQuestionAction(formData: FormData) {
  const id = toOptionalString(formData.get("id"));
  const seriesId = toOptionalString(formData.get("seriesId"));
  if (!id || !seriesId) throw new Error("Paramètres invalides.");

  const deleted = await prisma.question.delete({ where: { id } });

  revalidatePath(`/admin/series-co/${seriesId}/questions`);
  revalidatePath("/examens");
  redirect(
    withToastQuery(`/admin/series-co/${seriesId}/questions`, {
      title: "Question supprimée",
      message: `La Question ${deleted.questionNumber} a été retirée de la série.`,
      variant: "success",
    })
  );
}
