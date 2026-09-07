"use client";

import {
  api,
  AnswerResult,
  LessonCompleteResult,
  LessonDetail,
  UserSummary,
} from "@/lib/api";
import { LessonHeader } from "@/components/lesson/LessonHeader";
import { MultipleChoice } from "@/components/lesson/MultipleChoice";
import { LessonFooter } from "@/components/lesson/LessonFooter";
import { LessonCompleteScreen, OutOfHeartsScreen } from "@/components/lesson/LessonEndScreens";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";

type Phase = "loading" | "complete" | "outOfHearts" | "error";

/** VS2 lesson player: multiple-choice exercises, hearts, feedback bar, completion. */
function LessonPlayer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lessonId = Number(searchParams.get("id"));
  const validId = Number.isFinite(lessonId) && lessonId > 0;

  const [phase, setPhase] = useState<Phase>("loading");
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [idx, setIdx] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [selected, setSelected] = useState<number | null>(null);
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

  /* Keyboard: number keys pick options, Enter checks/continues. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const count = exercise?.exercise_data.choices?.length ?? 0;
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

  if (phase === "complete" && result) {
    return <LessonCompleteScreen result={result} onContinue={() => router.push("/")} />;
  }

  if (phase === "outOfHearts") {
    return <OutOfHeartsScreen onExit={() => router.push("/")} />;
  }

  if (phase === "error" || !validId) {
    return (
      <LessonErrorScreen onExit={() => router.push("/")} />
    );
  }

  if (!lesson) {
    return (
      <div className="flex min-h-dvh items-center justify-center font-bold text-[#777777]">
        Loading lesson…
      </div>
    );
  }

  if (!exercise) {
    return <LessonErrorScreen onExit={() => router.push("/")} />;
  }

  const correctText = feedback
    ? (exercise.exercise_data.choices?.[Number(feedback.correct_answer)] ?? "")
    : "";

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <LessonHeader progress={progress} hearts={hearts} onExit={() => router.push("/")} />

      <main className="flex flex-1 justify-center px-4 pb-40 pt-4 sm:px-6">
        <div className="w-full max-w-2xl">
          <MultipleChoice
            exercise={exercise}
            selected={selected}
            feedback={feedback}
            onSelect={(i) => {
              if (!feedback) setSelected(i);
            }}
          />
        </div>
      </main>

      <LessonFooter
        hasSelection={selected !== null}
        feedback={feedback}
        correctText={correctText}
        submitting={submitting}
        onCheck={() => void check()}
        onContinue={advance}
      />
    </div>
  );
}

function LessonErrorScreen({ onExit }: { onExit: () => void }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 p-6 text-center">
      <img
        src="/assets/mascot/Learning%20how%20to%20animate.svg"
        alt="Duo"
        className="h-40"
      />
      <p className="font-extrabold text-[#4B4B4B]">Couldn&apos;t load the lesson.</p>
      <button className="btn-primary" onClick={onExit}>
        Back to path
      </button>
    </div>
  );
}

export default function LessonPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center font-bold text-[#777777]">
          Loading lesson…
        </div>
      }
    >
      <LessonPlayer />
    </Suspense>
  );
}
