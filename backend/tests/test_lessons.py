"""Tests for VS2: lesson player, exercise submission, hearts, and completion."""


def test_get_lesson_detail(client):
    """Fetch lesson detail and verify ordered exercises are present."""
    # Lesson 1 is seeded with skill 'अक्षर'
    resp = client.get("/api/lessons/1")
    assert resp.status_code == 200
    body = resp.json()
    assert body["id"] == 1
    assert body["xp_reward"] == 10
    assert len(body["exercises"]) >= 1

    first_ex = body["exercises"][0]
    assert first_ex["exercise_type"] == "multiple_choice"
    assert "prompt" in first_ex["exercise_data"]
    assert "choices" in first_ex["exercise_data"]


def test_get_lesson_not_found(client):
    resp = client.get("/api/lessons/99999")
    assert resp.status_code == 404


def test_submit_correct_answer(client):
    """Submitting correct choice keeps hearts unchanged."""
    lesson_resp = client.get("/api/lessons/1")
    exercise = lesson_resp.json()["exercises"][0]
    ex_id = exercise["id"]
    correct_idx = exercise["exercise_data"]["correct_index"]

    ans_resp = client.post(
        f"/api/lessons/1/exercises/{ex_id}/answer",
        json={"user_answer": correct_idx, "time_spent_ms": 1200},
    )
    assert ans_resp.status_code == 200
    body = ans_resp.json()
    assert body["is_correct"] is True
    assert body["current_hearts"] == 5
    assert body["is_out_of_hearts"] is False


def test_submit_wrong_answer_decrements_hearts(client):
    """Submitting wrong choice decrements hearts by 1."""
    lesson_resp = client.get("/api/lessons/1")
    exercise = lesson_resp.json()["exercises"][0]
    ex_id = exercise["id"]
    wrong_idx = 3  # correct_index is 0

    ans_resp = client.post(
        f"/api/lessons/1/exercises/{ex_id}/answer",
        json={"user_answer": wrong_idx},
    )
    assert ans_resp.status_code == 200
    body = ans_resp.json()
    assert body["is_correct"] is False
    assert body["current_hearts"] == 4
    assert body["is_out_of_hearts"] is False


def test_hearts_deplete_to_zero(client):
    """Multiple wrong answers reduce hearts to 0."""
    lesson_resp = client.get("/api/lessons/1")
    exercise = lesson_resp.json()["exercises"][0]
    ex_id = exercise["id"]

    for _ in range(5):
        ans_resp = client.post(
            f"/api/lessons/1/exercises/{ex_id}/answer",
            json={"user_answer": 99},
        )
        assert ans_resp.status_code == 200

    body = ans_resp.json()
    assert body["current_hearts"] == 0
    assert body["is_out_of_hearts"] is True


def test_complete_lesson_awards_xp_and_streak(client):
    """Completing lesson awards XP, records progress, and updates streak."""
    comp_resp = client.post("/api/lessons/1/complete")
    assert comp_resp.status_code == 200
    body = comp_resp.json()
    assert body["xp_awarded"] == 10
    assert body["total_xp"] == 10
    assert body["current_streak"] == 1
    assert body["skill_completed"] is True

    # Check /api/me updated
    me_resp = client.get("/api/me")
    me_body = me_resp.json()
    assert me_body["total_xp"] == 10
    assert me_body["streak"] == 1

    # Check /api/path shows first skill completed and second active
    path_resp = client.get("/api/path")
    path_body = path_resp.json()
    unit1_skills = path_body["units"][0]["skills"]
    assert unit1_skills[0]["state"] == "completed"
    assert unit1_skills[1]["state"] == "active"


def test_complete_lesson_fails_when_out_of_hearts(client):
    """Attempting to complete lesson with 0 hearts returns 400 error."""
    lesson_resp = client.get("/api/lessons/1")
    ex_id = lesson_resp.json()["exercises"][0]["id"]

    # Deplete hearts
    for _ in range(5):
        client.post(
            f"/api/lessons/1/exercises/{ex_id}/answer",
            json={"user_answer": 99},
        )

    comp_resp = client.post("/api/lessons/1/complete")
    assert comp_resp.status_code == 400
    assert "hearts" in comp_resp.json()["detail"].lower()
