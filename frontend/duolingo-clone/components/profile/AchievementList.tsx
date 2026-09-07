"use client";

import { AchievementItem } from "@/lib/api";

/** Achievement list: icon + title/description, with unlock state and progress. */
export function AchievementList({ achievements }: { achievements: AchievementItem[] }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-extrabold text-[#4B4B4B]">Achievements</h2>
      <div className="flex flex-col gap-3">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className={`border-2 rounded-2xl p-4 flex items-center justify-between gap-4 transition-all ${
              ach.unlocked ? "border-amber-300 bg-amber-50/40" : "border-[#E5E5E5] bg-white opacity-80"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-2xl ${
                  ach.unlocked
                    ? "bg-amber-400 text-white shadow-sm"
                    : "bg-gray-100 text-gray-400 border border-gray-200"
                }`}
              >
                {ach.icon || "🏆"}
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base text-[#4B4B4B]">{ach.title}</span>
                <span className="text-xs font-bold text-[#777777]">{ach.description}</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="text-xs font-extrabold text-[#777777]">
                {ach.progress} / {ach.max_progress}
              </span>
              {ach.unlocked && (
                <span className="text-xs font-extrabold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                  Unlocked
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}