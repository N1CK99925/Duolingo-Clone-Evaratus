"use client";

import { SkillNode } from "@/lib/api";

interface SkillNodeProps {
  skill: SkillNode;
  onClick: () => void;
  accent?: { banner: string; shadow: string; track: string; dot: string };
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

/** One lesson node on the path: colored START (active), gray disc (locked), gold disc (completed).
 * The star image is replaced by the Duolingo arrow SVG (white fill). On colored
 * discs (active/completed) it gets inverted so it reads against the background. */
export function SkillNodeComponent({ skill, onClick, accent }: SkillNodeProps) {
  const isLocked = skill.state === "locked";
  const isActive = skill.state === "active";
  const isCompleted = skill.state === "completed";
  const progress = skill.lesson_count > 0 ? Math.min(skill.lessons_completed / skill.lesson_count, 1) : 0;

  const bannerColor = accent?.banner ?? "#58CC02";
  const shadowColor = accent?.shadow ?? "#46A302";

  const disc = isActive
    ? `bg-[${bannerColor}] shadow-[0_8px_0_${shadowColor}] active:shadow-[0_2px_0_${shadowColor}] active:translate-y-[6px]`
    : isCompleted
      ? "bg-[#FFC800] shadow-[0_8px_0_#E6A800] active:shadow-[0_2px_0_#E6A800] active:translate-y-[6px]"
    : "bg-[#E5E5E5] shadow-[0_8px_0_#C8C8C8] active:shadow-[0_2px_0_#C8C8C8] active:translate-y-[6px]";

  const iconColor = isActive || isCompleted ? "white" : "#AFAFAF";
  const iconInverse = isActive || isCompleted;

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
        <svg width="31" height="29" viewBox="0 0 31 29" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${isActive ? "w-[30px] h-[28px]" : "w-[26px] h-[24px]"}`} style={isActive ? { filter: `drop-shadow(0 0 4px ${bannerColor})` } : undefined}>
          <path d="M13.6986 1.91157C14.6063 0.0294775 17.2868 0.0294775 18.1944 1.91157L20.8004 7.31517C21.1715 8.08468 21.9105 8.61088 22.759 8.70992L28.7372 9.40762C30.8735 9.65695 31.7149 12.3114 30.1124 13.7459L25.831 17.5785C25.1705 18.1697 24.8732 19.067 25.05 19.9357L26.1934 25.553C26.6149 27.624 24.4322 29.2487 22.5693 28.2506L17.1251 25.3339C16.3889 24.9395 15.5042 24.9395 14.768 25.3339L9.32375 28.2506C7.46081 29.2487 5.27815 27.624 5.69969 25.553L6.84305 19.9357C7.01986 19.067 6.72258 18.1697 6.06207 17.5785L1.78069 13.7459C0.178152 12.3114 1.0196 9.65695 3.15592 9.40762L9.13405 8.70992C9.98261 8.61088 10.7215 8.08468 11.0926 7.31517L13.6986 1.91157Z" fill={iconColor} />
        </svg>
      </span>
    </button>
  );
}
