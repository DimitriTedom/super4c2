import React from "react";
import { Loader2 } from "lucide-react";

export default function TestimonialsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Top Header Placeholder */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div className="space-y-2">
          <div className="h-7 w-64 rounded-lg bg-muted" />
          <div className="h-4 w-96 rounded-md bg-muted/60" />
        </div>
        <div className="h-9 w-44 rounded-lg bg-muted shrink-0" />
      </div>

      {/* Filter Bar Placeholder */}
      <div className="rounded-xl border bg-card p-4 space-y-4">
        <div className="h-10 w-full rounded-lg bg-muted/60" />
        <div className="flex flex-wrap gap-2 pt-1 border-t">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-6 w-20 rounded-full bg-muted/40" />
          ))}
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
        <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-brand-crimson" />
            <span className="text-xs font-semibold text-muted-foreground">
              Chargement des retours d&apos;expérience candidats...
            </span>
          </div>
          <div className="h-4 w-28 rounded bg-muted/60" />
        </div>

        <div className="divide-y divide-border/60">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4">
              <div className="h-6 w-8 rounded bg-muted shrink-0" />
              <div className="flex items-center gap-3 w-48 shrink-0">
                <div className="h-9 w-9 rounded-full bg-muted shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-24 rounded bg-muted" />
                  <div className="h-3 w-16 rounded bg-muted/60" />
                </div>
              </div>
              <div className="w-32 shrink-0 space-y-1">
                <div className="h-4 w-20 rounded bg-muted" />
                <div className="h-4 w-16 rounded bg-muted/60" />
              </div>
              <div className="flex-1 space-y-1 hidden md:block">
                <div className="h-3.5 w-full rounded bg-muted/50" />
                <div className="h-3.5 w-3/4 rounded bg-muted/40" />
              </div>
              <div className="h-6 w-16 rounded-full bg-muted/50 shrink-0" />
              <div className="h-8 w-20 rounded bg-muted/40 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
