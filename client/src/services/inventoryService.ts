import apiClient from '../api/axios';
import {
  Medicine,
  CreateMedicineDto,
  UpdateMedicineDto,
  StockAdjustmentDto,
  AuditLogItem,
} from '../types/inventory';

export const inventoryService = {
  /**
   * Fetch all active (non-archived, non-deleted) medicines
   */
  async getActiveInventory(params?: {
    search?: string;
    category?: string;
    status?: string;
  }): Promise<Medicine[]> {
    const res = await apiClient.get<any, Medicine[]>('/inventory', { params });
    return res;
  },

  /**
   * Fetch all archived medicines
   */
  async getArchivedInventory(params?: {
    search?: string;
    category?: string;
  }): Promise<Medicine[]> {
    const res = await apiClient.get<any, Medicine[]>('/inventory/archived', {
      params,
    });
    return res;
  },

  /**
   * Fetch all recently soft-deleted medicines
   */
  async getRecentlyDeletedInventory(params?: {
    search?: string;
  }): Promise<Medicine[]> {
    const res = await apiClient.get<any, Medicine[]>('/inventory/deleted', {
      params,
    });
    return res;
  },

  /**
   * Get single medicine by ID
   */
  async getMedicineById(id: string): Promise<Medicine> {
    const res = await apiClient.get<any, Medicine>(`/inventory/${id}`);
    return res;
  },

  /**
   * Admin only: Add new medicine SKU
   */
  async createMedicine(data: CreateMedicineDto): Promise<Medicine> {
    const res = await apiClient.post<any, Medicine>('/inventory', data);
    return res;
  },

  /**
   * Admin only: Update medicine details
   */
  async updateMedicine(id: string, data: UpdateMedicineDto): Promise<Medicine> {
    const res = await apiClient.put<any, Medicine>(`/inventory/${id}`, data);
    return res;
  },

  /**
   * Admin only: Adjust stock (+/- quantity or set)
   */
  async adjustStock(
    id: string,
    data: StockAdjustmentDto
  ): Promise<Medicine> {
    const res = await apiClient.patch<any, Medicine>(
      `/inventory/${id}/stock`,
      data
    );
    return res;
  },

  /**
   * Admin only: Move medicine to archived
   */
  async archiveMedicine(id: string): Promise<Medicine> {
    const res = await apiClient.patch<any, Medicine>(
      `/inventory/${id}/archive`
    );
    return res;
  },

  /**
   * Admin only: Restore medicine back to active inventory
   */
  async restoreMedicine(id: string): Promise<Medicine> {
    const res = await apiClient.patch<any, Medicine>(
      `/inventory/${id}/restore`
    );
    return res;
  },

  /**
   * Admin only: Soft delete medicine (move to recently deleted)
   */
  async softDeleteMedicine(id: string): Promise<Medicine> {
    const res = await apiClient.patch<any, Medicine>(
      `/inventory/${id}/soft-delete`
    );
    return res;
  },

  /**
   * Admin only: Permanently delete medicine from database
   */
  async permanentlyDeleteMedicine(id: string): Promise<{ message: string }> {
    const res = await apiClient.delete<any, { message: string }>(
      `/inventory/${id}`
    );
    return res;
  },

  /**
   * Fetch recent inventory audit logs
   */
  async getAuditLogs(limit: number = 50): Promise<AuditLogItem[]> {
    const res = await apiClient.get<any, AuditLogItem[]>(
      '/inventory/audit-logs',
      { params: { limit } }
    );
    return res;
  },
};

export default inventoryService;
