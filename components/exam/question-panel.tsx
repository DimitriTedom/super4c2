"use client";

import { Flag, Check, X, Sparkles, HelpCircle, CheckCircle2 } from "lucide-react";
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
  /** Practice mode capabilities */
  mode?: "exam" | "practice";
  revealed?: boolean;
  onReveal?: () => void;
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

/** Question + A/B/C/D options, accessible as a radiogroup with keyboard indicators and practice mode feedback */
export function QuestionPanel({
  question,
  index,
  total,
  selected,
  flagged,
  disabled,
  onSelect,
  onToggleFlag,
  mode = "exam",
  revealed = false,
  onReveal,
}: QuestionPanelProps) {
  const levelMeta = getQuestionLevelMeta(question.questionNumber, question.nclcTargetLevel);
  const isPractice = mode === "practice";

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
          {isPractice && (
            <span className="rounded bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400 border border-amber-500/30">
              Didactique
            </span>
          )}
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

      {/* Official Institutional Blue Question Bar */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white p-5 sm:p-6 shadow-md flex items-start gap-4 border border-blue-600/30">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md font-mono text-base font-black text-white shadow-inner border border-white/20">
          {question.questionNumber}
        </span>
        <h2 className="text-base sm:text-lg font-bold leading-snug tracking-tight text-white flex-1 pt-1">
          {question.prompt}
        </h2>
      </div>

      {/* Options A / B / C / D */}
      <div role="radiogroup" aria-label="Propositions de réponse" className="space-y-3">
        {OPTION_KEYS.map((key) => {
          if (!question.options || !question.options[key]) return null;
          const active = selected === key;
          const isCorrect = key === question.correctOption;
          const isSelectedWrong = active && !isCorrect && revealed;

          // Dynamic styling based on Exam vs Practice Revealed state
          let optionBorderBg = "border-border/80 bg-card hover:border-emerald-500/60 hover:bg-emerald-500/[0.03]";
          let letterPill = "border-muted-foreground/30 bg-muted/40 text-muted-foreground";

          if (isPractice && revealed) {
            if (isCorrect) {
              optionBorderBg = "border-emerald-500 bg-emerald-500/15 ring-2 ring-emerald-500/40 text-emerald-950 dark:text-emerald-100";
              letterPill = "border-emerald-600 bg-emerald-600 text-white shadow-sm";
            } else if (isSelectedWrong) {
              optionBorderBg = "border-rose-500 bg-rose-500/15 ring-2 ring-rose-500/40 text-rose-950 dark:text-rose-100";
              letterPill = "border-rose-600 bg-rose-600 text-white shadow-sm";
            } else {
              optionBorderBg = "border-border/40 bg-card/60 opacity-60";
            }
          } else if (active) {
            optionBorderBg = "border-emerald-600 bg-emerald-500/10 shadow-sm ring-1 ring-emerald-500/40";
            letterPill = "border-emerald-600 bg-emerald-600 text-white shadow-sm";
          }

          return (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={disabled || (isPractice && revealed)}
              onClick={() => onSelect(key)}
              className={cn(
                "group relative flex w-full items-start gap-3.5 rounded-xl border p-4 text-left transition-all",
                optionBorderBg,
                disabled && "cursor-default opacity-80",
              )}
            >
              {/* Option Letter Pill */}
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border font-mono text-sm font-bold transition-colors",
                  letterPill,
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

              {/* Status Indicator */}
              {isPractice && revealed ? (
                isCorrect ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                    <CheckCircle2 className="h-5 w-5 fill-emerald-500 text-white" />
                    <span className="hidden sm:inline">Bonne réponse</span>
                  </span>
                ) : isSelectedWrong ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 shrink-0">
                    <X className="h-5 w-5 stroke-[3] text-rose-600" />
                    <span className="hidden sm:inline">Votre choix</span>
                  </span>
                ) : null
              ) : (
                active && (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </span>
                )
              )}
            </button>
          );
        })}
      </div>

      {/* Practice Mode: Instant Check Button */}
      {isPractice && selected && !revealed && (
        <div className="pt-1">
          <Button
            onClick={onReveal}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold py-2.5 rounded-xl shadow-md gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Vérifier la réponse &amp; Décoder les pièges
          </Button>
        </div>
      )}

      {/* Practice Mode: Didactic Feedback Card */}
      {isPractice && revealed && (
        <div className="rounded-2xl border border-border/80 bg-muted/40 p-4 sm:p-5 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <HelpCircle className="h-4 w-4" />
            <span>Explication Didactique Officielle</span>
          </div>

          <p className="text-sm text-foreground/90 leading-relaxed font-medium">
            {question.explanation}
          </p>

          {question.trapAnalysis && (
            <div className="pt-2 border-t border-border/50">
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 block mb-1">
                ⚠️ Analyse des pièges FEI :
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed italic">
                {question.trapAnalysis}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Keyboard reminder footer */}
      <div className="flex items-center justify-between text-[11px] text-muted-foreground/80 pt-1">
        <span>Raccourcis : Touches <kbd className="rounded border bg-muted px-1 font-mono text-[10px]">A</kbd> <kbd className="rounded border bg-muted px-1 font-mono text-[10px]">B</kbd> <kbd className="rounded border bg-muted px-1 font-mono text-[10px]">C</kbd> <kbd className="rounded border bg-muted px-1 font-mono text-[10px]">D</kbd></span>
        <span>Navigation : <kbd className="rounded border bg-muted px-1 font-mono text-[10px]">←</kbd> <kbd className="rounded border bg-muted px-1 font-mono text-[10px]">→</kbd></span>
      </div>
    </div>
  );
}
