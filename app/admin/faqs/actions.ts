"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toBoolean, toInteger, toOptionalString } from "@/lib/admin-crud-utils";
import { withToastQuery } from "@/lib/toast-navigation";

function normalizeFaqPayload(formData: FormData) {
  const question = toOptionalString(formData.get("question"));
  const answer = toOptionalString(formData.get("answer"));
  const category = toOptionalString(formData.get("category")) || "Général";
  const order = toInteger(formData.get("order"), 0, 0);
  const isActive = toBoolean(formData.get("isActive"));

  if (!question || !answer) {
    throw new Error("La question et la réponse sont obligatoires.");
  }

  return {
    question,
    answer,
    category,
    order,
    isActive,
  };
}

export async function createFaqAction(formData: FormData) {
  const payload = normalizeFaqPayload(formData);

  const created = await prisma.faq.create({
    data: payload,
  });

  revalidatePath("/admin/faqs");
  revalidatePath("/");
  revalidatePath("/faq");
  redirect(
    withToastQuery("/admin/faqs", {
      title: "FAQ créée",
      message: `La question fréquente "${created.question.slice(0, 40)}..." a été ajoutée.`,
      variant: "success",
    })
  );
}

export async function updateFaqAction(formData: FormData) {
  const id = toOptionalString(formData.get("id"));
  if (!id) throw new Error("Identifiant FAQ manquant.");

  const payload = normalizeFaqPayload(formData);

  const updated = await prisma.faq.update({
    where: { id },
    data: payload,
  });

  revalidatePath("/admin/faqs");
  revalidatePath("/");
  revalidatePath("/faq");
  redirect(
    withToastQuery("/admin/faqs", {
      title: "FAQ mise à jour",
      message: `La question "${updated.question.slice(0, 40)}..." a été enregistrée.`,
      variant: "success",
    })
  );
}

export async function deleteFaqAction(formData: FormData) {
  const id = toOptionalString(formData.get("id"));
  if (!id) throw new Error("Identifiant FAQ manquant.");

  const deleted = await prisma.faq.delete({
    where: { id },
  });

  revalidatePath("/admin/faqs");
  revalidatePath("/");
  revalidatePath("/faq");
  redirect(
    withToastQuery("/admin/faqs", {
      title: "FAQ supprimée",
      message: `La question "${deleted.question.slice(0, 40)}..." a bien été supprimée.`,
      variant: "success",
    })
  );
}

export async function toggleFaqActiveAction(formData: FormData) {
  const id = toOptionalString(formData.get("id"));
  if (!id) throw new Error("Identifiant FAQ manquant.");

  const current = await prisma.faq.findUnique({
    where: { id },
    select: { isActive: true, question: true },
  });

  if (!current) throw new Error("FAQ introuvable.");

  await prisma.faq.update({
    where: { id },
    data: { isActive: !current.isActive },
  });

  revalidatePath("/admin/faqs");
  revalidatePath("/");
  revalidatePath("/faq");
  redirect(
    withToastQuery("/admin/faqs", {
      title: current.isActive ? "FAQ masquée" : "FAQ activée",
      message: `La question est désormais ${
        current.isActive ? "masquée aux candidats" : "visible sur le site public"
      }.`,
      variant: "success",
    })
  );
}

export async function batchDeleteFaqsAction(ids: string[]) {
  if (!ids || ids.length === 0) return { count: 0 };

  const result = await prisma.faq.deleteMany({
    where: { id: { in: ids } },
  });

  revalidatePath("/admin/faqs");
  revalidatePath("/");
  revalidatePath("/faq");
  return { count: result.count };
}

export async function batchToggleFaqsActiveAction(ids: string[], isActive: boolean) {
  if (!ids || ids.length === 0) return { count: 0 };

  const result = await prisma.faq.updateMany({
    where: { id: { in: ids } },
    data: { isActive },
  });

  revalidatePath("/admin/faqs");
  revalidatePath("/");
  revalidatePath("/faq");
  return { count: result.count };
}

