import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle2, Mic, MessageSquare, ArrowLeft, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOralSeries } from "@/lib/exam/oral-service";
import { OralHardwareCheck } from "@/components/exam/oral-hardware-check";

export const metadata = { title: "Consignes & Calibrage de l'Expression Orale — TCF Canada" };

export default async function OralIntroPage({
  params,
}: {
  params: Promise<{ seriesId: string }>;
}) {
  const { seriesId } = await params;
  const series = await getOralSeries(seriesId);

  if (!series) notFound();

  const rules = [
    "Durée totale de l'entretien : environ 12 minutes réparties en 3 tâches séquentielles.",
    "Tâche 1 (2 min) : Entretien dirigé de présentation personnelle sans préparation.",
    "Tâche 2 (3 min 30 s) : Exercice en interaction / Jeu de rôle — L'examinateur IA de Super4C2 vous répond en direct !",
    "Tâche 3 (4 min 30 s) : Monologue d'argumentation sur un sujet de société avec prise de position nuancée.",
    "À l'issue de l'entretien, vous obtiendrez un bilan complet avec notation FEI (20 pts), échelon NCLC et tournures C1/C2 suggérées.",
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-4">
      {/* En-tête avec icône 3D officielle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 p-2 shadow-sm">
            <Image
              src="/brand/icons-3d/expression-orale-microphone.png"
              alt="Expression Orale"
              width={64}
              height={64}
              className="h-12 w-12 object-contain drop-shadow-sm"
            />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
              <Mic className="h-3.5 w-3.5" />
              Épreuve Officielle TCF Canada — Expression Orale
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              {series.title}
            </h1>
          </div>
        </div>

        <Button variant="outline" size="sm" asChild className="rounded-full gap-2 px-3.5 h-8 border-border/80 font-bold text-xs shadow-2xs group">
          <Link href="/examens?discipline=eo">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1 text-primary" />
            <span>Précédent</span>
          </Link>
        </Button>
      </div>

      {/* Module interactif de calibrage audio & micro */}
      <OralHardwareCheck seriesId={series.id} />

      {/* Consignes officielles FEI */}
      <div className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Consignes Officielles & Déroulement</h2>
          <span className="text-xs font-mono font-bold text-muted-foreground bg-muted px-2.5 py-1 rounded-full border">
            3 Tâches • ~12 min
          </span>
        </div>

        <ul className="space-y-3">
          {rules.map((r, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span className="text-muted-foreground leading-relaxed">{r}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Note d'innovation Super4C2 */}
      <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4 flex items-start gap-3">
        <MessageSquare className="mt-0.5 h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-400" />
        <p className="text-xs leading-relaxed text-foreground/90">
          <strong>Innovation Exclusive Super4C2 :</strong> En Tâche 2 (jeu de rôle), vous n&apos;êtes plus seul face à un chrono silencieux ! L&apos;examinateur vocal IA de Super4C2 converse avec vous en temps réel, vous pose des questions de clarification et met à l&apos;épreuve vos compétences réelles d&apos;interaction.
        </p>
      </div>
    </div>
  );
}
