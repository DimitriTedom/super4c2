"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Calendar,
  MapPin,
  ArrowRight,
  BookMarked,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExamTopic {
  id: string;
  discipline: "EE" | "EO";
  taskNumber: 2 | 3;
  taskLabel: string;
  title: string;
  sessionDate: string;
  testCenter: string;
  prompt: string;
  c1Vocabulary: string[];
  recommendedArguments: string[];
  targetHref: string;
}

const RECENT_TOPICS: ExamTopic[] = [
  {
    id: "topic-ee-3-01",
    discipline: "EE",
    taskNumber: 3,
    taskLabel: "Expression Écrite — Tâche 3 (Essai Débat)",
    title: "L'interdiction des écrans et téléphones portables dans les établissements scolaires",
    sessionDate: "Session Octobre 2026",
    testCenter: "Centre Agréé Paris & Alger",
    prompt:
      "Faut-il bannir totalement les téléphones intelligents et tablettes de l'école primaire au lycée ? Rédigez un texte argumenté (120 à 180 mots) en présentant les arguments pour et contre avant de formuler une position nuancée.",
    c1Vocabulary: [
      "Inféodé aux technologies",
      "Facteur d'aliénation cognitive",
      "Vecteur pédagogique incontournable",
      "Ériger un cadre coercitif",
      "Nonobstant ces réticences",
    ],
    recommendedArguments: [
      "Pour : Préservation de l'attention, réduction du cyberharcèlement et recul de la sédentarité.",
      "Contre : Éducation numérique indispensable, usage des manuels interactifs et préparation au monde professionnel.",
    ],
    targetHref: "/examens/demo-101-ee/intro",
  },
  {
    id: "topic-ee-2-01",
    discipline: "EE",
    taskNumber: 2,
    taskLabel: "Expression Écrite — Tâche 2 (Récit / Article)",
    title: "Le bénévolat ou l'engagement associatif qui a transformé votre vision du monde",
    sessionDate: "Session Octobre 2026",
    testCenter: "Centre Agréé Montréal & Dakar",
    prompt:
      "Dans le cadre d'un journal municipal ou d'un blog de quartier, racontez une expérience de volontariat ou d'entraide communautaire à laquelle vous avez pris part. Décrivez vos motivations initiales, les difficultés surmontées et l'impact émotionnel ressenti (120 à 150 mots).",
    c1Vocabulary: [
      "Dénouement providentiel",
      "Altruisme désintéressé",
      "Tisser des liens pérennes",
      "Une prise de conscience salutaire",
    ],
    recommendedArguments: [
      "Mettre en scène un moment d'hésitation initial suivi d'une immersion enrichissante.",
      "Employer les temps du récit variés : imparfait (décor), passé composé (actions) et subjonctif.",
    ],
    targetHref: "/examens/demo-101-ee/intro",
  },
  {
    id: "topic-eo-2-01",
    discipline: "EO",
    taskNumber: 2,
    taskLabel: "Expression Orale — Tâche 2 (Jeu de Rôle Interactif)",
    title: "Convaincre un ami réticent d'adopter le covoiturage pour ses trajets domicile-travail",
    sessionDate: "Session Septembre 2026",
    testCenter: "Centre Agréé Douala & Beyrouth",
    prompt:
      "Vous avez lu une annonce proposant un système de covoiturage d'entreprise avantageux. Votre collègue (l'examinateur) préfère sa voiture individuelle par habitude. Vous essayez de le convaincre de tester la formule pendant un mois (environ 3 min 30 s).",
    c1Vocabulary: [
      "Amortir les coûts d'entretien",
      "Une démarche éco-responsable",
      "Bénéfice collatéral indéniable",
      "Alléger la charge mentale des embouteillages",
    ],
    recommendedArguments: [
      "Réfuter l'argument du manque de liberté en proposant un essai sans engagement d'une semaine.",
      "Souligner l'économie financière concrète sur le carburant et le stationnement.",
    ],
    targetHref: "/examens/demo-101-eo/intro",
  },
  {
    id: "topic-eo-3-01",
    discipline: "EO",
    taskNumber: 3,
    taskLabel: "Expression Orale — Tâche 3 (Monologue Argumenté)",
    title: "La semaine de travail de 4 jours : utopie sociale ou impératif économique ?",
    sessionDate: "Session Septembre 2026",
    testCenter: "Centre Agréé Tunis & Yaoundé",
    prompt:
      "L'examinateur vous pose la question suivante : 'Pensez-vous que la réduction du temps de travail à 4 jours hebdomadaires améliore réellement la productivité et le bien-être des salariés ?' Vous devez exposer votre point de vue de manière structurée et continue pendant 4 minutes 30.",
    c1Vocabulary: [
      "Conciliation vie professionnelle / vie privée",
      "Gain substantiel d'efficience",
      "Gouffre financier pour les PME",
      "Repenser le paradigme salarial",
    ],
    recommendedArguments: [
      "Partie 1 : Baisse du surmenage (burnout) et regain de motivation.",
      "Partie 2 : Limites logistiques dans les secteurs de la santé ou du service continu.",
      "Conclusion : Nécessité d'une modulation par branche d'activité.",
    ],
    targetHref: "/examens/demo-101-eo/intro",
  },
];

