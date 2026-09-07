"use client";

import { api, PathResponse, SkillNode, UnitNode } from "@/lib/api";
import { SkillNodeComponent } from "./SkillNode";
import { BackArrowIcon, ChestIcon, GuidebookIcon } from "./icons";
import { useEffect, useRef, useState } from "react";

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
  const [viewIdx, setViewIdx] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const didInitialScroll = useRef(false);

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

  /* The sticky banner reflects whichever unit zone is currently scrolled into view. */
  useEffect(() => {
    if (!path) return;
    const compute = () => {
      const probe = 120; // units whose top passed just under the sticky banner
      let idx = 0;
      sectionRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= probe) idx = i;
      });
      setViewIdx(idx);
    };
    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [path]);

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

      {/* Sticky unit banner — shows the unit zone currently in view (any unit, prev or next). */}
      <div className="sticky top-14 lg:top-0 z-20 w-full">
        <UnitBanner
          key={viewIdx}
          unit={path.units[viewIdx]}
          unitNumber={viewIdx + 1}
          accent={accents[viewIdx]}
          isActive={viewIdx === activeIdx}
        />
      </div>

      {path.units.map((unit: UnitNode, unitIdx: number) => {
        const accent = accents[unitIdx];
        return (
          <section
            key={unit.id}
            ref={(el) => {
              sectionRefs.current[unitIdx] = el;
            }}
            className="w-full flex flex-col items-center relative"
          >

            {/* Node trail — zigzag with a treasure chest mid-unit and Duo beside the active node */}
            <div className="flex flex-col items-center relative pt-16 pb-12">
              {/* Section-colored guideline dot per node row */}
              {unit.skills.map((skill: SkillNode, skillIdx: number) => (
                <div
                  key={skill.id}
                  className="absolute left-[175px] top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ marginTop: `${skillIdx * 92 + 80}px` }}
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

/** Colored unit banner — "← SECTION N, UNIT N / topic" + guidebook, shown for every unit. */
function UnitBanner({
  unit,
  unitNumber,
  accent,
  isActive,
}: {
  unit: UnitNode;
  unitNumber: number;
  accent: ReturnType<typeof sectionAccent>;
  isActive: boolean;
}) {
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


