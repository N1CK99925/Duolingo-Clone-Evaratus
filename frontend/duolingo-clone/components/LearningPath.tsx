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

/** Per-section accent color for the banner + guidelines, cycling through the three sections. */
function sectionAccent(unitIdx: number): { banner: string; shadow: string; track: string; dot: string } {
  return [
    { banner: "#58CC02", shadow: "#46A302", track: "#C8E6B0", dot: "#58CC02" },   // Section 1 — green
    { banner: "#CE82F7", shadow: "#A85DF0", track: "#E5C8F0", dot: "#CE82F7" },   // Section 2 — purple
    { banner: "#04CD9C", shadow: "#03A87C", track: "#A8E6DA", dot: "#04CD9C" },   // Section 3 — teal
  ][unitIdx % 3];
}

interface LearningPathProps {
  onSkillClick: (skill: SkillNode) => void;
}

/** The learning path: colored unit banner + winding node trail with a continuous guideline, Duolingo-style. */
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

  // The unit holding the current active lesson gets the full colored banner.
  const bannerIdx = Math.max(
    0,
    path.units.findIndex((u) => u.skills.some((s) => s.state === "active")),
  );

  // Pre-compute section accents so the guideline colors match their section.
  const accents = path.units.map((_, idx) => sectionAccent(idx));

  return (
    <div className="flex flex-col items-center relative">
      {/* Continuous vertical guideline running through all sections */}
      <div
        className="absolute left-[175px] top-0 bottom-0 w-0.5 pointer-events-none"
        style={{
          background: `repeating-linear-gradient(
            to bottom,
            ${accents.map((a) => a.track).join(", ")} 0px,
            ${accents.map((a) => a.track).join(", ")} 1px,
            transparent 1px,
            transparent 32px
          )`,
        }}
      />

      {path.units.map((unit: UnitNode, unitIdx: number) => {
        const accent = accents[unitIdx];
        return (
          <section key={unit.id} className="w-full flex flex-col items-center relative">
            {unitIdx === bannerIdx ? (
              <UnitBanner unit={unit} unitNumber={unitIdx + 1} accent={accent} />
            ) : (
              <UnitDivider unit={unit} accent={accent} />
            )}

            {/* Node trail — zigzag with a treasure chest mid-unit and Duo beside the active node */}
            <div
              className={`flex flex-col items-center relative ${
                unitIdx === bannerIdx ? "pt-16 pb-12" : "py-8"
              }`}
            >
              {/* Section-colored guideline dot per node row */}
              {unit.skills.map((skill: SkillNode, skillIdx: number) => (
                <div
                  key={skill.id}
                  className="absolute left-[175px] top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ marginTop: `${skillIdx * 92 + (unitIdx === bannerIdx ? 80 : 40)}px` }}
                >
                  <span
                    className="block w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: skill.state === "active" ? accent.banner : accent.track }}
                  />
                </div>
              ))}

              {unit.skills.map((skill: SkillNode, skillIdx: number) => (
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
                    <ChestIcon className="mt-9 h-20 w-20 drop-shadow-[0_6px_0_rgba(0,0,0,0.08)]" />
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

/** Colored banner for the current unit — "← SECTION N, UNIT N / topic" + guidebook. */
function UnitBanner({ unit, unitNumber, accent }: { unit: UnitNode; unitNumber: number; accent: ReturnType<typeof sectionAccent> }) {
  return (
    <div
      className="w-full rounded-2xl px-4 py-3 flex items-center gap-3 shadow-[0_4px_0_#00000010]"
      style={{ background: accent.banner, boxShadow: `0 4px 0 ${accent.shadow}` }}
      data-testid="unit-banner"
    >
      <button aria-label="Back" className="p-2 rounded-xl text-white hover:bg-white/10 shrink-0">
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
      <button className="flex items-center gap-2 shrink-0 rounded-xl bg-white px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white/90 shadow-[0_3px_0_rgba(0,0,0,0.15)] hover:bg-[#F7F7F7]">
        <GuidebookIcon className="h-5 w-5" />
        <span className="hidden sm:inline text-white" style={{ color: accent.shadow }}>Guidebook</span>
      </button>
    </div>
  );
}

/** Upcoming unit — a colored divider with the topic name, like "— Talk about your job —". */
function UnitDivider({ unit, accent }: { unit: UnitNode; accent: ReturnType<typeof sectionAccent> }) {
  return (
    <div className="w-full max-w-lg flex items-center gap-6 mt-16" data-testid="unit-divider">
      <span className="h-[2px] flex-1" style={{ background: accent.track }} />
      <span className="text-lg font-bold whitespace-nowrap" style={{ color: accent.dot }}>
        {topicOf(unit.title)}
      </span>
      <span className="h-[2px] flex-1" style={{ background: accent.track }} />
    </div>
  );
}
