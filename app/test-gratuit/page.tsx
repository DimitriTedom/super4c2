"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Headphones,
  RotateCcw,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { cn } from "@/lib/utils";

interface DiagnosticQuestion {
  id: number;
  type: "CE" | "CO" | "GRAMMAR" | "EXPRESSION";
  typeLabel: string;
  nclcTarget: number;
  documentTitle?: string;
  documentText?: string;
  audioPrompt?: string;
  prompt: string;
  options?: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctOption?: "A" | "B" | "C" | "D";
  explanation?: string;
}

const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 1,
    type: "CE",
    typeLabel: "Compréhension Écrite — Niveau B1",
    nclcTarget: 5,
    documentTitle: "Courriel professionnel",
    documentText:
      "Bonjour à tous,\n\nEn raison de la maintenance trimestrielle de notre serveur informatique, les services de messagerie et de partage de fichiers seront inaccessibles ce vendredi à partir de 18h00 jusqu'à samedi midi. Merci d'enregistrer vos dossiers locaux avant le début de l'intervention.\n\nLa Direction des Systèmes d'Information",
    prompt: "Que doivent obligatoirement faire les employés avant vendredi 18h00 ?",
    options: {
      A: "Transférer tous leurs courriels sur leur boîte personnelle.",
      B: "Sauvegarder leurs fichiers en local sur leur poste.",
      C: "Venir travailler au bureau le samedi matin.",
      D: "Contacter le service informatique pour obtenir un accès d'urgence.",
    },
    correctOption: "B",
    explanation:
      "Le texte indique explicitement : « Merci d'enregistrer vos dossiers locaux avant le début de l'intervention ».",
  },
  {
    id: 2,
    type: "CE",
    typeLabel: "Compréhension Écrite — Seuil NCLC 7 (B2)",
    nclcTarget: 7,
    documentTitle: "Revue Économique Canadienne",
    documentText:
      "Bien que l'automatisation suscite des craintes légitimes quant à la pérennité de certains emplois administratifs, le marché du travail canadien démontre une capacité d'adaptation remarquable. L'émergence de nouveaux métiers axés sur la gouvernance des données compense largement les suppressions de postes traditionnels, à condition que la requalification professionnelle soit anticipée.",
    prompt: "Quelle est la conclusion principale de l'auteur concernant l'automatisation au Canada ?",
    options: {
      A: "Elle détruit plus d'emplois qu'elle n'en crée à moyen terme.",
      B: "Elle sera ralentie par manque de formation des salariés.",
      C: "Elle crée de nouvelles opportunités si les compétences évoluent en amont.",
      D: "Elle épargne totalement les postes administratifs existants.",
    },
    correctOption: "C",
    explanation:
      "La phrase clé « compense largement... à condition que la requalification professionnelle soit anticipée » confirme l'option C.",
  },
  {
    id: 3,
    type: "CO",
    typeLabel: "Compréhension Orale — Seuil NCLC 7/8",
    nclcTarget: 7,
    audioPrompt:
      "« Chers passagers, en raison d'un signalement météorologique défavorable sur la région des Laurentides, le départ de notre train vers Québec prévu à 14h15 est décalé de quarante minutes. Les voyageurs munis d'une correspondance sont invités à se présenter au comptoir d'information en tête de quai. »",
    prompt: "Pour quelle raison exacte le train est-il retardé ?",
    options: {
      A: "Une avarie technique sur la locomotive.",
      B: "Des conditions climatiques perturbées sur le trajet.",
      C: "Une affluence exceptionnelle de voyageurs sur le quai.",
      D: "Une grève inattendue du personnel ferroviaire.",
    },
    correctOption: "B",
    explanation:
      "L'annonce mentionne « un signalement météorologique défavorable », c'est-à-dire le mauvais temps.",
  },
  {
    id: 4,
    type: "GRAMMAR",
    typeLabel: "Morphosyntaxe & Nuance — Niveau C1",
    nclcTarget: 9,
    prompt:
      "Complétez la phrase : « Bien qu'il ______ de nombreux arguments persuasifs lors de la délibération, la commission n'a pas validé sa candidature. »",
    options: {
      A: "avait avancé",
      B: "ait avancé",
      C: "aura avancé",
      D: "avançait",
    },
    correctOption: "B",
    explanation:
      "La locution conjonctive concessive « Bien que » exige impérativement l'emploi du subjonctif (ici subjonctif passé : « ait avancé »).",
  },
];

