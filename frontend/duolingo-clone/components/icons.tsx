/* Small inline SVG icons for the Duolingo-style UI (no external deps). */

export function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

/** Treasure chest — used on the path (gray) and in the quests nav/card (gold). */
export function ChestIcon({ className, gold = false }: { className?: string; gold?: boolean }) {
  const body = gold ? "#FFC800" : "#D9D9D9";
  const lid = gold ? "#E6A800" : "#C8C8C8";
  const lock = gold ? "#B47C00" : "#AFAFAF";
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M3 10c0-3.3 2.7-6 6-6h6c3.3 0 6 2.7 6 6v2H3v-2z" fill={lid} />
      <rect x="3" y="12" width="18" height="8" rx="1.5" fill={body} />
      <rect x="3" y="11" width="18" height="2" fill={lid} />
      <rect x="10" y="9.5" width="4" height="5" rx="1" fill={lock} />
      <circle cx="12" cy="11.5" r="0.9" fill="#fff" opacity="0.7" />
    </svg>
  );
}

/** "Letters" nav icon — blue stylized letter mark. */
export function LettersIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#1CB0F6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 4l7 16M12 4L5 20" transform="translate(3.5 0)" />
      <path d="M2 12h6" />
      <path d="M16 12h6" />
    </svg>
  );
}

/** Profile nav icon — gray person silhouette. */
export function PersonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 21c0-3.9 3.1-6.5 7-6.5s7 2.6 7 6.5" />
    </svg>
  );
}

/** "More" nav icon — purple circle with dots. */
export function MoreIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" fill="#CE82FF" />
      <circle cx="7.5" cy="12" r="1.4" fill="#fff" />
      <circle cx="12" cy="12" r="1.4" fill="#fff" />
      <circle cx="16.5" cy="12" r="1.4" fill="#fff" />
    </svg>
  );
}

/** Lightning bolt — daily quest XP icon. */
export function BoltIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13 2L4.5 14H10l-1 8 8.5-12H12l1-8z" />
    </svg>
  );
}

/** Wooden league shield — leaderboards card. */
export function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 2l8 3v6.5c0 4.8-3.4 8.2-8 10.5-4.6-2.3-8-5.7-8-10.5V5l8-3z" fill="#C08A3E" />
      <path d="M12 2l8 3v6.5c0 4.8-3.4 8.2-8 10.5V2z" fill="#A5712C" />
      <path d="M9 7.5c1.5 1 3 2.5 3 4.5 0-2 1.5-3.5 3-4.5" stroke="#F3D8A4" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/** Open book — guidebook button. */
export function GuidebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z" />
      <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
      <path d="M9 7h7M9 11h7" />
    </svg>
  );
}

/** Back arrow — green unit banner. */
export function BackArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}
