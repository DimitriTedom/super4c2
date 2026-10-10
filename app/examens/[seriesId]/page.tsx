import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, ListChecks, Sparkles, ArrowRight, ShieldCheck, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMockSeries } from "@/lib/exam/mock-series";

import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ seriesId: string }>;
}): Promise<Metadata> {
  const { seriesId } = await params;
  const series = getMockSeries(seriesId);
  const isIelts = seriesId.includes("ielts");

  if (isIelts) {
    return {
      title: `${series?.title || "Cambridge IELTS 18 General Training"} — Simulateur CBT`,
      description:
        "Entraînement officiel Cambridge IELTS General Training : 40 questions Reading, 40 questions Listening, Writing Task 1-2 et Speaking. Barème Band 0-9.0 et équivalence CLB Canada.",
      openGraph: {
        title: `${series?.title || "Cambridge IELTS 18 General Training"} | Super4C2`,
        description:
          "Simulation officielle Cambridge English avec conversion automatique en Band Scores (0-9.0) et CLB Canada.",
      },
    };
  }

  return {
    title: `Série ${series?.seriesNumber || 101} — TCF & TEF Canada CBT`,
    description: `Simulation officielle de la Série ${series?.seriesNumber || 101} TCF Canada : Compréhension Écrite, Compréhension Orale, Expression Écrite et Orale. Objectif NCLC 7+ (+50 pts CRS).`,
    openGraph: {
      title: `Série ${series?.seriesNumber || 101} TCF Canada — Super4C2`,
      description: `Entraînez-vous sur la Série ${series?.seriesNumber || 101} en conditions officielles d'examen CBT.`,
    },
  };
}

