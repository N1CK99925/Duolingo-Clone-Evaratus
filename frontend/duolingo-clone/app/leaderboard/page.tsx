"use client";

import { LeftSidebar } from "@/components/LeftSidebar";
import { RightRail } from "@/components/RightRail";
import { api, LeaderboardEntry } from "@/lib/api";
import { useEffect, useState } from "react";

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .leaderboard()
      .then(setEntries)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const user = null;
  return (
    <div className="flex min-h-dvh bg-white justify-center">
      <LeftSidebar />

      <main className="flex-1 max-w-2xl px-6 py-10 flex flex-col items-center">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <img
            src="/assets/leaderboard.svg"
            alt="Sapphire League"
            className="w-24 h-24 mb-4"
          />
          <h1 className="text-3xl font-extrabold text-[#4B4B4B]">
            Sapphire League
          </h1>
          <p className="text-[#777777] font-bold text-sm mt-1">
            Top 3 advance to the next league!
          </p>
        </div>

        {/* Leaderboard list container */}
        <div className="w-full max-w-lg border-2 border-[#E5E5E5] rounded-2xl overflow-hidden divide-y-2 divide-[#E5E5E5] bg-white shadow-sm">
          {loading ? (
            <div className="p-8 text-center text-gray-400 font-bold">
              Loading rankings…
            </div>
          ) : (
            entries.map((entry) => {
              return (
                <div
                  key={entry.user_id}
                  className={`flex items-center justify-between px-6 py-4 transition-colors ${
                    entry.is_current_user
                      ? "bg-[#DDF4FF]/40 border-l-4 border-l-[#1CB0F6]"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Rank Badge */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-sm ${
                        entry.rank === 1
                          ? "bg-amber-400 text-white"
                          : entry.rank === 2
                          ? "bg-slate-300 text-slate-700"
                          : entry.rank === 3
                          ? "bg-amber-700 text-white"
                          : "text-gray-400 font-bold"
                      }`}
                    >
                      {entry.rank}
                    </div>

                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-full bg-sky-100 border-2 border-sky-300 flex items-center justify-center font-bold text-sky-600 uppercase text-lg">
                      {entry.username.charAt(0)}
                    </div>

                    {/* Name */}
                    <div className="flex flex-col">
                      <span
                        className={`font-extrabold text-base ${
                          entry.is_current_user
                            ? "text-[#1CB0F6]"
                            : "text-[#4B4B4B]"
                        }`}
                      >
                        {entry.username}
                        {entry.is_current_user && (
                          <span className="ml-2 text-xs bg-[#1CB0F6] text-white px-2 py-0.5 rounded-full font-bold">
                            You
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* XP */}
                  <div className="font-extrabold text-sm text-[#777777]">
                    {entry.weekly_xp} <span className="text-xs uppercase">XP</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      <RightRail user={user} />
    </div>
  );
}
