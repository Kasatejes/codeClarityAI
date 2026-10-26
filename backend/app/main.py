import logging
from typing import Optional
from fastapi import FastAPI, Request, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.models import (
    AnalyzeResponse,
    HealthResponse,
    HintRequest,
    HintResponse,
)
from app.services.ai_service import (
    analyze_code,
    generate_hint,
    check_ollama_available,
    get_active_provider,
)

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("codeclarity")

app = FastAPI(
    title="CodeClarity AI",
    description="Gemma 4-Powered AI Coding Tutor Backend",
    version="1.0.0",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permissive for MVP frontend communication
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "app": "CodeClarity AI",
        "description": "Gemma 4-Powered AI Coding Tutor",
        "docs": "/docs",
        "health": "/api/health",
    }


@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    """
    Report application health, model status, and connectivity
    without exposing secrets or keys.
    """
    provider, model = get_active_provider()
    is_key_present = bool(settings.GEMINI_API_KEY)
    
    # Check ollama status quickly
    ollama_up = await check_ollama_available()

    return HealthResponse(
        status="healthy",
        provider=provider,
        model=model,
        api_key_configured=is_key_present,
        ollama_url=settings.OLLAMA_BASE_URL,
        ollama_model=settings.OLLAMA_MODEL_NAME if ollama_up else f"{settings.OLLAMA_MODEL_NAME} (Offline)",
        supported_languages=["python", "cpp"],
    )


@app.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze_endpoint(request: Request):
    """
    Analyze code and optional error text or screenshot.
    Supports both JSON payloads and multipart/form-data with image uploads.
    """
    code = ""
    language = "python"
    error_message = ""
    image_bytes = None
    mime_type = None

    content_type = request.headers.get("content-type", "")

    if "multipart/form-data" in content_type:
        form = await request.form()
        code = str(form.get("code") or "").strip()
        language = str(form.get("language") or "python").strip().lower()
        error_message = str(form.get("error_message") or "").strip()

        file_obj = form.get("image")
        if file_obj and hasattr(file_obj, "filename") and file_obj.filename:
            # Check content type
            mime_type = file_obj.content_type or "image/png"
            if mime_type not in settings.ALLOWED_IMAGE_TYPES:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Unsupported image format: {mime_type}. Allowed: PNG, JPG, JPEG.",
                )

            # Read and validate size
            image_bytes = await file_obj.read()
            if len(image_bytes) > settings.MAX_IMAGE_BYTES:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Image size ({len(image_bytes)/(1024*1024):.2f}MB) exceeds limit of {settings.MAX_IMAGE_SIZE_MB}MB.",
                )
    else:
        # JSON body
        try:
            body = await request.json()
            code = str(body.get("code") or "").strip()
            language = str(body.get("language") or "python").strip().lower()
            error_message = str(body.get("error_message") or "").strip()
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid request body. Expected JSON or multipart/form-data.",
            )

    # Validation: user must provide either code or an image
    if not code and not image_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide code to analyze or upload a screenshot.",
        )

    # Validate supported languages
    if language not in ["python", "cpp", "c++"]:
        language = "python"  # Default fallback

    try:
        response = await analyze_code(
            code=code,
            language=language,
            error_message=error_message,
            image_bytes=image_bytes,
            mime_type=mime_type,
        )
        return response
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Error during code analysis: {exc}", exc_info=True)
        # Never expose private API keys in error responses
        safe_msg = str(exc)
        if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY in safe_msg:
            safe_msg = safe_msg.replace(settings.GEMINI_API_KEY, "[REDACTED]")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis failed: {safe_msg}",
        )


@app.post("/api/hint", response_model=HintResponse)
async def hint_endpoint(request: Request):
    """
    Return a requested progressive hint level: 'gentle', 'detailed', or 'solution'.
    """
    try:
        body = await request.json()
        req = HintRequest(**body)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid hint request payload: {str(e)}",
        )

    if not req.code.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Code is required to generate a progressive hint.",
        )

    if req.level not in ["gentle", "detailed", "solution"]:
        req.level = "gentle"

    try:
        hint_res = await generate_hint(
            level=req.level,
            code=req.code,
            language=req.language,
            error_message=req.error_message,
            context=req.context,
        )
        return hint_res
    except Exception as exc:
        logger.error(f"Error generating hint: {exc}", exc_info=True)
        safe_msg = str(exc)
        if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY in safe_msg:
            safe_msg = safe_msg.replace(settings.GEMINI_API_KEY, "[REDACTED]")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Hint generation failed: {safe_msg}",
        )
