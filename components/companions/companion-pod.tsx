"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Volume2, VolumeX, Sparkles, RefreshCw } from "lucide-react";
import { COMPANIONS, type CompanionId, DEFAULT_COMPANION_ID } from "@/lib/companions/data";
import { cn } from "@/lib/utils";

interface CompanionPodProps {
  companionId?: CompanionId;
  message?: string;
  contextTitle?: string;
  onChangeCompanionClick?: () => void;
  className?: string;
}

export function CompanionPod({
  companionId = DEFAULT_COMPANION_ID,
  message,
  contextTitle,
  onChangeCompanionClick,
  className,
}: CompanionPodProps) {
  const companion = COMPANIONS[companionId] || COMPANIONS[DEFAULT_COMPANION_ID];
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const textToRead = message || companion.speechText;
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Arrêter l'audio si le composant est démonté
  useEffect(() => {
    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
    };
  }, []);

  const handleToggleSpeak = () => {
    if (isPlaying) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.currentTime = 0;
        audioPlayerRef.current = null;
      }
      setIsPlaying(false);
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

      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => setIsPlaying(false);

      audio.play().catch(() => setIsPlaying(false));
    } catch {
      setIsPlaying(false);
    }
  };

  return (
    <div
      className={cn(
        "relative rounded-2xl border-2 border-primary/25 bg-gradient-to-r from-card via-card to-primary/[0.04] p-4 sm:p-5 shadow-md flex flex-col sm:flex-row items-center sm:items-start gap-4",
        className
      )}
    >
      {/* Avatar Photographique du Mentor */}
      <div className="relative shrink-0 flex flex-col items-center gap-1.5">
        <div
          className={cn(
            "relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl overflow-hidden border-2 shadow-md bg-muted transition-transform",
            isPlaying ? "border-primary ring-4 ring-primary/20 scale-105" : "border-border/80"
          )}
        >
          <Image
            src={companion.avatarUrl}
            alt={companion.name}
            fill
            className="object-cover object-center"
            priority
          />

          {/* Effet d'animation de parole */}
          {isPlaying && (
            <div className="absolute inset-0 bg-primary/15 animate-pulse flex items-end justify-center pb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
            </div>
          )}
        </div>

        <div className="text-center">
          <span className="font-display text-xs font-black text-foreground block">
            {companion.name}
          </span>
          <span className="text-[10px] text-muted-foreground font-semibold">
            {companion.role.split("&")[0]}
          </span>
        </div>
      </div>

      {/* Bulle de dialogue interactive */}
      <div className="flex-1 space-y-2 text-center sm:text-left min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              <Sparkles className="h-3 w-3" />
              {contextTitle || "Conseil de votre Mentor"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Bouton d'écoute de la voix studio */}
            <button
              type="button"
              onClick={handleToggleSpeak}
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all border shadow-2xs",
                isPlaying
                  ? "bg-primary text-white border-primary"
                  : "bg-muted/70 text-foreground hover:bg-muted border-border/70"
              )}
              title={isPlaying ? "Mettre en pause la voix" : "Écouter le message à haute voix"}
            >
              {isPlaying ? (
                <>
                  <VolumeX className="h-3.5 w-3.5" />
                  <span>Arrêter</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>Écouter la voix studio</span>
                </>
              )}
            </button>

            {/* Bouton pour changer de mentor */}
            {onChangeCompanionClick && (
              <button
                type="button"
                onClick={onChangeCompanionClick}
                className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground font-medium transition-colors"
                title="Changer de mentor"
              >
                <RefreshCw className="h-3 w-3" />
                <span className="hidden sm:inline">Changer</span>
              </button>
            )}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-foreground/90 font-medium leading-relaxed whitespace-pre-line">
          {textToRead}
        </p>
      </div>
    </div>
  );
}
