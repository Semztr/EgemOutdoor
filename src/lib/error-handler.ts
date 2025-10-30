import { PostgrestError } from '@supabase/supabase-js';
import { toast } from 'sonner';

/**
 * Centralized error handling for the application
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Supabase error handler
export function handleSupabaseError(error: PostgrestError | Error): string {
  if (import.meta.env.DEV) {
    console.error('Supabase Error:', error);
  }

  if ('code' in error) {
    const postgrestError = error as PostgrestError;
    
    switch (postgrestError.code) {
      case '23505': // Unique violation
        return 'Bu kayıt zaten mevcut.';
      case '23503': // Foreign key violation
        return 'İlişkili kayıtlar mevcut, işlem yapılamıyor.';
      case '23502': // Not null violation
        return 'Zorunlu alanlar eksik.';
      case '42501': // Insufficient privilege
        return 'Bu işlem için yetkiniz yok.';
      case 'PGRST116': // No rows found
        return 'Kayıt bulunamadı.';
      case 'PGRST301': // Row level security
        return 'Bu kaynağa erişim izniniz yok.';
      default:
        return postgrestError.message || 'Bir hata oluştu.';
    }
  }

  return error.message || 'Beklenmeyen bir hata oluştu.';
}

// Network error handler
export function handleNetworkError(error: Error): string {
  if (import.meta.env.DEV) {
    console.error('Network Error:', error);
  }

  if (error.message.includes('Failed to fetch')) {
    return 'İnternet bağlantınızı kontrol edin.';
  }

  if (error.message.includes('timeout')) {
    return 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin.';
  }

  return 'Bağlantı hatası oluştu.';
}

// Toast error helper
export function showError(error: unknown, customMessage?: string) {
  let message = customMessage || 'Bir hata oluştu';

  if (error instanceof AppError) {
    message = error.message;
  } else if (error && typeof error === 'object' && 'code' in error) {
    message = handleSupabaseError(error as PostgrestError);
  } else if (error instanceof Error) {
    message = handleNetworkError(error);
  }

  toast.error(message);
}

// Success toast helper
export function showSuccess(message: string) {
  toast.success(message);
}

// Info toast helper
export function showInfo(message: string) {
  toast.info(message);
}

// Warning toast helper
export function showWarning(message: string) {
  toast.warning(message);
}

// Async error wrapper
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  errorMessage?: string
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    showError(error, errorMessage);
    return null;
  }
}

// Form submission error handler
export function handleFormError(error: unknown): Record<string, string> {
  const errors: Record<string, string> = {};

  if (error && typeof error === 'object' && 'code' in error) {
    const postgrestError = error as PostgrestError;
    
    // Map database errors to form fields
    if (postgrestError.code === '23505') {
      if (postgrestError.message.includes('email')) {
        errors.email = 'Bu e-posta adresi zaten kullanılıyor.';
      }
    }
  }

  if (Object.keys(errors).length === 0) {
    errors._general = handleSupabaseError(error as Error);
  }

  return errors;
}

// Retry helper with exponential backoff
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}

// Log error to external service (placeholder)
export function logErrorToService(error: Error, context?: Record<string, unknown>): void {
  // TODO: Integrate with error tracking service (Sentry, LogRocket, etc.)
  if (import.meta.env.DEV) {
    console.error('Error logged:', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    });
  }
  
  // In production, send to error tracking service
  // Example: Sentry.captureException(error, { extra: context });
}
