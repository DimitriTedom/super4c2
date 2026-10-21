"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toOptionalString } from "@/lib/admin-crud-utils";
import { withToastQuery } from "@/lib/toast-navigation";

export interface PublicLeadInput {
  email: string;
  phone?: string;
  name?: string;
  source?: string;
  crsScore?: number;
  nclcProfile?: string;
}

function normalizePhone(raw?: string): string | null {
  if (!raw) return null;
  const digits = raw.replace(/[^\d+]/g, "");
  const normalized = digits.startsWith("+") ? digits : `+${digits.replace(/^00/, "")}`;
  const len = normalized.replace(/\D/g, "").length;
  return len >= 8 && len <= 15 ? normalized : null;
}

export async function captureLeadAction(input: PublicLeadInput) {
  const cleanEmail = input.email?.trim().toLowerCase();
  if (!cleanEmail || !/^\S+@\S+\.\S+$/.test(cleanEmail)) {
    return { ok: false as const, error: "Veuillez renseigner une adresse e-mail valide." };
  }
  const phone = normalizePhone(input.phone);
  if (input.phone && !phone) {
    return { ok: false as const, error: "Numéro WhatsApp invalide (ex : +237 6XX XX XX XX)." };
  }
  const source = input.source || "public_site";
  const name = input.name?.trim() || null;

  const existing = await prisma.newsletterSubscriber.findUnique({ where: { email: cleanEmail } });

  await prisma.newsletterSubscriber.upsert({
    where: { email: cleanEmail },
    update: {
      isActive: true,
      unsubscribedAt: null,
      ...(phone ? { phone } : {}),
      ...(name ? { name } : {}),
      ...(input.crsScore != null ? { crsScore: input.crsScore } : {}),
      ...(input.nclcProfile ? { nclcProfile: input.nclcProfile } : {}),
    },
    create: {
      email: cleanEmail,
      source,
      isActive: true,
      phone,
      name,
      crsScore: input.crsScore ?? null,
      nclcProfile: input.nclcProfile ?? null,
    },
  });

  if (!existing || (phone && !existing.phone)) {
    await prisma.notification.create({
      data: {
        recipient: "ADMIN",
        title: phone ? "📲 Nouveau lead WhatsApp" : "📬 Nouvel Abonné Newsletter",
        message: `${name ? name + " — " : ""}${cleanEmail}${phone ? " · " + phone : ""} via "${source}"${
          input.crsScore != null ? ` (CRS ${input.crsScore})` : ""
        }.`,
        type: "LEAD",
        link: "/admin/newsletter",
        isRead: false,
      },
    });
  }

  revalidatePath("/admin/newsletter");
  return { ok: true as const };
}

export async function subscribePublicNewsletterAction(email: string, source = "public_site", phone?: string) {
  return captureLeadAction({ email, source, phone });
}

export async function addSubscriberAction(formData: FormData) {
  const email = toOptionalString(formData.get("email"))?.toLowerCase();
  const name = toOptionalString(formData.get("name"));
  const rawPhone = toOptionalString(formData.get("phone"));
  const phone = normalizePhone(rawPhone || undefined);
  const source = toOptionalString(formData.get("source")) || "admin_manual";

  if (!email || !email.includes("@")) {
    throw new Error("Adresse e-mail invalide.");
  }

  const existing = await prisma.newsletterSubscriber.findUnique({
    where: { email },
  });

  if (existing) {
    await prisma.newsletterSubscriber.update({
      where: { email },
      data: {
        isActive: true,
        unsubscribedAt: null,
        ...(name ? { name } : {}),
        ...(phone ? { phone } : {}),
      },
    });
  } else {
    await prisma.newsletterSubscriber.create({
      data: {
        email,
        name,
        phone,
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

export async function batchDeleteSubscribersAction(ids: string[]) {
  if (!ids || ids.length === 0) return { count: 0 };

  const result = await prisma.newsletterSubscriber.deleteMany({
    where: { id: { in: ids } },
  });

  revalidatePath("/admin/newsletter");
  return { count: result.count };
}

export async function batchUpdateSubscribersStatusAction(ids: string[], isActive: boolean) {
  if (!ids || ids.length === 0) return { count: 0 };

  const result = await prisma.newsletterSubscriber.updateMany({
    where: { id: { in: ids } },
    data: {
      isActive,
      unsubscribedAt: isActive ? null : new Date(),
    },
  });

  revalidatePath("/admin/newsletter");
  return { count: result.count };
}
