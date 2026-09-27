/**
 * Formats a numeric value as Indian Rupees (INR) using the en-IN locale.
 * Uses the Indian numbering system (e.g. ₹ 1,42,500.00).
 *
 * @param value - The number to format
 * @returns A formatted string like "₹ 18,450.00"
 */
const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatCurrency = (value: number): string => {
  return inrFormatter.format(value);
};

export default formatCurrency;
