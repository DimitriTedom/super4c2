"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Download,
  Headphones,
  ShieldCheck,
  Sparkles,
  Layers,
  Clock,
  Gauge,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CandidateOralAudioPlayerProps {
  audioUrl?: string | null;
  taskTimestamps?: {
    1?: number; // secondes
    2?: number;
    3?: number;
  };
  onSelectTaskTime?: (taskNum: number, seconds: number) => void;
  className?: string;
}

export function CandidateOralAudioPlayer({
  audioUrl,
  taskTimestamps = { 1: 0, 2: 120, 3: 330 },
  onSelectTaskTime,
  className,
}: CandidateOralAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [isReady, setIsReady] = useState<boolean>(false);

  // Formattage MM:SS
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return "00:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsReady(true);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => {
        console.warn("Échec lecture audio :", err);
      });
    }
  };

  const seekTo = (secs: number) => {
    if (!audioRef.current) return;
    const target = Math.max(0, Math.min(secs, duration || 720));
    audioRef.current.currentTime = target;
    setCurrentTime(target);
  };

  const handleSkip = (delta: number) => {
    seekTo(currentTime + delta);
  };

  const handleRateChange = () => {
    if (!audioRef.current) return;
    const rates = [1, 1.25, 1.5, 0.8];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    const nextRate = rates[nextIdx];
    audioRef.current.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    audioRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleJumpToTask = (taskNum: number, defaultSec: number) => {
    const targetSec = taskTimestamps[taskNum as 1 | 2 | 3] ?? defaultSec;
    seekTo(targetSec);
    if (!isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
    if (onSelectTaskTime) {
      onSelectTaskTime(taskNum, targetSec);
    }
  };

  // Progression en pourcentage
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Données factices de forme d'onde (36 barres harmonieuses)
  const waveHeights = [
    25, 45, 65, 35, 80, 55, 90, 70, 40, 60, 85, 95, 75, 50, 65, 80, 45, 90,
    100, 85, 60, 40, 75, 95, 70, 50, 80, 65, 45, 60, 75, 90, 55, 40, 65, 30,
  ];

  if (!audioUrl) {
    return (
      <div className={cn("rounded-2xl border border-dashed bg-muted/20 p-5 text-center space-y-2", className)}>
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <Headphones className="h-5 w-5" />
        </div>
        <p className="text-xs font-semibold text-foreground">Archive Audio Non Disponible</p>
        <p className="text-[11px] text-muted-foreground max-w-md mx-auto">
          L&apos;enregistrement intégral de cette session n&apos;a pas pu être sauvegardé (micro désactivé lors de l&apos;épreuve ou session textuelle).
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-3xl border-2 border-primary/25 bg-gradient-to-br from-card via-card to-primary/[0.04] p-5 sm:p-7 shadow-sm space-y-5",
        className
      )}
    >
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* En-tête du lecteur */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20">
              <ShieldCheck className="h-3 w-3" /> Archive Audio Certifiée
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-muted-foreground">
              <Headphones className="h-3 w-3 text-cyan-500" /> Mixage Bicanal (Laurent &amp; Candidat)
            </span>
          </div>
          <h3 className="font-display text-base sm:text-lg font-black text-foreground flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-primary" />
            Réécoute &amp; Analyse de votre Prestation Orale
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Identifiez précisément vos micro-hésitations, vos variations d&apos;intonation et vos temps de parole réels.
          </p>
        </div>

        {/* Bouton Téléchargement */}
        <Button
          asChild
          variant="outline"
          size="sm"
          className="gap-2 font-bold text-xs rounded-xl border-border/80 hover:bg-primary/10 hover:text-primary self-start sm:self-auto cursor-pointer h-8 shadow-2xs"
        >
          <a
            href={audioUrl}
            download={`super4c2-tcf-expression-orale-archive.webm`}
            title="Télécharger l'enregistrement audio au format brut"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Télécharger l&apos;Audio</span>
          </a>
        </Button>
      </div>

      {/* ========================================================================= */}
      {/* 🌊 VISUALISEUR AUDIO AVEC FORME D'ONDE RÉACTIVE                           */}
      {/* ========================================================================= */}
      <div className="space-y-2">
        <div className="flex items-end justify-between gap-1 h-12 px-2 pt-2 bg-muted/20 rounded-2xl border border-border/40 overflow-hidden">
          {waveHeights.map((h, i) => {
            const barFraction = (i + 1) / waveHeights.length;
            const isPlayed = duration > 0 ? currentTime / duration >= barFraction : false;
            return (
              <div
                key={i}
                onClick={() => {
                  if (duration > 0) {
                    seekTo((i / waveHeights.length) * duration);
                  }
                }}
                className={cn(
                  "flex-1 rounded-t-sm transition-all duration-150 cursor-pointer hover:opacity-100",
                  isPlayed
                    ? "bg-primary opacity-90"
                    : "bg-muted-foreground/30 opacity-60 hover:bg-primary/50",
                  isPlaying && isPlayed ? "animate-pulse" : ""
                )}
                style={{ height: `${h}%` }}
                title={`Aller à ${formatTime((i / waveHeights.length) * (duration || 720))}`}
              />
            );
          })}
        </div>

        {/* Barre de Progression (Seekbar) */}
        <div className="relative flex items-center">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.5}
            value={currentTime}
            onChange={(e) => seekTo(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
          />
        </div>

        {/* Chronomètres */}
        <div className="flex items-center justify-between text-[11px] font-mono font-bold text-muted-foreground px-1">
          <span className="text-foreground">{formatTime(currentTime)}</span>
          <span>{formatTime(duration || 720)}</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🎛️ CONTRÔLES DE TRANSPORT DU LECTEUR                                      */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Contrôles de lecture gauche */}
        <div className="flex items-center gap-2">
          {/* Bouton Recommencer */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => seekTo(0)}
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
            title="Revenir au début (00:00)"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>

          {/* Saut -10s */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleSkip(-10)}
            className="h-8 px-2.5 rounded-xl font-bold text-xs gap-1 cursor-pointer"
            title="Reculer de 10 secondes"
          >
            <span className="text-[10px]">-10s</span>
          </Button>

          {/* Play / Pause Principal */}
          <Button
            type="button"
            onClick={togglePlay}
            size="default"
            className="h-10 px-5 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs gap-2 shadow-sm cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current ml-0.5" />
                <span>Écouter</span>
              </>
            )}
          </Button>

          {/* Saut +10s */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleSkip(10)}
            className="h-8 px-2.5 rounded-xl font-bold text-xs gap-1 cursor-pointer"
            title="Avancer de 10 secondes"
          >
            <span className="text-[10px]">+10s</span>
          </Button>

          {/* Mute */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground cursor-pointer ml-1"
            title={isMuted ? "Réactiver le son" : "Couper le son"}
          >
            {isMuted ? <VolumeX className="h-4 w-4 text-destructive" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>

        {/* Vitesse & Raccourcis de Tâches à droite */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Régulateur de vitesse */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRateChange}
            className="h-8 px-2.5 rounded-xl text-xs font-mono font-bold border-border/80 text-foreground cursor-pointer"
            title="Changer la vitesse de lecture"
          >
            <Gauge className="h-3 w-3 mr-1 text-primary" />
            <span>{playbackRate}x</span>
          </Button>

          {/* Saut rapide par Tâche */}
          <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border/50 text-[11px] font-bold">
            <button
              type="button"
              onClick={() => handleJumpToTask(1, 0)}
              className="px-2 py-0.5 rounded-lg hover:bg-card transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
              title="Aller à la Tâche 1 : Entretien Dirigé (00:00)"
            >
              Tâche 1
            </button>
            <span className="text-muted-foreground/30">•</span>
            <button
              type="button"
              onClick={() => handleJumpToTask(2, 120)}
              className="px-2 py-0.5 rounded-lg hover:bg-card transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
              title="Aller à la Tâche 2 : Jeu de Rôle (02:00)"
            >
              Tâche 2
            </button>
            <span className="text-muted-foreground/30">•</span>
            <button
              type="button"
              onClick={() => handleJumpToTask(3, 330)}
              className="px-2 py-0.5 rounded-lg hover:bg-card transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
              title="Aller à la Tâche 3 : Argumentation (05:30)"
            >
              Tâche 3
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
