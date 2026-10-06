export type OralTaskType = "task1_presentation" | "task2_roleplay" | "task3_opinion";

export interface OralTask {
  taskNumber: 1 | 2 | 3;
  type: OralTaskType;
  title: string;
  durationSeconds: number; // Tâche 1: 120s, Tâche 2: 210s, Tâche 3: 270s
  examinerPrompt: string;
  roleplayScenario?: {
    candidatRole: string;
    examinerRole: string;
    situation: string;
    objectives: string[];
  };
}

export interface OralSeries {
  id: string;
  seriesNumber: number;
  title: string;
  tasks: [OralTask, OralTask, OralTask];
}

export interface OralDialogueMessage {
  id: string;
  sender: "examiner" | "candidate";
  text: string;
  timestamp: number;
}

export interface OralCriterionScore {
  criterion: "fluidite" | "phonologie" | "lexique" | "morphosyntaxe" | "interaction";
  label: string;
  score: number; // sur 4
  feedback: string;
}

export interface OralExamEvaluation {
  totalScore: number; // sur 20
  tcfScaledScore: number; // 100 à 699
  nclcLevel: number; // 4 à 10
  crsPointsUnlocked: number; // 0 ou 50
  wordsPerMinute: number;
  criteria: OralCriterionScore[];
  examinerDebrief: string;
  recommendedPhrasesC2: string[];
}
