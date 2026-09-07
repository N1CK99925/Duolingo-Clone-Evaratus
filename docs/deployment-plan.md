# Deployment Plan — Dockerized Backend on Render + Frontend on Vercel

Status: **Plan** (nothing here has been applied yet). Goal: take the current repo —
an offline-exported Next.js frontend and a FastAPI + SQLite backend — and host it so
it is reachable on the public internet.

## 1. What gets deployed where

| Piece     | Host     | Mechanism                                  | Why                                           |
|-----------|----------|--------------------------------------------|-----------------------------------------------|
| Backend API | **Render** (web service) | Docker container built from `backend/Dockerfile` | Render runs Docker containers; free tier    |
| Frontend    | **Vercel**            | Native Next.js deploy (no Docker)          | Vercel does not run Docker; Next.js is first-class there |
| Database    | Render container disk | SQLite file inside the container image     | Keeps the stack unchanged for the demo        |

**Why the frontend is NOT dockerized.** Vercel is a serverless platform — it builds
your Next.js repo directly, and it cannot run arbitrary containers. Putting a Docker
image in front of a static export only adds a moving part (an nginx container) that
Vercel would serve behind a serverless origin anyway. Dockerizing just the backend is
the minimal change that works; it is exactly the boundary the codebase already drew
(`app.frontend()` was removed — the frontend is hosted separately and only talks to the
API over HTTP).

## 2. Current-code constraints this plan works within

- **Frontend is a static export.** `next.config.ts` sets `output: "export"`; `npm run
  build` writes `out/`. That means `NEXT_PUBLIC_BACKEND_URL` is baked into the bundle at
  **build time**, not read at runtime.
- **Backend seeds on startup.** `app.main.create_app()` runs `init_db()` (idempotent
  `create_all`) and `run_seed()` on every boot. A fresh container is usable with no
  manual steps. This makes DB *restart* harmless — but see §8 for SQLite persistence.
- **SQLite path is configurable.** `backend/app/core/config.py` reads `DUO_DATABASE_URL`
  (default `sqlite:///backend/data/duolingo.db`). `backend/app/db.py` auto-creates the
  parent directory, so the container works with an empty image.
