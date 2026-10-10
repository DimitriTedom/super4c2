import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, ListChecks, Sparkles, ArrowRight, ShieldCheck, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMockSeries } from "@/lib/exam/mock-series";

export const metadata = {
  title: "Choisir une épreuve — TCF Canada | Super4C2",
  description: "Sélectionnez votre discipline pour débuter la série TCF Canada en conditions réelles CBT.",
};

export default async function SeriesDisciplineSelectorPage({
  params,
}: {
  params: Promise<{ seriesId: string }>;
}) {
  const { seriesId } = await params;
  const series = getMockSeries(seriesId) || getMockSeries("demo-101-ce");
  if (!series) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-10 py-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b pb-6">
        <div className="space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            <ShieldCheck className="h-3.5 w-3.5" /> Simulateur Officiel FEI · Nouveau Format TCF Canada
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight">
            Vous êtes sur le point de commencer la Série {series.seriesNumber || 101}
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl">
            Vous devez choisir une discipline pour débuter le test. Toutes nos simulations respectent scrupuleusement les contraintes officielles de France Éducation International.
          </p>
        </div>
        <div className="shrink-0 hidden sm:flex items-center justify-center p-2 rounded-3xl bg-primary/5 border border-primary/20 shadow-sm">
          <Image
            src="/brand/icons-3d/cbt-dual-screen-simulator.png"
            alt="CBT Simulator"
            width={84}
            height={84}
            className="h-20 w-20 object-contain drop-shadow-md"
            priority
          />
        </div>
      </div>

      {/* Flagship: Examen Blanc Complet (4 Épreuves enchaînées) */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-amber-500/80 bg-gradient-to-r from-amber-500/15 via-card to-primary/10 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
              <Trophy className="h-3.5 w-3.5" /> Simulation Reine NCLC 7+
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-black text-foreground">
              Passer l&apos;Examen Blanc Complet (4 Épreuves)
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Enchaînez les 4 compétences dans l&apos;ordre officiel (CO ➔ CE ➔ EE ➔ EO) sur 2h47min avec pauses réglementaires et relevé d&apos;attestation FEI officiel (+50 pts CRS).
            </p>
          </div>

          <Button
            asChild
            size="lg"
            className="shrink-0 font-black px-6 h-12 bg-gradient-to-r from-amber-500 via-orange-500 to-primary hover:opacity-95 text-white shadow-lg shadow-amber-500/30"
          >
            <Link href={`/examens/${seriesId}/examen-blanc`}>
              <span>Lancer l&apos;Examen Blanc</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>


      {/* 4 Disciplines Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* 1. Compréhension Écrite (Flagship Highlight) */}
        <div className="group relative flex flex-col justify-between rounded-3xl border-2 border-primary/50 bg-gradient-to-b from-card via-card to-primary/[0.04] p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
          <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-xs">
            <Sparkles className="h-3.5 w-3.5" /> Recommandé · Flagship 39Q
          </span>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 p-1 transition-transform group-hover:scale-105">
                <Image
                  src="/brand/icons-3d/comprehension-ecrite-book.png"
                  alt="Compréhension Écrite"
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain drop-shadow-sm"
                />
              </div>
              <div className="text-right">
                <span className="font-mono text-xs font-semibold text-primary block">Barème FEI (100–699)</span>
                <span className="text-xs text-muted-foreground">Seuil NCLC 7</span>
              </div>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold">Compréhension Écrite</h2>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                Textes authentiques A1 à C2, double écran CBT officiel, zoom de lecture, touches A-D et décodage exhaustif des pièges avec intégration Carnet d&apos;Erreurs (SRS).
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-foreground/90 border-t pt-3">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" /> 60 minutes
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ListChecks className="h-4 w-4 text-primary" /> 39 questions QCM
              </span>
            </div>
          </div>

          <div className="pt-6">
            <Button asChild size="lg" className="w-full font-bold shadow-xs">
              <Link href={`/examens/${series.id}/intro`}>
                Démarrer la Compréhension Écrite
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* 2. Compréhension Orale */}
        <div className="group flex flex-col justify-between rounded-3xl border bg-card p-6 shadow-xs transition-all hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 p-1 transition-transform group-hover:scale-105">
                <Image
                  src="/brand/icons-3d/comprehension-orale-headphones.png"
                  alt="Compréhension Orale"
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain drop-shadow-sm"
                />
              </div>
              <span className="font-mono text-xs text-cyan-600 dark:text-cyan-400 font-bold">Mono-écoute stricte</span>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold">Compréhension Orale</h2>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                Documents sonores fidèles aux accents québécois et français. Une seule écoute sans pause ni retour, identique aux conditions de passation en centre agréé.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-foreground/90 border-t pt-3">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-muted-foreground" /> 40 minutes
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ListChecks className="h-4 w-4 text-muted-foreground" /> 39 questions QCM
              </span>
            </div>
          </div>

          <div className="pt-6">
            <Button asChild variant="outline" size="lg" className="w-full font-semibold">
              <Link href={`/examens/${series.id}/co`}>
                Démarrer la Compréhension Orale
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* 3. Expression Écrite */}
        <div className="group flex flex-col justify-between rounded-3xl border bg-card p-6 shadow-xs transition-all hover:-translate-y-1 hover:border-brand-crimson/40 hover:shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E51A31]/10 p-1 transition-transform group-hover:scale-105">
                <Image
                  src="/brand/icons-3d/expression-ecrite-pen.png"
                  alt="Expression Écrite"
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain drop-shadow-sm"
                />
              </div>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                Correction IA FEI
              </span>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold">Expression Écrite</h2>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                3 tâches officielles (message, article, essai argumenté) avec compteur de mots dynamique, notation sur 20 selon la grille FEI et Magic Rewrite niveau C1/C2.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-foreground/90 border-t pt-3">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-muted-foreground" /> 60 minutes
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ListChecks className="h-4 w-4 text-muted-foreground" /> 3 tâches de rédaction
              </span>
            </div>
          </div>

          <div className="pt-6">
            <Button asChild variant="outline" size="lg" className="w-full font-semibold">
              <Link href={`/examens/${series.id}/ee/intro`}>
                Accéder à l&apos;Atelier Écrit
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* 4. Expression Orale */}
        <div className="group flex flex-col justify-between rounded-3xl border bg-card p-6 shadow-xs transition-all hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 p-1 transition-transform group-hover:scale-105">
                <Image
                  src="/brand/icons-3d/expression-orale-microphone.png"
                  alt="Expression Orale"
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain drop-shadow-sm"
                />
              </div>
              <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                Voice Agent Live
              </span>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold">Expression Orale</h2>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                Interagissez avec notre examinateur vocal IA en direct. Simulation de jeu de rôle dynamique (Tâche 2) et monologue argumenté avec feedback vocal immédiat.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-foreground/90 border-t pt-3">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-muted-foreground" /> 12 minutes
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ListChecks className="h-4 w-4 text-muted-foreground" /> 3 tâches interactives
              </span>
            </div>
          </div>

          <div className="pt-6">
            <Button asChild variant="outline" size="lg" className="w-full font-semibold">
              <Link href={`/examens/${series.id}/eo/intro`}>
                Démarrer le Jeu de Rôle Vocal
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Back Link */}
      <div className="text-center pt-4">
        <Button variant="ghost" asChild>
          <Link href="/examens">← Revenir au catalogue des séries</Link>
        </Button>
      </div>
    </div>
  );
}
