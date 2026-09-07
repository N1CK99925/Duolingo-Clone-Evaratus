"use client";

import { useState } from "react";
import { AnswerResult, ExerciseDetail, WordMatchData, WordPair } from "@/lib/api";

interface WordMatchProps {
  exercise: ExerciseDetail;
  selected?: unknown;
  feedback: AnswerResult | null;
  onSelect: (matches: Record<string, string>) => void;
}

export function WordMatch({
  exercise,
  feedback,
  onSelect,
}: WordMatchProps) {
  let data: WordMatchData = { type: "word_match", prompt: "", pairs: [] };
  try {
    data = typeof exercise.exercise_data === "string" ? JSON.parse(exercise.exercise_data) : exercise.exercise_data;
  } catch (e) {
    console.error("Failed to parse WordMatch data:", e);
  }

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [userPairs, setUserPairs] = useState<Record<string, string>>({});
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);

  // Derive columns: left column matches seed order, right column is shuffled
  const leftItems = (data.pairs || []).map((p: WordPair) => p.hindi);
  const [rightItems] = useState<string[]>(() => {
    const rights = (data.pairs || []).map((p: WordPair) => p.english);
    // Simple deterministic shuffle array
    return [...rights].sort(() => Math.random() - 0.5);
  });

  const handleLeftClick = (item: string) => {
    if (matchedPairs.includes(item) || feedback) return;
    setSelectedLeft(item);
  };

  const handleRightClick = (item: string) => {
    if (feedback || !selectedLeft) return;
    const isRightMatched = Object.values(userPairs).includes(item);
    if (isRightMatched) return;

    const newPairs = { ...userPairs, [selectedLeft]: item };
    const newMatched = [...matchedPairs, selectedLeft];
    
    setUserPairs(newPairs);
    setMatchedPairs(newMatched);
    setSelectedLeft(null);

    if (newMatched.length === data.pairs.length) {
      onSelect(newPairs);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {data.prompt || "Tap the matching pairs"}
      </h2>

      <div className="grid grid-cols-2 gap-4 w-full">
        {/* Left Column (Hindi) */}
        <div className="flex flex-col gap-3">
          {leftItems.map((leftText: string) => {
            const isMatched = matchedPairs.includes(leftText);
            const isSelected = selectedLeft === leftText;

            return (
              <button
                key={leftText}
                disabled={isMatched || !!feedback}
                onClick={() => handleLeftClick(leftText)}
                className={`w-full py-4 px-4 rounded-2xl border-2 border-b-4 font-bold text-lg transition-all ${
                  isMatched
                    ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed border-b-2"
                    : isSelected
                    ? "bg-sky-100 border-sky-400 text-sky-600 border-b-4 translate-y-[-2px]"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 active:translate-y-[2px]"
                }`}
              >
                {leftText}
              </button>
            );
          })}
        </div>

        {/* Right Column (English) */}
        <div className="flex flex-col gap-3">
          {rightItems.map((rightText: string) => {
            const isMatched = Object.values(userPairs).includes(rightText);

            return (
              <button
                key={rightText}
                disabled={isMatched || !!feedback}
                onClick={() => handleRightClick(rightText)}
                className={`w-full py-4 px-4 rounded-2xl border-2 border-b-4 font-bold text-lg transition-all ${
                  isMatched
                    ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed border-b-2"
                    : selectedLeft
                    ? "bg-white border-sky-300 text-gray-700 hover:bg-sky-50 active:translate-y-[2px]"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 active:translate-y-[2px]"
                }`}
              >
                {rightText}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
