/**
 * Analytics tracking utilities
 * Supports Google Analytics 4 and custom events
 */

// Google Analytics 4 types
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

// Initialize GA4
export function initGA(measurementId: string) {
  if (typeof window === 'undefined') return;

  // Load GA4 script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: any[]) {
    window.dataLayer?.push(args);
  };
  window.gtag('js', new Date() as any);
  window.gtag('config', measurementId, {
    send_page_view: false, // We'll send manually
  });
}

// Track page view
export function trackPageView(url: string, title?: string) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'page_view', {
    page_path: url,
    page_title: title || document.title,
  });
}

// Track custom event
export function trackEvent(
  eventName: string,
  parameters?: Record<string, any>
) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', eventName, parameters);
}

// E-commerce events

// View item
export function trackViewItem(product: {
  id: string;
  name: string;
  price: number;
  category?: string;
  brand?: string;
}) {
  trackEvent('view_item', {
    currency: 'TRY',
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        item_category: product.category,
        item_brand: product.brand,
      },
    ],
  });
}

// Add to cart
export function trackAddToCart(product: {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  brand?: string;
}) {
  trackEvent('add_to_cart', {
    currency: 'TRY',
    value: product.price * product.quantity,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: product.quantity,
        item_category: product.category,
        item_brand: product.brand,
      },
    ],
  });
}

// Remove from cart
export function trackRemoveFromCart(product: {
  id: string;
  name: string;
  price: number;
  quantity: number;
}) {
  trackEvent('remove_from_cart', {
    currency: 'TRY',
    value: product.price * product.quantity,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: product.quantity,
      },
    ],
  });
}

// Begin checkout
export function trackBeginCheckout(
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>,
  totalValue: number
) {
  trackEvent('begin_checkout', {
    currency: 'TRY',
    value: totalValue,
    items: items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });
}

// Purchase
export function trackPurchase(
  orderId: string,
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    category?: string;
  }>,
  totalValue: number,
  tax?: number,
  shipping?: number
) {
  trackEvent('purchase', {
    transaction_id: orderId,
    currency: 'TRY',
    value: totalValue,
    tax: tax || 0,
    shipping: shipping || 0,
    items: items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
      item_category: item.category,
    })),
  });
}

// Search
export function trackSearch(searchTerm: string) {
  trackEvent('search', {
    search_term: searchTerm,
  });
}

// User engagement
export function trackUserEngagement(
  engagementType: string,
  details?: Record<string, any>
) {
  trackEvent('user_engagement', {
    engagement_type: engagementType,
    ...details,
  });
}

// Newsletter signup
export function trackNewsletterSignup(email: string) {
  trackEvent('newsletter_signup', {
    method: 'email',
  });
}

// Social share
export function trackSocialShare(platform: string, url: string) {
  trackEvent('share', {
    method: platform,
    content_type: 'product',
    item_id: url,
  });
}

// Error tracking
export function trackError(error: Error, context?: string) {
  trackEvent('exception', {
    description: error.message,
    fatal: false,
    context,
  });
}

// Performance tracking
export function trackPerformance(metric: string, value: number) {
  trackEvent('timing_complete', {
    name: metric,
    value: Math.round(value),
  });
}

// Custom dimensions (user properties)
export function setUserProperties(properties: Record<string, any>) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('set', 'user_properties', properties);
}

// Track scroll depth
export function trackScrollDepth() {
  let maxScroll = 0;
  const thresholds = [25, 50, 75, 90, 100];
  const tracked = new Set<number>();

  const handleScroll = () => {
    const scrollPercent = Math.round(
      ((window.scrollY + window.innerHeight) / document.body.scrollHeight) * 100
    );

    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;

      thresholds.forEach((threshold) => {
        if (scrollPercent >= threshold && !tracked.has(threshold)) {
          tracked.add(threshold);
          trackEvent('scroll_depth', {
            percent: threshold,
          });
        }
      });
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  return () => window.removeEventListener('scroll', handleScroll);
}

// Track time on page
export function trackTimeOnPage() {
  const startTime = Date.now();

  return () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    trackEvent('time_on_page', {
      seconds: timeSpent,
    });
  };
}
