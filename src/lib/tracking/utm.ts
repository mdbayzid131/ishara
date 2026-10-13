'use client';

export interface UtmParams {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

const UTM_STORAGE_KEY = 'ishara_utm_attribution';

export function captureUtmParams(): UtmParams | null {
  if (typeof window === 'undefined') return null;

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');
    const utmTerm = urlParams.get('utm_term');
    const utmContent = urlParams.get('utm_content');

    if (utmSource || utmMedium || utmCampaign) {
      const captured: UtmParams = {
        utmSource: utmSource || undefined,
        utmMedium: utmMedium || undefined,
        utmCampaign: utmCampaign || undefined,
        utmTerm: utmTerm || undefined,
        utmContent: utmContent || undefined,
      };

      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(captured));
      return captured;
    }
  } catch (e) {
    console.error('Failed to capture UTM parameters:', e);
  }

  return getStoredUtmParams();
}

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

export function clearStoredUtmParams(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(UTM_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear UTM parameters:', e);
  }
}
