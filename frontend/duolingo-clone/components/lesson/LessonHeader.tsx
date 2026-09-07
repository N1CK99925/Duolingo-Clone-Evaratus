"use client";

/** Lesson HUD: exit, progress bar, hearts — Duolingo lesson header. */
export function LessonHeader({
  progress,
  hearts,
  onExit,
}: {
  progress: number;
  hearts: number;
  onExit: () => void;
}) {
  return (
    <header className="flex items-center gap-4 px-4 py-4 sm:px-6">
      <button
        onClick={onExit}
        aria-label="Exit lesson"
        className="-ml-2 rounded-xl p-2 text-[#AFAFAF] hover:bg-[#F7F7F7] hover:text-[#777777]"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="h-5 w-5">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <div className="h-4 flex-1 overflow-hidden rounded-full bg-[#E5E5E5]">
        <div
          className="h-full rounded-full bg-[#58CC02] transition-[width] duration-500"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>

      <div key={hearts} className="animate-pop flex items-center gap-1.5">
        <img src="/assets/icons/heart.svg" alt="Hearts" className="h-7 w-7" />
        <span className="text-lg font-extrabold text-[#FF4B4B]">{hearts}</span>
      </div>
    </header>
  );
}
