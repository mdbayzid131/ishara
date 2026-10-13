'use client';

export interface UtmParams {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

const UTM_STORAGE_KEY = 'ishara_utm_attribution';

/**
 * Pure function to extract UTM parameters from any URL string.
 */
export function extractUtmFromUrl(urlString: string): UtmParams | null {
  try {
    const url = new URL(urlString, 'https://ishara.com.bd');
    const params = url.searchParams;
    const utmSource = params.get('utm_source');
    const utmMedium = params.get('utm_medium');
    const utmCampaign = params.get('utm_campaign');
    const utmTerm = params.get('utm_term');
    const utmContent = params.get('utm_content');

    if (utmSource || utmMedium || utmCampaign || utmTerm || utmContent) {
      return {
        utmSource: utmSource || undefined,
        utmMedium: utmMedium || undefined,
        utmCampaign: utmCampaign || undefined,
        utmTerm: utmTerm || undefined,
        utmContent: utmContent || undefined,
      };
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Captures UTM parameters from current window URL search query
 * and stores them in sessionStorage for single-session checkout attribution.
 */
export function captureUtmParams(): UtmParams | null {
  if (typeof window === 'undefined') return null;

  try {
    const extracted = extractUtmFromUrl(window.location.href);
    if (extracted) {
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(extracted));
      return extracted;
    }
  } catch (e) {
    console.error('Failed to capture UTM parameters:', e);
  }

  return getStoredUtmParams();
}

/**
 * Retrieves persisted UTM parameters from sessionStorage.
 */
export function getStoredUtmParams(): UtmParams {
  if (typeof window === 'undefined') return {};

  try {
    const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to read stored UTM parameters:', e);
  }

  return {};
}

/**
 * Clears stored UTM parameters after order is successfully placed.
 */
export function clearStoredUtmParams(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(UTM_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear stored UTM parameters:', e);
  }
}
