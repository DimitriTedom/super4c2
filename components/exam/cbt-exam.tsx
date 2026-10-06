"use client";

import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExamSession } from "@/hooks/use-exam-session";
import type { ExamSeriesData } from "@/lib/exam/types";
import { ExamHeader } from "./exam-header";
import { ExamResultSummary } from "./exam-result-summary";
import { ExamSplitLayout } from "./exam-split-layout";
import { AudioPlayerCBT } from "./audio-player-cbt";
import { QuestionNavGrid } from "./question-nav-grid";
import { QuestionPanel } from "./question-panel";

const DISCIPLINE_LABEL = { CE: "Compréhension écrite", CO: "Compréhension orale" } as const;

export function CbtExam({ series }: { series: ExamSeriesData }) {
  const s = useExamSession(series);

  // Keyboard: A-D select, arrows navigate, F flags.
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
    return <div className="flex h-screen items-center justify-center">Chargement…</div>;
  }

  const current = s.answers[s.question.id];

  return (
    <div className="flex h-screen flex-col bg-background">
      <ExamHeader
        title={series.title}
        discipline={DISCIPLINE_LABEL[series.discipline]}
        remaining={s.remaining}
        unanswered={s.stats.unanswered}
        flagged={s.stats.flagged}
        disabled={s.finished}
        onFinish={s.finish}
      />

      {s.finished && s.result ? (
        <div className="flex-1 overflow-y-auto">
          <ExamResultSummary
            result={s.result}
            questions={series.questions}
            answers={s.answers}
            onRestart={s.restart}
          />
        </div>
      ) : (
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
              <article className="mx-auto max-w-prose whitespace-pre-line font-sans text-base leading-relaxed">
                {s.question.documentText}
              </article>
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
              <div className="mx-auto flex max-w-xl justify-between">
                <Button variant="outline" onClick={s.prev} disabled={s.current === 0}>
                  <ChevronLeft className="mr-1 h-4 w-4" aria-hidden /> Précédente
                </Button>
                <Button onClick={s.next} disabled={s.current === s.stats.total - 1}>
                  Suivante <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
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
      )}
    </div>
  );
}
