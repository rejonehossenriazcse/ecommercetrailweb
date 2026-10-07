'use client';

// Client-side and server-side tracking dispatcher with deduplication
export type TrackingEventName =
  | 'PageView'
  | 'ViewContent'
  | 'Search'
  | 'ViewCategory'
  | 'AddToCart'
  | 'RemoveFromCart'
  | 'AddToWishlist'
  | 'InitiateCheckout'
  | 'AddPaymentInfo'
  | 'Purchase'
  | 'Lead'
  | 'ApplyCoupon';

export interface TrackingEventData {
  eventId?: string;
  contentName?: string;
  contentId?: string;
  contentType?: string;
  contents?: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  value?: number;
  currency?: string;
  numItems?: number;
  searchQuery?: string;
  category?: string;
  couponCode?: string;
  userEmail?: string;
  userPhone?: string;
}

// Generate unique event ID for Meta Pixel + Conversions API deduplication
export function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Dispatch event across Google Analytics 4, Meta Pixel, TikTok, and Server CAPI
export async function trackEcommerceEvent(
  eventName: TrackingEventName,
  data: TrackingEventData = {}
) {
  if (typeof window === 'undefined') return;

  // Check consent preference
  const consent =
    localStorage.getItem('stride_cookie_consent') ||
    localStorage.getItem('aura_cookie_consent');
  if (consent) {
    try {
      const parsed = JSON.parse(consent);
      if (parsed.analytics === false && (eventName === 'PageView' || eventName === 'Search')) {
        return;
      }
      if (parsed.marketing === false && eventName !== 'PageView') {
        return;
      }
    } catch {
      // Continue if unparseable
    }
  }

  const eventId = data.eventId || generateEventId();
  const eventPayload = { ...data, eventId };

  // 1. Google Analytics 4 / Google Tag Manager
  try {
    const dataLayer = (window as any).dataLayer || [];
    dataLayer.push({
      event: eventName,
      ecommerce: {
        currency: eventPayload.currency || 'USD',
        value: eventPayload.value || 0,
        items: eventPayload.contents || [],
      },
      event_id: eventId,
    });
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', eventName, {
        currency: eventPayload.currency || 'USD',
        value: eventPayload.value,
        items: eventPayload.contents,
        event_id: eventId,
      });
    }
  } catch (err) {
    console.debug('[GA4] Event dispatch skipped:', err);
  }

  // 2. Meta Pixel (Client-side)
  try {
    if (typeof (window as any).fbq === 'function') {
      const metaEventMap: Record<TrackingEventName, string> = {
        PageView: 'PageView',
        ViewContent: 'ViewContent',
        Search: 'Search',
        ViewCategory: 'ViewContent',
        AddToCart: 'AddToCart',
        RemoveFromCart: 'Custom',
        AddToWishlist: 'AddToWishlist',
        InitiateCheckout: 'InitiateCheckout',
        AddPaymentInfo: 'AddPaymentInfo',
        Purchase: 'Purchase',
        Lead: 'Lead',
        ApplyCoupon: 'Custom',
      };

      const fbEvent = metaEventMap[eventName] || 'Custom';
      (window as any).fbq('track', fbEvent, {
        content_name: eventPayload.contentName,
        content_ids: eventPayload.contentId ? [eventPayload.contentId] : undefined,
        content_type: 'product',
        value: eventPayload.value,
        currency: eventPayload.currency || 'USD',
        num_items: eventPayload.numItems,
      }, { eventID: eventId });
    }
  } catch (err) {
    console.debug('[Meta Pixel] Event dispatch skipped:', err);
  }

  // 3. Server-Side Conversions API (CAPI) trigger for deduplicated server attribution
  try {
    fetch('/api/v1/tracking/capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName,
        eventId,
        data: eventPayload,
        clientUserAgent: navigator.userAgent,
        pageUrl: window.location.href,
      }),
    }).catch(() => {});
  } catch {
    // Non-blocking background call
  }
}
