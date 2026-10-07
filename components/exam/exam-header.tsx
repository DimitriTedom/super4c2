"use client";

import { useState } from "react";
import { Clock, Flag } from "lucide-react";
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
}: ExamHeaderProps) {
  const [open, setOpen] = useState(false);
  const urgent = remaining <= 300;
  const critical = remaining <= 60;
  const answered = Math.max(0, total - unanswered);
  const progressPercent = Math.round((answered / total) * 100);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-card px-4 sm:px-6">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
          {discipline} · Simulateur Officiel FEI
        </p>
        <h1 className="truncate font-display text-sm font-bold sm:text-base">{title}</h1>
      </div>

      {/* Center: Timer & Progress Bar */}
      <div className="flex items-center gap-4">
        <div
          role="timer"
          aria-live="off"
          className={cn(
            "flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-lg sm:text-xl font-bold tabular-nums transition-colors shadow-sm",
            urgent && "border-orange-500/50 bg-orange-500/10 text-orange-600 animate-pulse",
            critical && "animate-pulse border-red-500/60 bg-red-500/10 text-red-600",
            !urgent && !critical && "border-border/80 bg-background text-foreground",
          )}
        >
          <Clock className="h-4 w-4 text-muted-foreground" aria-hidden />
          {formatClock(remaining)}
        </div>

        <div className="hidden md:flex flex-col items-end gap-1">
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
        className="font-semibold"
        variant={unanswered === 0 ? "default" : "outline"}
      >
        Terminer l&apos;épreuve
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Terminer l&apos;épreuve de Compréhension Écrite ?</DialogTitle>
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
