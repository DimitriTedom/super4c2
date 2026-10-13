"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Volume2, VolumeX, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANIONS, getCompanionById, type Companion, type CompanionId } from "@/lib/companions/data";
import { CompanionSelectorDialog } from "@/components/companions/companion-selector-dialog";

interface CandidateCompanionWelcomeProps {
  userDisplayName: string;
}

export function CandidateCompanionWelcome({ userDisplayName }: CandidateCompanionWelcomeProps) {
  const [companion, setCompanion] = useState<Companion>(COMPANIONS.kodiak);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("super4c2:user_companion");
      if (stored) {
        setCompanion(getCompanionById(stored));
      }
    } catch {
      // Ignorer
    }
  }, []);

  const handleSelectCompanion = (id: CompanionId) => {
    setCompanion(getCompanionById(id));
  };

  const handleSpeak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const speechText = `Bonjour ${userDisplayName} ! Je suis ${companion.name}, ton coach pour le TCF Canada. Aujourd'hui, l'Expression Écrite et l'Expression Orale sont à l'honneur et 100% gratuites. Ensemble, nous allons viser le C2 et décrocher tes 50 points d'Entrée Express !`;

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = "fr-FR";
    utterance.rate = 1.0;
    utterance.pitch = companion.id === "kodiak" ? 0.9 : companion.id === "aura" ? 1.05 : 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-card via-card to-primary/[0.04] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          {/* Avatar & Message */}
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div
                className={`relative h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-2xl border-2 shadow-md transition-all ${
                  isSpeaking
                    ? "border-emerald-500 ring-4 ring-emerald-500/20 scale-105"
                    : "border-primary/40 ring-2 ring-primary/10"
                }`}
              >
                <Image
                  src={companion.avatarUrl}
                  alt={companion.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-background border border-border shadow-xs text-xs">
                {companion.id === "kodiak" ? "🐻" : companion.id === "aura" ? "⚡" : "🦫"}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-base text-foreground">
                  {companion.name}
                </span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  {companion.badge}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl">
                &laquo; Bonjour <strong>{userDisplayName}</strong> ! Prêt pour l&apos;entraînement ? Les simulateurs d&apos;<strong>Expression Écrite</strong> et d&apos;<strong>Expression Orale</strong> sont 100% gratuits et débloqués. Visons le C2 ensemble ! &raquo;
              </p>
            </div>
          </div>

          {/* Actions : Écouter & Changer */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSpeak}
              className={`rounded-full gap-1.5 text-xs font-semibold ${
                isSpeaking ? "border-emerald-500 text-emerald-600 bg-emerald-500/10" : ""
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="h-3.5 w-3.5 animate-pulse" />
                  <span>Arrêter</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>Écouter {companion.name}</span>
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setSelectorOpen(true)}
              className="rounded-full gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Changer</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Modal Sélecteur de Compagnon */}
      <CompanionSelectorDialog
        open={selectorOpen}
        onOpenChange={setSelectorOpen}
        currentSelectedId={companion.id}
        onSelectCompanion={handleSelectCompanion}
        canSkip={true}
      />
    </>
  );
}
