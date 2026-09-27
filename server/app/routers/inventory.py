from typing import List, Optional
from datetime import datetime, timezone
import random
import json
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database.session import get_db
from app.models.user import User
from app.models.medicine import Medicine
from app.models.audit_log import AuditLog
from app.schemas.medicine import (
    MedicineCreate,
    MedicineUpdate,
    MedicineResponse,
    StockAdjustmentRequest,
    compute_medicine_status,
)
from app.schemas.audit_log import AuditLogResponse
from app.dependencies.auth import get_current_user, get_current_admin

router = APIRouter(prefix="/inventory", tags=["Inventory Management"])

def generate_sku(name: str, category: str) -> str:
    """Helper to generate a clean SKU like MED-AMX-500 or MED-PAR-4829"""
    clean_name = "".join(c for c in name if c.isalnum() or c.isspace())
    parts = clean_name.upper().split()
    prefix = "MED"
    code = parts[0][:3] if parts else "GEN"
    rand_suffix = f"{random.randint(100, 999)}"
    return f"{prefix}-{code}-{rand_suffix}"

def log_audit(
    db: Session,
    user: User,
    medicine_id: Optional[str],
    medicine_name: str,
    action: str,
    old_val: Optional[dict] = None,
    new_val: Optional[dict] = None,
):
    """Helper to record audit trail in database"""
    entry = AuditLog(
        user_name=user.full_name,
        user_email=user.email,
        medicine_id=medicine_id,
        medicine_name=medicine_name,
        action=action,
        old_value=json.dumps(old_val, default=str) if old_val else None,
        new_value=json.dumps(new_val, default=str) if new_val else None,
    )
    db.add(entry)

# ─────────────────────────────────────────────────────────────────────────────
# READ ENDPOINTS (Admin & Staff Users)
# ─────────────────────────────────────────────────────────────────────────────

@router.get("", response_model=List[MedicineResponse])
def get_active_inventory(
    search: Optional[str] = Query(None, description="Search across Name, Brand, SKU, Category, Supplier"),
    category: Optional[str] = Query(None, description="Filter by Category"),
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by Computed Status"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get all active (non-archived, non-deleted) medicines with optional search and filters.
    Accessible by both ADMIN and USER roles.
    """
    query = db.query(Medicine).filter(
        Medicine.is_archived == False,
        Medicine.is_deleted == False,
    )

    if category and category != "All":
        query = query.filter(Medicine.category == category)

    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Medicine.name.ilike(term),
                Medicine.brand.ilike(term),
                Medicine.sku.ilike(term),
                Medicine.category.ilike(term),
                Medicine.supplier_name.ilike(term),
            )
        )

    medicines = query.order_by(Medicine.created_at.desc()).all()
    results = [MedicineResponse.from_orm_with_computed(m) for m in medicines]

    # In-memory status filter if supplied
    if status_filter and status_filter != "All":
        results = [r for r in results if r.status == status_filter]

    return results

@router.get("/archived", response_model=List[MedicineResponse])
def get_archived_inventory(
    search: Optional[str] = Query(None, description="Search archived medicines"),
    category: Optional[str] = Query(None, description="Filter by Category"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get all archived medicines.
    """
    query = db.query(Medicine).filter(
        Medicine.is_archived == True,
        Medicine.is_deleted == False,
    )

    if category and category != "All":
        query = query.filter(Medicine.category == category)

    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Medicine.name.ilike(term),
                Medicine.brand.ilike(term),
                Medicine.sku.ilike(term),
                Medicine.category.ilike(term),
                Medicine.supplier_name.ilike(term),
            )
        )

    medicines = query.order_by(Medicine.archived_at.desc()).all()
    return [MedicineResponse.from_orm_with_computed(m) for m in medicines]

