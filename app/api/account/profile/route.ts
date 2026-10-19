import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { syncPrismaUser } from "@/lib/supabase/sync-user";
import { prisma } from "@/lib/prisma";

const profileSchema = z.object({
  displayName: z.string().trim().min(2, "Le nom doit comporter au moins 2 caractères").max(50).optional(),
  targetNclc: z.number().int().min(4).max(10).optional(),
  examDate: z.string().nullable().optional(),
  phone: z.string().trim().max(30).nullable().optional(),
  country: z.string().trim().max(60).nullable().optional(),
});

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const user = supabase ? (await supabase.auth.getUser()).data.user : null;

    if (!user || !user.email) {
      return NextResponse.json({ ok: false, error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = profileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    const { displayName, targetNclc, examDate, phone, country } = parsed.data;

    // Garantir l'existence et la synchronisation de l'utilisateur dans la table users
    await syncPrismaUser(user.id, user.email, displayName);

    const parsedExamDate = examDate ? new Date(examDate) : null;

    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        ...(displayName !== undefined && { displayName }),
        ...(targetNclc !== undefined && { targetNclc }),
        ...(examDate !== undefined && { examDate: parsedExamDate }),
        ...(phone !== undefined && { phone }),
        ...(country !== undefined && { country }),
      },
      create: {
        userId: user.id,
        displayName: displayName || user.email.split("@")[0],
        targetNclc: targetNclc ?? 7,
        examDate: parsedExamDate,
        phone,
        country,
      },
    });

    if (parsedExamDate) {
      try {
        await prisma.notification.create({
          data: {
            recipient: "CANDIDATE",
            userId: user.id,
            title: "📅 Échéance d'examen programmée",
            message: `Votre compte à rebours est calibré pour le ${parsedExamDate.toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}. Vos révisions prioritaires sont actives sur votre tableau de bord.`,
            type: "SYSTEM",
            link: "/dashboard",
          },
        });
      } catch {
        // Non bloquant
      }
    }

    return NextResponse.json({ ok: true, profile });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil :", error);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur lors de l'enregistrement du profil" },
      { status: 500 }
    );
  }
}
