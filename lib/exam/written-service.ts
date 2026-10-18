import { prisma } from "@/lib/prisma";
import type { WrittenExamSeries, WrittenTask } from "./written-types";
import { MULTI_SERIES_EE } from "./multi-series-data";

/**
 * Extrait le numéro de série numérique depuis un identifiant textuel.
 * Exemples : "demo-101-ee" -> 101, "serie-102" -> 102, "103" -> 103, "demo-101" -> 101
 */
export function parseSeriesNumber(id: string | number): number | null {
  if (typeof id === "number") return id;
  const match = id.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

/**
 * Récupère une série d'Expression Écrite depuis la base de données PostgreSQL (Prisma).
 * Recherche prioritairement par ID direct (cuid), puis par seriesNumber.
 * Repli automatique sur le catalogue en mémoire si la base est hors ligne.
 */
export async function getWrittenSeries(idOrNumber: string | number): Promise<WrittenExamSeries | null> {
  const seriesNum = parseSeriesNumber(idOrNumber);

  try {
    const dbSeries = await prisma.writtenSeries.findFirst({
      where: {
        OR: [
          ...(typeof idOrNumber === "string" ? [{ id: idOrNumber }] : []),
          ...(seriesNum ? [{ seriesNumber: seriesNum }] : []),
        ],
      },
      include: {
        tasks: {
          orderBy: { taskNumber: "asc" },
        },
      },
    });

    if (dbSeries && dbSeries.tasks.length === 3) {
      return {
        id: dbSeries.id,
        seriesNumber: dbSeries.seriesNumber,
        title: dbSeries.title,
        durationSeconds: dbSeries.durationSeconds,
        tasks: dbSeries.tasks.map((t) => ({
          taskNumber: t.taskNumber as 1 | 2 | 3,
          title: t.title,
          topic: t.topic,
          context: t.context || undefined,
          minWords: t.minWords,
          maxWords: t.maxWords,
          suggestedDurationMinutes: t.suggestedDurationMinutes,
        })) as [WrittenTask, WrittenTask, WrittenTask],
      };
    }
  } catch (error) {
    console.warn("⚠️ Impossible d'interroger writtenSeries dans Prisma, repli local :", error);
  }

  // Repli gracieux sur le catalogue multi-séries si la requête DB échoue
  if (seriesNum) {
    const fallback = MULTI_SERIES_EE.find((s) => s.seriesNumber === seriesNum) || MULTI_SERIES_EE[0];
    if (fallback) {
      return {
        id: `serie-${fallback.seriesNumber}-ee`,
        seriesNumber: fallback.seriesNumber,
        title: fallback.title,
        durationSeconds: fallback.durationSeconds,
        tasks: fallback.tasks.map((t) => ({
          taskNumber: t.taskNumber as 1 | 2 | 3,
          title: t.title,
          topic: t.topic,
          context: t.context,
          minWords: t.minWords,
          maxWords: t.maxWords,
          suggestedDurationMinutes: t.suggestedDurationMinutes,
        })) as [WrittenTask, WrittenTask, WrittenTask],
      };
    }
  }

  return null;
}

/**
 * Récupère l'ensemble des séries d'Expression Écrite disponibles dans la base de données.
 */
export async function listWrittenSeries(): Promise<WrittenExamSeries[]> {
  try {
    const allDbSeries = await prisma.writtenSeries.findMany({
      where: { isPublished: true },
      include: {
        tasks: {
          orderBy: { taskNumber: "asc" },
        },
      },
      orderBy: { seriesNumber: "asc" },
    });

    if (allDbSeries.length > 0) {
      return allDbSeries
        .filter((s) => s.tasks.length === 3)
        .map((s) => ({
          id: s.id,
          seriesNumber: s.seriesNumber,
          title: s.title,
          durationSeconds: s.durationSeconds,
          tasks: s.tasks.map((t) => ({
            taskNumber: t.taskNumber as 1 | 2 | 3,
            title: t.title,
            topic: t.topic,
            context: t.context || undefined,
            minWords: t.minWords,
            maxWords: t.maxWords,
            suggestedDurationMinutes: t.suggestedDurationMinutes,
          })) as [WrittenTask, WrittenTask, WrittenTask],
        }));
    }
  } catch (error) {
    console.warn("⚠️ Impossible de lister writtenSeries depuis Prisma :", error);
  }

  return MULTI_SERIES_EE.map((fallback) => ({
    id: `serie-${fallback.seriesNumber}-ee`,
    seriesNumber: fallback.seriesNumber,
    title: fallback.title,
    durationSeconds: fallback.durationSeconds,
    tasks: fallback.tasks.map((t) => ({
      taskNumber: t.taskNumber as 1 | 2 | 3,
      title: t.title,
      topic: t.topic,
      context: t.context,
      minWords: t.minWords,
      maxWords: t.maxWords,
      suggestedDurationMinutes: t.suggestedDurationMinutes,
    })) as [WrittenTask, WrittenTask, WrittenTask],
  }));
}
