"use client";

/** Full-screen lesson load failure with a way back to the path. */
export function LessonErrorScreen({ onExit }: { onExit: () => void }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 p-6 text-center">
      <img src="/assets/mascot/Learning%20how%20to%20animate.svg" alt="Duo" className="h-40" />
      <p className="font-extrabold text-[#4B4B4B]">Couldn&apos;t load the lesson.</p>
      <button className="btn-primary" onClick={onExit}>
        Back to path
      </button>
    </div>
  );
}