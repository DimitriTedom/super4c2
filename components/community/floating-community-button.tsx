"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, HelpCircle, Sparkles, MessageSquare } from "lucide-react";
import { openNewcomerGuide } from "@/components/onboarding/newcomer-guide-modal";

export function FloatingCommunityButton() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  // Masquer dans la salle d'examen, sur les écrans d'authentification et dans le back-office admin
  const isSuppressed =
    /^\/examens\/[^/]+\/(ce|co|ee|eo|examen-blanc)\/?$/.test(pathname || "") ||
    pathname?.startsWith("/auth") ||
    pathname?.startsWith("/admin");
  if (isSuppressed) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5 print:hidden">
      {/* Bouton Guide Découverte Rapide */}
      <button
        type="button"
        onClick={() => openNewcomerGuide()}
        className="group flex items-center gap-2 rounded-full border border-border/80 bg-background/90 dark:bg-slate-900/90 px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-md backdrop-blur-md transition-all hover:scale-105 hover:border-primary/50 hover:bg-background"
        title="Ouvrir le guide interactif Super4C2"
      >
        <HelpCircle className="h-3.5 w-3.5 text-primary group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline">Guide Plateforme</span>
      </button>

      {/* Bouton Principal Communauté VIP */}
      <Link
        href="/communaute"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center gap-2.5 rounded-full border-2 border-primary/30 bg-gradient-to-r from-primary via-rose-600 to-primary p-2 sm:px-4 sm:py-2.5 text-white shadow-xl shadow-primary/25 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/40 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        title="Rejoindre la Communauté VIP Super4C2"
        aria-label="Communauté VIP Super4C2"
      >
        {/* Halo Glow pulsant */}
        <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-primary to-rose-500 opacity-40 blur-sm group-hover:opacity-75 transition-opacity duration-300" />

        <div className="relative flex items-center gap-2.5 z-10">
          <div className="relative h-7 w-7 sm:h-8 sm:w-8 shrink-0 drop-shadow-sm transition-transform duration-300 group-hover:rotate-6">
            <Image
              src="/brand/icons-3d/vip-community-shield.png"
              alt="Bouclier Communauté VIP"
              fill
              className="object-contain"
            />
          </div>

          <div className="hidden sm:flex flex-col items-start leading-tight">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/80 flex items-center gap-1">
              <Sparkles className="h-2.5 w-2.5 text-amber-300" />
              <span>Espace Entraide</span>
            </span>
            <span className="text-xs font-black tracking-tight text-white">
              Communauté VIP
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
