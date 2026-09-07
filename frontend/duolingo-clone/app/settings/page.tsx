"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const SETTINGS = [
  { label: "Sound effects", icon: "🔊" },
  { label: "Motion", icon: "✨" },
  { label: "Dark mode", icon: "🌙" },
];

/** VS5 placeholder settings page — real logic comes later. */
export default function SettingsPage() {
  const [comingSoon, setComingSoon] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((b) => setComingSoon(b.coming_soon))
      .catch(() => setComingSoon(true));
  }, []);

  return (
    <div className="min-h-dvh bg-white">
      <header className="sticky top-0 flex h-14 items-center gap-3 border-b-2 border-[#E5E5E5] bg-white px-4">
        <Link href="/" className="text-xl font-extrabold text-[#1CB0F6]" aria-label="Back">
          ←
        </Link>
        <h1 className="text-lg font-extrabold uppercase tracking-wide text-[#4B4B4B]">Settings</h1>
      </header>

      <main className="mx-auto flex w-full max-w-xl flex-col gap-3 p-4">
        {SETTINGS.map((s) => (
          <div
            key={s.label}
            className="flex items-center justify-between rounded-2xl border-2 border-[#E5E5E5] p-4"
          >
            <div className="flex items-center gap-3 font-extrabold text-[#4B4B4B]">
              <span className="text-2xl">{s.icon}</span>
              {s.label}
            </div>
            <span className="rounded-lg bg-[#F7F7F7] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#AFAFAF]">
              Coming Soon
            </span>
          </div>
        ))}
        {comingSoon && (
          <p className="mt-2 text-center text-sm font-bold text-[#AFAFAF]">
            Settings sync isn&apos;t wired up yet — placeholders only.
          </p>
        )}
      </main>
    </div>
  );
}
