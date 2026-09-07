"use client";

import { LeftSidebar } from "@/components/LeftSidebar";
import { RightRail } from "@/components/RightRail";
import { api, ProfileResponse } from "@/lib/api";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .profile()
      .then(setProfile)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-dvh bg-white justify-center">
        <LeftSidebar />
        <main className="flex-1 max-w-2xl px-6 py-10 flex items-center justify-center font-bold text-gray-400">
          Loading profile…
        </main>
        <RightRail user={null} />
      </div>
    );
  }

  const streak = profile?.streak ?? 0;
  const totalXp = profile?.total_xp ?? 0;
  const gems = profile?.gems ?? 0;
  const todayXp = profile?.today_xp ?? 0;
  const goalXp = profile?.daily_goal_xp ?? 50;
  const goalPercent = Math.min(100, Math.round((todayXp / goalXp) * 100));

  return (
    <div className="flex min-h-dvh bg-white justify-center">
      <LeftSidebar />

      <main className="flex-1 max-w-2xl px-6 py-10 flex flex-col gap-8">
        {/* Profile Card Header */}
        <div className="flex items-center gap-6 border-b-2 border-[#E5E5E5] pb-8">
          <div className="w-24 h-24 rounded-full bg-sky-400 border-4 border-sky-200 flex items-center justify-center text-4xl font-extrabold text-white uppercase shadow-sm">
            {profile?.username.charAt(0) ?? "D"}
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl font-extrabold text-[#4B4B4B]">
              {profile?.username ?? "Learner"}
            </h1>
            <p className="text-sm font-bold text-[#777777] mt-1">
              Joined {profile?.joined_date ?? "September 2026"}
            </p>
          </div>
        </div>

        {/* Daily Goal Section */}
        <div className="border-2 border-[#E5E5E5] rounded-2xl p-6 flex flex-col gap-3 bg-gray-50">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-extrabold text-[#4B4B4B]">
              Daily XP Goal
            </h2>
            <span className="text-sm font-extrabold text-[#1CB0F6]">
              {todayXp} / {goalXp} XP
            </span>
          </div>
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1CB0F6] transition-all duration-500 rounded-full"
              style={{ width: `${goalPercent}%` }}
            />
          </div>
          <p className="text-xs font-bold text-[#777777]">
            {goalPercent >= 100
              ? "🎉 Daily goal complete! Great job!"
              : `${goalXp - todayXp} XP left to hit your daily goal.`}
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-extrabold text-[#4B4B4B]">Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="border-2 border-[#E5E5E5] rounded-2xl p-4 flex items-center gap-4">
              <img
                src="/assets/icons/STREAK_FLAME_ICON.png"
                alt="Streak"
                className="w-8 h-8"
              />
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold text-[#4B4B4B]">
                  {streak}
                </span>
                <span className="text-xs font-bold text-[#777777]">
                  Day Streak
                </span>
              </div>
            </div>

            <div className="border-2 border-[#E5E5E5] rounded-2xl p-4 flex items-center gap-4">
              <img
                src="/assets/icons/GEM_ICON.svg"
                alt="Gems"
                className="w-8 h-8"
              />
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold text-[#4B4B4B]">
                  {gems}
                </span>
                <span className="text-xs font-bold text-[#777777]">Gems</span>
              </div>
            </div>

            <div className="border-2 border-[#E5E5E5] rounded-2xl p-4 flex items-center gap-4">
              <img src="/assets/learn.svg" alt="XP" className="w-8 h-8" />
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold text-[#4B4B4B]">
                  {totalXp}
                </span>
                <span className="text-xs font-bold text-[#777777]">
                  Total XP
                </span>
              </div>
            </div>

            <div className="border-2 border-[#E5E5E5] rounded-2xl p-4 flex items-center gap-4">
              <img
                src="/assets/leaderboard.svg"
                alt="League"
                className="w-8 h-8"
              />
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold text-[#4B4B4B]">
                  Sapphire
                </span>
                <span className="text-xs font-bold text-[#777777]">
                  Current League
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-extrabold text-[#4B4B4B]">
            Achievements
          </h2>
          <div className="flex flex-col gap-3">
            {(profile?.achievements || []).map((ach) => (
              <div
                key={ach.id}
                className={`border-2 rounded-2xl p-4 flex items-center justify-between gap-4 transition-all ${
                  ach.unlocked
                    ? "border-amber-300 bg-amber-50/40"
                    : "border-[#E5E5E5] bg-white opacity-80"
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
                    <span className="font-extrabold text-base text-[#4B4B4B]">
                      {ach.title}
                    </span>
                    <span className="text-xs font-bold text-[#777777]">
                      {ach.description}
                    </span>
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
      </main>

      <RightRail user={null} />
    </div>
  );
}
