import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMockSeries } from "@/lib/exam/mock-series";

export const metadata = { title: "Consignes de l'épreuve" };

export default async function IntroPage({
  params,
}: {
  params: Promise<{ seriesId: string }>;
}) {
  const { seriesId } = await params;
  const series = getMockSeries(seriesId);
  if (!series) notFound();

  const isCO = series.discipline === "CO";
  const rules = [
    `Durée : ${series.durationSeconds / 60} minutes. Le chronomètre ne peut pas être mis en pause.`,
    "Chaque question propose 4 réponses (A, B, C, D) dont une seule est correcte.",
    "Vous pouvez signaler une question pour la réviser avant la fin du temps.",
    "Vos réponses sont sauvegardées automatiquement ; l'épreuve se termine à 00:00.",
    ...(isCO
      ? ["Chaque document sonore ne peut être écouté qu'une seule fois, sans pause ni retour."]
      : []),
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {isCO ? "Compréhension orale" : "Compréhension écrite"}
        </p>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">{series.title}</h1>
      </div>

      <ul className="space-y-3 rounded-2xl border bg-card p-6">
        {rules.map((r) => (
          <li key={r} className="flex items-start gap-3 text-sm">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
            {r}
          </li>
        ))}
      </ul>

      {isCO && (
        <p className="flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-800 dark:text-amber-300">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          Branchez votre casque et vérifiez le volume avant de commencer. Dans cette démo, la
          voix est synthétisée par votre navigateur.
        </p>
      )}

      <div className="flex gap-3">
        <Button variant="outline" asChild>
          <Link href="/examens">Retour</Link>
        </Button>
        <Button asChild size="lg">
          <Link href={`/examens/${series.id}/${isCO ? "co" : "ce"}`}>Démarrer l&apos;épreuve</Link>
        </Button>
      </div>
    </div>
  );
}
