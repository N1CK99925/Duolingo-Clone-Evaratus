"use client";

import { LeftSidebar } from "@/components/LeftSidebar";
import { RightRail } from "@/components/RightRail";
import { ChestIcon, BoltIcon } from "@/components/icons";
import { DailyQuest, SideQuest } from "@/lib/api";

const DAILY_QUESTS: DailyQuest[] = [
  { id: "d1", title: "Earn 10 XP", description: "Complete any lesson", icon: "⚡", progress: 0, goal: 10, xpReward: 5 },
  { id: "d2", title: "Keep your streak", description: "Log in for 1 day", icon: "🔥", progress: 0, goal: 1, xpReward: 10 },
  { id: "d3", title: "Answer 5 questions", description: "Complete exercises", icon: "🎯", progress: 0, goal: 5, xpReward: 8 },
];

const SIDE_QUESTS: SideQuest[] = [
  { id: "s1", title: "Perfect lesson", description: "Get 100% on a lesson", icon: "💯", progress: 0, goal: 1, xpReward: 20, isActive: true },
  { id: "s2", title: "Rapid fire", description: "Answer 3 in under 30s", icon: "⚡", progress: 0, goal: 3, xpReward: 15, isActive: true },
  { id: "s3", title: "Word master", description: "Match 10 word pairs", icon: "🧩", progress: 0, goal: 10, xpReward: 25, isActive: false },
];

export default function QuestsPage() {
  // Quests are client-side rendered with mocked progress; backend tracks achievements.

  return (
    <div className="flex min-h-dvh bg-white justify-center">
      <LeftSidebar />

      <main className="flex-1 max-w-2xl px-6 py-10 flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-2">
          <img
            src="/assets/quests.svg"
            alt="Quests"
            className="w-20 h-20 mb-4"
          />
          <h1 className="text-3xl font-extrabold text-[#4B4B4B]">
            Quests
          </h1>
          <p className="text-[#777777] font-bold text-sm mt-1">
            Complete quests to earn bonus XP
          </p>
        </div>

        {/* Daily Quests */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#AFAFAF]">Daily</span>
            <h2 className="text-lg font-extrabold text-[#4B4B4B]">Today&apos;s Quests</h2>
          </div>

          <div className="flex flex-col gap-3">
            {DAILY_QUESTS.map((quest) => (
              <DailyQuestCard key={quest.id} quest={quest} />
            ))}
          </div>
        </div>

        {/* Side Quests */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#AFAFAF]">Side</span>
            <h2 className="text-lg font-extrabold text-[#4B4B4B]">Side Quests</h2>
          </div>

          <div className="flex flex-col gap-3">
            {SIDE_QUESTS.map((quest) => (
              <SideQuestCard key={quest.id} quest={quest} />
            ))}
          </div>
        </div>
      </main>

      <RightRail user={null} />
    </div>
  );
}

function DailyQuestCard({ quest }: { quest: DailyQuest }) {
  const progressPercent = Math.min(100, Math.round((quest.progress / quest.goal) * 100));
  const isComplete = quest.progress >= quest.goal;

  return (
    <div className={`border-2 rounded-2xl p-4 flex items-center gap-4 transition-all ${isComplete ? "border-green-400 bg-green-50/40" : "border-[#E5E5E5] bg-white"}`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-extrabold ${isComplete ? "bg-green-100 text-green-600" : "bg-[#FFC800]/10 text-[#FFC800]"}`}>
        {quest.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className={`font-extrabold text-base ${isComplete ? "text-green-700" : "text-[#4B4B4B]"}`}>
            {quest.title}
          </h3>
          <span className="text-xs font-extrabold text-[#777777] bg-[#E5E5E5] px-2 py-0.5 rounded-full">
            +{quest.xpReward} XP
          </span>
        </div>
        <p className="text-xs font-bold text-[#777777] mt-0.5">{quest.description}</p>

        {/* Progress bar */}
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 h-3 bg-[#E5E5E5] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${isComplete ? "bg-green-400" : "bg-[#1CB0F6]"}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className={`text-xs font-extrabold ${isComplete ? "text-green-600" : "text-[#777777]"}`}>
            {quest.progress} / {quest.goal}
          </span>
        </div>
      </div>

      {isComplete && (
        <div className="flex items-center gap-1 text-green-600">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
          </svg>
        </div>
      )}
    </div>
  );
}

function SideQuestCard({ quest }: { quest: SideQuest }) {
  const progressPercent = Math.min(100, Math.round((quest.progress / quest.goal) * 100));
  const isComplete = quest.progress >= quest.goal;
  const isLocked = !quest.isActive;

  return (
    <div className={`border-2 rounded-2xl p-4 flex items-center gap-4 transition-all ${isComplete ? "border-green-400 bg-green-50/40" : isLocked ? "border-[#E5E5E5] bg-gray-50/50 opacity-60" : "border-[#E5E5E5] bg-white"}`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-extrabold ${isComplete ? "bg-green-100 text-green-600" : isLocked ? "bg-gray-100 text-gray-400" : "bg-[#FFC800]/10 text-[#FFC800]"}`}>
        {quest.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className={`font-extrabold text-base ${isComplete ? "text-green-700" : isLocked ? "text-gray-400" : "text-[#4B4B4B]"}`}>
            {quest.title}
          </h3>
          <span className="text-xs font-extrabold text-[#777777] bg-[#E5E5E5] px-2 py-0.5 rounded-full">
            +{quest.xpReward} XP
          </span>
        </div>
        <p className="text-xs font-bold text-[#777777] mt-0.5">{quest.description}</p>

        {/* Progress bar */}
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 h-3 bg-[#E5E5E5] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${isComplete ? "bg-green-400" : isLocked ? "bg-gray-200" : "bg-[#1CB0F6]"}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className={`text-xs font-extrabold ${isComplete ? "text-green-600" : isLocked ? "text-gray-400" : "text-[#777777]"}`}>
            {quest.progress} / {quest.goal}
          </span>
        </div>
      </div>

      {isComplete && (
        <div className="flex items-center gap-1 text-green-600">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
          </svg>
        </div>
      )}

      {isLocked && (
        <div className="flex flex-col items-center">
          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span className="text-[10px] font-bold text-gray-400 uppercase mt-1">Locked</span>
        </div>
      )}
    </div>
  );
}
