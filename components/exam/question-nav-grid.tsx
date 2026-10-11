"use client";

import { Flag } from "lucide-react";
import type { AnswersMap, ExamQuestion, NavFilter } from "@/lib/exam/types";
import { cn } from "@/lib/utils";

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
  const answeredCount = questions.filter((q) => answers[q.id]?.selected).length;
  const unansweredCount = questions.length - answeredCount;
  const flaggedCount = questions.filter((q) => answers[q.id]?.flagged).length;

  const filters: { id: NavFilter; label: string; count: number }[] = [
    { id: "all", label: "Toutes", count: questions.length },
    { id: "answered", label: "Répondues", count: answeredCount },
    { id: "unanswered", label: "Non répondues", count: unansweredCount },
    { id: "flagged", label: "Signalées", count: flaggedCount },
  ];

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
      {/* Top Filter Buttons with Counts */}
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => onFilter(f.id)}
              aria-pressed={filter === f.id}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                filter === f.id
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "bg-muted text-muted-foreground hover:bg-muted/70",
              )}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>

        {/* Legend Hint */}
        <div className="hidden sm:flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1 font-medium">
            <span className="h-2.5 w-2.5 rounded bg-emerald-600" /> Répondue
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded border bg-background" /> Non répondue
          </span>
          <span className="flex items-center gap-1">
            <Flag className="h-3 w-3 fill-amber-400 text-amber-500" /> Signalée
          </span>
        </div>
      </div>

      {/* 39-Pill Grid */}
      <ol className="flex flex-wrap items-center gap-1 sm:gap-1.5 max-h-24 sm:max-h-none overflow-y-auto sm:overflow-visible pr-1 sm:pr-0">
        {questions.map((q, i) => {
          if (!visible(q)) return null;
          const a = answers[q.id];
          const isAnswered = !!a?.selected;
          const isCurrent = i === current;
          const isFlagged = !!a?.flagged;

          return (
            <li key={q.id}>
              <button
                type="button"
                onClick={() => onSelect(i)}
                aria-label={`Question ${q.questionNumber}${isAnswered ? `, répondue (${a.selected})` : ""}${isFlagged ? ", signalée" : ""}`}
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "relative flex h-8 w-8 sm:h-8 sm:w-8 lg:h-8.5 lg:w-8.5 xl:h-9 xl:w-9 items-center justify-center rounded-lg border font-mono text-xs sm:text-xs xl:text-sm font-semibold tabular-nums transition-all cursor-pointer",
                  isAnswered
                    ? "border-emerald-600 bg-emerald-600 text-white shadow-xs font-bold"
                    : "border-border/80 bg-background text-muted-foreground hover:border-emerald-500/50 hover:text-foreground",
                  isCurrent && "ring-2 ring-blue-600 ring-offset-2 ring-offset-background font-black scale-105 z-10",
                )}
              >
                {q.questionNumber}
                {isFlagged && (
                  <Flag
                    aria-hidden
                    className="absolute -right-1 -top-1 h-3.5 w-3.5 fill-amber-400 text-amber-500 drop-shadow-xs"
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
