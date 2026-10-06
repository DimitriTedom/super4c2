"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Headphones, Lock, Play } from "lucide-react";
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
}

/**
 * Official CBT listening player: one play only, no pause, no rewind, no seek.
 * The progress bar is display-only.
 */
export function AudioPlayerCBT({
  src,
  fallbackText,
  played,
  disabled,
  onPlayed,
}: AudioPlayerCBTProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const finish = useCallback(() => {
    setPlaying(false);
    setProgress(1);
    onPlayed();
  }, [onPlayed]);

  // Stop speech if the question changes / component unmounts mid-play.
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    };
  }, []);

  const start = () => {
    if (played || playing || disabled) return;
    setPlaying(true);
    setProgress(0);
    if (src && audioRef.current) {
      void audioRef.current.play();
      return;
    }
    if (fallbackText && "speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(fallbackText);
      u.lang = "fr-FR";
      const est = Math.max(3, fallbackText.length / 14) * 1000;
      const t0 = Date.now();
      const iv = setInterval(() => setProgress(Math.min(0.97, (Date.now() - t0) / est)), 200);
      u.onend = () => {
        clearInterval(iv);
        finish();
      };
      u.onerror = u.onend;
      window.speechSynthesis.speak(u);
    } else {
      finish();
    }
  };

  return (
    <div className="mx-auto max-w-prose space-y-5 rounded-2xl border bg-card p-6 text-center shadow-sm">
      <div
        className={cn(
          "mx-auto flex h-16 w-16 items-center justify-center rounded-full",
          playing ? "animate-pulse bg-cyan-500/15 text-cyan-600" : "bg-muted text-muted-foreground",
        )}
      >
        {played ? <Lock className="h-7 w-7" aria-hidden /> : <Headphones className="h-7 w-7" aria-hidden />}
      </div>

      <div
        role="progressbar"
        aria-label="Progression de l'écoute"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        className="h-2 overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full bg-cyan-500 transition-[width] duration-200"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {played ? (
        <p className="text-sm font-medium text-muted-foreground">
          Document écouté — une seule écoute est autorisée.
        </p>
      ) : (
        <Button onClick={start} disabled={playing || disabled} size="lg">
          <Play className="mr-2 h-4 w-4" aria-hidden />
          {playing ? "Écoute en cours…" : "Lancer l'écoute (une seule fois)"}
        </Button>
      )}

      {src && (
        <audio
          ref={audioRef}
          src={src}
          preload="auto"
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
