"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw, RotateCcw, Copy, Check, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    console.error("Super4C2 runtime error:", error);
  }, [error]);

  const handleHardReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  const handleCopyCode = () => {
    if (error.digest && typeof navigator !== "undefined") {
      void navigator.clipboard.writeText(error.digest);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-14rem)] flex-col items-center justify-center px-4 py-16 text-center">
      {/* Icon halo */}
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-destructive/10 text-destructive mb-6 shadow-xs ring-8 ring-destructive/5 animate-pulse">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <div className="inline-flex items-center gap-1.5 rounded-full border border-destructive/20 bg-destructive/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-destructive mb-3">
        Difficulté passagère détectée
      </div>

      <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight max-w-xl text-foreground">
        Une interruption inattendue est survenue
      </h1>

      <p className="mt-3 max-w-lg text-sm sm:text-base text-muted-foreground leading-relaxed">
        Nous avons rencontré une difficulté lors du chargement de cette page. Vos données de navigation, vos réponses et votre progression restent préservées en toute sécurité.
      </p>

      {error.digest && (
        <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-border/70 bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground font-mono">
          <span>Code incident : <strong className="text-foreground">{error.digest}</strong></span>
          <button
            type="button"
            onClick={handleCopyCode}
            className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded"
            title="Copier le code incident"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md sm:max-w-none">
        <Button
          onClick={handleHardReload}
          size="lg"
          className="w-full sm:w-auto font-bold shadow-md bg-brand-crimson hover:bg-brand-crimson-dark text-white gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Recharger la page
        </Button>

        <Button
          onClick={() => reset()}
          variant="outline"
          size="lg"
          className="w-full sm:w-auto font-semibold gap-2 border-border/80"
        >
          <RotateCcw className="h-4 w-4" />
          Réessayer
        </Button>

        <Button
          variant="ghost"
          asChild
          size="lg"
          className="w-full sm:w-auto font-medium gap-2"
        >
          <Link href="/">
            <Home className="h-4 w-4" />
            Retour à l&apos;accueil
          </Link>
        </Button>
      </div>

      {/* Support link */}
      <p className="mt-8 text-xs text-muted-foreground flex items-center gap-1.5 justify-center">
        <span>Besoin d&apos;assistance immédiate ?</span>
        <Link href="/contact" className="text-primary font-semibold hover:underline inline-flex items-center gap-1">
          <MessageSquare className="h-3 w-3" />
          Contacter notre support 7j/7
        </Link>
      </p>
    </div>
  );
}
