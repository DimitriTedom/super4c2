"use client";

import { Flag, Check } from "lucide-react";
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

function getQuestionLevelMeta(questionNumber: number, targetNclc?: number) {
  if (questionNumber <= 6) {
    return {
      cefr: "Niveau A1",
      nclc: "NCLC 3",
      label: "Découverte / Débutant",
      badgeClass: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    };
  }
  if (questionNumber <= 12) {
    return {
      cefr: "Niveau A2",
      nclc: targetNclc ? `NCLC ${targetNclc}` : "NCLC 4",
      label: "Élémentaire / Survie",
      badgeClass: "bg-teal-500/10 text-teal-600 border-teal-500/20",
    };
  }
  if (questionNumber <= 18) {
    return {
      cefr: "Niveau B1",
      nclc: "NCLC 6",
      label: "Intermédiaire",
      badgeClass: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    };
  }
  if (questionNumber <= 28) {
    return {
      cefr: "Niveau B2",
      nclc: "NCLC 7-8",
      label: "Avancé • Seuil Entrée Express (+50 pts CRS)",
      badgeClass: "bg-primary/10 text-primary border-primary/30 font-semibold",
    };
  }
  if (questionNumber <= 35) {
    return {
      cefr: "Niveau C1",
      nclc: "NCLC 9",
      label: "Autonome / Supérieur",
      badgeClass: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    };
  }
  return {
    cefr: "Niveau C2",
    nclc: "NCLC 10+",
    label: "Maîtrise / Excellence",
    badgeClass: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  };
}

/** Question + A/B/C/D options, accessible as a radiogroup with keyboard indicators */
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
  const levelMeta = getQuestionLevelMeta(question.questionNumber, question.nclcTargetLevel);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      {/* Top Header: Question count + Level badge + Flag button */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold tabular-nums text-foreground">
            Question {index + 1} <span className="text-muted-foreground font-normal">/ {total}</span>
          </span>
          <span
            className={cn(
              "inline-flex items-center rounded-md border px-2 py-0.5 text-xs",
              levelMeta.badgeClass,
            )}
            title={levelMeta.label}
          >
            {levelMeta.cefr} · {levelMeta.nclc}
          </span>
        </div>

        <Button
          variant={flagged ? "secondary" : "ghost"}
          size="sm"
          disabled={disabled}
          onClick={onToggleFlag}
          aria-pressed={flagged}
          className={cn(
            "transition-colors text-xs",
            flagged && "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30",
          )}
        >
          <Flag
            className={cn("mr-1.5 h-3.5 w-3.5", flagged ? "fill-amber-400 text-amber-500" : "text-muted-foreground")}
            aria-hidden
          />
          {flagged ? "Signalée" : "Marquer pour révision [F]"}
        </Button>
      </div>

      {/* Question Prompt */}
      <h2 className="font-display text-xl font-bold leading-snug tracking-tight text-foreground">
        {question.prompt}
      </h2>

      {/* Options A / B / C / D */}
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
                "group relative flex w-full items-start gap-3.5 rounded-xl border p-4 text-left transition-all",
                "hover:border-primary/60 hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                active
                  ? "border-primary bg-primary/8 shadow-sm ring-1 ring-primary/40"
                  : "border-border/80 bg-card",
                disabled && "cursor-default opacity-80",
              )}
            >
              {/* Option Letter Pill */}
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border font-mono text-sm font-bold transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-muted-foreground/30 bg-muted/40 text-muted-foreground group-hover:border-primary/50 group-hover:text-foreground",
                )}
              >
                {key}
              </span>

              {/* Option Text */}
              <span
                className={cn(
                  "flex-1 pt-0.5 text-sm sm:text-base leading-relaxed transition-colors",
                  active ? "font-semibold text-foreground" : "text-foreground/90",
                )}
              >
                {question.options[key]}
              </span>

              {/* Active check indicator */}
              {active && (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3 w-3 stroke-[3]" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Keyboard reminder footer */}
      <div className="flex items-center justify-between text-[11px] text-muted-foreground/80 pt-1">
        <span>Raccourcis : Touches <kbd className="rounded border bg-muted px-1 font-mono text-[10px]">A</kbd> <kbd className="rounded border bg-muted px-1 font-mono text-[10px]">B</kbd> <kbd className="rounded border bg-muted px-1 font-mono text-[10px]">C</kbd> <kbd className="rounded border bg-muted px-1 font-mono text-[10px]">D</kbd></span>
        <span>Navigation : <kbd className="rounded border bg-muted px-1 font-mono text-[10px]">←</kbd> <kbd className="rounded border bg-muted px-1 font-mono text-[10px]">→</kbd></span>
      </div>
    </div>
  );
}
