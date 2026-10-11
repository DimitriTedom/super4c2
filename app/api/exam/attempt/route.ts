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
    let userId: string | null = null;
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
      await createNotificationAction({
        recipient: "CANDIDATE",
        title: `Tentative ${label} enregistrée`,
        message: `Score : ${rawScore} pts (${tcfScaledScore}/699).${crsMessage}`,
        type: "EXAM",
        link: "/dashboard",
      });
    } catch {
      // Notification non bloquante
    }

    return NextResponse.json({ ok: true, attemptId: attempt.id });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la tentative :", error);
    return NextResponse.json(
      { error: "Impossible d'enregistrer la tentative d'examen." },
      { status: 500 }
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
