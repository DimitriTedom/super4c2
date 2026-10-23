import { PrismaClient } from "@prisma/client";
import { FULL_SERIES_CO_101 } from "../lib/exam/series-co-101";
import { FULL_SERIES_CE_101 } from "../lib/exam/series-ce-101";
import { MULTI_SERIES_EE, MULTI_SERIES_EO } from "../lib/exam/multi-series-data";

const prisma = new PrismaClient();

async function syncAllSeries() {
  console.log("🚀 Synchronisation complète des séries Administrateur & Candidat...");

  // 1. Synchronisation Compréhension Orale (CO) Série 101
  console.log("🎧 Insertion / Mise à jour Série CO 101 (39 questions officielles)...");
  const coSeries101 = await prisma.examSeries.upsert({
    where: {
      examType_discipline_seriesNumber: {
        examType: "TCF_CANADA",
        discipline: "COMPREHENSION_ORALE",
        seriesNumber: 101,
      },
    },
    update: {
      title: "TCF Canada — Compréhension Orale, Série 101 (Officielle)",
      durationSeconds: 2400, // 40 minutes
      isPublished: true,
      isFreeDemo: false,
    },
    create: {
      seriesNumber: 101,
      title: "TCF Canada — Compréhension Orale, Série 101 (Officielle)",
      examType: "TCF_CANADA",
      discipline: "COMPREHENSION_ORALE",
      durationSeconds: 2400,
      isPublished: true,
      isFreeDemo: false,
    },
  });

  for (const q of FULL_SERIES_CO_101.questions) {
    let cefrLevel = "A1";
    if (q.questionNumber <= 6) cefrLevel = "A1";
    else if (q.questionNumber <= 12) cefrLevel = "A2";
    else if (q.questionNumber <= 18) cefrLevel = "B1";
    else if (q.questionNumber <= 28) cefrLevel = "B2";
    else if (q.questionNumber <= 35) cefrLevel = "C1";
    else cefrLevel = "C2";

    await prisma.question.upsert({
      where: {
        seriesId_questionNumber: {
          seriesId: coSeries101.id,
          questionNumber: q.questionNumber,
        },
      },
      update: {
        discipline: "COMPREHENSION_ORALE",
        nclcTargetLevel: q.nclcTargetLevel ?? 7,
        cefrLevel,
        audioUrl: q.audioUrl ?? null,
        audioTranscript: q.audioTranscript ?? null,
        documentImageUrl: q.documentImageUrl ?? null,
        prompt: q.prompt,
        optionA: q.options.A ?? "",
        optionB: q.options.B ?? "",
        optionC: q.options.C ?? "",
        optionD: q.options.D ?? "",
        correctOption: q.correctOption,
        explanation: q.explanation,
        trapAnalysis: q.trapAnalysis,
      },
      create: {
        seriesId: coSeries101.id,
        discipline: "COMPREHENSION_ORALE",
        questionNumber: q.questionNumber,
        nclcTargetLevel: q.nclcTargetLevel ?? 7,
        cefrLevel,
        audioUrl: q.audioUrl ?? null,
        audioTranscript: q.audioTranscript ?? null,
        documentImageUrl: q.documentImageUrl ?? null,
        prompt: q.prompt,
        optionA: q.options.A ?? "",
        optionB: q.options.B ?? "",
        optionC: q.options.C ?? "",
        optionD: q.options.D ?? "",
        correctOption: q.correctOption,
        explanation: q.explanation,
        trapAnalysis: q.trapAnalysis,
      },
    });
  }
  console.log("✅ 39 questions de CO Série 101 synchronisées avec succès.");

  // 2. Synchronisation Compréhension Écrite (CE) Séries 103, 104, 105
  for (const num of [103, 104, 105]) {
    console.log(`📖 Synchronisation Série CE ${num}...`);
    const ceSeries = await prisma.examSeries.upsert({
      where: {
        examType_discipline_seriesNumber: {
          examType: "TCF_CANADA",
          discipline: "COMPREHENSION_ECRITE",
          seriesNumber: num,
        },
      },
      update: {
        title: `TCF Canada — Compréhension Écrite, Série ${num} (Conforme FEI)`,
        durationSeconds: 3600,
        isPublished: true,
        isFreeDemo: false,
      },
      create: {
        seriesNumber: num,
        title: `TCF Canada — Compréhension Écrite, Série ${num} (Conforme FEI)`,
        examType: "TCF_CANADA",
        discipline: "COMPREHENSION_ECRITE",
        durationSeconds: 3600,
        isPublished: true,
        isFreeDemo: false,
      },
    });

    // Remplissage des questions 1 à 39 si vides
    const existingCount = await prisma.question.count({
      where: { seriesId: ceSeries.id },
    });

    if (existingCount === 0) {
      console.log(`   Remplissage initial des 39 questions pour CE ${num}...`);
      for (const q of FULL_SERIES_CE_101.questions) {
        let cefrLevel = "A1";
        if (q.questionNumber <= 6) cefrLevel = "A1";
        else if (q.questionNumber <= 12) cefrLevel = "A2";
        else if (q.questionNumber <= 18) cefrLevel = "B1";
        else if (q.questionNumber <= 28) cefrLevel = "B2";
        else if (q.questionNumber <= 35) cefrLevel = "C1";
        else cefrLevel = "C2";

        await prisma.question.create({
          data: {
            seriesId: ceSeries.id,
            discipline: "COMPREHENSION_ECRITE",
            questionNumber: q.questionNumber,
            nclcTargetLevel: q.nclcTargetLevel ?? 7,
            cefrLevel,
            documentTitle: (q as Record<string, any>).documentTitle ?? null,
            documentText: q.documentText,
            prompt: q.prompt,
            optionA: q.options.A ?? "",
            optionB: q.options.B ?? "",
            optionC: q.options.C ?? "",
            optionD: q.options.D ?? "",
            correctOption: q.correctOption,
            explanation: q.explanation,
            trapAnalysis: q.trapAnalysis,
          },
        });
      }
      console.log(`   ✅ 39 questions ajoutées pour CE ${num}.`);
    }
  }

  // 3. Vérification finale
  const [totalCe, totalCo, totalEe, totalEo] = await Promise.all([
    prisma.examSeries.count({ where: { discipline: "COMPREHENSION_ECRITE" } }),
    prisma.examSeries.count({ where: { discipline: "COMPREHENSION_ORALE" } }),
    prisma.writtenSeries.count(),
    prisma.oralSeries.count(),
  ]);

  console.log("\n=========================================");
  console.log("📊 ÉTAT DU CATALOGUE EN BASE DE DONNÉES :");
  console.log(`- Compréhension Écrite (CE) : ${totalCe} séries (101 à 105)`);
  console.log(`- Compréhension Orale  (CO) : ${totalCo} série(s)`);
  console.log(`- Expression Écrite    (EE) : ${totalEe} séries (101 à 105)`);
  console.log(`- Expression Orale     (EO) : ${totalEo} séries (101 à 105)`);
  console.log("=========================================\n");

  await prisma.$disconnect();
}

syncAllSeries().catch((e) => {
  console.error("❌ Erreur pendant la synchronisation :", e);
  process.exit(1);
});
