"use client";

import { LeftSidebar } from "@/components/LeftSidebar";
import { RightRail } from "@/components/RightRail";
import { QuestCard } from "@/components/quests/QuestCard";
import { DAILY_QUESTS, SIDE_QUESTS } from "@/data/quests";

function QuestSection({
  label,
  title,
  quests,
}: {
  label: string;
  title: string;
  quests: Parameters<typeof QuestCard>[0]["quest"][];
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#AFAFAF]">{label}</span>
        <h2 className="text-lg font-extrabold text-[#4B4B4B]">{title}</h2>
      </div>
      <div className="flex flex-col gap-3">
        {quests.map((quest) => (
          <QuestCard key={quest.id} quest={quest} />
        ))}
      </div>
    </div>
  );
}

export default function QuestsPage() {
  return (
    <div className="flex min-h-dvh bg-white justify-center">
      <LeftSidebar />

      <main className="flex-1 max-w-2xl px-6 py-10 flex flex-col gap-8">
        <div className="flex flex-col items-center text-center mb-2">
          <img src="/assets/quests.svg" alt="Quests" className="w-20 h-20 mb-4" />
          <h1 className="text-3xl font-extrabold text-[#4B4B4B]">Quests</h1>
          <p className="text-[#777777] font-bold text-sm mt-1">
            Complete quests to earn bonus XP
          </p>
        </div>

        <QuestSection label="Daily" title="Today's Quests" quests={DAILY_QUESTS} />
        <QuestSection label="Side" title="Side Quests" quests={SIDE_QUESTS} />
      </main>

      <RightRail user={null} />
    </div>
  );
}