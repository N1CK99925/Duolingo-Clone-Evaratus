"use client";

import { LeftSidebar } from "@/components/LeftSidebar";
import { RightRail } from "@/components/RightRail";
import { LearningPath } from "@/components/LearningPath";
import { ChestIcon, PersonIcon } from "@/components/icons";
import { api, SkillNode, UserSummary } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/* ── Mobile top bar: logo + compact stats (lg:hidden) ── */
function MobileHeader({ user }: { user: UserSummary | null }) {
  return (
    <header className="lg:hidden sticky top-0 z-40 flex h-14 items-center justify-between bg-white px-4 shadow-[0_2px_0_#E5E5E5]">
      <img src="/assets/mascot/duolingo-logo.svg" alt="Duolingo" className="h-7" />
      <div className="flex items-center gap-3">
        {(
          [
            { src: "/assets/icons/STREAK_FLAME_ICON.png", value: user?.streak ?? 0, alt: "Streak" },
            { src: "/assets/icons/GEM_ICON.svg", value: user?.gems ?? 0, alt: "Gems" },
            { src: "/assets/icons/heart.svg", value: user?.hearts ?? 0, alt: "Hearts" },
          ] as const
        ).map((s) => (
          <div key={s.alt} className="flex items-center gap-1">
            <img src={s.src} alt={s.alt} className="h-5 w-5" />
            <span className="text-sm font-extrabold text-[#4B4B4B]">{s.value}</span>
          </div>
        ))}
      </div>
    </header>
  );
}

/* ── Mobile bottom nav (lg:hidden) ── */
function MobileFooter() {
  const items = [
    { label: "Learn", icon: <img src="/assets/learn.svg" alt="" className="h-7 w-7" />, active: true },
    { label: "Leaderboard", icon: <img src="/assets/leaderboard.svg" alt="" className="h-7 w-7" />, active: false },
    { label: "Quests", icon: <ChestIcon gold className="h-6 w-6" />, active: false },
    { label: "Profile", icon: <PersonIcon className="h-6 w-6 text-[#777777]" />, active: false },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex justify-around items-center h-16 bg-white px-2 shadow-[0_-2px_0_#E5E5E5]">
      {items.map(({ label, icon, active }) => (
        <button
          key={label}
          aria-label={label}
          className={`flex flex-col items-center gap-0.5 rounded-xl border-2 px-3 py-1 ${
            active ? "border-[#84D8FF] bg-[#DDF4FF] text-[#1CB0F6]" : "border-transparent text-[#777777]"
          }`}
        >
          {icon}
          <span className="text-[10px] font-bold uppercase">{label}</span>
        </button>
      ))}
    </nav>
  );
}

export default function Home() {
  const router = useRouter();
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);
  const [user, setUser] = useState<UserSummary | null>(null);

  useEffect(() => {
    api.me().then(setUser).catch(console.error);
  }, []);

  const handleSkillClick = (skill: SkillNode) => {
    if (skill.state !== "active") return;
    if (skill.first_lesson_id != null) {
      router.push(`/lesson?id=${skill.first_lesson_id}`);
    } else {
      setSelectedSkill(skill); // fallback: seed has no lessons yet
    }
  };

  return (
    <div className="min-h-dvh bg-white text-[#4B4B4B]">
      <MobileHeader user={user} />

      {/* Desktop: left nav | path | right rail — matches duolingo.com/learn */}
      <div className="lg:flex">
        <LeftSidebar />

        <main className="min-w-0 flex-1 flex justify-center px-4 pt-6 pb-28 lg:pb-12">
          <div className="w-full max-w-2xl">
            <LearningPath onSkillClick={handleSkillClick} />
          </div>
        </main>

        <RightRail user={user} />
      </div>

      <MobileFooter />

      {/* Placeholder until the lesson player (VS2) */}
      {selectedSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-[0_8px_0_#E5E5E5]">
            <h2 className="text-2xl font-extrabold text-[#4B4B4B]">{selectedSkill.title}</h2>
            <p className="mt-2 text-[#777777]">              Lesson content coming soon!</p>
            <button className="btn-primary mt-6 w-full" onClick={() => setSelectedSkill(null)}>
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
