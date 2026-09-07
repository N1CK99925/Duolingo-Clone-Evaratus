"use client";

/** Super Duolingo subscription teaser — not purchasable yet. */
export function SuperCard() {
  return (
    <section className="border-2 border-dashed border-[#E5E5E5] rounded-2xl p-6 text-center">
      <div className="text-4xl mb-2">🌟</div>
      <h2 className="text-xl font-extrabold text-[#4B4B4B] mb-1">Super Duolingo</h2>
      <p className="text-sm font-bold text-[#777777]">
        No ads, unlimited hearts, and progress tracking
      </p>
      <div className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-[#1CB0F6] bg-[#DDF4FF] px-3 py-1 rounded-full">
        Coming soon
      </div>
    </section>
  );
}