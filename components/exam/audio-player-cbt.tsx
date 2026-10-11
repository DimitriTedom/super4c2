"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Headphones, Lock, Play, RotateCcw, FileText, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AudioPlayerCBTProps {
  /** Real audio file. */
  src?: string;
  /** Demo fallback: read aloud with the browser's French voice when no file exists. */
  fallbackText?: string;
  played: boolean;
  disabled?: boolean;
  onPlayed: () => void;
  /** Practice mode capabilities */
  mode?: "exam" | "practice";
  onReplay?: () => void;
  transcript?: string;
}

/**
 * Official CBT listening player:
 * - Exam Mode: one play only, no pause, no rewind, strict FEI standard.
 * - Practice Mode: speed selector (0.8x / 1.0x / 1.2x), replay option, transcript revelation.
 */
export function AudioPlayerCBT({
  src,
  fallbackText,
  played,
  disabled,
  onPlayed,
  mode = "exam",
  onReplay,
  transcript,
}: AudioPlayerCBTProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [showTranscript, setShowTranscript] = useState(false);

  const finish = useCallback(() => {
    setPlaying(false);
    setProgress(1);
    onPlayed();
  }, [onPlayed]);

  // Sync playback rate when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Stop speech if the question changes / component unmounts mid-play.
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    };
  }, []);

  const playSpeechFallback = useCallback(() => {
    if (fallbackText && "speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(fallbackText);
      u.lang = "fr-FR";
      u.rate = playbackRate;
      const est = Math.max(3, (fallbackText.length / 14) / playbackRate) * 1000;
      const t0 = Date.now();
      const iv = setInterval(() => setProgress(Math.min(0.97, (Date.now() - t0) / est)), 200);
      u.onend = () => {
        clearInterval(iv);
        finish();
      };
      u.onerror = () => {
        clearInterval(iv);
        finish();
      };
      window.speechSynthesis.speak(u);
    } else {
      finish();
    }
  }, [fallbackText, playbackRate, finish]);

  const start = () => {
    if ((played && mode === "exam") || playing || disabled) return;
    setPlaying(true);
    setProgress(0);

    if (src && audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.play().catch((err) => {
        console.warn("Audio playback error, falling back to speech synthesis:", err);
        playSpeechFallback();
      });
      return;
    }

    playSpeechFallback();
  };

  const handleReplay = () => {
    if (mode !== "practice") return;
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    if (onReplay) onReplay();
    setProgress(0);
    setTimeout(() => {
      start();
    }, 50);
  };

  return (
    <div className="mx-auto max-w-prose space-y-5 rounded-3xl border border-border/80 bg-card p-6 sm:p-7 text-center shadow-md">
      {/* Top Header: Badge & Speed selector */}
      <div className="flex items-center justify-between border-b pb-3">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
          <Headphones className="h-3.5 w-3.5" />
          <span>{mode === "practice" ? "Compréhension Orale (Entraînement)" : "Document Sonore FEI"}</span>
        </span>

        {/* Speed Selector (Available in Practice Mode and during playback) */}
        <div className="flex items-center gap-1 bg-muted/60 dark:bg-muted/30 p-0.5 rounded-full border border-border/50">
          <Gauge className="h-3 w-3 text-muted-foreground ml-1.5 mr-0.5 hidden sm:inline" />
          {[0.8, 1.0, 1.2].map((rate) => (
            <button
              key={rate}
              type="button"
              onClick={() => setPlaybackRate(rate)}
              disabled={playing && mode === "exam"}
              className={cn(
                "px-2.5 py-0.5 text-[10px] font-bold rounded-full transition-all whitespace-nowrap",
                playbackRate === rate
                  ? "bg-cyan-500 text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title={`Vitesse de lecture ${rate}x`}
            >
              {rate.toFixed(1)}x
            </button>
          ))}
        </div>
      </div>

      {/* Center Icon with Pulse */}
      <div
        className={cn(
          "mx-auto flex h-16 w-16 items-center justify-center rounded-2xl transition-all shadow-inner",
          playing
            ? "animate-pulse bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 ring-4 ring-cyan-500/20"
            : played && mode === "exam"
            ? "bg-muted text-muted-foreground"
            : "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
        )}
      >
        {played && mode === "exam" ? (
          <Lock className="h-7 w-7 text-muted-foreground" aria-hidden />
        ) : (
          <Headphones className="h-7 w-7" aria-hidden />
        )}
      </div>

      {/* Progress Bar */}
      <div
        role="progressbar"
        aria-label="Progression de l'écoute"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        className="h-2.5 overflow-hidden rounded-full bg-muted/80 shadow-inner"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-[width] duration-150"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Status & Action Buttons */}
      {played && mode === "exam" ? (
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground">
            Document écouté — une seule écoute est autorisée (Standard officiel FEI).
          </p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={start}
            disabled={playing || disabled}
            size="lg"
            className="w-full sm:w-auto font-bold bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm"
          >
            <Play className="mr-2 h-4 w-4" aria-hidden />
            {playing ? "Écoute en cours…" : "Lancer l'écoute"}
          </Button>

          {/* Replay button in practice mode */}
          {mode === "practice" && played && (
            <Button
              onClick={handleReplay}
              disabled={playing}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto font-semibold border-cyan-500/40 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Réécouter l&apos;audio
            </Button>
          )}

          {/* Toggle Transcript in practice mode */}
          {mode === "practice" && (transcript || fallbackText) && played && (
            <Button
              onClick={() => setShowTranscript(!showTranscript)}
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              <FileText className="mr-1.5 h-3.5 w-3.5" />
              {showTranscript ? "Masquer transcription" : "Voir transcription"}
            </Button>
          )}
        </div>
      )}

      {/* Transcript Drawer in Practice Mode */}
      {mode === "practice" && showTranscript && (transcript || fallbackText) && (
        <div className="mt-4 p-4 rounded-2xl bg-muted/50 border border-border text-left text-xs text-muted-foreground space-y-1 animate-in fade-in duration-200">
          <div className="font-bold text-foreground flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-cyan-500" />
            <span>Transcription du document sonore :</span>
          </div>
          <p className="leading-relaxed whitespace-pre-line italic text-foreground/90">
            « {transcript || fallbackText} »
          </p>
        </div>
      )}

      {src && (
        <audio
          ref={audioRef}
          src={src}
          preload="auto"
          onError={() => {
            console.warn("Audio element failed to load source, triggering speech fallback");
            playSpeechFallback();
          }}
          onTimeUpdate={(e) => {
            const a = e.currentTarget;
            if (a.duration) setProgress(a.currentTime / a.duration);
          }}
          onEnded={finish}
        />
      )}
    </div>
  );
}
