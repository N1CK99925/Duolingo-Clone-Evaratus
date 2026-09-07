"use client";

import { SkillNode } from "@/lib/api";

interface SkillNodeProps {
  skill: SkillNode;
  onClick: () => void;
}

/* Progress ring around the active "START" node: white track, green fill. */
function ProgressRing({ progress }: { progress: number }) {
  const size = 104;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  return (
    <svg
      className="absolute -top-4 left-1/2 pointer-events-none"
      width={size}
      height={size}
      style={{ transform: "translateX(-50%) rotate(-90deg)", filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.10))" }}
    >
      <circle cx={size / 2} cy={size / 2} r={r} stroke="#FFFFFF" strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="#58CC02"
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - progress)}
        strokeLinecap="round"
      />
    </svg>
  );
}

/** START bubble above the active node. */
function StartChip() {
  return (
    <>
      <span className="absolute -top-[52px] left-1/2 -translate-x-1/2 bg-white px-4 py-1.5 rounded-xl text-[13px] font-extrabold uppercase tracking-wide text-[#58CC02] whitespace-nowrap shadow-[0_3px_0_#E5E5E5]">
        Start
      </span>
      <span className="absolute -top-[26px] left-1/2 -translate-x-1/2 h-3 w-3 rotate-45 rounded-[2px] bg-white" />
    </>
  );
}

/** One lesson node on the path: green START (active), gray disc (locked), gold disc (completed). */
export function SkillNodeComponent({ skill, onClick }: SkillNodeProps) {
  const isLocked = skill.state === "locked";
  const isActive = skill.state === "active";
  const isCompleted = skill.state === "completed";
  const progress = skill.lesson_count > 0 ? Math.min(skill.lessons_completed / skill.lesson_count, 1) : 0;

  const disc = isActive
    ? "bg-[#58CC02] shadow-[0_8px_0_#46A302] active:shadow-[0_2px_0_#46A302] active:translate-y-[6px]"
    : isCompleted
      ? "bg-[#FFC800] shadow-[0_8px_0_#E6A800] active:shadow-[0_2px_0_#E6A800] active:translate-y-[6px]"
      : "bg-[#E5E5E5] shadow-[0_8px_0_#C8C8C8] active:shadow-[0_2px_0_#C8C8C8] active:translate-y-[6px]";

  return (
    <button
      onClick={isLocked ? undefined : onClick}
      disabled={isLocked}
      aria-label={`${skill.title}: ${skill.state}`}
      className="relative flex flex-col items-center group cursor-pointer disabled:cursor-not-allowed outline-none"
    >
      {isActive && (
        <>
          <StartChip />
          <ProgressRing progress={progress} />
        </>
      )}
      <span
        className={`flex items-center justify-center rounded-full transition-all duration-75 select-none ${
          isActive ? "h-[72px] w-[72px]" : "h-[68px] w-[68px]"
        } ${disc}`}
      >
        <img
          src={
            isActive || isCompleted
              ? "/assets/icons/STAR_COMPLETE.svg"
              : "/assets/icons/STAR_INCOMPLETE.svg"
          }
          alt=""
          className={`h-8 w-8 ${isActive || isCompleted ? "brightness-0 invert" : ""}`}
        />
      </span>
    </button>
  );
}
