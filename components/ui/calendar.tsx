"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface CalendarProps {
  selected?: Date | null;
  onSelect?: (date: Date | undefined) => void;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
}

const MONTH_NAMES = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const DAY_NAMES = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];

export function Calendar({
  selected,
  onSelect,
  className,
  minDate,
  maxDate,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(() => {
    return selected ? new Date(selected.getFullYear(), selected.getMonth(), 1) : new Date();
  });

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  // Calculate days in month
  const firstDayOfMonth = new Date(year, month, 1);
  // Get day of week (0 is Sunday in JS, we want 0 to be Monday)
  let startingDayIndex = firstDayOfMonth.getDay() - 1;
  if (startingDayIndex === -1) startingDayIndex = 6;

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  const isSameDay = (d1?: Date | null, d2?: Date | null) => {
    if (!d1 || !d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const isToday = (d: Date) => isSameDay(d, new Date());

  const isDateDisabled = (d: Date) => {
    if (minDate && d < new Date(minDate.setHours(0, 0, 0, 0))) return true;
    if (maxDate && d > new Date(maxDate.setHours(23, 59, 59, 999))) return true;
    return false;
  };

  return (
    <div className={cn("p-3 select-none space-y-3", className)}>
      {/* Month & Year Navigation */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold font-display text-foreground">
          {MONTH_NAMES[month]} {year}
        </span>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handlePrevMonth}
            className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleNextMonth}
            className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {DAY_NAMES.map((name) => (
          <span
            key={name}
            className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider py-1"
          >
            {name}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells before first day */}
        {Array.from({ length: startingDayIndex }).map((_, idx) => (
          <div key={`empty-${idx}`} className="h-8 w-8" />
        ))}

        {days.map((date) => {
          const isSelected = isSameDay(selected, date);
          const currentIsToday = isToday(date);
          const disabled = isDateDisabled(date);

          return (
            <button
              key={date.toISOString()}
              type="button"
              disabled={disabled}
              onClick={() => onSelect?.(isSelected ? undefined : date)}
              className={cn(
                "h-8 w-8 rounded-lg text-xs font-medium transition-all flex items-center justify-center relative",
                isSelected
                  ? "bg-brand-crimson text-white font-bold shadow-xs hover:bg-brand-crimson/90"
                  : currentIsToday
                  ? "bg-primary/10 text-primary font-bold border border-primary/30"
                  : "text-foreground hover:bg-muted/80",
                disabled && "opacity-30 cursor-not-allowed hover:bg-transparent"
              )}
            >
              {date.getDate()}
              {currentIsToday && !isSelected && (
                <span className="absolute bottom-1 h-0.5 w-0.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
