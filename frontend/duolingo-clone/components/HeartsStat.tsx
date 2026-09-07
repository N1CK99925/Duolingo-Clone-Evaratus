"use client";

import { HeartsStatus, api } from "@/lib/api";
import { useEffect, useState } from "react";

/** Hearts stat with a live mm:ss countdown to the next time-based refill (VS5). */
export function HeartsStat() {
  const [status, setStatus] = useState<HeartsStatus | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let alive = true;
    const load = () => api.hearts().then((s) => alive && setStatus(s)).catch(() => {});
    load();
    const poll = setInterval(load, 30_000);
    const tick = setInterval(() => setNow(Date.now()), 1_000);
    return () => {
      alive = false;
      clearInterval(poll);
      clearInterval(tick);
    };
  }, []);

  let countdown = "";
  if (status?.next_refill_at) {
    const remaining = Math.max(0, new Date(status.next_refill_at).getTime() - now);
    const m = Math.floor(remaining / 60_000);
    const s = Math.floor((remaining % 60_000) / 1_000);
    countdown = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-1.5">
        <img src="/assets/icons/heart.svg" alt="Hearts" className="h-7 w-7" />
        <span className={`text-lg font-extrabold ${status?.is_out_of_hearts ? "text-[#FF4B4B]" : "text-[#4B4B4B]"}`}>
          {status?.current_hearts ?? 0}
        </span>
      </div>
      {countdown && (
        <span className="text-[10px] font-bold tabular-nums text-[#AFAFAF]">{countdown}</span>
      )}
    </div>
  );
}