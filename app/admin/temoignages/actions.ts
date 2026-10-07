"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  toBoolean,
  toInteger,
  toOptionalString,
} from "@/lib/admin-crud-utils";
import { withToastQuery } from "@/lib/toast-navigation";

function normalizeTestimonialPayload(formData: FormData) {
  const candidateName = toOptionalString(formData.get("candidateName"));
  const country = toOptionalString(formData.get("country")) || "Cameroun";
  const targetScore = toOptionalString(formData.get("targetScore")) || "NCLC 7";
  const achievedNclc = toOptionalString(formData.get("achievedNclc")) || "NCLC 8";
  const crsPointsGained = toInteger(formData.get("crsPointsGained"), 50, 0);
  const quote = toOptionalString(formData.get("quote"));
  const avatar = toOptionalString(formData.get("avatar"));
  const rating = toInteger(formData.get("rating"), 5, 1);
  const order = toInteger(formData.get("order"), 0, 0);
  const isFeatured = toBoolean(formData.get("isFeatured"));
  const isActive = toBoolean(formData.get("isActive"));

  if (!candidateName || !quote) {
    throw new Error("Le nom du candidat et le témoignage sont obligatoires.");
  }

  return {
    candidateName,
    country,
    targetScore,
    achievedNclc,
    crsPointsGained,
    quote,
    avatar,
    rating: Math.min(5, Math.max(1, rating)),
    order,
    isFeatured,
    isActive,
  };
}

export async function createTestimonialAction(formData: FormData) {
  const payload = normalizeTestimonialPayload(formData);

  const created = await prisma.testimonial.create({
    data: payload,
  });

  revalidatePath("/admin/temoignages");
  revalidatePath("/");
  redirect(
    withToastQuery("/admin/temoignages", {
      title: "Témoignage ajouté",
      message: `Le témoignage de ${created.candidateName} (${created.achievedNclc}) a été enregistré.`,
      variant: "success",
    })
  );
}

export async function updateTestimonialAction(formData: FormData) {
  const id = toOptionalString(formData.get("id"));
  if (!id) throw new Error("Identifiant du témoignage manquant.");

  const payload = normalizeTestimonialPayload(formData);

  const updated = await prisma.testimonial.update({
    where: { id },
    data: payload,
  });

  revalidatePath("/admin/temoignages");
  revalidatePath("/");
  redirect(
    withToastQuery("/admin/temoignages", {
      title: "Témoignage mis à jour",
      message: `Le témoignage de ${updated.candidateName} a été actualisé.`,
      variant: "success",
    })
  );
}

export async function deleteTestimonialAction(formData: FormData) {
  const id = toOptionalString(formData.get("id"));
  if (!id) throw new Error("Identifiant manquant.");

  const deleted = await prisma.testimonial.delete({
    where: { id },
  });

  revalidatePath("/admin/temoignages");
  revalidatePath("/");
  redirect(
    withToastQuery("/admin/temoignages", {
      title: "Témoignage supprimé",
      message: `Le témoignage de ${deleted.candidateName} a été supprimé définitivement.`,
      variant: "success",
    })
  );
}

export async function toggleTestimonialActiveAction(formData: FormData) {
  const id = toOptionalString(formData.get("id"));
  if (!id) throw new Error("Identifiant manquant.");

  const current = await prisma.testimonial.findUnique({
    where: { id },
    select: { isActive: true, candidateName: true },
  });

  if (!current) throw new Error("Témoignage introuvable.");

  await prisma.testimonial.update({
    where: { id },
    data: { isActive: !current.isActive },
  });

  revalidatePath("/admin/temoignages");
  revalidatePath("/");
  redirect(
    withToastQuery("/admin/temoignages", {
      title: !current.isActive ? "Témoignage activé" : "Témoignage masqué",
      message: `Le témoignage de ${current.candidateName} est désormais ${!current.isActive ? "visible sur la plateforme" : "masqué"}.`,
      variant: "success",
    })
  );
}

export async function toggleTestimonialFeaturedAction(formData: FormData) {
  const id = toOptionalString(formData.get("id"));
  if (!id) throw new Error("Identifiant manquant.");

  const current = await prisma.testimonial.findUnique({
    where: { id },
    select: { isFeatured: true, candidateName: true },
  });

  if (!current) throw new Error("Témoignage introuvable.");

  await prisma.testimonial.update({
    where: { id },
    data: { isFeatured: !current.isFeatured },
  });

  revalidatePath("/admin/temoignages");
  revalidatePath("/");
  redirect(
    withToastQuery("/admin/temoignages", {
      title: !current.isFeatured ? "Mis en avant" : "Retiré de la une",
      message: `Le témoignage de ${current.candidateName} ${!current.isFeatured ? "apparaîtra en vedette" : "ne sera plus en vedette"}.`,
      variant: "success",
    })
  );
}
