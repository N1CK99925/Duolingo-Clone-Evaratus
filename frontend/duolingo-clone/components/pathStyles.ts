/** Path visuals: winding offsets, per-section accent colors, and title parsing. */

export interface Accent {
  banner: string;
  shadow: string;
  track: string;
  dot: string;
}

/* Winding-trail horizontal offsets (px), cycled per skill within a unit. */
export const OFFSETS = [0, 60, 110, 60, 0, -60, -110, -60];

/** Unit titles are seeded as "Unit 1 — Letters & Basics"; the part after " — " is the display topic. */
export function topicOf(title: string): string {
  const idx = title.indexOf(" — ");
  return idx >= 0 ? title.slice(idx + 3) : title;
}

/** Per-section accent color for the banner + guideline, cycling through the three sections. */
export function sectionAccent(unitIdx: number): Accent {
  return [
    { banner: "#58CC02", shadow: "#46A302", track: "#C8E6B0", dot: "#58CC02" }, // Section 1 — green
    { banner: "#CE82F7", shadow: "#A85DF0", track: "#E5C8F0", dot: "#CE82F7" }, // Section 2 — purple
    { banner: "#04CD9C", shadow: "#03A87C", track: "#A8E6DA", dot: "#04CD9C" }, // Section 3 — teal
  ][unitIdx % 3];
}