"use client";

import { useState, useEffect, useTransition } from "react";
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

  // 🔒 Règle de progression stricte de la Roadmap :
  // - Examen 01 : UNLOCKED par défaut pour tout candidat (ou COMPLETED si déjà fait)
  // - Examen N (N > 1) : COMPLETED si fait, UNLOCKED si l'Examen N-1 est COMPLETED (ou débloqué VIP), sinon strictement LOCKED.
  const seriesList = filteredRaw.map((s, idx) => {
    const isCompleted = completedSeriesIds.includes(s.id);
    const prevSeriesId = idx > 0 ? filteredRaw[idx - 1].id : null;
    const isPrevCompleted = prevSeriesId ? completedSeriesIds.includes(prevSeriesId) : false;
    const isExplicitlyUnlocked = unlockedSeriesIds.includes(s.id);

    let status: "COMPLETED" | "UNLOCKED" | "LOCKED" = "LOCKED";
    if (isCompleted) {
      status = "COMPLETED";
    } else if (idx === 0 || isPrevCompleted || isExplicitlyUnlocked) {
      status = "UNLOCKED";
    } else {
      status = "LOCKED";
    }

    return {
      ...s,
      status,
    };
  });

  const [lockedModalData, setLockedModalData] = useState<{
    targetSeries: (typeof seriesList)[0];
    targetIndex: number;
    prevSeries?: (typeof seriesList)[0];
  } | null>(null);

  const handleAttemptAccessLocked = (seriesItem: (typeof seriesList)[0], index: number) => {
    const prevSeries = index > 0 ? seriesList[index - 1] : undefined;
    setLockedModalData({
      targetSeries: seriesItem,
      targetIndex: index,
      prevSeries,
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

        {/* Sélecteurs Rapides : Test [TCF | TEF | IELTS] + Épreuve [Toutes | Écrit | Oral] + Vue [Parcours | Grille] */}
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

      {/* 📊 BANDEAU DE PROGRESSION STRICTE */}
      <div className="p-4 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm space-y-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground">Progression de la Série :</span>
            <span className="text-muted-foreground font-mono">
              <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{completedCount}</strong>/{totalCount} complétés ({progressPercent}%)
            </span>
            <span className="text-muted-foreground hidden sm:inline">·</span>
            <span className="text-muted-foreground font-mono">
              <strong className="text-foreground">{unlockedCount}</strong> débloqués
            </span>
          </div>

          <div className="flex items-center gap-2">
            {completedCount > 0 ? (
              <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[11px] font-bold">
                ✓ Seuil Actif (+50 pts CRS en cours)
              </Badge>
            ) : (
              <span className="text-muted-foreground flex items-center gap-1 font-semibold text-[11px]">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Règle : Complétez chaque examen pour ouvrir le suivant
              </span>
            )}
          </div>
        </div>

        {/* Barre de progression visuelle */}
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary via-indigo-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${Math.max(progressPercent, 4)}%` }}
          />
        </div>
      </div>

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

            const eeUrl =
              series.disciplines.find((d) => d.type === "ee")?.url || `/examens/${series.id}/ee/intro`;
            const eoUrl =
              series.disciplines.find((d) => d.type === "eo")?.url || `/examens/${series.id}/eo/intro`;

            // Paliers pédagogiques
            const isPhaseStart = idx === 0 || idx === 3 || idx === 6;
            const phaseTitle =
              idx === 0
                ? "Phase 1 : Immersion & Diagnostic CBT Initial"
                : idx === 3
                ? "Phase 2 : Passage au Seuil NCLC 7+ (+50 pts CRS)"
                : "Phase 3 : Maîtrise C1/C2 Élite & Vitesse Réflexe";

            return (
              <div key={series.id} className="relative group">
                {/* Séparateur de Phase */}
                {isPhaseStart && (
                  <div className="mb-4 -ml-7 sm:-ml-10 flex items-center gap-2">
                    <span className="flex h-6 px-2.5 items-center rounded-full bg-primary/10 border border-primary/25 font-bold text-[10px] text-primary uppercase tracking-wider">
                      {phaseTitle}
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
                    <Lock className="h-3.5 w-3.5" />
                  )}
                </div>

                {/* Carte de la Session du Parcours */}
                <div
                  className={cn(
                    "rounded-2xl border p-4 sm:p-5 transition-all",
                    isCompleted
                      ? "border-emerald-500/40 bg-card hover:border-emerald-500/70 shadow-2xs"
                      : isUnlocked
                      ? "border-border bg-card hover:border-primary/50 shadow-sm"
                      : "border-border/50 bg-muted/20 opacity-80"
                  )}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
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
                          Disponible
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                          <Lock className="h-3 w-3 text-amber-500" />
                          <span>Verrouillé</span>
                        </Badge>
                      )}
                    </div>
                  </div>

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
                    <div className="mt-3">
                      <Button
                        onClick={() => handleAttemptAccessLocked(series, idx)}
                        variant="outline"
                        size="sm"
                        className="w-full text-xs font-bold gap-1.5 text-amber-700 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
                      >
                        <Lock className="h-3.5 w-3.5 text-amber-500" />
                        <span>Voir le prérequis pour débloquer l&apos;Examen {sessionNum}</span>
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
                        <span className="font-mono">+{series.xpReward} XP</span>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleAttemptAccessLocked(series, idx)}
                        variant="outline"
                        size="sm"
                        className="w-full h-8 text-xs gap-1.5 text-amber-700 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/10 font-bold"
                      >
                        <Lock className="h-3.5 w-3.5 text-amber-500" />
                        <span>Examen {sessionNum} Verrouillé</span>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 🔒 DIALOGUE EXPLICATIF DE PRÉREQUIS POUR EXAMEN VERROUILLÉ */}
      <Dialog
        open={!!lockedModalData}
        onOpenChange={(open) => {
          if (!open) setLockedModalData(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-600 mb-2">
              <Lock className="h-7 w-7" />
            </div>
            <DialogTitle className="text-center font-display text-xl font-black">
              Examen {lockedModalData ? String(lockedModalData.targetIndex + 1).padStart(2, "0") : ""} Verrouillé
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-muted-foreground pt-1">
              Progression Pédagogique Recommandée • Standard NCLC 7 / NCLC 10+
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="rounded-xl border border-border/80 bg-muted/40 p-3.5 space-y-2">
              <p className="font-semibold text-foreground flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                <span>Pourquoi cet examen est-il verrouillé ?</span>
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Pour garantir une progression solide vers les <strong>+50 points CRS</strong>, nous vous recommandons de compléter d&apos;abord l&apos;<strong>Examen {lockedModalData && lockedModalData.prevSeries ? String(lockedModalData.targetIndex).padStart(2, "0") : "précédent"}</strong> ({lockedModalData?.prevSeries?.title || "Session antérieure"}).
              </p>
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed text-center">
              Chaque série d&apos;examen augmente progressivement le niveau d&apos;exigence FEI (variété lexicale, connecteurs formels C1/C2 et pièges rhétoriques).
            </p>
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
                Faire l&apos;Examen {String(lockedModalData.targetIndex).padStart(2, "0")}
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
              <span>Débloquer cet examen</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
