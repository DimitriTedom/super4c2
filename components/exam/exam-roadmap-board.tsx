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

  const [activeTest, setActiveTest] = useState<TestType>(validTest);
  const [activeDiscipline, setActiveDiscipline] = useState<DisciplineType>(initialDiscipline);
  const [viewMode, setViewMode] = useState<"roadmap" | "grid">(initialView);

  // Dynamic unlocking state saved in localStorage
  const [unlockedSeriesIds, setUnlockedSeriesIds] = useState<string[]>([
    "demo-101-ce",
    "serie-102",
    "tef-201",
    "ielts-301",
  ]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_UNLOCKED_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setUnlockedSeriesIds(parsed);
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
  const seriesList = rawSeriesList.map((s) => ({
    ...s,
    status: unlockedSeriesIds.includes(s.id) || s.status === "COMPLETED" ? "UNLOCKED" : "LOCKED",
  }));

  const [selectedSeriesId, setSelectedSeriesId] = useState<string>(seriesList[0]?.id || "");

  const selectedSeries =
    seriesList.find((s) => s.id === selectedSeriesId) || seriesList[0];

  const handleTestChange = (test: TestType) => {
    setActiveTest(test);
    const newSeriesList = getSeriesForTest(test);
    setSelectedSeriesId(newSeriesList[0]?.id || "");
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("test", test);
      router.push(`/examens?${params.toString()}`, { scroll: false });
    });
  };

  const testMeta = TEST_CATALOG[activeTest];
  const isSelectedUnlocked = selectedSeries && selectedSeries.status !== "LOCKED";

  return (
    <div className="space-y-10">
      {/* 🧭 Header & Test Selector Hub */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card/95 to-primary/[0.04] p-6 sm:p-10 shadow-lg backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary font-bold px-3 py-1 text-xs">
                {testMeta.badge}
              </Badge>
              <Badge variant="secondary" className="font-mono text-xs">
                {testMeta.officialAuthority}
              </Badge>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
              Séries {testMeta.name} — Parcours CBT Officiel
            </h1>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              {testMeta.description}
            </p>
          </div>

          {/* Test Pill Switcher */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Choisir votre examen officiel :
            </span>
            <div className="inline-flex rounded-2xl border bg-muted/40 p-1.5 shadow-xs backdrop-blur-md">
              <button
                type="button"
                onClick={() => handleTestChange("tcf")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all ${
                  activeTest === "tcf"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                <span>🇨🇦 TCF Canada</span>
                {activeTest === "tcf" && <Sparkles className="h-3.5 w-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => handleTestChange("tef")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all ${
                  activeTest === "tef"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                <span>🇨🇦 TEF Canada</span>
              </button>

              <button
                type="button"
                onClick={() => handleTestChange("ielts")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all ${
                  activeTest === "ielts"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                <span>🇬🇧 IELTS General</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-primary pt-1">
              <Zap className="h-3.5 w-3.5 fill-primary" />
              <span>Objectif {testMeta.nclcTarget} • {testMeta.crsBonusLabel}</span>
            </div>
          </div>
        </div>

        {/* 🎛️ Filter Bar: Disciplines & View Mode */}
        <div className="mt-8 pt-6 border-t border-border/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Discipline Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-muted-foreground mr-1.5 hidden sm:inline">
              Épreuve :
            </span>
            <Button
              size="sm"
              variant={activeDiscipline === "all" ? "default" : "outline"}
              onClick={() => setActiveDiscipline("all")}
              className={`rounded-full text-xs font-semibold h-8 px-3.5 ${
                activeDiscipline === "all" ? "shadow-xs" : "border-border/80"
              }`}
            >
              <Layers className="h-3.5 w-3.5 mr-1.5" />
              Toutes les épreuves (Pack Complet)
            </Button>
            <Button
              size="sm"
              variant={activeDiscipline === "ce" ? "default" : "outline"}
              onClick={() => setActiveDiscipline("ce")}
              className={`rounded-full text-xs font-semibold h-8 px-3.5 ${
                activeDiscipline === "ce" ? "shadow-xs" : "border-border/80"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5 mr-1.5 text-rose-500" />
              Compréhension Écrite (CE)
            </Button>
            <Button
              size="sm"
              variant={activeDiscipline === "co" ? "default" : "outline"}
              onClick={() => setActiveDiscipline("co")}
              className={`rounded-full text-xs font-semibold h-8 px-3.5 ${
                activeDiscipline === "co" ? "shadow-xs" : "border-border/80"
              }`}
            >
              <Headphones className="h-3.5 w-3.5 mr-1.5 text-cyan-500" />
              Compréhension Orale (CO)
            </Button>
            <Button
              size="sm"
              variant={activeDiscipline === "ee" ? "default" : "outline"}
              onClick={() => setActiveDiscipline("ee")}
              className={`rounded-full text-xs font-semibold h-8 px-3.5 ${
                activeDiscipline === "ee" ? "shadow-xs" : "border-border/80"
              }`}
            >
              <PenTool className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
              Expression Écrite (EE)
            </Button>
            <Button
              size="sm"
              variant={activeDiscipline === "eo" ? "default" : "outline"}
              onClick={() => setActiveDiscipline("eo")}
              className={`rounded-full text-xs font-semibold h-8 px-3.5 ${
                activeDiscipline === "eo" ? "shadow-xs" : "border-border/80"
              }`}
            >
              <Mic className="h-3.5 w-3.5 mr-1.5 text-emerald-500" />
              Expression Orale (EO)
            </Button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 rounded-full border bg-muted/50 p-1 self-start md:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("roadmap")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all ${
                viewMode === "roadmap"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Route className="h-3.5 w-3.5 text-primary" />
              <span>Roadmap Déblocage</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all ${
                viewMode === "grid"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Vue Grille</span>
            </button>
          </div>
        </div>
      </div>

      {/* 🚀 MODE 1 : ROADMAP INTERACTIF HORIZONTAL AVEC FLÈCHES DIRECTIONNELLES */}
      {viewMode === "roadmap" && (
        <div className="space-y-8">
          {/* Progression Summary Tracker */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border bg-card/60 p-4 sm:p-5 text-sm backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                <Flame className="h-5 w-5 fill-primary/20 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground">
                  Parcours de déblocage progressif {testMeta.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Glissez horizontalement pour explorer la séquence complète de votre apprentissage.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
              <span>
                Séries débloquées :{" "}
                <strong className="text-foreground">
                  {seriesList.filter((s) => s.status !== "LOCKED").length} / {seriesList.length}
                </strong>
              </span>
              <span className="h-3 w-px bg-border" />
              <span className="text-emerald-500 font-bold flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Format FEI Validé
              </span>
            </div>
          </div>

          {/* 🛣️ Horizontal Scrollable Quest Board with Directional Connector Arrows */}
          <div className="relative rounded-3xl border border-border/80 bg-card/40 p-4 sm:p-6 shadow-inner backdrop-blur-xl">
            <div className="overflow-x-auto pb-4 scrollbar-thin scroll-smooth snap-x">
              <div className="flex items-stretch gap-4 min-w-max px-2 py-2">
                {seriesList.map((series, idx) => {
                  const isSelected = selectedSeriesId === series.id;
                  const isUnlocked = series.status !== "LOCKED";
                  const isCurrent = isUnlocked && idx === 0;
                  const isLast = idx === seriesList.length - 1;
                  const nextSeries = seriesList[idx + 1];
                  const nextIsUnlocked = nextSeries && nextSeries.status !== "LOCKED";

                  return (
                    <div key={series.id} className="flex items-center shrink-0">
                      {/* Milestone Card */}
                      <motion.div
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        onClick={() => setSelectedSeriesId(series.id)}
                        className={`w-72 sm:w-80 cursor-pointer rounded-3xl border p-5 transition-all flex flex-col justify-between select-none snap-center ${
                          isSelected
                            ? "border-primary bg-card shadow-2xl ring-2 ring-primary/40"
                            : isUnlocked
                            ? "border-border/80 bg-card/85 hover:border-primary/50 hover:bg-card"
                            : "border-border/40 bg-muted/25 opacity-75 hover:opacity-90"
                        }`}
                      >
                        {/* Top status indicator */}
                        <div className="flex items-center justify-between gap-2 pb-3">
                          <span className="font-mono text-xs font-bold text-muted-foreground">
                            Étape {idx + 1}
                          </span>
                          {series.recommended ? (
                            <Badge className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-0">
                              Recommandée
                            </Badge>
                          ) : isUnlocked ? (
                            <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold gap-1">
                              <CheckCircle2 className="h-2.5 w-2.5" /> Débloquée
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-[10px] text-muted-foreground gap-1">
                              <Lock className="h-2.5 w-2.5" /> Verrouillée
                            </Badge>
                          )}
                        </div>

                        {/* Milestone Node Body */}
                        <div className="space-y-2.5 py-2">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-xs transition-transform ${
                                isSelected
                                  ? "bg-primary text-primary-foreground scale-105 shadow-md"
                                  : isUnlocked
                                  ? "bg-primary/10 text-primary"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {idx === 0 ? (
                                <BookOpen className="h-5 w-5" />
                              ) : idx === 1 ? (
                                <Sparkles className="h-5 w-5" />
                              ) : idx === 2 ? (
                                <Flame className="h-5 w-5" />
                              ) : idx === 3 ? (
                                <Trophy className="h-5 w-5" />
                              ) : (
                                <ShieldCheck className="h-5 w-5" />
                              )}
                            </div>

                            <div>
                              <h3 className="font-display text-base font-bold text-foreground leading-tight">
                                Série {series.seriesNumber}
                              </h3>
                              <span className="text-[11px] font-medium text-muted-foreground block">
                                {series.levelBadge}
                              </span>
                            </div>
                          </div>

                          <div className="pt-1 flex items-center justify-between">
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-primary">
                              🎯 {series.targetNclc}
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground">
                              +{series.xpReward} XP
                            </span>
                          </div>
                        </div>

                        {/* Progress bar or lock message */}
                        <div className="pt-3 border-t border-border/60">
                          {isUnlocked ? (
                            <div className="space-y-1">
                              <div className="flex justify-between text-[11px] font-medium text-muted-foreground">
                                <span>Progression</span>
                                <span>{series.progressPercent}%</span>
                              </div>
                              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                <div
                                  className="h-full bg-primary rounded-full transition-all"
                                  style={{ width: `${Math.max(5, series.progressPercent)}%` }}
                                />
                              </div>
                            </div>
                          ) : (
                            <p className="text-[11px] text-muted-foreground line-clamp-1 italic">
                              {series.unlockCondition || "À débloquer"}
                            </p>
                          )}
                        </div>

                        {/* Active Halo Indicator */}
                        {isCurrent && (
                          <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
                          </span>
                        )}
                      </motion.div>

                      {/* ➔ Directional Glowing Connector Arrow to Next Milestone */}
                      {!isLast && (
                        <div className="flex flex-col items-center justify-center shrink-0 px-3 select-none">
                          <div
                            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold transition-all ${
                              isUnlocked && nextIsUnlocked
                                ? "bg-gradient-to-r from-primary/20 via-cyan-500/20 to-primary/20 text-primary border border-primary/30 shadow-xs"
                                : "bg-muted/40 text-muted-foreground/60 border border-border/40"
                            }`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                            <ArrowRight className="h-4 w-4 text-foreground/80" />
                          </div>
                          <span className="text-[10px] font-mono text-muted-foreground mt-1">
                            S.{series.seriesNumber} ➔ S.{nextSeries.seriesNumber}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 🗂️ Interactive Series Detail Panel */}
          <AnimatePresence mode="wait">
            {selectedSeries && (
              <motion.div
                key={selectedSeries.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-card via-card to-primary/[0.03] p-6 sm:p-8 shadow-xl space-y-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-border/80 pb-6">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-primary uppercase tracking-wider">
                        Série Sélectionnée
                      </span>
                      <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary font-bold">
                        {selectedSeries.levelBadge}
                      </Badge>
                      <Badge variant="secondary" className="font-mono text-xs">
                        {selectedSeries.targetNclc}
                      </Badge>
                      {selectedSeries.crsBonusPoints && selectedSeries.crsBonusPoints > 0 && (
                        <Badge className="bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 text-xs font-bold">
                          +{selectedSeries.crsBonusPoints} Points CRS Canada
                        </Badge>
                      )}
                    </div>

                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
                      {selectedSeries.title}
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
                      {selectedSeries.description}
                    </p>
                  </div>

                  {/* Primary CTA (Respecting Unlocked Status!) */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                    {isSelectedUnlocked ? (
                      <Button
                        asChild
                        size="lg"
                        className="font-bold text-base shadow-md px-6 bg-primary hover:bg-primary/90"
                      >
                        <Link href={selectedSeries.disciplines[0]?.url || "/examens/demo-101-ce"}>
                          <span>Lancer la Série Complète (CBT)</span>
                          <ArrowRight className="h-5 w-5 ml-2" />
                        </Link>
                      </Button>
                    ) : (
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <Button
                          disabled
                          size="lg"
                          variant="outline"
                          className="opacity-70 gap-2 border-border/80 cursor-not-allowed"
                        >
                          <Lock className="h-4 w-4" />
                          <span>Série Verrouillée</span>
                        </Button>
                        <Button
                          size="lg"
                          onClick={() => handleUnlockSeries(selectedSeries.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 shadow-md"
                        >
                          <Unlock className="h-4 w-4" />
                          <span>Simuler le déblocage (Mode Démo)</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Lock Requirement Banner if Locked */}
                {!isSelectedUnlocked && (
                  <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-start gap-3 text-amber-900 dark:text-amber-200">
                    <Lock className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        Condition de déblocage requise
                      </p>
                      <p className="text-xs leading-relaxed">
                        {selectedSeries.unlockCondition ||
                          "Validez votre épreuve sur la série précédente ou souscrivez à l'accès Pro pour déverrouiller ce palier."}
                      </p>
                    </div>
                  </div>
                )}

                {/* Focus Topics Pills */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Thématiques clés & pièges abordés dans cette série :
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedSeries.focusTopics.map((topic) => (
                      <span
                        key={topic}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-xs font-medium text-foreground/90"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 4 Official Disciplines Cards */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg font-bold">
                      Accès direct par discipline pour la Série {selectedSeries.seriesNumber}
                    </h3>
                    <span className="text-xs text-muted-foreground font-mono">
                      4 simulateurs indépendants
                    </span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {selectedSeries.disciplines
                      .filter((d) => activeDiscipline === "all" || d.type === activeDiscipline)
                      .map((d) => {
                        const Icon =
                          d.type === "ce"
                            ? BookOpen
                            : d.type === "co"
                            ? Headphones
                            : d.type === "ee"
                            ? PenTool
                            : Mic;

                        const isFlagship = d.type === "ce";

                        return (
                          <div
                            key={d.type}
                            className={`group relative flex flex-col justify-between rounded-2xl border p-5 transition-all hover:-translate-y-1 ${
                              isFlagship
                                ? "border-primary/50 bg-card shadow-md"
                                : "border-border bg-card/80 hover:border-primary/40"
                            }`}
                          >
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div
                                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                                    d.type === "ce"
                                      ? "bg-rose-500/15 text-rose-500"
                                      : d.type === "co"
                                      ? "bg-cyan-500/15 text-cyan-500"
                                      : d.type === "ee"
                                      ? "bg-amber-500/15 text-amber-500"
                                      : "bg-emerald-500/15 text-emerald-500"
                                  }`}
                                >
                                  <Icon className="h-5 w-5" />
                                </div>
                                <Badge variant="outline" className="text-[10px] font-bold">
                                  {d.badge}
                                </Badge>
                              </div>

                              <div>
                                <h4 className="font-display font-bold text-base text-foreground">
                                  {d.name}
                                </h4>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {d.questionsOrTasks}
                                </p>
                              </div>

                              <p className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                                <Clock className="h-3.5 w-3.5" />
                                <span>Durée officielle : {d.duration}</span>
                              </p>
                            </div>

                            {isSelectedUnlocked ? (
                              <Button
                                asChild
                                size="sm"
                                variant={isFlagship ? "default" : "outline"}
                                className="w-full mt-4 font-bold"
                              >
                                <Link href={d.url}>
                                  <span>Commencer ({d.duration})</span>
                                </Link>
                              </Button>
                            ) : (
                              <Button
                                disabled
                                size="sm"
                                variant="outline"
                                className="w-full mt-4 font-semibold opacity-70 gap-1.5"
                              >
                                <Lock className="h-3.5 w-3.5" />
                                <span>Verrouillé</span>
                              </Button>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* 📋 MODE 2 : VUE GRILLE CATALOGUE STANDARD */}
      {viewMode === "grid" && (
        <div className="space-y-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {seriesList.map((series) => {
              const isUnlocked = series.status !== "LOCKED";

              return (
                <div
                  key={series.id}
                  className={`group relative flex flex-col justify-between rounded-3xl border p-6 transition-all hover:-translate-y-1 ${
                    series.recommended
                      ? "border-primary/60 bg-gradient-to-b from-card via-card to-primary/[0.04] shadow-lg"
                      : isUnlocked
                      ? "border-border bg-card hover:border-primary/40 hover:shadow-md"
                      : "border-border/50 bg-muted/20 opacity-80"
                  }`}
                >
                  {series.recommended && (
                    <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary-foreground shadow-xs">
                      <Sparkles className="h-3 w-3" /> Recommandée · Flagship
                    </span>
                  )}

                  <div className="space-y-4 pt-1">
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <Badge variant={isUnlocked ? "outline" : "secondary"} className="text-xs font-bold">
                        {series.levelBadge}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="font-display text-xl font-bold leading-snug">
                        Série {series.seriesNumber}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {series.subtitle}
                      </p>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {series.description}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <Badge variant="secondary" className="text-[11px] font-mono">
                        🎯 {series.targetNclc}
                      </Badge>
                      <Badge variant="secondary" className="text-[11px] font-mono">
                        ⚡ +{series.xpReward} XP
                      </Badge>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border/60 mt-4">
                    {isUnlocked ? (
                      <Button asChild className="w-full font-bold shadow-xs">
                        <Link href={series.disciplines[0]?.url || "/examens/demo-101-ce"}>
                          <span>Choisir la Série {series.seriesNumber}</span>
                          <ArrowRight className="h-4 w-4 ml-1.5" />
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleUnlockSeries(series.id)}
                        variant="outline"
                        className="w-full gap-2 text-primary border-primary/30 hover:bg-primary/10"
                      >
                        <Unlock className="h-4 w-4" />
                        <span>Débloquer la Série {series.seriesNumber}</span>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
