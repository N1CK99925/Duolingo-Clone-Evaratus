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
  const data = exercise.exercise_data;
  const choices = data.choices ?? [];
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
    <div>
      <h2 className="text-2xl font-extrabold text-[#4B4B4B] sm:text-3xl">{data.prompt}</h2>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {choices.map((choice, i) => {
          let cls = "border-[#E5E5E5] text-[#4B4B4B] hover:bg-[#F7F7F7]";
          if (!feedback && selected === i) {
            cls = "border-[#84D8FF] bg-[#DDF4FF] text-[#1CB0F6]";
          } else if (feedback) {
            if (i === correctIndex) {
              cls = "border-[#58CC02] bg-[#D7FFB8] text-[#58A700]";
            } else if (i === selected && !feedback.is_correct) {
              cls = "border-[#FF4B4B] bg-[#FFDFE0] text-[#EA2B2B] animate-shake";
            } else {
              cls = "border-[#E5E5E5] text-[#4B4B4B] opacity-40";
            }
          }

          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              disabled={!!feedback}
              aria-label={`Option ${i + 1}`}
              className={`relative rounded-2xl border-2 border-b-4 px-4 py-4 pb-6 text-left font-bold transition-colors ${cls}`}
            >
              {choice}
              <span className="absolute bottom-1.5 left-3 flex h-5 w-5 items-center justify-center rounded border-2 border-current text-[10px] opacity-50">
                {i + 1}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
