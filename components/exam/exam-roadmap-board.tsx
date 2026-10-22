"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
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
  Unlock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

  const [activeTest, setActiveTest] = useState<TestType>(validTest);
  const [activeDiscipline, setActiveDiscipline] = useState<DisciplineType>(validDiscipline);
  const [viewMode, setViewMode] = useState<"roadmap" | "grid">(initialView);
  const [ieltsTrack, setIeltsTrack] = useState<"general" | "academic">("general");

  // Dynamic unlocking state saved in localStorage
  const [unlockedSeriesIds, setUnlockedSeriesIds] = useState<string[]>([
    "tcf-blanc-1",
    "demo-101-ce",
    "serie-102",
    "tef-201",
    "ielts-301",
    "ielts-gen-18-1",
    "ielts-acad-19-1",
  ]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_UNLOCKED_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setUnlockedSeriesIds((prev) => Array.from(new Set([...prev, ...parsed])));
        }
      }
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
  const seriesList = filteredRaw.map((s) => ({
    ...s,
    status:
      s.status === "UNLOCKED" ||
      s.status === "COMPLETED" ||
      unlockedSeriesIds.includes(s.id)
        ? "UNLOCKED"
        : "LOCKED",
  }));

  const [selectedSeriesId, setSelectedSeriesId] = useState<string>(seriesList[0]?.id || "");

  const selectedSeries =
    seriesList.find((s) => s.id === selectedSeriesId) || seriesList[0];

  const handleTestChange = (test: TestType) => {
    setActiveTest(test);
    const newSeriesList = getSeriesForTest(test);
    const initialList =
      test === "ielts"
        ? newSeriesList.filter((s) => !s.ieltsTrack || s.ieltsTrack === ieltsTrack)
        : newSeriesList;
    setSelectedSeriesId(initialList[0]?.id || "");
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

  const testMeta = TEST_CATALOG[activeTest];
  const isSelectedUnlocked = selectedSeries && selectedSeries.status !== "LOCKED";

  return (
    <div className="space-y-6">
      {/* 🧭 En-tête Compact & Sélecteurs Rapides de Test & Discipline */}
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

        {/* Sélecteurs Rapides : Test [TCF | TEF | IELTS] + Épreuve [Toutes | Écrit | Oral] */}
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
              onClick={() => {
                setIeltsTrack("general");
                const genList = rawSeriesList.filter((s) => s.ieltsTrack === "general");
                setSelectedSeriesId(genList[0]?.id || "");
              }}
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
              onClick={() => {
                setIeltsTrack("academic");
                const acadList = rawSeriesList.filter((s) => s.ieltsTrack === "academic");
                setSelectedSeriesId(acadList[0]?.id || "");
              }}
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

      {/* 📋 GRILLE MODERNE & COMPACTE DES SESSIONS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-muted-foreground px-1">
          <span>
            {seriesList.length} Examens d&apos;Entraînement ·{" "}
            <strong className="text-foreground">
              {seriesList.filter((s) => s.status !== "LOCKED").length} Ouvertes
            </strong>
          </span>
          <span className="text-emerald-500 font-bold flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" /> Grille NCLC 7+ Validée
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {seriesList.map((series, idx) => {
            const isUnlocked = series.status !== "LOCKED";
            const sessionNum = String(idx + 1).padStart(2, "0");

            const eeUrl =
              series.disciplines.find((d) => d.type === "ee")?.url || `/examens/${series.id}/ee/intro`;
            const eoUrl =
              series.disciplines.find((d) => d.type === "eo")?.url || `/examens/${series.id}/eo/intro`;

            return (
              <div
                key={series.id}
                className={cn(
                  "group relative flex flex-col justify-between rounded-2xl border p-4 transition-all hover:shadow-md",
                  isUnlocked
                    ? "border-border bg-card hover:border-primary/40"
                    : "border-border/50 bg-muted/20 opacity-80"
                )}
              >
                <div className="space-y-3">
                  {/* Haut de la carte : Numéro Session + Niveau */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 font-mono text-xs font-black text-primary">
                        {sessionNum}
                      </span>
                      <h3 className="font-display text-base font-black text-foreground">
                        Examen {sessionNum}
                      </h3>
                    </div>
                    <Badge variant={isUnlocked ? "outline" : "secondary"} className="text-[10px] font-bold">
                      {series.levelBadge || "NCLC 7+"}
                    </Badge>
                  </div>

                  {/* Accès direct aux 2 Épreuves de cette Session */}
                  <div className="space-y-1.5 pt-1">
                    {/* Épreuve 1 : Expression Écrite */}
                    <Link
                      href={isUnlocked ? eeUrl : "#"}
                      onClick={(e) => {
                        if (!isUnlocked) {
                          e.preventDefault();
                          handleUnlockSeries(series.id);
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
                        <span className={cn(
                          "transition-colors",
                          activeDiscipline === "ee" ? "font-bold text-amber-900 dark:text-amber-200" : "group-hover/item:text-primary"
                        )}>
                          {activeDiscipline === "ee" ? "Lancer l'Écrit (60 min)" : "Expression Écrite"}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                        {activeDiscipline === "ee" ? "→" : "60 min"}
                      </span>
                    </Link>

                    {/* Épreuve 2 : Expression Orale */}
                    <Link
                      href={isUnlocked ? eoUrl : "#"}
                      onClick={(e) => {
                        if (!isUnlocked) {
                          e.preventDefault();
                          handleUnlockSeries(series.id);
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
                        <span className={cn(
                          "transition-colors",
                          activeDiscipline === "eo" ? "font-bold text-emerald-900 dark:text-emerald-200" : "group-hover/item:text-emerald-600 dark:group-hover/item:text-emerald-400"
                        )}>
                          {activeDiscipline === "eo" ? "Lancer la Visio IA" : "Expression Orale"}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono flex items-center gap-1">
                        {activeDiscipline === "eo" ? "→" : "Visio IA"}
                      </span>
                    </Link>
                  </div>
                </div>

                {/* Pied de carte : Récompenses CRS / XP ou Déverrouillage */}
                <div className="pt-3 border-t border-border/50 mt-3">
                  {isUnlocked ? (
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        +{series.crsBonusPoints || 50} pts CRS
                      </span>
                      <span className="font-mono">+{series.xpReward} XP</span>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleUnlockSeries(series.id)}
                      variant="outline"
                      size="sm"
                      className="w-full h-8 text-xs gap-1.5 text-primary border-primary/30 hover:bg-primary/10"
                    >
                      <Unlock className="h-3.5 w-3.5" />
                      <span>Débloquer la Session {sessionNum}</span>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
