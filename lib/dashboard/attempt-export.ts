import { generateExamReportPdf } from "@/lib/exam/export-pdf";
import type { WrittenExamResult } from "@/lib/exam/written-types";
import {
  getAttemptDate,
  getDisciplineMeta,
  getTaskEvaluations,
  parseAnswers,
  parseFeedback,
  type UserAttemptFull,
} from "./attempt-utils";

export async function exportAttemptPdf(attempt: UserAttemptFull): Promise<void> {
  const evaluations = getTaskEvaluations(attempt);
  const result: WrittenExamResult = parseFeedback(attempt) ?? {
    totalScore: attempt.rawScore || 0,
    tcfScaledScore: attempt.tcfScaledScore || 100,
    nclcLevel: attempt.nclcLevel || 4,
    crsPointsUnlocked: attempt.crsPointsUnlocked || 0,
    taskEvaluations: evaluations,
  };
  const date = getAttemptDate(attempt).toLocaleDateString("fr-FR");

  await generateExamReportPdf({
    series: {
      id: attempt.id,
      seriesNumber: 1,
      title: `${getDisciplineMeta(attempt.discipline).label} — ${date}`,
      durationSeconds: 3600,
      tasks: [
        { taskNumber: 1, title: "Message / Courriel", topic: "", minWords: 60, maxWords: 120, suggestedDurationMinutes: 15 },
        { taskNumber: 2, title: "Récit d'expérience", topic: "", minWords: 120, maxWords: 150, suggestedDurationMinutes: 20 },
        { taskNumber: 3, title: "Argumentation & débat", topic: "", minWords: 120, maxWords: 180, suggestedDurationMinutes: 25 },
      ],
    },
    result,
    texts: parseAnswers(attempt),
  });
}
