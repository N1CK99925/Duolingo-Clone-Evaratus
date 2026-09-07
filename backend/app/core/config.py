"""Application settings and central configuration."""

from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parent.parent.parent

# data/ directory lives at the backend root (backend/data/duolingo.db)
DATA_DIR = BACKEND_DIR / "data"


class Settings(BaseSettings):
    """Application settings, overridable via environment variables."""

    app_name: str = "Duolingo Clone"
    database_url: str = f"sqlite:///{BACKEND_DIR / 'data' / 'duolingo.db'}"

    # Default (seeded) learner username. No real auth.
    default_username: str = "learner"

    model_config = SettingsConfigDict(env_prefix="DUO_", env_file=".env", extra="ignore")


settings = Settings()
