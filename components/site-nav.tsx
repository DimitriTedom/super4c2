"use client";

import { useState, useRef, useEffect } from "react";
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
  const isExamActive = pathname.startsWith("/examens");
  const isToolsActive =
    pathname.startsWith("/nclc-calculator") ||
    pathname.startsWith("/carnet-erreurs") ||
    pathname.startsWith("/test-gratuit");
  const isResourcesActive =
    pathname.startsWith("/blog") ||
    pathname.startsWith("/communaute") ||
    pathname.startsWith("/contact");
  const isPricingActive = pathname === "/tarifs";

  return (
    <nav
      ref={navRef}
      className="hidden lg:flex items-center gap-1 rounded-full border border-border/70 bg-muted/40 dark:bg-white/[0.04] p-1.5 shadow-inner backdrop-blur-md relative"
    >
      {/* 1. Accueil */}
      <Link
        href="/"
        className={cn(
          "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all",
          isHomeActive
            ? "text-foreground bg-background shadow-xs font-bold"
            : "text-muted-foreground hover:text-foreground hover:bg-background/60"
        )}
      >
        Accueil
      </Link>

      {/* 2. Groupe : Examens & Séries */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenMenu(openMenu === "examens" ? null : "examens")}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all inline-flex items-center gap-1.5",
            isExamActive
              ? "text-foreground bg-background shadow-xs font-bold"
              : "text-muted-foreground hover:text-foreground hover:bg-background/60"
          )}
        >
          <span>Séries & Examens</span>
          <ChevronDown
            className={cn(
              "h-3 w-3 transition-transform duration-200",
              openMenu === "examens" && "rotate-180 text-primary"
            )}
          />
        </button>

        <AnimatePresence>
          {openMenu === "examens" && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="absolute left-0 top-full mt-2 w-80 rounded-2xl border border-border/80 bg-background/95 p-3 shadow-2xl backdrop-blur-xl z-50 space-y-1"
            >
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Séries Officielles Par Examen
              </div>

              <Link
                href="/examens?test=tcf"
                className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-muted/70 transition-colors group"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <span className="text-xs font-bold">TCF</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span>TCF Canada</span>
                    <span className="rounded bg-primary/10 px-1 py-0.2 text-[9px] font-bold text-primary">
                      Fédéral
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Séries 101 à 105 • Paliers NCLC 5 à 10+ (+50 pts CRS)
                  </p>
                </div>
              </Link>

              <Link
                href="/examens?test=tef"
                className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-muted/70 transition-colors group"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                  <span className="text-xs font-bold">TEF</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span>TEF Canada (CCI)</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Séries 201 à 203 • Format officiel Chambre de Commerce Paris
                  </p>
                </div>
              </Link>

              <Link
                href="/examens?test=ielts"
                className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-muted/70 transition-colors group"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  <span className="text-xs font-bold">IEL</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">
                    IELTS General Training
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    British Council / IDP • Objectif CLB 9 (8777)
                  </p>
                </div>
              </Link>

              <div className="border-t border-border/60 my-1 pt-1">
                <Link
                  href="/examens"
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-primary hover:bg-primary/10 transition-colors"
                >
                  <span>Voir le catalogue complet des séries</span>
                  <Zap className="h-3 w-3" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Groupe : Simulateurs & IA */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenMenu(openMenu === "simulateurs" ? null : "simulateurs")}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all inline-flex items-center gap-1.5",
            isToolsActive
              ? "text-foreground bg-background shadow-xs font-bold"
              : "text-muted-foreground hover:text-foreground hover:bg-background/60"
          )}
        >
          <span>Simulateurs & IA</span>
          <ChevronDown
            className={cn(
              "h-3 w-3 transition-transform duration-200",
              openMenu === "simulateurs" && "rotate-180 text-primary"
            )}
          />
        </button>

        <AnimatePresence>
          {openMenu === "simulateurs" && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="absolute left-0 top-full mt-2 w-84 rounded-2xl border border-border/80 bg-background/95 p-3 shadow-2xl backdrop-blur-xl z-50 space-y-1"
            >
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Simulateurs Par Discipline CBT
              </div>

              <Link
                href="/examens/demo-101-ce/intro"
                className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-muted/70 transition-colors group"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span>Compréhension Écrite (CE)</span>
                    <span className="rounded bg-rose-500/10 px-1 py-0.2 text-[9px] font-bold text-rose-500">
                      39Q
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Écran scindé officiel FEI, zoom de police & pièges décodés
                  </p>
                </div>
              </Link>

              <Link
                href="/examens/demo-101-ce/co"
                className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-muted/70 transition-colors group"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <Headphones className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span>Compréhension Orale (CO)</span>
                    <span className="rounded bg-blue-500/10 px-1 py-0.2 text-[9px] font-bold text-blue-500">
                      39Q
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Lecteur CBT officiel sans retour arrière & 6 paliers CECRL
                  </p>
                </div>
              </Link>

              <Link
                href="/examens/demo-101-ce/eo/intro"
                className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-muted/70 transition-colors group"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-500 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                  <Mic className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span>Expression Orale IA</span>
                    <span className="rounded bg-cyan-500/15 px-1 py-0.2 text-[9px] font-bold text-cyan-600 dark:text-cyan-400">
                      Live
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Examinateur IA vocal en jeu de rôle & débriefing immédiat
                  </p>
                </div>
              </Link>

              <Link
                href="/examens/demo-101-ee/intro"
                className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-muted/70 transition-colors group"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  <PenTool className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span>Expression Écrite FEI</span>
                    <Sparkles className="h-3 w-3 text-brand-crimson" />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    3 tâches, notation officielle & Magic Rewrite C1/C2 en 10s
                  </p>
                </div>
              </Link>

              <Link
                href="/carnet-erreurs"
                className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-muted/70 transition-colors group"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                  <Brain className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">
                    Carnet d&apos;Erreurs SRS
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Répétition espacée scientifique pour ancrer vos pièges
                  </p>
                </div>
              </Link>

              <Link
                href="/nclc-calculator"
                className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-muted/70 transition-colors group"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <Calculator className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span>Calculateur NCLC & CRS</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      +50 pts
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Simulez votre bonus Entrée Express Canada
                  </p>
                </div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Groupe : Ressources */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenMenu(openMenu === "ressources" ? null : "ressources")}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all inline-flex items-center gap-1.5",
            isResourcesActive
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
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Newspaper className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">
                    Blog & Stratégies
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Guides d&apos;examen, pièges FEI & retours d&apos;expérience
                  </p>
                </div>
              </Link>

              <Link
                href="/communaute"
                className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-muted/70 transition-colors group"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-500 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">
                    Communauté VIP
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Canal Telegram alertes sujets récents & entraide
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
                    Conciergerie & Contact
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Support prioritaire & assistance candidats 7j/7
                  </p>
                </div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 5. Tarifs */}
      <Link
        href="/tarifs"
        className={cn(
          "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all",
          isPricingActive
            ? "text-foreground bg-background shadow-xs font-bold"
            : "text-muted-foreground hover:text-foreground hover:bg-background/60"
        )}
      >
        Tarifs
      </Link>
    </nav>
  );
}
