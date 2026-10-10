import React from "react";
import { Loader2 } from "lucide-react";

export default function LeadsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Top Header Placeholder */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div className="space-y-2">
          <div className="h-7 w-72 rounded-lg bg-muted" />
          <div className="h-4 w-96 rounded-md bg-muted/60" />
        </div>
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-brand-crimson" />
          <span className="text-xs font-semibold text-muted-foreground">
            Chargement des demandes...
          </span>
        </div>
      </div>

      {/* Filter Bar Placeholder */}
      <div className="rounded-xl border bg-card p-4 space-y-4">
        <div className="h-10 w-full rounded-lg bg-muted/60" />
        <div className="flex flex-wrap gap-2 pt-1 border-t">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-6 w-24 rounded-full bg-muted/40" />
          ))}
        </div>
      </div>

      {/* Cards List Skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted shrink-0" />
                <div className="space-y-1.5">
                  <div className="h-4 w-40 rounded bg-muted" />
                  <div className="h-3 w-64 rounded bg-muted/60" />
                </div>
              </div>
              <div className="h-8 w-28 rounded-lg bg-muted/60" />
            </div>
            <div className="space-y-2">
              <div className="h-3.5 w-full rounded bg-muted/50" />
              <div className="h-3.5 w-4/5 rounded bg-muted/40" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
