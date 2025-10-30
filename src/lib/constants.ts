/**
 * Application-wide constants
 */

// App metadata
export const APP_NAME = 'EgemOutdoor';
export const APP_DESCRIPTION = 'Outdoor, Kamp ve Balık Av Malzemeleri';
export const APP_URL = 'https://egemoutdoor.com';

// Contact information
export const CONTACT_EMAIL = 'info@egemoutdoor.com';
export const CONTACT_PHONE = '0555 123 45 67';
export const CONTACT_ADDRESS = 'İzmir, Türkiye';

// Social media
export const SOCIAL_MEDIA = {
  facebook: 'https://facebook.com/egemoutdoor',
  instagram: 'https://instagram.com/egemoutdoor',
  twitter: 'https://twitter.com/egemoutdoor',
  youtube: 'https://youtube.com/@egemoutdoor',
};

// Business information
export const BUSINESS_INFO = {
  companyName: 'EgemOutdoor',
  taxOffice: 'İzmir Vergi Dairesi',
  taxNumber: '1234567890',
  mersisNo: '0123456789012345',
};

// Payment methods
export const PAYMENT_METHODS = {
  BANK_TRANSFER: 'bank_transfer',
  CASH_ON_DELIVERY: 'cash_on_delivery',
  CREDIT_CARD: 'credit_card',
} as const;

// Order statuses
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Beklemede',
  processing: 'Hazırlanıyor',
  shipped: 'Kargoda',
  delivered: 'Teslim Edildi',
  cancelled: 'İptal Edildi',
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

// Shipping
export const SHIPPING_INFO = {
  freeShippingThreshold: 500, // TL
  standardShippingCost: 29.90, // TL
  estimatedDeliveryDays: '2-3 iş günü',
};

// Pagination
export const ITEMS_PER_PAGE = 12;
export const ADMIN_ITEMS_PER_PAGE = 20;

// File upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Cache durations (in milliseconds)
export const CACHE_DURATION = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 30 * 60 * 1000, // 30 minutes
  LONG: 24 * 60 * 60 * 1000, // 24 hours
};

// Rate limiting
export const RATE_LIMITS = {
  LOGIN_ATTEMPTS: 5,
  LOGIN_WINDOW: 15 * 60 * 1000, // 15 minutes
  SEARCH_REQUESTS: 10,
  SEARCH_WINDOW: 60 * 1000, // 1 minute
};

// Product sizes
export const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as const;
export const SHOE_SIZES = [
  '39', '39.5', '40', '40.5', '41', '41.5', 
  '42', '42.5', '43', '43.5', '44', '44.5', 
  '45', '46'
] as const;

// Colors
export const PRODUCT_COLORS = [
  'Siyah', 'Beyaz', 'Mavi', 'Lacivert', 'Kırmızı',
  'Yeşil', 'Sarı', 'Turuncu', 'Mor', 'Pembe',
  'Gri', 'Antrasit', 'Bej', 'Kahverengi', 'Bordo'
] as const;

// Currency
export const CURRENCY = 'TRY';
export const CURRENCY_SYMBOL = '₺';

// Date formats
export const DATE_FORMAT = 'dd.MM.yyyy';
export const DATETIME_FORMAT = 'dd.MM.yyyy HH:mm';

// Regex patterns
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(\+90|0)?5\d{9}$/,
  POSTAL_CODE: /^\d{5}$/,
  TURKISH_ID: /^\d{11}$/,
  IBAN: /^TR\d{24}$/,
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'İnternet bağlantınızı kontrol edin.',
  UNAUTHORIZED: 'Bu işlem için giriş yapmalısınız.',
  FORBIDDEN: 'Bu işlem için yetkiniz yok.',
  NOT_FOUND: 'Aradığınız sayfa bulunamadı.',
  SERVER_ERROR: 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.',
  VALIDATION_ERROR: 'Lütfen formu eksiksiz doldurun.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  ORDER_CREATED: 'Siparişiniz başarıyla oluşturuldu!',
  PRODUCT_ADDED: 'Ürün sepete eklendi.',
  PROFILE_UPDATED: 'Profiliniz güncellendi.',
  PASSWORD_CHANGED: 'Şifreniz değiştirildi.',
  NEWSLETTER_SUBSCRIBED: 'Bültenimize abone oldunuz!',
};

// Local storage keys
export const STORAGE_KEYS = {
  CART: 'egemoutdoor_cart',
  FAVORITES: 'egemoutdoor_favorites',
  RECENT_SEARCHES: 'egemoutdoor_recent_searches',
  THEME: 'egemoutdoor_theme',
  AUTH_TOKEN: 'egemoutdoor_auth_token',
};

// Product badges
export const PRODUCT_BADGES = {
  POPULAR: 'popular',
  BESTSELLER: 'bestseller',
  NEW: 'new',
  DISCOUNT: 'discount',
  FEATURED: 'featured',
} as const;

export const BADGE_LABELS: Record<string, string> = {
  popular: 'Popüler',
  bestseller: 'Çok Satan',
  new: 'Yeni',
  discount: 'İndirimli',
  featured: 'Öne Çıkan',
};

export const BADGE_COLORS: Record<string, string> = {
  popular: 'bg-purple-500 text-white',
  bestseller: 'bg-orange-500 text-white',
  new: 'bg-green-500 text-white',
  discount: 'bg-red-500 text-white',
  featured: 'bg-blue-500 text-white',
};

// Feature flags
export const FEATURES = {
  CREDIT_CARD_PAYMENT: false, // Kredi kartı entegrasyonu hazır değil
  PRODUCT_REVIEWS: false, // Yorum sistemi henüz yok
  WISHLIST: true,
  NEWSLETTER: true,
  BLOG: true,
  LIVE_CHAT: false,
};

// API endpoints (if using external APIs)
export const API_ENDPOINTS = {
  IYZICO: 'https://api.iyzipay.com',
  CARGO_TRACKING: 'https://api.cargo.com',
  // Add more as needed
};

// SEO
export const DEFAULT_META = {
  title: `${APP_NAME} - ${APP_DESCRIPTION}`,
  description: 'Outdoor giyim, kamp malzemeleri, balık av ekipmanları ve daha fazlası. Kaliteli ürünler, uygun fiyatlar, hızlı kargo.',
  keywords: 'outdoor, kamp, balık avı, outdoor giyim, kamp malzemeleri',
  image: '/og-image.jpg',
};
