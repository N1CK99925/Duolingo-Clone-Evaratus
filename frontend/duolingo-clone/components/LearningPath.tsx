"use client";

import { api, PathResponse, SkillNode, UnitNode } from "@/lib/api";
import { SkillNodeComponent } from "./SkillNode";
import { BackArrowIcon, ChestIcon, GuidebookIcon } from "./icons";
import { useEffect, useState } from "react";

/* Winding-trail horizontal offsets (px), cycled per skill within a unit. */
const OFFSETS = [0, 60, 110, 60, 0, -60, -110, -60];

/** Unit titles are seeded as "Unit 1 — Letters & Basics"; the part after " — " is the display topic. */
function topicOf(title: string): string {
  const idx = title.indexOf(" — ");
  return idx >= 0 ? title.slice(idx + 3) : title;
}

interface LearningPathProps {
  onSkillClick: (skill: SkillNode) => void;
}

/** The learning path: green unit banner + winding node trail, Duolingo-style. */
export function LearningPath({ onSkillClick }: LearningPathProps) {
  const [path, setPath] = useState<PathResponse | null>(null);
  const [loading, setLoading] = useState(true);

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

  // The unit holding the current active lesson gets the full green banner.
  const bannerIdx = Math.max(
    0,
    path.units.findIndex((u) => u.skills.some((s) => s.state === "active")),
  );

  return (
    <div className="flex flex-col items-center">
      {path.units.map((unit: UnitNode, unitIdx: number) => (
        <section key={unit.id} className="w-full flex flex-col items-center">
          {unitIdx === bannerIdx ? (
            <UnitBanner unit={unit} unitNumber={unitIdx + 1} />
          ) : (
            <UnitDivider unit={unit} />
          )}

          {/* Node trail — zigzag with a treasure chest mid-unit and Duo beside the active node */}
          <div
            className={`flex flex-col items-center ${
              unitIdx === bannerIdx ? "pt-16 pb-12" : "py-8"
            }`}
          >
            {unit.skills.map((skill: SkillNode, skillIdx: number) => (
              <div key={skill.id} className="relative flex flex-col items-center">
                <div
                  className={skillIdx > 0 ? "mt-9" : ""}
                  style={{ transform: `translateX(${OFFSETS[skillIdx % OFFSETS.length]}px)` }}
                >
                  <SkillNodeComponent skill={skill} onClick={() => onSkillClick(skill)} />
                  {skill.state === "active" && (
                    <img
                      src="/assets/mascot/duo-happy.svg"
                      alt="Duo"
                      className="bob absolute left-full -top-2 ml-10 h-24 hidden lg:block"
                    />
                  )}
                </div>
                {skillIdx === 1 && unit.skills.length >= 3 && (
                  <ChestIcon className="mt-9 h-14 w-14 drop-shadow-[0_6px_0_rgba(0,0,0,0.08)]" />
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/** Green banner for the current unit — "← SECTION 1, UNIT 1 / Make introductions" + guidebook. */
function UnitBanner({ unit, unitNumber }: { unit: UnitNode; unitNumber: number }) {
  return (
    <div
      className="w-full rounded-2xl px-4 py-3 flex items-center gap-3 bg-[#58CC02] shadow-[0_4px_0_#46A302]"
      data-testid="unit-banner"
    >
      <button aria-label="Back" className="p-2 rounded-xl text-white hover:bg-white/10 shrink-0">
        <BackArrowIcon className="h-5 w-5" />
      </button>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-bold tracking-wide text-white/90 uppercase">
          Section 1, Unit {unitNumber}
        </div>
        <h2 className="text-xl lg:text-2xl font-extrabold text-white truncate">
          {topicOf(unit.title)}
        </h2>
      </div>
      <button className="flex items-center gap-2 shrink-0 rounded-xl border-2 border-white/40 bg-white/10 px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-white/20">
        <GuidebookIcon className="h-5 w-5" />
        <span className="hidden sm:inline">Guidebook</span>
      </button>
    </div>
  );
}

/** Upcoming unit — a gray divider with the topic name, like "— Talk about your job —". */
function UnitDivider({ unit }: { unit: UnitNode }) {
  return (
    <div className="w-full max-w-lg flex items-center gap-6 mt-16" data-testid="unit-divider">
      <span className="h-[2px] flex-1 bg-[#E5E5E5]" />
      <span className="text-lg font-bold text-[#AFAFAF] whitespace-nowrap">
        {topicOf(unit.title)}
      </span>
      <span className="h-[2px] flex-1 bg-[#E5E5E5]" />
    </div>
  );
}
