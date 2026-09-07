"""FastAPI application entry point for the Duolingo clone.

Wires together the API routers and seeds the database on startup. The frontend
is hosted separately, so this app serves the backend API only.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db import SessionLocal, init_db
from app.routers.core import router as core_router
from app.routers.gamification import router as gamification_router
from app.routers.lessons import router as lessons_router
from app.services.seed import run_seed


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
            origin.strip()
            for origin in settings.cors_origins.split(",")
            if origin.strip()
        ],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(core_router)
    app.include_router(gamification_router)
    app.include_router(lessons_router)

    return app


app = create_app()
