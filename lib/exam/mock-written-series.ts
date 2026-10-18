import type { WrittenExamSeries, WrittenTask } from "./written-types";
import { MULTI_SERIES_EE } from "./multi-series-data";

export const MOCK_WRITTEN_SERIES_101: WrittenExamSeries = {
  id: "demo-101-ee",
  seriesNumber: 101,
  title: "TCF Canada — Expression Écrite, Sujet 101 (Officiel)",
  durationSeconds: 60 * 60, // 60 minutes
  tasks: MULTI_SERIES_EE[0].tasks.map((t) => ({
    taskNumber: t.taskNumber as 1 | 2 | 3,
    title: t.title,
    minWords: t.minWords,
    maxWords: t.maxWords,
    suggestedDurationMinutes: t.suggestedDurationMinutes,
    topic: t.topic,
    context: t.context,
  })) as [WrittenTask, WrittenTask, WrittenTask],
};

const WRITTEN_SERIES_MAP: Record<string, WrittenExamSeries> = {};

// Initialisation de toutes les séries 101 à 105 avec alias
for (const s of MULTI_SERIES_EE) {
  const seriesObj: WrittenExamSeries = {
    id: `serie-${s.seriesNumber}-ee`,
    seriesNumber: s.seriesNumber,
    title: s.title,
    durationSeconds: s.durationSeconds,
    tasks: s.tasks.map((t) => ({
      taskNumber: t.taskNumber as 1 | 2 | 3,
      title: t.title,
      minWords: t.minWords,
      maxWords: t.maxWords,
      suggestedDurationMinutes: t.suggestedDurationMinutes,
      topic: t.topic,
      context: t.context,
    })) as [WrittenTask, WrittenTask, WrittenTask],
  };

  WRITTEN_SERIES_MAP[seriesObj.id] = seriesObj;
  WRITTEN_SERIES_MAP[`serie-${s.seriesNumber}`] = seriesObj;
  WRITTEN_SERIES_MAP[`${s.seriesNumber}`] = seriesObj;
  WRITTEN_SERIES_MAP[`demo-${s.seriesNumber}`] = seriesObj;
  WRITTEN_SERIES_MAP[`demo-${s.seriesNumber}-ee`] = seriesObj;
}

// Alias historique 101
WRITTEN_SERIES_MAP["demo-101-ee"] = WRITTEN_SERIES_MAP["101"];
WRITTEN_SERIES_MAP["demo-101-ce"] = WRITTEN_SERIES_MAP["101"];
WRITTEN_SERIES_MAP["demo-101"] = WRITTEN_SERIES_MAP["101"];

export function getWrittenSeries(id: string): WrittenExamSeries | undefined {
  if (WRITTEN_SERIES_MAP[id]) return WRITTEN_SERIES_MAP[id];
  const numMatch = id.match(/\d+/);
  if (numMatch && WRITTEN_SERIES_MAP[numMatch[0]]) {
    return WRITTEN_SERIES_MAP[numMatch[0]];
  }
  return WRITTEN_SERIES_MAP["101"];
}

export function listWrittenSeries(): WrittenExamSeries[] {
  return [
    WRITTEN_SERIES_MAP["101"],
    WRITTEN_SERIES_MAP["102"],
    WRITTEN_SERIES_MAP["103"],
    WRITTEN_SERIES_MAP["104"],
    WRITTEN_SERIES_MAP["105"],
  ];
}
