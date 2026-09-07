"use client";

import { api, AnswerResult, LessonAnswer, LessonCompleteResult, LessonDetail, UserSummary } from "@/lib/api";
import { playSound } from "@/lib/sound";
import { useCallback, useEffect, useRef, useState } from "react";

export type LessonPhase = "loading" | "complete" | "outOfHearts" | "error";

interface UseLessonPlayerOptions {
  lessonId: number;
  validId: boolean;
}

/** VS3 lesson player state machine: load exercises, check answers, advance or finish. */
export function useLessonPlayer({ lessonId, validId }: UseLessonPlayerOptions) {
  const [phase, setPhase] = useState<LessonPhase>("loading");
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [idx, setIdx] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [selected, setSelected] = useState<LessonAnswer | null>(null);
  const [feedback, setFeedback] = useState<AnswerResult | null>(null);
  const [result, setResult] = useState<LessonCompleteResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const advanceRef = useRef<() => void>(() => {});

  /* Load the lesson + current hearts. */
  useEffect(() => {
    if (!validId) return;
    api.lesson(lessonId).then(setLesson).catch(() => setPhase("error"));
    api.me()
      .then((u: UserSummary) => setHearts(u.hearts))
      .catch(() => {});
  }, [lessonId, validId]);

  /* Clear any pending auto-advance on unmount. */
  useEffect(
    () => () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    },
    [],
  );

  const exercise = lesson?.exercises[idx] ?? null;
  const total = lesson?.exercises.length ?? 0;
  const progress = total > 0 ? (idx + (feedback ? 1 : 0)) / total : 0;

  /** Move to the next exercise, or finish the lesson (complete / out of hearts). */
  const advance = useCallback(() => {
    if (!lesson || !feedback) return;
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
    if (feedback.is_out_of_hearts) {
      setPhase("outOfHearts");
      return;
    }
    if (idx + 1 >= lesson.exercises.length) {
      api
        .completeLesson(lesson.id)
        .then((res) => {
          playSound("/assets/audio/completeLesson.mp3");
          setResult(res);
          setPhase("complete");
        })
        .catch(() => setPhase("error"));
      return;
    }
    setIdx(idx + 1);
    setSelected(null);
    setFeedback(null);
  }, [lesson, feedback, idx]);

  /* Keep the auto-advance timer pointed at the freshest advance(). */
  useEffect(() => {
    advanceRef.current = advance;
  });

  const check = useCallback(async () => {
    if (!lesson || !exercise || selected === null || feedback || submitting) return;
    setSubmitting(true);
    try {
      const res = await api.submitAnswer(lesson.id, exercise.id, selected);
      playSound(res.is_correct ? "/assets/audio/correct.mp3" : "/assets/audio/incorrect.mp3");
      setFeedback(res);
      setHearts(res.current_hearts);
      // Duolingo behavior: correct answers auto-advance; running dry shows the fail screen.
      if (res.is_out_of_hearts) {
        advanceTimer.current = setTimeout(() => advanceRef.current(), 1400);
      } else if (res.is_correct) {
        advanceTimer.current = setTimeout(() => advanceRef.current(), 1100);
      }
    } catch (err) {
      console.error(err);
      setPhase("error");
    } finally {
      setSubmitting(false);
    }
  }, [lesson, exercise, selected, feedback, submitting]);

  /* Keyboard: number keys pick options (for multiple_choice / fill_blank), Enter checks/continues. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      let data: { choices?: string[]; options?: string[] } = {};
      try {
        data =
          typeof exercise?.exercise_data === "string"
            ? JSON.parse(exercise.exercise_data)
            : exercise?.exercise_data || {};
      } catch {}
      const choices = data.choices || data.options || [];
      const count = choices.length;
      const n = Number.parseInt(e.key, 10);
      if (!feedback && n >= 1 && n <= count) setSelected(n - 1);
      if (e.key === "Enter") {
        if (feedback) advanceRef.current();
        else void check();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [exercise, feedback, check]);

  return {
    phase,
    lesson,
    hearts,
    selected,
    feedback,
    result,
    submitting,
    exercise,
    progress,
    check,
    advance,
    setSelected,
  };
}