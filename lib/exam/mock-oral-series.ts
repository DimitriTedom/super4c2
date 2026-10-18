import type { OralSeries, OralTask, OralTaskType } from "./oral-types";
import { MULTI_SERIES_EO } from "./multi-series-data";

export const MOCK_ORAL_SERIES_101: OralSeries = {
  id: "demo-101-eo",
  seriesNumber: 101,
  title: "TCF Canada — Expression Orale, Série 101 (Officiel)",
  tasks: MULTI_SERIES_EO[0].tasks.map((t) => ({
    taskNumber: t.taskNumber as 1 | 2 | 3,
    type: t.type as OralTaskType,
    title: t.title,
    durationSeconds: t.durationSeconds,
    examinerPrompt: t.examinerPrompt,
    roleplayScenario: t.roleplayScenario,
  })) as [OralTask, OralTask, OralTask],
};

const ORAL_SERIES_MAP: Record<string, OralSeries> = {};

// Initialisation de toutes les séries 101 à 105 avec alias
for (const s of MULTI_SERIES_EO) {
  const seriesObj: OralSeries = {
    id: `serie-${s.seriesNumber}-eo`,
    seriesNumber: s.seriesNumber,
    title: s.title,
    tasks: s.tasks.map((t) => ({
      taskNumber: t.taskNumber as 1 | 2 | 3,
      type: t.type as OralTaskType,
      title: t.title,
      durationSeconds: t.durationSeconds,
      examinerPrompt: t.examinerPrompt,
      roleplayScenario: t.roleplayScenario,
    })) as [OralTask, OralTask, OralTask],
  };

  ORAL_SERIES_MAP[seriesObj.id] = seriesObj;
  ORAL_SERIES_MAP[`serie-${s.seriesNumber}`] = seriesObj;
  ORAL_SERIES_MAP[`${s.seriesNumber}`] = seriesObj;
  ORAL_SERIES_MAP[`demo-${s.seriesNumber}`] = seriesObj;
  ORAL_SERIES_MAP[`demo-${s.seriesNumber}-eo`] = seriesObj;
}

// Alias historique 101
ORAL_SERIES_MAP["demo-101-eo"] = ORAL_SERIES_MAP["101"];
ORAL_SERIES_MAP["demo-101-ce"] = ORAL_SERIES_MAP["101"];
ORAL_SERIES_MAP["demo-101"] = ORAL_SERIES_MAP["101"];

export function getOralSeries(id: string): OralSeries | undefined {
  if (ORAL_SERIES_MAP[id]) return ORAL_SERIES_MAP[id];
  const numMatch = id.match(/\d+/);
  if (numMatch && ORAL_SERIES_MAP[numMatch[0]]) {
    return ORAL_SERIES_MAP[numMatch[0]];
  }
  return ORAL_SERIES_MAP["101"];
}

export function listOralSeries(): OralSeries[] {
  return [
    ORAL_SERIES_MAP["101"],
    ORAL_SERIES_MAP["102"],
    ORAL_SERIES_MAP["103"],
    ORAL_SERIES_MAP["104"],
    ORAL_SERIES_MAP["105"],
  ];
}
