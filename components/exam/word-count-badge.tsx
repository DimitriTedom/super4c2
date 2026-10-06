"use client";

import React from "react";
import { CheckCircle2, AlertCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WordCountBadgeProps {
  current: number;
  min: number;
  max: number;
  className?: string;
}

export function WordCountBadge({ current, min, max, className }: WordCountBadgeProps) {
  const isUnder = current < min;
  const isOver = current > max;
  const isValid = !isUnder && !isOver;

  let badgeColor = "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  let icon = <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />;
  let label = "Volume conforme";

  if (current === 0) {
    badgeColor = "border-slate-500/20 bg-muted text-muted-foreground";
    icon = <AlertCircle className="h-4 w-4 shrink-0" />;
    label = "Non commencé";
  } else if (isUnder) {
    const diff = min - current;
    badgeColor = "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400";
    icon = <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />;
    label = `Encore ${diff} mot${diff > 1 ? "s" : ""} min.`;
  } else if (isOver) {
    const diff = current - max;
    badgeColor = "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400";
    icon = <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />;
    label = `+${diff} mot${diff > 1 ? "s" : ""} (limite : ${max})`;
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs font-semibold tabular-nums transition-colors duration-200",
        badgeColor,
        className
      )}
    >
      {icon}
      <span>
        {current} / {min}-{max} mots
      </span>
      <span className="hidden sm:inline font-sans font-normal opacity-80">· {label}</span>
    </div>
  );
}
