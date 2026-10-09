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

export type ExamMode = "exam" | "practice";

interface PersistedSession {
  deadline: number; // epoch ms
  answers: AnswersMap;
  current: number;
  finished: boolean;
  played?: Record<string, boolean>;
  mode?: ExamMode;
  revealed?: Record<string, boolean>;
  highlights?: Record<string, string[]>;
  isTimerPaused?: boolean;
  pausedRemaining?: number;
}

const storageKey = (seriesId: string, discipline: string) =>
  `super4c2:exam:${seriesId}:${discipline}`;

/**
 * CBT session state: answers, flags, navigation, a deadline-based countdown
 * (robust to refresh / tab throttling), mode switcher (Examen strict vs Entraînement),
 * text highlights and localStorage autosave.
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

  // Advanced Practice Mode state
  const [mode, setModeState] = useState<ExamMode>("exam");
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [highlights, setHighlights] = useState<Record<string, string[]>>({});

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
      setPlayed(state.played ?? {});
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const qMode = urlParams.get("mode") as ExamMode | null;
        setModeState(qMode === "practice" || qMode === "exam" ? qMode : state.mode ?? "exam");
      } else {
        setModeState(state.mode ?? "exam");
      }
      setRevealed(state.revealed ?? {});
      setHighlights(state.highlights ?? {});
      setIsTimerPaused(state.isTimerPaused ?? false);

      if (state.isTimerPaused && state.pausedRemaining !== undefined) {
        setRemaining(state.pausedRemaining);
        setDeadline(Date.now() + state.pausedRemaining * 1000);
      } else {
        setDeadline(state.deadline);
      }
    } else {
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const qMode = urlParams.get("mode") as ExamMode | null;
        if (qMode === "practice" || qMode === "exam") {
          setModeState(qMode);
        }
      }
      setDeadline(Date.now() + series.durationSeconds * 1000);
    }
    setHydrated(true);
  }, [key, series.durationSeconds, series.questions.length]);

  // Autosave.
  useEffect(() => {
    if (!hydrated) return;
    const payload: PersistedSession = {
      deadline,
      answers,
      current,
      finished,
      played,
      mode,
      revealed,
      highlights,
      isTimerPaused,
      pausedRemaining: remaining,
    };
    try {
      localStorage.setItem(key, JSON.stringify(payload));
    } catch {
      /* storage full / unavailable: keep going in memory */
    }
  }, [hydrated, key, deadline, answers, current, finished, played, mode, revealed, highlights, isTimerPaused, remaining]);

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

  // Countdown from absolute deadline; auto-submit at 00:00 (unless paused in practice mode).
  useEffect(() => {
    if (!hydrated || finished) return;
    if (isTimerPaused) return;

    const tick = () => {
      const left = Math.max(0, Math.round((deadline - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0 && !finishedRef.current) finish();
    };
    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [hydrated, finished, deadline, finish, isTimerPaused]);

  const togglePauseTimer = useCallback(() => {
    setIsTimerPaused((prev) => {
      const next = !prev;
      if (next) {
        // Pausing: remaining is frozen
      } else {
        // Resuming: extend deadline forward by current remaining
        setDeadline(Date.now() + remaining * 1000);
      }
      return next;
    });
  }, [remaining]);

  const setMode = useCallback((newMode: ExamMode) => {
    setModeState(newMode);
    if (newMode === "exam") {
      // In strict exam mode, unpause timer
      setIsTimerPaused(false);
      setDeadline(Date.now() + remaining * 1000);
    }
  }, [remaining]);

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

  const revealAnswer = useCallback((qId: string) => {
    setRevealed((prev) => ({ ...prev, [qId]: true }));
  }, []);

  const replayAudio = useCallback((qId: string) => {
    setPlayed((prev) => {
      const next = { ...prev };
      delete next[qId];
      return next;
    });
  }, []);

  const addHighlight = useCallback((qId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length < 2) return;
    setHighlights((prev) => {
      const existing = prev[qId] || [];
      if (existing.includes(trimmed)) return prev;
      return { ...prev, [qId]: [...existing, trimmed] };
    });
  }, []);

  const removeHighlight = useCallback((qId: string, text: string) => {
    setHighlights((prev) => {
      const existing = prev[qId] || [];
      return { ...prev, [qId]: existing.filter((t) => t !== text) };
    });
  }, []);

  const clearHighlights = useCallback((qId: string) => {
    setHighlights((prev) => ({ ...prev, [qId]: [] }));
  }, []);

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
    setRevealed({});
    setHighlights({});
    setIsTimerPaused(false);
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
    // Advanced Practice Mode
    mode,
    setMode,
    isTimerPaused,
    togglePauseTimer,
    revealed: !!revealed[question.id],
    revealAnswer: () => revealAnswer(question.id),
    replayAudio: () => replayAudio(question.id),
    questionHighlights: highlights[question.id] || [],
    addHighlight: (text: string) => addHighlight(question.id, text),
    removeHighlight: (text: string) => removeHighlight(question.id, text),
    clearHighlights: () => clearHighlights(question.id),
  };
}
