import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Mic, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOralSeries } from "@/lib/exam/mock-oral-series";

export const metadata = { title: "Consignes de l'Expression Orale" };

export default async function OralIntroPage({
  params,
}: {
  params: Promise<{ seriesId: string }>;
}) {
  const { seriesId } = await params;
  const series = getOralSeries(seriesId);

  if (!series) notFound();

  const rules = [
    "Durée totale de l'entretien : environ 12 minutes pour les 3 tâches.",
    "Tâche 1 (2 min) : Entretien dirigé de présentation personnelle.",
    "Tâche 2 (3 min 30 s) : Jeu de rôle en interaction — L'agent IA vous répond en direct !",
    "Tâche 3 (4 min 30 s) : Monologue d'argumentation sur un sujet de société.",
    "Assurez-vous d'être dans un endroit calme et utilisez un micro ou un casque avec micro.",
    "À l'issue de l'entretien, vous obtiendrez un bilan complet avec notation FEI et expressions C1/C2 recommandées.",
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary flex items-center gap-1.5">
          <Mic className="h-3.5 w-3.5" />
          TCF Canada — Expression Orale
        </p>
        <h1 className="font-display text-3xl font-extrabold tracking-tight">{series.title}</h1>
      </div>

      <div className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
        <h2 className="font-display text-lg font-bold">Consignes & Déroulement de l&apos;Épreuve</h2>
        <ul className="space-y-3">
          {rules.map((r, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4 flex items-start gap-3">
        <MessageSquare className="mt-0.5 h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-400" />
        <p className="text-xs leading-relaxed text-foreground/90">
          <strong>Innovation Exclusive Super4C2 :</strong> En Tâche 2 (jeu de rôle), vous n&apos;êtes plus seul face à un chrono ! L&apos;examinateur vocal IA de Super4C2 vous répond en direct pour vous entraîner aux vraies relances de l&apos;examen FEI.
        </p>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" asChild>
          <Link href="/examens">Retour au catalogue</Link>
        </Button>
        <Button asChild size="lg" className="gap-2">
          <Link href={`/examens/${series.id}/eo`}>
            Entrer dans la Salle d&apos;Entretien Orale
          </Link>
        </Button>
      </div>
    </div>
  );
}
