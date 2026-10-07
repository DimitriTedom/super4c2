"use client";

import { useRef, useState, useTransition } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedBeam } from "@/components/ui/animated-beam";
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

  const seriesList = getSeriesForTest(activeTest);
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>(seriesList[0]?.id || "");

  // Refs for animated beams between the first 3 nodes
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRef1 = useRef<HTMLDivElement>(null);
  const nodeRef2 = useRef<HTMLDivElement>(null);
  const nodeRef3 = useRef<HTMLDivElement>(null);
  const nodeRef4 = useRef<HTMLDivElement>(null);

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
              <span>Roadmap Interactif</span>
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

      {/* 🚀 MODE 1 : ROADMAP INTERACTIF AVEC FAISCEAUX LUMINEUX (BEAMS) */}
      {viewMode === "roadmap" && (
        <div className="space-y-8">
          {/* Progression Summary Tracker */}
          <div className="flex items-center justify-between rounded-2xl border bg-card/60 p-4 sm:p-5 text-sm backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Flame className="h-5 w-5 fill-primary/20 text-primary" />
              </div>
              <div>
                <p className="font-bold text-foreground">
                  Parcours de déblocage progressif {testMeta.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Progressez de série en série pour gravir les échelons NCLC et débloquer les 50 points CRS.
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-muted-foreground">
              <span>Séries débloquées : <strong className="text-foreground">2 / {seriesList.length}</strong></span>
              <span className="h-3 w-px bg-border" />
              <span className="text-emerald-500 font-bold flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Simulation CBT Réelle
              </span>
            </div>
          </div>

          {/* Interactive Board with Beams */}
          <div
            ref={containerRef}
            className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/40 p-6 sm:p-10 shadow-inner backdrop-blur-xl"
          >
            {/* Luminous Animated Beams between sequential nodes */}
            {seriesList.length >= 2 && (
              <AnimatedBeam
                containerRef={containerRef}
                fromRef={nodeRef1}
                toRef={nodeRef2}
                curvature={-15}
                duration={3.5}
                gradientStartColor="#E51A31"
                gradientStopColor="#00B4D8"
              />
            )}
            {seriesList.length >= 3 && (
              <AnimatedBeam
                containerRef={containerRef}
                fromRef={nodeRef2}
                toRef={nodeRef3}
                curvature={15}
                duration={4.2}
                delay={0.5}
                gradientStartColor="#00B4D8"
                gradientStopColor="#E51A31"
              />
            )}
            {seriesList.length >= 4 && (
              <AnimatedBeam
                containerRef={containerRef}
                fromRef={nodeRef3}
                toRef={nodeRef4}
                curvature={-15}
                duration={5}
                delay={1}
                gradientStartColor="#E51A31"
                gradientStopColor="#10B981"
              />
            )}

            {/* Road Nodes Grid */}
            <div className="relative z-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5 items-stretch">
              {seriesList.map((series, idx) => {
                const isSelected = selectedSeriesId === series.id;
                const isUnlocked = series.status !== "LOCKED";
                const isCurrent = series.status === "UNLOCKED" && idx === 0;

                // Assign refs to the first 4 nodes for beam calculations
                const nodeRef =
                  idx === 0
                    ? nodeRef1
                    : idx === 1
                    ? nodeRef2
                    : idx === 2
                    ? nodeRef3
                    : idx === 3
                    ? nodeRef4
                    : undefined;

                return (
                  <motion.div
                    key={series.id}
                    ref={nodeRef}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    onClick={() => setSelectedSeriesId(series.id)}
                    className={`relative cursor-pointer rounded-3xl border p-5 transition-all flex flex-col justify-between ${
                      isSelected
                        ? "border-primary bg-card shadow-xl ring-2 ring-primary/40"
                        : isUnlocked
                        ? "border-border/80 bg-card/80 hover:border-primary/50 hover:bg-card"
                        : "border-border/40 bg-muted/20 opacity-75 hover:opacity-90"
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
                        <Badge variant="outline" className="border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                          Débloquée
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px] text-muted-foreground gap-1">
                          <Lock className="h-2.5 w-2.5" /> Verrouillée
                        </Badge>
                      )}
                    </div>

                    {/* Milestone Node Body */}
                    <div className="space-y-2 py-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-xs transition-transform ${
                            isSelected
                              ? "bg-primary text-primary-foreground scale-105"
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

                      <div className="pt-2">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-primary">
                          🎯 {series.targetNclc}
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
                );
              })}
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

                  {/* Primary CTA */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
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
                  </div>
                </div>

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
                      <Button disabled variant="outline" className="w-full gap-2 text-muted-foreground">
                        <Lock className="h-4 w-4" />
                        <span>{series.unlockCondition || "Verrouillée"}</span>
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
