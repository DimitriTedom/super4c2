"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toOptionalString } from "@/lib/admin-crud-utils";
import { withToastQuery } from "@/lib/toast-navigation";

export async function subscribePublicNewsletterAction(email: string, source = "public_site") {
  const cleanEmail = email?.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes("@")) {
    return { ok: false as const, error: "Veuillez renseigner une adresse e-mail valide." };
  }

  const existing = await prisma.newsletterSubscriber.findUnique({
    where: { email: cleanEmail },
  });

  if (existing) {
    if (!existing.isActive) {
      await prisma.newsletterSubscriber.update({
        where: { email: cleanEmail },
        data: { isActive: true, unsubscribedAt: null },
      });
    }
  } else {
    await prisma.newsletterSubscriber.create({
      data: {
        email: cleanEmail,
        source,
        isActive: true,
      },
    });
  }

  revalidatePath("/admin/newsletter");
  return { ok: true as const };
}

export async function addSubscriberAction(formData: FormData) {
  const email = toOptionalString(formData.get("email"))?.toLowerCase();
  const source = toOptionalString(formData.get("source")) || "admin_manual";

  if (!email || !email.includes("@")) {
    throw new Error("Adresse e-mail invalide.");
  }

  const existing = await prisma.newsletterSubscriber.findUnique({
    where: { email },
  });

  if (existing) {
    if (!existing.isActive) {
      await prisma.newsletterSubscriber.update({
        where: { email },
        data: { isActive: true, unsubscribedAt: null },
      });
    }
  } else {
    await prisma.newsletterSubscriber.create({
      data: {
        email,
        source,
        isActive: true,
      },
    });
  }

  revalidatePath("/admin/newsletter");
  redirect(
    withToastQuery("/admin/newsletter", {
      title: "Abonné enregistré",
      message: `${email} a été ajouté à la liste des abonnés.`,
      variant: "success",
    })
  );
}

export async function toggleSubscriberStatusAction(formData: FormData) {
  const id = toOptionalString(formData.get("id"));
  if (!id) throw new Error("Identifiant manquant.");

  const current = await prisma.newsletterSubscriber.findUnique({
    where: { id },
  });

  if (!current) throw new Error("Abonné introuvable.");

  const willBeActive = !current.isActive;

  await prisma.newsletterSubscriber.update({
    where: { id },
    data: {
      isActive: willBeActive,
      unsubscribedAt: willBeActive ? null : new Date(),
    },
  });

  revalidatePath("/admin/newsletter");
  redirect(
    withToastQuery("/admin/newsletter", {
      title: willBeActive ? "Abonnement réactivé" : "Désinscription enregistrée",
      message: `Le statut de ${current.email} a été mis à jour.`,
      variant: "success",
    })
  );
}

export async function deleteSubscriberAction(formData: FormData) {
  const id = toOptionalString(formData.get("id"));
  if (!id) throw new Error("Identifiant manquant.");

  const deleted = await prisma.newsletterSubscriber.delete({
    where: { id },
  });

  revalidatePath("/admin/newsletter");
  redirect(
    withToastQuery("/admin/newsletter", {
      title: "Abonné supprimé",
      message: `${deleted.email} a été retiré de la base.`,
      variant: "success",
    })
  );
}
