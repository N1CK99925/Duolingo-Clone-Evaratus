"""Tests for path chest claims: one-time gem reward per unit."""


def test_chest_present_unclaimed_on_path(client):
    res = client.get("/api/path")
    assert res.status_code == 200
    unit = res.json()["units"][0]
    assert unit["chest"]["claimed"] is False
    assert unit["chest"]["reward"] > 0


def test_chest_claim_awards_gems_once(client):
    unit_id = client.get("/api/path").json()["units"][0]["id"]

    claim = client.post(f"/api/path/chests/{unit_id}/claim")
    assert claim.status_code == 200
    assert claim.json()["reward"] > 0
    assert claim.json()["gems"] == claim.json()["reward"]

    me = client.get("/api/me").json()
    assert me["gems"] == claim.json()["gems"]

    path = client.get("/api/path").json()
    claimed_unit = next(u for u in path["units"] if u["id"] == unit_id)
    assert claimed_unit["chest"]["claimed"] is True


def test_chest_cannot_be_claimed_twice(client):
    unit_id = client.get("/api/path").json()["units"][0]["id"]
    client.post(f"/api/path/chests/{unit_id}/claim")
    second = client.post(f"/api/path/chests/{unit_id}/claim")
    assert second.status_code == 409


def test_claim_unknown_unit_404(client):
    res = client.post("/api/path/chests/999999/claim")
    assert res.status_code == 404