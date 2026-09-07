/** Core domain types shared across the Duolingo clone frontend. */

export interface UserSummary {
  id: number;
  username: string;
  total_xp: number;
  gems: number;
  streak: number;
  hearts: number;
  max_hearts: number;
}

export interface SkillNode {
  id: number;
  title: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  state: "locked" | "active" | "completed" | "available";
  lessons_completed: number;
  lesson_count: number;
  first_lesson_id: number | null;
}

export interface ChestInfo {
  reward: number;
  claimed: boolean;
}

export interface UnitNode {
  id: number;
  title: string;
  description: string | null;
  sort_order: number;
  skills: SkillNode[];
  chest: ChestInfo;
}

export interface ChestClaimResponse {
  reward: number;
  gems: number;
}

export interface PathResponse {
  course_id: number;
  course_title: string;
  units: UnitNode[];
}

export interface HealthResponse {
  status: string;
  app: string;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: number;
  username: string;
  weekly_xp: number;
  is_current_user: boolean;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  max_progress: number;
}

export interface ProfileResponse {
  username: string;
  joined_date: string;
  streak: number;
  total_xp: number;
  gems: number;
  daily_goal_xp: number;
  today_xp: number;
  achievements: AchievementItem[];
}

/** Mocked quest shape; progress is static until the backend tracks quests. */
export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  goal: number;
  xpReward: number;
}

export interface SideQuest extends DailyQuest {
  isActive: boolean;
}

export interface HeartsStatus {
  current_hearts: number;
  max_hearts: number;
  next_refill_at: string | null;
  is_out_of_hearts: boolean;
}