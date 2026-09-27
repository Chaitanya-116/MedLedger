from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database.session import get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserStatusUpdate
from app.dependencies.auth import get_current_user, get_current_admin

router = APIRouter(prefix="/users", tags=["User Management"])

@router.get("/me", response_model=UserResponse)
def get_user_profile(current_user: User = Depends(get_current_user)):
    """
    Get current logged in user details.
    """
    return current_user

@router.get("", response_model=List[UserResponse])
def get_all_users(
    search: Optional[str] = Query(None, description="Search by full name or email"),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """
    Admin only: List all registered users with optional search filter.
    """
    query = db.query(User)
    if search and search.strip():
        search_pattern = f"%{search.strip()}%"
        query = query.filter(
            or_(
                User.full_name.ilike(search_pattern),
                User.email.ilike(search_pattern),
            )
        )
    users = query.order_by(User.created_at.desc()).all()
    return users

@router.patch("/{id}/status", response_model=UserResponse)
def update_user_status(
    id: str,
    payload: UserStatusUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """
    Admin only: Enable or disable user account.
    """
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    # Prevent admin from disabling themselves if desired, but allow changing others
    user.is_active = payload.is_active
    db.commit()
    db.refresh(user)
    return user

@router.delete("/{id}")
def delete_user(
    id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """
    Admin only: Delete user account.
    """
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    if user.id == admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own active admin session",
        )

    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}
