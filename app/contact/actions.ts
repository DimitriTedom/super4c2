"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const contactLeadSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
  email: z.string().email("Adresse e-mail invalide."),
  phone: z.string().optional().nullable(),
  examDate: z.string().optional().nullable(),
  message: z.string().min(5, "Le message doit contenir au moins 5 caractères."),
  intent: z.enum(["CANDIDATE", "URGENT", "B2B", "TECH"]).default("CANDIDATE"),
});

export type SubmitContactInput = z.infer<typeof contactLeadSchema>;

export async function submitContactLeadAction(input: SubmitContactInput) {
  const parsed = contactLeadSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message || "Données invalides." };
  }

  const { name, email, phone, examDate, message, intent } = parsed.data;

  await prisma.contactLead.create({
    data: {
      name,
      email: email.toLowerCase(),
      phone: phone?.trim() || null,
      intent,
      message: `${message}${examDate ? ` (Date cible de passation: ${examDate})` : ""}`,
      status: "NOUVEAU",
    },
  });

  revalidatePath("/admin/leads");
  return { ok: true as const };
}
