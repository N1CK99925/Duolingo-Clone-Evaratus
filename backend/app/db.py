"""Database connection, engine, session factory, and model metadata."""

from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.core.config import DATA_DIR, settings


def build_database_url() -> str:
    """Return the SQLite URL, creating the data directory and resolving an absolute path."""
    url = settings.database_url
    if url.startswith("sqlite:///"):
        db_path = Path(url.replace("sqlite:///", ""))
        if not db_path.is_absolute():
            db_path = DATA_DIR / db_path.name
        db_path.parent.mkdir(parents=True, exist_ok=True)
        return f"sqlite:///{db_path}"
    return url


DATABASE_URL = build_database_url()
CONNECT_KWARGS = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=CONNECT_KWARGS)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """Declarative base for all ORM models."""


def init_db() -> None:
    """Create tables from model metadata. Safe to call on every startup.

    Migrations are the source of truth (alembic); create_all here only as a
    development convenience fallback. Production always runs `alembic upgrade head`.
    """
    import app.models  # noqa: F401

    Base.metadata.create_all(bind=engine)


def get_db():
    """FastAPI dependency yielding a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
