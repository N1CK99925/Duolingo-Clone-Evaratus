"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { createPortal } from "react-dom";
import { api } from "@/lib/api";
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

function ResetIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 5V2L8 6l4 4V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Desktop left navigation — logo + uppercase bold items, blue active state. */
export function LeftSidebar() {
  const pathname = usePathname();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState(false);

  async function handleReset() {
    setResetting(true);
    setError(false);
    try {
      await api.reset();
      window.location.reload();
    } catch {
      setError(true);
      setResetting(false);
    }
  }

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

      <button
        onClick={() => setConfirmOpen(true)}
        className="mt-auto flex items-center gap-3.5 px-3 py-2 rounded-xl border-2 border-transparent text-sm font-extrabold uppercase tracking-[0.5px] text-[#AFAFAF] transition-colors hover:bg-[#F7F7F7] hover:text-[#777777]"
      >
        <ResetIcon className="h-6 w-6" />
        <span>Reset progress</span>
      </button>

      {confirmOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => !resetting && setConfirmOpen(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              className="w-full max-w-sm rounded-2xl border-2 border-[#E5E5E5] bg-white p-6 shadow-2xl animate-pop"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-extrabold text-[#4B4B4B]">Start over from scratch?</h2>
              <p className="mt-2 text-[15px] leading-snug text-[#777777]">
                This erases your XP, streak, hearts, and lesson progress, then sets you back to
                the very first lesson. Course content stays.
              </p>
              {error && (
                <p className="mt-3 rounded-xl bg-[#FFF0F0] px-3 py-2 text-sm font-bold text-[#FF4B4B]">
                  Reset failed. Check the connection and try again.
                </p>
              )}
              <div className="mt-5 flex flex-col gap-3">
                <button
                  onClick={handleReset}
                  disabled={resetting}
                  className="w-full rounded-xl bg-[#FF4B4B] py-2.5 text-sm font-bold uppercase tracking-wide text-white shadow-[0_3px_0_#EA2B2B] active:translate-y-[2px] active:shadow-none disabled:opacity-60"
                >
                  {resetting ? "Resetting…" : "Yes, reset"}
                </button>
                <button
                  onClick={() => setConfirmOpen(false)}
                  disabled={resetting}
                  className="w-full rounded-xl border-2 border-[#E5E5E5] bg-white py-2.5 text-sm font-bold uppercase tracking-wide text-[#1CB0F6] shadow-[0_3px_0_#E5E5E5] hover:bg-[#F7FDFF] active:translate-y-[2px] active:shadow-none disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </aside>
  );
}