"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface OralWaveformProps {
  isRecording: boolean;
  isExaminerSpeaking: boolean;
  isLiveCallActive?: boolean;
  className?: string;
}

const BAR_COUNT = 24;

export function OralWaveform({
  isRecording,
  isExaminerSpeaking,
  isLiveCallActive = false,
  className,
}: OralWaveformProps) {
  const [bars, setBars] = useState<number[]>(Array(BAR_COUNT).fill(12));

  // Détermination de l'état audio actif
  const state: "speaking" | "listening" | "idle" = isExaminerSpeaking
    ? "speaking"
    : isRecording || (isLiveCallActive && !isExaminerSpeaking)
    ? "listening"
    : "idle";

  useEffect(() => {
    const interval = setInterval(() => {
      setBars((prev) =>
        prev.map((_, i) => {
          let min = 8;
          let max = 18;

          if (state === "speaking") {
            // Profil vocal énergique de l'examinateur (pic au centre)
            const centerDistance = Math.abs(i - BAR_COUNT / 2) / (BAR_COUNT / 2);
            const factor = 1 - centerDistance * 0.4;
            min = 25 * factor;
            max = 95 * factor;
          } else if (state === "listening") {
            // Profil d'écoute du candidat (vague dynamique)
            min = 18;
            max = 70;
          } else {
            // Respiration subtile en mode attente
            min = 6;
            max = 20;
          }

          return Math.random() * (max - min) + min;
        })
      );
    }, 120);

    return () => clearInterval(interval);
  }, [state]);

  return (
    <div className={cn("w-full max-w-[320px] mx-auto space-y-2", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center gap-1.5 h-16 w-full rounded-2xl p-3 transition-all duration-500 overflow-hidden border backdrop-blur-md",
          state === "speaking"
            ? "bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
            : state === "listening"
            ? "bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
            : "bg-muted/40 border-border/50"
        )}
      >
        {/* Glow backdrop dynamique */}
        <div
          className={cn(
            "absolute inset-0 opacity-20 blur-xl transition-all duration-700 pointer-events-none",
            state === "speaking"
              ? "bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500"
              : state === "listening"
              ? "bg-gradient-to-r from-emerald-500 via-teal-400 to-green-500"
              : "bg-transparent"
          )}
        />

        {/* 24 Barres de Fréquence Spectrum */}
        {bars.map((height, i) => {
          return (
            <div
              key={i}
              className={cn(
                "flex-1 min-w-[3px] max-w-[7px] rounded-full transition-all duration-150",
                state === "speaking"
                  ? "bg-gradient-to-t from-cyan-600 via-cyan-400 to-sky-300 shadow-[0_0_8px_rgba(6,182,212,0.5)]"
                  : state === "listening"
                  ? "bg-gradient-to-t from-emerald-600 via-emerald-400 to-teal-300 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                  : "bg-muted-foreground/30"
              )}
              style={{
                height: `${Math.max(8, height)}%`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
