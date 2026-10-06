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
  disabled?: boolean;
  onFinish: () => void;
}

export function ExamHeader({
  title,
  discipline,
  remaining,
  unanswered,
  flagged,
  disabled,
  onFinish,
}: ExamHeaderProps) {
  const [open, setOpen] = useState(false);
  const urgent = remaining <= 300;
  const critical = remaining <= 60;

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-card px-4 sm:px-6">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {discipline}
        </p>
        <h1 className="truncate font-display text-base font-bold sm:text-lg">{title}</h1>
      </div>

      <div
        role="timer"
        aria-live="off"
        className={cn(
          "flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-xl font-bold tabular-nums transition-colors",
          urgent && "border-orange-500/50 bg-orange-500/10 text-orange-600",
          critical && "animate-pulse border-red-500/60 bg-red-500/10 text-red-600",
        )}
      >
        <Clock className="h-4 w-4" aria-hidden />
        {formatClock(remaining)}
      </div>

      <Button disabled={disabled} onClick={() => setOpen(true)}>
        Terminer
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Terminer l&apos;épreuve ?</DialogTitle>
            <DialogDescription>
              Cette action est définitive : vous ne pourrez plus modifier vos réponses.
            </DialogDescription>
          </DialogHeader>
          <ul className="space-y-1 text-sm">
            <li className={cn(unanswered > 0 && "font-semibold text-orange-600")}>
              {unanswered} question{unanswered > 1 ? "s" : ""} sans réponse
            </li>
            <li className="flex items-center gap-1">
              <Flag className="h-3.5 w-3.5 text-amber-500" aria-hidden /> {flagged} marquée
              {flagged > 1 ? "s" : ""} pour révision
            </li>
          </ul>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Continuer l&apos;épreuve
            </Button>
            <Button
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
