"use client";

import { useState } from "react";
import { AnswerResult, ExerciseDetail, TapWordsData } from "@/lib/api";

interface TapWordsProps {
  exercise: ExerciseDetail;
  feedback: AnswerResult | null;
  onSelect: (answer: string) => void;
}

/** Tap-the-words prompt: tap the correct target words in order (Sound / Which means). */
export function TapWords({ exercise, feedback, onSelect }: TapWordsProps) {
  let data: TapWordsData = { type: "tap_words", prompt: "", sentence: "", correct: [] };
  try {
    data =
      typeof exercise.exercise_data === "string"
        ? JSON.parse(exercise.exercise_data)
        : exercise.exercise_data;
  } catch (e) {
    console.error("Failed to parse TapWords data:", e);
  }

  const correct = data.correct ?? [];
  const [tokens] = useState<string[]>(() => {
    const items = [...correct];
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  });
  const [chosen, setChosen] = useState<string[]>([]);

  const toggle = (token: string) => {
    if (feedback) return;
    const next = chosen.includes(token) ? chosen.filter((t) => t !== token) : [...chosen, token];
    setChosen(next);
    onSelect(next.join(" "));
  };

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center">
      <h2 className="text-xl sm:text-2xl text-center font-extrabold text-[#4B4B4B]">{data.prompt}</h2>

      {/* Reference sentence (target language) shown above the word bank */}
      <p className="mt-6 text-xl font-bold text-[#777777]">{data.sentence}</p>

      {/* Word bank */}
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {tokens.map((token, i) => {
          const active = chosen.includes(token);
          const isCorrect = feedback && active;
          const isWrong = feedback && active && !feedback.is_correct;
          return (
            <button
              key={`${token}-${i}`}
              type="button"
              disabled={!!feedback}
              onClick={() => toggle(token)}
              className={`rounded-2xl border-2 border-b-4 px-5 py-3 text-lg font-extrabold transition-all ${
                isCorrect
                  ? "border-green-500 bg-green-100 text-green-700"
                  : isWrong
                    ? "border-red-500 bg-red-100 text-red-700 animate-shake"
                    : active
                      ? "border-[#84D8FF] bg-[#DDF4FF] text-[#1CB0F6] shadow-[0_2px_0_#84D8FF] translate-y-[2px]"
                      : "border-[#E5E5E5] bg-white text-[#4B4B4B] hover:bg-[#F7F7F7]"
              }`}
            >
              {token}
            </button>
          );
        })}
      </div>

      {/* Built answer row */}
      <div className="mt-8 flex min-h-[52px] flex-wrap justify-center gap-2">
        {chosen.map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="rounded-2xl border-2 border-[#E5E5E5] bg-white px-3 py-2 font-bold text-[#58CC02]"
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}