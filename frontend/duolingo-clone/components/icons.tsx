/* Small inline SVG icons for the Duolingo-style UI (no external deps). */

/** Treasure chest — used on the path (gray) and in the quests nav/card (gold).
 * Uses the official Duolingo chest SVG paths; only the color tokens swap with the
 * `gold` flag. Size is controlled entirely by the passed `className` (no fixed
 * width/height), so it sits correctly in the nav at h-7 w-7. */
export function ChestIcon({ className, gold = false }: { className?: string; gold?: boolean }) {
  const wood = gold ? "#C8860A" : "#9A9A9A";
  const woodLight = gold ? "#E6A800" : "#D8D8D8";
  const woodLighter = gold ? "#F2C73E" : "#EDEDED";
  const woodDark = gold ? "#A06800" : "#898989";
  const plaque = gold ? "#B47C00" : "#BFBFBF";
  const highlight = gold ? "#FFF3CC" : "#C4C4C4";
  const shadow = gold ? "#8A5A00" : "#888888";
  const tint = gold ? "rgba(255, 215, 0, 0.35)" : "rgba(175, 175, 175, 0.30)";

  return (
    <svg
      viewBox="0 0 80 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect opacity="0.3" y="38" width="80" height="40" rx="4" fill={tint} />
      <path d="M8.28882 39.7366C8.28882 34.2001 12.777 29.7119 18.3135 29.7119H60.7557C66.2922 29.7119 70.7804 34.2001 70.7804 39.7366V66.3203C70.7804 68.5349 68.9851 70.3302 66.7705 70.3302H12.2987C10.0841 70.3302 8.28882 68.5349 8.28882 66.3203V39.7366Z" fill={wood} />
      <path d="M6.12195 25.2274C6.12195 19.6909 10.6102 15.2027 16.1467 15.2027H63.2628C68.7993 15.2027 73.2876 19.6909 73.2876 25.2274V55.051H6.12195V25.2274Z" fill={wood} />
      <rect x="3.10956" y="42.7716" width="73.8089" height="11.5284" fill={woodLight} />
      <path d="M67.0209 25.477H74.9174C76.0247 25.477 76.9223 26.3746 76.9223 27.4819V45.777H67.0209V25.477Z" fill={woodLight} />
      <path d="M3.10956 27.4819C3.10956 26.3746 4.0072 25.477 5.1145 25.477H11.5072C12.6145 25.477 13.5122 26.3746 13.5122 27.4819V43.7721C13.5122 44.8794 12.6145 45.777 11.5072 45.777H5.1145C4.0072 45.777 3.10956 44.8794 3.10956 43.7721V27.4819Z" fill={woodLight} />
      <path d="M6.12195 14.0049C6.12195 12.8976 7.01959 12 8.12689 12H18.6528C19.7601 12 20.6578 12.8976 20.6578 14.0049V34.5027H6.12195V14.0049Z" fill={woodLight} />
      <path d="M58.7524 14.0049C58.7524 12.8976 59.6501 12 60.7574 12H71.2833C72.3906 12 73.2883 12.8976 73.2883 14.0049V34.5027H58.7524V14.0049Z" fill={woodLight} />
      <path d="M6.25378 24.1446L20.6019 20.5723V33.2222L6.25378 33.0464V24.1446Z" fill={woodLighter} />
      <path d="M6.12195 31.725H20.6578V46.2197H6.12195V31.725Z" fill={plaque} />
      <path d="M6.12195 52.5436C6.12195 51.4363 7.01959 50.5386 8.12689 50.5386H18.6528C19.7601 50.5386 20.6578 51.4363 20.6578 52.5436V70.3903C20.6578 71.4976 19.7601 72.3953 18.6528 72.3953H8.12689C7.01959 72.3953 6.12195 71.4976 6.12195 70.3903V52.5436Z" fill={plaque} />
      <path d="M57.4348 52.5436C57.4348 51.4363 58.3325 50.5386 59.4398 50.5386H69.9657C71.073 50.5386 71.9707 51.4363 71.9707 52.5436V70.3903C71.9707 71.4976 71.073 72.3953 69.9657 72.3953H59.4398C58.3325 72.3953 57.4348 71.4976 57.4348 70.3903V52.5436Z" fill={plaque} />
      <rect x="58.7524" y="31.725" width="14.5358" height="14.4947" fill={plaque} />
      <rect x="36.9485" y="49.9128" width="5.51359" height="9.71144" fill={highlight} />
      <rect x="6.12195" y="55.3079" width="14.5358" height="4.88705" fill={wood} />
      <rect x="57.4348" y="55.3079" width="14.5358" height="4.88705" fill={wood} />
      <rect x="20.6531" y="63.818" width="36.7782" height="2.63149" fill={woodDark} />
      <rect x="20.6531" y="23.6395" width="38.0939" height="2.63149" fill={woodDark} />
      <rect opacity="0.92" x="20.6531" y="55.3079" width="36.7782" height="4.88705" fill={shadow} />
      <rect opacity="0.92" x="20.6531" y="35.3047" width="38.0939" height="7.46567" fill={woodDark} />
      <path d="M3.10956 46.2159H76.9185V55.3008C76.9185 56.4081 76.0208 57.3058 74.9135 57.3058H5.1145C4.0072 57.3058 3.10956 56.4081 3.10956 55.3008V46.2159Z" fill={plaque} />
      <rect x="28.9253" y="38.383" width="20.9266" height="18.2007" rx="3.00742" fill={woodLight} />
      <path d="M33.6012 38.383H31.9327C30.2718 38.383 28.9253 39.7294 28.9253 41.3904V53.5763C28.9253 55.2372 30.2718 56.5837 31.9327 56.5837H32.9367C33.4621 56.5837 33.8848 56.1518 33.8735 55.6265L33.6012 42.9729V38.383Z" fill={woodLighter} />
      <rect x="28.9253" y="42.8631" width="20.9266" height="17.9407" rx="3.00742" fill={plaque} />
      <ellipse cx="39.0436" cy="49.7057" rx="3.94723" ry="3.54472" fill={woodDark} />
      <path d="M38.147 51.6033C38.5164 50.8645 39.5708 50.8645 39.9402 51.6033L41.7365 55.1957C42.0698 55.8622 41.5852 56.6465 40.8399 56.6465H37.2473C36.5021 56.6465 36.0174 55.8622 36.3507 55.1957L38.147 51.6033Z" fill={woodDark} />
      <path d="M58.7855 16.3848L73.2562 12.8931V20.8578L58.7855 24.3496V16.3848Z" fill={woodLighter} />
      <rect x="20.4848" y="42.358" width="8.44234" height="3.80299" fill={woodLighter} />
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

/** Curved arrow / chevron used on action buttons (Duolingo-style). */
export function ArrowIcon({ className, fill = "currentColor" }: { className?: string; fill?: string }) {
  return (
    <svg width="42" height="34" viewBox="0 0 42 34" fill={fill} xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M18.7521 4.41157C19.6598 2.52948 22.3402 2.52948 23.2479 4.41157L25.8539 9.81517C26.225 10.5847 26.9639 11.1109 27.8125 11.2099L33.7906 11.9076C35.9269 12.1569 36.7684 14.8114 35.1658 16.2459L30.8845 20.0785C30.224 20.6697 29.9267 21.567 30.1035 22.4357L31.2468 28.053C31.6684 30.124 29.4857 31.7487 27.6228 30.7506L22.1786 27.8339C21.4424 27.4395 20.5576 27.4395 19.8214 27.8339L14.3772 30.7506C12.5143 31.7487 10.3316 30.124 10.7532 28.053L11.8965 22.4357C12.0733 21.567 11.776 20.6697 11.1155 20.0785L6.83415 16.2459C5.23162 14.8114 6.07307 12.1569 8.20939 11.9076L14.1875 11.2099C15.0361 11.1109 15.775 10.5847 16.1461 9.81517L18.7521 4.41157Z" />
    </svg>
  );
}
