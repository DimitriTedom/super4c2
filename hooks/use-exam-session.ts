"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { computeResult } from "@/lib/exam/scoring";
import type {
  AnswersMap,
  ExamResult,
  ExamSeriesData,
  NavFilter,
  OptionKey,
} from "@/lib/exam/types";

interface PersistedSession {
  deadline: number; // epoch ms
  answers: AnswersMap;
  current: number;
  finished: boolean;
  played?: Record<string, boolean>;
}

const storageKey = (seriesId: string, discipline: string) =>
  `super4c2:exam:${seriesId}:${discipline}`;

/**
 * CBT session state: answers, flags, navigation, a deadline-based countdown
 * (robust to refresh / tab throttling) and localStorage autosave.
 */
export function useExamSession(series: ExamSeriesData) {
  const key = storageKey(series.id, series.discipline);
  const [hydrated, setHydrated] = useState(false);
  const [answers, setAnswers] = useState<AnswersMap>({});
  const [current, setCurrent] = useState(0);
  const [finished, setFinished] = useState(false);
  const [deadline, setDeadline] = useState<number>(0);
  const [remaining, setRemaining] = useState(series.durationSeconds);
  const [filter, setFilter] = useState<NavFilter>("all");
  const finishedRef = useRef(false);
  const [played, setPlayed] = useState<Record<string, boolean>>({});

  // Hydrate from localStorage (or start a fresh session).
  useEffect(() => {
    let state: PersistedSession | null = null;
    try {
      const raw = localStorage.getItem(key);
      if (raw) state = JSON.parse(raw) as PersistedSession;
    } catch {
      state = null;
    }
    if (state) {
      setAnswers(state.answers);
      setCurrent(Math.min(state.current, series.questions.length - 1));
      setFinished(state.finished);
      finishedRef.current = state.finished;
      setDeadline(state.deadline);
      setPlayed(state.played ?? {});
    } else {
      setDeadline(Date.now() + series.durationSeconds * 1000);
    }
    setHydrated(true);
  }, [key, series.durationSeconds, series.questions.length]);

  // Autosave.
  useEffect(() => {
    if (!hydrated) return;
    const payload: PersistedSession = { deadline, answers, current, finished, played };
    try {
      localStorage.setItem(key, JSON.stringify(payload));
    } catch {
      /* storage full / unavailable: keep going in memory */
    }
  }, [hydrated, key, deadline, answers, current, finished, played]);

  const finish = useCallback(() => {
    finishedRef.current = true;
    setFinished(true);
    const res = computeResult(series.questions, answers, series.discipline);
    void fetch("/api/exam/attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        discipline: series.discipline === "CO" ? "COMPREHENSION_ORALE" : "COMPREHENSION_ECRITE",
        seriesId: series.id,
        rawScore: res.rawScore,
        tcfScaledScore: res.tcfScaledScore,
        nclcLevel: res.nclcLevel,
        crsPointsUnlocked: res.nclcLevel >= 7 ? 50 : 0,
        answers,
        feedback: res,
      }),
    }).catch(() => {});
  }, [answers, series]);

  // Countdown from absolute deadline; auto-submit at 00:00.
  useEffect(() => {
    if (!hydrated || finished) return;
    const tick = () => {
      const left = Math.max(0, Math.round((deadline - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0 && !finishedRef.current) finish();
    };
    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [hydrated, finished, deadline, finish]);

  const question = series.questions[current];

  const select = useCallback(
    (option: OptionKey) => {
      if (finished) return;
      setAnswers((prev) => ({
        ...prev,
        [question.id]: { flagged: prev[question.id]?.flagged ?? false, selected: option },
      }));
    },
    [finished, question.id],
  );

  const toggleFlag = useCallback(() => {
    if (finished) return;
    setAnswers((prev) => ({
      ...prev,
      [question.id]: {
        selected: prev[question.id]?.selected,
        flagged: !(prev[question.id]?.flagged ?? false),
      },
    }));
  }, [finished, question.id]);

  const goTo = useCallback(
    (index: number) =>
      setCurrent(Math.max(0, Math.min(index, series.questions.length - 1))),
    [series.questions.length],
  );

  const stats = useMemo(() => {
    const answered = series.questions.filter((q) => answers[q.id]?.selected).length;
    const flagged = series.questions.filter((q) => answers[q.id]?.flagged).length;
    return {
      answered,
      flagged,
      unanswered: series.questions.length - answered,
      total: series.questions.length,
    };
  }, [answers, series.questions]);

  const result: ExamResult | null = useMemo(
    () => (finished ? computeResult(series.questions, answers, series.discipline) : null),
    [finished, series.questions, series.discipline, answers],
  );

  const restart = useCallback(() => {
    localStorage.removeItem(key);
    finishedRef.current = false;
    setAnswers({});
    setCurrent(0);
    setFinished(false);
    setFilter("all");
    setPlayed({});
    setDeadline(Date.now() + series.durationSeconds * 1000);
  }, [key, series.durationSeconds]);

  return {
    hydrated,
    question,
    current,
    answers,
    remaining,
    finished,
    stats,
    result,
    filter,
    setFilter,
    select,
    toggleFlag,
    goTo,
    next: () => goTo(current + 1),
    prev: () => goTo(current - 1),
    finish,
    restart,
    played,
    markPlayed: (id: string) => setPlayed((p) => ({ ...p, [id]: true })),
  };
}
