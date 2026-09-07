"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChestIcon, LettersIcon, MoreIcon, PersonIcon } from "./icons";

const NAV_ITEMS = [
  { label: "Learn", href: "/", icon: <img src="/assets/learn.svg" alt="" className="h-8 w-8" /> },
  { label: "Letters", href: "/letters", icon: <LettersIcon className="h-7 w-7" /> },
  { label: "Leaderboards", href: "/leaderboard", icon: <img src="/assets/leaderboard.svg" alt="" className="h-8 w-8" /> },
  { label: "Quests", href: "/quests", icon: <ChestIcon gold className="h-7 w-7" /> },
  { label: "Shop", href: "/shop", icon: <img src="/assets/shop.svg" alt="" className="h-8 w-8" /> },
  { label: "Profile", href: "/profile", icon: <PersonIcon className="h-7 w-7 text-[#AFAFAF]" /> },
  { label: "Settings", href: "/settings", icon: <MoreIcon className="h-7 w-7" /> },
];

/** Desktop left navigation — logo + uppercase bold items, blue active state. */
export function LeftSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-72 shrink-0 sticky top-0 h-dvh bg-white border-r-2 border-[#E5E5E5] px-6 pt-8 pb-6">
      <Link href="/">
        <img src="/assets/mascot/duolingo-logo.svg" alt="Duolingo" className="h-9 self-start ml-1 mb-8 cursor-pointer" />
      </Link>

      <nav className="flex flex-col gap-1.5">
        {NAV_ITEMS.map(({ label, href, icon }) => {
          const isActive = pathname === href || (href !== "/" && pathname?.startsWith(href));

          return (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3.5 px-3 py-2 rounded-xl border-2 text-sm font-extrabold uppercase tracking-[0.5px] transition-colors ${
                isActive
                  ? "bg-[#DDF4FF] border-[#84D8FF] text-[#1CB0F6]"
                  : "bg-transparent border-transparent text-[#777777] hover:bg-[#F7F7F7]"
              }`}
            >
              {icon}
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
