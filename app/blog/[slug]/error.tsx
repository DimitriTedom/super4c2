"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogPostErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erreur de rendu sur la page article du blog :", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-3xl py-16 px-4 text-center space-y-6">
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-8 ring-primary/5">
        <BookOpen className="h-7 w-7" />
      </div>

      <div className="space-y-2">
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
          Chargement de l&apos;article en cours
        </h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          Une micro-interruption de flux s&apos;est produite lors du rendu de cet article. Vous pouvez rafraîchir la lecture ou explorer notre catalogue complet.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Button
          onClick={() => reset()}
          size="sm"
          className="font-bold bg-primary hover:bg-primary-dark text-white gap-2 shadow-sm"
        >
          <RefreshCw className="h-4 w-4" />
          Réessayer la lecture
        </Button>
        <Button variant="outline" size="sm" asChild className="gap-2">
          <Link href="/blog">
            <ArrowLeft className="h-4 w-4" />
            Retourner au catalogue
          </Link>
        </Button>
      </div>
    </div>
  );
}
