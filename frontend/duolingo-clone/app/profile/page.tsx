"use client";

import { useEffect, useState } from "react";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightRail } from "@/components/RightRail";
import { AchievementList } from "@/components/profile/AchievementList";
import { DailyGoalCard } from "@/components/profile/DailyGoalCard";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { StatsCard } from "@/components/profile/StatsCard";
import { api, ProfileResponse } from "@/lib/api";

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

  return (
    <div className="flex min-h-dvh bg-white justify-center">
      <LeftSidebar />

      <main className="flex-1 max-w-2xl px-6 py-10 flex flex-col gap-8">
        <ProfileHeader username={profile?.username} joinedDate={profile?.joined_date} />

        <DailyGoalCard todayXp={todayXp} goalXp={goalXp} />

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-extrabold text-[#4B4B4B]">Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <StatsCard icon="/assets/icons/STREAK_FLAME_ICON.png" alt="Streak" value={streak} label="Day Streak" />
            <StatsCard icon="/assets/icons/GEM_ICON.svg" alt="Gems" value={gems} label="Gems" />
            <StatsCard icon="/assets/learn.svg" alt="XP" value={totalXp} label="Total XP" />
            <StatsCard icon="/assets/leaderboard.svg" alt="League" value="Sapphire" label="Current League" />
          </div>
        </div>

        <AchievementList achievements={profile?.achievements || []} />
      </main>

      <RightRail user={null} />
    </div>
  );
}