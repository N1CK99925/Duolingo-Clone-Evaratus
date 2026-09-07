"use client";

import { UserSummary } from "@/lib/api";
import { ArrowIcon, BoltIcon, ChestIcon, ShieldIcon } from "./icons";
import { HeartsStat } from "./HeartsStat";

function Stat({ icon, value }: { icon: React.ReactNode; value: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {icon}
      <span className="text-lg font-extrabold text-[#4B4B4B]">{value}</span>
    </div>
  );
}

/** Right rail: floating stats header + Super / Leaderboards / Daily Quests cards. */
export function RightRail({ user }: { user: UserSummary | null }) {
  const xpTarget = 10;
  const xpProgress = Math.min((user?.total_xp ?? 0) / xpTarget, 1);

  return (
    <aside className="hidden lg:flex flex-col w-[384px] shrink-0 sticky top-0 h-dvh bg-white border-l-2 border-[#E5E5E5] overflow-y-auto scrollbar-thin">
      {/* Stats header — course flag, streak, gems, hearts */}
      <div className="sticky top-0 z-10 bg-white flex items-center justify-between px-5 py-4">
        <img src="https://d35aaqx5ub95lt.cloudfront.net/vendor/73837fa39dbf1bcc4c95a17a58ed0ffb.svg" alt="Course: Hindi" className="h-8 rounded-sm" />
        <Stat
          icon={<img src="/assets/icons/STREAK_FLAME_ICON.png" alt="Streak" className="h-7 w-7" />}
          value={user?.streak ?? 0}
        />
        <Stat
          icon={<img src="/assets/icons/GEM_ICON.svg" alt="Gems" className="h-7 w-7" />}
          value={user?.gems ?? 0}
        />
        <HeartsStat />
      </div>

      <div className="flex flex-col gap-4 px-4 pb-8 pt-1">
        {/* Super promo */}
        <div className="relative rounded-2xl border-2 border-[#E5E5E5] p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-2xl font-black italic tracking-wide bg-gradient-to-r from-[#F35EB3] via-[#9B5CF6] to-[#5A28B8] bg-clip-text text-transparent">
                SUPER
              </div>
              <h3 className="mt-1 font-extrabold text-[#4B4B4B]">Try Super for free</h3>
              <p className="mt-1 text-[15px] leading-snug text-[#777777]">
                No ads, personalized practice, and unlimited Legendary!
              </p>
            </div>
            <img
              src="https://d35aaqx5ub95lt.cloudfront.net/images/super/fb7130289a205fadd2e196b9cc866555.svg"
              alt="Super promo"
              className="h-full w-full"
            />
          </div>
          <button className="mt-3 w-full rounded-xl bg-[#CE82FF] py-2.5 text-sm font-bold uppercase tracking-wide text-white shadow-[0_3px_0_#A560CC] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-2">
            Try 1 week free
            <ArrowIcon className="h-5 w-5" fill="white" />
          </button>
        </div>

        {/* Leaderboards */}
        <div className="rounded-2xl border-2 border-[#E5E5E5] p-4">
          <div className="text-xs font-bold uppercase tracking-widest text-[#AFAFAF]">
            Leaderboards
          </div>
          <div className="mt-1.5 flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="font-extrabold text-[#4B4B4B]">Better luck next time!</h3>
              <p className="mt-0.5 text-[15px] leading-snug text-[#777777]">
                You finished #28 and dropped down to the Bronze League
              </p>
            </div>
            <ShieldIcon className="h-14 w-14 shrink-0" />
          </div>
          <button className="mt-3 w-full rounded-xl border-2 border-[#E5E5E5] bg-white py-2.5 text-sm font-bold uppercase tracking-wide text-[#1CB0F6] shadow-[0_3px_0_#E5E5E5] hover:bg-[#F7FDFF] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-2">
            Go to Leaderboards
            <ArrowIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Daily Quests */}
        <div className="rounded-2xl border-2 border-[#E5E5E5] p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-[#4B4B4B]">Daily Quests</h3>
            <button className="text-xs font-bold uppercase tracking-wide text-[#1CB0F6] hover:opacity-80 flex items-center gap-1">
              View all
              <ArrowIcon className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <BoltIcon className="h-8 w-8 shrink-0 text-[#FFC800]" />
            <div className="min-w-0 flex-1">
              <div className="text-[15px] font-bold text-[#4B4B4B]">Earn {xpTarget} XP</div>
              <div className="relative mt-1 h-4 rounded-full bg-[#E5E5E5]">
                <div
                  className="h-4 rounded-full bg-[#58CC02]"
                  style={{ width: `calc(${xpProgress * 100}% )` }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-[#AFAFAF]">
                  {user?.total_xp ?? 0} / {xpTarget}
                </span>
                <ChestIcon gold className="absolute right-0.5 top-1/2 h-5 w-5 -translate-y-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
