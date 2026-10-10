import type { ExamQuestion, ExamSeriesData } from "./types";

export type IeltsQuestionType =
  | "multiple_choice"
  | "true_false_not_given"
  | "yes_no_not_given"
  | "matching_headings"
  | "sentence_completion";

export interface IeltsQuestion extends ExamQuestion {
  sectionNumber: 1 | 2 | 3 | 4;
  ieltsType: IeltsQuestionType;
  targetBandScore?: number; // e.g. 6.0, 7.0, 8.0, 9.0
}

export interface IeltsSeriesData extends ExamSeriesData {
  testType: "ielts";
  track: "general" | "academic";
  edition: string; // e.g. "Cambridge IELTS 18"
  testNumber: number; // e.g. 1
  writingTasks?: {
    task1: {
      type: "letter";
      prompt: string;
      situation: string;
      bulletPoints: string[];
      minWords: 150;
    };
    task2: {
      type: "essay";
      prompt: string;
      topic: string;
      minWords: 250;
    };
  };
  speakingTasks?: {
    part1: {
      topic: string;
      questions: string[];
    };
    part2: {
      cueCardTopic: string;
      bulletPoints: string[];
      prepSeconds: 60;
      speechSeconds: 120;
    };
    part3: {
      theme: string;
      questions: string[];
    };
  };
}

/**
 * Official IELTS General Training to Canadian CLB (Canadian Language Benchmark) converter.
 * Based on Immigration, Refugees and Citizenship Canada (IRCC) official score equivalency table.
 */
export function convertIeltsRawScoreToBand(
  rawScore: number,
  discipline: "reading_general" | "listening"
): number {
  if (discipline === "reading_general") {
    // 40 questions total
    if (rawScore >= 39) return 9.0;
    if (rawScore >= 37) return 8.5;
    if (rawScore >= 36) return 8.0;
    if (rawScore >= 34) return 7.5;
    if (rawScore >= 32) return 7.0; // CLB 9 threshold
    if (rawScore >= 30) return 6.5; // CLB 8 threshold
    if (rawScore >= 27) return 6.0; // CLB 7 threshold
    if (rawScore >= 23) return 5.5; // CLB 6
    if (rawScore >= 19) return 5.0; // CLB 5
    if (rawScore >= 15) return 4.5; // CLB 4
    if (rawScore >= 12) return 4.0;
    return 3.5;
  } else {
    // Listening (same scale Academic & General)
    if (rawScore >= 39) return 9.0;
    if (rawScore >= 37) return 8.5;
    if (rawScore >= 35) return 8.0; // CLB 9 threshold (8.0!)
    if (rawScore >= 32) return 7.5; // CLB 8 threshold
    if (rawScore >= 30) return 7.0; // CLB 7 threshold
    if (rawScore >= 26) return 6.5;
    if (rawScore >= 23) return 6.0;
    if (rawScore >= 18) return 5.5;
    if (rawScore >= 16) return 5.0;
    if (rawScore >= 13) return 4.5;
    if (rawScore >= 10) return 4.0;
    return 3.5;
  }
}

export function convertBandScoreToClb(
  bandScore: number,
  discipline: "reading_general" | "listening" | "writing" | "speaking"
): number {
  if (discipline === "reading_general") {
    if (bandScore >= 8.0) return 10;
    if (bandScore >= 7.0) return 9; // CLB 9
    if (bandScore >= 6.5) return 8; // CLB 8
    if (bandScore >= 6.0) return 7; // CLB 7 (Federal minimum)
    if (bandScore >= 5.0) return 6;
    if (bandScore >= 4.0) return 5;
    return 4;
  } else if (discipline === "listening") {
    if (bandScore >= 8.5) return 10;
    if (bandScore >= 8.0) return 9; // CLB 9 (requires 8.0 in listening!)
    if (bandScore >= 7.5) return 8; // CLB 8
    if (bandScore >= 6.0) return 7; // CLB 7
    if (bandScore >= 5.5) return 6;
    if (bandScore >= 5.0) return 5;
    return 4;
  } else {
    // Writing and Speaking
    if (bandScore >= 7.5) return 10;
    if (bandScore >= 7.0) return 9; // CLB 9
    if (bandScore >= 6.5) return 8; // CLB 8
    if (bandScore >= 6.0) return 7; // CLB 7
    if (bandScore >= 5.5) return 6;
    if (bandScore >= 5.0) return 5;
    return 4;
  }
}
