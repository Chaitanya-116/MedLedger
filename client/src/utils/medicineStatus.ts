import { MedicineStatus } from '../types/inventory';

/**
 * Derives the display status of a medicine locally so the UI reacts
 * in real time without waiting for a server-side recomputation.
 * Shared by the desktop table and the mobile medicine cards.
 */
export const computeMedicineStatus = (
  stock: number,
  minStock: number,
  expiryDateStr: string
): MedicineStatus => {
  try {
    const expDate = new Date(expiryDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (expDate < today) {
      return 'Expired';
    }

    const thirtyDaysAhead = new Date();
    thirtyDaysAhead.setDate(today.getDate() + 30);
    if (expDate <= thirtyDaysAhead) {
      return 'Expiring Soon';
    }
  } catch {
    // Ignore parse errors
  }

  if (stock <= 0) {
    return 'Out of Stock';
  }
  if (stock <= minStock) {
    return 'Low Stock';
  }
  return 'Healthy Stock';
};
