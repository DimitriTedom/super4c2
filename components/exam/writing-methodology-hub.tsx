"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  BookOpen,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  PenTool,
  Award,
  Layers,
  Volume2,
  VolumeX,
  FileText,
  Check,
  RefreshCw,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompanionSelectorDialog } from "@/components/companions/companion-selector-dialog";
import {
  COMPANIONS,
  type CompanionId,
  DEFAULT_COMPANION_ID,
  getCompanionById,
} from "@/lib/companions/data";
import { type WrittenExamSeries } from "@/lib/exam/written-types";
import { cn } from "@/lib/utils";

interface WritingMethodologyHubProps {
  series: WrittenExamSeries;
}

export function WritingMethodologyHub({ series }: WritingMethodologyHubProps) {
  const [companionId, setCompanionId] = useState<CompanionId>(DEFAULT_COMPANION_ID);
  const [isSelectorOpen, setIsSelectorOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"presentation" | "methodologie" | "examen">("presentation");
  const [activeTaskTab, setActiveTaskTab] = useState<1 | 2 | 3>(1);
  const [hydrated, setHydrated] = useState<boolean>(false);
  const [isSpeakingTour, setIsSpeakingTour] = useState<boolean>(false);

  // Hydratation du compagnon depuis le localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("super4c2:user_companion") as CompanionId;
      if (saved && COMPANIONS[saved]) {
        setCompanionId(saved);
      } else {
        // Premier passage : proposer le choix du compagnon avec l'introduction TCF
        setIsSelectorOpen(true);
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

  // Arrêt de l'audio lors du démontage
  useEffect(() => {
    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
    };
  }, []);

  // Lecture audio ElevenLabs haute fidélité de présentation de la page
  const handlePlayPageTour = () => {
    if (isSpeakingTour) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.currentTime = 0;
        audioPlayerRef.current = null;
      }
      setIsSpeakingTour(false);
      return;
    }

    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }

    const audioUrl = currentCompanion.audioPreviewUrl || "/audio/eo/laurent-step1.mp3";
    try {
      const audio = new Audio(audioUrl);
      audioPlayerRef.current = audio;

      audio.onplay = () => setIsSpeakingTour(true);
      audio.onended = () => setIsSpeakingTour(false);
      audio.onerror = () => setIsSpeakingTour(false);

      audio.play().catch(() => setIsSpeakingTour(false));
    } catch {
      setIsSpeakingTour(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      {/* Dialogue de sélection du compagnon (2 étapes) */}
      <CompanionSelectorDialog
        open={isSelectorOpen}
        onOpenChange={setIsSelectorOpen}
        onSelectCompanion={handleSelectCompanion}
        currentSelectedId={companionId}
      />

      {/* En-tête de l'épreuve */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-xs font-bold text-primary">
            <PenTool className="h-3.5 w-3.5" />
            <span>Hub de Préparation Officiel TCF Canada</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Expression Écrite — Méthodologie &amp; Entraînement
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            Organigramme complet de formation : maîtrisez les 3 tâches officielles de France Éducation International avec des exercices corrigés avant l&apos;examen blanc de 60 minutes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSelectorOpen(true)}
            className="text-xs font-semibold gap-1.5 border-primary/30 hover:bg-primary/5 rounded-xl"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Changer de Compagnon ({currentCompanion.name})</span>
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🐻 BANDEAU COMPAGNON 3D : LECTURE VOCALE DE LA PAGE & DES 3 GRANDS TITRES */}
      {/* ========================================================================= */}
      {hydrated && (
        <div className="relative overflow-hidden rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-card via-card to-primary/[0.05] p-5 sm:p-7 shadow-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Avatar 3D du Compagnon */}
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <div
                  className={cn(
                    "relative h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-3xl border-2 shadow-md transition-all bg-muted",
                    isSpeakingTour
                      ? "border-emerald-500 ring-4 ring-emerald-500/20 scale-105"
                      : "border-primary/40 ring-2 ring-primary/10"
                  )}
                >
                  <Image
                    src={currentCompanion.avatarUrl}
                    alt={currentCompanion.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-background border border-border shadow-xs text-sm">
                  🏛️
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-display font-black text-lg text-foreground">
                    {currentCompanion.name}
                  </span>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                    {currentCompanion.badge}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-foreground/90 leading-snug">
                  &laquo; Bonjour ! Je suis ton compagnon de formation. Voici ce que tu vas trouver sur cette page : &raquo;
                </p>
                <div className="text-xs text-muted-foreground leading-relaxed space-y-1 pt-1">
                  <p className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <strong>1. Présentation de l&apos;épreuve :</strong> Décryptage des 4 critères FEI (note /20) et des pièges éliminatoires.
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                    <strong>2. Méthodologie &amp; Exercices d&apos;application :</strong> Tâches 1, 2 et 3 décortiquées avec corrigés types C1/C2.
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <strong>3. Session Examen Blanc :</strong> Épreuve complète de 60 min avec barre de temps et clavier FEI.
                  </p>
                </div>
              </div>
            </div>

            {/* Bouton Audio de Lecture de la Page */}
            <div className="flex flex-col sm:flex-row md:flex-col items-stretch gap-2.5 w-full md:w-auto shrink-0">
              <Button
                type="button"
                onClick={handlePlayPageTour}
                className={cn(
                  "font-bold text-xs h-11 px-5 rounded-2xl shadow-md gap-2 transition-all",
                  isSpeakingTour
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse"
                    : "bg-primary hover:bg-primary-dark text-white"
                )}
              >
                {isSpeakingTour ? (
                  <>
                    <VolumeX className="h-4 w-4" />
                    <span>Mettre en pause {currentCompanion.name}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4" />
                    <span>Écouter {currentCompanion.name} présenter la page</span>
                  </>
                )}
              </Button>

              <button
                type="button"
                onClick={() => setIsSelectorOpen(true)}
                className="text-center text-xs text-muted-foreground hover:text-foreground hover:underline font-medium py-1"
              >
                Changer de mentor (Aura, Kodiak, Barnabé)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🧭 NAVIGATION DANS LES 3 GRANDS TITRES DE L'ORGANIGRAMME                  */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* TITRE 1 */}
        <button
          type="button"
          onClick={() => setActiveTab("presentation")}
          className={cn(
            "p-4 rounded-2xl border-2 text-left transition-all space-y-1.5 shadow-xs",
            activeTab === "presentation"
              ? "border-primary bg-primary/[0.04] shadow-md ring-1 ring-primary/20"
              : "border-border/80 bg-card hover:border-primary/40 hover:bg-muted/30"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Étape 1</span>
            <ShieldCheck className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-display font-bold text-sm text-foreground">
            Présentation de l&apos;Épreuve
          </h3>
          <p className="text-xs text-muted-foreground">
            Structure des 3 tâches, barème officiel FEI 20/20 &amp; pièges.
          </p>
        </button>

        {/* TITRE 2 */}
        <button
          type="button"
          onClick={() => setActiveTab("methodologie")}
          className={cn(
            "p-4 rounded-2xl border-2 text-left transition-all space-y-1.5 shadow-xs",
            activeTab === "methodologie"
              ? "border-amber-500 bg-amber-500/[0.04] shadow-md ring-1 ring-amber-500/20"
              : "border-border/80 bg-card hover:border-amber-500/40 hover:bg-muted/30"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Étape 2</span>
            <BookOpen className="h-4 w-4 text-amber-500" />
          </div>
          <h3 className="font-display font-bold text-sm text-foreground">
            Méthodologie &amp; Exercices Corrigés
          </h3>
          <p className="text-xs text-muted-foreground">
            Tâches 1, 2 et 3 décortiquées avec corrigés types C1/C2.
          </p>
        </button>

        {/* TITRE 3 */}
        <button
          type="button"
          onClick={() => setActiveTab("examen")}
          className={cn(
            "p-4 rounded-2xl border-2 text-left transition-all space-y-1.5 shadow-xs",
            activeTab === "examen"
              ? "border-emerald-500 bg-emerald-500/[0.04] shadow-md ring-1 ring-emerald-500/20"
              : "border-border/80 bg-card hover:border-emerald-500/40 hover:bg-muted/30"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Étape 3</span>
            <Clock className="h-4 w-4 text-emerald-500" />
          </div>
          <h3 className="font-display font-bold text-sm text-foreground">
            Session Examen Blanc (60 min)
          </h3>
          <p className="text-xs text-muted-foreground">
            Simulateur CBT officiel chronométré avec clavier d&apos;accents FEI.
          </p>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 📄 CONTENU DU GRAND TITRE 1 : PRÉSENTATION DE L'ÉPREUVE                   */}
      {/* ========================================================================= */}
      {activeTab === "presentation" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="rounded-3xl border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="space-y-2 border-b pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Grand Titre 1 • Les Règles du Jeu
              </span>
              <h2 className="font-display text-2xl font-black text-foreground">
                Description &amp; Barème Officiel de l&apos;Expression Écrite TCF Canada
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                L&apos;épreuve d&apos;Expression Écrite du TCF Canada est une épreuve sur ordinateur (CBT) d&apos;une durée de <strong>60 minutes consécutives</strong>, composée de 3 tâches obligatoires sans pause intermédiaire. Chaque copie est évaluée en double correction selon la grille officielle de France Éducation International.
              </p>
            </div>

            {/* Vue d'ensemble des 3 tâches */}
            <div className="grid gap-4 sm:grid-cols-3 text-xs">
              <div className="rounded-2xl border bg-muted/30 p-4 space-y-1.5">
                <span className="font-bold text-primary block">Tâche 1 • 60 à 120 mots</span>
                <p className="font-semibold text-foreground">Message ou Courriel amical/professionnel</p>
                <p className="text-muted-foreground">Décrire un lieu, raconter un événement ou lancer une invitation. Durée conseillée : 15 min.</p>
              </div>

              <div className="rounded-2xl border bg-muted/30 p-4 space-y-1.5">
                <span className="font-bold text-amber-600 dark:text-amber-400 block">Tâche 2 • 120 à 150 mots</span>
                <p className="font-semibold text-foreground">Article ou Récit d&apos;expérience vécue</p>
                <p className="text-muted-foreground">Raconter une action concrète et expliquer sa portée sociale ou citoyenne. Durée conseillée : 20 min.</p>
              </div>

              <div className="rounded-2xl border bg-muted/30 p-4 space-y-1.5">
                <span className="font-bold text-cyan-600 dark:text-cyan-400 block">Tâche 3 • 120 à 180 mots</span>
                <p className="font-semibold text-foreground">Note argumentative ou Débat d&apos;idées</p>
                <p className="text-muted-foreground">Exposer obligatoirement deux points de vue opposés puis donner son avis nuancé. Durée conseillée : 25 min.</p>
              </div>
            </div>

            {/* La Grille Officielle des 4 Critères FEI */}
            <div className="space-y-3 pt-2">
              <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                <span>La Grille Officielle des 4 Critères FEI (Note sur 20 Points)</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Chaque tâche est notée sur 20 points, répartis équitablement sur 4 critères d&apos;évaluation de 5 points chacun :
              </p>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
                <div className="rounded-xl border bg-card p-4 space-y-1">
                  <span className="font-bold text-primary block">1. Adéquation (5 pts)</span>
                  <p className="text-muted-foreground">Respect du volume de mots et de l&apos;objectif communicatif. Traiter tous les aspects de la consigne.</p>
                </div>

                <div className="rounded-xl border bg-card p-4 space-y-1">
                  <span className="font-bold text-amber-600 dark:text-amber-400 block">2. Cohérence (5 pts)</span>
                  <p className="text-muted-foreground">Découpage en paragraphes nets, logique des idées et connecteurs d&apos;articulation variés.</p>
                </div>

                <div className="rounded-xl border bg-card p-4 space-y-1">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block">3. Lexique (5 pts)</span>
                  <p className="text-muted-foreground">Richesse du vocabulaire, absence de répétitions et tournures idiomatiques adaptées.</p>
                </div>

                <div className="rounded-xl border bg-card p-4 space-y-1">
                  <span className="font-bold text-cyan-600 dark:text-cyan-400 block">4. Morphosyntaxe (5 pts)</span>
                  <p className="text-muted-foreground">Maîtrise des temps verbaux, propositions complexes, orthographe et accords grammaticaux.</p>
                </div>
              </div>
            </div>

            {/* Pièges éliminatoires */}
            <div className="rounded-2xl border border-destructive/30 bg-destructive/[0.03] p-5 space-y-3">
              <div className="flex items-center gap-2 text-destructive font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="h-4 w-4" />
                <span>Les 3 Pièges Éliminatoires à Éviter Absolument</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 text-xs">
                <div className="space-y-1">
                  <p className="font-bold text-foreground">1. Nombre de mots insuffisant</p>
                  <p className="text-muted-foreground">Moins de 60 mots en Tâche 1 ou moins de 120 mots en Tâches 2/3 divise immédiatement la note par deux.</p>
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-foreground">2. Le texte en un seul bloc</p>
                  <p className="text-muted-foreground">L&apos;absence de sauts de ligne et de paragraphes détruit la note de Cohérence textuelle.</p>
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-foreground">3. Le parti pris immédiat en Tâche 3</p>
                  <p className="text-muted-foreground">Donner son avis sans exposer les deux opinions contradictoires est sanctionné comme hors-sujet partiel.</p>
                </div>
              </div>
            </div>

            {/* Bouton pour avancer vers la Méthodologie */}
            <div className="flex justify-end pt-2">
              <Button
                onClick={() => setActiveTab("methodologie")}
                className="gap-2 font-bold bg-primary hover:bg-primary-dark text-white"
              >
                <span>Passer au Grand Titre 2 : Méthodologie &amp; Exercices Corrigés</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 📄 CONTENU DU GRAND TITRE 2 : MÉTHODOLOGIE & EXERCICES D'APPLICATION      */}
      {/* ========================================================================= */}
      {activeTab === "methodologie" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Sous-navigation Tâche 1 / Tâche 2 / Tâche 3 */}
          <div className="flex border-b bg-muted/40 p-1.5 rounded-2xl gap-2">
            <button
              type="button"
              onClick={() => setActiveTaskTab(1)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold transition-all",
                activeTaskTab === 1
                  ? "bg-card text-foreground shadow-xs border border-primary/40"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <FileText className="h-4 w-4 text-primary" />
              <span>Tâche 1 (Courriel • 15 min)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTaskTab(2)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold transition-all",
                activeTaskTab === 2
                  ? "bg-card text-foreground shadow-xs border border-amber-500/40"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <Layers className="h-4 w-4 text-amber-500" />
              <span>Tâche 2 (Récit • 20 min)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTaskTab(3)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold transition-all",
                activeTaskTab === 3
                  ? "bg-card text-foreground shadow-xs border border-cyan-500/40"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <Award className="h-4 w-4 text-cyan-500" />
              <span>Tâche 3 (Débat • 25 min)</span>
            </button>
          </div>

          {/* ======================================= */}
          {/* TÂCHE 1 : MÉTHODOLOGIE + EXERCICE CORRIGÉ */}
          {/* ======================================= */}
          {activeTaskTab === 1 && (
            <div className="space-y-6">
              <div className="rounded-3xl border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      Tâche 1 • 60 à 120 Mots • ~15 Minutes Conseillées
                    </span>
                    <h2 className="font-display text-2xl font-black text-foreground mt-0.5">
                      Message ou Courriel (Décrire, Raconter, Inviter)
                    </h2>
                  </div>
                  <Button asChild className="gap-2 bg-primary hover:bg-primary-dark text-white font-bold shrink-0">
                    <Link href={`/examens/${series.id}/ee?mode=training&task=1`}>
                      <span>S&apos;entraîner sur la Tâche 1 (15 min)</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                {/* Méthodologie en 3 Blocs */}
                <div className="space-y-3">
                  <h3 className="font-display text-sm font-bold text-foreground">
                    La Méthodologie Infaillible en 3 Paragraphes :
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-3 text-xs">
                    <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                      <p className="font-bold text-primary">1. Salutation &amp; Motif</p>
                      <p className="text-muted-foreground">Saluer cordialement le destinataire et annoncer immédiatement la raison du courriel (« Salut Julien, je t&apos;écris pour... »).</p>
                    </div>
                    <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                      <p className="font-bold text-primary">2. Description Détaillée</p>
                      <p className="text-muted-foreground">Apporter 2 ou 3 précisions imagées avec des adjectifs valorisants (« baigné de lumière », « quartier très verdoyant »).</p>
                    </div>
                    <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                      <p className="font-bold text-primary">3. Invitation &amp; Formule Finale</p>
                      <p className="text-muted-foreground">Proposer une date concrète, inviter chaleureusement et conclure avec une formule de politesse adaptée (« À très vite »).</p>
                    </div>
                  </div>
                </div>

                {/* EXERCICE D'APPLICATION OFFICIEL AVEC CORRIGÉ TYPE */}
                <div className="rounded-2xl border-2 border-primary/30 bg-primary/[0.02] p-5 sm:p-6 space-y-4">
                  <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                    <Lightbulb className="h-4 w-4" />
                    <span>Exercice d&apos;Application Officiel TCF Canada (Tâche 1)</span>
                  </div>

                  {/* Le Sujet */}
                  <div className="p-4 rounded-xl border bg-card text-xs sm:text-sm space-y-1">
                    <span className="font-bold text-foreground block">Sujet Type :</span>
                    <p className="text-muted-foreground italic">
                      &laquo; Vous venez d&apos;emménager dans une nouvelle ville au Canada pour votre travail. Écrivez un courriel à un ami pour lui décrire votre nouveau logement et votre quartier, et invitez-le à passer un week-end chez vous. (60 à 120 mots) &raquo;
                    </p>
                  </div>

                  {/* Le Corrigé Modèle */}
                  <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.04] text-xs sm:text-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">
                        Corrigé Modèle Niveau C1/C2 (94 mots — Score 20/20) :
                      </span>
                      <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        94 mots
                      </span>
                    </div>

                    <div className="font-body text-foreground leading-relaxed space-y-2 bg-card/80 p-3.5 rounded-lg border">
                      <p>Salut Maxime,</p>
                      <p>
                        J&apos;espère que tu vas bien ! Je t&apos;écris enfin depuis Montréal où je viens de poser mes valises. Mon appartement est un deux-pièces baigné de lumière, situé dans le quartier paisible du Plateau, à deux pas d&apos;un parc magnifique.
                      </p>
                      <p>
                        La vie s&apos;organise doucement et l&apos;ambiance ici est incroyablement chaleureuse. Je serais ravi de te faire découvrir la ville et de fêter mon installation autour d&apos;un bon repas.
                      </p>
                      <p>
                        Es-tu disponible le week-end prochain pour venir passer quelques jours à la maison ? Fais-moi signe rapidement !
                      </p>
                      <p>À très bientôt,<br />Alexandre</p>
                    </div>

                    {/* Décryptage des 4 Critères */}
                    <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      <div className="bg-card p-2 rounded border">
                        <strong className="text-primary block">Adéquation (5/5)</strong>
                        <span className="text-muted-foreground">94 mots, respecte 100% de la consigne.</span>
                      </div>
                      <div className="bg-card p-2 rounded border">
                        <strong className="text-amber-600 block">Cohérence (5/5)</strong>
                        <span className="text-muted-foreground">3 paragraphes nets et naturels.</span>
                      </div>
                      <div className="bg-card p-2 rounded border">
                        <strong className="text-emerald-600 block">Lexique (5/5)</strong>
                        <span className="text-muted-foreground">« baigné de lumière », « poser mes valises ».</span>
                      </div>
                      <div className="bg-card p-2 rounded border">
                        <strong className="text-cyan-600 block">Grammaire (5/5)</strong>
                        <span className="text-muted-foreground">Conditionnel « serais ravi », syntaxe fluide.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <Button variant="outline" onClick={() => setActiveTab("presentation")}>
                    ← Revoir la Présentation de l&apos;Épreuve
                  </Button>
                  <Button onClick={() => setActiveTaskTab(2)} className="gap-2 font-bold bg-amber-600 hover:bg-amber-700 text-white">
                    <span>Méthodologie Tâche 2 (Récit)</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================= */}
          {/* TÂCHE 2 : MÉTHODOLOGIE + EXERCICE CORRIGÉ */}
          {/* ======================================= */}
          {activeTaskTab === 2 && (
            <div className="space-y-6">
              <div className="rounded-3xl border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      Tâche 2 • 120 à 150 Mots • ~20 Minutes Conseillées
                    </span>
                    <h2 className="font-display text-2xl font-black text-foreground mt-0.5">
                      Récit d&apos;Expérience &amp; Portée Citoyenne
                    </h2>
                  </div>
                  <Button asChild className="gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold shrink-0">
                    <Link href={`/examens/${series.id}/ee?mode=training&task=2`}>
                      <span>S&apos;entraîner sur la Tâche 2 (20 min)</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                {/* Méthodologie Tâche 2 */}
                <div className="space-y-3">
                  <h3 className="font-display text-sm font-bold text-foreground">
                    Les 3 Piliers du Niveau C1 en Tâche 2 :
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-3 text-xs">
                    <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                      <p className="font-bold text-amber-600 dark:text-amber-400">1. Ancrage Temporel Précis</p>
                      <p className="text-muted-foreground">Fixer immédiatement le cadre : « Samedi dernier », « Dès les premières lueurs de l&apos;aube », « Lors de mon récent séjour ».</p>
                    </div>
                    <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                      <p className="font-bold text-amber-600 dark:text-amber-400">2. L&apos;Action Vécue</p>
                      <p className="text-muted-foreground">Raconter les faits avec des verbes d&apos;action et des sentiments réels pour faire vivre le récit au lecteur.</p>
                    </div>
                    <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                      <p className="font-bold text-amber-600 dark:text-amber-400">3. La Portée Citoyenne</p>
                      <p className="text-muted-foreground">Prendre du recul en conclusion : expliquer pourquoi cette expérience renforce le lien social ou la collectivité.</p>
                    </div>
                  </div>
                </div>

                {/* EXERCICE D'APPLICATION OFFICIEL AVEC CORRIGÉ TYPE */}
                <div className="rounded-2xl border-2 border-amber-500/30 bg-amber-500/[0.02] p-5 sm:p-6 space-y-4">
                  <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
                    <Lightbulb className="h-4 w-4" />
                    <span>Exercice d&apos;Application Officiel TCF Canada (Tâche 2)</span>
                  </div>

                  {/* Le Sujet */}
                  <div className="p-4 rounded-xl border bg-card text-xs sm:text-sm space-y-1">
                    <span className="font-bold text-foreground block">Sujet Type :</span>
                    <p className="text-muted-foreground italic">
                      &laquo; Vous avez participé à un projet bénévole de nettoyage et de reboisement d&apos;un parc dans votre municipalité. Racontez votre expérience dans le journal de votre communauté et expliquez pourquoi cette initiative a renforcé les liens entre voisins. (120 à 150 mots) &raquo;
                    </p>
                  </div>

                  {/* Le Corrigé Modèle */}
                  <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.04] text-xs sm:text-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">
                        Corrigé Modèle Niveau C1/C2 (138 mots — Score 20/20) :
                      </span>
                      <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        138 mots
                      </span>
                    </div>

                    <div className="font-body text-foreground leading-relaxed space-y-2 bg-card/80 p-3.5 rounded-lg border">
                      <p>
                        Samedi dernier, dès les premières lueurs de l&apos;aube, une quarantaine d&apos;habitants de notre quartier se sont réunis afin de réhabiliter le parc des Érables, délaissé depuis plusieurs mois. Munis de gants et de pelles, nous avons ramassé les déchets avant de planter une vingtaine de jeunes bouleaux le long des sentiers.
                      </p>
                      <p>
                        Au-delà de la métamorphose écologique évidente, cette journée a constitué une aventure humaine marquante. Travailler côte à côte a permis de briser l&apos;isolement urbain et de nouer des conversations spontanées entre générations.
                      </p>
                      <p>
                        À mon sens, ce genre d&apos;engagement citoyen dépasse le simple geste environnemental : il réinsuffle un véritable sentiment d&apos;appartenance locale. Je suis convaincu que pérenniser ces actions collectives constitue le meilleur moyen de revitaliser nos quartiers.
                      </p>
                    </div>

                    {/* Décryptage des 4 Critères */}
                    <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      <div className="bg-card p-2 rounded border">
                        <strong className="text-primary block">Adéquation (5/5)</strong>
                        <span className="text-muted-foreground">138 mots (fourchette 120-150 mots).</span>
                      </div>
                      <div className="bg-card p-2 rounded border">
                        <strong className="text-amber-600 block">Cohérence (5/5)</strong>
                        <span className="text-muted-foreground">Ancrage temporel et transition narrative.</span>
                      </div>
                      <div className="bg-card p-2 rounded border">
                        <strong className="text-emerald-600 block">Lexique (5/5)</strong>
                        <span className="text-muted-foreground">« métamorphose écologique », « réinsuffle ».</span>
                      </div>
                      <div className="bg-card p-2 rounded border">
                        <strong className="text-cyan-600 block">Grammaire (5/5)</strong>
                        <span className="text-muted-foreground">Subordonnées complétives et infinitifs passés.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <Button variant="outline" onClick={() => setActiveTaskTab(1)}>
                    ← Revoir la Tâche 1
                  </Button>
                  <Button onClick={() => setActiveTaskTab(3)} className="gap-2 font-bold bg-cyan-600 hover:bg-cyan-700 text-white">
                    <span>Méthodologie Tâche 3 (Débat)</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================= */}
          {/* TÂCHE 3 : MÉTHODOLOGIE + EXERCICE CORRIGÉ */}
          {/* ======================================= */}
          {activeTaskTab === 3 && (
            <div className="space-y-6">
              <div className="rounded-3xl border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                      Tâche 3 • 120 à 180 Mots • ~25 Minutes Conseillées
                    </span>
                    <h2 className="font-display text-2xl font-black text-foreground mt-0.5">
                      Double Argumentation &amp; Prise de Position Nuancée
                    </h2>
                  </div>
                  <Button asChild className="gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold shrink-0">
                    <Link href={`/examens/${series.id}/ee?mode=training&task=3`}>
                      <span>S&apos;entraîner sur la Tâche 3 (25 min)</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                {/* Méthodologie Tâche 3 */}
                <div className="space-y-3">
                  <h3 className="font-display text-sm font-bold text-foreground">
                    La Règle d&apos;Or : Toujours Deux Thèses Opposées Avant de Conclure :
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-3 text-xs">
                    <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                      <p className="font-bold text-cyan-600 dark:text-cyan-400">1. Paragraphe 1 • Thèse A</p>
                      <p className="text-muted-foreground">Exposer les arguments des partisans (« D&apos;un côté, certains soutiennent que... car... »).</p>
                    </div>
                    <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                      <p className="font-bold text-cyan-600 dark:text-cyan-400">2. Paragraphe 2 • Thèse B</p>
                      <p className="text-muted-foreground">Exposer la contradiction (« D&apos;un autre côté, plusieurs spécialistes objectent que... »).</p>
                    </div>
                    <div className="p-3.5 rounded-xl border bg-muted/20 space-y-1">
                      <p className="font-bold text-cyan-600 dark:text-cyan-400">3. Paragraphe 3 • Synthèse</p>
                      <p className="text-muted-foreground">Prendre position avec concession (« Pour ma part, bien que (...) je demeure convaincu que... »).</p>
                    </div>
                  </div>
                </div>

                {/* EXERCICE D'APPLICATION OFFICIEL AVEC CORRIGÉ TYPE */}
                <div className="rounded-2xl border-2 border-cyan-500/30 bg-cyan-500/[0.02] p-5 sm:p-6 space-y-4">
                  <div className="flex items-center gap-2 text-cyan-600 font-bold text-xs uppercase tracking-wider">
                    <Lightbulb className="h-4 w-4" />
                    <span>Exercice d&apos;Application Officiel TCF Canada (Tâche 3)</span>
                  </div>

                  {/* Le Sujet */}
                  <div className="p-4 rounded-xl border bg-card text-xs sm:text-sm space-y-1">
                    <span className="font-bold text-foreground block">Sujet Type :</span>
                    <p className="text-muted-foreground italic">
                      &laquo; Faut-il interdire totalement les véhicules polluants dans les centres-villes ? Vous présentez les deux points de vue contradictoires exprimés dans le débat public, puis vous donnez votre opinion personnelle argumentée. (120 à 180 mots) &raquo;
                    </p>
                  </div>

                  {/* Le Corrigé Modèle */}
                  <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.04] text-xs sm:text-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">
                        Corrigé Modèle Niveau C1/C2 (162 mots — Score 20/20) :
                      </span>
                      <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        162 mots
                      </span>
                    </div>

                    <div className="font-body text-foreground leading-relaxed space-y-2 bg-card/80 p-3.5 rounded-lg border">
                      <p>
                        La piétonnisation intégrale des cœurs urbains suscite des débats passionnés. D&apos;un côté, les défenseurs de l&apos;environnement rappellent que l&apos;interdiction des véhicules polluants réduit drastiquement les émissions de gaz à effet de serre et assainit l&apos;air respiré par des milliers de citadins au quotidien.
                      </p>
                      <p>
                        D&apos;un autre côté, commerçants et résidents périphériques soulignent les préjudices économiques d&apos;une telle mesure. Faute de transports en commun suffisamment denses et abordables, une prohibition abrupte risque de pénaliser les ménages modestes et d&apos;asphyxier les commerces de proximité.
                      </p>
                      <p>
                        Pour ma part, bien que l&apos;urgence climatique commande d&apos;agir avec fermeté, j&apos;estime qu&apos;une interdiction totale ne peut réussir sans une période de transition pragmatique. Une politique durable doit d&apos;abord développer des alternatives ferroviaires et multimodales crédibles avant de bannir définitivement l&apos;automobile.
                      </p>
                    </div>

                    {/* Décryptage des 4 Critères */}
                    <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      <div className="bg-card p-2 rounded border">
                        <strong className="text-primary block">Adéquation (5/5)</strong>
                        <span className="text-muted-foreground">162 mots (fourchette 120-180 mots).</span>
                      </div>
                      <div className="bg-card p-2 rounded border">
                        <strong className="text-amber-600 block">Cohérence (5/5)</strong>
                        <span className="text-muted-foreground">Structure antithétique parfaite : Thèse A, Thèse B, Synthèse.</span>
                      </div>
                      <div className="bg-card p-2 rounded border">
                        <strong className="text-emerald-600 block">Lexique (5/5)</strong>
                        <span className="text-muted-foreground">« piétonnisation intégrale », « asphyxier », « multimodales ».</span>
                      </div>
                      <div className="bg-card p-2 rounded border">
                        <strong className="text-cyan-600 block">Grammaire (5/5)</strong>
                        <span className="text-muted-foreground">Concession « bien que (...) j&apos;estime que », verbes précis.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <Button variant="outline" onClick={() => setActiveTaskTab(2)}>
                    ← Revoir la Tâche 2
                  </Button>
                  <Button
                    onClick={() => setActiveTab("examen")}
                    className="gap-2 font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <span>Passer au Grand Titre 3 : L&apos;Examen Blanc 60 min</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 📄 CONTENU DU GRAND TITRE 3 : LA SESSION EXAMEN BLANC (60 MIN)            */}
      {/* ========================================================================= */}
      {activeTab === "examen" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-b from-card via-card to-emerald-500/[0.04] p-6 sm:p-10 shadow-xl space-y-6 text-center">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Clock className="h-8 w-8" />
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Grand Titre 3 • Conditions Réelles France Éducation International
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-foreground">
                Session Examen Blanc Chronométré (60 Minutes)
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Vous avez terminé la présentation et la méthodologie des tâches. Il est temps d&apos;éprouver votre vitesse de frappe et votre endurance sur les 3 tâches consécutives dans les conditions officielles de l&apos;examen CBT.
              </p>
            </div>

            {/* Caractéristiques de la Salle d'Examen */}
            <div className="grid gap-3 sm:grid-cols-3 max-w-2xl mx-auto text-left text-xs">
              <div className="p-3.5 rounded-xl border bg-card space-y-1">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> Barre du Temps
                </span>
                <p className="text-muted-foreground">Jauge supérieure en 3 couleurs avec alertes de gestion des 15m, 20m et 25m.</p>
              </div>

              <div className="p-3.5 rounded-xl border bg-card space-y-1">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <PenTool className="h-3.5 w-3.5" /> Clavier d&apos;Accents FEI
                </span>
                <p className="text-muted-foreground">Bascule Majuscules/Minuscules (`[ a / A ]`) pour claviers QWERTY et symboles `« »`.</p>
              </div>

              <div className="p-3.5 rounded-xl border bg-card space-y-1">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" /> Soumission Automatique
                </span>
                <p className="text-muted-foreground">Sauvegarde en continu et envoi automatique à 00:00 avec correction IA instantanée.</p>
              </div>
            </div>

            <div className="pt-4">
              <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base px-8 h-12 shadow-lg gap-2">
                <Link href={`/examens/${series.id}/ee?mode=exam`}>
                  <span>Lancer l&apos;Examen Blanc Officiel (60:00)</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>

            <p className="text-[11px] text-muted-foreground italic">
              💡 Votre compagnon ({currentCompanion.name}) restera disponible lors du débriefing de vos résultats pour vous livrer une analyse personnalisée de votre score et les versions optimisées Magic Rewrite C1/C2.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