export default function SujetsRecentsPage() {
  const [filter, setFilter] = useState<"ALL" | "EE3" | "EE2" | "EO2" | "EO3">("ALL");

  const filtered = RECENT_TOPICS.filter((t) => {
    if (filter === "ALL") return true;
    if (filter === "EE3") return t.discipline === "EE" && t.taskNumber === 3;
    if (filter === "EE2") return t.discipline === "EE" && t.taskNumber === 2;
    if (filter === "EO2") return t.discipline === "EO" && t.taskNumber === 2;
    if (filter === "EO3") return t.discipline === "EO" && t.taskNumber === 3;
    return true;
  });

  return (
    <div className="mx-auto max-w-5xl space-y-12 py-4">
      {/* 🧭 En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b pb-6">
        <div className="space-y-3 max-w-3xl">
          <span className="rounded-full bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary inline-flex items-center gap-1.5">
            <BookMarked className="h-3.5 w-3.5" /> Veille Continue des Centres FEI 2026
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-foreground">
            Banque des Sujets Récents d&apos;Expression
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Accédez aux vrais sujets rapportés par les candidats lors des sessions officielles récentes, enrichis de suggestions lexicales C1/C2 et d&apos;un accès direct au simulateur d&apos;examen.
          </p>
        </div>
        <div className="shrink-0 flex items-center justify-center p-2 rounded-3xl bg-primary/5 border border-primary/20 shadow-sm">
          <Image
            src="/brand/icons-3d/radar-recent-topics.png"
            alt="Veille Sujets Récents 3D"
            width={90}
            height={90}
            className="h-20 w-20 object-contain drop-shadow-md"
            priority
          />
        </div>
      </div>

      {/* 🔍 Filtres */}
      <div className="flex flex-wrap gap-2 pt-1 border-b pb-4">
        {(
          [
            { key: "ALL", label: "Tous les Sujets (4)" },
            { key: "EE3", label: "Écrit — Tâche 3 (Essai)" },
            { key: "EE2", label: "Écrit — Tâche 2 (Récit)" },
            { key: "EO2", label: "Oral — Tâche 2 (Jeu de rôle)" },
            { key: "EO3", label: "Oral — Tâche 3 (Monologue)" },
          ] as const
        ).map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              filter === f.key
                ? "bg-primary text-white shadow-xs"
                : "border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 📚 Liste des Sujets Récents */}
      <div className="space-y-6">
        {filtered.map((topic) => (
          <div
            key={topic.id}
            className="rounded-3xl border bg-card p-6 sm:p-8 shadow-xs transition-all hover:border-primary/40 hover:shadow-lg space-y-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="rounded-md border bg-muted px-2.5 py-0.5 font-bold text-foreground">
                  {topic.taskLabel}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground font-mono">
                  <Calendar className="h-3.5 w-3.5" /> {topic.sessionDate}
                </span>
              </div>

              <span className="flex items-center gap-1 text-muted-foreground font-medium text-xs">
                <MapPin className="h-3.5 w-3.5 text-primary" /> {topic.testCenter}
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                {topic.title}
              </h2>
              <div className="rounded-2xl border bg-muted/30 p-4 text-xs sm:text-sm text-foreground/90 leading-relaxed font-serif">
                « {topic.prompt} »
              </div>
            </div>

            {/* Boîte à outils Lexicale C1/C2 */}
            <div className="grid gap-4 sm:grid-cols-2 text-xs">
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-2">
                <span className="font-bold text-primary flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" /> Lexique & Tournures C1/C2 Recommandées
                </span>
                <ul className="space-y-1 text-muted-foreground">
                  {topic.c1Vocabulary.map((vocab, vIdx) => (
                    <li key={vIdx} className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      <strong className="text-foreground">{vocab}</strong>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Lightbulb className="h-3.5 w-3.5" /> Pistes d&apos;Argumentation NCLC 7
                </span>
                <ul className="space-y-1.5 text-muted-foreground">
                  {topic.recommendedArguments.map((arg, aIdx) => (
                    <li key={aIdx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{arg}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Entraînez-vous à rédiger ou enregistrer votre réponse sous chronomètre officiel.
              </p>

              <Button asChild className="bg-primary hover:bg-primary-dark text-white font-bold text-xs h-10 w-full sm:w-auto">
                <Link href={topic.targetHref}>
                  S&apos;entraîner sur ce sujet en mode CBT
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
