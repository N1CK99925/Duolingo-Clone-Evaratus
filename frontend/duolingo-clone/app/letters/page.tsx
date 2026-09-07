"use client";

import { useEffect, useState } from "react";
import { LeftSidebar } from "@/components/LeftSidebar";
import { RightRail } from "@/components/RightRail";
import { LettersIcon } from "@/components/icons";
import { api, UserSummary } from "@/lib/api";

export default function LettersPage() {
  const [user, setUser] = useState<UserSummary | null>(null);

  useEffect(() => {
    api.me().then(setUser).catch(console.error);
  }, []);

  return (
    <div className="flex min-h-dvh bg-white justify-center">
      <LeftSidebar />

      <main className="flex-1 max-w-2xl px-6 py-10 flex flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#E5E5E5] bg-[#F7F7F7]">
          <LettersIcon className="h-10 w-10 text-[#AFAFAF]" />
        </div>
        <h1 className="mt-5 text-3xl font-extrabold text-[#4B4B4B]">Letters</h1>
        <p className="mt-2 text-[#777777] font-bold text-sm">
          Learn the Hindi alphabet letter by letter.
        </p>
        <div className="mt-6 rounded-2xl border-2 border-[#E5E5E5] px-6 py-3 text-sm font-bold uppercase tracking-wide text-[#AFAFAF]">
          Coming Soon
        </div>
      </main>

      <RightRail user={user} />
    </div>
  );
}