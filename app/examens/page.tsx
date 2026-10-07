import Link from "next/link";
import { BookOpenText, Clock, ListChecks, PenTool, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listWrittenSeries } from "@/lib/exam/mock-written-series";

export const metadata = {
  title: "Séries TCF Canada — Entraînement en conditions réelles | Super4C2",
  description: "Accédez à toutes les séries TCF Canada : compréhension écrite, compréhension orale, expression écrite et orale en conditions officielles CBT.",
};

export default function ExamCataloguePage() {
  const writtenSeries = listWrittenSeries();

  return (
    <div className="space-y-12">
      {/* Header Banner - Matching Competitor Positioning */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          Plateforme Conforme France Éducation International (FEI)
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
          Séries TCF Canada — Entraînement en conditions réelles
        </h1>
        <p className="max-w-3xl text-muted-foreground text-base">
          Vous êtes proche de votre objectif ! Choisissez une série, ensuite sélectionnez la discipline et commencez à vous exercer dans les conditions exactes de l&apos;examen sur ordinateur (CBT).
        </p>
      </div>

      {/* Catégorie 1 : Séries complètes */}
      <div className="space-y-5">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <BookOpenText className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl font-bold">Série complète (Nouveau format TCF)</h2>
          </div>
          <span className="text-xs text-muted-foreground font-mono">4 épreuves officielles</span>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Série 101 Flagship */}
          <li className="group relative flex flex-col justify-between gap-5 rounded-3xl border-2 border-primary/50 bg-gradient-to-b from-card via-card to-primary/[0.04] p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
            <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary-foreground shadow-xs">
              <Sparkles className="h-3 w-3" /> Série Recommandée · Flagship CE 39Q
            </span>
            <div className="space-y-3 pt-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <BookOpenText className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold leading-snug">Série 101</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Test complet TCF Canada — Paliers A1 à C2</p>
              </div>
              <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-foreground/90 font-medium">
                <span className="inline-flex items-center gap-1.5">
                  <ListChecks className="h-4 w-4 text-primary" /> 39 questions CE (60 min)
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-primary" /> 4 disciplines
                </span>
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Comprend l&apos;épreuve complète de Compréhension Écrite (39 questions, pièges décodés, export SRS), Compréhension Orale, Expression Écrite et Orale.
              </p>
            </div>
            <Button asChild size="lg" className="font-bold shadow-xs">
              <Link href="/examens/demo-101-ce">Choisir la Série 101</Link>
            </Button>
          </li>

          {/* Série 102 (Simulation Prochaine) */}
          <li className="group flex flex-col justify-between gap-5 rounded-3xl border bg-card p-6 opacity-85 transition-all hover:-translate-y-0.5 hover:border-border hover:shadow-sm">
            <div className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <BookOpenText className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold leading-snug">Série 102</h3>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">Pack Pro</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Test complet TCF Canada</p>
              </div>
              <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <ListChecks className="h-4 w-4" /> 39 questions CE
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> 4 disciplines
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                Série d&apos;entraînement intensive axée sur le vocabulaire sociopolitique et économique canadien.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/examens/demo-101-ce">Choisir la Série 102</Link>
            </Button>
          </li>

          {/* Série 103 (Simulation Prochaine) */}
          <li className="group flex flex-col justify-between gap-5 rounded-3xl border bg-card p-6 opacity-85 transition-all hover:-translate-y-0.5 hover:border-border hover:shadow-sm">
            <div className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <BookOpenText className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold leading-snug">Série 103</h3>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">Pack Pro</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Test complet TCF Canada</p>
              </div>
              <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <ListChecks className="h-4 w-4" /> 39 questions CE
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> 4 disciplines
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                Série d&apos;entraînement ciblant les pièges des niveaux B2 et C1 pour sécuriser NCLC 7+.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/examens/demo-101-ce">Choisir la Série 103</Link>
            </Button>
          </li>
        </ul>
      </div>

      {/* Catégorie 2 : Expressions uniquement */}
      <div className="space-y-5">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <PenTool className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl font-bold">Expressions uniquement</h2>
          </div>
          <span className="text-xs text-muted-foreground font-mono">Expression Écrite & Expression Orale</span>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {writtenSeries.map((s, idx) => (
            <li
              key={s.id}
              className="group flex flex-col justify-between gap-5 rounded-3xl border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <PenTool className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold leading-snug">Série {201 + idx}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.title}</p>
                </div>
                <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <ListChecks className="h-4 w-4" /> 3 tâches FEI
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4" /> 60 min (EE) & 12 min (EO)
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Entraînement exclusif à la rédaction et au jeu de rôle oral avec feedback IA en 10 secondes.
                </p>
              </div>
              <Button asChild variant="outline" className="hover:bg-primary hover:text-primary-foreground font-semibold">
                <Link href={`/examens/${s.id}/ee/intro`}>Commencer l&apos;expression</Link>
              </Button>
            </li>
          ))}
        </ul>
      </div>

      {/* Catégorie 3 : Accès direct par discipline (Flagship CE) */}
      <div className="rounded-3xl border bg-muted/20 p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <h2 className="font-display text-xl font-bold">Accès direct par épreuve officielle (CBT)</h2>
          <p className="text-sm text-muted-foreground">
            Vous souhaitez vous concentrer sur une seule épreuve aujourd&apos;hui ? Lancez directement le simulateur adapté.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border-2 border-primary/40 bg-card p-4 space-y-3 shadow-xs">
            <span className="font-mono text-xs font-bold text-primary block">Flagship • 39 Questions</span>
            <h4 className="font-display font-bold text-base">Compréhension Écrite</h4>
            <p className="text-xs text-muted-foreground">Double écran, zoom de police, pièges décodés.</p>
            <Button asChild size="sm" className="w-full font-bold">
              <Link href="/examens/demo-101-ce/intro">Lancer (60 min)</Link>
            </Button>
          </div>

          <div className="rounded-2xl border bg-card p-4 space-y-3">
            <span className="font-mono text-xs font-bold text-muted-foreground block">39 Questions</span>
            <h4 className="font-display font-bold text-base">Compréhension Orale</h4>
            <p className="text-xs text-muted-foreground">Audio mono-écoute sans retour arrière.</p>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/examens/demo-101-co/co">Lancer (40 min)</Link>
            </Button>
          </div>

          <div className="rounded-2xl border bg-card p-4 space-y-3">
            <span className="font-mono text-xs font-bold text-muted-foreground block">3 Tâches</span>
            <h4 className="font-display font-bold text-base">Expression Écrite</h4>
            <p className="text-xs text-muted-foreground">Correction IA FEI & Magic Rewrite C1/C2.</p>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/examens/demo-written-1/ee/intro">Lancer (60 min)</Link>
            </Button>
          </div>

          <div className="rounded-2xl border bg-card p-4 space-y-3">
            <span className="font-mono text-xs font-bold text-muted-foreground block">Voice Agent Live</span>
            <h4 className="font-display font-bold text-base">Expression Orale</h4>
            <p className="text-xs text-muted-foreground">Examinateur vocal interactif en jeu de rôle.</p>
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/examens/demo-oral-1/eo">Lancer (12 min)</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
