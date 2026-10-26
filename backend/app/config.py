import os
from pathlib import Path
from dotenv import load_dotenv

# Search for .env in current dir, backend dir, or project root
current_dir = Path(__file__).resolve().parent
backend_dir = current_dir.parent
project_root = backend_dir.parent

load_dotenv(backend_dir / ".env")
load_dotenv(project_root / ".env")
load_dotenv()


class Settings:
    # Gemma 4 on Gemini API configuration
    # Official Gemma 4 identifier: gemma-4-26b-a4b-it
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "").strip()
    GEMMA_MODEL_NAME: str = os.getenv("GEMMA_MODEL_NAME", "gemma-4-26b-a4b-it").strip()

    # Provider: "google", "ollama", or "auto"
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "auto").strip().lower()

    # Ollama configuration
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434").rstrip("/")
    OLLAMA_MODEL_NAME: str = os.getenv("OLLAMA_MODEL_NAME", "gemma4").strip()

    # Limits and constraints
    MAX_IMAGE_SIZE_MB: int = int(os.getenv("MAX_IMAGE_SIZE_MB", "5"))
    MAX_IMAGE_BYTES: int = MAX_IMAGE_SIZE_MB * 1024 * 1024
    ALLOWED_IMAGE_TYPES: set = {"image/png", "image/jpeg", "image/jpg"}

    # CORS origins
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*",  # Permissive for local MVP development
    ]


settings = Settings()
