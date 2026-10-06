"use client";

import React from "react";
import { Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface MagicRewriteViewerProps {
  originalText: string;
  rewrittenText: string;
  highlights: string[];
  className?: string;
}

export function MagicRewriteViewer({
  originalText,
  rewrittenText,
  highlights,
  className,
}: MagicRewriteViewerProps) {
  return (
    <div className={cn("space-y-4 rounded-2xl border bg-card p-6 shadow-sm", className)}>
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-500 to-rose-500 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-foreground">
              Magic Rewrite C1 / C2 — Modèle d&apos;Excellence
            </h3>
            <p className="text-xs text-muted-foreground">
              Reformulation enrichie conservant vos idées d&apos;origine avec un registre académique
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Volet Original */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span>Votre Production Initiale</span>
          </div>
          <div className="rounded-xl border bg-muted/40 p-4 text-sm leading-relaxed whitespace-pre-line text-foreground/80 font-sans min-h-[140px]">
            {originalText || <span className="italic text-muted-foreground">Aucun texte saisi</span>}
          </div>
        </div>

        {/* Volet Réécrit C1/C2 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Version Optimisée C1/C2
            </span>
          </div>
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm leading-relaxed whitespace-pre-line text-foreground font-sans font-medium min-h-[140px]">
            {rewrittenText}
          </div>
        </div>
      </div>

      {/* Points Clés d'Amélioration */}
      {highlights.length > 0 && (
        <div className="mt-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-2">
            Tournures Remarquables Utilisées :
          </p>
          <ul className="grid gap-1.5 sm:grid-cols-2 text-xs text-foreground/90">
            {highlights.map((h, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-cyan-500 shrink-0" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
