"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ExerciseView } from "@/components/lesson/ExerciseView";
import { LessonFooter } from "@/components/lesson/LessonFooter";
import { LessonErrorScreen } from "@/components/lesson/LessonErrorScreen";
import { LessonHeader } from "@/components/lesson/LessonHeader";
import { LessonCompleteScreen, OutOfHeartsScreen } from "@/components/lesson/LessonEndScreens";
import { useLessonPlayer } from "@/hooks/useLessonPlayer";

function LessonPlayer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lessonId = Number(searchParams.get("id"));
  const validId = Number.isFinite(lessonId) && lessonId > 0;

  const { phase, lesson, hearts, selected, feedback, result, submitting, exercise, progress, check, advance, setSelected } =
    useLessonPlayer({ lessonId, validId });

  if (phase === "complete" && result) {
    return <LessonCompleteScreen result={result} onContinue={() => router.push("/")} />;
  }

  if (phase === "outOfHearts") {
    return <OutOfHeartsScreen onExit={() => router.push("/")} />;
  }

  if (phase === "error" || !validId) {
    return <LessonErrorScreen onExit={() => router.push("/")} />;
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

  const correctText = feedback ? String(feedback.correct_answer ?? "") : "";

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <LessonHeader progress={progress} hearts={hearts} onExit={() => router.push("/")} />

      <main className="flex flex-1 justify-center px-4 pb-40 pt-4 sm:px-6">
        <div className="w-full max-w-2xl">
          <ExerciseView
            exercise={exercise}
            selected={selected}
            feedback={feedback}
            onSelect={setSelected}
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