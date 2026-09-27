/**
 * Formats a number as Indian Rupee (INR) using the en-IN locale.
 * Uses Indian numbering system (lakhs, crores).
 * Example: formatCurrency(142500) → "₹ 1,42,500.00"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Formats an audit log timestamp in Asia/Kolkata local time.
 * The API returns naive UTC datetimes (no offset suffix), so 'Z' is
 * appended before parsing — otherwise browsers treat the value as
 * local wall-clock time and the IST conversion is lost.
 * Example: formatAuditTimestamp("2026-08-23T04:06:48") → "23 Aug 2026 • 09:36:48 AM"
 */
export function formatAuditTimestamp(utcString: string): string {
  const hasOffset = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(utcString);
  const date = new Date(hasOffset ? utcString : `${utcString}Z`);

  if (Number.isNaN(date.getTime())) {
    return utcString;
  }

  const datePart = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(date);

  const timePart = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  })
    .format(date)
    .toUpperCase();

  return `${datePart} • ${timePart}`;
}
