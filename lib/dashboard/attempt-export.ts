import { generateExamReportPdf } from "@/lib/exam/export-pdf";
import { generateOralExamReportPdf } from "@/lib/exam/export-pdf-oral";
import type { WrittenExamResult } from "@/lib/exam/written-types";
import {
  getAttemptDate,
  getDisciplineMeta,
  getTaskEvaluations,
  parseAnswers,
  parseFeedback,
  parseOralFeedback,
  parseOralDialogues,
  type UserAttemptFull,
} from "./attempt-utils";

export async function exportAttemptPdf(attempt: UserAttemptFull): Promise<void> {
  const date = getAttemptDate(attempt).toLocaleDateString("fr-FR");

  // Cas 1 : Expression Orale (EO)
  if (attempt.discipline === "EXPRESSION_ORALE") {
    const oralEval = parseOralFeedback(attempt) ?? {
      totalScore: attempt.rawScore || 0,
      tcfScaledScore: attempt.tcfScaledScore || 100,
      nclcLevel: attempt.nclcLevel || 4,
      crsPointsUnlocked: attempt.crsPointsUnlocked || 0,
      wordsPerMinute: 0,
      criteria: [
        { criterion: "fluidite", label: "Aisance & Débit d'Élocution", score: 2.5, feedback: "Production orale enregistrée." },
        { criterion: "phonologie", label: "Compétence Phonologique & Intonation", score: 2.5, feedback: "Prononciation intelligible." },
        { criterion: "lexique", label: "Richesse & Précision Lexicale", score: 2.5, feedback: "Vocabulaire adapté." },
        { criterion: "morphosyntaxe", label: "Morphosyntaxe & Variété des Structures", score: 2.5, feedback: "Structures simples correctes." },
        { criterion: "interaction", label: "Capacité d'Interaction & Réactivité", score: 2.5, feedback: "Interaction assurée avec l'examinateur." },
      ],
      examinerDebrief: "Bilan officiel de simulation d'Expression Orale Super4C2.",
      recommendedPhrasesC2: [
        "« Pourriez-vous m'éclairer davantage sur ce point ? »",
        "« Force est de constater que les retombées sont contrastées... »",
      ],
    };

    const dialogues = parseOralDialogues(attempt);

    await generateOralExamReportPdf({
      attemptId: attempt.id,
      seriesNumber: 1,
      evaluation: oralEval,
      dialogues,
      dateStr: date,
    });
    return;
  }

  // Cas 2 : Expression Écrite (EE) ou défaut
  const evaluations = getTaskEvaluations(attempt);
  const result: WrittenExamResult = parseFeedback(attempt) ?? {
    totalScore: attempt.rawScore || 0,
    tcfScaledScore: attempt.tcfScaledScore || 100,
    nclcLevel: attempt.nclcLevel || 4,
    crsPointsUnlocked: attempt.crsPointsUnlocked || 0,
    taskEvaluations: evaluations,
  };

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
