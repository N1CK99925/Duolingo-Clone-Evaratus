"""Tests for the /api/reset endpoint."""

from fastapi.testclient import TestClient


def test_reset_clears_progress_and_reseeds_defaults(client: TestClient) -> None:
    lesson = client.get("/api/lessons/1").json()
    answers = {ex["exercise_type"]: ex for ex in lesson["exercises"]}
    assert "tap_words" in answers and "type_answer" in answers

    first = answers["multiple_choice"]
    client.post(f"/api/lessons/1/exercises/{first['id']}/answer", json={"user_answer": 0})
    client.post("/api/lessons/1/complete")
    after_complete = client.get("/api/me").json()
    assert after_complete["total_xp"] > 0

    fresh = client.post("/api/reset").json()
    assert fresh["total_xp"] == 0
    assert fresh["streak"] == 0
    assert fresh["hearts"] == fresh["max_hearts"] > 0

    me = client.get("/api/me").json()
    assert me["total_xp"] == 0