"use client";

import { forwardRef } from "react";
import { SkillNode, UnitNode } from "@/lib/api";
import { UnitBanner } from "./UnitBanner";
import { ChestIcon } from "./icons";
import { Accent, OFFSETS } from "./pathStyles";
import { SkillNodeComponent } from "./SkillNode";

interface UnitSectionProps {
  unit: UnitNode;
  accent: Accent;
  unitNumber: number;
  isActive: boolean;
  onSkillClick: (skill: SkillNode) => void;
  onClaimChest: (unitId: number) => void;
}

/** One unit: its colored banner + winding node trail, with Duo beside the active node. */
export const UnitSection = forwardRef<HTMLElement | null, UnitSectionProps>(function UnitSection(
  { unit, accent, unitNumber, isActive, onSkillClick, onClaimChest },
  ref,
) {
  return (
    <section ref={ref} className="w-full flex flex-col items-center">
      <UnitBanner unit={unit} unitNumber={unitNumber} accent={accent} isActive={isActive} />

      <div className="w-full flex flex-col items-center relative pt-16 pb-12">
        {unit.skills.map((skill, skillIdx) => (
          <div key={skill.id} className="relative flex flex-col items-center">
            <div
              className={skillIdx > 0 ? "mt-9" : ""}
              style={{ transform: `translateX(${OFFSETS[skillIdx % OFFSETS.length]}px)` }}
            >
              <SkillNodeComponent skill={skill} onClick={() => onSkillClick(skill)} accent={accent} />
              {skill.state === "active" && (
                <img
                  src="/assets/mascot/Duolingo%20waving%20bird%20for%20learning%20purposes.svg"
                  alt="Duo waving"
                  className="absolute left-full -top-10 ml-2 object-contain pointer-events-none select-none"
                  style={{ height: "160px", width: "160px", maxWidth: "none" }}
                />
              )}
            </div>
            {skillIdx === 1 && unit.skills.length >= 3 && (
              <button
                onClick={() => onClaimChest(unit.id)}
                disabled={unit.chest.claimed}
                aria-label={
                  unit.chest.claimed ? `Unit ${unit.id} chest claimed` : `Open unit ${unit.id} chest`
                }
                className={`mt-9 h-20 w-20 drop-shadow-[0_6px_0_rgba(0,0,0,0.08)] transition-transform ${
                  unit.chest.claimed
                    ? "opacity-50 grayscale cursor-default"
                    : "cursor-pointer hover:scale-110"
                }`}
              >
                <ChestIcon gold={!unit.chest.claimed} />
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
});