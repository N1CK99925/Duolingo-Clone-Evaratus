"""Tests for VS1: health, user summary, and learning path endpoints."""


def test_health(client):
    resp = client.get("/api/health")
    assert resp.status_code == 200
    body = resp.json()
    assert body["status"] == "ok"
    assert body["app"] == "duolingo-backend"


def test_me_returns_default_learner(client):
    resp = client.get("/api/me")
    assert resp.status_code == 200
    body = resp.json()
    assert body["username"] == "learner"
    assert body["total_xp"] == 0
    assert body["gems"] == 0
    assert body["streak"] == 0
    assert body["hearts"] == 5
    assert body["max_hearts"] == 5


def test_path_returns_hindi_course(client):
    resp = client.get("/api/path")
    assert resp.status_code == 200
    body = resp.json()
    assert body["course_title"] == "Hindi"
    assert len(body["units"]) == 3

    # All skills across the course.
    total_skills = sum(len(u["skills"]) for u in body["units"])
    assert total_skills == 7  # 3 + 2 + 2


def test_path_node_states(client):
    """First skill is active; the rest are locked (nothing completed yet)."""
    resp = client.get("/api/path")
    body = resp.json()

    states = [s["state"] for u in body["units"] for s in u["skills"]]
    assert states[0] == "active"
    assert all(st == "locked" for st in states[1:])


def test_path_hierarchical_order(client):
    """Units and skills are returned in sort order."""
    resp = client.get("/api/path")
    body = resp.json()
    unit_titles = [u["title"] for u in body["units"]]
    assert unit_titles == [
        "Unit 1 — Letters & Basics",
        "Unit 2 — People & Animals",
        "Unit 3 — Food & Numbers",
    ]

    # First unit: Duolingo labels the alphabet skill in Devanagari and the
    # topic skills with their English course names (Basics 1, Intro).
    first_unit_skills = [s["title"] for s in body["units"][0]["skills"]]
    assert first_unit_skills == ["अक्षर", "Basics 1", "Intro"]


def test_seed_is_idempotent(client, db_engine):
    """Running seed twice should not duplicate course/user content."""
    from sqlalchemy import func, select
    from sqlalchemy.orm import sessionmaker

    from app.models.course import Course, Skill
    from app.models.user import User

    TestingSession = sessionmaker(bind=db_engine)
    with TestingSession() as session:
        from app.services.seed import run_seed

        run_seed(session)

        courses = session.execute(select(func.count(Course.id))).scalar_one()
        users = session.execute(select(func.count(User.id))).scalar_one()
        skills = session.execute(select(func.count(Skill.id))).scalar_one()

    assert courses == 1
    assert users == 10  # default learner + 9 seeded leaderboard rivals
    assert skills == 7
