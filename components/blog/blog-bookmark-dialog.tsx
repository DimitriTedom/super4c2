"use client";

import React from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { BookmarkCheck, CheckCircle2, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Button } from "@/components/ui/button";

interface BlogBookmarkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  articleTitle?: string;
  articleSlug?: string;
}

export function BlogBookmarkDialog({
  open,
  onOpenChange,
  articleTitle,
  articleSlug,
}: BlogBookmarkDialogProps) {
  const registerUrl = articleSlug
    ? `/auth/register?source=blog_bookmark&article=${encodeURIComponent(articleSlug)}`
    : "/auth/register?source=blog_bookmark";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6 overflow-hidden rounded-3xl border-border bg-card shadow-2xl">
        {/* Glow ambient background effect */}
        <div className="absolute -top-20 -right-20 h-44 w-44 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <DialogHeader className="space-y-3 text-center sm:text-left">
          {/* Animated icon badge */}
          <div className="mx-auto sm:mx-0 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-xs">
            <BookmarkCheck className="h-7 w-7 text-primary animate-pulse" />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="h-3 w-3" />
              100% Gratuit • Sans Carte
            </div>
            <DialogTitle className="font-display text-xl sm:text-2xl font-black tracking-tight text-foreground leading-snug">
              Sauvegardez ce guide dans vos favoris
            </DialogTitle>
          </div>

          <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {articleTitle ? (
              <span>
                Retrouvez <strong className="text-foreground">« {articleTitle} »</strong> et toutes vos fiches méthodes au même endroit la veille de votre examen officiel TCF.
              </span>
            ) : (
              <span>
                Ne perdez plus vos stratégies NCLC 7 et formules C1/C2 la veille de votre passage officiel devant l&apos;examinateur.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        {/* 3 Pillars of value */}
        <div className="space-y-2 py-3 border-y border-border/60 text-xs text-foreground/90">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Fiches et modèles C1/C2 synchronisés sur mobile et PC</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Accès complet aux simulateurs CBT officiels 60 minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Sauvegarde automatique de vos scores et carnet d&apos;erreurs SRS</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <ShimmerButton
            href={registerUrl}
            background="#E51A31"
            shimmerColor="#ffffff"
            className="w-full font-bold py-3 text-xs sm:text-sm text-white shadow-md justify-center"
          >
            <span>Créer mon compte gratuit en 30s</span>
            <ArrowRight className="h-4 w-4 ml-1.5 inline-block" />
          </ShimmerButton>

          <div className="flex items-center justify-center pt-1">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground h-8"
            >
              <Link href="/auth/login">
                Déjà un compte ? Se connecter
              </Link>
            </Button>
          </div>
        </div>

        {/* Trust Footer */}
        <div className="flex items-center gap-1.5 pt-2 text-[10px] text-muted-foreground border-t border-border/50 justify-center text-center">
          <ShieldCheck className="h-3 w-3 text-emerald-500 shrink-0" />
          <span>Inscription immédiate sans engagement • 100% conforme barèmes FEI</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
