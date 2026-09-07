"use client";

import { api, PathResponse, SkillNode } from "@/lib/api";
import { UnitBanner } from "./UnitBanner";
import { UnitSection } from "./UnitSection";
import { sectionAccent } from "./pathStyles";
import { useChestClaim } from "@/hooks/useChestClaim";
import { useEffect, useRef, useState } from "react";

interface LearningPathProps {
  onSkillClick: (skill: SkillNode) => void;
}

/** The learning path: one colorful unit banner + winding node trail per unit. */
export function LearningPath({ onSkillClick }: LearningPathProps) {
  const [path, setPath] = useState<PathResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const didInitialScroll = useRef(false);
  const { chestFeedback, claimChest } = useChestClaim(setPath);

  useEffect(() => {
    api.path()
      .then((data) => {
        setPath(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load path:", err);
        setLoading(false);
      });
  }, []);

  // The unit holding the current active lesson — Duo mascot sits beside its active node.
  const activeIdx = path
    ? Math.max(0, path.units.findIndex((u) => u.skills.some((s) => s.state === "active")))
    : 0;

  /* On first load, jump to the learner's current unit (Duolingo behavior). */
  useEffect(() => {
    if (!path || didInitialScroll.current) return;
    didInitialScroll.current = true;
    const el = sectionRefs.current[activeIdx];
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 72,
        behavior: "auto",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-32 text-[#777777] font-bold">
        Loading path…
      </div>
    );
  }

  if (!path) {
    return (
      <div className="flex-1 flex items-center justify-center py-32 text-[#FF4B4B] font-bold">
        Failed to load learning path
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center relative">
      {/* One-time gem-claim toast after opening a chest */}
      {chestFeedback && (
        <div className="animate-toast-in fixed left-1/2 top-6 z-[60] -translate-x-1/2 rounded-2xl border-2 border-[#E5E5E5] bg-white px-5 py-3 font-extrabold text-[#4B4B4B] shadow-[0_3px_0_#E5E5E5]">
          {chestFeedback}
        </div>
      )}

      {path.units.map((unit, unitIdx) => (
        <UnitSection
          key={unit.id}
          ref={(el) => {
            sectionRefs.current[unitIdx] = el;
          }}
          unit={unit}
          accent={sectionAccent(unitIdx)}
          unitNumber={unitIdx + 1}
          isActive={unitIdx === activeIdx}
          onSkillClick={onSkillClick}
          onClaimChest={claimChest}
        />
      ))}
    </div>
  );
}