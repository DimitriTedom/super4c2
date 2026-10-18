import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  PenTool,
  CheckCircle2,
  BookOpen,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getWrittenSeries } from "@/lib/exam/written-service";

export const metadata = {
  title: "Consignes de l'Expression Écrite — TCF Canada | Super4C2",
  description:
    "Consignes officielles et modalités de l'épreuve d'Expression Écrite TCF Canada (60 minutes, 3 tâches consécutives).",
};

export default async function WrittenIntroPage({
  params,
}: {
  params: Promise<{ seriesId: string }>;
}) {
  const { seriesId } = await params;
  const series = await getWrittenSeries(seriesId);

  if (!series) notFound();

  const examNumber = series.seriesNumber || 1;

  const rules = [
    {
      label: "Durée totale",
      text: "60 minutes consécutives pour rédiger les 3 tâches sans pause intermédiaire.",
      highlight: "60 minutes",
    },
    {
      label: "Tâche 1 (Message descriptif)",
      text: "60 à 120 mots • Décrire un lieu, raconter un événement ou formuler une invitation.",
      highlight: "60 à 120 mots",
    },
    {
      label: "Tâche 2 (Récit d'expérience & opinion)",
      text: "120 à 150 mots • Partager une expérience personnelle et donner son avis motivé.",
      highlight: "120 à 150 mots",
    },
    {
      label: "Tâche 3 (Analyse comparative argumentée)",
      text: "120 à 180 mots • Comparer deux points de vue et défendre sa propre position.",
      highlight: "120 à 180 mots",
    },
    {
      label: "Compteur de mots en temps réel",
      text: "Un compteur automatique vous guide pour respecter scrupuleusement les fourchettes officielles.",
      highlight: "Temps réel",
    },
    {
      label: "Conditions d'examen réel",
      text: "Le correcteur automatique du navigateur est désactivé et un clavier d'accents français est intégré.",
      highlight: "Sans autocorrecteur",
    },
    {
      label: "Évaluation & Magic Rewrite C1/C2",
      text: "À l'issue de l'épreuve, recevez votre rapport détaillé par critères et vos réécritures modèles de niveau C1/C2.",
      highlight: "Rapport instantané",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6 py-6 px-4">
      {/* 1. Bouton Précédent avec flèche */}
      <div>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="rounded-full gap-2 px-3.5 h-8 border-border/80 bg-background/80 hover:bg-muted font-bold text-xs shadow-2xs group"
        >
          <Link href="/examens?discipline=ee">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1 text-primary" />
            <span>Précédent</span>
          </Link>
        </Button>
      </div>

      {/* 2. En-tête de l'épreuve épuré */}
      <div className="space-y-2 border-b border-border/70 pb-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-crimson/20 bg-brand-crimson/10 px-3 py-0.5 text-xs font-bold text-brand-crimson">
          <PenTool className="h-3.5 w-3.5" />
          <span>TCF Canada • Expression Écrite</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-foreground">
          Examen {examNumber} — Consignes &amp; Modalités
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Prenez connaissance des règles officielles avant de démarrer l&apos;épreuve chronométrée de 60 minutes.
        </p>
      </div>

      {/* 3. Bloc Consignes & Modalités de l'épreuve */}
      <div className="space-y-4 rounded-3xl border border-border/80 bg-card/70 p-6 sm:p-8 shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            <span>Modalités Officielles de l&apos;Épreuve</span>
          </h2>
          <span className="text-xs font-mono font-bold text-muted-foreground">
            3 tâches • 60:00
          </span>
        </div>

        <ul className="space-y-3.5 pt-1">
          {rules.map((rule, idx) => (
            <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <div className="leading-snug">
                <strong className="text-foreground">{rule.label} : </strong>
                <span className="text-muted-foreground">{rule.text}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 4. Les 2 Blocs d'Action Côte-à-Côte (1: Relire la méthodologie / 2: Démarrer l'examen) */}
      <div className="pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Bloc 1 : Relire la Méthodologie */}
          <Link
            href={`/examens/${series.id}/ee/methodologie`}
            className="group flex flex-col justify-between rounded-3xl border-2 border-primary/30 bg-card/80 p-5 sm:p-6 hover:border-primary hover:bg-card hover:shadow-lg transition-all space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary text-white font-black text-xs shadow-xs">
                  1
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                  <BookOpen className="h-3 w-3" /> Guide Pédagogique
                </span>
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-foreground group-hover:text-primary transition-colors">
                  Relire la Méthodologie
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Lire la méthodologie détaillée de toutes les tâches (Tâches 1, 2 et 3), connecteurs B2/C1 et barèmes.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs font-bold text-primary">
              <span>Consulter la méthodologie</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Bloc 2 : Démarrer l'Examen */}
          <Link
            href={`/examens/${series.id}/ee?mode=exam&start=true`}
            className="group flex flex-col justify-between rounded-3xl border-2 border-brand-crimson/50 bg-gradient-to-br from-card via-card to-brand-crimson/[0.05] p-5 sm:p-6 hover:border-brand-crimson hover:shadow-xl transition-all space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-brand-crimson text-white font-black text-xs shadow-xs">
                  2
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-crimson/15 px-2 py-0.5 text-[11px] font-bold text-brand-crimson">
                  <Clock className="h-3 w-3" /> Conditions Réelles
                </span>
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-foreground group-hover:text-brand-crimson transition-colors">
                  Démarrer l&apos;Examen (60:00)
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Lancer l&apos;épreuve chronométrée officielle de 60 minutes avec compteur de mots et clavier virtuel.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-brand-crimson/20 flex items-center justify-between text-xs font-bold text-brand-crimson">
              <span>Lancer l&apos;épreuve maintenant</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
