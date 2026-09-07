"use client";

import { REPAIR_OPTIONS } from "@/data/shop";

/** Heart repair rows: buy packs of hearts for gems. */
export function HeartRepairSection() {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-extrabold text-[#4B4B4B]">Heart Repair</h2>
      <div className="flex flex-col gap-3">
        {REPAIR_OPTIONS.map((item) => (
          <div
            key={item.id}
            className="border-2 border-[#E5E5E5] rounded-2xl p-4 flex items-center justify-between gap-4 bg-white hover:bg-gray-50 transition-all"
          >
            <div className="flex items-center gap-3">
              <img src="/assets/icons/heart.svg" alt="Heart" className="h-7 w-7 text-[#FF4B4B]" />
              <div>
                <div className="font-extrabold text-sm text-[#4B4B4B]">{item.name}</div>
                <div className="text-xs font-bold text-[#777777]">
                  +{item.hearts} heart{item.hearts > 1 ? "s" : ""}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <img src="/assets/icons/GEM_ICON.svg" alt="Gem" className="h-5 w-5" />
              <span className="font-extrabold text-sm text-[#4B4B4B]">{item.cost}</span>
              <button className="text-xs font-bold text-[#1CB0F6] bg-white border-2 border-[#1CB0F6] px-3 py-1 rounded-full hover:bg-[#DDF4FF] active:translate-y-0.5 ml-2">
                Buy
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}