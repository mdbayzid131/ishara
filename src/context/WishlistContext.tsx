'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { Product } from '@/types';
import { useHydrated } from '@/lib/use-hydrated';

const WishlistContext = createContext<{ items: Product[]; toggle: (product: Product) => void }>({ items: [], toggle: () => {} });
const key = 'ishara_saved_products_v1';

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    queueMicrotask(() => {
      try {
        const saved: unknown = JSON.parse(localStorage.getItem(key) || '[]');
        if (Array.isArray(saved)) setItems(saved.filter((item): item is Product => item && typeof item.slug === 'string' && typeof item.title === 'string' && Number.isFinite(item.basePrice) && Array.isArray(item.images) && item.images.every((image: unknown) => typeof image === 'string') && Array.isArray(item.variants)));
      } catch { /* Saving is optional when browser storage is unavailable. */ }
      setReady(true);
    });
  }, []);
  useEffect(() => { if (ready) { try { localStorage.setItem(key, JSON.stringify(items)); } catch {} } }, [items, ready]);
  function toggle(product: Product) { setItems((items) => items.some((item) => item.slug === product.slug) ? items.filter((item) => item.slug !== product.slug) : [...items, product]); }
  return <WishlistContext.Provider value={{ items, toggle }}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  const hydrated = useHydrated();
  return hydrated ? context : { ...context, items: [] };
}
