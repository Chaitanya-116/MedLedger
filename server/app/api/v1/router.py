from fastapi import APIRouter
from app.routers.health import router as health_router
from app.routers.auth import router as auth_router
from app.routers.user import router as user_router
from app.routers.inventory import router as inventory_router

api_router = APIRouter()

# Mount routers
api_router.include_router(health_router, prefix="", tags=["Health"])
api_router.include_router(auth_router, prefix="", tags=["Authentication"])
api_router.include_router(user_router, prefix="", tags=["User Management"])
api_router.include_router(inventory_router, prefix="", tags=["Inventory Management"])
