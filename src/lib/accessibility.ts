/**
 * Accessibility (a11y) utilities
 * Web Content Accessibility Guidelines (WCAG) 2.1 AA compliance helpers
 */

/**
 * Generate accessible label for screen readers
 */
export function getAriaLabel(context: string, item?: string): string {
  if (item) {
    return `${context}: ${item}`;
  }
  return context;
}

/**
 * Format price for screen readers
 */
export function formatPriceForScreenReader(price: number): string {
  return `${price.toFixed(2)} Türk Lirası`;
}

/**
 * Generate product image alt text
 */
export function getProductImageAlt(productName: string, variant?: string): string {
  if (variant) {
    return `${productName} - ${variant} ürün görseli`;
  }
  return `${productName} ürün görseli`;
}

/**
 * Generate category image alt text
 */
export function getCategoryImageAlt(categoryName: string): string {
  return `${categoryName} kategorisi`;
}

/**
 * Generate brand logo alt text
 */
export function getBrandLogoAlt(brandName: string): string {
  return `${brandName} markası logosu`;
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Focus trap for modals and dialogs
 */
export class FocusTrap {
  private container: HTMLElement;
  private previousFocus: HTMLElement | null = null;
  private focusableElements: HTMLElement[] = [];

  constructor(container: HTMLElement) {
    this.container = container;
  }

  activate(): void {
    this.previousFocus = document.activeElement as HTMLElement;
    this.updateFocusableElements();
    
    if (this.focusableElements.length > 0) {
      this.focusableElements[0].focus();
    }

    this.container.addEventListener('keydown', this.handleKeyDown);
  }

  deactivate(): void {
    this.container.removeEventListener('keydown', this.handleKeyDown);
    
    if (this.previousFocus) {
      this.previousFocus.focus();
    }
  }

  private updateFocusableElements(): void {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    this.focusableElements = Array.from(
      this.container.querySelectorAll<HTMLElement>(focusableSelectors)
    );
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key !== 'Tab') return;

    const firstElement = this.focusableElements[0];
    const lastElement = this.focusableElements[this.focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  };
}

/**
 * Check if element is visible to screen readers
 */
export function isVisibleToScreenReader(element: HTMLElement): boolean {
  return (
    element.getAttribute('aria-hidden') !== 'true' &&
    !element.hasAttribute('hidden') &&
    element.style.display !== 'none' &&
    element.style.visibility !== 'hidden'
  );
}

/**
 * Generate skip link for keyboard navigation
 */
export function createSkipLink(targetId: string, label: string = 'Ana içeriğe git'): HTMLAnchorElement {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded';
  skipLink.textContent = label;
  
  return skipLink;
}

/**
 * Keyboard navigation helper
 */
export function handleArrowNavigation(
  event: KeyboardEvent,
  items: HTMLElement[],
  currentIndex: number,
  onNavigate: (newIndex: number) => void
): void {
  let newIndex = currentIndex;

  switch (event.key) {
    case 'ArrowDown':
    case 'ArrowRight':
      event.preventDefault();
      newIndex = (currentIndex + 1) % items.length;
      break;
    case 'ArrowUp':
    case 'ArrowLeft':
      event.preventDefault();
      newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
      break;
    case 'Home':
      event.preventDefault();
      newIndex = 0;
      break;
    case 'End':
      event.preventDefault();
      newIndex = items.length - 1;
      break;
    default:
      return;
  }

  items[newIndex]?.focus();
  onNavigate(newIndex);
}

/**
 * Color contrast checker (WCAG AA compliance)
 */
export function hasGoodContrast(foreground: string, background: string): boolean {
  // This is a simplified version
  // For production, use a library like 'color-contrast-checker'
  const getLuminance = (hex: string): number => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  
  return ratio >= 4.5; // WCAG AA standard for normal text
}

/**
 * Generate loading announcement
 */
export function announceLoading(isLoading: boolean, context: string = 'İçerik'): void {
  if (isLoading) {
    announceToScreenReader(`${context} yükleniyor`, 'polite');
  } else {
    announceToScreenReader(`${context} yüklendi`, 'polite');
  }
}

/**
 * Generate form error announcement
 */
export function announceFormError(fieldName: string, error: string): void {
  announceToScreenReader(`${fieldName} hatası: ${error}`, 'assertive');
}

/**
 * Generate success announcement
 */
export function announceSuccess(message: string): void {
  announceToScreenReader(message, 'polite');
}
