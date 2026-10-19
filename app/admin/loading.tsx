import React from "react";
import { Loader2 } from "lucide-react";

export default function AdminOverviewLoading() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar Placeholder */}
      <aside className="hidden lg:flex flex-col justify-between border-r bg-card h-full w-72 p-4 shrink-0 animate-pulse">
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-1">
            <div className="h-8 w-32 rounded-lg bg-muted" />
          </div>
          <div className="h-14 rounded-xl bg-muted/60" />
          <div className="space-y-2 pt-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-9 rounded-lg bg-muted/50" />
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header Placeholder */}
        <header className="h-14 border-b bg-card px-4 flex items-center justify-between animate-pulse">
          <div className="h-5 w-48 rounded-md bg-muted" />
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-muted" />
            <div className="h-8 w-8 rounded-full bg-muted" />
          </div>
        </header>

        {/* Scrollable Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Top Sync Strip Skeleton */}
            <div className="h-12 w-full rounded-xl border bg-muted/40 animate-pulse flex items-center px-4 justify-between">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-brand-crimson" />
                <span className="text-xs font-semibold text-muted-foreground">
                  Synchronisation temps réel avec Supabase Cloud en cours...
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-6 w-20 rounded-lg bg-muted" />
                ))}
              </div>
            </div>

            {/* Header Banner Skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pulse">
              <div className="space-y-2">
                <div className="h-8 w-72 rounded-lg bg-muted" />
                <div className="h-4 w-96 rounded-md bg-muted/60" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-9 w-36 rounded-lg bg-muted" />
                <div className="h-9 w-32 rounded-lg bg-muted" />
              </div>
            </div>

            {/* 4 KPI Cards Skeleton */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border bg-card p-5 shadow-xs space-y-3 animate-pulse"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-32 rounded bg-muted" />
                    <div className="size-7 rounded-lg bg-muted" />
                  </div>
                  <div className="h-8 w-24 rounded bg-muted" />
                  <div className="h-3 w-40 rounded bg-muted/60" />
                </div>
              ))}
            </div>

            {/* Active Modules and Live Activity Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 rounded-2xl border bg-card p-6 shadow-xs space-y-4 animate-pulse">
                <div className="h-6 w-48 rounded bg-muted" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="h-36 rounded-xl border bg-muted/30 p-4 space-y-3" />
                  <div className="h-36 rounded-xl border bg-muted/30 p-4 space-y-3" />
                </div>
              </div>
              <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4 animate-pulse">
                <div className="h-6 w-36 rounded bg-muted" />
                <div className="space-y-3 pt-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-12 rounded-lg bg-muted/30" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
