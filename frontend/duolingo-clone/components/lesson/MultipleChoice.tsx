"use client";

import { AnswerResult, ExerciseDetail } from "@/lib/api";

interface MultipleChoiceProps {
  exercise: ExerciseDetail;
  selected: number | null;
  feedback: AnswerResult | null;
  onSelect: (index: number) => void;
}

/** Multiple-choice exercise: prompt + chunky option cards with Duolingo answer states. */
export function MultipleChoice({ exercise, selected, feedback, onSelect }: MultipleChoiceProps) {
  let data: any = {};
  try {
    data = typeof exercise.exercise_data === "string" ? JSON.parse(exercise.exercise_data) : exercise.exercise_data;
  } catch (e) {
    console.error("Failed to parse MultipleChoice data:", e);
  }
  const choices: string[] = data.choices ?? [];
  const correctIndex = data.correct_index ?? Number(feedback?.correct_answer ?? -1);

  if (choices.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-extrabold text-[#4B4B4B]">{data.prompt ?? exercise.exercise_type}</h2>
        <p className="mt-4 text-[#777777]">This exercise type isn&apos;t supported yet (VS3).</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center sm:items-start max-w-xl mx-auto">
      <h2 className="text-2xl font-extrabold text-[#4B4B4B] sm:text-3xl text-center sm:text-left w-full">
        {data.prompt ?? "Select the correct word"}
      </h2>

      {/* Target word / prompt display if choices are short or prompt has a target */}
      <div className="mt-6 mb-2 flex items-center gap-3">
        <button
          type="button"
          aria-label="Listen"
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1CB0F6] text-white shadow-[0_4px_0_#1899D6] hover:bg-[#1899D6] active:translate-y-[2px] active:shadow-[0_2px_0_#1899D6] transition-all"
        >
          <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
        </button>
        <span className="text-xl sm:text-2xl font-extrabold text-[#4B4B4B]">
          {data.prompt?.includes(":") ? "" : choices[0]?.split(" ")[0] ?? ""}
        </span>
      </div>

      <div className="mt-6 grid w-full gap-3 sm:grid-cols-2">
        {choices.map((choice, i) => {
          let cls = "border-[#E5E5E5] text-[#4B4B4B] hover:bg-[#F7F7F7] shadow-[0_4px_0_#E5E5E5]";
          if (!feedback && selected === i) {
            cls = "border-[#84D8FF] bg-[#DDF4FF] text-[#1CB0F6] shadow-[0_4px_0_#84D8FF]";
          } else if (feedback) {
            if (i === correctIndex) {
              cls = "border-[#58CC02] bg-[#D7FFB8] text-[#58A700] shadow-[0_4px_0_#58CC02]";
            } else if (i === selected && !feedback.is_correct) {
              cls = "border-[#FF4B4B] bg-[#FFDFE0] text-[#EA2B2B] shadow-[0_4px_0_#FF4B4B] animate-shake";
            } else {
              cls = "border-[#E5E5E5] text-[#4B4B4B] opacity-40 shadow-none";
            }
          }

          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              disabled={!!feedback}
              aria-label={`Option ${i + 1}`}
              className={`group relative rounded-2xl border-2 px-5 py-4 text-left font-extrabold text-lg transition-all active:translate-y-[2px] active:shadow-none ${cls}`}
            >
              <span className="block truncate hindi-text">{choice}</span>
              <span className="absolute bottom-2 right-3 flex h-5 w-5 items-center justify-center rounded border border-current text-[10px] opacity-40 tabular-nums">
                {i + 1}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
