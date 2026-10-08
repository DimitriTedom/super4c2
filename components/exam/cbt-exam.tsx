"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, FileText, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExamSession } from "@/hooks/use-exam-session";
import type { ExamSeriesData } from "@/lib/exam/types";
import { ExamHeader } from "./exam-header";
import { ExamResultSummary } from "./exam-result-summary";
import { ExamSplitLayout } from "./exam-split-layout";
import { AudioPlayerCBT } from "./audio-player-cbt";
import { QuestionNavGrid } from "./question-nav-grid";
import { QuestionPanel } from "./question-panel";
import { cn } from "@/lib/utils";

const DISCIPLINE_LABEL = { CE: "Compréhension écrite", CO: "Compréhension orale" } as const;

type FontSizeLevel = "sm" | "base" | "lg" | "xl";

const FONT_SIZE_CLASSES: Record<FontSizeLevel, string> = {
  sm: "text-sm leading-relaxed",
  base: "text-base leading-relaxed sm:text-lg sm:leading-loose",
  lg: "text-lg leading-relaxed sm:text-xl sm:leading-loose",
  xl: "text-xl leading-loose sm:text-2xl sm:leading-loose",
};

function getDocumentNature(questionNumber: number) {
  if (questionNumber <= 6) return "Annonce publique / Message du quotidien (A1)";
  if (questionNumber <= 12) return "Consigne officielle / Offre / Dépliant pratique (A2)";
  if (questionNumber <= 18) return "Note administrative / Article d'information (B1)";
  if (questionNumber <= 28) return "Article de presse / Enquête socio-économique (B2 • NCLC 7)";
  if (questionNumber <= 35) return "Chronique d'analyse / Essai critique (C1)";
  return "Texte philosophique & littéraire / Débat d'idées (C2)";
}

export function CbtExam({ series }: { series: ExamSeriesData }) {
  const s = useExamSession(series);
  const [fontSize, setFontSize] = useState<FontSizeLevel>("base");

  // Keyboard shortcuts: A-D select, arrows navigate, F flags.
  useEffect(() => {
    if (s.finished) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toUpperCase();
      if (k === "A" || k === "B" || k === "C" || k === "D") s.select(k);
      else if (k === "F") s.toggleFlag();
      else if (e.key === "ArrowRight") s.next();
      else if (e.key === "ArrowLeft") s.prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!s.hydrated) {
    return (
      <div className="flex h-screen items-center justify-center space-x-3 bg-background">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="font-medium text-muted-foreground">Chargement de l&apos;épreuve officielle...</span>
      </div>
    );
  }

  const current = s.answers[s.question.id];

  const goToFirstUnanswered = () => {
    const idx = series.questions.findIndex((q) => !s.answers[q.id]?.selected);
    if (idx !== -1) s.goTo(idx);
  };

  const increaseFontSize = () => {
    if (fontSize === "sm") setFontSize("base");
    else if (fontSize === "base") setFontSize("lg");
    else if (fontSize === "lg") setFontSize("xl");
  };

  const decreaseFontSize = () => {
    if (fontSize === "xl") setFontSize("lg");
    else if (fontSize === "lg") setFontSize("base");
    else if (fontSize === "base") setFontSize("sm");
  };

  if (s.finished && s.result) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <ExamHeader
          title={series.title}
          discipline={DISCIPLINE_LABEL[series.discipline]}
          remaining={s.remaining}
          unanswered={s.stats.unanswered}
          flagged={s.stats.flagged}
          total={series.questions.length}
          disabled={s.finished}
          onFinish={s.finish}
          onGoToFirstUnanswered={goToFirstUnanswered}
        />
        <main className="flex-1 pb-16">
          <ExamResultSummary
            result={s.result}
            questions={series.questions}
            answers={s.answers}
            onRestart={s.restart}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <ExamHeader
        title={series.title}
        discipline={DISCIPLINE_LABEL[series.discipline]}
        remaining={s.remaining}
        unanswered={s.stats.unanswered}
        flagged={s.stats.flagged}
        total={series.questions.length}
        disabled={s.finished}
        onFinish={s.finish}
        onGoToFirstUnanswered={goToFirstUnanswered}
      />

      <ExamSplitLayout
        left={
          series.discipline === "CO" ? (
            <div className="flex h-full items-center">
                <AudioPlayerCBT
                  key={s.question.id}
                  src={s.question.audioUrl}
                  fallbackText={s.question.audioTranscript}
                  played={!!s.played[s.question.id]}
                  onPlayed={() => s.markPlayed(s.question.id)}
                />
              </div>
            ) : (
              <div className="mx-auto flex h-full max-w-2xl flex-col space-y-4">
                {/* Document Top Bar with Controls */}
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                    <FileText className="h-4 w-4 text-primary" />
                    <span>{getDocumentNature(s.question.questionNumber)}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-muted-foreground mr-1 hidden sm:inline">Taille du texte :</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={decreaseFontSize}
                      disabled={fontSize === "sm"}
                      title="Diminuer la police"
                    >
                      <ZoomOut className="h-3.5 w-3.5" />
                    </Button>
                    <button
                      type="button"
                      onClick={() => setFontSize("base")}
                      className="px-1.5 py-0.5 text-xs font-mono font-medium text-muted-foreground hover:text-foreground"
                      title="Taille standard (100%)"
                    >
                      {fontSize === "sm" ? "85%" : fontSize === "base" ? "100%" : fontSize === "lg" ? "115%" : "130%"}
                    </button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={increaseFontSize}
                      disabled={fontSize === "xl"}
                      title="Agrandir la police"
                    >
                      <ZoomIn className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Authentic Document Card */}
                <div className="flex-1 rounded-2xl border bg-card p-6 sm:p-8 shadow-sm">
                  <article
                    className={cn(
                      "select-text whitespace-pre-line font-sans text-foreground transition-all",
                      FONT_SIZE_CLASSES[fontSize],
                    )}
                  >
                    {s.question.documentText}
                  </article>
                </div>
              </div>
            )
          }
          right={
            <div className="space-y-8">
              <QuestionPanel
                question={s.question}
                index={s.current}
                total={s.stats.total}
                selected={current?.selected}
                flagged={current?.flagged ?? false}
                onSelect={s.select}
                onToggleFlag={s.toggleFlag}
              />
              <div className="mx-auto flex max-w-xl justify-between pt-2">
                <Button
                  variant="outline"
                  onClick={s.prev}
                  disabled={s.current === 0}
                  className="font-medium"
                >
                  <ChevronLeft className="mr-1 h-4 w-4" aria-hidden /> Question précédente
                </Button>
                <Button
                  onClick={s.next}
                  disabled={s.current === s.stats.total - 1}
                  className="font-semibold"
                >
                  Question suivante <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
                </Button>
              </div>
            </div>
          }
          footer={
            <QuestionNavGrid
              questions={series.questions}
              answers={s.answers}
              current={s.current}
              filter={s.filter}
              onFilter={s.setFilter}
              onSelect={s.goTo}
            />
          }
        />
    </div>
  );
}
