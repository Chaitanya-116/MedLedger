export type MedicineStatus =
  | 'Healthy Stock'
  | 'Low Stock'
  | 'Out of Stock'
  | 'Expiring Soon'
  | 'Expired';

export type InventoryViewMode = 'active' | 'archived' | 'deleted';

export interface Medicine {
  id: string;
  name: string;
  brand: string;
  category: string;
  sku: string;
  batch_number?: string | null;
  stock: number;
  min_stock: number;
  buying_price: number;
  selling_price: number;
  mrp: number;
  expiry_date: string;
  manufacturing_date?: string | null;
  supplier_name?: string | null;
  notes?: string | null;
  is_archived: boolean;
  is_deleted: boolean;
  archived_at?: string | null;
  deleted_at?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
  deleted_by?: string | null;
  created_at: string;
  updated_at: string;
  status?: MedicineStatus;
  profit_per_unit?: number;
  profit_margin_pct?: number;
}

export interface CreateMedicineDto {
  name: string;
  brand: string;
  category: string;
  sku?: string;
  batch_number?: string;
  stock: number;
  min_stock: number;
  buying_price: number;
  selling_price: number;
  mrp: number;
  expiry_date: string;
  manufacturing_date?: string;
  supplier_name?: string;
  notes?: string;
}

export interface UpdateMedicineDto {
  name?: string;
  brand?: string;
  category?: string;
  sku?: string;
  batch_number?: string;
  stock?: number;
  min_stock?: number;
  buying_price?: number;
  selling_price?: number;
  mrp?: number;
  expiry_date?: string;
  manufacturing_date?: string;
  supplier_name?: string;
  notes?: string;
}

export interface StockAdjustmentDto {
  adjustment_type: 'ADD' | 'REMOVE' | 'SET';
  quantity: number;
  notes?: string;
}

export interface AuditLogItem {
  id: string;
  user_name: string;
  user_email: string;
  medicine_id?: string | null;
  medicine_name: string;
  action: string;
  old_value?: string | null;
  new_value?: string | null;
  created_at: string;
}
