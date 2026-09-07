"use client";

import { ChestIcon, LettersIcon, MoreIcon, PersonIcon } from "./icons";

const NAV_ITEMS: { label: string; icon: React.ReactNode; active?: boolean }[] = [
  { label: "Learn", icon: <img src="/assets/learn.svg" alt="" className="h-8 w-8" />, active: true },
  { label: "Letters", icon: <LettersIcon className="h-7 w-7" /> },
  { label: "Leaderboards", icon: <img src="/assets/leaderboard.svg" alt="" className="h-8 w-8" /> },
  { label: "Quests", icon: <ChestIcon gold className="h-7 w-7" /> },
  { label: "Shop", icon: <img src="/assets/shop.svg" alt="" className="h-8 w-8" /> },
  { label: "Profile", icon: <PersonIcon className="h-7 w-7 text-[#AFAFAF]" /> },
  { label: "More", icon: <MoreIcon className="h-7 w-7" /> },
];

/** Desktop left navigation — logo + uppercase bold items, blue active state. */
export function LeftSidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-72 shrink-0 sticky top-0 h-dvh bg-white border-r-2 border-[#E5E5E5] px-6 pt-8 pb-6">
      <img src="/assets/mascot/duolingo-logo.svg" alt="Duolingo" className="h-9 self-start ml-1 mb-8" />

      <nav className="flex flex-col gap-1.5">
        {NAV_ITEMS.map(({ label, icon, active }) => (
          <button
            key={label}
            aria-label={label}
            className={`flex items-center gap-3.5 px-3 py-2 rounded-xl border-2 text-sm font-extrabold uppercase tracking-[0.5px] transition-colors ${
              active
                ? "bg-[#DDF4FF] border-[#84D8FF] text-[#1CB0F6]"
                : "bg-transparent border-transparent text-[#777777] hover:bg-[#F7F7F7]"
            }`}
          >
            {icon}
            <span className="truncate">{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
