"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Monitor,
  Headphones,
  PenTool,
  Mic,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Wand2,
  RotateCcw,
  Flag,
  Highlighter,
  Keyboard,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ShowcaseTab = "ee" | "eo" | "ce" | "co";

const TABS = [
  {
    id: "ee" as const,
    num: "1",
    label: "Expression Écrite",
    badge: "Ouvert",
    isAvailable: true,
    icon: PenTool,
    color: "text-brand-crimson",
  },
  {
    id: "eo" as const,
    num: "2",
    label: "Expression Orale IA",
    badge: "Ouvert",
    isAvailable: true,
    icon: Mic,
    color: "text-emerald-500",
  },
  {
    id: "ce" as const,
    num: "3",
    label: "Compréhension Écrite",
    badge: "Bientôt",
    isAvailable: false,
    icon: Monitor,
    color: "text-amber-500",
  },
  {
    id: "co" as const,
    num: "4",
    label: "Compréhension Orale",
    badge: "Bientôt",
    isAvailable: false,
    icon: Headphones,
    color: "text-cyan-500",
  },
];

export function ProductShowcaseSection() {
  const [activeTab, setActiveTab] = useState<ShowcaseTab>("ee");
  const [lastPressedKey, setLastPressedKey] = useState<string | null>(null);

  // ==========================================
  // STATE: MODE 1 - CE (Compréhension Écrite)
  // ==========================================
  const [selectedCeAnswer, setSelectedCeAnswer] = useState<number | null>(1); // B
  const [activeQuestionNumber, setActiveQuestionNumber] = useState<number>(4);
  const [isHighlighted, setIsHighlighted] = useState<boolean>(true);
  const [ceFontSize, setCeFontSize] = useState<"sm" | "base" | "lg">("base");

  // ==========================================
  // STATE: MODE 2 - CO (Compréhension Orale)
  // NATIVE HTML5 AUDIO PLAYER WITH REAL MP3
  // ==========================================
  const coAudioRef = useRef<HTMLAudioElement | null>(null);
  const [selectedCoAnswer, setSelectedCoAnswer] = useState<number | null>(null);
  const [coPlaying, setCoPlaying] = useState<boolean>(false);
  const [coCurrentTime, setCoCurrentTime] = useState<number>(0);
  const [coDuration, setCoDuration] = useState<number>(10);
  const [coSpeed, setCoSpeed] = useState<number>(1.0);
  const [coPlayedOnce, setCoPlayedOnce] = useState<boolean>(false);

  // ==========================================
  // STATE: MODE 3 - EE (Expression Écrite)
  // ==========================================
  const [showMagicRewrite, setShowMagicRewrite] = useState<boolean>(true);

  // ==========================================
  // STATE: MODE 4 - EO (Expression Orale)
  // NATIVE HTML5 AUDIO WITH REAL ELEVENLABS MP3
  // ==========================================
  const laurentAudioRef = useRef<HTMLAudioElement | null>(null);
  const [eoSpeaking, setEoSpeaking] = useState<boolean>(false);
  const [laurentPlaying, setLaurentPlaying] = useState<boolean>(false);
  const [eoExchangeStep, setEoExchangeStep] = useState<number>(1);

  // Main countdown timer simulation
  const [secondsRemaining, setSecondsRemaining] = useState(3522); // ~58 min
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 3600));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const formatAudioTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Pause audios when switching tabs
  useEffect(() => {
    if (coAudioRef.current && !coAudioRef.current.paused) {
      coAudioRef.current.pause();
    }
    if (laurentAudioRef.current && !laurentAudioRef.current.paused) {
      laurentAudioRef.current.pause();
    }
  }, [activeTab]);

  // ==========================================
  // PHYSICAL KEYBOARD SHORTCUTS (A, B, C, D)
  // ==========================================
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;
      const key = e.key.toUpperCase();
      const map: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
      if (key in map) {
        setLastPressedKey(key);
        if (activeTab === "ce") {
          setSelectedCeAnswer(map[key]);
        } else if (activeTab === "co") {
          setSelectedCoAnswer(map[key]);
        }
        setTimeout(() => setLastPressedKey(null), 900);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab]);

  // ==========================================
  // AUDIO CONTROLS (NATIVE HTML5)
  // ==========================================
  const handleTogglePlayCo = () => {
    if (!coAudioRef.current) return;
    if (coPlaying) {
      coAudioRef.current.pause();
    } else {
      void coAudioRef.current.play().catch((err) => {
        console.warn("Autoplay restriction:", err);
      });
    }
  };

  const handleChangeCoSpeed = (speed: number) => {
    setCoSpeed(speed);
    if (coAudioRef.current) {
      coAudioRef.current.playbackRate = speed;
    }
  };

  const handleResetCoAudio = () => {
    if (coAudioRef.current) {
      coAudioRef.current.currentTime = 0;
      void coAudioRef.current.play().catch(() => {});
    }
  };

  const handleTogglePlayLaurent = () => {
    if (!laurentAudioRef.current) return;
    if (laurentPlaying) {
      laurentAudioRef.current.pause();
    } else {
      laurentAudioRef.current.currentTime = 0;
      void laurentAudioRef.current.play().catch((err) => {
        console.warn("Autoplay restriction:", err);
      });
    }
  };

  return (
    <section className="relative mx-auto max-w-6xl space-y-8 px-2 sm:px-4">
      {/* Hidden Native Audio Players */}
      <audio
        ref={coAudioRef}
        src="/audio/co/co-101-q2.mp3"
        preload="metadata"
        onPlay={() => setCoPlaying(true)}
        onPause={() => setCoPlaying(false)}
        onTimeUpdate={() => {
          if (coAudioRef.current) {
            setCoCurrentTime(coAudioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (coAudioRef.current) {
            setCoDuration(coAudioRef.current.duration || 10);
          }
        }}
        onEnded={() => {
          setCoPlaying(false);
          setCoPlayedOnce(true);
        }}
      />

      <audio
        ref={laurentAudioRef}
        src={eoExchangeStep === 1 ? "/audio/eo/laurent-step1.mp3" : "/audio/eo/laurent-step2.mp3"}
        preload="metadata"
        onPlay={() => setLaurentPlaying(true)}
        onPause={() => setLaurentPlaying(false)}
        onEnded={() => setLaurentPlaying(false)}
      />

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5 text-brand-crimson" />
          <span>Simulateur Interactif en Direct • 4 Épreuves CBT</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
          Touchez l&apos;interface d&apos;examen,{" "}
          <span className="bg-gradient-to-r from-brand-crimson to-rose-600 bg-clip-text text-transparent">
            avant le jour J
          </span>
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          Testez ci-dessous les 4 moteurs technologiques de Super4C2. Cliquez sur les épreuves, répondez aux questions avec votre clavier ou souris, et écoutez les vrais enregistrements studio.
        </p>
      </div>

      {/* 4 Tabs navigation with smooth Framer Motion layout pill */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-2 w-full max-w-4xl mx-auto p-1.5 rounded-2xl bg-muted/70 dark:bg-slate-900/80 border border-border/80 shadow-xs">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex items-center justify-center w-full min-w-0 px-2 sm:px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 overflow-hidden cursor-pointer",
                isActive
                  ? "text-foreground font-bold shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/40"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeProductShowcaseTab"
                  className="absolute inset-0 rounded-xl bg-background shadow-sm border border-border/80"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-1.5 w-full min-w-0">
                <Icon className={cn("h-4 w-4 shrink-0", isActive ? tab.color : "text-muted-foreground")} />
                <span className="truncate font-bold">
                  <span className="opacity-60 mr-1">{tab.num}.</span>
                  {tab.label}
                </span>
                <span
                  className={cn(
                    "text-[9px] font-extrabold uppercase tracking-wide px-1.5 py-0.5 rounded-full shrink-0 hidden xl:inline-block border",
                    tab.isAvailable
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                      : "bg-muted/80 text-muted-foreground border-border/60"
                  )}
                >
                  {tab.badge}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Interactive Simulator Shell (MacOS / Official CBT Workstation Style) */}
      <div className="rounded-3xl border border-slate-200 dark:border-border/80 bg-slate-50 dark:bg-card shadow-2xl overflow-hidden transition-all duration-300">
        {/* Title bar / Top Bar */}
        <div className="bg-slate-900 text-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 text-xs select-none">
          {/* Traffic dots & Engine version */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-rose-500 inline-block shadow-xs" />
              <span className="h-3 w-3 rounded-full bg-amber-500 inline-block shadow-xs" />
              <span className="h-3 w-3 rounded-full bg-emerald-500 inline-block shadow-xs" />
            </div>
            <span className="font-mono text-slate-400 pl-2 text-[11px] hidden sm:inline">
              Super4C2 CBT Engine v3.4 • France Éducation International
            </span>
          </div>

          {/* Keyboard shortcut detection badge & Timer */}
          <div className="flex items-center gap-2 sm:gap-3">
            {lastPressedKey && (
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-crimson/20 text-brand-crimson border border-brand-crimson/40 text-[10px] font-mono font-bold animate-pulse"
              >
                <Keyboard className="h-3 w-3" /> Touche [{lastPressedKey}] pressée !
              </motion.span>
            )}

            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Épreuve Conforme CBT
            </span>

            <div className="flex items-center gap-1.5 font-mono font-bold text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatTimer(secondsRemaining)}</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            MODE 1 : COMPRÉHENSION ÉCRITE (DOUBLE ÉCRAN CBT + SURLIGNEUR + ZOOM)
           ========================================================================= */}
        {activeTab === "ce" && (
          <div className="p-3 sm:p-5 space-y-4 bg-slate-100/90 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-[470px] transition-colors">
            {/* Header info & Tools */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-brand-crimson">TCF CANADA CBT</span>
                <span className="text-slate-300 dark:text-slate-500">•</span>
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  Question {activeQuestionNumber} / 39 (Niveau B2)
                </span>
                <span className="hidden md:inline-flex text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded font-mono">
                  ⌨️ Touches A, B, C, D actives
                </span>
              </div>

              {/* CE Tools: Highlighter toggle + Zoom + Flag */}
              <div className="flex items-center gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => setIsHighlighted(!isHighlighted)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-semibold ${
                    isHighlighted
                      ? "bg-amber-400/20 text-amber-800 dark:text-amber-300 border border-amber-400/40 shadow-xs"
                      : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 border border-slate-200 dark:border-slate-700"
                  }`}
                  title="Activer ou masquer le surlignage officiel de l'indice"
                >
                  <Highlighter className="h-3 w-3 text-amber-500" />
                  <span>{isHighlighted ? "Surligneur Actif" : "Surligner l'indice"}</span>
                </button>

                <div className="hidden sm:flex items-center bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-0.5 text-slate-600 dark:text-slate-400">
                  <button
                    type="button"
                    onClick={() => setCeFontSize("sm")}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      ceFontSize === "sm" ? "bg-slate-200 dark:bg-slate-700 text-foreground" : "hover:text-foreground"
                    }`}
                    title="Police réduite (A-)"
                  >
                    A-
                  </button>
                  <button
                    type="button"
                    onClick={() => setCeFontSize("base")}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      ceFontSize === "base" ? "bg-slate-200 dark:bg-slate-700 text-foreground" : "hover:text-foreground"
                    }`}
                    title="Police normale"
                  >
                    A
                  </button>
                  <button
                    type="button"
                    onClick={() => setCeFontSize("lg")}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      ceFontSize === "lg" ? "bg-slate-200 dark:bg-slate-700 text-foreground" : "hover:text-foreground"
                    }`}
                    title="Police agrandie (A+)"
                  >
                    A+
                  </button>
                </div>

                <button
                  type="button"
                  className="hover:text-amber-500 dark:hover:text-amber-400 flex items-center gap-1 transition-colors px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                  title="Marquer pour révision"
                >
                  <Flag className="h-3 w-3" />
                  <span className="hidden sm:inline">Marquer</span>
                </button>
              </div>
            </div>

            {/* Split Screen layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
              {/* Document source à gauche */}
              <div
                className={`rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4 sm:p-5 space-y-3 overflow-y-auto max-h-[300px] leading-relaxed text-slate-700 dark:text-slate-300 shadow-xs transition-all ${
                  isHighlighted ? "cursor-highlighter ring-2 ring-amber-400/40 border-amber-400/50" : ""
                } ${
                  ceFontSize === "sm"
                    ? "text-xs"
                    : ceFontSize === "base"
                    ? "text-xs sm:text-[13px]"
                    : "text-sm sm:text-[15px]"
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="font-bold uppercase tracking-wider text-[11px] text-slate-400 dark:text-slate-400">
                    Document Source
                  </span>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400 font-mono">
                    Article de Presse
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  Attractivité des provinces atlantiques canadiennes
                </h4>
                <p>
                  Depuis 2021, les provinces de l&apos;Atlantique (Nouveau-Brunswick, Nouvelle-Écosse) connaissent un afflux inédit de travailleurs qualifiés francophones. Face au coût de l&apos;immobilier dans les métropoles de Toronto et Vancouver, ces régions séduisent par leur qualité de vie et des voies d&apos;immigration facilitées.
                </p>
                <p className="border-l-2 border-brand-crimson pl-2.5 py-1 text-slate-800 dark:text-slate-200">
                  {isHighlighted ? (
                    <mark className="bg-amber-300/40 dark:bg-amber-400/30 text-amber-950 dark:text-amber-100 font-semibold px-1 rounded transition-all duration-300 ring-1 ring-amber-400/50">
                      « L&apos;accès simplifié à la résidence permanente pour les francophones compense largement l&apos;éloignement géographique des grands centres urbains »
                    </mark>
                  ) : (
                    <span>
                      « L&apos;accès simplifié à la résidence permanente pour les francophones compense largement l&apos;éloignement géographique des grands centres urbains »
                    </span>
                  )}
                  , souligne la sociologue québécoise Marcelle Dupont.
                </p>
                <p>
                  Toutefois, le principal défi demeure l&apos;intégration professionnelle rapide dans des secteurs spécialisés comme les technologies et la santé.
                </p>
              </div>

              {/* Questions et choix QCM à droite */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4 sm:p-5 space-y-4 flex flex-col justify-between shadow-xs">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-brand-crimson uppercase tracking-wide">
                      Question à Choix Unique
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">1 point</span>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Selon le document, quel facteur principal motive les candidats francophones à s&apos;installer en région atlantique ?
                  </p>

                  {/* Options A, B, C, D */}
                  <div className="space-y-2 pt-1">
                    {[
                      { id: 0, letter: "A", text: "Le climat tempéré des zones côtières." },
                      {
                        id: 1,
                        letter: "B",
                        text: "Les facilités d'obtention de la résidence permanente.",
                        isCorrect: true,
                      },
                      { id: 2, letter: "C", text: "La gratuité des logements urbains." },
                      { id: 3, letter: "D", text: "L'obligation formulée par les employeurs." },
                    ].map((opt) => {
                      const isSelected = selectedCeAnswer === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setSelectedCeAnswer(opt.id)}
                          className={`w-full text-left p-2.5 rounded-lg border text-xs font-medium transition-all flex items-center justify-between ${
                            isSelected
                              ? "border-brand-crimson bg-brand-crimson/10 dark:bg-brand-crimson/20 text-brand-crimson dark:text-white shadow-xs ring-1 ring-brand-crimson"
                              : "border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/70 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`h-5 w-5 rounded-full text-[11px] font-bold flex items-center justify-center font-mono ${
                                isSelected ? "bg-brand-crimson text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                              }`}
                            >
                              {opt.letter}
                            </span>
                            <span>{opt.text}</span>
                          </div>
                          {isSelected && <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Explication pédagogique instantanée */}
                {selectedCeAnswer !== null && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                    <span>
                      {selectedCeAnswer === 1
                        ? "Excellent ! Réponse exacte : Le passage « l'accès simplifié à la résidence permanente » valide le choix B."
                        : "Attention aux distracteurs : relisez le 2ème paragraphe sur les démarches d'immigration facilitées."}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation 39 questions grid (Real CBT standard) */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                <span>Grille Officielle des 39 Questions (Cliquer pour naviguer) :</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">1 répondu • 38 en attente</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {Array.from({ length: 39 }).map((_, idx) => {
                  const num = idx + 1;
                  const isActive = activeQuestionNumber === num;
                  const isAnswered = num === 4;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setActiveQuestionNumber(num)}
                      className={`h-6 w-6 rounded text-[10px] font-mono font-bold transition-all ${
                        isActive
                          ? "bg-brand-crimson text-white ring-1 ring-white"
                          : isAnswered
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODE 2 : COMPRÉHENSION ORALE (LECTEUR AUDIO FEI • VRAI MP3 STUDIO)
           ========================================================================= */}
        {activeTab === "co" && (
          <div className="p-3 sm:p-5 space-y-4 bg-slate-100/90 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-[470px] transition-colors">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-cyan-600 dark:text-cyan-400">TCF CANADA CBT • AUDIO</span>
                <span className="text-slate-300 dark:text-slate-500">•</span>
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  Document Sonore 2 / 39 (Niveau A1 / A2)
                </span>
                <span className="hidden md:inline-flex text-[10px] bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 px-2 py-0.5 rounded font-mono border border-cyan-500/20">
                  🔒 Écoute Unique Stricte
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <span>Vitesse audio :</span>
                {([0.8, 1.0, 1.2] as const).map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => handleChangeCoSpeed(spd)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono transition-all ${
                      coSpeed === spd
                        ? "bg-cyan-600 text-white shadow-xs"
                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            {/* Split Screen layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
              {/* Lecteur officiel FEI à gauche */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4 sm:p-5 space-y-4 flex flex-col justify-between shadow-xs">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="font-bold uppercase tracking-wider text-[11px] text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                      <Radio className={`h-3.5 w-3.5 text-cyan-500 ${coPlaying ? "animate-pulse" : ""}`} />
                      Document Audio Officiel FEI
                    </span>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400 font-mono">
                      Annonce en Gare SNCF
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    Retard imprévu d&apos;une liaison ferroviaire
                  </h4>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Vous allez entendre une annonce officielle diffusée dans un haut-parleur. Écoutez attentivement avant de répondre à la question.
                  </p>

                  {/* Lecteur Audio Physique FEI */}
                  <div className="rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-50/70 to-slate-50/50 dark:from-cyan-950/20 dark:to-slate-900/60 p-3.5 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={handleTogglePlayCo}
                          className="h-10 w-10 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center shadow-md shadow-cyan-600/30 transition-all hover:scale-105 active:scale-95 shrink-0"
                          title={coPlaying ? "Mettre en pause" : "Lancer l'écoute audio"}
                        >
                          {coPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                        </button>
                        <div>
                          <p className="font-bold text-xs text-slate-900 dark:text-slate-100">
                            {coPlaying
                              ? "Diffusion audio en cours..."
                              : coPlayedOnce
                              ? "Document écouté (1 écoute terminée)"
                              : "Cliquer pour écouter l'audio"}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                            Enregistrement studio MP3 officiel FEI
                          </p>
                        </div>
                      </div>

                      <div className="font-mono text-xs font-bold text-cyan-700 dark:text-cyan-400">
                        {formatAudioTime(coCurrentTime)} / {formatAudioTime(coDuration)}
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-1">
                      <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-100"
                          style={{
                            width: `${coDuration > 0 ? (coCurrentTime / coDuration) * 100 : 0}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span>Écoute unique FEI</span>
                        {coPlayedOnce && (
                          <button
                            type="button"
                            onClick={handleResetCoAudio}
                            className="text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                          >
                            <RotateCcw className="h-2.5 w-2.5" /> Réécouter (Mode Démo)
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Waveform dynamic equalizer bars */}
                    <div className="flex items-center justify-center gap-1 h-7 pt-1">
                      {Array.from({ length: 28 }).map((_, i) => (
                        <motion.span
                          key={i}
                          animate={
                            coPlaying
                              ? {
                                  scaleY: [0.25, Math.sin(i * 0.7 + coCurrentTime * 4) * 0.5 + 0.75, 0.25],
                                }
                              : { scaleY: 0.25 }
                          }
                          transition={{
                            duration: 0.5 + (i % 4) * 0.1,
                            repeat: coPlaying ? Infinity : 0,
                            ease: "easeInOut",
                          }}
                          className={`w-1 rounded-full origin-bottom transition-colors ${
                            coPlaying
                              ? "bg-cyan-500 dark:bg-cyan-400 shadow-xs shadow-cyan-400/50"
                              : "bg-slate-300 dark:bg-slate-700"
                          }`}
                          style={{ height: "24px" }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-800 dark:text-cyan-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                    Fichier MP3 natif : zéro lag, zéro voix robotique
                  </span>
                  <span className="font-mono font-bold text-[10px]">CO 2/39</span>
                </div>
              </div>

              {/* Questions et choix QCM à droite */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4 sm:p-5 space-y-4 flex flex-col justify-between shadow-xs">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wide">
                      Question à Choix Unique (CO)
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">1 point</span>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Quelle information est donnée dans cette annonce ?
                  </p>

                  {/* Options A, B, C, D */}
                  <div className="space-y-2 pt-1">
                    {[
                      { id: 0, letter: "A", text: "Le train pour Lyon est supprimé." },
                      { id: 1, letter: "B", text: "Le train pour Lyon part en avance." },
                      {
                        id: 2,
                        letter: "C",
                        text: "Le train pour Lyon est en retard.",
                        isCorrect: true,
                      },
                      { id: 3, letter: "D", text: "Le quai du train pour Lyon a changé." },
                    ].map((opt) => {
                      const isSelected = selectedCoAnswer === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setSelectedCoAnswer(opt.id)}
                          className={`w-full text-left p-2.5 rounded-lg border text-xs font-medium transition-all flex items-center justify-between ${
                            isSelected
                              ? "border-cyan-500 bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-800 dark:text-white shadow-xs ring-1 ring-cyan-500"
                              : "border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/70 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`h-5 w-5 rounded-full text-[11px] font-bold flex items-center justify-center font-mono ${
                                isSelected ? "bg-cyan-600 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                              }`}
                            >
                              {opt.letter}
                            </span>
                            <span>{opt.text}</span>
                          </div>
                          {isSelected && <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Explication pédagogique instantanée */}
                {selectedCoAnswer !== null && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                    <span>
                      {selectedCoAnswer === 2
                        ? "Bravo ! Réponse validée : L'annonce sonore indique clairement « le train à destination de Lyon aura quarante minutes de retard » (retardé, pas supprimé)."
                        : "Attention aux pièges : réécoutez l'extrait, le train n'est pas supprimé mais subit un retard de 40 min."}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation 39 questions grid */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
                <span>Grille Officielle des 39 Questions Audio (Cliquer pour naviguer) :</span>
                <span className="font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
                  {selectedCoAnswer !== null ? "1 répondu" : "0 répondu"} • 38 en attente
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {Array.from({ length: 39 }).map((_, idx) => {
                  const num = idx + 1;
                  const isActive = num === 2;
                  const isAnswered = num === 2 && selectedCoAnswer !== null;
                  return (
                    <button
                      key={num}
                      type="button"
                      className={`h-6 w-6 rounded text-[10px] font-mono font-bold transition-all ${
                        isActive
                          ? "bg-cyan-600 text-white ring-1 ring-white"
                          : isAnswered
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODE 3 : EXPRESSION ÉCRITE (MAGIC REWRITE C1/C2 & CRITÈRES FEI)
           ========================================================================= */}
        {activeTab === "ee" && (
          <div className="p-4 sm:p-6 space-y-4 bg-slate-100/90 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-[470px] transition-colors">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-crimson">
                  Tâche 3 FEI • Prise de position argumentée (120-180 mots)
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-200">
                  Sujet : Faut-il interdire la publicité ciblant les enfants sur les plateformes vidéo ?
                </h4>
              </div>

              {/* Magic Rewrite toggle switch */}
              <button
                type="button"
                onClick={() => setShowMagicRewrite(!showMagicRewrite)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  showMagicRewrite
                    ? "bg-gradient-to-r from-brand-crimson to-rose-500 text-white shadow-md shadow-brand-crimson/20"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                }`}
              >
                <Wand2 className="h-3.5 w-3.5" />
                <span>{showMagicRewrite ? "Afficher Brouillon Candidat (B1)" : "Activer Magic Rewrite C1/C2 ✨"}</span>
              </button>
            </div>

            {/* Split before / after showcase */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Draft ou réécriture */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between text-xs border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="font-bold text-slate-600 dark:text-slate-400">
                    {showMagicRewrite ? "Version Optimisée C1/C2 (Magic Rewrite)" : "Copie Brute du Candidat (Niveau B1)"}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">142 mots</span>
                </div>

                {showMagicRewrite ? (
                  <p className="text-xs sm:text-[13px] leading-relaxed text-slate-900 dark:text-slate-100 space-y-2">
                    <span className="bg-brand-crimson/15 dark:bg-brand-crimson/20 text-brand-crimson font-semibold px-1 rounded">En premier lieu</span>
                    , il convient de souligner que la vulnérabilité psychologique des jeunes publics commande une régulation intransigeante des algorithmes publicitaires.{" "}
                    <span className="bg-brand-crimson/15 dark:bg-brand-crimson/20 text-brand-crimson font-semibold px-1 rounded">Loin de constituer</span>{" "}
                    une simple incitation commerciale, ces spots formatent les comportements de consommation dès le plus jeune âge.{" "}
                    <span className="bg-brand-crimson/15 dark:bg-brand-crimson/20 text-brand-crimson font-semibold px-1 rounded">Par conséquent</span>
                    , la responsabilité des régulateurs canadiens est expressément engagée.
                  </p>
                ) : (
                  <p className="text-xs sm:text-[13px] leading-relaxed text-slate-600 dark:text-slate-300">
                    Moi je pense que la publicité pour les enfants est très mauvaise. Les enfants ne comprennent pas ce que c&apos;est et ils demandent toujours à leurs parents d&apos;acheter des jouets. Il faut donc interdire les pubs sur Internet parce que c&apos;est dangereux pour eux.
                  </p>
                )}
              </div>

              {/* Barème FEI et retour analytique instantané */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4 space-y-3 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between text-xs border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                      Évaluation Grille FEI (0 Seconde)
                    </span>
                    <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {showMagicRewrite ? "Score Estimé : NCLC 9 (C1)" : "Score Estimé : NCLC 5 (B1)"}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Adéquation à la consigne :</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">5 / 5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Cohérence &amp; Connecteurs :</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{showMagicRewrite ? "5 / 5" : "3 / 5"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Richesse Lexicale :</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{showMagicRewrite ? "5 / 5 (C1)" : "2.5 / 5"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Morphosyntaxe &amp; Accords :</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{showMagicRewrite ? "5 / 5" : "3 / 5"}</span>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-rose-50/80 dark:bg-primary/10 border border-rose-200/60 dark:border-primary/20 text-[11px] text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-primary">Verdict du moteur Super4C2 : </span>
                  {showMagicRewrite
                    ? "Structure argumentative impeccable avec connecteurs logiques de niveau supérieur (NCLC 9 garanti)."
                    : "Texte compréhensible mais vocabulaire pauvre (répétitions de « enfants » et « parce que »). Cliquez sur Magic Rewrite pour voir la version C1/C2 !"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODE 4 : EXPRESSION ORALE EN DIRECT (STUDIO VIDÉO 16:9 + VOIX ELEVENLABS)
           ========================================================================= */}
        {activeTab === "eo" && (
          <div className="p-4 sm:p-6 space-y-4 bg-slate-100/90 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-[470px] transition-colors">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              {/* Pod Visio Examinateur Laurent (16:9) */}
              <div className="md:col-span-6 relative aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-md">
                <Image
                  src="/brand/examiner-laurent.jpg"
                  alt="M. Laurent - Examinateur Officiel Super4C2"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 500px"
                />

                {/* Live indicators */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-background/85 dark:bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold border border-white/20">
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-rose-500">🔴 EN DIRECT</span>
                  <span className="text-slate-700 dark:text-slate-400">• Tâche 2</span>
                </div>

                <div className="absolute bottom-3 inset-x-3 flex items-center justify-between bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs">
                  <span className="font-semibold text-slate-200">M. Laurent (Examinateur FEI)</span>
                  {/* Waveform animation */}
                  <div className="flex items-center gap-0.5">
                    <span className={`h-2 w-0.5 bg-cyan-400 ${laurentPlaying ? "animate-pulse" : ""}`} />
                    <span className={`h-4 w-0.5 bg-cyan-400 ${laurentPlaying ? "animate-bounce" : ""}`} />
                    <span className={`h-3 w-0.5 bg-cyan-400 ${laurentPlaying ? "animate-pulse" : ""}`} />
                    <span className={`h-5 w-0.5 bg-cyan-400 ${laurentPlaying ? "animate-bounce" : ""}`} />
                    <span className={`h-2 w-0.5 bg-cyan-400 ${laurentPlaying ? "animate-pulse" : ""}`} />
                  </div>
                </div>
              </div>

              {/* Panneau de dialogue interactif */}
              <div className="md:col-span-6 space-y-3">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    Consigne Officielle Tâche 2 (Jeu de rôle • 5 min)
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Vous souhaitez inscrire votre enfant à une école de hockey sur glace à Montréal. Vous interrogez le directeur (M. Laurent) pour obtenir des précisions sur les horaires, les tarifs et l&apos;équipement.
                  </p>
                </div>

                {/* Réplique de M. Laurent avec bouton d'écoute audio direct */}
                <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/40 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-cyan-700 dark:text-cyan-400 flex items-center gap-1">
                      <Volume2 className="h-3.5 w-3.5" /> M. Laurent vous répond :
                    </span>
                    <button
                      type="button"
                      onClick={handleTogglePlayLaurent}
                      className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-cyan-600 dark:text-cyan-400 bg-white dark:bg-cyan-900/50 hover:bg-cyan-100 px-2 py-0.5 rounded border border-cyan-300 dark:border-cyan-700 transition-all shadow-xs active:scale-95"
                    >
                      {laurentPlaying ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                      <span>{laurentPlaying ? "Arrêter la voix" : "🔊 Écouter la voix Studio"}</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 italic">
                    {eoExchangeStep === 1
                      ? "« Bonjour ! Absolument, les cours débutent à 8h le samedi. Cependant, nous exigeons un certificat médical complet avant toute inscription. Est-ce que votre fils a déjà patiné auparavant ? »"
                      : "« Très bien, c'est un point positif. Concernant l'équipement de protection, préférez-vous louer notre pack ou acheter votre propre matériel agréé ? »"}
                  </p>
                </div>

                {/* Actions candidat interactives */}
                <div className="space-y-2 pt-1">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Votre tour de parole :</p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        setEoSpeaking(true);
                        setTimeout(() => {
                          setEoSpeaking(false);
                          setEoExchangeStep((s) => (s === 1 ? 2 : 1));
                        }, 1200);
                      }}
                      className="bg-brand-crimson hover:bg-brand-crimson/90 text-white text-xs font-bold gap-1.5"
                    >
                      <Mic className="h-3.5 w-3.5" />
                      <span>{eoSpeaking ? "Enregistrement en cours..." : "Simuler ma réponse vocale"}</span>
                    </Button>

                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEoExchangeStep((s) => (s === 1 ? 2 : 1));
                        if (laurentAudioRef.current) {
                          laurentAudioRef.current.pause();
                        }
                        setLaurentPlaying(false);
                      }}
                      className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs gap-1"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Relancer l&apos;examinateur</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer banner with CTA */}
        <div className="bg-slate-900 border-t border-slate-800 p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Plus de 1 200 questions officielles FEI disponibles en continu avec correction instantanée.</span>
          </div>

          <Button
            asChild
            size="sm"
            className="w-full sm:w-auto bg-brand-crimson hover:bg-brand-crimson/90 text-white font-bold px-4 py-2 text-xs rounded-full shadow-md gap-1.5"
          >
            <Link href="/examens?test=tcf">
              <span>Lancer un test complet gratuit</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