@router.get("/deleted", response_model=List[MedicineResponse])
def get_recently_deleted_inventory(
    search: Optional[str] = Query(None, description="Search recently deleted medicines"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get all soft-deleted medicines.
    """
    query = db.query(Medicine).filter(Medicine.is_deleted == True)

    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Medicine.name.ilike(term),
                Medicine.brand.ilike(term),
                Medicine.sku.ilike(term),
                Medicine.category.ilike(term),
            )
        )

    medicines = query.order_by(Medicine.deleted_at.desc()).all()
    return [MedicineResponse.from_orm_with_computed(m) for m in medicines]

@router.get("/search", response_model=List[MedicineResponse])
def search_inventory(
    q: str = Query(..., min_length=1, description="Search term"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Rapid search endpoint for autocomplete & billing search.
    """
    term = f"%{q.strip()}%"
    medicines = (
        db.query(Medicine)
        .filter(
            Medicine.is_archived == False,
            Medicine.is_deleted == False,
            or_(
                Medicine.name.ilike(term),
                Medicine.brand.ilike(term),
                Medicine.sku.ilike(term),
                Medicine.category.ilike(term),
            ),
        )
        .limit(20)
        .all()
    )
    return [MedicineResponse.from_orm_with_computed(m) for m in medicines]

@router.get("/audit-logs", response_model=List[AuditLogResponse])
def get_inventory_audit_logs(
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get recent inventory audit logs.
    """
    logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(limit).all()
    return logs

@router.get("/{id}", response_model=MedicineResponse)
def get_medicine_by_id(
    id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get single medicine details.
    """
    medicine = db.query(Medicine).filter(Medicine.id == id).first()
    if not medicine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Medicine not found",
        )
    return MedicineResponse.from_orm_with_computed(medicine)

# ─────────────────────────────────────────────────────────────────────────────
# WRITE ENDPOINTS (Admin Only)
# ─────────────────────────────────────────────────────────────────────────────

@router.post("", response_model=MedicineResponse, status_code=status.HTTP_201_CREATED)
def create_medicine(
    payload: MedicineCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """
    Admin only: Add new medicine SKU to inventory.
    """
    # Auto-generate SKU if not supplied
    final_sku = payload.sku.strip() if payload.sku and payload.sku.strip() else generate_sku(payload.name, payload.category)

    # Check for duplicate SKU
    existing = db.query(Medicine).filter(Medicine.sku == final_sku).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Medicine SKU '{final_sku}' already exists. Please choose a unique SKU.",
        )

    new_med = Medicine(
        name=payload.name.strip(),
        brand=payload.brand.strip(),
        category=payload.category.strip(),
        sku=final_sku,
        batch_number=payload.batch_number.strip() if payload.batch_number else None,
        stock=payload.stock,
        min_stock=payload.min_stock,
        buying_price=payload.buying_price,
        selling_price=payload.selling_price,
        mrp=payload.mrp,
        expiry_date=payload.expiry_date.strip(),
        manufacturing_date=payload.manufacturing_date.strip() if payload.manufacturing_date else None,
        supplier_name=payload.supplier_name.strip() if payload.supplier_name else None,
        notes=payload.notes.strip() if payload.notes else None,
        created_by=admin.full_name,
        updated_by=admin.full_name,
    )
    db.add(new_med)
    db.flush()

    # Audit log
    log_audit(
        db=db,
        user=admin,
        medicine_id=new_med.id,
        medicine_name=new_med.name,
        action="Medicine Added",
        new_val={
            "sku": new_med.sku,
            "stock": new_med.stock,
            "buying_price": new_med.buying_price,
            "selling_price": new_med.selling_price,
            "mrp": new_med.mrp,
            "expiry_date": new_med.expiry_date,
        },
    )

    db.commit()
    db.refresh(new_med)
    return MedicineResponse.from_orm_with_computed(new_med)

@router.put("/{id}", response_model=MedicineResponse)
def update_medicine(
    id: str,
    payload: MedicineUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """
    Admin only: Update full medicine details.
    """
    medicine = db.query(Medicine).filter(Medicine.id == id).first()
    if not medicine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Medicine not found",
        )

    # Capture old values for audit
    old_data = {
        "name": medicine.name,
        "stock": medicine.stock,
        "min_stock": medicine.min_stock,
        "buying_price": medicine.buying_price,
        "selling_price": medicine.selling_price,
        "mrp": medicine.mrp,
        "expiry_date": medicine.expiry_date,
    }

    # If SKU is updated, check uniqueness
    if payload.sku and payload.sku != medicine.sku:
        existing_sku = db.query(Medicine).filter(Medicine.sku == payload.sku, Medicine.id != id).first()
        if existing_sku:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"SKU '{payload.sku}' is already assigned to another medicine.",
            )
        medicine.sku = payload.sku

    update_dict = payload.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        if key != "sku" and hasattr(medicine, key):
            setattr(medicine, key, value)

    medicine.updated_by = admin.full_name
    medicine.updated_at = datetime.now(timezone.utc)

    # Audit log
    log_audit(
        db=db,
        user=admin,
        medicine_id=medicine.id,
        medicine_name=medicine.name,
        action="Medicine Updated",
        old_val=old_data,
        new_val={
            "name": medicine.name,
            "stock": medicine.stock,
            "min_stock": medicine.min_stock,
            "buying_price": medicine.buying_price,
            "selling_price": medicine.selling_price,
            "mrp": medicine.mrp,
            "expiry_date": medicine.expiry_date,
        },
    )

    db.commit()
    db.refresh(medicine)
    return MedicineResponse.from_orm_with_computed(medicine)

@router.patch("/{id}/stock", response_model=MedicineResponse)
def adjust_medicine_stock(
    id: str,
    payload: StockAdjustmentRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """
    Admin only: Adjust stock with Add Stock, Remove Stock, or Set Stock.
    Prevents stock from falling below zero.
    """
    medicine = db.query(Medicine).filter(Medicine.id == id).first()
    if not medicine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Medicine not found",
        )

    old_stock = medicine.stock
    adj_type = payload.adjustment_type.upper()

    if adj_type == "ADD":
        new_stock = old_stock + payload.quantity
        action_name = "Stock Increased"
    elif adj_type == "REMOVE":
        if payload.quantity > old_stock:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot remove {payload.quantity} units. Current stock is only {old_stock} units.",
            )
        new_stock = old_stock - payload.quantity
        action_name = "Stock Reduced"
    elif adj_type == "SET":
        if payload.quantity < 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Stock quantity cannot be negative.",
            )
        new_stock = payload.quantity
        action_name = "Stock Increased" if new_stock >= old_stock else "Stock Reduced"
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid adjustment type. Must be 'ADD', 'REMOVE', or 'SET'.",
        )

    medicine.stock = new_stock
    medicine.updated_by = admin.full_name
    medicine.updated_at = datetime.now(timezone.utc)

    # Audit log
    log_audit(
        db=db,
        user=admin,
        medicine_id=medicine.id,
        medicine_name=medicine.name,
        action=action_name,
        old_val={"stock": old_stock},
        new_val={"stock": new_stock, "delta": new_stock - old_stock, "notes": payload.notes},
    )

    db.commit()
    db.refresh(medicine)
    return MedicineResponse.from_orm_with_computed(medicine)

