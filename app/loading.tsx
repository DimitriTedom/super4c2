import React from "react";
import { BrandLogo } from "@/components/brand-logo";

export default function RootLoading() {
  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center gap-6 p-4">
      {/* Halo d'ambiance */}
      <div className="pointer-events-none absolute h-64 w-64 rounded-full bg-brand-crimson/10 blur-3xl" />

      {/* Pulsing Brand Logo */}
      <div className="relative flex flex-col items-center gap-4 z-10">
        <div className="relative flex items-center justify-center">
          <span className="animate-ping absolute inline-flex h-16 w-16 rounded-full bg-brand-crimson/20" />
          <div className="h-14 w-14 rounded-2xl bg-card border border-border/80 shadow-xl flex items-center justify-center p-2">
            <BrandLogo variant="mark-only" size="md" href="/" />
          </div>
        </div>

        <div className="text-center space-y-1">
          <p className="font-display font-bold text-base tracking-tight text-foreground">
            Super4C2
          </p>
          <p className="text-xs text-muted-foreground animate-pulse font-medium">
            Chargement de la page...
          </p>
        </div>

        {/* Shimmer Bar */}
        <div className="h-1 w-36 rounded-full bg-muted overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-brand-crimson to-transparent animate-pulse" />
        </div>
      </div>
    </div>
  );
}
