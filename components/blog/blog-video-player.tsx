"use client";

import React from "react";
import { Video, Sparkles } from "lucide-react";

interface BlogVideoPlayerProps {
  urlOrId: string;
  title?: string;
}

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  if (match) return match[1];
  // If the string itself is 11 chars (like an ID)
  if (/^[\w-]{11}$/.test(url.trim())) return url.trim();
  return null;
}

export function BlogVideoPlayer({ urlOrId, title = "Vidéo explicative TCF Canada" }: BlogVideoPlayerProps) {
  const ytId = extractYouTubeId(urlOrId);

  if (!ytId) return null;

  return (
    <div className="my-8 space-y-2">
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-border/80 bg-black shadow-xl ring-1 ring-border/20">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span className="flex items-center gap-1.5 font-medium">
          <Video className="h-3.5 w-3.5 text-rose-500" />
          <span>Vidéo Explicative &amp; Débriefing Officiel</span>
        </span>
        <span className="text-[11px] font-mono text-muted-foreground/80">
          Super4C2 Studio
        </span>
      </div>
    </div>
  );
}
