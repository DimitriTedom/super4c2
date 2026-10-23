"use client";

import { useState, useEffect, useMemo, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Unlock,
  Sparkles,
  Trophy,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  ArrowRight,
  Clock,
  Flame,
  ShieldCheck,
  Layers,
  LayoutGrid,
  Route,
  Zap,
  CheckCircle2,
  Play,
  Check,
  Award,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  TEST_CATALOG,
  getSeriesForTest,
  type TestType,
  type DisciplineType,
  type ProgressionSeries,
} from "@/lib/exam/series-progression";

interface ExamRoadmapBoardProps {
  initialTest?: TestType;
  initialDiscipline?: DisciplineType;
  initialView?: "roadmap" | "grid";
}

const STORAGE_UNLOCKED_KEY = "super4c2:unlocked_series";
const STORAGE_COMPLETED_KEY = "super4c2:completed_series";

interface CompletedDetail {
  nclcLevel?: number;
  totalScore?: number;
  tcfScaledScore?: number;
}

export interface RoadmapGateInfo {
  minScoreRequired: number;
  minCumulativeXpRequired: number;
  isGate: boolean;
  gateLabel?: string;
  isPrevScoreSufficient: boolean;
  isXpSufficient: boolean;
  prevScore: number;
  phaseName: string;
}

