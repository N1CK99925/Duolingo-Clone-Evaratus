"use client";

import { UnitNode } from "@/lib/api";
import { BackArrowIcon, GuidebookIcon } from "./icons";
import { Accent, topicOf } from "./pathStyles";

interface UnitBannerProps {
  unit: UnitNode;
  unitNumber: number;
  accent: Accent;
  isActive: boolean;
}

/** Colored unit banner — "← SECTION N, UNIT N / topic" + guidebook, shown for every unit. */
export function UnitBanner({ unit, unitNumber, accent, isActive }: UnitBannerProps) {
  return (
    <div
      className="w-full rounded-2xl px-4 py-3 flex items-center gap-3 shadow-[0_4px_0_#00000010]"
      style={{ background: accent.banner, boxShadow: `0 4px 0 ${accent.shadow}` }}
      data-testid="unit-banner"
    >
      <button
        aria-label="Back"
        className={`p-2 rounded-xl text-white shrink-0 ${isActive ? "hover:bg-white/10" : "opacity-60"}`}
      >
        <BackArrowIcon className="h-5 w-5" />
      </button>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-bold tracking-wide text-white/90 uppercase">
          Section {unitNumber}, Unit {unitNumber}
        </div>
        <h2 className="text-xl lg:text-2xl font-extrabold text-white truncate">
          {topicOf(unit.title)}
        </h2>
      </div>
      <button
        className={`flex items-center gap-2 shrink-0 rounded-xl bg-white px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white/90 shadow-[0_3px_0_rgba(0,0,0,0.15)] ${
          isActive ? "hover:bg-[#F7F7F7]" : "opacity-90"
        }`}
      >
        <GuidebookIcon className="h-5 w-5" />
        <span className="hidden sm:inline text-white" style={{ color: accent.shadow }}>Guidebook</span>
      </button>
    </div>
  );
}