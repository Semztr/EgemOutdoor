/**
 * Formatting utilities
 */

/**
 * Format price in Turkish locale
 * @param price - Price to format
 * @returns Formatted price string (e.g., "1.549,00")
 */
export const formatPrice = (price: number): string => {
  return price.toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Format currency with symbol
 * @param price - Price to format
 * @param symbol - Currency symbol (default: ₺)
 * @returns Formatted currency string (e.g., "₺1.549,00")
 */
export const formatCurrency = (price: number, symbol: string = '₺'): string => {
  return `${symbol}${formatPrice(price)}`;
};

/**
 * Format date in Turkish locale
 * @param date - Date to format
 * @returns Formatted date string (e.g., "29.10.2025")
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('tr-TR');
};

/**
 * Format datetime in Turkish locale
 * @param date - Date to format
 * @returns Formatted datetime string (e.g., "29.10.2025 15:30")
 */
export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('tr-TR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};