export function ExamRoadmapBoard({
  initialTest = "tcf",
  initialDiscipline = "all",
  initialView = "roadmap",
}: ExamRoadmapBoardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentTestParam = (searchParams.get("test") as TestType) || initialTest;
  const validTest: TestType = ["tcf", "tef", "ielts"].includes(currentTestParam)
    ? currentTestParam
    : "tcf";

  const rawDiscipline = (searchParams.get("discipline") as DisciplineType) || initialDiscipline;
  const validDiscipline: DisciplineType = ["ce", "co"].includes(rawDiscipline)
    ? "ee"
    : ["all", "ee", "eo"].includes(rawDiscipline)
    ? rawDiscipline
    : "all";

  const rawView = (searchParams.get("view") as "roadmap" | "grid") || initialView;
  const validView: "roadmap" | "grid" = ["roadmap", "grid"].includes(rawView) ? rawView : "roadmap";

  const [activeTest, setActiveTest] = useState<TestType>(validTest);
  const [activeDiscipline, setActiveDiscipline] = useState<DisciplineType>(validDiscipline);
  const [viewMode, setViewMode] = useState<"roadmap" | "grid">(validView);
  const [ieltsTrack, setIeltsTrack] = useState<"general" | "academic">("general");

  // Déblocages manuels ou VIP enregistrés
  const [unlockedSeriesIds, setUnlockedSeriesIds] = useState<string[]>([]);
  // Examens réellement complétés
  const [completedSeriesIds, setCompletedSeriesIds] = useState<string[]>([]);
  // Détails de score pour les examens complétés
  const [completedDetails, setCompletedDetails] = useState<Record<string, CompletedDetail>>({});

  useEffect(() => {
    try {
      const completedList: string[] = [];
      const detailsMap: Record<string, CompletedDetail> = {};

      const storedCompleted = localStorage.getItem(STORAGE_COMPLETED_KEY);
      if (storedCompleted) {
        const parsed = JSON.parse(storedCompleted);
        if (Array.isArray(parsed)) completedList.push(...parsed);
      }

      // Scanner le localStorage pour détecter automatiquement les examens déjà finis
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("super4c2:written:")) {
          try {
            const raw = localStorage.getItem(key);
            if (raw) {
              const val = JSON.parse(raw);
              if (val.isFinished && val.result) {
                const parts = key.split(":");
                const seriesId = parts[2];
                if (seriesId) {
                  completedList.push(seriesId);
                  detailsMap[seriesId] = {
                    nclcLevel: val.result.nclcLevel,
                    totalScore: val.result.totalScore,
                    tcfScaledScore: val.result.tcfScaledScore,
                  };
                }
              }
            }
          } catch {}
        }
      }

      setCompletedSeriesIds(Array.from(new Set(completedList)));
      setCompletedDetails(detailsMap);

      const stored = localStorage.getItem(STORAGE_UNLOCKED_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setUnlockedSeriesIds(Array.from(new Set(parsed)));
        }
      }

      // Récupération asynchrone des tentatives validées côté serveur
      fetch("/api/exam/attempt")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.attempts && Array.isArray(data.attempts)) {
            const serverCompleted: string[] = [];
            const serverDetails: Record<string, CompletedDetail> = {};
            data.attempts.forEach((att: any) => {
              if (att.seriesId) {
                serverCompleted.push(att.seriesId);
                serverDetails[att.seriesId] = {
                  nclcLevel: att.nclcLevel,
                  totalScore: att.rawScore,
                  tcfScaledScore: att.tcfScaledScore,
                };
              }
            });
            if (serverCompleted.length > 0) {
              setCompletedSeriesIds((prev) => Array.from(new Set([...prev, ...serverCompleted])));
              setCompletedDetails((prev) => ({ ...prev, ...serverDetails }));
            }
          }
        })
        .catch(() => {});
    } catch {
      // Ignorer
    }
  }, []);

  const handleUnlockSeries = (seriesId: string) => {
    const updated = Array.from(new Set([...unlockedSeriesIds, seriesId]));
    setUnlockedSeriesIds(updated);
    try {
      localStorage.setItem(STORAGE_UNLOCKED_KEY, JSON.stringify(updated));
    } catch {
      // Ignorer
    }
  };

  const rawSeriesList = getSeriesForTest(activeTest);
  const filteredRaw =
    activeTest === "ielts"
      ? rawSeriesList.filter((s) => !s.ieltsTrack || s.ieltsTrack === ieltsTrack)
      : rawSeriesList;

  // ⚡ 1. CALCUL DYNAMIQUE DU TOTAL XP CUMULÉ DU CANDIDAT (PROGRESSION PÉDAGOGIQUE)
  const totalUserXp = useMemo(() => {
    let xp = 0;
    completedSeriesIds.forEach((sid) => {
      const s = filteredRaw.find((item) => item.id === sid);
      const reward = s?.xpReward || 350;
      xp += reward;
      const det = completedDetails[sid];
      if (det?.nclcLevel && det.nclcLevel >= 7) {
        xp += 200; // Bonus de validation Seuil NCLC 7
      }
      if (det?.nclcLevel && det.nclcLevel >= 9) {
        xp += 300; // Bonus d'excellence C1/C2
      }
    });
    return xp;
  }, [completedSeriesIds, completedDetails, filteredRaw]);

  // 🛡️ 2. CALCUL DU RANG & NIVEAU DE MAÎTRISE DU CANDIDAT
  const userRank = useMemo(() => {
    if (totalUserXp >= 2500) {
      return {
        title: "Maître C1/C2 Élite",
        badge: "🥇 Niveau Élite",
        color: "from-amber-500 via-rose-500 to-amber-400 text-amber-900 dark:text-amber-200 border-amber-500/40 bg-amber-500/10",
        nextThreshold: 5000,
        prevThreshold: 2500,
        levelNum: 3,
        icon: "💎",
      };
    }
    if (totalUserXp >= 1000) {
      return {
        title: "Candidat NCLC 7+ Confirmé",
        badge: "🥈 Niveau Avancé",
        color: "from-emerald-500 to-cyan-500 text-emerald-800 dark:text-emerald-300 border-emerald-500/40 bg-emerald-500/10",
        nextThreshold: 2500,
        prevThreshold: 1000,
        levelNum: 2,
        icon: "🥈",
      };
    }
    return {
      title: "Initié B1/B2",
      badge: "🥉 Niveau Intermédiaire",
      color: "from-slate-400 to-primary text-primary border-primary/30 bg-primary/5",
      nextThreshold: 1000,
      prevThreshold: 0,
      levelNum: 1,
      icon: "🥉",
    };
  }, [totalUserXp]);

  const xpIntoCurrentRank = Math.max(0, totalUserXp - userRank.prevThreshold);
  const rankSpan = Math.max(1, userRank.nextThreshold - userRank.prevThreshold);
  const rankProgressPercent = Math.min(100, Math.round((xpIntoCurrentRank / rankSpan) * 100));
  const xpRemainingToNextRank = Math.max(0, userRank.nextThreshold - totalUserXp);

  // 🔒 3. RÈGLE DYNAMIQUE DE DÉBLOCAGE PÉDAGOGIQUE :
  // - Examen 01 : Toujours UNLOCKED (ou COMPLETED)
  // - Examen 02-03 : Requiert Examen N-1 (Score min. 8/20) OU Total XP suffisant
  // - Examen 04 (Palier Certificatif NCLC 7+) : Requiert Examen 03 (Score min. 10/20) ET 1 000 XP cumulés
  // - Examen 07 (Grand Palier C1/C2) : Requiert NCLC 7+ validé ET 2 500 XP cumulés
  const seriesList = filteredRaw.map((s, idx) => {
    const isCompleted = completedSeriesIds.includes(s.id);
    const prevSeriesId = idx > 0 ? filteredRaw[idx - 1].id : null;
    const prevDetail = prevSeriesId ? completedDetails[prevSeriesId] : null;
    const isPrevCompleted = prevSeriesId ? completedSeriesIds.includes(prevSeriesId) : false;

    // Définition des conditions de progression par palier
    let minScoreRequired = 8;
    let minCumulativeXpRequired = 0;
    let phaseName = "Phase 1 : Diagnostic & Fondations B1/B2";
    let isGate = false;
    let gateLabel = "";

    if (idx === 0) {
      minScoreRequired = 0;
      minCumulativeXpRequired = 0;
    } else if (idx === 1) {
      minScoreRequired = 8;
      minCumulativeXpRequired = 300;
    } else if (idx === 2) {
      minScoreRequired = 8;
      minCumulativeXpRequired = 650;
    } else if (idx === 3) {
      // 🏛️ PALIER CERTIFICATIF NCLC 7+
      minScoreRequired = 10;
      minCumulativeXpRequired = 1000;
      isGate = true;
      gateLabel = "🏛️ PALIER CERTIFICATIF : Seuil NCLC 7+ (+50 pts CRS)";
      phaseName = "Phase 2 : Passage au Seuil NCLC 7+";
    } else if (idx === 4) {
      minScoreRequired = 10;
      minCumulativeXpRequired = 1400;
      phaseName = "Phase 2 : Passage au Seuil NCLC 7+";
    } else if (idx === 5) {
      minScoreRequired = 10;
      minCumulativeXpRequired = 1800;
      phaseName = "Phase 2 : Passage au Seuil NCLC 7+";
    } else if (idx >= 6) {
      // 🏆 GRAND PALIER C1/C2
      minScoreRequired = 12;
      minCumulativeXpRequired = 2500;
      isGate = idx === 6;
      gateLabel = "🏆 GRAND PALIER : Maîtrise C1/C2 Élite";
      phaseName = "Phase 3 : Maîtrise C1/C2 Élite";
    }

    // Score obtenu sur l'épreuve précédente
    const prevScore = prevDetail?.totalScore ?? (isPrevCompleted ? 10 : 0);
    const isPrevScoreSufficient = idx === 0 || (isPrevCompleted && prevScore >= minScoreRequired);
    const isXpSufficient = totalUserXp >= minCumulativeXpRequired;
    const isExplicitlyUnlocked = unlockedSeriesIds.includes(s.id);

    let status: "COMPLETED" | "UNLOCKED" | "LOCKED" = "LOCKED";
    if (isCompleted) {
      status = "COMPLETED";
    } else if (idx === 0) {
      status = "UNLOCKED";
    } else if (isExplicitlyUnlocked) {
      status = "UNLOCKED";
    } else if (isPrevScoreSufficient && isXpSufficient) {
      status = "UNLOCKED";
    } else {
      status = "LOCKED";
    }

    const gateInfo: RoadmapGateInfo = {
      minScoreRequired,
      minCumulativeXpRequired,
      isGate,
      gateLabel,
      isPrevScoreSufficient,
      isXpSufficient,
      prevScore,
      phaseName,
    };

    return {
      ...s,
      status,
      gateInfo,
    };
  });

  const [lockedModalData, setLockedModalData] = useState<{
    targetSeries: (typeof seriesList)[0];
    targetIndex: number;
    prevSeries?: (typeof seriesList)[0];
    gateInfo: RoadmapGateInfo;
  } | null>(null);

  const handleAttemptAccessLocked = (seriesItem: (typeof seriesList)[0], index: number) => {
    const prevSeries = index > 0 ? seriesList[index - 1] : undefined;
    setLockedModalData({
      targetSeries: seriesItem,
      targetIndex: index,
      prevSeries,
      gateInfo: seriesItem.gateInfo,
    });
  };

  const handleTestChange = (test: TestType) => {
    setActiveTest(test);
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("test", test);
      router.push(`/examens?${params.toString()}`, { scroll: false });
    });
  };

  const handleDisciplineChange = (disc: DisciplineType) => {
    setActiveDiscipline(disc);
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (disc === "all") {
        params.delete("discipline");
      } else {
        params.set("discipline", disc);
      }
      router.push(`/examens?${params.toString()}`, { scroll: false });
    });
  };

  const handleViewChange = (newView: "roadmap" | "grid") => {
    setViewMode(newView);
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("view", newView);
      router.push(`/examens?${params.toString()}`, { scroll: false });
    });
  };

  const testMeta = TEST_CATALOG[activeTest];

  // Calcul de la progression globale
  const totalCount = seriesList.length;
  const completedCount = seriesList.filter((s) => s.status === "COMPLETED").length;
  const unlockedCount = seriesList.filter((s) => s.status !== "LOCKED").length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* 🧭 En-tête Compact & Sélecteurs Rapides de Test, Discipline & Vue */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/70">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Examens {testMeta.name}
              {activeDiscipline === "ee" && " — Expression Écrite"}
              {activeDiscipline === "eo" && " — Expression Orale"}
            </h1>
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-bold">
              Objectif NCLC 7+ • +50 pts CRS
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {activeDiscipline === "ee"
              ? "Préparez vos 3 tâches d'Expression Écrite (60 min) avec évaluation IA officielle FEI."
              : activeDiscipline === "eo"
              ? "Simulateur visio IA en direct : pratiquez vos 3 tâches d'Expression Orale."
              : "Choisissez un examen pour lancer l'Expression Écrite (60 min) ou l'Expression Orale (Visio IA)."}
          </p>
        </div>

        {/* Sélecteurs Rapides */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
          {/* 1. Sélecteur de Test */}
          <div className="inline-flex items-center p-1 rounded-xl bg-muted/60 border border-border/80 shadow-2xs">
            {(["tcf", "tef", "ielts"] as TestType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleTestChange(t)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                  activeTest === t
                    ? "bg-background text-foreground shadow-xs font-black"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          {/* 2. Filtre d'Épreuve Rapide */}
          <div className="inline-flex items-center p-1 rounded-xl bg-muted/60 border border-border/80 shadow-2xs">
            <button
              type="button"
              onClick={() => handleDisciplineChange("all")}
              className={cn(
                "px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all",
                activeDiscipline === "all"
                  ? "bg-background text-foreground shadow-xs font-black"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Toutes
            </button>
            <button
              type="button"
              onClick={() => handleDisciplineChange("ee")}
              className={cn(
                "px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1",
                activeDiscipline === "ee"
                  ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 shadow-xs font-black"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <PenTool className="h-3 w-3" />
              <span>Écrit</span>
            </button>
            <button
              type="button"
              onClick={() => handleDisciplineChange("eo")}
              className={cn(
                "px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1",
                activeDiscipline === "eo"
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shadow-xs font-black"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Mic className="h-3 w-3" />
              <span>Oral</span>
            </button>
          </div>

          {/* 3. Sélecteur de Vue : Parcours / Grille */}
          <div className="inline-flex items-center p-1 rounded-xl bg-muted/60 border border-border/80 shadow-2xs">
            <button
              type="button"
              onClick={() => handleViewChange("roadmap")}
              className={cn(
                "px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                viewMode === "roadmap"
                  ? "bg-background text-foreground shadow-xs font-black"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Affichage en Parcours Progression"
            >
              <Route className="h-3 w-3 text-primary" />
              <span className="hidden sm:inline">Parcours</span>
            </button>
            <button
              type="button"
              onClick={() => handleViewChange("grid")}
              className={cn(
                "px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                viewMode === "grid"
                  ? "bg-background text-foreground shadow-xs font-black"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Affichage en Grille CBT"
            >
              <LayoutGrid className="h-3 w-3" />
              <span className="hidden sm:inline">Grille</span>
            </button>
          </div>
        </div>
      </div>

      {/* 📊 COCKPIT DE PROGRESSION & POINTS D'EXPÉRIENCE (XP) */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-card via-card to-primary/5 p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Rang & Titre */}
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border shadow-inner text-2xl font-black bg-gradient-to-br",
                userRank.color
              )}
            >
              {userRank.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Badge className={cn("font-bold text-[10px] px-2 py-0.5", userRank.color)}>
                  {userRank.badge}
                </Badge>
                <span className="font-mono text-xs text-muted-foreground font-semibold">
                  Palier {userRank.levelNum}
                </span>
              </div>
              <h2 className="font-display text-lg sm:text-xl font-black tracking-tight text-foreground">
                {userRank.title}
              </h2>
            </div>
          </div>

          {/* XP Total & Objectif Palier */}
          <div className="flex items-center gap-4 self-start sm:self-auto sm:text-right">
            <div className="space-y-0.5">
              <div className="flex items-center sm:justify-end gap-1.5 text-xs text-muted-foreground font-semibold">
                <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                <span>Points XP Cumulés</span>
              </div>
              <div className="font-mono text-xl sm:text-2xl font-black text-foreground">
                {totalUserXp.toLocaleString("fr-FR")}{" "}
                <span className="text-xs font-bold text-muted-foreground font-sans">
                  / {userRank.nextThreshold.toLocaleString("fr-FR")} XP
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Jauge d'XP animée vers le prochain palier */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground font-semibold">
            <span>
              {xpRemainingToNextRank > 0
                ? `Plus que ${xpRemainingToNextRank} XP pour atteindre le palier supérieur`
                : "Palier maximal C1/C2 atteint !"}
            </span>
            <span className="font-mono font-bold text-foreground">
              {rankProgressPercent}%
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-muted/80 overflow-hidden border border-border/60">
            <div
              className="h-full bg-gradient-to-r from-primary via-indigo-500 to-emerald-500 transition-all duration-700 ease-out rounded-full"
              style={{ width: `${Math.max(rankProgressPercent, 3)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 🇬🇧 IELTS Dual Track Switcher (si applicable) */}
      {activeTest === "ielts" && (
        <div className="p-3 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 dark:bg-indigo-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            Filière IELTS :
          </span>
          <div className="inline-flex items-center p-0.5 rounded-lg bg-background border border-border/80 shrink-0">
            <button
              type="button"
              onClick={() => setIeltsTrack("general")}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-bold transition-all",
                ieltsTrack === "general"
                  ? "bg-primary text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              🇨🇦 Section Générale (Express Entry)
            </button>
            <button
              type="button"
              onClick={() => setIeltsTrack("academic")}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-bold transition-all",
                ieltsTrack === "academic"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              🎓 Section Académique
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. VUE PARCOURS PÉDAGOGIQUE (ROADMAP STEPPER)           */}
      {/* ======================================================== */}
      {viewMode === "roadmap" && (
        <div className="relative border-l-2 border-primary/20 ml-4 sm:ml-8 pl-5 sm:pl-8 space-y-8 py-2">
          {seriesList.map((series, idx) => {
            const isCompleted = series.status === "COMPLETED";
            const isUnlocked = series.status !== "LOCKED";
            const sessionNum = String(idx + 1).padStart(2, "0");
            const details = completedDetails[series.id];
            const gate = series.gateInfo;

            const eeUrl =
              series.disciplines.find((d) => d.type === "ee")?.url || `/examens/${series.id}/ee/intro`;
            const eoUrl =
              series.disciplines.find((d) => d.type === "eo")?.url || `/examens/${series.id}/eo/intro`;

            // Paliers pédagogiques
            const isPhaseStart = idx === 0 || idx === 3 || idx === 6;

            return (
              <div key={series.id} className="relative group">
                {/* Séparateur de Phase / Palier Pédagogique */}
                {isPhaseStart && (
                  <div className="mb-4 -ml-7 sm:-ml-10 flex items-center gap-2">
                    <span
                      className={cn(
                        "flex h-6 px-3 items-center rounded-full border font-bold text-[10px] uppercase tracking-wider",
                        idx === 3
                          ? "bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300"
                          : idx === 6
                          ? "bg-rose-500/15 border-rose-500/40 text-rose-700 dark:text-rose-300"
                          : "bg-primary/10 border-primary/25 text-primary"
                      )}
                    >
                      {gate.phaseName}
                    </span>
                  </div>
                )}

                {/* Point d'ancrage sur la ligne temporelle */}
                <div
                  className={cn(
                    "absolute -left-[31px] sm:-left-[43px] top-4 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border-2 transition-all shadow-xs",
                    isCompleted
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : isUnlocked
                      ? "border-primary bg-primary/10 text-primary ring-4 ring-primary/20"
                      : "border-border/80 bg-background text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4 stroke-[3]" />
                  ) : isUnlocked ? (
                    <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
                  ) : (
                    <Lock className="h-3.5 w-3.5 text-amber-500" />
                  )}
                </div>

                {/* Carte de la Session du Parcours */}
                <div
                  className={cn(
                    "rounded-2xl border p-4 sm:p-5 transition-all space-y-3",
                    isCompleted
                      ? "border-emerald-500/40 bg-card hover:border-emerald-500/70 shadow-2xs"
                      : isUnlocked
                      ? "border-border bg-card hover:border-primary/50 shadow-sm"
                      : "border-border/50 bg-muted/20 opacity-80"
                  )}
                >
                  {/* Palier Certificatif si applicable */}
                  {gate.isGate && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-black">
                      <Award className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                      <span>{gate.gateLabel}</span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-black text-primary px-2 py-0.5 rounded bg-primary/10">
                          SESSION {sessionNum}
                        </span>
                        <h3 className="font-display text-base sm:text-lg font-black text-foreground">
                          {series.title}
                        </h3>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {series.description || series.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isCompleted ? (
                        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-xs font-bold flex items-center gap-1 shadow-2xs">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          <span>Complété{details?.nclcLevel ? ` • NCLC ${details.nclcLevel}` : ""}</span>
                        </Badge>
                      ) : isUnlocked ? (
                        <Badge variant="outline" className="text-xs font-bold border-primary/30 text-primary bg-primary/5">
                          Prêt à Composer (+{series.xpReward} XP)
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                          <Lock className="h-3 w-3 text-amber-500" />
                          <span>Verrouillé</span>
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Prérequis Pédagogiques d'Accès si verrouillé */}
                  {!isUnlocked && (
                    <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-3 space-y-2 text-xs">
                      <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                        <Award className="h-3.5 w-3.5 text-amber-600" />
                        <span>Prérequis Pédagogiques d&apos;Accès :</span>
                      </div>
                      <div className="space-y-1.5 text-muted-foreground">
                        {idx > 0 && (
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              {gate.isPrevScoreSufficient ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                              ) : (
                                <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                              )}
                              <span>Examen {String(idx).padStart(2, "0")} validé (Min. {gate.minScoreRequired}/20)</span>
                            </span>
                            <span className="font-mono font-bold text-foreground">
                              {gate.prevScore > 0 ? `${gate.prevScore}/20` : "Non validé"}
                            </span>
                          </div>
                        )}
                        {gate.minCumulativeXpRequired > 0 && (
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              {gate.isXpSufficient ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                              ) : (
                                <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                              )}
                              <span>Points XP cumulés requis ({gate.minCumulativeXpRequired} XP)</span>
                            </span>
                            <span className="font-mono font-bold text-foreground">
                              {totalUserXp} / {gate.minCumulativeXpRequired} XP
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Accès aux Épreuves */}
                  <div className="grid gap-2 sm:grid-cols-2 pt-2 border-t border-border/50">
                    {/* Épreuve Écrite */}
                    <Link
                      href={isUnlocked ? eeUrl : "#"}
                      onClick={(e) => {
                        if (!isUnlocked) {
                          e.preventDefault();
                          handleAttemptAccessLocked(series, idx);
                        }
                      }}
                      className={cn(
                        "flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all group/item",
                        isUnlocked
                          ? "border-border/80 bg-muted/30 hover:bg-muted/70 hover:border-amber-500/40 text-foreground"
                          : "border-border/40 bg-muted/10 opacity-70 cursor-pointer"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <PenTool className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        <span>Expression Écrite (60 min)</span>
                      </div>
                      {isUnlocked ? (
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover/item:text-primary group-hover/item:translate-x-0.5 transition-all" />
                      ) : (
                        <Lock className="h-3 w-3 text-muted-foreground" />
                      )}
                    </Link>

                    {/* Épreuve Orale */}
                    <Link
                      href={isUnlocked ? eoUrl : "#"}
                      onClick={(e) => {
                        if (!isUnlocked) {
                          e.preventDefault();
                          handleAttemptAccessLocked(series, idx);
                        }
                      }}
                      className={cn(
                        "flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold transition-all group/item",
                        isUnlocked
                          ? "border-border/80 bg-muted/30 hover:bg-muted/70 hover:border-emerald-500/40 text-foreground"
                          : "border-border/40 bg-muted/10 opacity-70 cursor-pointer"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Mic className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span>Expression Orale (Visio IA)</span>
                      </div>
                      {isUnlocked ? (
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover/item:text-primary group-hover/item:translate-x-0.5 transition-all" />
                      ) : (
                        <Lock className="h-3 w-3 text-muted-foreground" />
                      )}
                    </Link>
                  </div>

                  {/* Bouton d'action si verrouillé */}
                  {!isUnlocked && (
                    <div className="pt-1">
                      <Button
                        onClick={() => handleAttemptAccessLocked(series, idx)}
                        variant="outline"
                        size="sm"
                        className="w-full text-xs font-bold gap-1.5 text-amber-700 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
                      >
                        <Lock className="h-3.5 w-3.5 text-amber-500" />
                        <span>Consulter les Prérequis pour Débloquer l&apos;Examen {sessionNum}</span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. VUE GRILLE RAPIDE (CBT GRID)                         */}
      {/* ======================================================== */}
      {viewMode === "grid" && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {seriesList.map((series, idx) => {
              const isCompleted = series.status === "COMPLETED";
              const isUnlocked = series.status !== "LOCKED";
              const sessionNum = String(idx + 1).padStart(2, "0");
              const details = completedDetails[series.id];
              const gate = series.gateInfo;

              const eeUrl =
                series.disciplines.find((d) => d.type === "ee")?.url || `/examens/${series.id}/ee/intro`;
              const eoUrl =
                series.disciplines.find((d) => d.type === "eo")?.url || `/examens/${series.id}/eo/intro`;

              return (
                <div
                  key={series.id}
                  className={cn(
                    "group relative flex flex-col justify-between rounded-2xl border p-4 transition-all hover:shadow-md",
                    isCompleted
                      ? "border-emerald-500/40 bg-card hover:border-emerald-500/70 shadow-2xs"
                      : isUnlocked
                      ? "border-border bg-card hover:border-primary/40"
                      : "border-border/50 bg-muted/20 opacity-80"
                  )}
                >
                  <div className="space-y-3">
                    {/* Haut de la carte : Numéro Session + Niveau / Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-lg font-mono text-xs font-black",
                            isCompleted
                              ? "bg-emerald-500/15 text-emerald-600"
                              : "bg-primary/10 text-primary"
                          )}
                        >
                          {sessionNum}
                        </span>
                        <h3 className="font-display text-base font-black text-foreground">
                          Examen {sessionNum}
                        </h3>
                      </div>

                      {isCompleted ? (
                        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 shadow-2xs">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          <span>Complété{details?.nclcLevel ? ` • NCLC ${details.nclcLevel}` : ""}</span>
                        </Badge>
                      ) : isUnlocked ? (
                        <Badge variant="outline" className="text-[10px] font-bold border-primary/30 text-primary bg-primary/5">
                          {series.levelBadge || "NCLC 7+"}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                          <Lock className="h-2.5 w-2.5 text-amber-500" />
                          <span>Verrouillé</span>
                        </Badge>
                      )}
                    </div>

                    {/* Accès direct aux 2 Épreuves de cette Session */}
                    <div className="space-y-1.5 pt-1">
                      {/* Épreuve 1 : Expression Écrite */}
                      <Link
                        href={isUnlocked ? eeUrl : "#"}
                        onClick={(e) => {
                          if (!isUnlocked) {
                            e.preventDefault();
                            handleAttemptAccessLocked(series, idx);
                          }
                        }}
                        className={cn(
                          "flex items-center justify-between p-2 rounded-xl border transition-all text-xs font-semibold group/item",
                          activeDiscipline === "ee"
                            ? "border-amber-500/60 bg-amber-500/10 text-amber-900 dark:text-amber-200 shadow-xs hover:bg-amber-500/20"
                            : "border-border/70 bg-muted/30 hover:bg-muted/70 hover:border-amber-500/40 text-foreground",
                          !isUnlocked && "cursor-pointer opacity-80"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <PenTool className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                          <span
                            className={cn(
                              "transition-colors",
                              activeDiscipline === "ee"
                                ? "font-bold text-amber-900 dark:text-amber-200"
                                : "group-hover/item:text-primary"
                            )}
                          >
                            {activeDiscipline === "ee" ? "Lancer l'Écrit (60 min)" : "Expression Écrite"}
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                          {isUnlocked ? (activeDiscipline === "ee" ? "→" : "60 min") : <Lock className="h-3 w-3" />}
                        </span>
                      </Link>

                      {/* Épreuve 2 : Expression Orale */}
                      <Link
                        href={isUnlocked ? eoUrl : "#"}
                        onClick={(e) => {
                          if (!isUnlocked) {
                            e.preventDefault();
                            handleAttemptAccessLocked(series, idx);
                          }
                        }}
                        className={cn(
                          "flex items-center justify-between p-2 rounded-xl border transition-all text-xs font-semibold group/item",
                          activeDiscipline === "eo"
                            ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 shadow-xs hover:bg-emerald-500/20"
                            : "border-border/70 bg-muted/30 hover:bg-muted/70 hover:border-emerald-500/40 text-foreground",
                          !isUnlocked && "cursor-pointer opacity-80"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Mic className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          <span
                            className={cn(
                              "transition-colors",
                              activeDiscipline === "eo"
                                ? "font-bold text-emerald-900 dark:text-emerald-200"
                                : "group-hover/item:text-emerald-600 dark:group-hover/item:text-emerald-400"
                            )}
                          >
                            {activeDiscipline === "eo" ? "Lancer la Visio IA" : "Expression Orale"}
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                          {isUnlocked ? (activeDiscipline === "eo" ? "→" : "Visio IA") : <Lock className="h-3 w-3" />}
                        </span>
                      </Link>
                    </div>
                  </div>

                  {/* Pied de carte : Récompenses CRS / XP ou Déverrouillage */}
                  <div className="pt-3 border-t border-border/50 mt-3">
                    {isCompleted ? (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          +{series.crsBonusPoints || 50} pts Validés
                        </span>
                        <span className="font-mono text-muted-foreground">+{series.xpReward} XP</span>
                      </div>
                    ) : isUnlocked ? (
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                          +{series.crsBonusPoints || 50} pts CRS
                        </span>
                        <span className="font-mono font-bold text-foreground">+{series.xpReward} XP</span>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleAttemptAccessLocked(series, idx)}
                        variant="outline"
                        size="sm"
                        className="w-full h-8 text-xs gap-1.5 text-amber-700 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/10 font-bold"
                      >
                        <Lock className="h-3.5 w-3.5 text-amber-500" />
                        <span>Prérequis Examen {sessionNum}</span>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 🔒 DIALOGUE MODAL DE PRÉREQUIS PÉDAGOGIQUES POUR EXAMEN VERROUILLÉ */}
      <Dialog
        open={!!lockedModalData}
        onOpenChange={(open) => {
          if (!open) setLockedModalData(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-600 mb-2">
              <Award className="h-7 w-7 text-amber-600" />
            </div>
            <DialogTitle className="text-center font-display text-xl font-black">
              Prérequis Examen {lockedModalData ? String(lockedModalData.targetIndex + 1).padStart(2, "0") : ""} Verrouillé
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-muted-foreground pt-1">
              Parcours d&apos;Excellence Pédagogique • Norme FEI &amp; Standard NCLC 7+
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2 text-xs">
            {/* Encadré Objectifs Pédagogiques */}
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3.5 space-y-2.5">
              <p className="font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                <span>Conditions requises pour débloquer cette session :</span>
              </p>

              <div className="space-y-2 text-muted-foreground">
                {/* Condition 1 : Examen Précédent */}
                {lockedModalData?.prevSeries && (
                  <div className="flex items-start justify-between gap-2 border-b border-border/50 pb-2">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        {lockedModalData.gateInfo.isPrevScoreSufficient ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        ) : (
                          <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        )}
                        Examen {String(lockedModalData.targetIndex).padStart(2, "0")} validé (Min. {lockedModalData.gateInfo.minScoreRequired}/20)
                      </span>
                      <p className="text-[11px] text-muted-foreground">
                        {lockedModalData.gateInfo.isPrevScoreSufficient
                          ? "✓ Prérequis pédagogique validé !"
                          : `Votre note actuelle est de ${lockedModalData.gateInfo.prevScore}/20. Un score de ${lockedModalData.gateInfo.minScoreRequired}/20 est exigé.`}
                      </p>
                    </div>
                  </div>
                )}

                {/* Condition 2 : Total XP Cumulé */}
                {lockedModalData?.gateInfo && lockedModalData.gateInfo.minCumulativeXpRequired > 0 && (
                  <div className="flex items-start justify-between gap-2 pt-1">
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground flex items-center gap-1.5">
                          {lockedModalData.gateInfo.isXpSufficient ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          ) : (
                            <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
                          )}
                          Points XP Cumulés
                        </span>
                        <span className="font-mono font-bold text-foreground">
                          {totalUserXp} / {lockedModalData.gateInfo.minCumulativeXpRequired} XP
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        {lockedModalData.gateInfo.isXpSufficient
                          ? "✓ Seuil d'expérience atteint !"
                          : `Il vous manque ${Math.max(0, lockedModalData.gateInfo.minCumulativeXpRequired - totalUserXp)} XP pour débloquer ce niveau.`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Conseil Stratégique du Mentor */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-[11px] text-muted-foreground space-y-1">
              <div className="font-bold text-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>Conseil du Mentor Pédagogique :</span>
              </div>
              <p className="leading-relaxed">
                Ce verrouillage garantit que vous n&apos;abordez pas des sujets pièges FEI de niveau C1/C2 avant d&apos;avoir consolidé vos automatismes de gestion du temps et vos connecteurs formels.
              </p>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
            {lockedModalData?.prevSeries ? (
              <Button
                variant="outline"
                className="w-full sm:w-auto text-xs font-semibold"
                onClick={() => {
                  const prevId = lockedModalData.prevSeries?.id;
                  setLockedModalData(null);
                  if (prevId) router.push(`/examens/${prevId}`);
                }}
              >
                Passer l&apos;Examen {String(lockedModalData.targetIndex).padStart(2, "0")}
              </Button>
            ) : null}
            <Button
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold text-xs gap-1.5"
              onClick={() => {
                if (lockedModalData?.targetSeries) {
                  handleUnlockSeries(lockedModalData.targetSeries.id);
                  setLockedModalData(null);
                }
              }}
            >
              <Unlock className="h-3.5 w-3.5" />
              <span>Accéder Directement</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
