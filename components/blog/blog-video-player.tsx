"use client";

import React, { useState } from "react";
import { Play, Video, Clock, CheckCircle2 } from "lucide-react";

interface VideoChapter {
  timeSeconds: number;
  timeLabel: string;
  title: string;
}

interface BlogVideoPlayerProps {
  urlOrId: string;
  title?: string;
  chapters?: VideoChapter[];
}

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  if (match) return match[1];
  if (/^[\w-]{11}$/.test(url.trim())) return url.trim();
  return null;
}

export function BlogVideoPlayer({
  urlOrId,
  title = "Vidéo Explicative & Débriefing Officiel",
  chapters = [],
}: BlogVideoPlayerProps) {
  const ytId = extractYouTubeId(urlOrId);
  const [isPlaying, setIsPlaying] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  if (!ytId) return null;

  const thumbnailUrl = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;

  const handleStartChapter = (seconds: number) => {
    setStartTime(seconds);
    setIsPlaying(true);
  };

  const iframeSrc = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1${
    startTime !== null ? `&start=${startTime}` : ""
  }`;

  return (
    <div className="my-8 space-y-3">
      {/* 16:9 Container with Facade Optimization */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-border/80 bg-black shadow-xl ring-1 ring-border/20 group">
        {isPlaying ? (
          <iframe
            src={iframeSrc}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsPlaying(true)}
            className="relative h-full w-full text-left cursor-pointer group focus:outline-none"
            aria-label="Lancer la vidéo explicative"
          >
            {/* High-res Thumbnail */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbnailUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
            />

            {/* Dark overlay with soft gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30 transition-opacity group-hover:opacity-75" />

            {/* Centered Glowing Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative flex items-center justify-center">
                {/* Ripple glow effect */}
                <div className="absolute h-20 w-20 rounded-full bg-rose-600/30 animate-ping pointer-events-none" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-brand-crimson to-rose-600 text-white shadow-2xl transition-transform duration-300 group-hover:scale-110">
                  <Play className="h-7 w-7 fill-current ml-1" />
                </div>
              </div>
            </div>

            {/* Video Title Header overlay */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-[11px] font-bold text-white border border-white/10">
                <Video className="h-3.5 w-3.5 text-rose-500" />
                <span>Vidéo de Débriefing FEI</span>
              </span>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 text-white/80">
                HD 1080p
              </span>
            </div>

            {/* Bottom Callout overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white font-display font-bold text-sm sm:text-base line-clamp-1 drop-shadow-md">
                {title}
              </p>
              <p className="text-white/70 text-xs mt-0.5">
                Cliquez pour lancer la lecture in-page
              </p>
            </div>
          </button>
        )}
      </div>

      {/* Chapters list if provided */}
      {chapters.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-3 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground font-semibold text-[11px] uppercase tracking-wider">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span>Chapitrage de la Session :</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {chapters.map((ch, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleStartChapter(ch.timeSeconds)}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/40 hover:bg-muted text-foreground transition-colors text-left"
              >
                <span className="truncate pr-2 font-medium">{ch.title}</span>
                <span className="font-mono text-[11px] text-primary font-bold shrink-0">
                  {ch.timeLabel}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Meta Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span className="flex items-center gap-1.5 font-medium">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          <span>Contenu didactique synchronisé avec la transcription écrite</span>
        </span>
        <span className="text-[11px] font-mono text-muted-foreground/80">
          Super4C2 Studio
        </span>
      </div>
    </div>
  );
}