- **CORS is config-driven.** `DUO_CORS_ORIGINS` (comma-separated) becomes
  `allow_origins`. The Vercel origin must be listed (or bypassed via §7's proxy).
- **Port.** `backend/main.py` runs uvicorn on `8000`. Render injects `PORT`; the image
  must bind to `$PORT`.

## 3. Files to create

### 3.1 `backend/Dockerfile`

Builder is unnecessary — there is no frontend to build in the image. Single stage:

```dockerfile
# Build context: repo root (compare Render blueprint below).
FROM python:3.12-slim

WORKDIR /app

# Runtime deps only (pulled explicitly; the image never runs tests/alembic).
RUN pip install --no-cache-dir \
    "fastapi>=0.141.0" \
    "uvicorn[standard]>=0.30" \
    "pydantic-settings>=2.0" \
    "sqlalchemy>=2.0" \
    "pydantic>=2.7"

COPY backend/ ./

# Run unprivileged; the data dir is created at runtime by db.py.
RUN useradd --create-home --uid 10001 appuser \
    && mkdir -p /app/data && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD python -c "import urllib.request;urllib.request.urlopen('http://127.0.0.1:${PORT:-8000}/api/health')"

# Render injects PORT; default to 8000 locally. reload is for dev only — never here.
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
```

### 3.2 `backend/.dockerignore`

```gitignore
__pycache__/
*.pyc
.venv/
data/*.db
.pytest_cache/
tests/
```

### 3.3 `render.yaml` (repo root — Render blueprint)

```yaml
services:
  - type: web
    name: duo-backend
    runtime: docker
    repo: https://github.com/<your-username>/Duolingo-Clone-Evaratus
    dockerfilePath: backend/Dockerfile
    plan: free            # see §9 for disk/keep-awake caveats
    healthCheckPath: /api/health
    autoDeploy: true
    envVars:
      - key: DUO_CORS_ORIGINS
        value: https://<your-app>.vercel.app,http://localhost:3000
      # Only if you add a persistent disk (§8, option B):
      # - key: DUO_DATABASE_URL
      #   value: sqlite:////var/data/duolingo.db
```

`healthCheckPath` keeps the service unsleeped after deploy and fails deploy if the API
does not come up. The Dockerfile's `cmd` already honors `PORT`.

### 3.4 Optional: `frontend/duolingo-clone/vercel.json` (same-origin API proxy)

Skip this file if you use the direct `NEXT_PUBLIC_BACKEND_URL` approach (§6, option A).
Use it for option B (§7) to route `/api/*` from Vercel to Render and avoid CORS entirely:

```json
{
  "rewrites": [{ "source": "/api/:path*", "destination": "https://<render-url>.onrender.com/api/:path*" }]
}
```

With this file present, build with `NEXT_PUBLIC_BACKEND_URL` empty (unset) — the client
already falls back to same-origin (`lib/client.ts` line 19).

## 4. Backend → Render (step by step)

1. Push repo to GitHub (it is a single monorepo: `backend/` + `frontend/`).
2. Create the service:
   - Render Dashboard → **New → Blueprint** → select the repo (uses `render.yaml`), **or**
   - **New → Web Service** → repo → *Runtime: Docker* → verify it finds
     `backend/Dockerfile`.
3. Set **Health Check Path** to `/api/health`.
4. Set `DUO_CORS_ORIGINS` to include your final Vercel domain (edit after first deploy —
   the plan is the same).
5. Deploy. Watch the logs until `Uvicorn running on http://0.0.0.0:$PORT` appears.
6. Smoke-test: `<render-url>/api/health` returns `{"status":"ok",...}`.

It works immediately with a fresh DB because startup seeds the whole Hindi course +
`learner` user (see §2).

## 5. Frontend → Vercel (step by step)

1. Vercel → **Add New Project** → import the same repo.
2. Set **Root Directory** to `frontend/duolingo-clone`.
3. Framework preset: **Next.js** (Vercel auto-detects).
4. Build command `npm run build`, output directory `out/`.
5. Environment variable at project level:
   - Option A (direct): `NEXT_PUBLIC_BACKEND_URL = https://<render-url>.onrender.com`
   - Option B (proxy): leave unset; add `vercel.json` from §3.4.
6. Deploy. Note: changes to `NEXT_PUBLIC_BACKEND_URL` require a **redeploy** because
   static export bakes it in — and `next build` must run (Vercel does this on every
   deploy). Add both localhost and the Render origin to `DUO_CORS_ORIGINS` if using
   Option A.

## 6. Which API-config option to choose

| | A. Direct cross-origin | B. Vercel rewrites proxy |
|---|---|---|
| Setup | 1 env var on each side | 1 JSON file + no env var |
| CORS | Must list Vercel origin in `DUO_CORS_ORIGINS` | None needed (same-origin) |
| Failure mode | CORS errors if origin forgotten | Proxy hides backend URL; rewrite adds one hop |

**Recommendation: Option B.** It deletes the whole CORS axis for a 3-line JSON file and
matches the client's existing same-origin default. Option A remains as the "plain" path
if you would rather keep frontend and API URLs explicit.

## 7. Environment summary

| Variable | Set on | Value |
|----------|--------|-------|
| `PORT` | Render (auto) | Injected; Dockerfile `cmd` binds to it |
| `DUO_CORS_ORIGINS` | Render | `https://<app>.vercel.app,http://localhost:3000` |
| `DUO_DATABASE_URL` | Render (opt.) | `sqlite:////var/data/duolingo.db` when using a disk mount |
| `NEXT_PUBLIC_BACKEND_URL` | Vercel | Render URL (Option A) or empty (Option B) |

## 8. The SQLite persistence caveat (read this before hosting)

The demo database is a file. On Render's **free/standard tiers the filesystem is
ephemeral**: on every redeploy or service restart the container is rebuilt and the DB
reverts to a fresh, auto-seeded state — **all progress resets**. For a demo of the
assignment this is acceptable (the app is designed to be always-evergreen). If you want
real persistence, in order of effort:

- **A. Accept resets (free).** Default. Nothing to do. State survives single minutes,
  not holidays; restarts wipe progress.
- **B. Render persistent disk (~$ /mo).** Add to the blueprint:
  ```yaml
      disk:
        name: data
        mountPath: /var/data
        sizeGB: 1
  ```
  and set `DUO_DATABASE_URL=sqlite:////var/data/duolingo.db`. Data survives deploys.
- **C. Postgres (free on Render).** Point `DUO_DATABASE_URL` at the Postgres URL and add
  `psycopg[binary]` to the Dockerfile `pip install` line. The code already branches on
  `sqlite` for connect args and `create_all`+seed works on `create_engine`'s dialect, so
  this is a small, independent change — do it only if you suspect the DB will outgrow a
  file.

## 9. Cost, limits, gotchas

- Render **free**: sleeps after ~15 min idle — first request after sleep takes tens of
  seconds (cold start). A `cron` job or the disk bit move it to "always on" paid tiers
  if the lag bothers you.
- Vercel **Hobby**: free; static site is cheap to serve. No sleep.
- Image size: `python:3.12-slim` + 5 deps ≈ 200–300 MB — well within limits; the
  `.dockerignore` keeps the build context small.
- `reload=True` lives in `backend/main.py` only; the Docker `CMD` never uses it.
- Time zone: container is UTC — streak/day boundaries follow UTC, same as local today.

## 10. Verification checklist (after both deploys)

- [ ] `<render-url>/api/health` → `{"status":"ok"}`
- [ ] Vercel home page shows the learning path with 3 unit banners (no dotted line)
- [ ] START a lesson from the active skill; complete all 5 exercise types
- [ ] XP increments and streak = 1 on the sidebar
- [ ] Leaderboards, profile, settings pages load (no CORS errors in the console)
- [ ] Hard-refresh the browser; state persists while the container hasn't restarted

## 11. Teardown / rollback

- Vercel: remove the project (or redeploy any earlier git ref).
- Render: delete the web service; delete the blueprint in **Blueprints**.
- Redeploys are cheap: both are git-triggered, so a redeploy *is* the rollback for an
  application change.

## 12. Manual steps to actually complete this (only a human can do them)

1. Create the GitHub repo / push this repo to GitHub.
2. Create the Vercel project, note the generated `*.vercel.app` URL.
3. Create the Render service (Blueprint auto-fills from `render.yaml`); set
   `DUO_CORS_ORIGINS` to the Vercel URL.
4. If using Option B, add `frontend/duolingo-clone/vercel.json` and redeploy the
   frontend.
5. Optionally wire a custom domain on either side.

The three new files in §3 are code and can be created now; steps 2–5 wait on accounts
and credentials.