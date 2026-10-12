"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Sparkles, Check, Volume2, VolumeX, ArrowRight, X } from "lucide-react";
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
}

export function CompanionSelectorDialog({
  open,
  onOpenChange,
  onSelectCompanion,
  currentSelectedId,
  canSkip = true,
}: CompanionSelectorDialogProps) {
  const [selectedId, setSelectedId] = useState<CompanionId>(currentSelectedId || DEFAULT_COMPANION_ID);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [speakingCompanionId, setSpeakingCompanionId] = useState<CompanionId | null>(null);

  useEffect(() => {
    if (currentSelectedId) {
      setSelectedId(currentSelectedId);
    }
  }, [currentSelectedId]);

  // Lecture vocale de bienvenue via Web Speech API (fallback universel garanti)
  const handlePreviewVoice = (companionId: CompanionId) => {
    if (typeof window === "undefined") return;

    if (isPlayingAudio && speakingCompanionId === companionId) {
      window.speechSynthesis?.cancel();
      setIsPlayingAudio(false);
      setSpeakingCompanionId(null);
      return;
    }

    window.speechSynthesis?.cancel();
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

    window.speechSynthesis?.speak(utterance);
  };

  const handleConfirm = () => {
    window.speechSynthesis?.cancel();
    setIsPlayingAudio(false);
    onSelectCompanion(selectedId);
    onOpenChange(false);
  };

  const handleSkip = () => {
    window.speechSynthesis?.cancel();
    setIsPlayingAudio(false);
    onSelectCompanion(selectedId || DEFAULT_COMPANION_ID);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-6 sm:p-8 overflow-y-auto max-h-[92vh]">
        <DialogHeader className="text-center space-y-2">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Votre Mentor d&apos;Entraînement TCF Canada</span>
          </div>

          <DialogTitle className="font-display text-2xl sm:text-3xl font-black text-foreground">
            Choisissez votre Compagnon de Formation
          </DialogTitle>

          <DialogDescription className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Pour ne plus jamais affronter la page blanche seul : votre compagnon vous guidera à travers les règles FEI, vous soufflera les phrases clés C1/C2 et décodera vos erreurs.
          </DialogDescription>
        </DialogHeader>

        {/* 3 Cartes 3D des Compagnons */}
        <div className="grid gap-4 sm:grid-cols-3 pt-4">
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t mt-4">
          {canSkip ? (
            <button
              type="button"
              onClick={handleSkip}
              className="text-xs text-muted-foreground hover:text-foreground hover:underline font-medium"
            >
              Passer l&apos;introduction / Aller directement aux exercices →
            </button>
          ) : (
            <div />
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
      </DialogContent>
    </Dialog>
  );
}
