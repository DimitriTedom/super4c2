import { PrismaClient } from "@prisma/client";
import { MULTI_SERIES_EE, MULTI_SERIES_EO } from "../lib/exam/multi-series-data";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Début du peuplement du catalogue multi-séries (101 à 105)...");

  // 1. Peuplement Expression Écrite (EE)
  for (const s of MULTI_SERIES_EE) {
    console.log(`✍️ Insertion Série EE ${s.seriesNumber} : "${s.title}"...`);
    const written = await prisma.writtenSeries.upsert({
      where: { seriesNumber: s.seriesNumber },
      update: {
        title: s.title,
        durationSeconds: s.durationSeconds,
        isPublished: true,
      },
      create: {
        seriesNumber: s.seriesNumber,
        title: s.title,
        durationSeconds: s.durationSeconds,
        isPublished: true,
      },
    });

    for (const t of s.tasks) {
      await prisma.writtenTask.upsert({
        where: {
          seriesId_taskNumber: {
            seriesId: written.id,
            taskNumber: t.taskNumber,
          },
        },
        update: {
          title: t.title,
          minWords: t.minWords,
          maxWords: t.maxWords,
          suggestedDurationMinutes: t.suggestedDurationMinutes,
          topic: t.topic,
          context: t.context,
          sampleModelC2: t.sampleModelC2,
        },
        create: {
          seriesId: written.id,
          taskNumber: t.taskNumber,
          title: t.title,
          minWords: t.minWords,
          maxWords: t.maxWords,
          suggestedDurationMinutes: t.suggestedDurationMinutes,
          topic: t.topic,
          context: t.context,
          sampleModelC2: t.sampleModelC2,
        },
      });
    }
  }
  console.log("✅ 5 Séries d'Expression Écrite (15 tâches FEI avec modèles C2) synchronisées !");

  // 2. Peuplement Expression Orale (EO)
  for (const s of MULTI_SERIES_EO) {
    console.log(`🎙️ Insertion Série EO ${s.seriesNumber} : "${s.title}"...`);
    const oral = await prisma.oralSeries.upsert({
      where: { seriesNumber: s.seriesNumber },
      update: {
        title: s.title,
        durationSeconds: s.durationSeconds,
        isPublished: true,
      },
      create: {
        seriesNumber: s.seriesNumber,
        title: s.title,
        durationSeconds: s.durationSeconds,
        isPublished: true,
      },
    });

    for (const t of s.tasks) {
      await prisma.oralTask.upsert({
        where: {
          seriesId_taskNumber: {
            seriesId: oral.id,
            taskNumber: t.taskNumber,
          },
        },
        update: {
          type: t.type,
          title: t.title,
          durationSeconds: t.durationSeconds,
          examinerPrompt: t.examinerPrompt,
          roleplayScenario: t.roleplayScenario as any,
        },
        create: {
          seriesId: oral.id,
          taskNumber: t.taskNumber,
          type: t.type,
          title: t.title,
          durationSeconds: t.durationSeconds,
          examinerPrompt: t.examinerPrompt,
          roleplayScenario: t.roleplayScenario as any,
        },
      });
    }
  }
  console.log("✅ 5 Séries d'Expression Orale (15 tâches FEI avec jeux de rôle M. Laurent) synchronisées !");
  console.log("🎉 Opération Multi-Séries 100% Réussie !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur pendant le peuplement :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
