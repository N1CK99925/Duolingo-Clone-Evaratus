import { DailyQuest, SideQuest } from "@/lib/api";

/** Mocked quest list; progress is static until backend tracks quests. */
export const DAILY_QUESTS: DailyQuest[] = [
  { id: "d1", title: "Earn 10 XP", description: "Complete any lesson", icon: "⚡", progress: 0, goal: 10, xpReward: 5 },
  { id: "d2", title: "Keep your streak", description: "Log in for 1 day", icon: "🔥", progress: 0, goal: 1, xpReward: 10 },
  { id: "d3", title: "Answer 5 questions", description: "Complete exercises", icon: "🎯", progress: 0, goal: 5, xpReward: 8 },
];

export const SIDE_QUESTS: SideQuest[] = [
  { id: "s1", title: "Perfect lesson", description: "Get 100% on a lesson", icon: "💯", progress: 0, goal: 1, xpReward: 20, isActive: true },
  { id: "s2", title: "Rapid fire", description: "Answer 3 in under 30s", icon: "⚡", progress: 0, goal: 3, xpReward: 15, isActive: true },
  { id: "s3", title: "Word master", description: "Match 10 word pairs", icon: "🧩", progress: 0, goal: 10, xpReward: 25, isActive: false },
];