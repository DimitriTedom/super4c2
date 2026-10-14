"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Volume2, VolumeX, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANIONS, getCompanionById, type Companion, type CompanionId } from "@/lib/companions/data";
import { CompanionSelectorDialog } from "@/components/companions/companion-selector-dialog";

interface CandidateCompanionWelcomeProps {
  userDisplayName: string;
}

export function CandidateCompanionWelcome({ userDisplayName }: CandidateCompanionWelcomeProps) {
  const [companion, setCompanion] = useState<Companion>(COMPANIONS.laurent);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("super4c2:user_companion");
      if (stored) {
        setCompanion(getCompanionById(stored));
      } else {
        // Premier passage : proposer le flow d'accueil TCF et de choix du mentor
        const timer = setTimeout(() => {
          setSelectorOpen(true);
        }, 800);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignorer
    }
  }, []);

  const handleSelectCompanion = (id: CompanionId) => {
    const selected = getCompanionById(id);
    setCompanion(selected);
    try {
      localStorage.setItem("super4c2:user_companion", id);
    } catch {}
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.currentTime = 0;
        audioPlayerRef.current = null;
      }
      setIsSpeaking(false);
      return;
    }

    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }

    const audioUrl = companion.audioPreviewUrl || "/audio/eo/laurent-step1.mp3";
    try {
      const audio = new Audio(audioUrl);
      audioPlayerRef.current = audio;

      audio.onplay = () => setIsSpeaking(true);
      audio.onended = () => setIsSpeaking(false);
      audio.onerror = () => setIsSpeaking(false);

      audio.play().catch(() => setIsSpeaking(false));
    } catch {
      setIsSpeaking(false);
    }
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
                  className="object-cover object-top"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-background border border-border shadow-xs text-xs">
                🏛️
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
                &laquo; Bonjour <strong>{userDisplayName}</strong> ! Prêt pour l&apos;entraînement ? Les simulateurs d&apos;<strong>Expression Écrite</strong> et d&apos;<strong>Expression Orale</strong> sont 100% gratuits et calibrés sur les grilles FEI. Visons ensemble le palier NCLC 7 et le C2 ! &raquo;
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
                  <span>Arrêter la voix</span>
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

      {/* Modal Sélecteur de Mentor */}
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
