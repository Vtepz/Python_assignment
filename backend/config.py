import os
from dotenv import load_dotenv
from sqlalchemy.engine import URL, make_url

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

    url = make_url(database_url)
    if url.drivername in ("postgres", "postgresql"):
        url = url.set(drivername="postgresql+psycopg")
    if "sslmode" not in url.query:
        url = url.update_query_dict({"sslmode": "require"})
    return url


def build_secret_key():
    secret_key = os.getenv("SECRET_KEY")
    if secret_key:
        return secret_key
    if os.getenv("FLASK_ENV") == "production":
        raise RuntimeError("SECRET_KEY must be set when FLASK_ENV=production")
    return "dev-secret-key"


class Config:
    SECRET_KEY = build_secret_key()
    SQLALCHEMY_DATABASE_URI = build_database_uri()
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JSON_SORT_KEYS = False
