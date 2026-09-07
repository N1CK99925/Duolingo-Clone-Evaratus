/** HTTP client for the Duolingo clone backend. */

import {
  AnswerResult,
  LessonAnswer,
  LessonCompleteResult,
  LessonDetail,
} from "./lessonTypes";
import {
  ChestClaimResponse,
  HealthResponse,
  HeartsStatus,
  LeaderboardEntry,
  PathResponse,
  ProfileResponse,
  UserSummary,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? ""; // backend URL for dev; empty = same-origin (prod)

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    throw new Error(`${path}: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

async function postJson<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
  if (!res.ok) {
    throw new Error(`${path}: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export const api = {
  health: () => fetchJson<HealthResponse>("/api/health"),
  me: () => fetchJson<UserSummary>("/api/me"),
  path: () => fetchJson<PathResponse>("/api/path"),
  claimChest: (unitId: number) =>
    postJson<ChestClaimResponse>(`/api/path/chests/${unitId}/claim`),
  lesson: (lessonId: number) => fetchJson<LessonDetail>(`/api/lessons/${lessonId}`),
  submitAnswer: (
    lessonId: number,
    exerciseId: number,
    userAnswer: LessonAnswer,
    timeSpentMs?: number,
  ) =>
    postJson<AnswerResult>(
      `/api/lessons/${lessonId}/exercises/${exerciseId}/answer`,
      { user_answer: userAnswer, time_spent_ms: timeSpentMs ?? null },
    ),
  completeLesson: (lessonId: number) =>
    postJson<LessonCompleteResult>(`/api/lessons/${lessonId}/complete`),
  leaderboard: () => fetchJson<LeaderboardEntry[]>("/api/leaderboard"),
  profile: () => fetchJson<ProfileResponse>("/api/profile"),
  hearts: () => fetchJson<HeartsStatus>("/api/me/hearts"),
  refillHearts: () => postJson<HeartsStatus>("/api/me/hearts/refill"),
  reset: () => postJson<UserSummary>("/api/reset"),
};