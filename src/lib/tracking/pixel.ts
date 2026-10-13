'use client';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';

/**
 * Safe helper to trigger standard Meta Pixel conversion events.
 * Logs in development if Pixel ID is not configured.
 */
export function trackPixelEvent(
  eventName: string,
  parameters?: Record<string, unknown>
): void {
  if (typeof window === 'undefined') return;

  if (window.fbq && META_PIXEL_ID) {
    try {
      window.fbq('track', eventName, parameters);
    } catch (e) {
      console.warn('Meta Pixel tracking error:', e);
    }
  } else if (process.env.NODE_ENV === 'development') {
    console.log(`📊 [Meta Pixel Mock Event] "${eventName}":`, parameters);
  }
}

export function trackPixelCustom(
  eventName: string,
  parameters?: Record<string, unknown>
): void {
  if (typeof window === 'undefined') return;

  if (window.fbq && META_PIXEL_ID) {
    try {
      window.fbq('trackCustom', eventName, parameters);
    } catch (e) {
      console.warn('Meta Pixel custom tracking error:', e);
    }
  } else if (process.env.NODE_ENV === 'development') {
    console.log(`📊 [Meta Pixel Custom Mock Event] "${eventName}":`, parameters);
  }
}

export function trackViewContent(product: {
  id?: string;
  slug?: string;
  title: string;
  price: number;
  category?: string;
}) {
  trackPixelEvent('ViewContent', {
    content_name: product.title,
    content_category: product.category || 'Accessories',
    content_ids: [product.slug || product.id || 'ishara-item'],
    content_type: 'product',
    value: product.price,
    currency: 'BDT',
  });
}

export function trackAddToCart(item: {
  title: string;
  sku?: string;
  price: number;
  quantity: number;
}) {
  trackPixelEvent('AddToCart', {
    content_name: item.title,
    content_ids: [item.sku || item.title],
    content_type: 'product',
    value: item.price * item.quantity,
    currency: 'BDT',
  });
}

export function trackInitiateCheckout(itemsCount: number, subtotal: number) {
  trackPixelEvent('InitiateCheckout', {
    num_items: itemsCount,
    value: subtotal,
    currency: 'BDT',
  });
}

export function trackPurchase(order: {
  orderNumber: string;
  totalAmount: number;
  itemsCount: number;
}) {
  trackPixelEvent('Purchase', {
    content_type: 'product',
    content_name: `Order ${order.orderNumber}`,
    value: order.totalAmount,
    currency: 'BDT',
    num_items: order.itemsCount,
  });
}
