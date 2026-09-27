from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.config import settings
from app.dependencies.database import get_db
from app.schemas.health import HealthResponse

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=HealthResponse, summary="System Health Check")
def health_check(db: Session = Depends(get_db)):
    """
    Check API and Database connectivity health status.
    No secrets are exposed in the response.
    """
    db_status = "connected"
    try:
        db.execute(text("SELECT 1"))
    except Exception:
        db_status = "disconnected"

    return HealthResponse(
        status="healthy",
        environment=settings.ENVIRONMENT,
        database=db_status,
        version=settings.VERSION,
    )
