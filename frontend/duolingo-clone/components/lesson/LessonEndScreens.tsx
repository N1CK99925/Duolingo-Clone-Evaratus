"use client";

import { LessonCompleteResult } from "@/lib/api";

/** Full-screen lesson-complete celebration: mascot, +XP, stats, continue. */
export function LessonCompleteScreen({
  result,
  onContinue,
}: {
  result: LessonCompleteResult;
  onContinue: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white p-6 text-center">
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

/** Full-screen out-of-hearts failure: sad Duo, back to path. */
export function OutOfHeartsScreen({ onExit }: { onExit: () => void }) {
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
          Hearts refill over time. Practice an earlier lesson to earn them back.
        </p>
      </div>

      <button className="btn-error mt-10 w-full max-w-sm" onClick={onExit}>
        Back to path
      </button>
    </div>
  );
}
