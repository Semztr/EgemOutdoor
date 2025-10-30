/**
 * Input validation and sanitization utilities
 * Helps prevent XSS and other injection attacks
 */

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone validation (Turkish format)
export function isValidPhone(phone: string): boolean {
  // Accepts: 05551234567, 0555 123 45 67, +90 555 123 45 67
  const phoneRegex = /^(\+90|0)?5\d{9}$/;
  const cleanPhone = phone.replace(/\s/g, '');
  return phoneRegex.test(cleanPhone);
}

// Price validation
export function isValidPrice(price: number): boolean {
  return price > 0 && price < 1000000 && Number.isFinite(price);
}

// Quantity validation
export function isValidQuantity(quantity: number, maxStock?: number): boolean {
  if (!Number.isInteger(quantity) || quantity < 1) return false;
  if (maxStock !== undefined && quantity > maxStock) return false;
  return true;
}

// Sanitize HTML to prevent XSS
export function sanitizeHtml(html: string): string {
  const temp = document.createElement('div');
  temp.textContent = html;
  return temp.innerHTML;
}

// Sanitize user input
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and >
    .substring(0, 1000); // Limit length
}

// Validate Turkish ID number (TC Kimlik No)
export function isValidTurkishId(id: string): boolean {
  if (!/^\d{11}$/.test(id)) return false;
  
  const digits = id.split('').map(Number);
  
  // First digit cannot be 0
  if (digits[0] === 0) return false;
  
  // Check 10th digit
  const sum1 = (digits[0] + digits[2] + digits[4] + digits[6] + digits[8]) * 7;
  const sum2 = digits[1] + digits[3] + digits[5] + digits[7];
  const digit10 = (sum1 - sum2) % 10;
  
  if (digits[9] !== digit10) return false;
  
  // Check 11th digit
  const sum3 = digits.slice(0, 10).reduce((a, b) => a + b, 0);
  const digit11 = sum3 % 10;
  
  return digits[10] === digit11;
}

// Validate IBAN (Turkish)
export function isValidIban(iban: string): boolean {
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();
  
  // Turkish IBAN: TR + 2 check digits + 5 digits + 1 digit + 16 alphanumeric
  const ibanRegex = /^TR\d{24}$/;
  
  return ibanRegex.test(cleanIban);
}

// Validate credit card number (Luhn algorithm)
export function isValidCreditCard(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  if (!/^\d{13,19}$/.test(cleaned)) return false;
  
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

// Validate CVV
export function isValidCvv(cvv: string): boolean {
  return /^\d{3,4}$/.test(cvv);
}

// Validate expiry date (MM/YY)
export function isValidExpiryDate(expiry: string): boolean {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;
  
  const month = parseInt(match[1], 10);
  const year = parseInt(match[2], 10) + 2000;
  
  if (month < 1 || month > 12) return false;
  
  const now = new Date();
  const expiryDate = new Date(year, month - 1);
  
  return expiryDate > now;
}

// Validate postal code (Turkish)
export function isValidPostalCode(code: string): boolean {
  return /^\d{5}$/.test(code);
}

// Rate limiting helper (client-side)
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 60000 // 1 minute
  ) {}
  
  canAttempt(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    
    return true;
  }
  
  reset(key: string): void {
    this.attempts.delete(key);
  }
}

// Form validation helper
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateCheckoutForm(data: {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postalCode: string;
}): ValidationResult {
  const errors: Record<string, string> = {};
  
  if (!data.fullName || data.fullName.length < 3) {
    errors.fullName = 'Ad Soyad en az 3 karakter olmalıdır';
  }
  
  if (!isValidEmail(data.email)) {
    errors.email = 'Geçerli bir e-posta adresi giriniz';
  }
  
  if (!isValidPhone(data.phone)) {
    errors.phone = 'Geçerli bir telefon numarası giriniz (örn: 0555 123 45 67)';
  }
  
  if (!data.address || data.address.length < 10) {
    errors.address = 'Adres en az 10 karakter olmalıdır';
  }
  
  if (!data.city || data.city.length < 2) {
    errors.city = 'Şehir seçiniz';
  }
  
  if (!data.district || data.district.length < 2) {
    errors.district = 'İlçe seçiniz';
  }
  
  if (!isValidPostalCode(data.postalCode)) {
    errors.postalCode = 'Geçerli bir posta kodu giriniz (5 haneli)';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
