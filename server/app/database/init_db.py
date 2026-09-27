from sqlalchemy.orm import Session
from app.models.user import User
from app.models.medicine import Medicine
from app.core.config import settings
from app.core.security import get_password_hash
from app.core.logging import logger


def _get_admin_seed_data() -> list[dict]:
    """
    Build admin seed list from environment variables.
    No credentials are hardcoded in source code.
    """
    admins = []

    if settings.ADMIN1_EMAIL and settings.ADMIN1_PASSWORD:
        admins.append({
            "full_name": settings.ADMIN1_NAME,
            "email": settings.ADMIN1_EMAIL,
            "password": settings.ADMIN1_PASSWORD,
        })

    if settings.ADMIN2_EMAIL and settings.ADMIN2_PASSWORD:
        admins.append({
            "full_name": settings.ADMIN2_NAME,
            "email": settings.ADMIN2_EMAIL,
            "password": settings.ADMIN2_PASSWORD,
        })

    return admins


INITIAL_MEDICINES = [
    {
        "name": "Amoxicillin 500mg Capsule",
        "brand": "Novartis",
        "sku": "MED-AMX-500",
        "category": "Antibiotics",
        "batch_number": "BAT-2026-01",
        "stock": 145,
        "min_stock": 30,
        "mrp": 128.50,
        "buying_price": 72.00,
        "selling_price": 98.00,
        "expiry_date": "2027-05-15",
        "manufacturing_date": "2024-05-15",
        "supplier_name": "MedLife Pharma Ltd",
        "notes": "Fast-moving broad spectrum antibiotic",
    },
    {
        "name": "Paracetamol 650mg Tablet",
        "brand": "GlaxoSmithKline",
        "sku": "MED-PCM-650",
        "category": "Analgesics",
        "batch_number": "BAT-2026-02",
        "stock": 18,
        "min_stock": 50,
        "mrp": 42.00,
        "buying_price": 18.50,
        "selling_price": 32.50,
        "expiry_date": "2026-11-20",
        "manufacturing_date": "2024-11-20",
        "supplier_name": "Apollo Dist",
        "notes": "Low stock alert triggered",
    },
    {
        "name": "Ciprofloxacin 500mg",
        "brand": "Bayer",
        "sku": "MED-CPR-500",
        "category": "Antibiotics",
        "batch_number": "BAT-2026-03",
        "stock": 42,
        "min_stock": 25,
        "mrp": 178.00,
        "buying_price": 95.00,
        "selling_price": 145.00,
        "expiry_date": "2026-09-12",
        "manufacturing_date": "2024-09-12",
        "supplier_name": "Bayer India",
        "notes": "Expiring within next month",
    },
    {
        "name": "Metformin 500mg SR",
        "brand": "Sanofi",
        "sku": "MED-MTF-500",
        "category": "Diabetes",
        "batch_number": "BAT-2026-04",
        "stock": 210,
        "min_stock": 40,
        "mrp": 88.00,
        "buying_price": 45.00,
        "selling_price": 68.00,
        "expiry_date": "2027-08-30",
        "manufacturing_date": "2024-08-30",
        "supplier_name": "Sanofi Healthcare",
        "notes": "Sustained release anti-diabetic",
    },
    {
        "name": "Atorvastatin 10mg",
        "brand": "Pfizer",
        "sku": "MED-ATV-010",
        "category": "Cardiology",
        "batch_number": "BAT-2026-05",
        "stock": 12,
        "min_stock": 30,
        "mrp": 238.00,
        "buying_price": 135.00,
        "selling_price": 195.00,
        "expiry_date": "2026-12-10",
        "manufacturing_date": "2024-12-10",
        "supplier_name": "Pfizer India",
        "notes": "Low stock cholesterol regulator",
    },
    {
        "name": "Azithromycin 250mg",
        "brand": "Cipla",
        "sku": "MED-AZT-250",
        "category": "Antibiotics",
        "batch_number": "BAT-2026-06",
        "stock": 95,
        "min_stock": 20,
        "mrp": 210.00,
        "buying_price": 118.00,
        "selling_price": 165.00,
        "expiry_date": "2027-01-18",
        "manufacturing_date": "2025-01-18",
        "supplier_name": "Cipla Distribution",
        "notes": "Standard 6-tablet pack",
    },
    {
        "name": "Omeprazole 20mg Capsule",
        "brand": "AstraZeneca",
        "sku": "MED-OMP-020",
        "category": "Gastroenterology",
        "batch_number": "BAT-2026-07",
        "stock": 110,
        "min_stock": 35,
        "mrp": 115.00,
        "buying_price": 58.00,
        "selling_price": 88.00,
        "expiry_date": "2026-09-28",
        "manufacturing_date": "2024-09-28",
        "supplier_name": "AstraZeneca Direct",
        "notes": "Proton pump inhibitor",
    },
]


def init_db(db: Session) -> None:
    """
    Seed initial Admin accounts and initial medicines if they do not exist.
    Admins are seeded from environment variables — no hardcoded credentials.
    Running this function multiple times will NOT create duplicate entries.
    """
    # ── Seed admin accounts from .env ────────────────────────────────────────
    for admin_data in _get_admin_seed_data():
        user = db.query(User).filter(User.email == admin_data["email"]).first()
        if not user:
            logger.info(f"Seeding Admin account: {admin_data['full_name']} ({admin_data['email']})")
            admin_user = User(
                full_name=admin_data["full_name"],
                email=admin_data["email"],
                password_hash=get_password_hash(admin_data["password"]),
                role="ADMIN",
                is_active=True,
            )
            db.add(admin_user)

    # ── Seed initial medicines if table is empty ─────────────────────────────
    if db.query(Medicine).count() == 0:
        logger.info("Seeding initial MedLedger medicines catalog...")
        for med_data in INITIAL_MEDICINES:
            med = Medicine(
                name=med_data["name"],
                brand=med_data["brand"],
                sku=med_data["sku"],
                category=med_data["category"],
                batch_number=med_data.get("batch_number"),
                stock=med_data["stock"],
                min_stock=med_data["min_stock"],
                mrp=med_data["mrp"],
                buying_price=med_data["buying_price"],
                selling_price=med_data["selling_price"],
                expiry_date=med_data["expiry_date"],
                manufacturing_date=med_data.get("manufacturing_date"),
                supplier_name=med_data.get("supplier_name"),
                notes=med_data.get("notes"),
                created_by=settings.ADMIN1_NAME,
                updated_by=settings.ADMIN1_NAME,
            )
            db.add(med)

    db.commit()
