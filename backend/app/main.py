"""FastAPI application entry point for the Duolingo clone.

Wires together the API routers, seeds the database on startup, and serves the
static frontend build (if present) via `app.frontend()`.
"""

from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db import SessionLocal, init_db
from app.routers.core import router as core_router
from app.services.seed import run_seed

# Default (development) location of the frontend static build.
FRONTEND_OUT = Path(__file__).resolve().parent.parent.parent / "frontend" / "duolingo-clone" / "out"


def create_app() -> FastAPI:
    app = FastAPI(title=settings.app_name)

    # Ensure schema exists (dev convenience; prod runs `alembic upgrade head`).
    init_db()

    # Seed the Hindi course + default learner on every startup (idempotent).
    with SessionLocal() as session:
        run_seed(session)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ],
        allow_credentials=False,
        allow_methods=["GET"],
        allow_headers=["Content-Type"],
    )

    app.include_router(core_router)

    # Serve the static frontend build when present (dev: not built yet → skip).
    if FRONTEND_OUT.is_dir():
        app.frontend("/", directory=FRONTEND_OUT, fallback="index.html", check_dir=False)

    return app


app = create_app()
