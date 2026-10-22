"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  BookOpen,
  Headphones,
  Sparkles,
  PenTool,
  Mic,
  Brain,
  Calculator,
  Users,
  Newspaper,
  PhoneCall,
  Zap,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function SiteNav() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click or route change
  useEffect(() => {
    setOpenMenu(null);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isHomeActive = pathname === "/";
  const isExpressionsActive =
    pathname.startsWith("/examens") &&
    !pathname.includes("discipline=ce") &&
    !pathname.includes("discipline=co");
  const isComprehensionsActive =
    pathname.includes("discipline=ce") || pathname.includes("discipline=co");
  const isToolsActive =
    pathname.startsWith("/nclc-calculator") ||
    pathname.startsWith("/carnet-erreurs") ||
    pathname.startsWith("/sujets-recents");
  const isResourcesActive =
    pathname.startsWith("/blog") ||
    pathname.startsWith("/communaute") ||
    pathname.startsWith("/contact");

  return (
    <nav
      ref={navRef}
      className="hidden lg:flex items-center gap-1 rounded-full border border-border/70 bg-muted/40 dark:bg-white/[0.04] p-1.5 shadow-inner backdrop-blur-md relative"
    >
      {/* 1. Accueil */}
      <Link
        href="/"
        className={cn(
          "rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
          isHomeActive
            ? "text-foreground bg-background shadow-xs font-bold"
            : "text-muted-foreground hover:text-foreground hover:bg-background/60"
        )}
      >
        Accueil
      </Link>

      {/* 2. BLOC 1 PRIORITAIRE : Expressions (Écrite & Orale) */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenMenu(openMenu === "expressions" ? null : "expressions")}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all inline-flex items-center gap-1.5",
            isExpressionsActive || openMenu === "expressions"
              ? "text-foreground bg-background shadow-xs font-bold"
              : "text-muted-foreground hover:text-foreground hover:bg-background/60"
          )}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-crimson opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-crimson"></span>
          </span>
          <span>Expressions (EE & EO)</span>
          <ChevronDown
            className={cn(
              "h-3 w-3 transition-transform duration-200",
              openMenu === "expressions" && "rotate-180 text-primary"
            )}
          />
        </button>

        <AnimatePresence>
          {openMenu === "expressions" && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="absolute left-0 top-full mt-2 w-[520px] rounded-2xl border border-border/80 bg-background/95 p-3.5 shadow-2xl backdrop-blur-xl z-50 space-y-3"
            >
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Cœur de préparation • Clé des +50 Pts CRS
                </span>
                <span className="rounded-full bg-brand-crimson/10 border border-brand-crimson/30 px-2 py-0.5 text-[9px] font-black text-brand-crimson uppercase tracking-wider">
                  Priorité Candidats
                </span>
              </div>

              {/* Carreaux des 2 Expressions */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* Carreau 1 : Expression Écrite (EE) - Bête noire */}
                <Link
                  href="/examens?discipline=ee"
                  className="flex flex-col justify-between rounded-xl border border-border/70 bg-card/60 hover:bg-card hover:border-brand-crimson/40 p-3 transition-all group shadow-2xs hover:shadow-md"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-crimson/10 p-1 group-hover:scale-105 transition-transform">
                        <Image
                          src="/brand/icons-3d/expression-ecrite-pen.png"
                          alt="Expression Écrite"
                          width={32}
                          height={32}
                          className="h-7 w-7 object-contain drop-shadow-sm"
                        />
                      </div>
                      <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 text-[9px] font-bold text-amber-600 dark:text-amber-400">
                        Bête Noire #1
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground group-hover:text-brand-crimson transition-colors">
                        Expression Écrite (EE)
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                        Les 3 tâches d&apos;examen, chrono 60 min, notation par critères et Magic Rewrite C1/C2.
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-[11px] font-bold text-brand-crimson">
                    <span>Examens Écrits (60 min)</span>
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>

                {/* Carreau 2 : Expression Orale (EO) - Visio IA */}
                <Link
                  href="/examens?discipline=eo"
                  className="flex flex-col justify-between rounded-xl border border-border/70 bg-card/60 hover:bg-card hover:border-emerald-500/40 p-3 transition-all group shadow-2xs hover:shadow-md"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 p-1 group-hover:scale-105 transition-transform">
                        <Image
                          src="/brand/icons-3d/expression-orale-microphone.png"
                          alt="Expression Orale"
                          width={32}
                          height={32}
                          className="h-7 w-7 object-contain drop-shadow-sm"
                        />
                      </div>
                      <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                        Visio IA Directe
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        Expression Orale (EO)
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                        Simulateur visio avec l&apos;examinateur IA M. Laurent. Pratiquez vos 3 tâches orales en direct.
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    <span>Examens Oraux (Visio IA)</span>
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </div>

              {/* Bandeau d'accès à toutes les Sessions */}
              <div className="pt-2 border-t border-border/60">
                <Link
                  href="/examens"
                  className="flex items-center justify-between rounded-xl px-3 py-2 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent hover:from-primary/15 hover:via-primary/10 border border-primary/20 text-xs font-bold text-primary transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>Voir tous les Examens d&apos;Entraînement</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. BLOC 2 : Compréhensions (CO & CE) — Information & Droits d'Auteur */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenMenu(openMenu === "comprehensions" ? null : "comprehensions")}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all inline-flex items-center gap-1.5",
            isComprehensionsActive || openMenu === "comprehensions"
              ? "text-foreground bg-background shadow-xs font-bold"
              : "text-muted-foreground hover:text-foreground hover:bg-background/60"
          )}
        >
          <span>Compréhensions (CO & CE)</span>
          <ChevronDown
            className={cn(
              "h-3 w-3 transition-transform duration-200",
              openMenu === "comprehensions" && "rotate-180 text-primary"
            )}
          />
        </button>

        <AnimatePresence>
          {openMenu === "comprehensions" && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="absolute left-0 top-full mt-2 w-[460px] rounded-2xl border border-border/80 bg-background/95 p-4 shadow-2xl backdrop-blur-xl z-50 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Compréhension Orale &amp; Écrite (QCM)
                </span>
                <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-[9px] font-bold text-cyan-600 dark:text-cyan-400">
                  Démarche Transparente
                </span>
              </div>

              {/* Note explicative sur les droits d'auteur & gratuité des QCM */}
              <div className="rounded-xl border border-border/70 bg-muted/40 p-3 space-y-1.5 text-xs">
                <div className="font-semibold text-foreground flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-primary" />
                  <span>Pourquoi privilégier les Expressions ?</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Les QCM de compréhension (CO et CE) sont déjà accessibles gratuitement sur de nombreuses plateformes publiques (ex. TV5Monde, RFI).
                  Par respect strict des droits d&apos;auteur et pour maximiser votre investissement temps, Super4C2 focalise sa technologie IA sur les épreuves de production (Écrite et Orale), là où se joue l&apos;obtention des paliers NCLC 7 à 10.
                </p>
              </div>

              {/* Statut des modules QCM Super4C2 */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl border border-border/60 bg-card/40 p-2.5 space-y-1 opacity-80">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px] text-foreground">Compréhension Orale (CO)</span>
                    <span className="rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 px-1 text-[9px] font-bold">
                      Bientôt
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Lecteur audio studio en cours de calibrage.
                  </p>
                </div>

                <div className="rounded-xl border border-border/60 bg-card/40 p-2.5 space-y-1 opacity-80">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px] text-foreground">Compréhension Écrite (CE)</span>
                    <span className="rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 px-1 text-[9px] font-bold">
                      Bientôt
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Calibrage pédagogique 39Q en cours de finalisation.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                <Link
                  href="/blog"
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <span>Lire nos guides stratégiques pour les QCM</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. BLOC 3 : Outils CRS Canada */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenMenu(openMenu === "outils" ? null : "outils")}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-semibold transition-all inline-flex items-center gap-1.5",
            isToolsActive || openMenu === "outils"
              ? "text-foreground bg-background shadow-xs font-bold"
              : "text-muted-foreground hover:text-foreground hover:bg-background/60"
          )}
        >
          <span>Outils &amp; CRS</span>
          <ChevronDown
            className={cn(
              "h-3 w-3 transition-transform duration-200",
              openMenu === "outils" && "rotate-180 text-primary"
            )}
          />
        </button>

        <AnimatePresence>
          {openMenu === "outils" && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="absolute left-0 top-full mt-2 w-72 rounded-2xl border border-border/80 bg-background/95 p-3 shadow-2xl backdrop-blur-xl z-50 space-y-1"
            >
              <Link
                href="/nclc-calculator"
                className="flex items-start gap-2.5 rounded-xl p-2.5 hover:bg-muted/70 transition-colors group"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 p-1 group-hover:scale-105 transition-transform">
                  <Image
                    src="/brand/icons-3d/crs-calculator-compass.png"
                    alt="CRS"
                    width={32}
                    height={32}
                    className="h-6 w-6 object-contain drop-shadow-sm"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span>Calculateur NCLC &amp; CRS</span>
                    <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">
                      +50 pts
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    Simulez votre bonus de points Entrée Express Canada
                  </p>
                </div>
              </Link>

              <Link
                href="/carnet-erreurs"
                className="flex items-start gap-2.5 rounded-xl p-2.5 hover:bg-muted/70 transition-colors group"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 p-1 group-hover:scale-105 transition-transform">
                  <Image
                    src="/brand/icons-3d/srs-memory-vault.png"
                    alt="SRS"
                    width={32}
                    height={32}
                    className="h-6 w-6 object-contain drop-shadow-sm"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">
                    Carnet d&apos;Erreurs SRS
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    Répétition espacée pour éliminer définitivement vos pièges
                  </p>
                </div>
              </Link>

              <Link
                href="/sujets-recents"
                className="flex items-start gap-2.5 rounded-xl p-2.5 hover:bg-muted/70 transition-colors group"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 p-1 group-hover:scale-105 transition-transform">
                  <Image
                    src="/brand/icons-3d/radar-recent-topics.png"
                    alt="Sujets Récents"
                    width={32}
                    height={32}
                    className="h-6 w-6 object-contain drop-shadow-sm"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span>Radar Sujets Récents</span>
                    <span className="rounded bg-blue-500/10 px-1 py-0.2 text-[9px] font-bold text-blue-600 dark:text-blue-400">
                      Veille
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    Retours des candidats sur les sujets tombés
                  </p>
                </div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 5. BLOC 4 : Ressources */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenMenu(openMenu === "ressources" ? null : "ressources")}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-semibold transition-all inline-flex items-center gap-1.5",
            isResourcesActive || openMenu === "ressources"
              ? "text-foreground bg-background shadow-xs font-bold"
              : "text-muted-foreground hover:text-foreground hover:bg-background/60"
          )}
        >
          <span>Ressources</span>
          <ChevronDown
            className={cn(
              "h-3 w-3 transition-transform duration-200",
              openMenu === "ressources" && "rotate-180 text-primary"
            )}
          />
        </button>

        <AnimatePresence>
          {openMenu === "ressources" && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="absolute left-0 top-full mt-2 w-72 rounded-2xl border border-border/80 bg-background/95 p-3 shadow-2xl backdrop-blur-xl z-50 space-y-1"
            >
              <Link
                href="/blog"
                className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-muted/70 transition-colors group"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 p-1 group-hover:scale-105 transition-transform">
                  <Image
                    src="/brand/icons-3d/radar-recent-topics.png"
                    alt="Blog"
                    width={32}
                    height={32}
                    className="h-7 w-7 object-contain drop-shadow-sm"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">
                    Blog &amp; Stratégies
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Méthodologie C1/C2, barèmes &amp; retours d&apos;expérience
                  </p>
                </div>
              </Link>

              <Link
                href="/communaute"
                className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-muted/70 transition-colors group"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 p-1 group-hover:scale-105 transition-transform">
                  <Image
                    src="/brand/icons-3d/vip-community-shield.png"
                    alt="Communauté VIP"
                    width={32}
                    height={32}
                    className="h-7 w-7 object-contain drop-shadow-sm"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">
                    Communauté VIP
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Canal Telegram alertes sujets récents &amp; entraide
                  </p>
                </div>
              </Link>

              <Link
                href="/contact"
                className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-muted/70 transition-colors group"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <PhoneCall className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">
                    Conciergerie &amp; Contact
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Support prioritaire &amp; assistance candidats 7j/7
                  </p>
                </div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
