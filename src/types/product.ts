/**
 * Product Type Definitions
 * Centralized product types for type safety across the application
 */

export type BadgeType = 'popular' | 'bestseller' | 'new' | 'discount' | 'featured';

export interface Product {
  id: string;
  name: string;
  description: string;
  brand: string;
  price: number;
  original_price?: number | null;
  image_url: string;
  category: string;
  subcategory?: string | null;
  stock_quantity: number;
  is_active: boolean;
  featured?: boolean;
  badge?: BadgeType | null;
  badges?: BadgeType[];
  color_options?: string[];
  extra_images?: string[];
  features?: ProductFeatures;
  created_at: string;
  updated_at: string;
}

export interface ProductFeatures {
  new_arrival?: boolean;
  free_shipping?: boolean;
  on_sale?: boolean;
  limited_stock?: boolean;
  [key: string]: any;
}

export interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  description?: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  badge?: BadgeType | null;
  badges?: BadgeType[];
  inStock?: boolean;
  variant?: 'default' | 'compact' | 'featured';
}

export interface CartProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  brand: string;
  quantity: number;
}

export const BADGE_CONFIG: Record<BadgeType, { label: string; color: string }> = {
  popular: {
    label: 'Popüler',
    color: 'bg-purple-500 text-white'
  },
  bestseller: {
    label: 'Çok Satan',
    color: 'bg-orange-500 text-white'
  },
  new: {
    label: 'Yeni',
    color: 'bg-green-500 text-white'
  },
  discount: {
    label: 'İndirimli',
    color: 'bg-red-500 text-white'
  },
  featured: {
    label: 'Öne Çıkan',
    color: 'bg-blue-500 text-white'
  }
};

/**
 * Type guard to check if a value is a valid BadgeType
 */
export function isBadgeType(value: string): value is BadgeType {
  return ['popular', 'bestseller', 'new', 'discount', 'featured'].includes(value);
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(originalPrice: number, currentPrice: number): number {
  if (!originalPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

/**
 * Check if product has discount
 */
export function hasDiscount(originalPrice?: number | null, currentPrice?: number): boolean {
  return !!originalPrice && !!currentPrice && originalPrice > currentPrice;
}
