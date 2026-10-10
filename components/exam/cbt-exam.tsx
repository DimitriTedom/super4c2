"use client";

import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useExamSession } from "@/hooks/use-exam-session";
import type { ExamSeriesData } from "@/lib/exam/types";
import { ExamHeader } from "./exam-header";
import { ExamResultSummary } from "./exam-result-summary";
import { ExamSplitLayout } from "./exam-split-layout";
import { AudioPlayerCBT } from "./audio-player-cbt";
import { QuestionNavGrid } from "./question-nav-grid";
import { QuestionPanel } from "./question-panel";
import { CeDocumentViewer } from "./ce-document-viewer";

const DISCIPLINE_LABEL = { CE: "Compréhension écrite", CO: "Compréhension orale" } as const;

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
  }, [s.finished, s.select, s.toggleFlag, s.next, s.prev]);

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
          mode={s.mode}
        />
        <main className="flex-1 pb-16">
          <ExamResultSummary
            result={s.result}
            questions={series.questions}
            answers={s.answers}
            onRestart={s.restart}
            discipline={series.discipline}
            seriesId={series.id}
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
        mode={s.mode}
        onToggleMode={() => s.setMode(s.mode === "exam" ? "practice" : "exam")}
        isTimerPaused={s.isTimerPaused}
        onTogglePauseTimer={s.togglePauseTimer}
      />

      <ExamSplitLayout
        left={
          series.discipline === "CO" ? (
            <div className="mx-auto flex h-full max-w-2xl flex-col justify-center space-y-4">
              {s.question.documentImageUrl ? (
                <div className="rounded-3xl border-2 border-slate-200/90 dark:border-border bg-white dark:bg-card p-5 sm:p-6 shadow-md flex flex-col space-y-4">
                  <div className="flex items-center justify-between border-b pb-3">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900/50">
                      Mise en situation · Question {s.question.questionNumber}
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground font-semibold">
                      Support visuel officiel (16:9)
                    </span>
                  </div>

                  <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-inner">
                    <Image
                      src={s.question.documentImageUrl}
                      alt={`Mise en situation Question ${s.question.questionNumber}`}
                      fill
                      className="object-contain"
                      priority
                      unoptimized
                    />
                  </div>

                  <div className="pt-1">
                    <AudioPlayerCBT
                      key={s.question.id}
                      src={s.question.audioUrl}
                      fallbackText={s.question.audioTranscript}
                      played={!!s.played[s.question.id]}
                      onPlayed={() => s.markPlayed(s.question.id)}
                      mode={s.mode}
                      onReplay={s.replayAudio}
                      transcript={s.question.audioTranscript}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <AudioPlayerCBT
                    key={s.question.id}
                    src={s.question.audioUrl}
                    fallbackText={s.question.audioTranscript}
                    played={!!s.played[s.question.id]}
                    onPlayed={() => s.markPlayed(s.question.id)}
                    mode={s.mode}
                    onReplay={s.replayAudio}
                    transcript={s.question.audioTranscript}
                  />
                </div>
              )}
            </div>
          ) : (
            <CeDocumentViewer
              questionNumber={s.question.questionNumber}
              documentNature={getDocumentNature(s.question.questionNumber)}
              documentText={s.question.documentText}
              highlights={s.questionHighlights}
              onAddHighlight={s.addHighlight}
              onClearHighlights={s.clearHighlights}
            />
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
              mode={s.mode}
              revealed={s.revealed}
              onReveal={s.revealAnswer}
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
