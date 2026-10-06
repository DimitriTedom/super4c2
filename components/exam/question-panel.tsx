"use client";

import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OPTION_KEYS, type ExamQuestion, type OptionKey } from "@/lib/exam/types";
import { cn } from "@/lib/utils";

interface QuestionPanelProps {
  question: ExamQuestion;
  index: number;
  total: number;
  selected?: OptionKey;
  flagged: boolean;
  disabled?: boolean;
  onSelect: (o: OptionKey) => void;
  onToggleFlag: () => void;
}

/** Question + A/B/C/D options, accessible as a radiogroup (arrow keys native via buttons+tab). */
export function QuestionPanel({
  question,
  index,
  total,
  selected,
  flagged,
  disabled,
  onSelect,
  onToggleFlag,
}: QuestionPanelProps) {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm font-bold tabular-nums text-muted-foreground">
          Question {index + 1} / {total}
        </span>
        <Button
          variant={flagged ? "secondary" : "ghost"}
          size="sm"
          disabled={disabled}
          onClick={onToggleFlag}
          aria-pressed={flagged}
        >
          <Flag
            className={cn("mr-1.5 h-4 w-4", flagged && "fill-amber-400 text-amber-500")}
            aria-hidden
          />
          {flagged ? "Signalée" : "Réviser plus tard"}
        </Button>
      </div>

      <h2 className="font-display text-xl font-semibold leading-snug">{question.prompt}</h2>

      <div role="radiogroup" aria-label="Propositions de réponse" className="space-y-3">
        {OPTION_KEYS.map((key) => {
          const active = selected === key;
          return (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={disabled}
              onClick={() => onSelect(key)}
              className={cn(
                "flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all",
                "hover:border-primary/60 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                active && "border-primary bg-primary/5 shadow-sm",
                disabled && "cursor-default opacity-80",
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-sm font-bold",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "text-muted-foreground",
                )}
              >
                {key}
              </span>
              <span className="pt-0.5">{question.options[key]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
