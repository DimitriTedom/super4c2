"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error report if needed
    console.error("Super4C2 runtime error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-14rem)] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-destructive/10 text-destructive mb-6 shadow-xs">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <div className="inline-flex items-center gap-1.5 rounded-full border border-destructive/20 bg-destructive/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-destructive mb-3">
        Erreur de traitement
      </div>

      <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight">
        Une interruption inattendue est survenue
      </h1>

      <p className="mt-3 max-w-md text-base text-muted-foreground leading-relaxed">
        Le simulateur ou le service d&apos;évaluation n&apos;a pas pu finaliser l&apos;opération. Vos réponses et votre session d&apos;examen restent sauvegardées localement.
      </p>

      {error.digest && (
        <p className="mt-2 font-mono text-xs text-muted-foreground/70">
          Code incident : {error.digest}
        </p>
      )}

      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
        <Button onClick={() => reset()} size="lg" className="w-full sm:w-auto font-bold shadow-xs">
          <RefreshCw className="mr-2 h-4 w-4" />
          Réessayer l&apos;opération
        </Button>

        <Button variant="outline" asChild size="lg" className="w-full sm:w-auto font-medium">
          <Link href="/examens">
            <RotateCcw className="mr-2 h-4 w-4" />
            Retourner aux examens
          </Link>
        </Button>

        <Button variant="ghost" asChild size="lg" className="w-full sm:w-auto font-medium">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Accueil
          </Link>
        </Button>
      </div>
    </div>
  );
}
