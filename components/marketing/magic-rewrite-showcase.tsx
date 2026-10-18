"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  PenTool,
  TrendingUp,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ShowcaseExample {
  taskNumber: 1 | 2 | 3;
  taskTitle: string;
  topicSummary: string;
  before: {
    text: string;
    score: string;
    nclc: string;
    flaws: string[];
  };
  after: {
    text: string;
    score: string;
    nclc: string;
    highlights: { text: string; note: string }[];
  };
  targetExamUrl: string;
}

const EXAMPLES: ShowcaseExample[] = [
  {
    taskNumber: 1,
    taskTitle: "Tâche 1 — Message descriptif & amical",
    topicSummary: "Remercier des hôtes et décrire vos impressions suite à un séjour au Québec.",
    before: {
      text: "Bonjour Pierre et Marie, je vous écris pour vous dire merci pour le séjour chez vous. C'était très bien et votre maison est belle. La ville de Québec était jolie sous la neige et les gens étaient gentils. J'espère vous revoir bientôt à Paris.",
      score: "8.5 / 20",
      nclc: "NCLC 5 (Insuffisant)",
      flaws: [
        "Vocabulaire simpliste (très bien, belle, jolie, gentils)",
        "Absence de connecteurs logiques de niveau B2/C1",
        "Répétitions et phrases juxtaposées sans subordination",
      ],
    },
    after: {
      text: "Chers Pierre et Marie,\n\nJe tiens à vous exprimer ma plus sincère gratitude pour la chaleur de votre accueil lors de notre passage dans la belle province. Au-delà du charme indéniable de votre demeure boréale, la féerie des ruelles québécoises fraîchement enneigées a rendu cette escapade véritablement inoubliable.\n\nDans l'attente du plaisir de vous rendre la pareille à Paris,\nBien amicalement.",
      score: "19 / 20",
      nclc: "NCLC 9 (C1/C2 Validé)",
      highlights: [
        { text: "sincère gratitude", note: "Registre soutenu adapté" },
        { text: "Au-delà du charme indéniable", note: "Articulateur de transition complexe" },
        { text: "féerie des ruelles", note: "Précision lexicale évocatrice" },
        { text: "rendre la pareille", note: "Tournure idiomatique élégante" },
      ],
    },
    targetExamUrl: "/examens?discipline=ee",
  },
  {
    taskNumber: 2,
    taskTitle: "Tâche 2 — Récit d'expérience & opinion",
    topicSummary: "Partager votre expérience du bénévolat associatif et donner votre avis sur son utilité sociale.",
    before: {
      text: "L'année dernière j'ai fait du bénévolat dans une association pour aider les sans-abri. C'était une bonne expérience pour moi. Je pense que le bénévolat est très utile parce que ça aide la société et les gens qui ont des problèmes. Tout le monde devrait en faire un peu dans sa vie.",
      score: "9 / 20",
      nclc: "NCLC 5 (Insuffisant)",
      flaws: [
        "Formules d'opinion basiques (« Je pense que »)",
        "Termes vagues (« bonne expérience », « des problèmes », « un peu »)",
        "Manque d'analyse causale et de portée citoyenne",
      ],
    },
    after: {
      text: "Ayant consacré plusieurs mois à une maraude nocturne auprès des populations sans-abri, cette immersion citoyenne a profondément transformé ma vision de la solidarité urbaine. Loin d'être un simple acte charitable accessoire, l'engagement associatif constitue, à mes yeux, un vecteur indispensable de cohésion sociale.\n\nNon seulement il pallie l'isolement des plus vulnérables, mais il forge également chez les bénévoles une conscience civique durable. Dès lors, encourager cette démarche dès le cursus scolaire apparaît comme un levier démocratique incontournable.",
      score: "19.5 / 20",
      nclc: "NCLC 10 (C2 Élite)",
      highlights: [
        { text: "Ayant consacré plusieurs mois", note: "Participe présent marquant l'antériorité" },
        { text: "Loin d'être un simple acte", note: "Tournure de mise à distance critique" },
        { text: "Non seulement... mais il forge également", note: "Double articulation rhétorique" },
        { text: "Dès lors... levier démocratique", note: "Clôture d'opinion d'autorité" },
      ],
    },
    targetExamUrl: "/examens?discipline=ee",
  },
  {
    taskNumber: 3,
    taskTitle: "Tâche 3 — Analyse comparative & prise de position",
    topicSummary: "Débattre de l'interdiction des voitures dans les centres-villes (Deux points de vue contradictoires).",
    before: {
      text: "Certains disent qu'il faut interdire les voitures en ville pour la pollution. Mais d'autres disent que c'est difficile pour les commerçants et les gens qui habitent loin. Moi je pense que c'est bien d'interdire mais il faut faire attention aux transports.",
      score: "8 / 20",
      nclc: "NCLC 4 (Éliminatoire)",
      flaws: [
        "Double argumentation trop superficielle",
        "Formules enfantines (« Moi je pense que c'est bien »)",
        "Structure en miroir absente et vocabulaire répétitif",
      ],
    },
    after: {
      text: "La piétonnisation intégrale des hypercentres suscite un débat polarisé. D'un côté, les partisans d'une régulation stricte soulignent, à juste titre, la réduction immédiate des émissions carbonées et l'apaisement du cadre de vie citadin. À l'inverse, les acteurs économiques et les usagers périurbains redoutent un déclin commercial consécutif à l'enclavement des zones marchandes.\n\nTout en reconnaissant la légitimité des craintes économiques, j'estime néanmoins qu'une transition progressive, étayée par un réseau de transports cadencé et des parkings relais dissuasifs, offre le seul compromis écologiquement viable.",
      score: "20 / 20",
      nclc: "NCLC 10 (Perfection FEI)",
      highlights: [
        { text: "suscite un débat polarisé", note: "Formule d'amorce académique" },
        { text: "D'un côté... À l'inverse", note: "Connecteurs comparatifs officiels" },
        { text: "Tout en reconnaissant... j'estime néanmoins", note: "Concession B2/C1 parfaite" },
        { text: "étayée par un réseau cadencé", note: "Précision lexicale technique" },
      ],
    },
    targetExamUrl: "/examens?discipline=ee",
  },
];

