'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { Category } from '@/types';
import { useHydrated } from '@/lib/use-hydrated';

const initialSettings = {
  storeName: 'Ishara', phone: '+880 1711-223344', supportEmail: 'support@ishara.com.bd',
  insideDhakaFee: 70, outsideDhakaFee: 130, freeShippingThreshold: 3000,
};
const StoreContext = createContext({ settings: initialSettings, categories: [] as Category[] });

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState(initialSettings);
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/admin/settings', { signal: controller.signal }).then((res) => res.json()).then((data) => { if (data.success) setSettings(data.settings); }).catch(() => {});
    fetch('/api/categories', { signal: controller.signal }).then((res) => res.json()).then((data) => { if (data.success) setCategories(data.categories); }).catch(() => {});
    return () => controller.abort();
  }, []);
  return <StoreContext.Provider value={{ settings, categories }}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  const hydrated = useHydrated();
  return hydrated ? context : { settings: initialSettings, categories: [] as Category[] };
}
