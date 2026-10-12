"use client";

import React, { useState, useEffect } from "react";
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
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompanionPod } from "@/components/companions/companion-pod";
import { CompanionSelectorDialog } from "@/components/companions/companion-selector-dialog";
import {
  COMPANIONS,
  type CompanionId,
  DEFAULT_COMPANION_ID,
} from "@/lib/companions/data";
import { type WrittenExamSeries } from "@/lib/exam/written-types";
import { cn } from "@/lib/utils";

interface WritingMethodologyHubProps {
  series: WrittenExamSeries;
}

export function WritingMethodologyHub({ series }: WritingMethodologyHubProps) {
  const [companionId, setCompanionId] = useState<CompanionId>(DEFAULT_COMPANION_ID);
  const [isSelectorOpen, setIsSelectorOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"decryptage" | "tache1" | "tache2" | "tache3" | "examen">("decryptage");
  const [hydrated, setHydrated] = useState<boolean>(false);

  // Hydratation du compagnon depuis le localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("super4c2:user_companion") as CompanionId;
      if (saved && COMPANIONS[saved]) {
        setCompanionId(saved);
      } else {
        // Premier passage : proposer le choix du compagnon
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

  const currentCompanion = COMPANIONS[companionId] || COMPANIONS[DEFAULT_COMPANION_ID];

  // Message dynamique du compagnon selon l'onglet actif
  const companionMessage =
    activeTab === "decryptage"
      ? currentCompanion.tips.tcfGeneral
      : activeTab === "tache1"
      ? currentCompanion.tips.task1
      : activeTab === "tache2"
      ? currentCompanion.tips.task2
      : activeTab === "tache3"
      ? currentCompanion.tips.task3
      : currentCompanion.tips.exam;

  const companionContextTitle =
    activeTab === "decryptage"
      ? `Conseil de ${currentCompanion.name} • Barème FEI`
      : activeTab === "tache1"
      ? `Astuce ${currentCompanion.name} • Tâche 1`
      : activeTab === "tache2"
      ? `Astuce ${currentCompanion.name} • Tâche 2`
      : activeTab === "tache3"
      ? `Astuce ${currentCompanion.name} • Tâche 3`
      : `Briefing ${currentCompanion.name} • Examen Blanc 60 min`;

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      {/* Dialogue de sélection du compagnon */}
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
          <p className="text-sm text-muted-foreground max-w-2xl">
            Maîtrisez les 3 tâches officielles de France Éducation International avant de passer l&apos;examen blanc de 60 minutes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSelectorOpen(true)}
            className="text-xs font-semibold gap-1.5 border-primary/30 hover:bg-primary/5"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Compagnon : {currentCompanion.name}</span>
          </Button>
        </div>
      </div>

      {/* 🐻 Le Pod Compagnon Interactif */}
      {hydrated && (
        <CompanionPod
          companionId={companionId}
          message={companionMessage}
          contextTitle={companionContextTitle}
          onChangeCompanionClick={() => setIsSelectorOpen(true)}
        />
      )}

      {/* 🧭 Les 3 Paliers d'Apprentissage (Sélecteur d'onglets) */}
      <div className="flex border-b bg-muted/40 p-1.5 rounded-2xl gap-1.5 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("decryptage")}
          className={cn(
            "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap",
            activeTab === "decryptage"
              ? "bg-card text-foreground shadow-xs border border-primary/40"
              : "text-muted-foreground hover:bg-muted"
          )}
        >
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span>1. Décryptage FEI &amp; Barème</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("tache1")}
          className={cn(
            "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap",
            activeTab === "tache1"
              ? "bg-card text-foreground shadow-xs border border-primary/40"
              : "text-muted-foreground hover:bg-muted"
          )}
        >
          <BookOpen className="h-4 w-4 text-amber-500" />
          <span>2. Tâche 1 (Courriel • 15m)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("tache2")}
          className={cn(
            "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap",
            activeTab === "tache2"
              ? "bg-card text-foreground shadow-xs border border-primary/40"
              : "text-muted-foreground hover:bg-muted"
          )}
        >
          <Layers className="h-4 w-4 text-emerald-500" />
          <span>3. Tâche 2 (Récit • 20m)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("tache3")}
          className={cn(
            "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap",
            activeTab === "tache3"
              ? "bg-card text-foreground shadow-xs border border-primary/40"
              : "text-muted-foreground hover:bg-muted"
          )}
        >
          <Award className="h-4 w-4 text-cyan-500" />
          <span>4. Tâche 3 (Débat • 25m)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("examen")}
          className={cn(
            "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap ml-auto",
            activeTab === "examen"
              ? "bg-primary text-white shadow-xs"
              : "bg-primary/10 text-primary hover:bg-primary/20"
          )}
        >
          <Clock className="h-4 w-4" />
          <span>Examen Blanc (60 min)</span>
        </button>
      </div>

      {/* 📄 CONTENU DES ONGLETS */}

      {/* PALIER 1 : DÉCRYPTAGE FEI */}
      {activeTab === "decryptage" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border bg-card p-5 space-y-2 shadow-xs">
              <span className="text-xs font-bold text-primary uppercase tracking-wider block">
                Critère 1 • 5 Points
              </span>
              <h3 className="font-display text-base font-bold text-foreground">
                Adéquation à la situation
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Respect scrupuleux du volume de mots et de l&apos;objectif communicatif (inviter, raconter, comparer).
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-5 space-y-2 shadow-xs">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                Critère 2 • 5 Points
              </span>
              <h3 className="font-display text-base font-bold text-foreground">
                Cohérence &amp; Organisation
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Découpage en paragraphes clairs et utilisation de connecteurs logiques de transition variés.
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-5 space-y-2 shadow-xs">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                Critère 3 • 5 Points
              </span>
              <h3 className="font-display text-base font-bold text-foreground">
                Étendue Lexicale
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Richesse du vocabulaire, absence de répétitions et emploi de termes précis sans contresens.
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-5 space-y-2 shadow-xs">
              <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block">
                Critère 4 • 5 Points
              </span>
              <h3 className="font-display text-base font-bold text-foreground">
                Morphosyntaxe &amp; Grammaire
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Maîtrise des temps verbaux, propositions subordonnées complexes (relatives, concessions) et orthographe.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
            <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <span>Les 3 Pièges Éliminatoires à Éviter Absolument</span>
            </h3>
            <div className="grid gap-3 sm:grid-cols-3 text-xs">
              <div className="p-3.5 rounded-xl border border-destructive/20 bg-destructive/5 space-y-1">
                <p className="font-bold text-destructive">1. Moins de mots que le minimum</p>
                <p className="text-muted-foreground">
                  Moins de 60 mots en Tâche 1 ou moins de 120 mots en Tâches 2/3 entraîne une pénalité automatique de moitié des points.
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-destructive/20 bg-destructive/5 space-y-1">
                <p className="font-bold text-destructive">2. Le texte en bloc unique</p>
                <p className="text-muted-foreground">
                  Un texte sans paragraphes ni sauts de ligne est sanctionné lourdement en cohérence textuelle par les correcteurs FEI.
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-destructive/20 bg-destructive/5 space-y-1">
                <p className="font-bold text-destructive">3. Le hors-sujet en Tâche 3</p>
                <p className="text-muted-foreground">
                  Donner son avis immédiatement sans avoir exposé d&apos;abord les deux opinions contradictoires détruit la note.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={() => setActiveTab("tache1")} className="gap-2 font-bold">
              <span>Passer à la Méthodologie Tâche 1</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* PALIER 2 : TÂCHE 1 */}
      {activeTab === "tache1" && (
        <div className="space-y-6">
          <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Tâche 1 • 60 à 120 Mots • ~15 Minutes
                </span>
                <h2 className="font-display text-2xl font-black text-foreground mt-0.5">
                  Message ou Courriel (Décrire, Raconter, Inviter)
                </h2>
              </div>
              <Button asChild className="gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold">
                <Link href={`/examens/${series.id}/ee?mode=practice&task=1`}>
                  <span>S&apos;entraîner sur la Tâche 1 (15 min)</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <h3 className="font-display text-sm font-bold text-foreground">
                  La Structure Infaillible en 3 Paragraphes :
                </h3>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>1. Introduction :</strong> Salutation cordiale et annonce du motif (« Salut Julien, je t&apos;écris pour... »).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>2. Développement :</strong> Description concrète avec 2 ou 3 détails imagés (« baigné de lumière », « calme environnant »).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>3. Conclusion :</strong> Invitation précise et formule finale (« Fais-moi signe si ce créneau te convient ! À très vite »).</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border bg-muted/30 p-4 space-y-2">
                <span className="text-xs font-bold text-primary block">
                  💡 Formules Magiques C1/C2 à Réutiliser :
                </span>
                <div className="space-y-1.5 text-xs text-foreground font-mono bg-card p-3 rounded-lg border">
                  <p>• « Je serais ravi de te faire découvrir les lieux... »</p>
                  <p>• « Le cadre est absolument idéal pour se ressourcer. »</p>
                  <p>• « Fais-moi signe dès que tu auras un moment de libre. »</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <Button variant="outline" onClick={() => setActiveTab("decryptage")}>
              ← Retour au Décryptage
            </Button>
            <Button onClick={() => setActiveTab("tache2")} className="gap-2 font-bold">
              <span>Passer à la Tâche 2</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* PALIER 2 : TÂCHE 2 */}
      {activeTab === "tache2" && (
        <div className="space-y-6">
          <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Tâche 2 • 120 à 150 Mots • ~20 Minutes
                </span>
                <h2 className="font-display text-2xl font-black text-foreground mt-0.5">
                  Récit d&apos;Expérience &amp; Portée Citoyenne
                </h2>
              </div>
              <Button asChild className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                <Link href={`/examens/${series.id}/ee?mode=practice&task=2`}>
                  <span>S&apos;entraîner sur la Tâche 2 (20 min)</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <h3 className="font-display text-sm font-bold text-foreground">
                  Les Ingrédients du Niveau C1 en Tâche 2 :
                </h3>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Ancrage temporel précis :</strong> « Samedi dernier », « Lors de mon récent séjour », « Dès notre arrivée à l&apos;aube ».</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>L&apos;action vécue :</strong> Décrire une action collective ou un défi surmonté (« rassemblé plus d&apos;une cinquantaine de résidents »).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>La réflexion finale :</strong> Expliquer pourquoi cela change les choses (« retisser du lien social », « éveiller une conscience collective »).</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border bg-muted/30 p-4 space-y-2">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                  💡 Connecteurs Clés de Niveau C1 :
                </span>
                <div className="space-y-1.5 text-xs text-foreground font-mono bg-card p-3 rounded-lg border">
                  <p>• « Au-delà de la métamorphose paysagère indéniable... »</p>
                  <p>• « Bien que l&apos;effort fût soutenu, cette aventure humaine... »</p>
                  <p>• « À mon sens, de telles initiatives méritent d&apos;être pérennisées. »</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <Button variant="outline" onClick={() => setActiveTab("tache1")}>
              ← Retour à la Tâche 1
            </Button>
            <Button onClick={() => setActiveTab("tache3")} className="gap-2 font-bold">
              <span>Passer à la Tâche 3 (Débat)</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* PALIER 2 : TÂCHE 3 */}
      {activeTab === "tache3" && (
        <div className="space-y-6">
          <div className="rounded-2xl border bg-card p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                  Tâche 3 • 120 à 180 Mots • ~25 Minutes
                </span>
                <h2 className="font-display text-2xl font-black text-foreground mt-0.5">
                  Double Argumentation &amp; Prise de Position Nuancée
                </h2>
              </div>
              <Button asChild className="gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold">
                <Link href={`/examens/${series.id}/ee?mode=practice&task=3`}>
                  <span>S&apos;entraîner sur la Tâche 3 (25 min)</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <h3 className="font-display text-sm font-bold text-foreground">
                  La Règle d&apos;Or : Toujours Deux Thèses Opposées
                </h3>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Paragraphe 1 (Thèse A) :</strong> Exposer les arguments des partisans (« D&apos;un côté, certains soutiennent que... car... »).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Paragraphe 2 (Thèse B) :</strong> Exposer la contradiction (« D&apos;un autre côté, plusieurs spécialistes objectent que... »).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Paragraphe 3 (Synthèse Personnelle) :</strong> Prendre position avec concession (« Pour ma part, bien que (...) je demeure convaincu que... »).</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border bg-muted/30 p-4 space-y-2">
                <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 block">
                  💡 Formules de Concession Indispensables :
                </span>
                <div className="space-y-1.5 text-xs text-foreground font-mono bg-card p-3 rounded-lg border">
                  <p>• « Certes, il est indéniable que (...) Néanmoins... »</p>
                  <p>• « Si l&apos;argument de sécurité est légitime, il s&apos;avère insuffisant. »</p>
                  <p>• « Une politique inclusive commande donc de concilier... »</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <Button variant="outline" onClick={() => setActiveTab("tache2")}>
              ← Retour à la Tâche 2
            </Button>
            <Button onClick={() => setActiveTab("examen")} className="gap-2 font-bold bg-primary text-white">
              <span>Lancer l&apos;Examen Blanc 60 min</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* PALIER 3 : L'EXAMEN BLANC COMPLET 60 MIN */}
      {activeTab === "examen" && (
        <div className="space-y-6">
          <div className="rounded-3xl border-2 border-primary/30 bg-gradient-to-b from-card via-card to-primary/[0.05] p-6 sm:p-10 shadow-xl space-y-6 text-center">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/25">
              <Clock className="h-8 w-8" />
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Conditions Officielles France Éducation International
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-foreground">
                Prêt pour l&apos;Examen Blanc de 60 Minutes ?
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Vous disposez de 60 minutes réelles pour traiter les 3 tâches en continu. Vous aurez la barre de temps supérieure, le clavier virtuel de caractères accentués et la soumission automatique à 00:00.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 max-w-2xl mx-auto text-left text-xs">
              <div className="p-3 rounded-xl border bg-card space-y-1">
                <span className="font-bold text-primary">Tâche 1</span>
                <p className="text-muted-foreground">Courriel (60-120 mots) • ~15 min</p>
              </div>
              <div className="p-3 rounded-xl border bg-card space-y-1">
                <span className="font-bold text-primary">Tâche 2</span>
                <p className="text-muted-foreground">Récit (120-150 mots) • ~20 min</p>
              </div>
              <div className="p-3 rounded-xl border bg-card space-y-1">
                <span className="font-bold text-primary">Tâche 3</span>
                <p className="text-muted-foreground">Débat (120-180 mots) • ~25 min</p>
              </div>
            </div>

            <div className="pt-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary-dark font-black text-base px-8 h-12 shadow-lg">
                <Link href={`/examens/${series.id}/ee?mode=exam`} className="flex items-center gap-2">
                  <span>Démarrer l&apos;Examen Blanc (60:00)</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
