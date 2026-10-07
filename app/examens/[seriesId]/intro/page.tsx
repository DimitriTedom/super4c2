import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, CheckCircle2, Clock, FileText, Keyboard, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMockSeries } from "@/lib/exam/mock-series";

export const metadata = { title: "Consignes de l'épreuve — TCF Canada CBT" };

export default async function IntroPage({
  params,
}: {
  params: Promise<{ seriesId: string }>;
}) {
  const { seriesId } = await params;
  const series = getMockSeries(seriesId);
  if (!series) notFound();

  const isCO = series.discipline === "CO";

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="rounded-md border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-primary">
            {isCO ? "Compréhension orale (CO)" : "Compréhension écrite (CE) • Officiel FEI"}
          </span>
          <span className="text-xs text-muted-foreground font-mono">
            {series.questions.length} questions · {series.durationSeconds / 60} minutes
          </span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
          {series.title}
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Simulation en conditions réelles d&apos;examen sur ordinateur (CBT). Prenez connaissance des consignes officielles avant d&apos;enclencher le chronomètre.
        </p>
      </div>

      {/* Structure des questions */}
      {!isCO && (
        <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <FileText className="h-4 w-4 text-primary" />
            <h2 className="font-display text-base font-bold">Structure Officielle des 39 Questions (Paliers CECRL)</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 text-xs">
            <div className="rounded-xl border bg-muted/30 p-3 space-y-1">
              <span className="font-bold text-emerald-600 block">Q1 à Q6 — Niveau A1 (NCLC 3)</span>
              <p className="text-muted-foreground">Messages très courts du quotidien, horaires, affiches et menus.</p>
            </div>
            <div className="rounded-xl border bg-muted/30 p-3 space-y-1">
              <span className="font-bold text-teal-600 block">Q7 à Q12 — Niveau A2 (NCLC 4-5)</span>
              <p className="text-muted-foreground">Consignes pratiques, petites annonces, offres d&apos;emploi et dépliants.</p>
            </div>
            <div className="rounded-xl border bg-muted/30 p-3 space-y-1">
              <span className="font-bold text-blue-600 block">Q13 à Q18 — Niveau B1 (NCLC 6)</span>
              <p className="text-muted-foreground">Courriels professionnels, articles de vulgarisation et notes de service.</p>
            </div>
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 space-y-1">
              <span className="font-bold text-primary block">Q19 à Q28 — Niveau B2 (Seuil NCLC 7 • +50 pts CRS)</span>
              <p className="text-muted-foreground">Articles de presse, analyses socio-économiques, environnement et travail hybride.</p>
            </div>
            <div className="rounded-xl border bg-muted/30 p-3 space-y-1">
              <span className="font-bold text-purple-600 block">Q29 à Q35 — Niveau C1 (NCLC 9)</span>
              <p className="text-muted-foreground">Chroniques d&apos;analyse critique, essais sociologiques et sens implicite.</p>
            </div>
            <div className="rounded-xl border bg-muted/30 p-3 space-y-1">
              <span className="font-bold text-rose-600 block">Q36 à Q39 — Niveau C2 (NCLC 10+)</span>
              <p className="text-muted-foreground">Débats philosophiques, textes stylistiques et nuances linguistiques complexes.</p>
            </div>
          </div>
        </div>
      )}

      {/* Règles de passage */}
      <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-4">
        <h2 className="font-display text-base font-bold flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" /> Consignes et Règles du Test
        </h2>
        <ul className="space-y-3 text-sm">
          <li className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
            <span><strong>Chronomètre officiel 60 minutes :</strong> Décompte continu non interruptible, identique à l&apos;examen FEI en centre agréé.</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
            <span><strong>Sauvegarde automatique :</strong> Toutes vos réponses et le temps restant sont enregistrés en temps réel si vous rafraîchissez la page.</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
            <span><strong>Pas de points négatifs :</strong> Une mauvaise réponse ne retire aucun point. Ne laissez aucune question sans réponse avant de terminer.</span>
          </li>
          <li className="flex items-start gap-3">
            <Keyboard className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <span><strong>Raccourcis clavier complets :</strong> Touches <kbd className="rounded border bg-muted px-1 font-mono text-xs">A</kbd> <kbd className="rounded border bg-muted px-1 font-mono text-xs">B</kbd> <kbd className="rounded border bg-muted px-1 font-mono text-xs">C</kbd> <kbd className="rounded border bg-muted px-1 font-mono text-xs">D</kbd> pour répondre, <kbd className="rounded border bg-muted px-1 font-mono text-xs">←</kbd> <kbd className="rounded border bg-muted px-1 font-mono text-xs">→</kbd> pour naviguer, et <kbd className="rounded border bg-muted px-1 font-mono text-xs">F</kbd> pour signaler.</span>
          </li>
        </ul>
      </div>

      {isCO && (
        <p className="flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-800 dark:text-amber-300">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          Branchez votre casque et vérifiez le volume avant de commencer. Dans cette démo, la voix est synthétisée par votre navigateur.
        </p>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-4">
        <Button variant="outline" asChild>
          <Link href="/examens">Retour au catalogue</Link>
        </Button>
        <Button asChild size="lg" className="font-bold text-base px-8 shadow-sm">
          <Link href={`/examens/${series.id}/${isCO ? "co" : "ce"}`}>
            <Sparkles className="mr-2 h-4 w-4" /> Démarrer l&apos;épreuve de Compréhension Écrite
          </Link>
        </Button>
      </div>
    </div>
  );
}
