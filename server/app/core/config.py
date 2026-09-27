from typing import List, Optional, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Centralized application configuration.
    All values are loaded from environment variables / .env file.
    No secrets are hardcoded in source code.
    """

    # ── Application ──────────────────────────────────────────────────────────
    APP_NAME: str = "MedLedger"
    APP_ENV: str = "development"
    APP_HOST: str = "127.0.0.1"
    APP_PORT: int = 8000
    DEBUG: bool = True
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Alias so both ENVIRONMENT and APP_ENV work (legacy compat)
    @property
    def ENVIRONMENT(self) -> str:
        return self.APP_ENV

    # ── Security & JWT ───────────────────────────────────────────────────────
    SECRET_KEY: str  # REQUIRED — no default; forces explicit configuration
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # ── Database ─────────────────────────────────────────────────────────────
    DATABASE_URL: str = "sqlite:///./medledger.db"

    # ── CORS ─────────────────────────────────────────────────────────────────
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, list):
            return v
        import json
        return json.loads(v)

    # ── Seed Admin Accounts ──────────────────────────────────────────────────
    ADMIN1_NAME: str = "M. Srinivasa Rao"
    ADMIN1_EMAIL: str = "srinivasa.rao@medledger.io"
    ADMIN1_PASSWORD: str = ""

    ADMIN2_NAME: str = "M. Chaitanya"
    ADMIN2_EMAIL: str = "chaitanya@medledger.io"
    ADMIN2_PASSWORD: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