export default function TestGratuitPage() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, "A" | "B" | "C" | "D">>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isSimulatingAudio, setIsSimulatingAudio] = useState<boolean>(false);

  const totalQuestions = DIAGNOSTIC_QUESTIONS.length;
  const currentQ = DIAGNOSTIC_QUESTIONS[currentStep];

  const handleSelectOption = (option: "A" | "B" | "C" | "D") => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: option,
    }));
  };

  const handleNext = () => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentStep(0);
    setIsCompleted(false);
  };

  // Calcul du score
  let correctCount = 0;
  DIAGNOSTIC_QUESTIONS.forEach((q) => {
    if (selectedAnswers[q.id] === q.correctOption) {
      correctCount += 1;
    }
  });

  let estimatedNclc = 5;
  let estimatedTcf = "370 - 410 pts";
  let statusBadge = "Niveau B1 (Intermédiaire)";
  let crsUnlocked = false;

  if (correctCount === 4) {
    estimatedNclc = 9;
    estimatedTcf = "540 - 590 pts";
    statusBadge = "Niveau C1 (Autonome Supérieur)";
    crsUnlocked = true;
  } else if (correctCount === 3) {
    estimatedNclc = 7;
    estimatedTcf = "460 - 510 pts";
    statusBadge = "Niveau B2 (Seuil NCLC 7 Confirmé)";
    crsUnlocked = true;
  } else if (correctCount === 2) {
    estimatedNclc = 6;
    estimatedTcf = "420 - 455 pts";
    statusBadge = "Niveau B1+ (À 1 échelon du palier NCLC 7)";
    crsUnlocked = false;
  }

  return (
    <div className="mx-auto max-w-4xl py-6 sm:py-10 space-y-8">
      {/* En-tête */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-1 text-xs font-bold shadow-xs">
          <Sparkles className="h-3.5 w-3.5 text-brand-crimson" />
          <AnimatedShinyText shimmerWidth={120}>
            Diagnostic Express TCF &amp; TEF Canada (5 minutes)
          </AnimatedShinyText>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-foreground text-balance">
          Estimez votre niveau NCLC et vos{" "}
          <span className="text-brand-crimson">+50 Points</span> CRS
        </h1>
        <p className="font-body text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Testez vos réflexes sur 4 questions clés représentatives des épreuves officielles CBT de France Éducation International.
        </p>
      </div>

      {!isCompleted ? (
        <div className="rounded-3xl border bg-card p-6 sm:p-8 shadow-sm space-y-6">
          {/* Barre de progression */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
              <span>
                Question {currentStep + 1} sur {totalQuestions}
              </span>
              <span className="text-primary">{currentQ.typeLabel}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-crimson to-rose-500 transition-all duration-300"
                style={{ width: `${((currentStep + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Document / Support */}
          {currentQ.documentText && (
            <div className="rounded-2xl border bg-muted/40 p-5 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {currentQ.documentTitle || "Document officiel :"}
              </p>
              <p className="text-sm sm:text-base font-body leading-relaxed text-foreground whitespace-pre-line">
                {currentQ.documentText}
              </p>
            </div>
          )}

          {/* Message Audio simulé pour CO */}
          {currentQ.audioPrompt && (
            <div className="rounded-2xl border bg-cyan-500/10 border-cyan-500/30 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-xs uppercase tracking-wider">
                  <Headphones className="h-4 w-4" />
                  <span>Extrait Audio Mono-Écoute (Simulation)</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsSimulatingAudio(true);
                    if (typeof window !== "undefined" && "speechSynthesis" in window) {
                      window.speechSynthesis.cancel();
                      const u = new SpeechSynthesisUtterance(currentQ.audioPrompt || "");
                      u.lang = "fr-FR";
                      u.rate = 0.95;
                      u.onend = () => setIsSimulatingAudio(false);
                      window.speechSynthesis.speak(u);
                    }
                  }}
                  className="gap-2 text-xs"
                >
                  <Volume2 className={cn("h-4 w-4", isSimulatingAudio && "animate-pulse text-cyan-500")} />
                  {isSimulatingAudio ? "Lecture en cours..." : "Écouter l'extrait vocal"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground italic">
                {isSimulatingAudio
                  ? "🎧 Écoutez attentivement le message..."
                  : "Cliquez sur « Écouter l'extrait vocal » pour entendre le dialogue comme au jour J."}
              </p>
            </div>
          )}

          {/* Consigne / Prompt */}
          <div className="space-y-2">
            <h2 className="font-display text-lg sm:text-xl font-bold text-foreground">
              {currentQ.prompt}
            </h2>
          </div>

          {/* Options de réponse */}
          {currentQ.options && (
            <div className="grid gap-3 sm:grid-cols-2 pt-2">
              {(["A", "B", "C", "D"] as const).map((letter) => {
                const isSelected = selectedAnswers[currentQ.id] === letter;
                return (
                  <button
                    key={letter}
                    type="button"
                    onClick={() => handleSelectOption(letter)}
                    className={cn(
                      "flex items-start gap-3 rounded-2xl border p-4 text-left transition-all",
                      isSelected
                        ? "border-brand-crimson bg-brand-crimson/10 shadow-xs ring-1 ring-brand-crimson"
                        : "border-border/80 bg-background hover:border-primary/50 hover:bg-muted/50"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-bold",
                        isSelected
                          ? "bg-brand-crimson text-white"
                          : "border bg-muted text-muted-foreground"
                      )}
                    >
                      {letter}
                    </span>
                    <span className="text-xs sm:text-sm font-body leading-relaxed text-foreground">
                      {currentQ.options![letter]}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Action suivante */}
          <div className="flex justify-end pt-4 border-t">
            <Button
              onClick={handleNext}
              disabled={!selectedAnswers[currentQ.id]}
              className="gap-2 px-6"
            >
              <span>{currentStep < totalQuestions - 1 ? "Question suivante" : "Voir mon bilan NCLC"}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        /* 📊 Écran des Résultats Diagnostiques */
        <div className="rounded-3xl border bg-card p-6 sm:p-10 shadow-md space-y-8">
          <div className="text-center space-y-3 border-b pb-8">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" /> Bilan Diagnostique Validé
            </span>

            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground">
              Votre Niveau Estimé :{" "}
              <span className="text-brand-crimson">NCLC {estimatedNclc}</span>
            </h2>
            <p className="text-sm text-muted-foreground font-medium">{statusBadge}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto pt-6 text-center">
              <div className="rounded-2xl border bg-background p-4">
                <p className="text-xs text-muted-foreground">Bonnes réponses</p>
                <p className="font-display text-3xl font-black text-foreground mt-1">
                  {correctCount} <span className="text-sm font-normal text-muted-foreground">/ 4</span>
                </p>
              </div>

              <div className="rounded-2xl border bg-background p-4">
                <p className="text-xs text-muted-foreground">Fourchette TCF</p>
                <p className="font-display text-lg font-black text-foreground mt-2 truncate">
                  {estimatedTcf}
                </p>
              </div>

              <div className="rounded-2xl border bg-background p-4">
                <p className="text-xs text-muted-foreground">Palier NCLC 7</p>
                <p
                  className={cn(
                    "font-display text-lg font-black mt-2",
                    crsUnlocked
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-amber-600 dark:text-amber-400"
                  )}
                >
                  {crsUnlocked ? "Validé ✓" : "En cours (B1)"}
                </p>
              </div>

              <div className="rounded-2xl border bg-background p-4">
                <p className="text-xs text-muted-foreground">Bonus CRS Canada</p>
                <p
                  className={cn(
                    "font-display text-3xl font-black mt-1",
                    crsUnlocked
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-brand-crimson"
                  )}
                >
                  {crsUnlocked ? "+50 pts" : "0 pt"}
                </p>
              </div>
            </div>
          </div>

          {/* Débrief personnalisé */}
          <div className="space-y-4">
            <h3 className="font-display text-lg font-bold text-foreground">
              Analyse de votre potentiel d&apos;immigration :
            </h3>
            <div className="rounded-2xl border bg-muted/30 p-5 text-sm leading-relaxed text-foreground space-y-2">
              {crsUnlocked ? (
                <p>
                  🎉 <strong>Excellente nouvelle !</strong> Vos bases sont solides et vous vous situez déjà dans le corridor du palier NCLC 7 (B2 / C1). Pour sécuriser vos 4 épreuves le jour J (notamment l&apos;Oral avec le jeu de rôle et l&apos;Écrit), un entraînement intensif sur le format officiel CBT FEI vous permettra de garantir vos <strong>+50 points Entrée Express</strong>.
                </p>
              ) : (
                <p>
                  💡 <strong>Vous êtes à portée du seuil décisif !</strong> Avec un score NCLC 5-6, il ne vous manque que <strong>1 palier linguistique</strong> pour débloquer les 50 points de résidence permanente. Les erreurs courantes résident dans la gestion du chronomètre et les pièges d&apos;inférence lexicale que notre simulateur corrige automatiquement.
                </p>
              )}
            </div>
          </div>

          {/* Recommandations & Passage à l'Action */}
          <div className="rounded-2xl bg-gradient-to-br from-brand-crimson/10 via-background to-cyan-500/10 border p-6 sm:p-8 space-y-6 text-center">
            <div className="space-y-2 max-w-xl mx-auto">
              <h3 className="font-display text-2xl font-black text-foreground">
                Prêt à vous entraîner dans les conditions réelles ?
              </h3>
              <p className="text-sm text-muted-foreground">
                Accédez à nos 4 épreuves officielles complètes, notre correcteur d&apos;Expression Écrite instantané et notre examinateur vocal IA en jeu de rôle.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <ShimmerButton
                href="/examens"
                background="#E51A31"
                shimmerColor="#ffffff"
                className="w-full sm:w-auto shadow-lg"
              >
                <span className="flex items-center gap-2 font-semibold">
                  Lancer une simulation complète
                  <ArrowRight className="h-4 w-4" />
                </span>
              </ShimmerButton>

              <InteractiveHoverButton href="/dashboard" className="w-full sm:w-auto">
                Accéder à mon cockpit gratuit
              </InteractiveHoverButton>

              <Button variant="ghost" size="sm" onClick={handleRestart} className="gap-2 text-xs">
                <RotateCcw className="h-3.5 w-3.5" /> Recommencer le test
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
