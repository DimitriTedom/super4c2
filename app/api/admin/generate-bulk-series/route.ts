import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  generateCeQuestionsBatch,
  CeBatchTier,
  GeneratedCeQuestion,
  TIER_CONFIG,
} from "@/lib/ai/bulk-ce-generator";

const RequestSchema = z.object({
  seriesId: z.string().optional(),
  seriesNumber: z.number().int().min(1).max(999).optional(),
  seriesTitle: z.string().optional(),
  theme: z.string().optional(),
  batch: z.enum(["tier_1_a1_a2", "tier_2_b1_b2", "tier_3_c1_c2", "all"]),
});

export async function POST(req: NextRequest) {
  try {
    // Vérification de sécurité Admin (Cookie de session admin ou header de test)
    const adminToken = req.cookies.get("super4c2_admin_token")?.value;
    const authHeader = req.headers.get("authorization");
    if (!adminToken && (!authHeader || !authHeader.includes("Bearer"))) {
      // Pour les tests en dev local, on autorise si NEXT_PUBLIC_APP_URL est localhost
      const host = req.headers.get("host") || "";
      const isLocalDev = host.includes("localhost") || host.includes("127.0.0.1");
      if (!isLocalDev) {
        return NextResponse.json(
          { error: "Accès refusé. Session administrateur requise." },
          { status: 401 }
        );
      }
    }

    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Paramètres invalides", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { batch, theme } = parsed.data;
    let seriesId = parsed.data.seriesId;
    let seriesNumber = parsed.data.seriesNumber;
    let seriesTitle = parsed.data.seriesTitle;

    // 1. Résolution ou création de la série CE
    if (seriesId) {
      const existing = await prisma.examSeries.findUnique({
        where: { id: seriesId },
      });
      if (!existing) {
        return NextResponse.json({ error: "Série introuvable" }, { status: 404 });
      }
      seriesNumber = existing.seriesNumber;
      seriesTitle = existing.title;
    } else {
      // Trouver le prochain numéro de série si non spécifié
      if (!seriesNumber) {
        const lastSeries = await prisma.examSeries.findFirst({
          where: { discipline: "COMPREHENSION_ECRITE" },
          orderBy: { seriesNumber: "desc" },
        });
        seriesNumber = (lastSeries?.seriesNumber || 101) + 1;
      }

      if (!seriesTitle) {
        seriesTitle = `TCF Canada — Compréhension Écrite, Série ${seriesNumber} (Conforme FEI)`;
      }

      // Upsert de la série
      const createdSeries = await prisma.examSeries.upsert({
        where: {
          examType_discipline_seriesNumber: {
            examType: "TCF_CANADA",
            discipline: "COMPREHENSION_ECRITE",
            seriesNumber,
          },
        },
        update: {
          title: seriesTitle,
          isPublished: true,
        },
        create: {
          seriesNumber,
          title: seriesTitle,
          examType: "TCF_CANADA",
          discipline: "COMPREHENSION_ECRITE",
          durationSeconds: 3600,
          isPublished: true,
          isFreeDemo: false,
        },
      });

      seriesId = createdSeries.id;
    }

    // 2. Détermination des lots à générer
    const batchesToRun: CeBatchTier[] =
      batch === "all"
        ? ["tier_1_a1_a2", "tier_2_b1_b2", "tier_3_c1_c2"]
        : [batch as CeBatchTier];

    const allGenerated: GeneratedCeQuestion[] = [];

    for (const b of batchesToRun) {
      const batchQuestions = await generateCeQuestionsBatch({
        batch: b,
        theme,
        seriesNumber,
      });

      // Upsert chaque question dans PostgreSQL
      for (const q of batchQuestions) {
        await prisma.question.upsert({
          where: {
            seriesId_questionNumber: {
              seriesId: seriesId!,
              questionNumber: q.questionNumber,
            },
          },
          update: {
            discipline: "COMPREHENSION_ECRITE",
            cefrLevel: q.cefrLevel,
            nclcTargetLevel: q.nclcTargetLevel,
            documentTitle: q.documentTitle,
            documentText: q.documentText,
            prompt: q.prompt,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctOption: q.correctOption,
            explanation: q.explanation,
            trapAnalysis: q.trapAnalysis,
          },
          create: {
            seriesId: seriesId!,
            discipline: "COMPREHENSION_ECRITE",
            questionNumber: q.questionNumber,
            cefrLevel: q.cefrLevel,
            nclcTargetLevel: q.nclcTargetLevel,
            documentTitle: q.documentTitle,
            documentText: q.documentText,
            prompt: q.prompt,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctOption: q.correctOption,
            explanation: q.explanation,
            trapAnalysis: q.trapAnalysis,
          },
        });

        allGenerated.push(q);
      }
    }

    // Compter le total de questions désormais dans la série
    const totalCount = await prisma.question.count({
      where: { seriesId: seriesId! },
    });

    return NextResponse.json({
      success: true,
      seriesId,
      seriesNumber,
      seriesTitle,
      batch,
      createdCount: allGenerated.length,
      totalInSeries: totalCount,
      questionsSummary: allGenerated.map((q) => ({
        questionNumber: q.questionNumber,
        cefrLevel: q.cefrLevel,
        documentTitle: q.documentTitle,
        prompt: q.prompt,
        correctOption: q.correctOption,
      })),
    });
  } catch (error) {
    console.error("Erreur Bulk Series Generation:", error);
    return NextResponse.json(
      { error: "Échec de la génération par lot", details: String(error) },
      { status: 500 }
    );
  }
}
