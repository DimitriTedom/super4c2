"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Sparkles,
  Check,
  Volume2,
  VolumeX,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Trophy,
  ShieldCheck,
  Clock,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { COMPANIONS, type CompanionId, DEFAULT_COMPANION_ID } from "@/lib/companions/data";
import { cn } from "@/lib/utils";

interface CompanionSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectCompanion: (id: CompanionId) => void;
  currentSelectedId?: CompanionId;
  canSkip?: boolean;
  initialStep?: 1 | 2;
}

export function CompanionSelectorDialog({
  open,
  onOpenChange,
  onSelectCompanion,
  currentSelectedId,
  canSkip = true,
  initialStep = 1,
}: CompanionSelectorDialogProps) {
  const [step, setStep] = useState<1 | 2>(initialStep);
  const [selectedId, setSelectedId] = useState<CompanionId>(currentSelectedId || DEFAULT_COMPANION_ID);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [speakingCompanionId, setSpeakingCompanionId] = useState<CompanionId | "tcf-intro" | null>(null);

  useEffect(() => {
    if (currentSelectedId) {
      setSelectedId(currentSelectedId);
    }
  }, [currentSelectedId]);

  useEffect(() => {
    if (open) {
      setStep(initialStep);
    } else {
      if (typeof window !== "undefined") {
        window.speechSynthesis?.cancel();
      }
      setIsPlayingAudio(false);
      setSpeakingCompanionId(null);
    }
  }, [open, initialStep]);

  // 1. Lecture vocale de l'introduction générale TCF Canada (Étape 1)
  const handlePlayTcfIntro = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isPlayingAudio && speakingCompanionId === "tcf-intro") {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setSpeakingCompanionId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const companion = COMPANIONS[selectedId] || COMPANIONS[DEFAULT_COMPANION_ID];
    const utterance = new SpeechSynthesisUtterance(companion.tcfWelcomeSpeech);
    utterance.lang = "fr-FR";
    utterance.rate = 1.0;
    utterance.pitch = selectedId === "aura" ? 1.1 : selectedId === "kodiak" ? 0.9 : 1.0;

    utterance.onstart = () => {
      setIsPlayingAudio(true);
      setSpeakingCompanionId("tcf-intro");
    };
    utterance.onend = () => {
      setIsPlayingAudio(false);
      setSpeakingCompanionId(null);
    };
    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setSpeakingCompanionId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // 2. Lecture vocale du compagnon spécifique (Étape 2)
  const handlePreviewVoice = (companionId: CompanionId) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isPlayingAudio && speakingCompanionId === companionId) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setSpeakingCompanionId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const companion = COMPANIONS[companionId];
    const utterance = new SpeechSynthesisUtterance(companion.speechText);
    utterance.lang = "fr-FR";
    utterance.rate = 1.0;
    utterance.pitch = companionId === "aura" ? 1.15 : companionId === "kodiak" ? 0.9 : 1.05;

    utterance.onstart = () => {
      setIsPlayingAudio(true);
      setSpeakingCompanionId(companionId);
    };
    utterance.onend = () => {
      setIsPlayingAudio(false);
      setSpeakingCompanionId(null);
    };
    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setSpeakingCompanionId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleConfirm = () => {
    if (typeof window !== "undefined") {
      window.speechSynthesis?.cancel();
    }
    setIsPlayingAudio(false);
    onSelectCompanion(selectedId);
    onOpenChange(false);
  };

  const handleSkip = () => {
    if (typeof window !== "undefined") {
      window.speechSynthesis?.cancel();
    }
    setIsPlayingAudio(false);
    onSelectCompanion(selectedId || DEFAULT_COMPANION_ID);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-6 sm:p-8 overflow-y-auto max-h-[94vh]">
        {/* Progression des Étapes */}
        <div className="flex items-center justify-between border-b pb-4 mb-2">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                step === 1 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              )}
            >
              1
            </span>
            <span className={cn("text-xs font-bold", step === 1 ? "text-primary" : "text-muted-foreground")}>
              Présentation TCF Canada
            </span>
            <span className="text-muted-foreground/40">→</span>
            <span
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                step === 2 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              )}
            >
              2
            </span>
            <span className={cn("text-xs font-bold", step === 2 ? "text-primary" : "text-muted-foreground")}>
              Votre Compagnon 3D
            </span>
          </div>

          <span className="text-xs font-mono font-semibold text-muted-foreground hidden sm:inline">
            Étape {step} sur 2
          </span>
        </div>

        {/* ============================================================ */}
        {/* ÉTAPE 1 : TEXTE ORAL D'ACCUEIL QUI DÉCRIT LE TCF CANADA      */}
        {/* ============================================================ */}
        {step === 1 && (
          <div className="space-y-6">
            <DialogHeader className="text-center space-y-2">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
                <GraduationCap className="h-3.5 w-3.5" />
                <span>Accueil &amp; Présentation Officielle</span>
              </div>

              <DialogTitle className="font-display text-2xl sm:text-3xl font-black text-foreground">
                Bienvenue dans votre Préparation TCF Canada
              </DialogTitle>

              <DialogDescription className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Le Test de Connaissance du Français pour le Canada est la clé de voûte de votre dossier d&apos;immigration Entrée Express.
              </DialogDescription>
            </DialogHeader>

            {/* Lecteur Audio de Présentation Orale */}
            <div className="rounded-3xl border-2 border-primary/30 bg-gradient-to-r from-primary/[0.06] via-background to-primary/[0.04] p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition-all",
                      speakingCompanionId === "tcf-intro"
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/30 scale-105"
                        : "bg-primary/10 text-primary border-primary/20"
                    )}
                  >
                    {speakingCompanionId === "tcf-intro" ? (
                      <Volume2 className="h-6 w-6 animate-pulse" />
                    ) : (
                      <Volume2 className="h-6 w-6" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                      <span>Message Vocal d&apos;Accueil TCF Canada</span>
                      {speakingCompanionId === "tcf-intro" && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                          Lecture en direct
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Écoutez la présentation complète des 4 épreuves et des enjeux NCLC 7.
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handlePlayTcfIntro}
                  className={cn(
                    "w-full sm:w-auto shrink-0 font-bold text-xs h-10 px-4 rounded-xl shadow-xs gap-2",
                    speakingCompanionId === "tcf-intro"
                      ? "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900"
                      : "bg-primary hover:bg-primary-dark text-white"
                  )}
                >
                  {speakingCompanionId === "tcf-intro" ? (
                    <>
                      <VolumeX className="h-4 w-4" />
                      <span>Mettre en pause l&apos;audio</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-4 w-4" />
                      <span>Écouter la présentation orale</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Transcription écrite d'accueil */}
              <div className="mt-4 pt-4 border-t border-border/60 text-xs sm:text-sm text-foreground/90 leading-relaxed bg-card/60 p-4 rounded-2xl border">
                <p>
                  &laquo; Le <strong>TCF Canada</strong> est le test linguistique officiel administré par France Éducation International pour l&apos;immigration et l&apos;Entrée Express. Il comprend 4 épreuves : la Compréhension Orale, la Compréhension Écrite, l&apos;Expression Écrite et l&apos;Expression Orale.
                </p>
                <p className="mt-2 text-muted-foreground">
                  Votre objectif majeur est d&apos;atteindre le <strong>palier NCLC 7 (Niveau 7 minimum dans chaque épreuve)</strong>, qui débloque instantanément <strong>+50 points CRS</strong> pour votre dossier. Or, 78% des candidats perdent leurs points en Expression Écrite et Orale. Avec Super4C2, vous allez vous entraîner de façon méthodique avec un compagnon d&apos;entraînement dédié. &raquo;
                </p>
              </div>
            </div>

            {/* Grille des 4 Compétences TCF Canada */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl border bg-card p-3.5 text-center space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Épreuve 1</span>
                <p className="font-display font-bold text-xs sm:text-sm text-foreground">Compréhension Orale</p>
                <p className="text-[11px] text-muted-foreground">39 QCM · 35 min</p>
              </div>

              <div className="rounded-2xl border bg-card p-3.5 text-center space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Épreuve 2</span>
                <p className="font-display font-bold text-xs sm:text-sm text-foreground">Compréhension Écrite</p>
                <p className="text-[11px] text-muted-foreground">39 QCM · 60 min</p>
              </div>

              <div className="rounded-2xl border-2 border-primary/40 bg-primary/[0.04] p-3.5 text-center space-y-1 shadow-xs">
                <span className="text-[10px] font-bold text-primary uppercase">Épreuve 3 · Ouvert</span>
                <p className="font-display font-black text-xs sm:text-sm text-primary">Expression Écrite</p>
                <p className="text-[11px] text-primary/80 font-semibold">3 Tâches · 60 min</p>
              </div>

              <div className="rounded-2xl border-2 border-amber-500/40 bg-amber-500/[0.04] p-3.5 text-center space-y-1 shadow-xs">
                <span className="text-[10px] font-bold text-amber-600 uppercase">Épreuve 4 · Ouvert</span>
                <p className="font-display font-black text-xs sm:text-sm text-amber-600 dark:text-amber-400">Expression Orale</p>
                <p className="text-[11px] text-amber-700/80 font-semibold">3 Tâches · 12 min</p>
              </div>
            </div>

            {/* Encart Bonus CRS */}
            <div className="flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-xs">
              <div className="flex items-center gap-2.5">
                <Trophy className="h-5 w-5 text-emerald-600 shrink-0" />
                <span className="text-emerald-950 dark:text-emerald-200 font-medium">
                  <strong>Seuil C1 / NCLC 7 atteint</strong> = +50 points CRS au profil Entrée Express Canada
                </span>
              </div>
              <span className="font-bold text-emerald-600 font-mono text-sm">+50 PTS</span>
            </div>

            {/* Bouton Suivant vers Étape 2 */}
            <div className="flex items-center justify-between pt-4 border-t">
              {canSkip ? (
                <button
                  type="button"
                  onClick={handleSkip}
                  className="text-xs text-muted-foreground hover:text-foreground hover:underline"
                >
                  Aller directement aux exercices →
                </button>
              ) : (
                <div />
              )}

              <Button
                size="lg"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.speechSynthesis?.cancel();
                  }
                  setIsPlayingAudio(false);
                  setSpeakingCompanionId(null);
                  setStep(2);
                }}
                className="bg-primary hover:bg-primary-dark font-bold text-sm shadow-md gap-2 px-6"
              >
                <span>Suivant : Choisir mon Compagnon de Formation</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* ÉTAPE 2 : CHOISIR SON COMPAGNON (LE NOUNOURS 3D KODIAK ETC.) */}
        {/* ============================================================ */}
        {step === 2 && (
          <div className="space-y-6">
            <DialogHeader className="text-center space-y-2">
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Votre Guide Vocal &amp; Pédagogique</span>
              </div>

              <DialogTitle className="font-display text-2xl sm:text-3xl font-black text-foreground">
                Choisissez votre Compagnon de Formation
              </DialogTitle>

              <DialogDescription className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Il vous accompagnera sur chaque page, lira les consignes à voix haute, vous rappellera la gestion du temps et vous soufflera les tournures C1/C2.
              </DialogDescription>
            </DialogHeader>

            {/* 3 Cartes 3D des Compagnons */}
            <div className="grid gap-4 sm:grid-cols-3 pt-2">
              {(Object.keys(COMPANIONS) as CompanionId[]).map((id) => {
                const companion = COMPANIONS[id];
                const isSelected = selectedId === id;
                const isSpeakingThis = isPlayingAudio && speakingCompanionId === id;

                return (
                  <div
                    key={id}
                    onClick={() => setSelectedId(id)}
                    className={cn(
                      "group relative cursor-pointer rounded-2xl border-2 p-4 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-sm",
                      isSelected
                        ? "border-primary bg-primary/[0.04] shadow-lg shadow-primary/10 scale-[1.02]"
                        : "border-border/80 bg-card hover:border-primary/40 hover:bg-muted/30"
                    )}
                  >
                    {/* Badge En vedette sur Kodiak (le nounours 3D canadien) */}
                    {id === "kodiak" && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-600 to-rose-600 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs">
                        ⭐ Coach Recommandé
                      </div>
                    )}

                    {/* Pastille de sélection active */}
                    {isSelected && (
                      <div className="absolute top-3 right-3 h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                    )}

                    <div className="space-y-3 text-center flex flex-col items-center">
                      {/* Avatar 3D Haute Résolution */}
                      <div className="relative h-32 w-32 rounded-2xl overflow-hidden border-2 border-border/80 shadow-md group-hover:scale-105 transition-transform duration-300 bg-muted">
                        <Image
                          src={companion.avatarUrl}
                          alt={companion.name}
                          fill
                          className="object-cover"
                          priority
                        />

                        {/* Ondulation quand il parle */}
                        {isSpeakingThis && (
                          <div className="absolute inset-0 border-4 border-primary rounded-2xl animate-pulse bg-primary/10 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-primary bg-background/90 px-2 py-0.5 rounded-full shadow-xs">
                              Parle en direct...
                            </span>
                          </div>
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                          {companion.badge}
                        </span>
                        <h3 className="font-display text-lg font-black text-foreground">
                          {companion.name}
                        </h3>
                        <p className="text-xs font-semibold text-muted-foreground">{companion.role}</p>
                      </div>

                      <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2 italic">
                        « {companion.tagline} »
                      </p>
                    </div>

                    {/* Bouton d'écoute de la voix */}
                    <div className="pt-2 border-t border-border/60">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreviewVoice(id);
                        }}
                        className={cn(
                          "w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all border",
                          isSpeakingThis
                            ? "bg-primary text-white border-primary shadow-xs"
                            : "bg-muted/50 text-foreground hover:bg-muted border-border/60"
                        )}
                      >
                        {isSpeakingThis ? (
                          <>
                            <VolumeX className="h-3.5 w-3.5" />
                            <span>Arrêter la voix</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="h-3.5 w-3.5" />
                            <span>Écouter {companion.name}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Barre d'action basse */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.speechSynthesis?.cancel();
                  }
                  setIsPlayingAudio(false);
                  setSpeakingCompanionId(null);
                  setStep(1);
                }}
                className="text-xs font-semibold gap-1 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Retour à la présentation</span>
              </Button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {canSkip && (
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="text-xs text-muted-foreground hover:text-foreground hover:underline mr-2 hidden sm:inline"
                  >
                    Passer →
                  </button>
                )}

                <Button
                  size="lg"
                  onClick={handleConfirm}
                  className="w-full sm:w-auto bg-primary hover:bg-primary-dark font-bold text-sm shadow-md gap-2 px-6"
                >
                  <span>Choisir {COMPANIONS[selectedId].name} &amp; Continuer</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
