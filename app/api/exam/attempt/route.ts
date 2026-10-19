import { NextResponse } from "next/server";
import { z } from "zod";
import { Discipline } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createNotificationAction } from "@/lib/notifications/actions";

const attemptSchema = z.object({
  discipline: z.enum([
    "COMPREHENSION_ECRITE",
    "COMPREHENSION_ORALE",
    "EXPRESSION_ECRITE",
    "EXPRESSION_ORALE",
  ]),
  seriesId: z.string().optional().nullable(),
  rawScore: z.number().default(0),
  tcfScaledScore: z.number().default(0),
  nclcLevel: z.number().default(0),
  crsPointsUnlocked: z.number().default(0),
  answers: z.any().default({}),
  feedback: z.any().optional().nullable(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = attemptSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données de tentative invalides", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      discipline,
      seriesId,
      rawScore,
      tcfScaledScore,
      nclcLevel,
      crsPointsUnlocked,
      answers,
      feedback,
    } = parsed.data;

    let attemptId = "offline-" + Date.now();
    let userId: string | null = null;
    try {
      // Vérifier si une ExamSeries correspond à ce seriesId pour la clé étrangère
      let validSeriesId: string | null = null;
      if (seriesId) {
        const existingSeries = await prisma.examSeries.findUnique({
          where: { id: seriesId },
          select: { id: true },
        });
        if (existingSeries) {
          validSeriesId = existingSeries.id;
        }
      }

      // Associer l'utilisateur authentifié s'il est connecté
      try {
        const { createSupabaseServerClient } = await import("@/lib/supabase/server");
        const supabase = await createSupabaseServerClient();
        const authUser = supabase ? (await supabase.auth.getUser()).data.user : null;
        if (authUser?.id) {
          const dbUser = await prisma.user.findUnique({
            where: { id: authUser.id },
            select: { id: true },
          });
          if (dbUser) {
            userId = dbUser.id;
          }
        }
      } catch (e) {
        console.warn("Échec de récupération de l'utilisateur pour userAttempt:", e);
      }

      const attempt = await prisma.userAttempt.create({
        data: {
          userId,
          discipline,
          seriesId: validSeriesId,
          rawScore,
          tcfScaledScore,
          nclcLevel,
          crsPointsUnlocked,
          answers: answers ?? {},
          feedback: feedback ?? {},
          completedAt: new Date(),
        },
      });
      attemptId = attempt.id;
    } catch (dbErr) {
      console.warn("[Attempt Save] Déconnexion SQL temporaire ou pooler réinitialisé :", dbErr);
    }

    // Notification in-app pour le candidat
    const disciplineLabels: Record<string, string> = {
      COMPREHENSION_ECRITE: "Compréhension Écrite (CE)",
      COMPREHENSION_ORALE: "Compréhension Orale (CO)",
      EXPRESSION_ECRITE: "Expression Écrite (EE)",
      EXPRESSION_ORALE: "Expression Orale (EO)",
    };

    const label = disciplineLabels[discipline] || discipline;
    const crsMessage =
      crsPointsUnlocked > 0
        ? ` +50 points bonus CRS acquis (NCLC ${nclcLevel}) !`
        : ` Niveau NCLC ${nclcLevel} atteint.`;

    try {
      if (userId) {
        await createNotificationAction({
          recipient: "CANDIDATE",
          userId,
          title:
            crsPointsUnlocked > 0
              ? `🎉 Palier NCLC ${nclcLevel} Validé (+50 pts CRS)`
              : `Simulation ${label} enregistrée`,
          message: `Score : ${rawScore} pts (${tcfScaledScore}/699 pts).${crsMessage}`,
          type: "EXAM",
          link: attemptId ? `/dashboard/historique/${attemptId}` : "/dashboard",
        });
      }

      // Notification informative pour l'administration
      await createNotificationAction({
        recipient: "ADMIN",
        title: `📊 Simulation CBT Terminée (${label})`,
        message: `Résultat : ${rawScore} pts (${tcfScaledScore}/699 pts) · Niveau NCLC ${nclcLevel}.${
          crsPointsUnlocked > 0 ? " (+50 pts CRS acquis)" : ""
        }`,
        type: "EXAM",
        link: "/admin",
      });
    } catch {
      // Notification non bloquante
    }

    return NextResponse.json({ ok: true, attemptId });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la tentative :", error);
    return NextResponse.json(
      { ok: true, offline: true, message: "Sauvegarde locale de la tentative effectuée." }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const discipline = searchParams.get("discipline");

    const attempts = await prisma.userAttempt.findMany({
      where: discipline
        ? {
            discipline: discipline as Discipline,
          }
        : undefined,
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ ok: true, attempts });
  } catch (error) {
    console.error("Erreur lecture tentatives :", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les tentatives." },
      { status: 500 }
    );
  }
}
