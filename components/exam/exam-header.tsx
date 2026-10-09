"use client";

import { useState } from "react";
import { Clock, Flag, Pause, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function formatClock(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

interface ExamHeaderProps {
  title: string;
  discipline: string;
  remaining: number;
  unanswered: number;
  flagged: number;
  total?: number;
  disabled?: boolean;
  onFinish: () => void;
  onGoToFirstUnanswered?: () => void;
  /** Practice mode capabilities */
  mode?: "exam" | "practice";
  onToggleMode?: () => void;
  isTimerPaused?: boolean;
  onTogglePauseTimer?: () => void;
}

export function ExamHeader({
  title,
  discipline,
  remaining,
  unanswered,
  flagged,
  total = 39,
  disabled,
  onFinish,
  onGoToFirstUnanswered,
  mode = "exam",
  onToggleMode,
  isTimerPaused = false,
  onTogglePauseTimer,
}: ExamHeaderProps) {
  const [open, setOpen] = useState(false);
  const urgent = remaining <= 300;
  const critical = remaining <= 60;
  const answered = Math.max(0, total - unanswered);
  const progressPercent = Math.round((answered / total) * 100);
  const isPractice = mode === "practice";

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b bg-card px-4 sm:px-6">
      <div className="min-w-0 flex items-center gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
              {discipline} · Simulateur CBT
            </p>

            {/* Mode Switcher Toggle Button */}
            {onToggleMode && (
              <button
                type="button"
                onClick={onToggleMode}
                className={cn(
                  "hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all border shadow-2xs",
                  isPractice
                    ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/25"
                    : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 hover:bg-blue-500/20"
                )}
                title="Cliquer pour basculer de mode"
              >
                {isPractice ? (
                  <>
                    <Sparkles className="h-3 w-3 text-amber-500" />
                    <span>Mode Entraînement</span>
                  </>
                ) : (
                  <>
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <span>Mode Examen Strict</span>
                  </>
                )}
              </button>
            )}
          </div>
          <h1 className="truncate font-display text-sm font-bold sm:text-base">{title}</h1>
        </div>
      </div>

      {/* Center: Timer & Progress Bar */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-1.5">
          <div
            role="timer"
            aria-live="off"
            className={cn(
              "flex items-center gap-2 rounded-full border px-3 sm:px-4 py-1 sm:py-1.5 font-mono text-base sm:text-xl font-bold tabular-nums transition-colors shadow-sm",
              isTimerPaused && "border-amber-500/50 bg-amber-500/10 text-amber-600",
              !isTimerPaused && urgent && "border-orange-500/50 bg-orange-500/10 text-orange-600 animate-pulse",
              !isTimerPaused && critical && "animate-pulse border-red-500/60 bg-red-500/10 text-red-600",
              !isTimerPaused && !urgent && !critical && "border-border/80 bg-background text-foreground",
            )}
          >
            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" aria-hidden />
            <span>{isTimerPaused ? "PAUSE" : formatClock(remaining)}</span>
          </div>

          {/* Pause/Resume button in Practice Mode */}
          {isPractice && onTogglePauseTimer && (
            <button
              type="button"
              onClick={onTogglePauseTimer}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border transition-all",
                isTimerPaused
                  ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                  : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              title={isTimerPaused ? "Reprendre le chronomètre" : "Mettre en pause le chronomètre"}
            >
              {isTimerPaused ? <Play className="h-3.5 w-3.5 fill-current" /> : <Pause className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>

        <div className="hidden lg:flex flex-col items-end gap-1">
          <span className="text-xs font-mono font-medium text-muted-foreground">
            {answered} / {total} répondues ({progressPercent}%)
          </span>
          <div className="h-1.5 w-28 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <Button
        disabled={disabled}
        onClick={() => setOpen(true)}
        className="font-semibold text-xs sm:text-sm"
        variant={unanswered === 0 ? "default" : "outline"}
      >
        Terminer l&apos;épreuve
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Terminer l&apos;épreuve de {discipline} ?</DialogTitle>
            <DialogDescription>
              Cette action est définitive : votre score officiel et votre niveau NCLC seront calculés immédiatement.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl border bg-muted/40 p-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Questions répondues :</span>
              <span className="font-mono font-bold text-foreground">{answered} / {total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Questions sans réponse :</span>
              <span className={cn("font-mono font-bold", unanswered > 0 ? "text-amber-600" : "text-emerald-600")}>
                {unanswered}
              </span>
            </div>
            {flagged > 0 && (
              <div className="flex items-center justify-between text-amber-600">
                <span className="flex items-center gap-1">
                  <Flag className="h-3.5 w-3.5" /> Questions marquées :
                </span>
                <span className="font-mono font-bold">{flagged}</span>
              </div>
            )}
          </div>

          {unanswered > 0 && (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              ⚠️ Attention : chaque question sans réponse rapporte 0 point. Il est toujours conseillé de répondre à toutes les questions au TCF Canada.
            </p>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {unanswered > 0 && onGoToFirstUnanswered ? (
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  onGoToFirstUnanswered();
                }}
              >
                Compléter les questions manquantes
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setOpen(false)}>
                Continuer l&apos;épreuve
              </Button>
            )}
            <Button
              variant="default"
              onClick={() => {
                setOpen(false);
                onFinish();
              }}
            >
              Confirmer et terminer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
