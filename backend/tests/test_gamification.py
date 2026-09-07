"""Tests for VS4: streak, daily goal, leaderboard, profile achievements."""

from datetime import datetime, timedelta

from sqlalchemy import select

from app.core.config import settings
from app.models.course import Lesson
from app.models.gamification import Streak
from app.services.gamification import update_achievements, update_streak


def _get_user(db_session):
    from app.models.user import User

    return db_session.execute(
        select(User).where(User.username == settings.default_username)
    ).scalar_one()


def _first_lesson_id(db_session) -> int:
    return db_session.execute(select(Lesson).order_by(Lesson.id)).scalars().first().id


# --- Streak -----------------------------------------------------------------


def test_streak_increments_on_consecutive_days(db_session):
    user = _get_user(db_session)
    base = datetime.utcnow()

    update_streak(db_session, user.id, base)
    update_streak(db_session, user.id, base + timedelta(days=1))
    update_streak(db_session, user.id, base + timedelta(days=2))

    streak = db_session.execute(
        select(Streak).where(Streak.user_id == user.id)
    ).scalar_one()
    assert streak.current_streak == 3
    assert streak.longest_streak == 3


def test_streak_breaks_on_gap(db_session):
    user = _get_user(db_session)
    base = datetime.utcnow()

    update_streak(db_session, user.id, base)
    update_streak(db_session, user.id, base + timedelta(days=1))  # streak = 2
    update_streak(db_session, user.id, base + timedelta(days=5))  # 3-day gap

    streak = db_session.execute(
        select(Streak).where(Streak.user_id == user.id)
    ).scalar_one()
    assert streak.current_streak == 1  # reset, not incremented
    assert streak.longest_streak == 2  # longest is preserved


def test_streak_same_day_counts_once(db_session):
    user = _get_user(db_session)
    base = datetime.utcnow()

    update_streak(db_session, user.id, base)
    update_streak(db_session, user.id, base + timedelta(hours=2))

    streak = db_session.execute(
        select(Streak).where(Streak.user_id == user.id)
    ).scalar_one()
    assert streak.current_streak == 1


# --- Leaderboard ------------------------------------------------------------


def test_leaderboard_seeded_competitive_and_ranked(client):
    resp = client.get("/api/leaderboard")
    assert resp.status_code == 200
    entries = resp.json()

    # Default learner + 9 seeded rivals.
    assert len(entries) == 10

    # Seeded rivals have real XP, so the board is competitive.
    assert max(e["weekly_xp"] for e in entries) >= 100

    # Sorted descending with 1-based ranks.
    xps = [e["weekly_xp"] for e in entries]
    assert xps == sorted(xps, reverse=True)
    assert [e["rank"] for e in entries] == list(range(1, len(entries) + 1))

    # Exactly one marked entry: the current learner.
    mine = [e for e in entries if e["is_current_user"]]
    assert len(mine) == 1
    assert mine[0]["username"] == "learner"
    assert mine[0]["rank"] == 10  # 0 XP = last place


def test_leaderboard_position_after_earning_xp(client, db_session):
    lesson_id = _first_lesson_id(db_session)

    # Two lessons = 20 XP: past the weakest rival (15 XP), still behind the next.
    client.post(f"/api/lessons/{lesson_id}/complete")
    resp = client.post(f"/api/lessons/{lesson_id}/complete")
    assert resp.status_code == 200

    entries = client.get("/api/leaderboard").json()
    mine = next(e for e in entries if e["is_current_user"])
    assert mine["weekly_xp"] == 20
    assert mine["rank"] == 9


# --- XP persistence ---------------------------------------------------------


def test_total_xp_accumulates_on_repeat_completions(client, db_session):
    """users.total_xp keeps accumulating across completions (persistence check)."""
    lesson_id = _first_lesson_id(db_session)

    resp = client.post(f"/api/lessons/{lesson_id}/complete")
    assert resp.status_code == 200
    assert resp.json()["total_xp"] == 10

    resp = client.post(f"/api/lessons/{lesson_id}/complete")
    assert resp.status_code == 200
    assert resp.json()["total_xp"] == 20

    me = client.get("/api/me").json()
    assert me["total_xp"] == 20



# --- Daily goal -------------------------------------------------------------


def test_daily_goal_progress_from_lesson(client, db_session):
    before = client.get("/api/profile").json()
    assert before["today_xp"] == 0
    assert before["daily_goal_xp"] == 50

    client.post(f"/api/lessons/{_first_lesson_id(db_session)}/complete")

    after = client.get("/api/profile").json()
    assert after["today_xp"] == 10
    assert after["daily_goal_xp"] == 50


def test_daily_goal_config(client):
    resp = client.patch("/api/profile/daily-goal", json={"target_xp": 120})
    assert resp.status_code == 200
    assert resp.json()["daily_goal_xp"] == 120

    profile = client.get("/api/profile").json()
    assert profile["daily_goal_xp"] == 120

    # Out-of-range targets are rejected.
    assert client.patch("/api/profile/daily-goal", json={"target_xp": 0}).status_code == 422
    assert client.patch("/api/profile/daily-goal", json={"target_xp": 501}).status_code == 422


# --- Achievements -----------------------------------------------------------


def test_achievements_progress_and_unlock(client, db_session):
    profile = client.get("/api/profile").json()
    by_key = {a["id"]: a for a in profile["achievements"]}
    assert set(by_key) == {"first_lesson", "xp_100", "streak_7", "gem_collector"}
    assert all(not a["unlocked"] for a in by_key.values())

    # Completing the first lesson unlocks first_lesson and moves xp_100.
    resp = client.post(f"/api/lessons/{_first_lesson_id(db_session)}/complete")
    assert resp.status_code == 200

    profile = client.get("/api/profile").json()
    by_key = {a["id"]: a for a in profile["achievements"]}
    assert by_key["first_lesson"]["unlocked"] is True
    assert by_key["first_lesson"]["progress"] == 1
    assert by_key["xp_100"]["unlocked"] is False
    assert by_key["xp_100"]["progress"] == 10

    # Hitting the XP threshold unlocks xp_100 on the next recompute.
    user = _get_user(db_session)
    user.total_xp = 100
    db_session.commit()
    update_achievements(db_session, user)

    profile = client.get("/api/profile").json()
    by_key = {a["id"]: a for a in profile["achievements"]}
    assert by_key["xp_100"]["unlocked"] is True
    assert by_key["xp_100"]["progress"] == 100
