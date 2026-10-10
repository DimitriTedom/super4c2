export type OptionKey = "A" | "B" | "C" | "D";
export const OPTION_KEYS: OptionKey[] = ["A", "B", "C", "D"];

export type ExamDiscipline = "CE" | "CO";

export interface ExamQuestion {
  id: string;
  questionNumber: number;
  nclcTargetLevel?: number;
  documentText?: string;
  documentImageUrl?: string;
  audioUrl?: string;
  audioTranscript?: string;
  prompt: string;
  options: Partial<Record<OptionKey, string>>;
  correctOption: OptionKey;
  explanation: string;
  trapAnalysis?: string;
}

export interface ExamSeriesData {
  id: string;
  seriesNumber: number;
  title: string;
  discipline: ExamDiscipline;
  /** Official duration in seconds (CE 3600, CO 2400). */
  durationSeconds: number;
  questions: ExamQuestion[];
}

export interface AnswerState {
  selected?: OptionKey;
  flagged: boolean;
}

export type AnswersMap = Record<string, AnswerState>;

export type NavFilter = "all" | "answered" | "unanswered" | "flagged";

export interface ExamResult {
  rawScore: number;
  total: number;
  tcfScaledScore: number;
  nclcLevel: number;
  ieltsBandScore?: number;
  ieltsClbLevel?: number;
}

