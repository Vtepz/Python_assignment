import os
from dotenv import load_dotenv
from sqlalchemy.engine import URL

load_dotenv()


def build_database_uri():
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        return URL.create(
            "postgresql+psycopg",
            username=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASSWORD", "postgres"),
            host=os.getenv("DB_HOST", "localhost"),
            port=int(os.getenv("DB_PORT", "5432")),
            database=os.getenv("DB_NAME", "hrm_system"),
        )

    # Beginner-friendly repair for passwords containing @ in DATABASE_URL.
    # Example: postgresql+psycopg://postgres:pa@ss@localhost:5432/hrm_system
    if "://" in database_url and "@" in database_url:
        drivername, rest = database_url.split("://", 1)
        credentials, location = rest.rsplit("@", 1)
        if ":" in credentials:
            username, password = credentials.split(":", 1)
            host_port, _, database = location.partition("/")
            host, _, port = host_port.partition(":")
            return URL.create(
                drivername,
                username=username,
                password=password,
                host=host,
                port=int(port) if port else None,
                database=database or None,
            )

    return database_url


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
    SQLALCHEMY_DATABASE_URI = build_database_uri()
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JSON_SORT_KEYS = False
