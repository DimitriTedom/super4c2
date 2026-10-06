"use client";

import { Flag } from "lucide-react";
import type { AnswersMap, ExamQuestion, NavFilter } from "@/lib/exam/types";
import { cn } from "@/lib/utils";

const FILTERS: { id: NavFilter; label: string }[] = [
  { id: "all", label: "Toutes" },
  { id: "answered", label: "Répondues" },
  { id: "unanswered", label: "Non répondues" },
  { id: "flagged", label: "Signalées" },
];

interface QuestionNavGridProps {
  questions: ExamQuestion[];
  answers: AnswersMap;
  current: number;
  filter: NavFilter;
  onFilter: (f: NavFilter) => void;
  onSelect: (index: number) => void;
}

export function QuestionNavGrid({
  questions,
  answers,
  current,
  filter,
  onFilter,
  onSelect,
}: QuestionNavGridProps) {
  const visible = (q: ExamQuestion) => {
    const a = answers[q.id];
    switch (filter) {
      case "answered":
        return !!a?.selected;
      case "unanswered":
        return !a?.selected;
      case "flagged":
        return !!a?.flagged;
      default:
        return true;
    }
  };

  return (
    <nav aria-label="Navigation des questions" className="border-t bg-card px-4 py-3 sm:px-6">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => onFilter(f.id)}
            aria-pressed={filter === f.id}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              filter === f.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/70",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
      <ol className="flex flex-wrap gap-1.5">
        {questions.map((q, i) => {
          if (!visible(q)) return null;
          const a = answers[q.id];
          return (
            <li key={q.id}>
              <button
                type="button"
                onClick={() => onSelect(i)}
                aria-label={`Question ${q.questionNumber}${a?.selected ? ", répondue" : ""}${a?.flagged ? ", signalée" : ""}`}
                aria-current={i === current ? "step" : undefined}
                className={cn(
                  "relative flex h-9 w-9 items-center justify-center rounded-lg border font-mono text-sm font-semibold tabular-nums transition-all",
                  a?.selected
                    ? "border-cyan-600 bg-cyan-600 text-white"
                    : "bg-background text-muted-foreground hover:border-primary",
                  i === current && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                )}
              >
                {q.questionNumber}
                {a?.flagged && (
                  <Flag
                    aria-hidden
                    className="absolute -right-1 -top-1 h-3.5 w-3.5 fill-amber-400 text-amber-500"
                  />
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