export default async function SeriesDisciplineSelectorPage({
  params,
}: {
  params: Promise<{ seriesId: string }>;
}) {
  const { seriesId } = await params;
  const series = getMockSeries(seriesId) || getMockSeries("demo-101-ce");
  if (!series) notFound();

  const isIelts = seriesId.includes("ielts");

  return (
    <div className="mx-auto max-w-4xl space-y-10 py-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b pb-6">
        <div className="space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />{" "}
            {isIelts
              ? "🇬🇧 Simulateur Officiel Cambridge English · IELTS General Training"
              : "🇨🇦 Simulateur Officiel FEI · Nouveau Format TCF Canada"}
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight">
            {isIelts ? series.title : `Vous êtes sur le point de commencer la Série ${series.seriesNumber || 101}`}
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl">
            {isIelts
              ? "Sélectionnez votre compétence pour débuter le test ou lancez la simulation complète. Barème officiel Cambridge (Band 0–9.0) et équivalence CLB 7/9 (+24 à +50 pts CRS)."
              : "Vous devez choisir une discipline pour débuter le test. Toutes nos simulations respectent scrupuleusement les contraintes officielles de France Éducation International."}
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
              <Trophy className="h-3.5 w-3.5" /> {isIelts ? "Palier Royal CLB 9 (8777)" : "Simulation Reine NCLC 7+"}
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-black text-foreground">
              {isIelts ? "Passer l'Examen Blanc Complet IELTS (4 Compétences)" : "Passer l'Examen Blanc Complet (4 Épreuves)"}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {isIelts
                ? "Enchaînez les 4 compétences officielles (Listening ➔ Reading ➔ Writing ➔ Speaking) avec relevé de notes Band Scores Cambridge et équivalence CLB Express Entry."
                : "Enchaînez les 4 compétences dans l'ordre officiel (CO ➔ CE ➔ EE ➔ EO) sur 2h47min avec pauses réglementaires et relevé d'attestation FEI officiel (+50 pts CRS)."}
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
        {/* 1. Compréhension Écrite / Reading (Flagship Highlight) */}
        <div className="group relative flex flex-col justify-between rounded-3xl border-2 border-primary/50 bg-gradient-to-b from-card via-card to-primary/[0.04] p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
          <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-xs">
            <Sparkles className="h-3.5 w-3.5" /> {isIelts ? "Cambridge General · 40Q" : "Recommandé · Flagship 39Q"}
          </span>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 p-1 transition-transform group-hover:scale-105">
                <Image
                  src="/brand/icons-3d/comprehension-ecrite-book.png"
                  alt={isIelts ? "IELTS Reading" : "Compréhension Écrite"}
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain drop-shadow-sm"
                />
              </div>
              <div className="text-right">
                <span className="font-mono text-xs font-semibold text-primary block">
                  {isIelts ? "Barème Cambridge (Band 0–9.0)" : "Barème FEI (100–699)"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {isIelts ? "Seuil CLB 7 / CLB 9" : "Seuil NCLC 7"}
                </span>
              </div>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold">
                {isIelts ? "Reading (Compréhension Écrite)" : "Compréhension Écrite"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {isIelts
                  ? "3 sections authentiques Cambridge IELTS 18 (Social Survival, Workplace, General Reading). 40 questions True/False/Not Given et QCM avec analyse des pièges."
                  : "Textes authentiques A1 à C2, double écran CBT officiel, zoom de lecture, touches A-D et décodage exhaustif des pièges avec intégration Carnet d'Erreurs (SRS)."}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-foreground/90 border-t pt-3">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" /> 60 minutes
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ListChecks className="h-4 w-4 text-primary" />{" "}
                {isIelts ? "40 questions (T/F/NG & QCM)" : "39 questions QCM"}
              </span>
            </div>
          </div>

          <div className="pt-6">
            <Button asChild size="lg" className="w-full font-bold shadow-xs">
              <Link href={isIelts ? `/examens/${series.id}/ce` : `/examens/${series.id}/intro`}>
                {isIelts ? "Démarrer le Reading (CE)" : "Démarrer la Compréhension Écrite"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* 2. Compréhension Orale / Listening */}
        <div className="group flex flex-col justify-between rounded-3xl border bg-card p-6 shadow-xs transition-all hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 p-1 transition-transform group-hover:scale-105">
                <Image
                  src="/brand/icons-3d/comprehension-orale-headphones.png"
                  alt={isIelts ? "IELTS Listening" : "Compréhension Orale"}
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain drop-shadow-sm"
                />
              </div>
              <span className="font-mono text-xs text-cyan-600 dark:text-cyan-400 font-bold">
                {isIelts ? "Listening 4 Sections" : "Mono-écoute stricte"}
              </span>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold">
                {isIelts ? "Listening (Compréhension Orale)" : "Compréhension Orale"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {isIelts
                  ? "4 sections Cambridge officielles : dialogue quotidien, monologue social, discussion académique et conférence scientifique. Audio transcripts complets et explications."
                  : "Documents sonores fidèles aux accents québécois et français. Une seule écoute sans pause ni retour, identique aux conditions de passation en centre agréé."}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-foreground/90 border-t pt-3">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-muted-foreground" /> {isIelts ? "30 minutes" : "40 minutes"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ListChecks className="h-4 w-4 text-muted-foreground" />{" "}
                {isIelts ? "40 questions QCM" : "39 questions QCM"}
              </span>
            </div>
          </div>

          <div className="pt-6">
            <Button asChild variant="outline" size="lg" className="w-full font-semibold">
              <Link href={`/examens/${series.id}/co`}>
                {isIelts ? "Démarrer le Listening (CO)" : "Démarrer la Compréhension Orale"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* 3. Expression Écrite / Writing */}
        <div className="group flex flex-col justify-between rounded-3xl border bg-card p-6 shadow-xs transition-all hover:-translate-y-1 hover:border-brand-crimson/40 hover:shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E51A31]/10 p-1 transition-transform group-hover:scale-105">
                <Image
                  src="/brand/icons-3d/expression-ecrite-pen.png"
                  alt={isIelts ? "IELTS Writing" : "Expression Écrite"}
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain drop-shadow-sm"
                />
              </div>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                {isIelts ? "Task 1 & Task 2" : "Correction IA FEI"}
              </span>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold">
                {isIelts ? "Writing (Expression Écrite)" : "Expression Écrite"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {isIelts
                  ? "2 tâches officielles Cambridge General : Task 1 Lettre formelle (150 mots) et Task 2 Essai discursif (250 mots). Grille officielle IELTS 4 critères (TR, CC, LR, GRA)."
                  : "3 tâches officielles (message, article, essai argumenté) avec compteur de mots dynamique, notation sur 20 selon la grille FEI et Magic Rewrite niveau C1/C2."}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-foreground/90 border-t pt-3">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-muted-foreground" /> 60 minutes
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ListChecks className="h-4 w-4 text-muted-foreground" />{" "}
                {isIelts ? "2 tâches (Lettre + Essai)" : "3 tâches de rédaction"}
              </span>
            </div>
          </div>

          <div className="pt-6">
            <Button asChild variant="outline" size="lg" className="w-full font-semibold">
              <Link href={`/examens/${series.id}/ee/intro`}>
                {isIelts ? "Accéder à l'Atelier Writing" : "Accéder à l'Atelier Écrit"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* 4. Expression Orale / Speaking */}
        <div className="group flex flex-col justify-between rounded-3xl border bg-card p-6 shadow-xs transition-all hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 p-1 transition-transform group-hover:scale-105">
                <Image
                  src="/brand/icons-3d/expression-orale-microphone.png"
                  alt={isIelts ? "IELTS Speaking" : "Expression Orale"}
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain drop-shadow-sm"
                />
              </div>
              <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                {isIelts ? "3 Parts · Cambridge Examiner" : "Voice Agent Live"}
              </span>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold">
                {isIelts ? "Speaking (Expression Orale)" : "Expression Orale"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {isIelts
                  ? "Entretien en 3 parties avec l'examinateur IA Cambridge : Part 1 Interview & Home town, Part 2 Cue Card (1 min prep, 2 min monologue), Part 3 Discussion abstraite."
                  : "Interagissez avec notre examinateur vocal IA en direct. Simulation de jeu de rôle dynamique (Tâche 2) et monologue argumenté avec feedback vocal immédiat."}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-foreground/90 border-t pt-3">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-muted-foreground" /> {isIelts ? "11–14 minutes" : "12 minutes"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ListChecks className="h-4 w-4 text-muted-foreground" />{" "}
                {isIelts ? "3 parties officielles" : "3 tâches interactives"}
              </span>
            </div>
          </div>

          <div className="pt-6">
            <Button asChild variant="outline" size="lg" className="w-full font-semibold">
              <Link href={`/examens/${series.id}/eo/intro`}>
                {isIelts ? "Démarrer le Speaking IELTS" : "Démarrer le Jeu de Rôle Vocal"}
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