export function MagicRewriteShowcase() {
  const [selectedTask, setSelectedTask] = useState<1 | 2 | 3>(1);
  const currentExample = EXAMPLES.find((e) => e.taskNumber === selectedTask) || EXAMPLES[0];

  return (
    <section className="space-y-8 max-w-5xl mx-auto py-8">
      {/* En-tête de section */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-crimson/20 bg-brand-crimson/10 px-3.5 py-1 text-xs font-bold text-brand-crimson">
          <Sparkles className="h-3.5 w-3.5 text-brand-crimson" />
          <span>La Technologie Exclusive Super4C2</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-foreground">
          Démonstration : L&apos;Effet « Magic Rewrite »
        </h2>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Pourquoi 78% des candidats ratent les +50 points CRS ? Parce qu&apos;ils écrivent au niveau B1 sans s&apos;en rendre compte. Observez la métamorphose instantanée opérée par notre IA.
        </p>
      </div>

      {/* Sélecteur de Tâches 1, 2, 3 */}
      <div className="flex justify-center gap-2 sm:gap-3">
        {EXAMPLES.map((example) => (
          <button
            key={example.taskNumber}
            type="button"
            onClick={() => setSelectedTask(example.taskNumber)}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold transition-all border shadow-xs select-none",
              selectedTask === example.taskNumber
                ? "bg-brand-crimson text-white border-brand-crimson shadow-md shadow-brand-crimson/20 scale-102"
                : "bg-card text-muted-foreground border-border/80 hover:bg-muted hover:text-foreground"
            )}
          >
            <PenTool className="h-3.5 w-3.5" />
            <span>Tâche {example.taskNumber}</span>
          </button>
        ))}
      </div>

      {/* Contexte du sujet */}
      <div className="text-center">
        <p className="text-xs sm:text-sm font-medium text-muted-foreground">
          <strong className="text-foreground">{currentExample.taskTitle} : </strong>
          {currentExample.topicSummary}
        </p>
      </div>

      {/* Grille Avant / Après */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Colonne 1 : La copie moyenne B1/B2 (Recalé) */}
        <div className="rounded-3xl border-2 border-border/80 bg-muted/20 p-6 sm:p-7 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs">
                  ✕
                </span>
                <span className="font-display font-bold text-sm text-foreground">
                  Copie Candidat Standard (B1)
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  {currentExample.before.score}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card/70 p-4 font-sans text-xs sm:text-sm leading-relaxed text-muted-foreground whitespace-pre-line italic">
              &quot;{currentExample.before.text}&quot;
            </div>

            <div className="space-y-2 pt-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Pourquoi cette copie échoue aux 50 pts CRS :
              </p>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                {currentExample.before.flaws.map((flaw, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <span>{flaw}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-3 border-t border-border/50 text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
            <span>Échelon : {currentExample.before.nclc}</span>
          </div>
        </div>

        {/* Colonne 2 : La version Magic Rewrite C1/C2 (Reçue 20/20) */}
        <div className="rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-card via-card to-emerald-500/[0.04] p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-500/30 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-xs shadow-xs">
                  ✓
                </span>
                <span className="font-display font-bold text-sm text-foreground flex items-center gap-1.5">
                  <span>Magic Rewrite Super4C2</span>
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    <Sparkles className="h-2.5 w-2.5" /> C1/C2
                  </span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30 shadow-2xs">
                  {currentExample.after.score}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-500/30 bg-card p-4 font-sans text-xs sm:text-sm leading-relaxed text-foreground whitespace-pre-line shadow-xs">
              {currentExample.after.text}
            </div>

            <div className="space-y-2 pt-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Gains de points NCLC débloqués par l&apos;IA :
              </p>
              <div className="flex flex-wrap gap-1.5">
                {currentExample.after.highlights.map((h, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-foreground"
                  >
                    <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                    <strong>{h.text}</strong>
                    <span className="text-muted-foreground text-[10px]">({h.note})</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-emerald-500/20 flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Award className="h-4 w-4" />
              {currentExample.after.nclc} • +50 pts CRS Débloqués
            </span>

            <Button asChild size="sm" className="rounded-full gap-1.5 font-bold text-xs bg-brand-crimson hover:bg-brand-crimson-dark text-white">
              <Link href={currentExample.targetExamUrl}>
                <span>S&apos;entraîner</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
