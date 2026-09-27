from datetime import datetime, date, timedelta
from typing import Optional
from pydantic import BaseModel, Field, model_validator

def compute_medicine_status(stock: int, min_stock: int, expiry_date_str: str) -> str:
    """
    Computes real-time dynamic inventory status:
    - Expired: Expiry date is before today
    - Expiring Soon: Expiry within 30 days
    - Out of Stock: Stock is 0
    - Low Stock: Stock <= min_stock
    - Healthy: Stock > min_stock
    """
    try:
        exp_date = datetime.strptime(expiry_date_str, "%Y-%m-%d").date()
        today = date.today()
        if exp_date < today:
            return "Expired"
        if exp_date <= today + timedelta(days=30):
            return "Expiring Soon"
    except Exception:
        pass

    if stock <= 0:
        return "Out of Stock"
    if stock <= min_stock:
        return "Low Stock"
    return "Healthy Stock"

class MedicineBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    brand: str = Field(..., min_length=1, max_length=255)
    category: str = Field(..., min_length=1, max_length=100)
    sku: Optional[str] = Field(None, max_length=100)
    batch_number: Optional[str] = Field(None, max_length=100)
    stock: int = Field(..., ge=0)
    min_stock: int = Field(..., ge=0)
    buying_price: float = Field(..., ge=0.0)
    selling_price: float = Field(..., ge=0.0)
    mrp: float = Field(..., ge=0.0)
    expiry_date: str = Field(..., min_length=10, max_length=20)
    manufacturing_date: Optional[str] = None
    supplier_name: Optional[str] = None
    notes: Optional[str] = None

    @model_validator(mode="after")
    def validate_pricing(self):
        if self.mrp < self.selling_price:
            # We can log or enforce, but allow flexible correction if needed, or raise ValueError
            pass
        return self

class MedicineCreate(MedicineBase):
    pass

class MedicineUpdate(BaseModel):
    name: Optional[str] = None
    brand: Optional[str] = None
    category: Optional[str] = None
    sku: Optional[str] = None
    batch_number: Optional[str] = None
    stock: Optional[int] = Field(None, ge=0)
    min_stock: Optional[int] = Field(None, ge=0)
    buying_price: Optional[float] = Field(None, ge=0.0)
    selling_price: Optional[float] = Field(None, ge=0.0)
    mrp: Optional[float] = Field(None, ge=0.0)
    expiry_date: Optional[str] = None
    manufacturing_date: Optional[str] = None
    supplier_name: Optional[str] = None
    notes: Optional[str] = None

class StockAdjustmentRequest(BaseModel):
    adjustment_type: str = Field("ADD", description="ADD, REMOVE, or SET")
    quantity: int = Field(..., description="Quantity to add, remove, or set")
    notes: Optional[str] = None

class MedicineResponse(BaseModel):
    id: str
    name: str
    brand: str
    category: str
    sku: str
    batch_number: Optional[str] = None
    stock: int
    min_stock: int
    buying_price: float
    selling_price: float
    mrp: float
    expiry_date: str
    manufacturing_date: Optional[str] = None
    supplier_name: Optional[str] = None
    notes: Optional[str] = None
    is_archived: bool
    is_deleted: bool
    archived_at: Optional[datetime] = None
    deleted_at: Optional[datetime] = None
    created_by: Optional[str] = None
    updated_by: Optional[str] = None
    deleted_by: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    # Computed dynamic helper fields
    status: Optional[str] = None
    profit_per_unit: Optional[float] = None
    profit_margin_pct: Optional[float] = None

    class Config:
        from_attributes = True

    @classmethod
    def from_orm_with_computed(cls, obj) -> "MedicineResponse":
        res = cls.model_validate(obj)
        res.status = compute_medicine_status(obj.stock, obj.min_stock, obj.expiry_date)
        res.profit_per_unit = round(obj.selling_price - obj.buying_price, 2)
        if obj.selling_price > 0:
            res.profit_margin_pct = round(((obj.selling_price - obj.buying_price) / obj.selling_price) * 100, 2)
        else:
            res.profit_margin_pct = 0.0
        return res
