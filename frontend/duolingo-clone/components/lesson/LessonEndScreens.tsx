"use client";

import { LessonCompleteResult, api } from "@/lib/api";
import { Confetti } from "@/components/Confetti";
import { useEffect, useState } from "react";

/** Small auto-hiding toast (VS5: streak / achievement celebration). */
function Toast({ message }: { message: string }) {
  return (
    <div className="animate-toast-in fixed left-1/2 top-6 z-[60] -translate-x-1/2 rounded-2xl border-2 border-[#E5E5E5] bg-white px-5 py-3 font-extrabold text-[#4B4B4B] shadow-[0_3px_0_#E5E5E5]">
      {message}
    </div>
  );
}

/** Full-screen lesson-complete celebration: confetti, mascot, +XP, stats, toast. */
export function LessonCompleteScreen({
  result,
  onContinue,
}: {
  result: LessonCompleteResult;
  onContinue: () => void;
}) {
  const [toastVisible, setToastVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setToastVisible(false), 3200);
    return () => clearTimeout(t);
  }, []);

  const toast =
    toastVisible
      ? result.current_streak > 1
        ? `🔥 ${result.current_streak} day streak!`
        : "🔥 Streak started!"
      : null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white p-6 text-center">
      <Confetti />
      {toast && <Toast message={toast} />}
      <div className="animate-pop flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-[#FFC800] sm:text-4xl">Lesson complete!</h1>

        <img
          src="/assets/mascot/Duolingo%20waving%20bird%20for%20learning%20purposes.svg"
          alt="Duo waving"
          className="my-6 h-56"
        />

        <div className="flex items-center gap-2">
          <img src="/assets/icons/fittedXpImg.svg" alt="XP" className="h-8 w-8" />
          <span className="text-4xl font-extrabold text-[#58CC02]">+{result.xp_awarded} XP</span>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border-2 border-[#E5E5E5] px-4 py-2">
            <img src="/assets/icons/fittedXpImg.svg" alt="" className="h-5 w-5" />
            <div className="text-left">
              <div className="text-[10px] font-bold uppercase tracking-wide text-[#AFAFAF]">Total XP</div>
              <div className="text-sm font-extrabold text-[#FFC800]">{result.total_xp}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border-2 border-[#E5E5E5] px-4 py-2">
            <img src="/assets/icons/STREAK_FLAME_ICON.png" alt="" className="h-5 w-5" />
            <div className="text-left">
              <div className="text-[10px] font-bold uppercase tracking-wide text-[#AFAFAF]">Streak</div>
              <div className="text-sm font-extrabold text-[#FF9600]">{result.current_streak}</div>
            </div>
          </div>
        </div>
      </div>

      <button className="btn-primary mt-10 w-full max-w-sm" onClick={onContinue}>
        Continue
      </button>
    </div>
  );
}

/** Full-screen out-of-hearts failure: sad Duo, refill via gems or practice on the path. */
export function OutOfHeartsScreen({ onExit }: { onExit: () => void }) {
  const [state, setState] = useState<"idle" | "refilling" | "refilled" | "error">("idle");

  const refill = async () => {
    setState("refilling");
    try {
      await api.refillHearts();
      setState("refilled");
    } catch {
      setState("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white p-6 text-center">
      <div className="animate-pop flex flex-col items-center">
        <img
          src="/assets/mascot/Learning%20how%20to%20animate.svg"
          alt="Duo"
          className="h-48"
        />
        <h1 className="mt-6 text-3xl font-extrabold text-[#FF4B4B] sm:text-4xl">
          You ran out of hearts!
        </h1>
        <p className="mt-3 max-w-sm text-[#777777]">
          Hearts refill over time (1 every 30 min), or refill instantly with gems.
        </p>
      </div>

      <div className="mt-10 flex w-full max-w-sm flex-col gap-3">
        {state === "refilled" ? (
          <div className="rounded-2xl border-2 border-[#58CC02] bg-[#D7FFB8] px-4 py-3 font-extrabold text-[#58A700]">
            Hearts refilled! ❤️❤️❤️❤️❤️
          </div>
        ) : (
          <button
            className="btn-gold w-full disabled:opacity-60"
            onClick={() => void refill()}
            disabled={state === "refilling"}
          >
            {state === "refilling"
              ? "Refilling…"
              : state === "error"
                ? "Not enough gems — try again later"
                : "Refill for 350 gems 💎"}
          </button>
        )}
        <button className="btn-primary w-full" onClick={onExit}>
          Practice on the path
        </button>
      </div>
    </div>
  );
}
