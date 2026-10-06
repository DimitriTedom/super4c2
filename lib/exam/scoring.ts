import type { AnswersMap, ExamDiscipline, ExamQuestion, ExamResult } from "./types";

/**
 * NCLC thresholds on the 100-699 TCF scale (minimum score per level).
 * Approximation of the IRCC equivalence table; verify before commercial use.
 */
const NCLC_MIN: Record<ExamDiscipline, [number, number][]> = {
  CE: [
    [549, 10],
    [524, 9],
    [499, 8],
    [453, 7],
    [406, 6],
    [375, 5],
    [342, 4],
  ],
  CO: [
    [549, 10],
    [523, 9],
    [503, 8],
    [458, 7],
    [398, 6],
    [369, 5],
    [331, 4],
  ],
};

/** Linear estimate of the TCF scaled score (100-699) from a raw score. */
export function rawToScaled(raw: number, total: number): number {
  if (total <= 0) return 100;
  return Math.round(100 + (raw / total) * 599);
}

/** Returns NCLC level 0 (below NCLC 4) to 10. */
export function scaledToNclc(scaled: number, discipline: ExamDiscipline): number {
  for (const [min, level] of NCLC_MIN[discipline]) {
    if (scaled >= min) return level;
  }
  return 0;
}

export function computeResult(
  questions: ExamQuestion[],
  answers: AnswersMap,
  discipline: ExamDiscipline,
): ExamResult {
  const rawScore = questions.reduce(
    (acc, q) => acc + (answers[q.id]?.selected === q.correctOption ? 1 : 0),
    0,
  );
  const tcfScaledScore = rawToScaled(rawScore, questions.length);
  return {
    rawScore,
    total: questions.length,
    tcfScaledScore,
    nclcLevel: scaledToNclc(tcfScaledScore, discipline),
  };
}

/** Express Entry bonus: NCLC 7+ unlocks the first-language CRS points tier. */
export function crsBonusForNclc(nclc: number): number {
  return nclc >= 7 ? 50 : 0;
}
