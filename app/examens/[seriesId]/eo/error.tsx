"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home, MessageSquare, Headphones, ShieldCheck, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OralExamErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    console.error("[Oral Exam Error Boundary] Exception capturée :", error);
  }, [error]);

  const handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  const handleCopy = () => {
    if (error.digest && typeof navigator !== "undefined") {
      void navigator.clipboard.writeText(error.digest);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 text-center">
      {/* Badge statut */}
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-500/15 text-amber-600 dark:text-amber-400 mb-5 shadow-lg ring-8 ring-amber-500/5">
        <Headphones className="h-8 w-8 animate-pulse" />
      </div>

      <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 mb-3">
        <ShieldCheck className="h-3.5 w-3.5" /> Salle d&apos;Épreuve Expression Orale
      </div>

      <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight max-w-xl text-foreground">
        Une interruption temporaire a été détectée
      </h1>

      <p className="mt-3 max-w-lg text-sm sm:text-base text-muted-foreground leading-relaxed">
        Votre session d&apos;examen d&apos;expression orale a rencontré une difficulté réseau ou audio passagère. Vos paramètres et votre sujet restent accessibles.
      </p>

      {error.digest && (
        <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-border/70 bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground font-mono">
          <span>Identifiant incident : <strong className="text-foreground">{error.digest}</strong></span>
          <button
            type="button"
            onClick={handleCopy}
            className="text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded cursor-pointer"
            title="Copier le code incident"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      )}

      {/* Actions de reprise */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
        <Button
          onClick={() => reset()}
          size="lg"
          className="w-full sm:w-auto font-bold bg-primary hover:bg-primary/90 text-primary-foreground gap-2 rounded-xl shadow-md cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" />
          Reprendre l&apos;entretien
        </Button>

        <Button
          onClick={handleReload}
          variant="outline"
          size="lg"
          className="w-full sm:w-auto font-semibold gap-2 rounded-xl border-border/80 cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" />
          Recharger la salle
        </Button>

        <Button
          variant="ghost"
          asChild
          size="lg"
          className="w-full sm:w-auto font-medium gap-2 rounded-xl cursor-pointer"
        >
          <Link href="/examens">
            <Home className="h-4 w-4" />
            Liste des Sujets
          </Link>
        </Button>
      </div>

      {/* Assistance */}
      <p className="mt-8 text-xs text-muted-foreground flex items-center gap-1.5 justify-center">
        <span>Besoin d&apos;assistance ?</span>
        <Link href="/contact" className="text-primary font-semibold hover:underline inline-flex items-center gap-1">
          <MessageSquare className="h-3 w-3" />
          Support technique candidat
        </Link>
      </p>
    </div>
  );
}