@router.patch("/{id}/archive", response_model=MedicineResponse)
def archive_medicine(
    id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """
    Admin only: Move medicine to Archived Medicines.
    """
    medicine = db.query(Medicine).filter(Medicine.id == id).first()
    if not medicine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Medicine not found",
        )

    medicine.is_archived = True
    medicine.archived_at = datetime.now(timezone.utc)
    medicine.updated_by = admin.full_name

    log_audit(
        db=db,
        user=admin,
        medicine_id=medicine.id,
        medicine_name=medicine.name,
        action="Medicine Archived",
    )

    db.commit()
    db.refresh(medicine)
    return MedicineResponse.from_orm_with_computed(medicine)

@router.patch("/{id}/restore", response_model=MedicineResponse)
def restore_medicine(
    id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """
    Admin only: Restore medicine from Archived or Recently Deleted back to Active inventory.
    """
    medicine = db.query(Medicine).filter(Medicine.id == id).first()
    if not medicine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Medicine not found",
        )

    was_deleted = medicine.is_deleted
    was_archived = medicine.is_archived

    medicine.is_archived = False
    medicine.is_deleted = False
    medicine.archived_at = None
    medicine.deleted_at = None
    medicine.deleted_by = None
    medicine.updated_by = admin.full_name

    log_audit(
        db=db,
        user=admin,
        medicine_id=medicine.id,
        medicine_name=medicine.name,
        action="Medicine Restored",
        old_val={"was_deleted": was_deleted, "was_archived": was_archived},
    )

    db.commit()
    db.refresh(medicine)
    return MedicineResponse.from_orm_with_computed(medicine)

@router.patch("/{id}/soft-delete", response_model=MedicineResponse)
def soft_delete_medicine(
    id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """
    Admin only: Move medicine to Recently Deleted.
    """
    medicine = db.query(Medicine).filter(Medicine.id == id).first()
    if not medicine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Medicine not found",
        )

    medicine.is_deleted = True
    medicine.deleted_at = datetime.now(timezone.utc)
    medicine.deleted_by = admin.full_name
    medicine.updated_by = admin.full_name

    log_audit(
        db=db,
        user=admin,
        medicine_id=medicine.id,
        medicine_name=medicine.name,
        action="Medicine Deleted",
    )

    db.commit()
    db.refresh(medicine)
    return MedicineResponse.from_orm_with_computed(medicine)

@router.delete("/{id}")
def permanently_delete_medicine(
    id: str,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    """
    Admin only: Permanently delete medicine from database.
    """
    medicine = db.query(Medicine).filter(Medicine.id == id).first()
    if not medicine:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Medicine not found",
        )

    med_name = medicine.name
    med_sku = medicine.sku

    log_audit(
        db=db,
        user=admin,
        medicine_id=medicine.id,
        medicine_name=med_name,
        action="Medicine Permanently Deleted",
        old_val={"sku": med_sku},
    )

    db.delete(medicine)
    db.commit()
    return {"message": f"Medicine '{med_name}' ({med_sku}) permanently deleted from database."}
