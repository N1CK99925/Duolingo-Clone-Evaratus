"use client";

import { AnswerResult, ExerciseDetail, FillBlankData } from "@/lib/api";

interface FillBlankProps {
  exercise: ExerciseDetail;
  selected: number | null;
  feedback: AnswerResult | null;
  onSelect: (index: number) => void;
}

export function FillBlank({
  exercise,
  selected,
  feedback,
  onSelect,
}: FillBlankProps) {
  let data: FillBlankData = { type: "fill_blank", prompt: "", sentence: "", choices: [], correct_index: 0 };
  try {
    data = typeof exercise.exercise_data === "string" ? JSON.parse(exercise.exercise_data) : exercise.exercise_data;
  } catch (e) {
    console.error("Failed to parse FillBlank data:", e);
  }

  // Break sentence by ___ placeholder
  const parts = data.sentence ? data.sentence.split("___") : ["", ""];
  const selectedWord = selected !== null && data.choices ? data.choices[selected] : null;

  return (
    <div className="w-full max-w-xl mx-auto px-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
        {data.prompt || "Complete the sentence"}
      </h2>

      {/* Sentence container with filled-in word tile preview */}
      <div className="flex items-center flex-wrap justify-center gap-2 text-2xl font-semibold text-gray-800 bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 mb-12 min-h-[100px] w-full">
        <span>{parts[0]}</span>
        <span
          className={`inline-flex items-center justify-center min-w-[80px] h-[48px] px-4 rounded-xl border-2 font-bold text-xl transition-all ${
            selectedWord
              ? "bg-sky-100 border-sky-400 text-sky-600 border-b-4"
              : "bg-white border-dashed border-gray-300 text-transparent"
          }`}
        >
          {selectedWord || "___"}
        </span>
        <span>{parts[1]}</span>
      </div>

      {/* Options Grid / Tile Bank */}
      <div className="flex flex-wrap gap-3 justify-center w-full">
        {(data.choices || []).map((option: string, index: number) => {
          const isSelected = selected === index;

          let btnStyle = "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 active:translate-y-[2px]";
          if (isSelected) {
            btnStyle = "bg-sky-100 border-sky-400 text-sky-600 border-b-4 translate-y-[-2px]";
          }

          if (feedback && isSelected) {
            if (feedback.is_correct) {
              btnStyle = "bg-green-100 border-green-500 text-green-700 border-b-4";
            } else {
              btnStyle = "bg-red-100 border-red-500 text-red-700 border-b-4";
            }
          }

          return (
            <button
              key={index}
              disabled={!!feedback}
              onClick={() => onSelect(index)}
              className={`py-3 px-6 rounded-2xl border-2 border-b-4 font-bold text-lg transition-all ${btnStyle}`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
