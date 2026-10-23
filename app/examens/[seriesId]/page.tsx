import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
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
        "Entraînement conforme Cambridge IELTS General Training : 40 questions Reading, 40 questions Listening, Writing Task 1-2 et Speaking. Barème Band 0-9.0 et équivalence CLB Canada.",
      openGraph: {
        title: `${series?.title || "Cambridge IELTS 18 General Training"} | Super4C2`,
        description:
          "Simulation conforme Cambridge English avec conversion automatique en Band Scores (0-9.0) et CLB Canada.",
      },
    };
  }

  return {
    title: `Examen ${series?.seriesNumber || 1} — TCF & TEF Canada CBT`,
    description: `Simulation d'entraînement de l'Examen ${series?.seriesNumber || 1} TCF Canada : Compréhension Écrite, Compréhension Orale, Expression Écrite et Orale. Objectif NCLC 7+ (+50 pts CRS).`,
    openGraph: {
      title: `Examen ${series?.seriesNumber || 1} TCF Canada — Super4C2`,
      description: `Entraînez-vous sur l'Examen ${series?.seriesNumber || 1} en conditions réelles d'examen CBT.`,
    },
  };
}

export default async function SeriesDisciplineSelectorPage({
  params,
}: {
  params: Promise<{ seriesId: string }>;
}) {
  const { seriesId } = await params;

  // Redirection intelligente si l'identifiant cible spécifiquement l'Écrit ou l'Oral
  if (seriesId.startsWith("series_eo_") || seriesId.endsWith("-eo")) {
    redirect(`/examens/${seriesId}/eo`);
  }
  if (seriesId.startsWith("series_ee_") || seriesId.endsWith("-ee")) {
    redirect(`/examens/${seriesId}/ee`);
  }

  const series = getMockSeries(seriesId);
  if (!series) {
    redirect("/examens");
  }

  const isIelts = seriesId.includes("ielts");

  return (
    <div className="mx-auto max-w-4xl space-y-10 py-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b pb-6">
        <div className="space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />{" "}
            {isIelts
              ? "🇬🇧 Préparation IELTS General Training"
              : "🇨🇦 Préparation Format TCF Canada"}
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight">
            {isIelts ? series.title : `Vous êtes sur le point de commencer l'Examen ${series.seriesNumber || 1}`}
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
                ? "Enchaînez les 4 compétences du test (Listening ➔ Reading ➔ Writing ➔ Speaking) avec relevé de notes Band Scores Cambridge et équivalence CLB Express Entry."
                : "Enchaînez les 4 compétences dans l'ordre de l'examen (CO ➔ CE ➔ EE ➔ EO) sur 2h47min avec pauses réglementaires et bilan de score simulé (+50 pts CRS)."}
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


      {/* Bandeau d'information Lancement Gratuit */}
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] p-4 sm:p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Offre Spéciale Lancement : Accès 100% Gratuit
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Les épreuves décisives d&apos;<strong>Expression Écrite</strong> (3 tâches FEI) et d&apos;<strong>Expression Orale</strong> (Examinateur IA) sont ouvertes sans frais à tous les candidats.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Disciplines Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* 1. Expression Écrite / Writing (Flagship Actif) */}
        <div className="group relative flex flex-col justify-between rounded-3xl border-2 border-brand-crimson/50 bg-gradient-to-b from-card via-card to-brand-crimson/[0.04] p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
          <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-brand-crimson px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs">
            <Sparkles className="h-3.5 w-3.5" /> Disponible · Recommandé FEI
          </span>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-crimson/10 p-1 transition-transform group-hover:scale-105">
                <Image
                  src="/brand/icons-3d/expression-ecrite-pen.png"
                  alt={isIelts ? "IELTS Writing" : "Expression Écrite"}
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain drop-shadow-sm"
                />
              </div>
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                100% Gratuit · Correction IA
              </span>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold">
                {isIelts ? "Writing (Expression Écrite)" : "Expression Écrite"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {isIelts
                  ? "2 tâches Cambridge General : Task 1 Lettre formelle (150 mots) et Task 2 Essai discursif (250 mots). Grille IELTS 4 critères."
                  : "3 tâches rédactionnelles (courriel, récit d'expérience, prise de position) avec hub didactique en 3 paliers, compteur de mots et Magic Rewrite C1/C2."}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-foreground/90 border-t pt-3">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-brand-crimson" /> 60 minutes
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ListChecks className="h-4 w-4 text-brand-crimson" />{" "}
                {isIelts ? "2 tâches (Lettre + Essai)" : "3 tâches de rédaction"}
              </span>
            </div>
          </div>

          <div className="pt-6">
            <Button asChild size="lg" className="w-full bg-brand-crimson hover:bg-brand-crimson-dark text-white font-bold shadow-md">
              <Link href={`/examens/${seriesId}/ee/intro`}>
                <span>Démarrer l&apos;Atelier d&apos;Écriture</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* 2. Expression Orale / Speaking (Flagship Actif) */}
        <div className="group relative flex flex-col justify-between rounded-3xl border-2 border-amber-500/50 bg-gradient-to-b from-card via-card to-amber-500/[0.04] p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
          <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-white shadow-xs">
            <Sparkles className="h-3.5 w-3.5" /> Disponible · Studio Visio IA
          </span>

          <div className="space-y-4 pt-2">
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
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                100% Gratuit · Examinateur Live
              </span>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold">
                {isIelts ? "Speaking (Expression Orale)" : "Expression Orale"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {isIelts
                  ? "Entretien en 3 parties avec l'examinateur IA : Interview, Cue Card et Discussion abstraite avec évaluation de la fluidité."
                  : "Interagissez avec notre examinateur vocal IA M. Laurent en studio 16:9. Pré-test micro, 3 tâches d'entretien officiel et enregistrement intégral."}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-foreground/90 border-t pt-3">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-500" /> {isIelts ? "11–14 minutes" : "12 minutes"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ListChecks className="h-4 w-4 text-amber-500" />{" "}
                {isIelts ? "3 parties" : "3 tâches officielles"}
              </span>
            </div>
          </div>

          <div className="pt-6">
            <Button asChild size="lg" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-md">
              <Link href={`/examens/${seriesId}/eo/intro`}>
                <span>Démarrer l&apos;Épreuve Orale</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* 3. Compréhension Orale / Listening (Bientôt disponible) */}
        <div className="group relative flex flex-col justify-between rounded-3xl border border-border/80 bg-muted/20 p-6 shadow-xs opacity-90 transition-all hover:border-amber-500/40">
          <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            🔒 Bientôt disponible · Calibrage FEI
          </span>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted p-1">
                <Image
                  src="/brand/icons-3d/comprehension-orale-headphones.png"
                  alt={isIelts ? "IELTS Listening" : "Compréhension Orale"}
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain drop-shadow-sm opacity-70"
                />
              </div>
              <span className="text-xs font-mono text-muted-foreground">39 questions</span>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-foreground/80">
                {isIelts ? "Listening (Compréhension Orale)" : "Compréhension Orale"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                Les extraits sonores studio et le lecteur de mono-écoute CBT sont en cours d&apos;ajustement pour reproduire exactement l&apos;environnement d&apos;un centre d&apos;examen officiel.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground border-t pt-3">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> 40 minutes
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ListChecks className="h-4 w-4" /> 39 questions
              </span>
            </div>
          </div>

          <div className="pt-6">
            <Button asChild variant="outline" size="lg" className="w-full font-semibold border-dashed text-muted-foreground hover:text-foreground">
              <Link href={`/examens/${series.id}/co`}>
                <span>Consulter le statut de calibrage</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* 4. Compréhension Écrite / Reading (Bientôt disponible) */}
        <div className="group relative flex flex-col justify-between rounded-3xl border border-border/80 bg-muted/20 p-6 shadow-xs opacity-90 transition-all hover:border-amber-500/40">
          <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            🔒 Bientôt disponible · Calibrage FEI
          </span>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted p-1">
                <Image
                  src="/brand/icons-3d/comprehension-ecrite-book.png"
                  alt={isIelts ? "IELTS Reading" : "Compréhension Écrite"}
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain drop-shadow-sm opacity-70"
                />
              </div>
              <span className="text-xs font-mono text-muted-foreground">39 questions</span>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-foreground/80">
                {isIelts ? "Reading (Compréhension Écrite)" : "Compréhension Écrite"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                Les banques de questions et le simulateur double écran font l&apos;objet d&apos;un calibrage approfondi pour garantir une fidélité 100% conforme aux épreuves réelles.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground border-t pt-3">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> 60 minutes
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ListChecks className="h-4 w-4" /> 39 questions
              </span>
            </div>
          </div>

          <div className="pt-6">
            <Button asChild variant="outline" size="lg" className="w-full font-semibold border-dashed text-muted-foreground hover:text-foreground">
              <Link href={`/examens/${series.id}/ce`}>
                <span>Consulter le statut de calibrage</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Back Link */}
      <div className="text-center pt-4">
        <Button variant="ghost" asChild>
          <Link href="/examens">← Revenir à la banque des sujets</Link>
        </Button>
      </div>
    </div>
  );
}
