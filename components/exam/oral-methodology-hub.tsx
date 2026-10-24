"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Mic,
  Award,
  Layers,
  Volume2,
  VolumeX,
  FileText,
  Lightbulb,
  MessageSquare,
  Bot,
  UserCheck,
  HelpCircle,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompanionSelectorDialog } from "@/components/companions/companion-selector-dialog";
import {
  COMPANIONS,
  type CompanionId,
  DEFAULT_COMPANION_ID,
  getCompanionById,
} from "@/lib/companions/data";
import { type OralSeries } from "@/lib/exam/oral-types";
import { OralHardwareCheck } from "@/components/exam/oral-hardware-check";
import { cn } from "@/lib/utils";

interface OralMethodologyHubProps {
  series: OralSeries;
  initialTab?: "presentation" | "methodologie" | "examen";
}

export function OralMethodologyHub({
  series,
  initialTab = "presentation",
}: OralMethodologyHubProps) {
  const [companionId, setCompanionId] = useState<CompanionId>(DEFAULT_COMPANION_ID);
  const [isSelectorOpen, setIsSelectorOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"presentation" | "methodologie" | "examen">(initialTab);
  const [activeTaskTab, setActiveTaskTab] = useState<1 | 2 | 3>(1);
  const [hydrated, setHydrated] = useState<boolean>(false);
  const [isSpeakingTour, setIsSpeakingTour] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("super4c2:user_companion") as CompanionId;
      if (saved && COMPANIONS[saved]) {
        setCompanionId(saved);
      }
    } catch {}
    setHydrated(true);
  }, []);

  const handleSelectCompanion = (id: CompanionId) => {
    setCompanionId(id);
    try {
      localStorage.setItem("super4c2:user_companion", id);
    } catch {}
  };

  const currentCompanion = getCompanionById(companionId);
  const audioPlayerRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleVoiceTour = () => {
    if (isSpeakingTour) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeakingTour(false);
      return;
    }

    setIsSpeakingTour(true);
    const speechText =
      "Bonjour et bienvenue dans l'espace d'Expression Orale du TCF Canada. Je m'appelle Laurent Mercier et je serai votre examinateur. L'épreuve dure 12 minutes et comporte trois tâches obligatoires : d'abord, un entretien dirigé de présentation personnelle sans préparation. Ensuite, un jeu de rôle interactif où vous devez me poser une dizaine de questions précises pour obtenir des informations. Enfin, un monologue d'argumentation sur un sujet de société. Découvrez la méthodologie détaillée de chaque tâche, puis lancez votre entraînement en conditions réelles.";

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.lang = "fr-FR";
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeakingTour(false);
      utterance.onerror = () => setIsSpeakingTour(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeakingTour(false);
    }
  };

  const task1 = series.tasks[0];
  const task2 = series.tasks[1];
  const task3 = series.tasks[2];

  return (
    <div className="mx-auto max-w-5xl space-y-8 py-4">
      {/* ========================================================================= */}
      {/* 🧭 EN-TÊTE SUPÉRIEUR & COMPAGNON EXAMINATEUR                             */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 p-2 shadow-sm border border-primary/20">
            <Image
              src="/brand/icons-3d/expression-orale-microphone.png"
              alt="Expression Orale TCF"
              width={64}
              height={64}
              className="h-12 w-12 object-contain drop-shadow-sm"
              priority
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Mic className="h-3.5 w-3.5" />
                Format Officiel France Éducation International (FEI)
              </span>
              <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono font-bold">
                TCF Canada • 12 min
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              {series.title}
            </h1>
          </div>
        </div>

        {/* Bouton de retour vers le catalogue */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="rounded-xl gap-2 h-9 px-3.5 border-border/80 font-bold text-xs shadow-2xs group cursor-pointer"
          >
            <Link href="/examens?discipline=eo">
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1 text-primary" />
              <span>Catalogue des Sujets</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🧑‍🏫 ENCART COMPAGNON PEDAGOGIQUE LAURENT MERCIER                         */}
      {/* ========================================================================= */}
      <div className="rounded-3xl border border-primary/30 bg-gradient-to-r from-primary/10 via-card to-amber-500/10 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 shrink-0 rounded-2xl overflow-hidden border-2 border-primary/40 shadow-md">
              <Image
                src={currentCompanion.avatarUrl}
                alt={currentCompanion.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-base text-foreground">
                  {currentCompanion.name}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                  Examinateur TCF Certifié
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
                « Pour décrocher les 50 points d&apos;Entrée Express, vous devez impérativement valider le <strong>NCLC 7 (score $\ge 10/20$)</strong>. En Tâche 2, c&apos;est vous qui menez l&apos;entretien : ne subissez pas l&apos;épreuve, posez des questions variées ! »
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleToggleVoiceTour}
              className={cn(
                "rounded-xl gap-2 font-bold text-xs h-9 cursor-pointer transition-all",
                isSpeakingTour
                  ? "bg-primary text-primary-foreground border-primary animate-pulse"
                  : "bg-card text-foreground"
              )}
            >
              {isSpeakingTour ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-primary" />}
              <span>{isSpeakingTour ? "Arrêter la voix" : "Écouter le Briefing"}</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsSelectorOpen(true)}
              className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Changer
            </Button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🧭 NAVIGATION DES 3 GRANDS TITRES OFFICIELS                                */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-muted/30 p-1.5 rounded-2xl border border-border/60">
        <button
          type="button"
          onClick={() => setActiveTab("presentation")}
          className={cn(
            "flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer",
            activeTab === "presentation"
              ? "bg-card text-foreground shadow-sm border border-primary/30"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          )}
        >
          <Award className="h-4 w-4 text-primary" />
          <span>1. Présentation &amp; Grille FEI</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("methodologie")}
          className={cn(
            "flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer",
            activeTab === "methodologie"
              ? "bg-card text-foreground shadow-sm border border-amber-500/40"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          )}
        >
          <Lightbulb className="h-4 w-4 text-amber-500" />
          <span>2. Méthodologie &amp; Entraînement</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("examen")}
          className={cn(
            "flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer",
            activeTab === "examen"
              ? "bg-card text-foreground shadow-sm border border-emerald-500/40"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          )}
        >
          <Mic className="h-4 w-4 text-emerald-500" />
          <span>3. Simulation Complète (12 min)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 🎙️ CONTENU GRAND TITRE 1 : PRÉSENTATION & GRILLE CRITÉRIÉE FEI (20 PTS)    */}
      {/* ========================================================================= */}
      {activeTab === "presentation" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Calibrage Matériel Interactif */}
          <OralHardwareCheck seriesId={series.id} />

          {/* Grille FEI Officielle sur 20 Points */}
          <div className="rounded-3xl border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="border-b pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Barème Réglementaire France Éducation International
              </span>
              <h2 className="font-display text-2xl font-black text-foreground mt-0.5">
                La Grille Officielle des 5 Critères d&apos;Évaluation (20 Points)
              </h2>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Chaque critère est noté sur <strong>4 points</strong> par l&apos;examinateur, pour un total de <strong>20 points</strong>. Ces critères sont universels et identiques pour toutes les sessions TCF Canada dans le monde.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  criterion: "Aisance & Débit",
                  pts: "4 points",
                  desc: "Continuité de la parole, naturel des enchaînements et absence de silences anormaux. Débit attendu : 90 à 130 mots/minute.",
                  key: "Évitez les 'euh...' prolongés en meublant avec des connecteurs de réflexion.",
                },
                {
                  criterion: "Compétence Phonologique",
                  pts: "4 points",
                  desc: "Intelligibilité, clarté articulatoire, respect des liaisons obligatoires et intonation assertive adaptée aux questions.",
                  key: "Montez la voix en fin d'interrogation en Tâche 2 pour marquer la question.",
                },
                {
                  criterion: "Richesse & Précision Lexicale",
                  pts: "4 points",
                  desc: "Étendue du vocabulaire, précision des termes spécifiques au sujet et absence de répétitions ou de calques de langue maternelle.",
                  key: "Employez des termes techniques et des synonymes soutenus pour viser NCLC 8+.",
                },
                {
                  criterion: "Morphosyntaxe & Structures",
                  pts: "4 points",
                  desc: "Correction grammaticale, maîtrise des temps verbaux (passé, présent, futur) et intégration de phrases complexes (subjonctif, conditionnel).",
                  key: "Le conditionnel de politesse (« Pourriez-vous... ? ») est impératif en Tâche 2.",
                },
                {
                  criterion: "Interaction & Réactivité",
                  pts: "4 points",
                  desc: "Aptitude à relancer l'examinateur en Tâche 2, pertinence des rebonds et compréhension immédiate des objections en Tâche 3.",
                  key: "Ne laissez jamais l'examinateur parler seul : rebondissez activement sur ses réponses !",
                },
              ].map((item, idx) => (
                <div key={idx} className="rounded-2xl border bg-muted/20 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">{item.criterion}</span>
                    <span className="text-[11px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                      {item.pts}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-snug">{item.desc}</p>
                  <div className="pt-2 border-t border-border/40 text-[11px] text-foreground/90 font-sans italic">
                    💡 Conseil FEI : {item.key}
                  </div>
                </div>
              ))}
            </div>

            {/* Paliers NCLC & Bonus CRS Canada */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <h3 className="font-display font-bold text-sm text-foreground">
                  Équivalences NCLC &amp; Seuil Critique Entrée Express
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Pour débloquer les <strong>+50 points de transférabilité CRS</strong> pour l&apos;immigration permanente au Canada, vous devez valider au minimum le palier <strong>NCLC 7 (Note $\ge 10/20$, soit 458+ points TCF)</strong>. Obtenir 14/20 vous classe au palier NCLC 8, et 16/20+ au palier C1/C2 (NCLC 9-10).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 📄 CONTENU GRAND TITRE 2 : MÉTHODOLOGIE & ENTRAÎNEMENT PAR TÂCHE           */}
      {/* ========================================================================= */}
      {activeTab === "methodologie" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Sous-navigation Tâche 1 / Tâche 2 / Tâche 3 */}
          <div className="flex border-b bg-muted/40 p-1.5 rounded-2xl gap-2">
            <button
              type="button"
              onClick={() => setActiveTaskTab(1)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold transition-all cursor-pointer",
                activeTaskTab === 1
                  ? "bg-card text-foreground shadow-xs border border-primary/40"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <FileText className="h-4 w-4 text-primary" />
              <span>Tâche 1 (Entretien Dirigé • 2 min)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTaskTab(2)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold transition-all cursor-pointer",
                activeTaskTab === 2
                  ? "bg-card text-foreground shadow-xs border border-amber-500/40"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <MessageSquare className="h-4 w-4 text-amber-500" />
              <span>Tâche 2 (Jeu de Rôle • 3.5 min)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTaskTab(3)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold transition-all cursor-pointer",
                activeTaskTab === 3
                  ? "bg-card text-foreground shadow-xs border border-cyan-500/40"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <Award className="h-4 w-4 text-cyan-500" />
              <span>Tâche 3 (Argumentation • 4.5 min)</span>
            </button>
          </div>

          {/* Bandeau d'Appel à l'Action Examen Complet */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border-2 border-primary/30 bg-gradient-to-r from-primary/10 via-card to-emerald-500/10 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-display font-black text-sm text-foreground">
                  Prêt pour l&apos;examen officiel en 12 minutes réelles ?
                </span>
                <span className="rounded-full bg-primary/15 text-primary border border-primary/30 px-2 py-0.5 text-[10px] font-bold">
                  Format Examen 12 min
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                L&apos;entretien officiel regroupe les 3 tâches consécutives sans pause. Testez votre endurance et votre réactivité avec Laurent.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="bg-brand-crimson hover:bg-brand-crimson/90 text-white font-black text-sm px-6 h-11 rounded-xl shadow-md gap-2 shrink-0 cursor-pointer"
            >
              <Link href={`/examens/${series.id}/eo?mode=exam&start=true`}>
                <Mic className="h-4 w-4" />
                <span>Démarrer l&apos;Oral Complet (12:00)</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* ================================================================= */}
          {/* TÂCHE 1 : ENTRETIEN DIRIGÉ (2 MIN)                                */}
          {/* ================================================================= */}
          {activeTaskTab === 1 && (
            <div className="space-y-6">
              <div className="rounded-3xl border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="border-b pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    Tâche 1 • 2 Minutes Chrono • Sans Préparation • Niveaux A1-B1
                  </span>
                  <h2 className="font-display text-2xl font-black text-foreground mt-0.5">
                    Entretien Dirigé (Se Présenter, Environnement &amp; Motivations)
                  </h2>
                </div>

                <div className="space-y-3">
                  <h3 className="font-display text-sm font-bold text-foreground">
                    La Méthodologie en 3 Axes pour Séduire l&apos;Examinateur dès la 1ère Minute :
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-3 text-xs">
                    <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                      <p className="font-bold text-primary">1. Identité &amp; Parcours Pro</p>
                      <p className="text-muted-foreground">Nom, métier, domaine d&apos;expertise et réalisations concrètes avec des verbes d&apos;action précis.</p>
                    </div>
                    <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                      <p className="font-bold text-primary">2. Projet d&apos;Immigration</p>
                      <p className="text-muted-foreground">Expliciter clairement vos motivations pour le Canada (province visée, perspectives professionnelles).</p>
                    </div>
                    <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                      <p className="font-bold text-primary">3. Passions &amp; Intégration</p>
                      <p className="text-muted-foreground">Activités culturelles ou sportives démontrant votre capacité à vous épanouir et tisser des liens sociaux.</p>
                    </div>
                  </div>
                </div>

                {/* Sujet Spécifique de la Série & Exercice Pratique */}
                <div className="rounded-2xl border-2 border-primary/30 bg-primary/[0.02] p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                      <Lightbulb className="h-4 w-4" />
                      <span>Sujet Officiel de cette Série (Tâche 1)</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-muted-foreground">Durée : 2 min</span>
                  </div>

                  <div className="p-4 rounded-xl border bg-card text-xs sm:text-sm space-y-1">
                    <span className="font-bold text-foreground block">Consigne de l&apos;Examinateur Laurent :</span>
                    <p className="text-muted-foreground italic leading-relaxed">
                      « {task1.examinerPrompt || "Bonjour et bienvenue. Pour commencer, pouvez-vous vous présenter, me décrire votre profession actuelle et me préciser pourquoi vous souhaitez vous installer au Canada ?"} »
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t">
                    <span className="text-xs text-muted-foreground">
                      Cette tâche fait partie intégrante de l&apos;examen officiel de 12 minutes.
                    </span>
                    <Button asChild variant="outline" size="sm" className="font-bold text-xs gap-2 rounded-xl cursor-pointer">
                      <Link href={`/examens/${series.id}/eo`}>
                        <Mic className="h-3.5 w-3.5 text-primary" />
                        <span>Passer l&apos;Examen Complet (12 min)</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TÂCHE 2 : JEU DE RÔLE & RECHERCHE D'INFORMATIONS (3.5 MIN)        */}
          {/* ================================================================= */}
          {activeTaskTab === 2 && (
            <div className="space-y-6">
              <div className="rounded-3xl border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="border-b pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Tâche 2 • 3 Min 30 s • Avec Préparation • Niveaux A2-B2
                  </span>
                  <h2 className="font-display text-2xl font-black text-foreground mt-0.5">
                    Jeu de Rôle Interactif (Obtenir des Informations Précises)
                  </h2>
                </div>

                <div className="space-y-3">
                  <h3 className="font-display text-sm font-bold text-foreground">
                    La Règle d&apos;Or : C&apos;est VOUS qui menez l&apos;entretien !
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    L&apos;erreur fatale du candidat moyen est d&apos;attendre que l&apos;examinateur pose des questions. En Tâche 2, votre rôle est d&apos;enchaîner au moins <strong>8 à 10 questions variées</strong> en utilisant le vouvoiement et le conditionnel de politesse.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-3 text-xs">
                    <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                      <p className="font-bold text-amber-600 dark:text-amber-400">1. Salutation &amp; Cadre</p>
                      <p className="text-muted-foreground">« Bonjour monsieur, je vous contacte au sujet de votre annonce concernant... »</p>
                    </div>
                    <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                      <p className="font-bold text-amber-600 dark:text-amber-400">2. Variété des Questions</p>
                      <p className="text-muted-foreground">Alterner questions ouvertes (« Quel est... ? ») et conditionnel (« Pourriez-vous m&apos;indiquer si... ? »).</p>
                    </div>
                    <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                      <p className="font-bold text-amber-600 dark:text-amber-400">3. Rebonds &amp; Clôture</p>
                      <p className="text-muted-foreground">« Parfait, cela me convient tout à fait. Je vous recontacte pour finaliser ma réservation. »</p>
                    </div>
                  </div>
                </div>

                {/* Scénario Officiel de la Série & Exercice Pratique */}
                <div className="rounded-2xl border-2 border-amber-500/30 bg-amber-500/[0.02] p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                      <Lightbulb className="h-4 w-4" />
                      <span>Scénario de Jeu de Rôle de cette Série (Tâche 2)</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-muted-foreground">Durée : 3 min 30 s</span>
                  </div>

                  <div className="p-4 rounded-xl border bg-card text-xs sm:text-sm space-y-2">
                    <div className="flex items-center gap-2 font-bold text-foreground">
                      <MessageSquare className="h-4 w-4 text-amber-500" />
                      <span>Mise en Situation :</span>
                    </div>
                    <p className="text-muted-foreground italic leading-relaxed">
                      {task2.roleplayScenario?.situation || task2.examinerPrompt || "Vous avez vu une annonce pour un séjour linguistique immersif. Vous contactez le responsable pour obtenir des renseignements sur les dates, les tarifs et l'hébergement."}
                    </p>
                    {task2.roleplayScenario?.objectives && (
                      <div className="pt-2">
                        <span className="text-xs font-bold text-foreground block mb-1">Vos Objectifs dans la Conversation :</span>
                        <ul className="list-disc list-inside space-y-0.5 text-xs text-muted-foreground">
                          {task2.roleplayScenario.objectives.map((obj, i) => (
                            <li key={i}>{obj}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t">
                    <span className="text-xs text-muted-foreground">
                      Cette tâche fait partie intégrante de l&apos;examen officiel de 12 minutes.
                    </span>
                    <Button asChild variant="outline" size="sm" className="font-bold text-xs gap-2 rounded-xl cursor-pointer">
                      <Link href={`/examens/${series.id}/eo`}>
                        <Mic className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                        <span>Passer l&apos;Examen Complet (12 min)</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TÂCHE 3 : POINT DE VUE & ARGUMENTATION (4.5 MIN)                  */}
          {/* ================================================================= */}
          {activeTaskTab === 3 && (
            <div className="space-y-6">
              <div className="rounded-3xl border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="border-b pb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                    Tâche 3 • 4 Min 30 s • Sans Préparation • Niveaux B2-C2
                  </span>
                  <h2 className="font-display text-2xl font-black text-foreground mt-0.5">
                    Expression d&apos;un Point de Vue Structuré (Argumenter &amp; Nuancer)
                  </h2>
                </div>

                <div className="space-y-3">
                  <h3 className="font-display text-sm font-bold text-foreground">
                    Le Plan d&apos;Attaque C1/C2 en 4 Étapes Chronométrées :
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-4 text-xs">
                    <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                      <p className="font-bold text-cyan-600 dark:text-cyan-400">1. Accroche (30s)</p>
                      <p className="text-muted-foreground">Reformuler la question, poser la problématique et annoncer votre plan en 2 volets.</p>
                    </div>
                    <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                      <p className="font-bold text-cyan-600 dark:text-cyan-400">2. Thèse (1m30)</p>
                      <p className="text-muted-foreground">Développer 2 arguments solides illustrés par des exemples concrets du quotidien ou d&apos;actualité.</p>
                    </div>
                    <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                      <p className="font-bold text-cyan-600 dark:text-cyan-400">3. Antithèse (1m30)</p>
                      <p className="text-muted-foreground">Nuancer avec des concessions rhétoriques (« Certes..., néanmoins... »).</p>
                    </div>
                    <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                      <p className="font-bold text-cyan-600 dark:text-cyan-400">4. Synthèse (1m00)</p>
                      <p className="text-muted-foreground">Trancher avec une conclusion claire et répondre aux questions de relance de Laurent.</p>
                    </div>
                  </div>
                </div>

                {/* Sujet Officiel de la Série & Exercice Pratique */}
                <div className="rounded-2xl border-2 border-cyan-500/30 bg-cyan-500/[0.02] p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-xs uppercase tracking-wider">
                      <Lightbulb className="h-4 w-4" />
                      <span>Sujet de Débat de cette Série (Tâche 3)</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-muted-foreground">Durée : 4 min 30 s</span>
                  </div>

                  <div className="p-4 rounded-xl border bg-card text-xs sm:text-sm space-y-1">
                    <span className="font-bold text-foreground block">Question Posée par l&apos;Examinateur :</span>
                    <p className="text-muted-foreground italic leading-relaxed">
                      « {task3.examinerPrompt || "Certains considèrent que le développement des technologies numériques et de l'intelligence artificielle isole les individus au lieu de les rapprocher. Partagez-vous ce point de vue ?"} »
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t">
                    <span className="text-xs text-muted-foreground">
                      Cette tâche fait partie intégrante de l&apos;examen officiel de 12 minutes.
                    </span>
                    <Button asChild variant="outline" size="sm" className="font-bold text-xs gap-2 rounded-xl cursor-pointer">
                      <Link href={`/examens/${series.id}/eo`}>
                        <Mic className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                        <span>Passer l&apos;Examen Complet (12 min)</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🚀 CONTENU GRAND TITRE 3 : SIMULATION OFFICIELLE COMPLÈTE 12 MIN          */}
      {/* ========================================================================= */}
      {activeTab === "examen" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="rounded-3xl border-2 border-primary/40 bg-gradient-to-b from-card via-card to-primary/5 p-6 sm:p-10 text-center space-y-6 shadow-xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 p-3 shadow-inner border border-primary/20">
              <Mic className="h-10 w-10 text-primary" />
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                Simulation Certifiante NCLC 7+
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-foreground">
                L&apos;Épreuve d&apos;Expression Orale en Conditions Réelles
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Vous allez passer les 3 tâches consécutives avec l&apos;examinateur Laurent Mercier sous chronomètre officiel (12 minutes). Vos propos sont enregistrés et analysés selon la grille FEI dès la fin de l&apos;entretien.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 max-w-2xl mx-auto text-left text-xs">
              <div className="p-3.5 rounded-xl border bg-card space-y-1">
                <span className="font-bold text-primary block">Tâche 1 (2:00)</span>
                <span className="text-muted-foreground">Présentation sans interruption</span>
              </div>
              <div className="p-3.5 rounded-xl border bg-card space-y-1">
                <span className="font-bold text-primary block">Tâche 2 (3:30)</span>
                <span className="text-muted-foreground">Jeu de rôle interactif en direct</span>
              </div>
              <div className="p-3.5 rounded-xl border bg-card space-y-1">
                <span className="font-bold text-primary block">Tâche 3 (4:30)</span>
                <span className="text-muted-foreground">Argumentation et relances de débat</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-brand-crimson hover:bg-brand-crimson-dark text-white font-black text-base px-8 h-12 rounded-xl shadow-lg gap-2 cursor-pointer"
              >
                <Link href={`/examens/${series.id}/eo?mode=exam&start=true`}>
                  <Mic className="h-5 w-5" />
                  <span>Commencer l&apos;Entretien Réel (12:00)</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modale de Choix du Compagnon */}
      <CompanionSelectorDialog
        open={isSelectorOpen}
        onOpenChange={setIsSelectorOpen}
        currentSelectedId={companionId}
        onSelectCompanion={handleSelectCompanion}
      />
    </div>
  );
}
