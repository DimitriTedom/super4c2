"use client";

import React, { useState } from "react";
import { CheckCircle2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorItem {
  id: string;
  discipline: "CE" | "CO" | "EE" | "EO";
  questionNumber: number;
  questionPrompt: string;
  candidateMistake: string;
  correctAnswer: string;
  ruleExplanation: string;
  trapType: string;
  nextReviewDays: number;
  masteryLevel: 1 | 2 | 3; // 1: À revoir (J+1), 2: En cours (J+3), 3: Maîtrisé (J+7)
}

const INITIAL_ERRORS: ErrorItem[] = [
  {
    id: "err-1",
    discipline: "CE",
    questionNumber: 4,
    questionPrompt: "Que laisse entendre l'auteur à propos du ministre ?",
    candidateMistake: "A. Il a déjà quitté ses fonctions.",
    correctAnswer: "B. Il hésite à tenir sa promesse de départ.",
    ruleExplanation:
      "L'expression « n'a jamais franchi le pas » exprime l'hésitation ou l'ajournement, pas l'accomplissement d'une action passée.",
    trapType: "Confusion d'aspect verbal (accompli vs inachevé)",
    nextReviewDays: 1,
    masteryLevel: 1,
  },
  {
    id: "err-2",
    discipline: "CO",
    questionNumber: 2,
    questionPrompt: "Quelle information est donnée sur le train de Lyon ?",
    candidateMistake: "A. Le train pour Lyon est supprimé.",
    correctAnswer: "C. Le train pour Lyon est en retard.",
    ruleExplanation:
      "« Aura quarante minutes de retard » est un retard partiel et temporaire, à ne pas confondre avec l'annulation ou la suppression du service.",
    trapType: "Amplification excessive / Distracteur extrême",
    nextReviewDays: 3,
    masteryLevel: 2,
  },
  {
    id: "err-3",
    discipline: "EE",
    questionNumber: 2,
    questionPrompt: "Tâche 2 — Récit d'événement associatif",
    candidateMistake: "Volume insuffisant : 98 mots rédigés.",
    correctAnswer: "Fourchette obligatoire : 120 à 150 mots.",
    ruleExplanation:
      "En Tâche 2 du TCF, tout texte en dessous de 120 mots subit une pénalité sévère sur le critère 1 (Adéquation à la situation). Développez systématiquement un argument supplémentaire.",
    trapType: "Non-respect du seuil de volume FEI",
    nextReviewDays: 1,
    masteryLevel: 1,
  },
  {
    id: "err-4",
    discipline: "EO",
    questionNumber: 2,
    questionPrompt: "Tâche 2 — Formules de relance en jeu de rôle",
    candidateMistake: "« Vous avez des réductions ? » (registre familier)",
    correctAnswer: "« Proposez-vous un tarif préférentiel ou dégressif ? » (registre soutenu)",
    ruleExplanation:
      "Pour valider l'échelon B2/NCLC 7 à l'oral, variez vos structures interrogatives en employant le conditionnel de politesse et un vocabulaire commercial soutenu.",
    trapType: "Registre de langue insuffisant pour NCLC 7",
    nextReviewDays: 7,
    masteryLevel: 3,
  },
];

export function SrsCarnet() {
  const [items, setItems] = useState<ErrorItem[]>(INITIAL_ERRORS);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("ALL");

  const filtered = items.filter((item) =>
    selectedDiscipline === "ALL" ? true : item.discipline === selectedDiscipline
  );

  const handleMarkReviewed = (id: string) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          const nextLevel = it.masteryLevel === 1 ? 2 : 3;
          const nextDays = nextLevel === 2 ? 3 : 7;
          return { ...it, masteryLevel: nextLevel as 1 | 2 | 3, nextReviewDays: nextDays };
        }
        return it;
      })
    );
  };

  return (
    <div className="space-y-8">
      {/* Statistiques SRS */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            À Réviser Aujourd&apos;hui (J+1)
          </p>
          <p className="font-display text-3xl font-black text-[#E51A31] mt-2">
            {items.filter((i) => i.masteryLevel === 1).length} pièges
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            En Cours d&apos;Ancrage (J+3)
          </p>
          <p className="font-display text-3xl font-black text-amber-500 mt-2">
            {items.filter((i) => i.masteryLevel === 2).length} pièges
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Totalement Maîtrisés (J+7)
          </p>
          <p className="font-display text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            {items.filter((i) => i.masteryLevel === 3).length} pièges
          </p>
        </div>
      </div>

      {/* Filtres par épreuve */}
      <div className="flex flex-wrap items-center gap-2 border-b pb-4">
        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mr-2">
          <Filter className="h-3.5 w-3.5" />
          Filtrer par épreuve :
        </span>
        {[
          { key: "ALL", label: "Tous les pièges" },
          { key: "CE", label: "Compréhension Écrite" },
          { key: "CO", label: "Compréhension Orale" },
          { key: "EE", label: "Expression Écrite" },
          { key: "EO", label: "Expression Orale" },
        ].map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setSelectedDiscipline(f.key)}
            className={cn(
              "rounded-full px-3.5 py-1 text-xs font-medium transition-colors border",
              selectedDiscipline === f.key
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Liste des cartes d'erreurs SRS */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border bg-card p-6 shadow-sm space-y-4 transition-all hover:border-primary/40"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs font-bold text-primary">
                  {item.discipline} · Q{item.questionNumber}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  {item.trapType}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-xs font-mono font-bold px-2 py-0.5 rounded-full border",
                    item.masteryLevel === 1
                      ? "bg-red-500/10 text-red-600 border-red-500/20"
                      : item.masteryLevel === 2
                      ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                      : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                  )}
                >
                  Prochaine révision : dans {item.nextReviewDays} jour(s)
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-base font-bold text-foreground">
                {item.questionPrompt}
              </h3>

              <div className="grid gap-3 sm:grid-cols-2 text-xs">
                <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-3">
                  <p className="font-bold text-red-600 dark:text-red-400 mb-1">
                    Votre erreur commise :
                  </p>
                  <p className="text-foreground/80">{item.candidateMistake}</p>
                </div>

                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3">
                  <p className="font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                    Réponse conforme & attendue :
                  </p>
                  <p className="text-foreground/80">{item.correctAnswer}</p>
                </div>
              </div>
            </div>

            {/* Explication pédagogique */}
            <div className="rounded-xl bg-muted/40 p-4 text-xs space-y-1">
              <p className="font-bold text-foreground">Règle & Astuce Anti-Piège :</p>
              <p className="text-muted-foreground leading-relaxed">{item.ruleExplanation}</p>
            </div>

            {/* Bouton d'action SRS */}
            <div className="flex justify-end pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMarkReviewed(item.id)}
                className="gap-1.5 text-xs"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>J&apos;ai compris — Programmer l&apos;intervalle suivant</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
