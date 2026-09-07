"use client";

import { AnswerResult } from "@/lib/api";

interface LessonFooterProps {
  hasSelection: boolean;
  feedback: AnswerResult | null;
  correctText: string;
  submitting: boolean;
  onCheck: () => void;
  onContinue: () => void;
}

/** Bottom bar: CHECK button normally, full-width green/red feedback bar after answering. */
export function LessonFooter({
  hasSelection,
  feedback,
  correctText,
  submitting,
  onCheck,
  onContinue,
}: LessonFooterProps) {
  if (feedback) {
    const correct = feedback.is_correct;
    return (
      <footer
        className={`fixed inset-x-0 bottom-0 border-t-2 ${
          correct ? "border-[#46A302] bg-[#58CC02]" : "border-[#EA2B2B] bg-[#FF4B4B]"
        }`}
      >
        <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3 text-white">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/25">
              {correct ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" className="h-6 w-6">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              )}
            </span>
            <div className="min-w-0">
              <div className="text-xl font-extrabold uppercase">
                {correct ? "Nice!" : "Correct answer:"}
              </div>
              {!correct && <div className="truncate font-bold">{correctText}</div>}
              {correct && feedback.explanation && (
                <div className="text-sm font-semibold opacity-90">{feedback.explanation}</div>
              )}
            </div>
          </div>

          <button
            onClick={onContinue}
            className={`rounded-xl bg-white px-8 py-2.5 text-sm font-extrabold uppercase tracking-wide active:translate-y-[2px] ${
              correct ? "text-[#58CC02]" : "text-[#FF4B4B]"
            }`}
          >
            Continue
          </button>
        </div>
      </footer>
    );
  }

  return (
    <footer className="fixed inset-x-0 bottom-0 border-t-2 border-[#E5E5E5] bg-white">
      <div className="mx-auto flex max-w-2xl items-center justify-end px-4 py-4 sm:px-6">
        <button
          onClick={onCheck}
          disabled={!hasSelection || submitting}
          className={`rounded-xl px-8 py-2.5 text-sm font-extrabold uppercase tracking-wide transition-colors ${
            hasSelection && !submitting
              ? "bg-[#58CC02] text-white shadow-[0_3px_0_#46A302] active:translate-y-[2px] active:shadow-none"
              : "cursor-not-allowed bg-[#E5E5E5] text-[#AFAFAF]"
          }`}
        >
          {submitting ? "Checking…" : "Check"}
        </button>
      </div>
    </footer>
  );
}
