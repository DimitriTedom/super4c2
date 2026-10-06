export interface WrittenTask {
  taskNumber: 1 | 2 | 3;
  title: string;
  topic: string;
  context?: string;
  minWords: number;
  maxWords: number;
  suggestedDurationMinutes: number;
}

export interface WrittenExamSeries {
  id: string;
  seriesNumber: number;
  title: string;
  durationSeconds: number; // 60 min = 3600s
  tasks: [WrittenTask, WrittenTask, WrittenTask];
}

export interface FeiCriterionScore {
  criterion: "adequation" | "coherence" | "lexique" | "morphosyntaxe";
  label: string;
  score: number; // sur 5
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export interface TaskEvaluation {
  taskNumber: 1 | 2 | 3;
  wordCount: number;
  wordCountStatus: "under" | "valid" | "over";
  taskScore: number; // sur 20
  nclcEstimatedLevel: number; // 4 à 10
  criteria: FeiCriterionScore[];
  generalFeedback: string;
  magicRewriteC2: string;
  rewriteHighlights: string[];
}

export interface WrittenExamResult {
  totalScore: number; // Moyenne pondérée sur 20
  tcfScaledScore: number; // 100 à 699
  nclcLevel: number; // 4 à 10
  crsPointsUnlocked: number; // 0 ou 50
  taskEvaluations: TaskEvaluation[];
}

/**
 * Calculateur officiel FEI du nombre de mots :
 * Sépare par espaces et apostrophes (ex: "J'ai" -> 2 mots).
 */
export function countWordsFei(text: string): number {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/[\s'’]+/).filter(Boolean).length;
}
