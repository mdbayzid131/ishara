'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product, ProductVariant } from '@/types';
import { useHydrated } from '@/lib/use-hydrated';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  buyNow: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  removeFromCart: (sku: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalItems: number;
  subtotal: number;
  isHydrated: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'ishara_cart_items_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    // Restore after hydration, so server and client initially render the same cart.
    queueMicrotask(() => {
      try {
        const saved: unknown = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
        if (Array.isArray(saved)) setItems(saved.filter((item): item is CartItem =>
          item && typeof item.productId === 'string' && typeof item.sku === 'string' &&
          Number.isFinite(item.price) && item.price >= 0 && Number.isInteger(item.quantity) &&
          item.quantity > 0 && Number.isInteger(item.maxStock) && item.maxStock >= item.quantity
        ));
      } catch { /* A blocked or invalid storage entry must not stop shopping. */ }
      setIsHydrated(true);
    });
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to storage', e);
    }
  }, [items, isHydrated]);

  const addToCart = (product: Product, variant?: ProductVariant, quantity = 1) => {
    if (product.hasVariants && !variant) return;
    const sku = variant ? variant.sku : product.slug;
    const price = variant?.price ?? product.basePrice;
    const image = variant?.image || product.images[0] || '';
    const maxStock = variant ? variant.stock : product.totalStock;
    if (maxStock < 1 || !Number.isInteger(quantity) || quantity < 1) return;

    setItems((prev) => {
      const existing = prev.find((item) => item.sku === sku);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, maxStock);
        return prev.map((item) =>
          item.sku === sku ? { ...item, quantity: newQty } : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          variantId: variant?.id,
          productSlug: product.slug,
          title: product.title,
          variantName: variant?.name,
          sku,
          price,
          quantity: Math.min(quantity, maxStock),
          image,
          maxStock,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const buyNow = (product: Product, variant?: ProductVariant, quantity = 1) => {
    addToCart(product, variant, quantity);
    setIsCartOpen(false);
    // navigation to /checkout is handled by caller
  };

  const updateQuantity = (sku: string, quantity: number) => {
    if (!Number.isInteger(quantity)) return;
    if (quantity <= 0) {
      removeFromCart(sku);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.sku === sku) {
          return { ...item, quantity: Math.min(quantity, item.maxStock) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (sku: string) => {
    setItems((prev) => prev.filter((item) => item.sku !== sku));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        buyNow,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItems,
        subtotal,
        isHydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  const hydrated = useHydrated();
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return hydrated ? context : { ...context, items: [], totalItems: 0, subtotal: 0, isCartOpen: false, isHydrated: false };
}
