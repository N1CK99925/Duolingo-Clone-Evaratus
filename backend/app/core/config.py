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

    # VS3: Set to True during development to give players unlimited lives.
    infinite_hearts: bool = False

    # Allowed browser origins (comma-separated via DUO_CORS_ORIGINS). The
    # frontend is hosted separately, so its deployed URL must be listed here.
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"

    model_config = SettingsConfigDict(env_prefix="DUO_", env_file=".env", extra="ignore")


settings = Settings()
