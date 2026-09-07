"use client";

import { useState } from "react";
import { AnswerResult, ExerciseDetail, TypeAnswerData } from "@/lib/api";

interface TypeAnswerProps {
  exercise: ExerciseDetail;
  selected?: unknown;
  feedback: AnswerResult | null;
  onSelect: (answer: string) => void;
}

/** Type-the-answer prompt: a free-text input the learner fills in. */
export function TypeAnswer({ exercise, feedback, onSelect }: TypeAnswerProps) {
  let data: TypeAnswerData = { type: "type_answer", prompt: "", correct: [] };
  try {
    data =
      typeof exercise.exercise_data === "string"
        ? JSON.parse(exercise.exercise_data)
        : exercise.exercise_data;
  } catch (e) {
    console.error("Failed to parse TypeAnswer data:", e);
  }

  const [value, setValue] = useState<string>("");

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center">
      <h2 className="text-xl sm:text-2xl text-center font-extrabold text-[#4B4B4B]">
        {data.prompt}
      </h2>

      <input
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onSelect(e.target.value);
        }}
        disabled={!!feedback}
        placeholder="Type here…"
        autoFocus
        className={`mt-10 w-full max-w-md rounded-2xl border-2 border-b-4 px-5 py-4 text-center text-2xl font-extrabold text-[#4B4B4B] outline-none transition-colors placeholder:text-[#AFAFAF] ${
          !feedback
            ? "border-[#E5E5E5] focus:border-[#84D8FF] focus:bg-[#DDF4FF]"
            : feedback.is_correct
              ? "border-green-500 bg-green-100 text-green-700"
              : "border-red-500 bg-red-100 text-red-700 animate-shake"
        }`}
      />
    </div>
  );
}