import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, PenTool, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getWrittenSeries } from "@/lib/exam/mock-written-series";

export const metadata = { title: "Consignes de l'Expression Écrite" };

export default async function WrittenIntroPage({
  params,
}: {
  params: Promise<{ seriesId: string }>;
}) {
  const { seriesId } = await params;
  const series = getWrittenSeries(seriesId);

  if (!series) notFound();

  const rules = [
    "Durée totale : 60 minutes pour rédiger les 3 tâches.",
    "Tâche 1 (Message descriptif) : 60 à 120 mots.",
    "Tâche 2 (Récit d'expérience & opinion) : 120 à 150 mots.",
    "Tâche 3 (Analyse comparative argumentée) : 120 à 180 mots.",
    "Un compteur de mots automatique en temps réel vous guide selon la règle officielle FEI.",
    "Le correcteur automatique du navigateur est désactivé pour simuler l'examen réel.",
    "À l'issue des 60 minutes, recevez un rapport FEI complet et la version modèle Magic Rewrite C1/C2.",
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary flex items-center gap-1.5">
          <PenTool className="h-3.5 w-3.5" />
          TCF Canada — Expression Écrite
        </p>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">{series.title}</h1>
      </div>

      <div className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
        <h2 className="font-display text-lg font-bold">Consignes & Modalités de l&apos;Épreuve</h2>
        <ul className="space-y-3">
          {rules.map((r, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
        <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <p className="text-xs leading-relaxed text-foreground/90">
          <strong>Innovation Super4C2 :</strong> Contrairement à Objectif Canada où la correction humaine met 24 heures, vous obtiendrez votre note FEI et votre réécriture modèle C1/C2 instantanément !
        </p>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" asChild>
          <Link href="/examens">Retour au catalogue</Link>
        </Button>
        <Button asChild size="lg" className="gap-2">
          <Link href={`/examens/${series.id}/ee`}>
            Démarrer l&apos;Expression Écrite (60:00)
          </Link>
        </Button>
      </div>
    </div>
  );
}
