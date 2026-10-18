import { prisma } from "@/lib/prisma";
import type { OralSeries, OralTask, OralTaskType } from "./oral-types";
import { MULTI_SERIES_EO } from "./multi-series-data";
import { parseSeriesNumber } from "./written-service";

/**
 * Récupère une série d'Expression Orale depuis la base de données PostgreSQL (Prisma).
 * Recherche prioritairement par ID direct (cuid), puis par seriesNumber.
 * Repli automatique sur le catalogue en mémoire si la base est temporairement inaccessible.
 */
export async function getOralSeries(idOrNumber: string | number): Promise<OralSeries | null> {
  const seriesNum = parseSeriesNumber(idOrNumber);

  try {
    const dbSeries = await prisma.oralSeries.findFirst({
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
        tasks: dbSeries.tasks.map((t) => ({
          taskNumber: t.taskNumber as 1 | 2 | 3,
          type: t.type as OralTaskType,
          title: t.title,
          durationSeconds: t.durationSeconds,
          examinerPrompt: t.examinerPrompt,
          roleplayScenario: t.roleplayScenario as any,
        })) as [OralTask, OralTask, OralTask],
      };
    }
  } catch (error) {
    console.warn("⚠️ Impossible d'interroger oralSeries dans Prisma, repli local :", error);
  }

  // Repli gracieux sur le catalogue multi-séries
  if (seriesNum) {
    const fallback = MULTI_SERIES_EO.find((s) => s.seriesNumber === seriesNum) || MULTI_SERIES_EO[0];
    if (fallback) {
      return {
        id: `serie-${fallback.seriesNumber}-eo`,
        seriesNumber: fallback.seriesNumber,
        title: fallback.title,
        tasks: fallback.tasks.map((t) => ({
          taskNumber: t.taskNumber as 1 | 2 | 3,
          type: t.type as OralTaskType,
          title: t.title,
          durationSeconds: t.durationSeconds,
          examinerPrompt: t.examinerPrompt,
          roleplayScenario: t.roleplayScenario,
        })) as [OralTask, OralTask, OralTask],
      };
    }
  }

  return null;
}

/**
 * Récupère l'ensemble des séries d'Expression Orale disponibles dans la base de données.
 */
export async function listOralSeries(): Promise<OralSeries[]> {
  try {
    const allDbSeries = await prisma.oralSeries.findMany({
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
          tasks: s.tasks.map((t) => ({
            taskNumber: t.taskNumber as 1 | 2 | 3,
            type: t.type as OralTaskType,
            title: t.title,
            durationSeconds: t.durationSeconds,
            examinerPrompt: t.examinerPrompt,
            roleplayScenario: t.roleplayScenario as any,
          })) as [OralTask, OralTask, OralTask],
        }));
    }
  } catch (error) {
    console.warn("⚠️ Impossible de lister oralSeries depuis Prisma :", error);
  }

  return MULTI_SERIES_EO.map((fallback) => ({
    id: `serie-${fallback.seriesNumber}-eo`,
    seriesNumber: fallback.seriesNumber,
    title: fallback.title,
    tasks: fallback.tasks.map((t) => ({
      taskNumber: t.taskNumber as 1 | 2 | 3,
      type: t.type as OralTaskType,
      title: t.title,
      durationSeconds: t.durationSeconds,
      examinerPrompt: t.examinerPrompt,
      roleplayScenario: t.roleplayScenario,
    })) as [OralTask, OralTask, OralTask],
  }));
}
